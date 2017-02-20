"use strict"
var fs = require('fs');
var path = require('path');
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var templatesPath = path.join(__dirname, "../", "templates/");

/**
* This class creates the whole file system to create a book
**/
class BookCreator {
  constructor (bookConfig) {
    this.bookConfig = bookConfig;
    this.fileSystem = {};
  }

  createBook () {
      loadFileSystem(path.join(templatesPath, this.bookConfig.type, "/"), false);
      setTimeout(function () {
        exportFileSystem();
      }, 1000);
  }

  exportFileSystem () {
    var bookConfig = this.bookConfig;
    this.fileSystem['package.json'] = File({
      author: bookConfig.author || process.env.USER,
      name: bookConfig.name || "NoNameBook",
      version: '0.0.1'
    });
    var template = new Tacks(Dir(this.fileSystem));
    var exportPath = path.join(process.cwd(), "/" , bookConfig.name);
    template.create(exportPath);
  }

  /**
  * This method load the files into the this.fileSystem object
  * - basePath: is the path where it starts to search the wanted folder specified by the variable type
  * - inSubdirectory: is true when is looking inside the subfolders of the template.
  **/
  loadFileSystem (basePath, inSubdirectory) {
    var filesInFolder = {};
    fs.readdirSync(basePath).forEach(function(file) {
      if (fs.lstatSync(basePath + file).isDirectory()) {
        var subDirectoryPath = path.join(basePath, file, '/');
        filesInFolder[file] = loadFileSystem(subDirectoryPath, true);
      }
      else if (fs.lstatSync(basePath + file).isFile()){
        var filePath = basePath + file;
        fs.readFile(filePath, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          if (!inSubdirectory)
            this.fileSystem[file] = File(data);
          else
            filesInFolder[file] = File(data);
        });
      }
    });
    if (!inSubdirectory) // book folder root
      this.fileSystem = filesInFolder;
    else
      return Dir(filesInFolder);
  }
}

module.exports = BookCreator;
