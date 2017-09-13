"use strict"

var exec = require('child_process').exec
const COLORS = require('./helpers/ShellColors.js')
const Json = require('./helpers/Json.js')
const ModulesManager = require('./helpers/ModulesManager.js')
const FileCreator = require('./helpers/FileCreator.js')

var fs = require('fs-extra')
var path = require('path')
var shell = require('shelljs')
var Promise = require('promise')
var ncp = require('ncp').ncp

var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var Spinner = require('cli-spinner').Spinner

function checkGitRepo() {
  if (!fs.existsSync('.git')) {
    console.log(COLORS.ORANGE, "- NO GIT REPOSITORY", COLORS.DEFAULT)
    exec("git init")
    console.log(COLORS.GREEN, "- Created Git Repo....",COLORS.DEFAULT)
  }
  else {
    console.log(COLORS.GREEN, "- Already Git repo.", COLORS.DEFAULT)
  }
}

function installPlugins (callback) {
  var listaPlugins = Json.getFromFile("package.json").dependencies


  let plugins = new Array()
  var gulpModuleChecked = false

  /*console.log("Plugins are:" )
  console.log(listaPlugins)*/

  for (var i in listaPlugins) {
    plugins.push(i)
  }

  if (plugins.length == 0) {
    var msg = "- This document hasn't dependencies"
    if (callback) {
      console.log(COLORS.BLUE, msg, COLORS.DEFAULT)
      return callback(null, null)
    }
    else return console.log(COLORS.BLUE, msg, COLORS.DEFAULT)
  }

  console.log(COLORS.BLUE, "LETS INSTALL PLUGINS", COLORS.DEFAULT)

  plugins.reduce((acc, val) => {
    return acc.then((_ready) => {
      var spinner = new Spinner('Installing plugin ' + val + '.. %s')
      spinner.start()
      spinner.setSpinnerString('|/-\\')
      if (callback && !process.argv[0].includes("node")) callback(null,'Installing plugin ' + val)
      return new Promise((resolve, _reject) => {
        var plugin = val
        if (plugin.includes('gitbook-setup-')) {
          var pluginPath = path.join(process.cwd(), "node_modules", plugin, "files")
          if (fs.existsSync(path.join(pluginPath,'book.json'))) {
            Json.appendToFile(path.join(pluginPath, 'book.json'), 'book.json')
            // TODO copiar contenido de book.json del template en el del projecto.
          }

          // Insert plugin's dependencies into the main package.json
          var pluginDepPath = path.join(process.cwd(), "node_modules", plugin)
          var pluginDep = Json.getFromFile(path.join(pluginDepPath, "package.json")).dependencies

          var filter = function (name) {
            return !name.includes("book.json")
          }
          ncp(pluginPath, process.cwd(), {filter: filter}, function (err) {
          setTimeout(() => {
            console.log("")
            //console.log(COLORS.GREEN, "   - Installed plugin " + plugin, COLORS.DEFAULT)
            if (!fs.existsSync("gulptask.js")) {
              spinner.stop(false)
              resolve("ok")
            }
            else {
              if (!gulpModuleChecked) {
                ModulesManager.checkModuleGloballyInstalled('gulp')
                gulpModuleChecked = true
              }
              FileCreator.appendToFile("gulpfile.js", true, "gulptask.js", function () {
                fs.unlinkSync("gulptask.js")
                if (fs.existsSync("install.js")) {
                  var installFile = require(path.join(process.cwd(),"install.js"))
                  spinner.stop(false)
                  installFile.install((err, msg) => {
                    if (err) callback(err)
                    else if (msg) {
                      fs.unlinkSync("install.js")
                      callback(null, msg)
                      resolve("ok") // Jump to next plugin
                    }
                    else {
                      resolve("ok") // Jump to next plugin
                    }
                  })
                }
                else {
                  spinner.stop(false)
                  resolve("ok") // Jump to next plugin
                }
              })
            }
          }, 3000)
          })
        }
      })})
    }, Promise.resolve(null)).then (function () {
      callback(null, null)
    })
}

class InstallManager {
  /*
  static installNoPath (callback) {
    checkGitRepo()
    if (!ModulesManager.isModuleGloballyInstalled("gitbook-cli")) {
      callback ("gitbook-cli module is not installed globally")
      console.log(COLORS.YELLOW,"Now execute ",COLORS.GREEN,"$npm install -g gitbook-cli " + COLORS.YELLOW + " (as root) to install it" ,COLORS.DEFAULT)
      return
      //ModulesManager.checkModuleGloballyInstalled('gitbook-cli')
    }
    if (fs.existsSync("book.json") && fs.existsSync("package.json"))
      exec("npm install", function (err, out) {
        if (err) {
          return console.error(err)
        }
        var gitignore = new Tacks(Dir({
          '.gitignore': File("node_modules/")}))
        gitignore.create(process.cwd())
        installPlugins(function(err, message) {
          //console.log("1. MESSAGE " + message)
          if (message) callback(null, message)
          else if (err) callback(err, null)
          else callback(null, null)
        })
      })
    else {
      console.log(COLORS.RED, "THIS IS NOT A GITBOOK-SETUP PROJECT. PLEASE FIRST CREATE A PROJECT AND THEN EXECUTE THIS COMMAND INSIDE IT. EXECUTE ", COLORS.YELLOW, " gitbook-setup install help", COLORS.RED, " TO SEE MORE INFORMATION. ", COLORS.DEFAULT)
    }
  }
  */

  static install (filePath, callback) {
    var initialPath
    if (typeof filePath == 'function' && !callback) {
      initialPath = process.cwd()
      callback = filePath
      filePath = null
    }
    else if (filePath) shell.cd(filePath)

    //console.log("DIR OF THE FILE: " + filePath)
    checkGitRepo()
    if (fs.existsSync("book.json") && fs.existsSync("package.json"))
      exec("npm install", function (err, out) {
        if (err) {
          return console.log(err)
        }
        exec("gitbook install", function (err, out) {
          if (err) return console.log(err)
          else console.log(out)
          var gitignore = new Tacks(Dir({
            '.gitignore': File("node_modules/")}))
            gitignore.create(process.cwd())
            installPlugins(function(err, message) {
              //console.log("1. MESSAGE " + message)
              if (message) callback(null, message)
              else if (err) callback(err, null)
              else {
                if (filePath) shell.cd(initialPath)
                callback(null, " - Finished installation")
              }
            })
        })
      })
    else {
      console.log(COLORS.RED, "THIS IS NOT A GITBOOK-SETUP PROJECT. PLEASE FIRST CREATE A PROJECT AND THEN EXECUTE THIS COMMAND INSIDE IT. EXECUTE ", COLORS.YELLOW, " gitbook-setup install help", COLORS.RED, " TO SEE MORE INFORMATION. ", COLORS.DEFAULT)
    }
  }

}


module.exports = InstallManager
