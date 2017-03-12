"use strict"
const exec = require('child_process').exec;
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
      exec("npm install -g gulp", function (err, out, code) {
        if (err) console.log(err);
        else {
          console.log("Successfully installed gulp globally");
        }
      });
      exec("sudo npm install gulp-gh-pages gh-pages", function (err, out, code) {
        if (err) console.log(err);
        else {
          console.log("Successfully installed gulp-gh-pages and gh-pages locally");
        }
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
