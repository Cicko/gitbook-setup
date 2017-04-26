"use strict"

var exec = require('child_process').exec;
var COLORS = require('./helpers/ShellColors.js')
var fs = require('fs-extra');


class InstallManager {
  static install (callback) {
    if (fs.existsSync("book.json") && fs.existsSync("package.json"))
      exec("npm install", function (err, out) {
        console.log(out);
      });
    else {
      console.log(COLORS.RED, "THIS IS NOT A GITBOOK-SETUP PROJECT. PLEASE FIRST CREATE A PROJECT AND THEN EXECUTE THIS COMMAND INSIDE IT. EXECUTE ", COLORS.YELLOW, " gitbook-setup install help", COLORS.RED, " TO SEE MORE INFORMATION. ", COLORS.DEFAULT);
    }
  }
}


module.exports = InstallManager;
