var gulp = require('gulp');
var gghPages = require('gulp-gh-pages');
var ghPages = require('gh-pages')
var exec = require('child_process').exec;


gulp.task('deploy-gh-pages', [], function() {return gulp.src('./_book/**/*').pipe(gghPages());});