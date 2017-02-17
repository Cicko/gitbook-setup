#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var Task = require('shell-task');
  var fs = require('fs');
  var path = require('path');
  var Promise = require('promise');
  var templatesPath = path.join(__dirname, "../", "templates/");

  var Tacks = require('tacks')
  var Dir = Tacks.Dir
  var File = Tacks.File

  var wantedTemplate = {};
  var bookName = argv.n || "NoNameBook";
  var type = argv.t || "book";
  var help = argv.h != null;

  /**
  * This method load the files into the wantedTemplate object
  * - basePath: is the path where it starts to search the wanted folder specified by the variable type
  * - inWantedFolder: a boolean parameter that indicates if is looking for the root folder of the wanted type.
  * That means that the first time the method is called the inWantedFolder parameter will be true because it
  * will be looking in the templates folder. After that will be false because it will be looking in the
  * subdirectories.
  **/
  function loadTemplates (basePath, parentFolder, inSubdirectory) {
    var filesInFolder = {};
    fs.readdirSync(basePath).forEach(function(file) {
      if (fs.lstatSync(basePath + file).isDirectory()) {
        var subDirectoryPath = path.join(basePath, file, '/');
        filesInFolder[file] = loadTemplates(subDirectoryPath, file, true);
      }
      else if (fs.lstatSync(basePath + file).isFile()){
        var filePath = basePath + file;
        fs.readFile(filePath, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          if (!parentFolder)
            wantedTemplate[file] = File(data);
          else
            filesInFolder[file] = File(data);
        });
      }
    });
    if (!inSubdirectory && !parentFolder) // book folder root
      wantedTemplate = filesInFolder;
    else if (inSubdirectory)
      return Dir(filesInFolder);
  }




  function exportTemplate () {
    wantedTemplate['package.json'] = File({
      author: process.env.USER,
      name: bookName,
      version: '0.0.1'
    })
    template = new Tacks(Dir(wantedTemplate));
    var exportPath = path.join(process.cwd(), "/" , bookName);
    template.create(exportPath);
  }

  if (help) {
      console.log("Valid commands:");
      console.log("gitbook-setup -n [BOOK NAME] -t [api | book | faq]");
  }
  else {
    loadTemplates(path.join(templatesPath, type, "/"), null, false);
    setTimeout(function () {
      exportTemplate();
    }, 1000);
  }


})();
