#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var npm = require('npm');
  var path = require('path');
  const exec = require('child_process').exec;
  var Promise = require('promise');
  var Async = require('async');

  const GitbookInquirer = require('../lib/GitbookInquirer.js')
  const BookCreator = require('../lib/BookCreator.js')
  const BookConfig = require('../lib/BookConfig.js')
  const GithubManager = require('../lib/GithubManager.js')
  const GulpfileCreator = require('../lib/GulpfileCreator.js')
  const TheHelper = require('../lib/TheHelper.js')
  const DeployManager = require('../lib/DeployManager.js')
  const PackageJsonManager = require('../lib/PackageJsonManager.js')




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
        "type": args.t? (args.t.includes("own")? args.t.substr(0,3) : args.t) : "book",
        "templateName": (args.t && args.t.includes("own"))? args.t.substr(4) : "",
        "deploys": args.d? args.d.split(",") : new Array(),
        "description": args.i || "No Description about " + (args.n || "NoNameBook"),
        "authors": args.a? args.a.split(", ") : new Array(process.env.USER)
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
          Async.series([
            function(callback) {
              GulpfileCreator.createGulpfile(bookConfig)
              console.log("Created gulpfile");
              callback(null, 1);
            },
            function (callback) {
              DeployManager.setup(function () {
                console.log("Setup deployment")
                callback(null, 2);
              })
            },
            function (callback) {
              BookCreator.copyTemplateBook(() => {
                PackageJsonManager.createPackageJson();
                callback(null, 3)
              })
            }
          ]);
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
