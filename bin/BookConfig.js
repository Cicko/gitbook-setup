"use strict"
var path = require('path');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File


/**
* This class will receive all the information about the book to construct the
*
*
**/


class BookConfig {
  static createFile (bookSpecs) {
    var file = new Tacks(Dir({
      '.config.book' : File(bookSpecs)
    }));
    var exportPath = path.join(process.cwd());//, "/" , bookSpecs.name);
    file.create(exportPath);
  }
}


module.exports = BookConfig;
