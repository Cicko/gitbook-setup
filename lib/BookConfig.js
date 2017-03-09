"use strict"
var path = require('path');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var bookSpecs;

/**
* This class will receive all the information about the book to construct a .config.book file to contains that info
*
**/


class BookConfig {
  static createFile (bookInfo) {
    bookSpecs = bookInfo
    var file = new Tacks(Dir({
      '.config.book.json' : File(bookSpecs)
    }));
    var exportPath = path.join(process.cwd(), "/" , bookSpecs.name);
    file.create(exportPath);
  }
  static getBookConfig() {
    return bookSpecs;
  }
}


module.exports = BookConfig;
