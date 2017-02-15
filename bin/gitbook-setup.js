#! /usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var Task = require('shell-task');
var fs = require('fs');
//var cli = require('../src');
var templatesPath = require("path").join(__dirname, "../", "templates/");


var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var apiTemplate;



apiTemplate = new Tacks(Dir({
  'book.json': File(templatesPath + 'api/book.json'),
  'methods.md': File(templatesPath + 'api/methods.md')
}));

saveTemplates(templatesPath);



function saveTemplates (basePath) {
  console.log(basePath + " is the basePath");
  fs.readdirSync(basePath).forEach(function(file) {
    console.log("the file to check is: " + file)
    if (fs.lstatSync(basePath + file).isDirectory()) {
      saveTemplates(basePath + "" + file + '/');
    }
    else if (fs.lstatSync(basePath + file).isFile()){
      var filePath = basePath  + file;
      fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        console.log("Data of " + filePath);
        console.log(data);
      });
    }
  });
}


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

  //apiTemplate.create('templates');

  //cli.githubRepo.createRepo(argv.u);
} else {
    console.log("Comandos válidos:");
    console.log("gitbook-setup -n [NOMBRE LIBRO] --> Crea estructura del libro con nombre [NOMBRE LIBRO]");
    console.log("gitbook-setup -g -> Despliega libro en gitbook");
}
