"use strict"
var path = require('path');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File
var exec = require('child_process').exec



/**
* This class will receive all the information about the book to construct a .config.book file to contains that info
*
**/


class BookConfig {
  static createFile (bookInfo) {
    console.log("Dentro de BookConfig createFile")
    console.log(bookInfo);
    var file = new Tacks(Dir({
      '.config.book.json' : File(JSON.stringify(bookInfo,null,"\t"))
    }));
    file.create(path.join(process.cwd(), "/" , bookInfo.name));
  }
}


module.exports = BookConfig;
