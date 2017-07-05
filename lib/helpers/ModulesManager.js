"use strict"

var fs = require('fs')
var path = require('path')
var childProcess = require('child_process');
const COLORS = require('./ShellColors.js')
var scrape = require('scrape')
var exec = childProcess.exec;


const NPM_PACKAGES_URL_SEARCH = 'https://www.npmjs.com/search?q='

class ModulesManager {

  static checkIfNPMModuleExists (moduleName, callback) {
    var selector = '.css-bkyaq3';
    scrape.request(NPM_PACKAGES_URL_SEARCH + moduleName, function (err, $) {
      if (err) return console.error(err);
      $(selector).each(function (div) {
        if(div.children[1].data >= 1) callback(true);
        else callback(false);
      });
    });
  }


  static checkModuleGloballyInstalled (name, callback) {
    var globalNodeModules = childProcess.execSync('npm root -g').toString().trim();
    var packageDir = path.join(globalNodeModules, name);
    if (!fs.existsSync(packageDir)) {
      exec("npm install -g " + name, function (err, out, code) {
        if (err) console.log(err);
        else {
          console.log(COLORS.GREEN,"Installed " + name + " module globally",COLORS.DEFAULT);
          if (callback) callback();
        }
      });
    }
    else {
      if (callback) callback();
    }
  }

  static getGlobalModulesPath (callback) {
    exec("npm root -g", function (err, out, code) {
      if (err) console.log(err);
      else {
        callback(out.replace(/(\r\n|\n|\r)/gm,"")); // remove the line break
      }
    });
  }
}


module.exports = ModulesManager;
