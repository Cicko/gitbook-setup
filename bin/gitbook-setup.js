#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var Task = require('shell-task');
  var fs = require('fs-promise');
  var path = require('path');
  var promise = require('promise');
  var templatesPath = path.join(__dirname, "../", "templates/");

  var Tacks = require('tacks')
  var Dir = Tacks.Dir
  var File = Tacks.File

  var templateFiles = {};
  var bookName = argv.n || "NoNameBook";
  var type = argv.t || "book";
  var help = argv.h != null;

  function loadTemplates (basePath) {
    fs.readdirSync(basePath).forEach(function(file) {
      if (fs.lstatSync(basePath + file).isDirectory()) {
        if (type == file) {
          loadTemplates(basePath + "" + file + '/');
        }
      }
      else if (fs.lstatSync(basePath + file).isFile()){
        var filePath = basePath + file;
        fs.readFile(filePath, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          templateFiles[file] = File(data);
        });
      }
    })
  }

  function exportTemplate () {
    template = new Tacks(Dir(templateFiles));
    var exportPath = path.join(process.cwd(), "/" , bookName);
    template.create(exportPath);
  }

  if (help) {
      console.log("Comandos válidos:");
      console.log("gitbook-setup -n [NOMBRE LIBRO] --> Crea estructura del libro con nombre [NOMBRE LIBRO]");
      console.log("gitbook-setup -g -> Despliega libro en gitbook");
  }
  else {
      loadTemplates(templatesPath);
      setTimeout(function() {
        exportTemplate();
      }, 1000);
  }


})();
