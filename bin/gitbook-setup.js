#! /usr/bin/node

(function () {
  const GitbookInquirer = require('../lib/GitbookInquirer.js')
  const BookCreator = require('../lib/BookCreator.js')
  const BookConfig = require('../lib/BookConfig.js')
  const GulpfileCreator = require('../lib/GulpfileCreator.js')
  const TheHelper = require('../lib/TheHelper.js')
  const PackageJsonManager = require('../lib/PackageJsonManager.js')
  const COLORS = require('../lib/helpers/ShellColors.js')
  const Json = require('../lib/helpers/Json.js');
  const DependenciesManager = require('../lib/DependenciesManager.js')
  const InstallManager = require('../lib/InstallManager.js')
  const GithubManager = require('../lib/GithubManager.js')
  const AuthorizationManager = require('../lib/AuthorizationManager.js')
  const ModulesManager = require('../lib/helpers/ModulesManager.js')

  const authorizationManager = new AuthorizationManager();
  const ghManager = new GithubManager();

  const Promise = require('promise');
  const exec = require('child_process').exec;
  const argv = require('minimist')(process.argv.slice(2));
  const npm = require('npm');
  const path = require('path');
  const fs = require('fs-extra')
  const Async = require('async');
  const mkdirp = require('mkdirp');
  var scrape = require('scrape');
  const version = require('../package.json').version;
  var logged = false;

  function loginOnGithub (callback) {
    if (fs.existsSync('.config.book.json')) {
        ghManager.authenticate(function () {
          logged = true;
          if (callback) callback();
        });
    }
    else {
      console.log(COLORS.RED, "You have to initialize book first", COLORS.DEFAULT);
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
        "authors": args.a? args.a.split(", ") : new Array(process.env.USER),
        "private": args.o? "yes" : "no",
      }

      if (bookConfig["private"] == "yes")
        bookConfig["organization"] = args.o;



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

  function createBookByBookConfig (bookConfig, callback) {
    var error = false;

    bookConfig.deploys.reduce((acc, plugin) => {
      return acc.then((_ready) => {
        return new Promise((resolve, _reject) => {
          ModulesManager.checkIfNPMModuleExists('gitbook-setup-deploy-' + plugin, function (exists) {
            if (!exists) {
              console.log(COLORS.RED,"Module gitbook-setup-deploy-" + plugin + " does not exist",COLORS.DEFAULT);
              process.exit(0);
            }
            else {
              resolve("ok")
            }
          });
        });
      })
    }, Promise.resolve(null)).then (function () {
      BookConfig.createFile(bookConfig);
      createDependenciesFile(bookConfig, function(err) {
        GulpfileCreator.createGulpfile(bookConfig);
        PackageJsonManager.createPackageJson(function () {
          fs.unlink('../dependencies.json');
          BookCreator.writeToBookJson(function () {
            if (callback) callback(error);
          });
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
    else {
      DependenciesManager.createDependenciesFile(function() {
        callback();
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
    console.log(COLORS.GREEN,"Version of gitbook-setup: ",COLORS.RED, version, COLORS.DEFAULT);
  }


  // EXECUTION STARTS HERE
  if(!fs.existsSync(path.join(process.env.HOME, '.gitbook-setup'))) {
    mkdirp(path.join(process.env.HOME, '.gitbook-setup'), function (err) {
      if (err) console.error(err)
      else console.log(path.join(process.env.HOME, '.gitbook-setup folder created'))
    });
  }

  if (argv._.includes("help") || process.argv.length == 2)
    showHelp(argv._);
  else {
    if (argv._.includes("create"))
      createBook(argv);
    else if (argv._.includes("install"))
      InstallManager.install();
    else if (argv._.includes('build'))
      exec('gitbook build', function (err, out) {
        if (err) console.log(err);
        console.log('_book folder is created')
      });
    else if (argv._.includes("deploy"));
    else if (argv._.includes('authenticate'))
      loginOnGithub();
    else if (argv._.includes('set-remote-repo')) {
      if (logged) {
        ghManager.setRemoteRepo();
      }
      else {
        loginOnGithub(function () {
          ghManager.setRemoteRepo();
        });
      }
    }
    else if (argv._.includes('delete_token'))
      ghManager.deleteTokenAccess();
    else if (argv._.includes('test'))
      ModulesManager.checkModuleGloballyInstalled('ghshell');
    else if (argv._.includes('authorization')) {
      authorizationManager.checkOrg(require(path.join(process.cwd(),'.config.book.json')).organization, function(isAuthorizated) {
        console.log("Is authorizated?: " + isAuthorizated);
      });
    }
    else if (argv._.includes("version") || argv.version || argv.v) {
      showVersion();
    }
  }



  module.exports.create = (info, callback) => {
    createBookByBookConfig(info, function(err) {
      if (err) callback(err);
      else {
        callback(null);
        exec('ls -l', (err, out) => {
          console.log(out);
        });
      }
    });
  }
  module.exports.install = (callback) => {
    InstallManager.install((err) => {
      if (err) {
        console.log("ERROR: " + err);
        callback(err);
        process.exit(-2);
      }
      else {
        callback(null);
      }
    });
  };
  module.exports.build = (callback) => {
    exec('gitbook build', (err, out) => {
      if (err) console.log(err);
      console.log('_book folder is created')
      callback(null);
    });
  }
  module.exports.authenticate = (callback) => {
    ghManager.authenticate((err) => {
      if (!err) callback(null);
      else callback(err);
    });
  }

})();
