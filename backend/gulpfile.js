const gulp = require('gulp');

const gulpElm = require('gulp-elm');

gulp.task('elm-init', gulpElm.init);

gulp.task('compileTestElm', ['elm-init'], function(){
  return gulp.src('testElm/TestElm.elm')
    .pipe(gulpElm())
    .pipe(gulp.dest('testElm'));
});

gulp.task('watch', function() {
  gulp.watch('testElm/*.elm', ['compileTestElm']);
});

gulp.task('default', ['compileTestElm', 'watch']);
