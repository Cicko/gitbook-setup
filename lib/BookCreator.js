"use strict"
const ModulesManager = require('./helpers/ModulesManager.js')
const Json = require('./helpers/Json.js')
const FileCreator = require('./helpers/FileCreator.js')
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
  static copyTemplateBook (callback) {
      var bookConfig = Json.getFromFile('.config.book.json');
      console.log("BOOKCONFIG: ")
      console.log(bookConfig)
      ModulesManager.getGlobalModulesPath((globalPath) => {
        var pathFrom = path.join(globalPath, bookConfig.templateName || 'gitbook-setup-template-' + bookConfig.type);
        var pathTo = path.join(process.cwd(), bookConfig.name);
        fs.copy(pathFrom, process.cwd(), err => {
          if (err) return console.error(err)
          console.log('Book created');
          // Detele the package.json from the module.
          fs.unlink(path.join(process.cwd(),'package.json'), function (err) {
            if (err) console.log(err);
            callback();
          });
        });
      });
  }

  static writeToBookJson (callback) {
    var bookConfig = Json.getFromFile('.config.book.json');
    var bookJson = {};



    bookJson['title'] = bookConfig['name'];
    bookJson['description'] = bookConfig['description'];
    bookJson['author'] = bookConfig['authors'][0];

    FileCreator.create('book.json', bookJson, true, function () {
      callback();
    });

  }
}

module.exports = BookCreator;
