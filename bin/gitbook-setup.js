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


  // FONT COLORS
  const GREEN = "\x1b[32m";
  const RED = "\x1b[31m";
  const BLUE = "\x1b[36m";
  const YELLOW = "\x1b[33m";
  const RESET_FONT = "\x1b[0m";


  var noArgs = process.argv.length == 2;
  var numArgs = process.argv.length - 2;

  var bookCreator;
  var modulesPath;
  var ghManager = new GithubManager();



  // The execution of the program starts here
  if (argv._.includes("help") || noArgs)
    showHelp(argv._);
  else {
    if (argv._.includes("create"))
      createBook(argv);
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

  function createBook (args) {
    if (args._.includes("args")) {
      var bookConfig = {
        "name": args.n || "NoNameBook",
        "type": args.t.includes("own")? args.t.substr(0,3) : args.t || "book",
        "templateName": args.t.includes("own")? args.t.substr(4) : "",
        "deploy": args.d.split(","),
        "description": args.i,
        "authors": args.a
      }
      console.log(JSON.stringify(bookConfig,null, '  '));
    }
    GitbookInquirer.ask(function (bookConfig) {
      createBookByBookConfig(bookConfig);
    });
  }

  function createBookByBookConfig (bookConfig) {
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
  }


  function showHelp (concrete) {
      if (concrete.includes("create"))
        showCreateHelp();
      else if (concrete.includes("deploy"))
        showDeployHelp();
      else
        showGeneralHelp();
  }


  function showCreateHelp () {
    console.log("This command allows you to create a book.");
    console.log("Usage: ");
    console.log(YELLOW,"$gitbook-setup create [interactive (default) | args | [file file_name]] ",RESET_FONT);
    console.log();
    console.log("THREE FORMS FOR CREATION:");
    console.log("- Passing all configuration as arguments");
    console.log(BLUE,"$gitbook-setup create args -n [BOOK NAME] -t [[api -p language]| book | faq | own:link] -d [heroku | gh-pages | own:link] -a [AUTHOR\\S] -i [DESCRIPTION]");
    console.log(RESET_FONT);
    console.log("Where: ")
    console.log("  -n    ---> The name of the book");
    console.log("  -t    ---> The type of the book. If you indicate api then you have to indicate the programming language.You can use 'own' template and after it will ask you for a link");
    console.log("  -d    ---> Where you want to deploy. You can indicate more at one separating them by commas: -d heroku,gh-pages,own:link.");
    console.log("  -a    ---> Author\\s of the book ");
    console.log("  -i    ---> The description of the book");
    console.log(RED,"#Examples:");
    console.log(GREEN,"$gitbook-setup create args -n MyBook -t api -p C++ -d heroku,own:http://pepsi.cola/ -a 'Casiano Rodriguez Leon, Rudolf Cicko' -i 'beautiful book about c++'");
    console.log(GREEN,"$gitbook-setup create args -n MySecondBook -t book  -d gh-pages -a 'Rudolf Cicko' -i 'beautiful book about nothing'");
    console.log(RESET_FONT);
    console.log(RESET_FONT);
    console.log("- In interactive form (this is the default form when you just call $gitbook-setup create)");
    console.log(BLUE,"$gitbook-setup create interactive");
    console.log(RESET_FONT, "Or just:")
    console.log(BLUE,"$gitbook-setup create ");
    console.log(RESET_FONT);
    console.log("- Getting configuration from file (in JSON form)");
    console.log(BLUE,"$gitbook-setup create file <file_name>");
    console.log(RESET_FONT);
  }

  function showDeployHelp() {
      ;
  }

  function showGeneralHelp() {
    console.log("Welcome to gitbook-setup. This program allow you to create book easily and also allows you to easily perform a deployment.");
    console.log("USAGE:");
    console.log(YELLOW," $gitbook-setup COMMAND [help]", RESET_FONT);
    console.log();
    console.log(BLUE,"$gitbook-setup create [help]",RED,"       --> ", GREEN,"Create book. There are three options. [help] give you more detailed information about the command.", RESET_FONT);
    console.log(BLUE,"$gitbook-setup deploy [help]",RED,"       --> ", GREEN,"Deploy to somewhere. [help] give you more detailed information about the command.",RESET_FONT);
    console.log(BLUE,"$gitbook-setup help",RED,"         --> ", GREEN,"Show help",RESET_FONT);
    console.log();
  }



})();
