"use strict"
const ModulesManager = require('./helpers/ModulesManager.js')
const Json = require('./helpers/Json.js')
var fs = require('fs-extra');
var npm = require('npm');
var path = require('path');
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
    }
}

function createDependenciesFile () {
  var file = new Tacks(Dir({
    'dependencies.json' : File(JSON.stringify(allDependencies, null, "\t"))
  }));
  var exportPath = path.join(process.cwd());
  file.create(exportPath);
}

module.exports = DeployManager;
