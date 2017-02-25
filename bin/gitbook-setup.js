#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var npm = require('npm');
  var path = require('path');
  const exec = require('child_process').exec;

  const GitbookInquirer = require('./GitbookInquirer.js')
  const BookCreator = require('./BookCreator.js')
  const BookConfig = require('./BookConfig.js')
  const GithubManager = require('./GithubManager.js')

  var help = argv.h != null || argv.help != null;
  var noArgs = process.argv.length == 2;
  var bookCreator;
  var modulesPath;

  if (help || noArgs) {
      console.log("Valid commands:");
      console.log("gitbook-setup -n [BOOK NAME] -t [api | book | faq]  --> Create book by args");
      console.log("gitbook-setup --login=github                        --> Login on github");
      console.log("gitbook-setup -i | --interactive                    --> create book in interactive form");
      console.log("gitbook-setup -h | --help                           --> Show available commands");
  }
  else {
    exec("npm root -g", function (err, out, code) {
      if (err) console.log(err);
      else {
        modulesPath = out.replace(/(\r\n|\n|\r)/gm,""); // remove the line break
      }
    });
    if (argv.login == 'github') {
      var ghManager = new GithubManager();
      ghManager.authenticate();
    }
    else {
      createBook();
    }
  }

  function createBook () {
    GitbookInquirer.ask(function (bookConfig) {
      bookCreator = new BookCreator(bookConfig);
      BookConfig.createFile(bookCreator.getBookConfig());
      console.log(bookConfig.templateName);
      var moduleName = bookConfig.templateName ||  'gitbook-setup-template-' + bookConfig.type;
      npm.load(function(err) {
        npm.commands.install(path.join(npm.globalDir, '..'),[moduleName], function(er, data) {
          if (er) {
            console.log("Error during instalation of the template")
            console.log(er);
          }
          else {
            console.log("Correct instalation!!. Instalation data:");
            console.log(data);
            console.log("Finished installation");
            bookCreator.copyTemplateBookFolder(modulesPath);
          }
        });
        npm.on('log', function(message) {
          // log installation progress
          console.log("Instalation progress: ")
          console.log(message);
        });
      });
    });
  }



})();
