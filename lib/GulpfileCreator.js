"use strict"

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
      npm.load(function(err) {
        console.log("LETS INSTALL GULPFILE DEPENDENCIES");
        npm.commands.install(['gulp'], function(er, data) {
          if (er) {
            console.log("Error during instalation of gulp module ")
            console.log(er);
          }
          else {
            console.log("Finished installation of gulp module");
          }
        });
        npm.commands.install(['gulp-gh-pages'], function(er, data) {
          if (er) {
            console.log("Error during instalation of gulp-gh-pages module")
            console.log(er);
          }
          else {
            console.log("Finished installation of gulp-gh-pages module");
          }
        });
        npm.commands.install(['gh-pages'], function(er, data) {
          if (er) {
            console.log("Error during instalation of gh-pages module")
            console.log(er);
          }
          else {
            console.log("Finished installation of gh-pages module");
          }
        });
        npm.on('log', function(message) {
          // log installation progress
          console.log("Instalation progress: ")
          console.log(message);
        });
      });
      content += deploy_gh_pages_task;
    }

    var file = new Tacks(Dir({
      'gulpfile.js' : File(content)
    }));
    var exportPath = path.join(process.cwd(), "/" , options.name);
    console.log("Export path for gulpfile: " + exportPath);
    file.create(exportPath);
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
