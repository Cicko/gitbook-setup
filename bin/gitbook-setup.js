#! /usr/bin/env node
require('gitbook-api-template.js');
var argv = require('minimist')(process.argv.slice(2));
var Task = require('shell-task');
var fs = require('fs');
//var cli = require('../src');
var templatesPath = require("path").join(__dirname, "../", "templates/");



//saveTemplates(templatesPath);


/*
function saveTemplates (basePath) {
  console.log(basePath + " is the basePath")
  fs.readdirSync(basePath).forEach(function(file) {
    console.log("the file to check is: " + file)
    if (fs.lstatSync(basePath + file).isDirectory()) {
      console.log(file + " is a directory");
      saveTemplates(basePath + "" + file + '/');
    }
    else if (fs.lstatSync(basePath + file).isFile()){
      console.log(file + " is a file");
      require(basePath  + file);
    }
  });
}
*/

if (argv.n) {
  var bookName = argv.n;
  new Task('gitbook init ' + bookName).run(function (err, next) {
    if (err) {
      console.log("Error happen " + err);
    }
    else {
      console.log("Book created!!");
    }
  });


  //cli.deploy.deployTemplate(argv.n);
} else if (argv.g) {
  console.log("Opción -g ha sido utilizada");

  console.log(templatesPath);

  createAPIBook();

  //cli.githubRepo.createRepo(argv.u);
} else {
    console.log("Comandos válidos:");
    console.log("gitbook-setup -n [NOMBRE LIBRO] --> Crea estructura del libro con nombre [NOMBRE LIBRO]");
    console.log("gitbook-setup -g -> Despliega libro en gitbook");
}
