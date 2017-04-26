#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  var npm = require('npm');
  var path = require('path');
  const exec = require('child_process').exec;
  var Promise = require('promise');
  var fs = require('fs-extra')
  var Async = require('async');

  const GitbookInquirer = require('../lib/GitbookInquirer.js')
  const BookCreator = require('../lib/BookCreator.js')
  const BookConfig = require('../lib/BookConfig.js')
//  const GithubManager = require('../lib/GithubManager.js')
  const GulpfileCreator = require('../lib/GulpfileCreator.js')
  const TheHelper = require('../lib/TheHelper.js')
  const DeployManager = require('../lib/DeployManager.js')
  const PackageJsonManager = require('../lib/PackageJsonManager.js')
  const COLORS = require('../lib/helpers/ShellColors.js')
  const Json = require('../lib/helpers/Json.js');
  const DependenciesManager = require('../lib/DependenciesManager.js')


  var noArgs = process.argv.length == 2;
  var numArgs = process.argv.length - 2;


  //var ghManager = new GithubManager();
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
      createBookByBookConfig(bookConfig);
    }
    else if (args._.includes("file")) {
      console.log("This option is under construction.");
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
    createDependenciesFile(bookConfig, function() {
      GulpfileCreator.createGulpfile(bookConfig)
      PackageJsonManager.createPackageJson(function () {
        fs.unlink('../dependencies.json');
        BookCreator.writeToBookJson(function () {
          console.log(Json.getFromFile("book.json"));
        });
      });
    });
  }

  // This function fill the dependencies.json file to contain all dependencies for template and deployments that will be pushed to package.json
  function createDependenciesFile (answers, callback) {
    DependenciesManager.addDependency('gitbook-setup-template-' + (answers.templateName || answers.type));
    if (answers.deploys.length > 0) {
      answers.deploys.forEach(function (element, i, array) {
          DependenciesManager.addDependency('gitbook-setup-deploy-' + element);
          if (i == array.length - 1)
            DependenciesManager.createDependenciesFile(function() {
              callback();
            });
      });
    }
  }


  function showHelp (concrete) {
      if (concrete.includes("create"))
        TheHelper.showCreateHelp();
      else if (concrete.includes("deploy"))
        TheHelper.showDeployHelp();
      else if (concrete.includes("install"))
        TheHelper.showInstallHelp();
      else
        TheHelper.showGeneralHelp();
  }

  function showVersion () {
    exec("npm version | grep gitbook-setup", function (err, out, code) {
      console.log(out);
      out = out.match(/([0-9]|\.)+/);
      console.log(COLORS.GREEN,"Version of gitbook-setup: ",COLORS.RED, out[0], COLORS.DEFAULT);
      console.log();
    });
  }


  // Execution starts here

  if (argv._.includes("help") || noArgs)
    showHelp(argv._);
  else {
    if (argv._.includes("create"))
      createBook(argv);
    else if (argv._.includes("deploy"));
    else if (argv._.includes("install")) {
      if (fs.existsSync("book.json") && fs.existsSync("package.json"))
        exec("npm install");
      else {
        console.log(COLORS.RED, "THIS IS NOT A GITBOOK-SETUP PROJECT. PLEASE FIRST CREATE A PROJECT AND THEN EXECUTE THIS COMMAND INSIDE IT. EXECUTE ", COLORS.YELLOW, " gitbook-setup install help", COLORS.RED, " TO SEE MORE INFORMATION. ", COLORS.DEFAULT);
      }
    }
    else if (argv._.includes("version") || argv.version || argv.v) {
      showVersion();
    }
  }
})();
