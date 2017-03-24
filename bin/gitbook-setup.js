#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var npm = require('npm');
  var path = require('path');
  const exec = require('child_process').exec;
  var Promise = require('promise');

  const GitbookInquirer = require('../lib/GitbookInquirer.js')
  const BookCreator = require('../lib/BookCreator.js')
  const BookConfig = require('../lib/BookConfig.js')
  const GithubManager = require('../lib/GithubManager.js')
  const GulpfileCreator = require('../lib/GulpfileCreator.js')

  const GREEN = "\x1b[32m";
  const RED = "\x1b[31m";
  const BLUE = "\x1b[36m";
  const RESET_FONT = "\x1b[0m";



  var help = argv.h || argv.help;
  var noArgs = process.argv.length == 2;
  var numArgs = process.argv.length - 2;

  var bookCreator;
  var modulesPath;
  var ghManager = new GithubManager();

  console.log(argv);

  // The execution of the program starts here
  if (noArgs || help)
    showHelp(argv._);
  else {
    if (argv.i)
      createBook();
  }

  function loginOnGithub () {
    if (bookCreator) {
      ghManager.authenticate(function (token) {
        ghManager.createTokenFile(token);
      });
    }
    else {
      console.log("you have to initialize book first");
    }
  }

  function createBook () {
    GitbookInquirer.ask(function (bookConfig) {
      bookCreator = new BookCreator(bookConfig);
      BookConfig.createFile(bookConfig);
      var moduleName = bookConfig.templateName || 'gitbook-setup-template-' + bookConfig.type;
      npm.load(function(err) {
        npm.commands.install(path.join(npm.globalDir, '..'),[moduleName], function(er, data) {
          if (er) {
            console.log("Error during instalation of the template")
            console.log(er);
          }
          else {
            console.log("Installed ", moduleName);
            bookCreator.copyTemplateBookFolder(() => {
              bookCreator.createPackageJson();
            });
            GulpfileCreator.createGulpfile(bookConfig);
          }
        });
      });
    });
  }


  function showHelp (concrete) {
    if (!concrete) {
      console.log("Valid commands:");
      console.log("gitbook-setup -n [BOOK NAME] -t [api | book | faq | own]  --> Create book by args");
      //console.log("gitbook-setup --login=github                        --> Login on github");
      console.log("gitbook-setup -i | --interactive                    --> create book in interactive form");
      console.log("gitbook-setup -h | --help                           --> Show available commands");
    }
    else {
      if (concrete == "create") {
        console.log("This command allows you to create a book. You have three different options: ");
        console.log();
        console.log("- Passing all configuration as arguments");
        console.log(BLUE,"    $gitbook-setup create --args -n [BOOK NAME] -t [api | book | faq | own:link] -d [heroku | gh-pages | own:link] -a [AUTHOR\\S] -i [DESCRIPTION]");
        console.log(RESET_FONT);
        console.log("Where: ")
        console.log("  -n    ---> The name of the book");
        console.log("  -t    ---> The type of the book. You can use 'own' template and after it will ask you for a link");
        console.log("  -d    ---> Where you want to deploy. You can indicate more at one separating them by commas: -d heroku,gh-pages,own:link.");
        console.log("  -a    ---> Author\\s of the book ");
        console.log("  -i    ---> The description of the book");
        console.log(RED,"       #Example:");
        console.log(GREEN,"       $gitbook-setup create --args -n MyBook -t api -d heroku,own:http://pepsi.cola/ -a 'Casiano Rodriguez Leon, Rudolf Cicko' -i 'beautiful book about c++'");
        console.log(RESET_FONT);
        console.log("- In interactive form");
        console.log(BLUE,"    $gitbook-setup create --interactive");
        console.log(RESET_FONT);
        console.log("- Getting configuration from file (in JSON form)");
        console.log(BLUE,"    $gitbook-setup create --file");
        console.log(RESET_FONT);
      }
      else {
        console.log("Help about other thing");
      }
    }
  }



})();
