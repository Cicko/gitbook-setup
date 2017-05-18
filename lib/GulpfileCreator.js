"use strict"
const ModulesManager = require('./helpers/ModulesManager.js')
const exec = require('child_process').exec;
var childProcess = require('child_process');
var fs = require('fs');
var shell = require('shelljs')
var path = require('path')
var Tacks = require('tacks')
var npm = require('npm')
var Dir = Tacks.Dir
var File = Tacks.File

class GulpfileCreator {
  static createGulpfile (options) {
    var bookName = options.name;
    shell.cd(bookName);
    var file = new Tacks(Dir({
      'gulpfile.js' : File("")
    }));
    var exportPath = path.join(process.cwd());
    file.create(exportPath);
  }
}


module.exports = GulpfileCreator;
