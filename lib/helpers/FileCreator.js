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
      fs.unlink(name, function (er){
        deleted = true;
      });
    }
    if (deleted) {
      var filedes = new Object;
      filedes[name] = isJson? File(JSON.stringify(content, null, "\t")) : content
      var file = new Tacks(Dir(filedes));
      file.create(path.join(process.cwd()));
      callback();
    }
  }

  static appendToFile (fileName, fromAnotherFile, content, callback) {
    if (fromAnotherFile) { // Content is the fileName from which the content will be get.
      console.log("CONTENT FROM OTHER FILE ", content)
      console.log(fs.readFileSync(content, "utf-8"));
      fs.appendFileSync(fileName, fs.readFileSync(content, "utf-8"));
      callback();
    }
    else {
      fs.appendFileSync(fileName, content);  // Debería funcionar.
      callback();
      // Append just the content to fileName.
    }
  }
}




module.exports = FileCreator;
