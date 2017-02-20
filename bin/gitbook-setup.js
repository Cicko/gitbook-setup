#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));

  const GitbookInquirer = require('./GitbookInquirer.js')
  const BookConfig = require('./BookConfig.js')
  const BookCreator = require('./BookCreator.js')

  var help = argv.h != null || argv.help != null;
  var noArgs = process.argv.length == 2;

  if (help || noArgs) {
      console.log("Valid commands:");
      console.log("gitbook-setup -n [BOOK NAME] -t [api | book | faq]  --> Create book by args");
      console.log("gitbook-setup --login=github                        --> Login on github");
      console.log("gitbook-setup -i | --interactive                    --> create book in interactive form");
      console.log("gitbook-setup -h | --help                           --> Show available commands");
  }
  else {
    GitbookInquirer.ask(function (bookConfig) {
      var creator = new BookCreator(bookConfig);
      creator.createBook();
    });
  }
})();
