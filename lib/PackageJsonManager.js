"use strict"
var Json = require('./helpers/Json.js')
var fs = require('fs-extra');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File


class PackageJsonManager {
  static createPackageJson () {
    var bookConfig = Json.getFromFile('.config.book.json')
    var template = new Tacks(Dir({
      'package.json': File(JSON.stringify({
        author: bookConfig.author || process.env.USER,
        name: bookConfig.name || "NoNameBook",
        version: '0.0.1',
        description: bookConfig.description,
        dependencies: JSON.stringify(Json.getFromFile('dependencies.json'), null, "\t")
      }, null, "\t"))
    }));

    template.create(process.cwd());
    console.log("Created package json");
  }
}


module.exports = PackageJsonManager;
