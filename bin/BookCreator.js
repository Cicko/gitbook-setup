"use strict"
var fs = require('fs');
var path = require('path');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var templatesPath = path.join(__dirname, "../", "templates/");
var fileSystem = {}
/**
* This class creates the whole file system to create a book
**/
class BookCreator {
  constructor (bookConfig) {
    this.bookConfig = bookConfig;
  }

  createBook () {
      var object = this;
      this.loadFileSystem(path.join(templatesPath, this.bookConfig.type, "/"), false, function () {
        console.log("A exportar")
        object.exportFileSystem();
      });
  }

  exportFileSystem () {
    var bookConfig = this.bookConfig;
    fileSystem['package.json'] = File({
      author: bookConfig.author || process.env.USER,
      name: bookConfig.name || "NoNameBook",
      version: '0.0.1'
    });
    var template = new Tacks(Dir(fileSystem));
    var exportPath = path.join(process.cwd(), "/" , bookConfig.name);
    template.create(exportPath);
  }

  /**
  * This method load the files into the this.fileSystem object
  * - basePath: is the path where it starts to search the wanted folder specified by the variable type
  * - inSubdirectory: is true when is looking inside the subfolders of the template.
  **/
  loadFileSystem (basePath, inSubdirectory, callback) {
    var object = this;
    var filesInFolder = {};
    fs.readdirSync(basePath).forEach(function(file) {
      if (fs.lstatSync(basePath + file).isDirectory()) {
        var subDirectoryPath = path.join(basePath, file, '/');
        filesInFolder[file] = object.loadFileSystem(subDirectoryPath, true);
      }
      else if (fs.lstatSync(basePath + file).isFile()){
        var filePath = basePath + file;
        fs.readFile(filePath, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          if (!inSubdirectory)
            fileSystem[file] = File(data);
          else
            filesInFolder[file] = File(data);
        });
      }
    });
    if (!inSubdirectory) {// book folder root
      fileSystem = filesInFolder;
      console.log("Final file system: ")
      console.log(fileSystem);
      callback();
    }
    else
      return Dir(filesInFolder);
  }
}

module.exports = BookCreator;
