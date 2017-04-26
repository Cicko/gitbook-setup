"use strict"
var Tacks = require('tacks')
var path = require('path')
var fs = require('fs-extra')
var Dir = Tacks.Dir
var File = Tacks.File



class FileCreator {
  static create (name, content, isJson, callback) {
    if (fs.existsSync(name)) {
      console.log(process.cwd());
      fs.unlink(name, function (er){
        var filedes = {};
        filedes[name] = isJson? File(JSON.stringify(content, null, "\t")) : content
        var file = new Tacks(Dir(filedes));
        file.create(path.join(process.cwd()));
        callback();
      });
    }
    else {
      var filedes = {};
      filedes[name] = isJson? File(JSON.stringify(content, null, "\t")) : content
      var file = new Tacks(Dir(filedes));
      file.create(path.join(process.cwd()));
      callback();
    }
  }
}




module.exports = FileCreator;
