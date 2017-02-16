#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var Task = require('shell-task');
  var fs = require('fs');
  var path = require('path');
  var promise = require('promise');
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
  * - templatesFolderRoot: a boolean parameter that indicates if is looking for the root folder of the wanted type.
  * That means that the first time the method is called the templatesFolderRoot parameter will be true because it
  * will be looking in the templates folder. After that will be false because it will be looking in the
  * subdirectories.
  **/
  function loadTemplates (basePath, templatesFolderRoot, parentFolder) {
    var filesInFolder = {};
    fs.readdirSync(basePath).forEach(function(file) {
      if (fs.lstatSync(basePath + file).isDirectory()) {
        var subDirectoryPath = basePath + "" + file + '/';
        if (type == file) loadTemplates(subDirectoryPath, false, null);
        else if (!templatesFolderRoot) loadTemplates(subDirectoryPath, false, file);
      }
      else if (fs.lstatSync(basePath + file).isFile()){
        var filePath = basePath + file;
        fs.readFile(filePath, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          if (!parentFolder)
            wantedTemplate[file] = File(data);
          filesInFolder[file] = File(data);
        });
      }
    });
    if (parentFolder)
      wantedTemplate[parentFolder] = Dir(filesInFolder);
  }

  function exportTemplate () {
    template = new Tacks(Dir(wantedTemplate));
    var exportPath = path.join(process.cwd(), "/" , bookName);
    template.create(exportPath);
  }

  if (help) {
      console.log("Comandos válidos:");
      console.log("gitbook-setup -n [NOMBRE LIBRO] --> Crea estructura del libro con nombre [NOMBRE LIBRO]");
      console.log("gitbook-setup -g -> Despliega libro en gitbook");
  }
  else {
      loadTemplates(templatesPath, true, null);
      setTimeout(function() {
        exportTemplate();
      }, 1000);
  }


})();
