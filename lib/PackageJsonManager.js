"use strict"
var JSON = require('./helpers/Json.js')
var fs = require('fs-extra');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File


class PackageJsonManager {
  static createPackageJson () {
    var bookConfig = JSON.getFromFile('.config.book.json')
    var template = new Tacks(Dir({
      'package.json': File({
        author: bookConfig.author || process.env.USER,
        name: bookConfig.name || "NoNameBook",
        version: '0.0.1',
        description: bookConfig.description,
        deploys: bookConfig.deploys
      })
    }));
    template.create(process.cwd());
    console.log("Created package json");
  }
}


module.exports = PackageJsonManager;
