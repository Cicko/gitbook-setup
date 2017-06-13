"use strict"

var exec = require('child_process').exec;
const COLORS = require('./helpers/ShellColors.js')
const Json = require('./helpers/Json.js')
const FileCreator = require('./helpers/FileCreator.js')

var fs = require('fs-extra');
var path = require('path')
var Promise = require('promise')
var ncp = require('ncp').ncp;



function checkGitRepo() {
  if (!fs.existsSync('.git')) {
    console.log(COLORS.ORANGE, "- NO GIT REPOSITORY", COLORS.DEFAULT);
    exec("git init");
    console.log(COLORS.GREEN, "- Created Git Repo....",COLORS.DEFAULT);
  }
  else {
    console.log(COLORS.GREEN, "- Already Git repo.", COLORS.DEFAULT);
  }
}

function installPlugins () {
  var listaPlugins = Json.getFromFile("package.json").dependencies;
  console.log(COLORS.BLUE, "LETS INSTALL PLUGINS", COLORS.DEFAULT);

  let plugins = listaPlugins;

  plugins.reduce((acc, val) => {
    return acc.then((_ready) => {
      return new Promise((resolve, _reject) => {
        var plugin = val;
        if (plugin.includes('gitbook-setup-')) {
          var pluginPath = path.join(process.cwd(), "node_modules", plugin, "files")
          if (fs.existsSync(path.join(pluginPath,'book.json'))) {
            Json.appendToFile(path.join(pluginPath, 'book.json'), 'book.json');
            // TODO copiar contenido de book.json del template en el del projecto.
          }

          // Insert plugin's dependencies into the main package.json
          var pluginDepPath = path.join(process.cwd(), "node_modules", plugin)
          var pluginDep = Json.getFromFile(path.join(pluginDepPath, "package.json")).dependencies;

          console.log("Dependencies for ", plugin)
          console.log(pluginDep);



            var filter = function (name) {
              return !name.includes("book.json");
            }
            ncp(pluginPath, process.cwd(), {filter: filter}, function (err) {
              console.log(COLORS.GREEN, "   - Installed plugin " + plugin, COLORS.DEFAULT);
              if (!fs.existsSync("gulptask.js")) {
                console.log("This plugin does not contain a gulp task.")
                resolve("ok");
              }
              else {
                FileCreator.appendToFile("gulpfile.js", true, "gulptask.js", function () {
                  fs.unlinkSync("gulptask.js");
                  console.log("removed gulptask from plugin " + plugin);
                  resolve("ok"); /// Y cuando este listo lo indicas
                });
              }
            });
        }
      })})
    }, Promise.resolve(null));
}


class InstallManager {
  static install (callback) {
    checkGitRepo();
    if (fs.existsSync("book.json") && fs.existsSync("package.json"))
      exec("npm install", function (err, out) {
        console.log(COLORS.GREEN,"- All dependencies downloaded",COLORS.DEFAULT);
        installPlugins();
        if (err) {
          return console.error(err);
        }
      });
    else {
      console.log(COLORS.RED, "THIS IS NOT A GITBOOK-SETUP PROJECT. PLEASE FIRST CREATE A PROJECT AND THEN EXECUTE THIS COMMAND INSIDE IT. EXECUTE ", COLORS.YELLOW, " gitbook-setup install help", COLORS.RED, " TO SEE MORE INFORMATION. ", COLORS.DEFAULT);
    }
  }
}


module.exports = InstallManager;
