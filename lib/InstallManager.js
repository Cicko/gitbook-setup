"use strict"

var exec = require('child_process').exec;
const COLORS = require('./helpers/ShellColors.js')
const Json = require('./helpers/Json.js')
const FileCreator = require('./helpers/FileCreator.js')

var fs = require('fs-extra');
var path = require('path')
var ncp = require('ncp').ncp;
ncp.limit = 16;


class InstallManager {
  static install (callback) {
    if (!fs.existsSync('.git')) {
      console.log(COLORS.ORANGE, "- NO GIT REPOSITORY", COLORS.DEFAULT);
      exec("git init");
      console.log(COLORS.GREEN, "- Created Git Repo....",COLORS.DEFAULT);
    }
    else {
      console.log(COLORS.GREEN, "- Already Git repo.", COLORS.DEFAULT);
    }
    if (fs.existsSync("book.json") && fs.existsSync("package.json"))
      exec("npm install", function (err, out) {
        console.log(COLORS.GREEN,"- All dependencies downloaded",COLORS.DEFAULT);
        var plugins = Json.getFromFile("package.json").dependencies;
        console.log(COLORS.BLUE, "LETS INSTALL PLUGINS", COLORS.DEFAULT);
        plugins.forEach (function (plugin) {
          if (plugin.includes('gitbook-setup-')) {
            var pluginPath = path.join(process.cwd(), "node_modules", plugin, "files")
            if (fs.existsSync(path.join(pluginPath,'book.json'))) {
              // TODO copiar contenido de book.json del template en el del projecto.
            }
            ncp(pluginPath, process.cwd(), function (err) {
              console.log(COLORS.GREEN, "   - Installed plugin " + plugin, COLORS.DEFAULT);
              if (!fs.existsSync("gulptask.js"))
                console.log("this plugin does not contain a gulp task.")
              else
                FileCreator.appendToFile("gulpfile.js", true, "gulptask.js");
            });
          }
        });
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
