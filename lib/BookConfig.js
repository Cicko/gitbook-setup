"use strict"
var path = require('path');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File
var exec = require('child_process').exec
var COLORS = require('./helpers/ShellColors.js');



/**
* This class will receive all the information about the book to construct a .config.book file to contains that info
*
**/


class BookConfig {
  static createFile (bookInfo) {
    console.log(COLORS.BLUE, "Details about your book: ",COLORS.DEFAULT);
    console.log(COLORS.GREEN, JSON.stringify(bookInfo, null, "\t"),COLORS.DEFAULT);
    var file = new Tacks(Dir({
      '.config.book.json' : File(JSON.stringify(bookInfo,null,"\t"))
    }));
    file.create(path.join(process.cwd(), "/" , bookInfo.name));
  }
}


module.exports = BookConfig;
