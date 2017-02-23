#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var npm = require('npm');

  const GitbookInquirer = require('./GitbookInquirer.js')
  const BookCreator = require('./BookCreator.js')
  const BookConfig = require('./BookConfig.js')

  var help = argv.h != null || argv.help != null;
  var noArgs = process.argv.length == 2;
  var bookCreator;

  if (help || noArgs) {
      console.log("Valid commands:");
      console.log("gitbook-setup -n [BOOK NAME] -t [api | book | faq]  --> Create book by args");
      console.log("gitbook-setup --login=github                        --> Login on github");
      console.log("gitbook-setup -i | --interactive                    --> create book in interactive form");
      console.log("gitbook-setup -h | --help                           --> Show available commands");
  }
  else {
    GitbookInquirer.ask(function (bookConfig) {
      bookCreator = new BookCreator(bookConfig);
      BookConfig.createFile(bookCreator.getBookConfig());
      npm.load(function(err) {
        npm.commands.install(['gitbook-setup-template-' + bookConfig.type], function(er, data) {
          if (er)
            console.log(er);
          else {
            //console.log(data);
            console.log("finished installation")
            bookCreator.copyTemplateBookFolder();
          }
        });
        npm.on('log', function(message) {
          // log installation progress
          console.log(message);
        });
      });
    });
  }



})();
