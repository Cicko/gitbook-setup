"use strict"

var fs = require('fs')
var path = require('path')
var childProcess = require('child_process');
var exec = childProcess.exec;

class ModulesManager {
  static checkModuleGloballyInstalled (name, callback) {
    var globalNodeModules = childProcess.execSync('npm root -g').toString().trim();
    var packageDir = path.join(globalNodeModules, name);
    if (!fs.existsSync(packageDir)) {
      exec("npm install -g gulp", function (err, out, code) {
        if (err) console.log(err);
        else {
          console.log("Successfully installed " + name + " globally");
          callback();
        }
      });
    }
    else {
      console.log(name + " globally already installed!!");
      callback();
    }
  }
}


module.exports = ModulesManager;
