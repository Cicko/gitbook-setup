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
  const TheHelper = require('../lib/TheHelper.js')


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
        "authors": args.a.split(", ")
      }
      console.log(JSON.stringify(bookConfig,null, '  '));
      createBookByBookConfig(bookConfig);
    }
    else if (args._.includes("file")) {
      ;
    }
    else if (args._.includes("interactive")) {
      GitbookInquirer.ask(function (bookConfig) {
        createBookByBookConfig(bookConfig);
      });
    }
    else {
      GitbookInquirer.ask(function (bookConfig) {
        createBookByBookConfig(bookConfig);
      });
    }
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
        TheHelper.showCreateHelp();
      else if (concrete.includes("deploy"))
        TheHelper.showDeployHelp();
      else
        TheHelper.showGeneralHelp();
  }

  // The execution of the program starts here
  if (argv._.includes("help") || noArgs)
    showHelp(argv._);
  else {
    if (argv._.includes("create"))
      createBook(argv);
    else if (argv._.includes("deploy"));
  }


})();
