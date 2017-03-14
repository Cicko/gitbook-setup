"use strict"
const exec = require('child_process').exec;
var childProcess = require('child_process');
var fs = require('fs');
var shell = require('shelljs')
var path = require('path')
var Tacks = require('tacks')
var npm = require('npm')
var Dir = Tacks.Dir
var File = Tacks.File

var requires = "var gulp = require('gulp');\nvar gghPages = require('gulp-gh-pages');\nvar ghPages = require('gh-pages')\n\n\n"
var deploy_gh_pages_task = "gulp.task('deploy-gh-pages', [], function() {return gulp.src('./_book/**/*').pipe(gghPages());});"

class GulpfileCreator {
  static createGulpfile (options) {
    var content = requires;
    if (options.deploy.includes('gh-pages')) {
      shell.cd(options.name);
      checkModuleGloballyInstalled ("gulp" , function () {
        exec("npm install gulp-gh-pages gh-pages --save", function (err, out, code) {
          if (err) console.log(err);
          else {
            console.log("Successfully installed gulp-gh-pages and gh-pages modules");
          }
        });
        content += deploy_gh_pages_task;
      });
    }

    var file = new Tacks(Dir({
      'gulpfile.js' : File(content)
    }));
    var exportPath = path.join(process.cwd());
    console.log("Export path for gulpfile: " + exportPath);
    file.create(exportPath);
  }

}

function checkModuleGloballyInstalled (name, callback) {
  var globalNodeModules = childProcess.execSync('npm root -g').toString().trim();
  var packageDir = path.join(globalNodeModules, name);
  if (!fs.existsSync(packageDir)) {
    exec("npm install -g gulp", function (err, out, code) {
      if (err) console.log(err);
      else {
        console.log("Successfully installed gulp globally");
      }
    });
  }
  else {
    console.log("Gulp globally already installed!!");
    callback();
  }
}

module.exports = GulpfileCreator;



/*
gulp.task('deploy-gitbook', [], function() {
  require('simple-git')()
        .add('./txt')
        .commit("Deploying book to gitbook!")
        .push(['-u', 'gitbook', 'master'], function () {
           // done.
        });
});
*/
