"use strict"
const ModulesManager = require('./helpers/ModulesManager.js')
const JSON = require('./helpers/Json.js')
var fs = require('fs-extra');
var npm = require('npm');
var path = require('path');
const exec = require('child_process').exec;

/** This class reads the .config.book.json file to setup the other files to allows deployment **/

var bookConfig;

class DeployManager {
  static setup (callback) {
    bookConfig = JSON.getFromFile('.config.book.json');
    var deploys = bookConfig.deploys;

    var counter = 0; // Counter to callback when it have done installation of the last deploy plugin of the array

    npm.load(function(err) {
      deploys.forEach(function (plugin) {
        if (plugin.substr(0,4) != 'own:') {
          installDeployPlugin(plugin, function () {
            console.log("Installed " + plugin + "deployment plugin");
            counter++;
            if (counter == deploys.length) {
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
      console.log("Installed deployment plugin ", plugin);
      exec('gitbook-setup-deploy-'+ plugin)
      ModulesManager.getGlobalModulesPath((globalPath) => {
        var pathFrom = path.join(globalPath, 'gitbook-setup-deploy-' + plugin);
        var pathTo = path.join(process.cwd(), bookConfig.name);
        fs.copy(pathFrom, process.cwd(), err => {
          if (err) return console.error(err)
          console.log('Installed deploy to ' + plugin + ' configuration.');

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

module.exports = DeployManager;
