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
    fs.copy(path.join(modulesPath, 'gitbook-setup-template-' + this.bookConfig.type), path.join(process.cwd(), this.bookConfig.name), err => {
      if (err) return console.error(err)
      console.log('success!');
    });
  }

  createPackageJson () {
    var bookConfig = this.bookConfig;
    var template = new Tacks(Dir({
      'package.json': File({
        author: bookConfig.author || process.env.USER,
        name: bookConfig.name || "NoNameBook",
        version: '0.0.1'
      })
    }));
    var exportPath = path.join(process.cwd(), "/" , bookConfig.name);
    template.create(exportPath);
  }
}

module.exports = BookCreator;
