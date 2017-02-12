#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
//var cli = require('../src');

if (argv.n) {
  console.log("Opcion -n ha sido utilizada");
  //cli.deploy.deployTemplate(argv.n);
} else if (argv.g) {
  console.log("Opción -g ha sido utilizada");
  //cli.githubRepo.createRepo(argv.u);
} else {

    console.log("Comandos válidos:");
    console.log("gitbook-setup -n [NOMBRE LIBRO] --> Crea estructura del libro con nombre [NOMBRE LIBRO]");
    console.log("gitbook-start -g -> Despliega libro en gitbook");
}