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

  // This method checks if a file is a correct configuration file.
  static check (fileContent, callback) {
    console.log("CHECKING FILE: ")
    var f = fileContent;
    console.log(f);
    if (!f.name) callback(COLORS.RED,"ERROR: No name given to the configuration file",COLORS.DEFAULT, null);
    else {
      f.template =  !f.template? "book" : f.template;

      if (f.deploys && typeof f.deploys != 'object')
      f.deploys = f.deploys.split(",");
      else if (!f.deploys) f.deploys = new Array();

      if (!f.description)
      f.description = "No description about " + f.name + ".";

      if (f.authors && typeof f.authors != 'object')
      f.authors = f.authors.split(",");
      else if (!f.authors) f.authors = new Array(process.env.USER);
      callback(null, f);
    }

  }
}


module.exports = BookConfig;
