"use strict"
const ModulesManager = require('./helpers/ModulesManager.js')
const exec = require('child_process').exec;
var childProcess = require('child_process');
var fs = require('fs');
var shell = require('shelljs')
var path = require('path')
var Tacks = require('tacks')
var npm = require('npm')
var Dir = Tacks.Dir
var File = Tacks.File

var requires = "var gulp = require('gulp');\nvar gghPages = require('gulp-gh-pages');\nvar ghPages = require('gh-pages')\nvar exec = require('child_process').exec;\n\n\n"
var deploy_gh_pages_task = "gulp.task('deploy-gh-pages', [], function() {return gulp.src('./_book/**/*').pipe(gghPages());});"
var deploy_heroku_task = "gulp.task('deploy-heroku', [], function() {exec('gitbook build',function(){exec('git add _book',function(){exec('git commit -m \"creating book\"')})})})"

var bookName;
var heroku_url;


class GulpfileCreator {
  static createGulpfile (options) {
    bookName = options.name;
    shell.cd(bookName);
    var content = requires;
    if (options.deploys.includes('gh-pages')) {
        deployToGhPages(options);
        content += deploy_gh_pages_task;
    }
    if (options.deploys.includes('heroku')) {
        //deployToHeroku();
      //  content += deploy_heroku_task;
    }

    var file = new Tacks(Dir({
      'gulpfile.js' : File()
    }));
    var exportPath = path.join(process.cwd());
    file.create(exportPath);
  }
}


function deployToGhPages(options) {
  ModulesManager.checkModuleGloballyInstalled ("gulp" , function () {
    exec("npm install gulp-gh-pages gh-pages --save", function (err, out, code) {
      if (err) console.log(err);
      else {
        console.log("Installed gulp-gh-pages locally");
        console.log("Installed gh-pages locally");
      }
    });
  });
}

function deployToHeroku() {
  ModulesManager.checkModuleGloballyInstalled ("heroku" , function () {
    exec("git init");
    exec("heroku apps", function (err, out, code) {
      if (err) console.log(err);
      else {
        if (!out.includes(bookName)) {
          console.log("app " + bookName + " doesn't exist");
          exec("heroku create " + bookName + "-" + process.env.USER , function (err, out, code) {
            console.log("Created app: " + out);
            heroku_url = "https://" + bookName + "-" + process.env.USER + ".herokuapp.com/"
            exec("git remote add heroku " + heroku_url);
          });
        }
      }
    });

  });
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
