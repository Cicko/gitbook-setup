"use strict"
var fs = require('fs-extra');
var path = require('path');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var templatesPath = path.join(__dirname, "../", "templates/");
var fileSystem = {}
/**
* This class creates the whole file system to create a book
**/
class BookCreator {
  constructor (bookConfig) {
    this.bookConfig = bookConfig;
  }

  getBookConfig () {
    return this.bookConfig;
  }

  copyTemplateBookFolder (modulesPath) {
    var pathFrom = path.join(modulesPath, this.bookConfig.templateName || 'gitbook-setup-template-' + this.bookConfig.type);
    var pathTo = path.join(process.cwd(), this.bookConfig.name);
    fs.copy(pathFrom, pathTo, err => {
      if (err) return console.error(err)
      console.log('success on creating the book template!');
      fs.unlink(path.join(pathTo,'package.json'), function (err) {
        if (err) console.log(err);
      });
    });
  }

  createPackageJson () {
    console.log("Lets create the package.json for the book:" + this.bookConfig.name);
    var bookConfig = this.bookConfig;
    var template = new Tacks(Dir({
      'package.json': File({
        author: bookConfig.author || process.env.USER,
        name: bookConfig.name || "NoNameBook",
        version: '0.0.1'
      })
    }));
    var exportPath = path.join(process.cwd(), bookConfig.name);
    template.create(exportPath);
  }
}

module.exports = BookCreator;
