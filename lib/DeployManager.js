"use strict"
const ModulesManager = require('./helpers/ModulesManager.js')
const Json = require('./helpers/Json.js')
const COLORS = require('./helpers/ShellColors.js')
var fs = require('fs-extra');
var npm = require('npm');
var path = require('path');
var $ = require('jquery')
const exec = require('child_process').exec;
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

/** This class reads the .config.book.json file to setup the other files to allows deployment **/

var bookConfig;
var allDependencies = {};

class DeployManager {
  static setup (callback) {
    bookConfig = Json.getFromFile('.config.book.json');
    var deploys = bookConfig.deploys;

    var counter = 0; // Counter to callback when it have done installation of the last deploy plugin of the array

    npm.load(function(err) {
      deploys.forEach(function (plugin) {
        if (plugin.substr(0,4) != 'own:') {
          installDeployPlugin(plugin, function () {
            console.log(COLORS.GREEN,"Installed " + plugin + " deployment plugin",COLORS.DEFAULT);
            counter++;
            if (counter == deploys.length) {
              createDependenciesFile ();
              callback();
            }
          });
        }
        else {
          counter++;
          console.log("Own deploy");
        }
      }, function () {
        console.log("All instalations of deploy plugin done.");
      });
    });
  }
}

function installDeployPlugin (plugin, callback) {
  npm.commands.install(path.join(npm.globalDir, '..'),['gitbook-setup-deploy-' + plugin], function(er, data) {
    if (er) {
      console.log("Error during instalation of plugin " + plugin + "for deployment")
      console.log(er);
    }
    else {
      exec('gitbook-setup-deploy-'+ plugin)
      ModulesManager.getGlobalModulesPath((globalPath) => {
        var pathFrom = path.join(globalPath, 'gitbook-setup-deploy-' + plugin);
        var pathTo = path.join(process.cwd(), bookConfig.name);
        fs.copy(pathFrom, process.cwd(), err => {
          if (err) return console.error(err)
          console.log('Installed deploy to ' + plugin + ' configuration.');
          var newDependencies = Json.getFromFile('package.json').dependencies;

          console.log(COLORS.YELLOW,"Dependencies for deployment " + plugin + ": ", COLORS.BLUE);
          for (var name in newDependencies) {
            console.log(name + " : " + newDependencies[name]);
            allDependencies[name] = newDependencies[name];
          }
          console.log(COLORS.DEFAULT);

          exec("npm install", function (err, out, code) {
            if (!err) {
              exec("node index.js", function (err, out, code) {
                console.log(out);
                fs.unlink(path.join(process.cwd(),'package.json'), function (err) {
                  if (err) console.log(err);
                  callback();
                });
              });
            }
          })
        });
      });
    }
  });
}

function createDependenciesFile () {
  var file = new Tacks(Dir({
    'dependencies.json' : File(JSON.stringify(allDependencies, null, "\t"))
  }));
  var exportPath = path.join(process.cwd());
  file.create(exportPath);
}

module.exports = DeployManager;
