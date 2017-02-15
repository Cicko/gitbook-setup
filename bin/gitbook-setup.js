#! /usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var Task = require('shell-task');
var fs = require('fs');
var path = require('path');
var templatesPath = path.join(__dirname, "../", "templates/");


var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var templateFiles = {};

/*
template = new Tacks(Dir({
  'book.json': File(templatesPath + 'api/book.json'),
  'methods.md': File(templatesPath + 'api/methods.md')
}));
*/

function saveTemplates (basePath, type) {
  console.log(basePath + " is the basePath");
  fs.readdirSync(basePath).forEach(function(file) {
    if (fs.lstatSync(basePath + file).isDirectory()) {
      if (type == file) {
        console.log("the wanted type is: " + type);
        saveTemplates(basePath + "" + file + '/');
      }
    }
    else if (fs.lstatSync(basePath + file).isFile()){
      var filePath = basePath  + file;
      fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        templateFiles[file] = File(data);
      });
    }
  });
}

function createFilesForBook () {
  template = new Tacks(Dir(templateFiles));
  template.create(path.join(__dirname, "/" , bookName));
}

if (argv.n) {
  var bookName = argv.n;
} else if (argv.g) {
  console.log("Opción -g ha sido utilizada");
  saveTemplates(templatesPath, argv.g);
  createFilesForBook();
} else {
    console.log("Comandos válidos:");
    console.log("gitbook-setup -n [NOMBRE LIBRO] --> Crea estructura del libro con nombre [NOMBRE LIBRO]");
    console.log("gitbook-setup -g -> Despliega libro en gitbook");
}
