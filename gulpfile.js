
gulp    = require('gulp')
gghPages = require('gulp-gh-pages')
ghPages = require('gh-pages')
path = require('path')



gulp.task('deploy-gh-pages', [], function() {
  return gulp.src('./_book/**/*')
  .pipe(gghPages());
});

gulp.task('deploy-gitbook', [], function() {
  require('simple-git')()
        .add('./txt')
        .commit("Deploying book to gitbook!")
        .push(['-u', 'gitbook', 'master'], function () {
           // done.
        });
});
