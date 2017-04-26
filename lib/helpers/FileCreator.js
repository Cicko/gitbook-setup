"use strict"
var Tacks = require('tacks')
var path = require('path')
var fs = require('fs-extra')
var Dir = Tacks.Dir
var File = Tacks.File



class FileCreator {
  // Create a new file with content and checking if we want a json file. If the file exists it will be recreated.
  static create (name, content, isJson, callback) {
    var deleted = !fs.existsSync(name);
    if (!deleted) {
      console.log(process.cwd());
      fs.unlink(name, function (er){
        deleted = true;
      });
    }
    if (deleted) {
      var filedes = {};
      filedes[name] = isJson? File(JSON.stringify(content, null, "\t")) : content
      var file = new Tacks(Dir(filedes));
      file.create(path.join(process.cwd()));
      callback();
    }
  }
}




module.exports = FileCreator;
