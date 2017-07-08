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
    var f = fileContent;
    if (!f.name) callback(COLORS.RED,"ERROR: No name given to the configuration file",COLORS.DEFAULT);
    else {
      f.template =  !f.template? "book" : f.template;
    }



    var bookConfig = {
      "name": args.n || "NoNameBook",
      "template": (args.t)? args.t : "book",
      "deploys": args.d? args.d.split(",") : new Array(),
      "description": args.i || "No Description about " + (args.n || "NoNameBook"),
      "authors": args.a? args.a.split(", ") : new Array(process.env.USER),
      "private": args.o? "yes" : "no",
    }
    if (bookConfig["private"] == "yes")
      bookConfig["organization"] = args.o;
  }
}


module.exports = BookConfig;
