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

  // This function append data to a file. If fromAnotherFile is true then the content is a fileName whice contain the data to append to the fileName.
  static appendToFile (fileName, fromAnotherFile, content, callback) {
      fs.appendFileSync(fileName, (fromAnotherFile? fs.readFileSync(content, "utf-8") : content));
      callback();
  }
}




module.exports = FileCreator;
