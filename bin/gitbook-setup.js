#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var Task = require('shell-task');
//var cli = require('../src');
var exampleFile = require('../templates');

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

  console.log(exampleFile);

  //cli.githubRepo.createRepo(argv.u);
} else {
    console.log("Comandos válidos:");
    console.log("gitbook-setup -n [NOMBRE LIBRO] --> Crea estructura del libro con nombre [NOMBRE LIBRO]");
    console.log("gitbook-setup -g -> Despliega libro en gitbook");
}
