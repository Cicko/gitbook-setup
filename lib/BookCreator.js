"use strict"
const ModulesManager = require('./helpers/ModulesManager.js')
var fs = require('fs-extra');
var path = require('path');
var promise = require('promise');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

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

  copyTemplateBookFolder (callback) {
      ModulesManager.getGlobalModulesPath((globalPath) => {
        var pathFrom = path.join(globalPath, this.bookConfig.templateName || 'gitbook-setup-template-' + this.bookConfig.type);
        var pathTo = path.join(process.cwd(), this.bookConfig.name);
        fs.copy(pathFrom, process.cwd(), err => {
          if (err) return console.error(err)
          console.log('Book created');
          fs.unlink(path.join(process.cwd(),'package.json'), function (err) {
            if (err) console.log(err);
            callback();
          });
        });
      });
  }

  createPackageJson () {
    var bookConfig = this.bookConfig;
    var template = new Tacks(Dir({
      'package.json': File({
        author: bookConfig.author || process.env.USER,
        name: bookConfig.name || "NoNameBook",
        version: '0.0.1',
        description: bookConfig.description
      })
    }));
    template.create(process.cwd());
  }
}

module.exports = BookCreator;
