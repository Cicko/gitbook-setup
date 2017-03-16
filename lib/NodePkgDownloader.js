"use strict"
var npm = require('npm');
const exec = require('child_process').exec;
var modulesPath;


class NodePkgDownloader {
  constructor () {
    loadModulesPath();
  }


  downloadPackage (moduleName) {
    npm.load(function(err) {
      npm.commands.install(path.join(npm.globalDir, '..'),[moduleName], function(er, data) {
        if (er) {
          console.log("Error during instalation of the template")
          console.log(er);
        }
        else {
          console.log("Correct instalation!!. Instalation data:");
          console.log(data);
          console.log("Finished installation");
          bookCreator.copyTemplateBookFolder(modulesPath);
        }
      });
    });
  }

  loadModulesPath () {
    exec("npm root -g", function (err, out, code) {
      if (err) console.log(err);
      else {
        modulesPath = out.replace(/(\r\n|\n|\r)/gm,""); // remove the line break
      }
    });
  }
}
