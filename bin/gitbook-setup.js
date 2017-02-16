#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var Task = require('shell-task');
  //var fs = require('fs');
  var fs = require('fs-promise');
  var path = require('path');
  var templatesPath = path.join(__dirname, "../", "templates/");


  var Tacks = require('tacks')
  var Dir = Tacks.Dir
  var File = Tacks.File

  var templateFiles = {};
  var bookName = argv.n || "NoNameBook";
  var type = argv.t || "book";
  var help = argv.h != null;

  /*
  template = new Tacks(Dir({
    'book.json': File(templatesPath + 'api/book.json'),
    'methods.md': File(templatesPath + 'api/methods.md')
  }));
  */

  function saveTemplates (basePath) {
    console.log(basePath + " is the basePath");
    fs.readdirSync(basePath).forEach(function(file) {
      if (fs.lstatSync(basePath + file).isDirectory()) {
        if (type == file) {
          console.log("the wanted type is: " + type);
          saveTemplates(basePath + "" + file + '/');
        }
      }
      else if (fs.lstatSync(basePath + file).isFile()){
        var filePath = basePath + file;
        fs.readFile(filePath, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          console.log(file + "is the filename");
          templateFiles[file] = File(data);
        });
      }
    })
  }

  function createFilesForBook () {
    console.log(JSON.stringify(templateFiles));
    template = new Tacks(Dir(templateFiles));
    console.log("book Name: " + bookName);
    var exportPath = path.join(process.cwd(), "/" , bookName);
    console.log("Export Path: " + exportPath);
    template.create(exportPath);
  }

  saveTemplates(templatesPath);
  setTimeout(function() {
    createFilesForBook(bookName);
  }, 1000);

  if (help) {
      console.log("Comandos válidos:");
      console.log("gitbook-setup -n [NOMBRE LIBRO] --> Crea estructura del libro con nombre [NOMBRE LIBRO]");
      console.log("gitbook-setup -g -> Despliega libro en gitbook");
  }


})();
