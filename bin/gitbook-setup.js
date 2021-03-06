#! /usr/bin/env node

(function () {
  const GitbookInquirer = require('../lib/GitbookInquirer.js')
  const BookCreator = require('../lib/BookCreator.js')
  const BookConfig = require('../lib/BookConfig.js')
  const GulpfileCreator = require('../lib/GulpfileCreator.js')
  const TheHelper = require('../lib/TheHelper.js')
  const PackageJsonManager = require('../lib/PackageJsonManager.js')
  const COLORS = require('../lib/helpers/ShellColors.js')
  const Json = require('../lib/helpers/Json.js')
  const DependenciesManager = require('../lib/DependenciesManager.js')
  const InstallManager = require('../lib/InstallManager.js')
  const GithubManager = require('../lib/GithubManager.js')
  const AuthorizationManager = require('../lib/AuthorizationManager.js')
  const ModulesManager = require('../lib/helpers/ModulesManager.js')
  const StringChecker = require('../lib/helpers/StringChecker.js')
  const FileCreator = require('../lib/helpers/FileCreator.js')

  const authorizationManager = new AuthorizationManager()
  const ghManager = new GithubManager()

  const Promise = require('promise')
  const exec = require('child_process').exec
  const argv = require('minimist')(process.argv.slice(2))
  const npm = require('npm')
  const path = require('path')
  var shell = require('shelljs')
  const fs = require('fs-extra')
  const Async = require('async')
  const mkdirp = require('mkdirp')
  const version = require('../package.json').version
  var scrape = require('scrape')
  var logged = false

  var executedOnModernDoc = process.argv.length == 16


  // START FUNCTIONS
  function loginOnGithub (callback) {
    if (fs.existsSync('.config.book.json')) {
        ghManager.authenticate(function () {
          logged = true
          if (callback) callback()
        })
    }
    else {
      console.log(COLORS.RED, "You have to initialize book first", COLORS.DEFAULT)
    }
  }

  function createBook (args) {
    if (args.n) {
      var bookConfig = {
        "name": args.n || "NoNameBook",
        "template": (args.t)? args.t : "theme-default",
        "deploys": args.d? args.d.split(",") : new Array(),
        "description": args.i || "No Description about " + (args.n || "NoNameBook"),
        "authors": args.a? args.a.split(", ") : new Array(process.env.USER),
        "private": args.o? "yes" : "no",
      }
      if (bookConfig["private"] == "yes")
        bookConfig["organization"] = args.o

     createBookByConfig(bookConfig)
    }
    else if (args.f || args.file || args._.includes("file")) {
      var file
      if (typeof args.file === 'string') file = args.file
      else if (typeof args.f === 'string') file = args.f
      else if (args._[1] == "file" && args._[2])  file = args._[2]
      var fileContent = fs.existsSync(file)? Json.getFromFile(file) : null
      if (fileContent) {
        BookConfig.check(fileContent, function (err, fixedContent) {
          if (err) console.log(err)
          else createBookByConfig(fixedContent)
        })
      }
      else {
        console.log("ERROR: Cannot get the file " + file)
      }
    }
    else if (args._.includes("interactive")) {
      GitbookInquirer.ask(function (bookConfig) {
        createBookByConfig(bookConfig)
      })
    }
    else {
      GitbookInquirer.ask(function (bookConfig) {
        createBookByConfig(bookConfig)
      })
    }
  }

  function createBookByConfig (bookConfig, callback) {

    var error = false
    /*
    ModulesManager.checkIfNPMModuleExists('gitbook-setup-template-' + bookConfig.template, function (exists) {
      if (!exists) {
        var err_str = "ERROR: Template " + bookConfig.template + " does not exist"
        console.log(COLORS.RED, err_str, COLORS.DEFAULT)
        if (callback) callback(err_str)
        process.exit(-1)
      }
    })*/
    bookConfig.deploys.reduce(function (acc, plugin) {
      return acc.then( function(_ready) {
        return new Promise(function (resolve, _reject) {
          if (!plugin.includes("s:")) { // If its server don't check module
            ModulesManager.checkIfNPMModuleExists('gitbook-setup-deploy-' + plugin, function (exists) {
              if (StringChecker.isIPaddress(plugin)) {
                console.log(COLORS.GREEN, plugin + " is correct ip address")
                resolve("ok")
              }
              else if (StringChecker.isURL(plugin)){
                console.log(COLORS.GREEN, plugin + " is correct url address")
                resolve("ok")
              }
              else if (!exists) {
                var err_str = "ERROR: " + plugin + " does not exist or is not valid IP or domain"
                console.log(COLORS.RED, err_str, COLORS.DEFAULT)
                _reject("fail")
                if (callback) callback(err_str)
                process.exit(-2)
              }
              else {
                //console.log(COLORS.GREEN, plugin + " is correct module name")
                resolve("ok")
              }
            })
          }
        })
      })
    }, Promise.resolve(null)).then (function () {
      BookConfig.createFile(bookConfig)
      createDependenciesFile(bookConfig, function(err) {
        GulpfileCreator.createGulpfile(bookConfig)
        PackageJsonManager.createPackageJson(function () {
          fs.unlink('../dependencies.json')
          BookCreator.writeToBookJson(function () {
            if (callback && error) callback(error)
            else {

              FileCreator.create('README.md','',false, () => {if (callback) callback(null)})
              console.log(COLORS.YELLOW,"Now execute ",COLORS.GREEN,"$gitbook-setup install " + COLORS.YELLOW + "inside the " + bookConfig.name + " folder.",COLORS.DEFAULT)
              //shell.cd('..')
            }
          })
        })
      })
    })
  }

  // This function fill the dependencies.json file to contain all dependencies for template and deployments that will be pushed to package.json
  function createDependenciesFile (answers, callback) {
    //DependenciesManager.addDependency('gitbook-setup-template-' + (answers.template || answers.type))
    if (answers.deploys.length > 0) {
      answers.deploys.forEach(function (element, i, array) {
          DependenciesManager.addDependency('gitbook-setup-deploy-' + element)
          if (i == array.length - 1)
            DependenciesManager.createDependenciesFile(function() {
              callback()
            })
      })
    }
    else {
      DependenciesManager.createDependenciesFile(function() {
        callback()
      })
    }
  }

  function checkArgs () {
    if (argv._.includes("help") || argv.h)
      showHelp(argv._)
    else {
      if (argv._.includes("create"))
        createBook(argv)
      else if (argv._.includes("install"))
        InstallManager.install((err, msg) => {
          if (err) console.log("ERR: " + err)
          if (msg) console.log(msg)
        })
      else if (argv._.includes('build'))
        checkModuleGloballyInstalled('gitbook-cli', () => {
          exec('gitbook build', (err, out) => {
            if (err) reject(err)
            else resolve("ok")
          })
        })
      else if (argv._.includes('authenticate'))
        loginOnGithub()
      else if (argv._.includes('set-remote-repo')) {
        if (logged) {
          ghManager.setRemoteRepo()
        }
        else {
          loginOnGithub(function () {
            ghManager.setRemoteRepo()
          })
        }
      }
      else if (argv._.includes('membership')) {
        var config_file = require(path.join(process.cwd(),'.config.book.json'))
        var org = config_file.organization
        ghManager.checkAdminOrg(org, function (isAdmin) {
            if (isAdmin) console.log("IS ADMIN OF " + org)
            else console.log("NOT ADMIN OF " + org)
        })
      }
      else if (argv._.includes('authorization')) {
        authorizationManager.checkOrg(require(path.join(process.cwd(),'.config.book.json')).organization, function(isAuthorizated) {
          console.log("Is authorizated?: " + isAuthorizated)
        })
      }
      else if (argv._.includes("version") || argv.version || argv.v) {
        showVersion()
      }
      //else TheHelper.showGeneralHelp()
    }
  }

  function showHelp (concrete) {
      if (!concrete) TheHelper.showGeneralHelp()
      else if (concrete.includes("create"))
        TheHelper.showCreateHelp()
      else if (concrete.includes("deploy"))
        TheHelper.showDeployHelp()
      else if (concrete.includes("install"))
        TheHelper.showInstallHelp()
      else
        TheHelper.showGeneralHelp()
  }

  function showVersion () {
    console.log(COLORS.GREEN,"Version of gitbook-setup: ",COLORS.RED, version, COLORS.DEFAULT)
  }

  function existsGitbookSetupFolder () {
    return fs.existsSync(path.join(process.env.HOME, '.gitbook-setup'))
  }

  function createGitbookSetupFolder () {
    mkdirp(path.join(process.env.HOME, '.gitbook-setup'), function (err) {
      if (err) console.error(err)
      else console.log(path.join(process.env.HOME, '.gitbook-setup folder created'))
    })
  }
  // END FUNCTIONS


  // EXECUTION STARTS HERE
  if(!existsGitbookSetupFolder())
    createGitbookSetupFolder()

  if (process.argv.length > 2 || argv.v || argv.version) {
    checkArgs()
  }
  else {
    TheHelper.showGeneralHelp()
  }


  // NEW EXPORTS (with promises)

  module.exports.Create = (info) => {
    return new Promise ((resolve, reject) => {
      var oldPath = process.cwd()
      if (info.path) {
        shell.cd(info.path)
        info.parentPath = info.path
        info.path = path.join(info.path, info.name)
      }
      else {
        info.path = path.join(process.cwd(), info.name)
      }

      BookConfig.check(info, (err, fixedContent) => {
        if (err) reject(err)
        else {
          createBookByConfig(fixedContent, (err) => {
            if (err) reject(err)
            else {
              shell.cd(info.path)
              console.log(info.path)
              console.log("Ahora estamos en: " + process.cwd())
              resolve("ok")
            }
          })
        }
      })
    })
  }

  module.exports.Install = () => {
    return new Promise ((resolve, reject) => {
      InstallManager.install((err, message) => {
        if (message == " - Finished installation") resolve(message)
        else if (message)
          console.log(COLORS.GREEN, message, COLORS.DEFAULT)
        else if (err) reject()
      })
    })
  }

  module.exports.Build = () => {
    return new Promise ((resolve, reject) => {
      checkModuleGloballyInstalled('gitbook-cli', () => {
        exec('gitbook build', (err, out) => {
          if (err) reject(err)
          else resolve("ok")
        })
      })
    })
  }

  // END NEW EXPORTS (with promises)

  // EXPORTS
  module.exports.create = (info, callback) => {
    var oldPath = process.cwd()
    if (info.path) {
      console.log("Cambiamos el path")
      shell.cd(info.path)
      info.parentPath = info.path
      info.path = path.join(info.path, info.name)
    }

    BookConfig.check(info, (err, fixedContent) => {
      if (err) console.log(err)
      else {
        createBookByConfig(fixedContent, function(err) {
          if (err) callback(err)
          else {
            callback(null, fixedContent)
            shell.cd(oldPath)
            console.log("Actual path: " + process.cwd())
          }
        })
      }
    })
  }


  module.exports.checkDeploy = (name, callback) => {
    ModulesManager.checkIfNPMModuleExists(name, function (exists) {
      if (StringChecker.isIPaddress(plugin))
        callback(null)
      else if (StringChecker.isURL(plugin))
        callback(null)
      else if (exists)
        callback(null)
      else
        callback("ERROR: " + plugin + " does not exist or is not valid IP or domain")
    })
  }

  module.exports.install = (path, callback) => {
    if (!callback && typeof path === 'function') callback = path
    InstallManager.install(path, (err, message) => {
      if (message == "done") callback(null,null)
      else if (message)
        callback(null, message)
      else if (err) callback(err, null)
    })
  }
/*
  module.exports.build = (callback) => {
    exec('gitbook build', (err, out) => {
      if (err) callback(err)
      callback(null)
    })
  }*/
  module.exports.authenticate = (callback) => {
    ghManager.authenticate((err) => {
      if (err) callback(err)
      else callback(null)
    })
  }
  module.exports.haveAuthorization = (callback) => {
    authorizationManager.checkOrg(require(path.join(process.cwd(),'.config.book.json')).organization, function(isAuthorizated) {
      callback(isAuthorizated)
    })
  }
  module.exports.isAdminofOrg = (org, callback) => {
    ghManager.checkAdminOrg(org, (isAdmin) => {
        callback(isAdmin)
    })
  }
  module.exports.version = () => {
    return version
  }

})()
