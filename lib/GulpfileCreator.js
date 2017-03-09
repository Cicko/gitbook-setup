"use strict"

var path = require('path')
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var requires = "var gulp = require('gulp');\n var gghPages = require('gulp-gh-pages');\n var ghPages = require('gh-pages')\n\n\n"
var deploy_gh_pages_task = "gulp.task('deploy-gh-pages', [], function() {return gulp.src('./_book/**/*').pipe(gghPages());});"

class GulpfileCreator {
  static createGulpfile (options) {
    var content = "";

    if (options["gh-pages"]) content += deploy_gh_pages_task;
    if (options[""])

    var file = new Tacks(Dir({
      'gulpfile.js' : File(content)
    }));
    var exportPath = path.join(process.cwd(), "/" , options.bookName);
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
