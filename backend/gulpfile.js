const gulp = require('gulp');

const gulpElm = require('gulp-elm');

gulp.task('elm-init', gulpElm.init);

gulp.task('compileShopify', ['elm-init'], function(){
  return gulp.src('shopify/Shopify.elm')
    .pipe(gulpElm())
    .pipe(gulp.dest('shopify'));
});

gulp.task('compilePrestashop', ['elm-init'], function(){
  return gulp.src('prestashop/Prestashop.elm')
    .pipe(gulpElm())
    .pipe(gulp.dest('prestashop'));
});

gulp.task('watch', function() {
  gulp.watch('shared/*.elm', [ 'compileShopify' ]);
  gulp.watch('shopify/*.elm', [ 'compileShopify' ]);
  gulp.watch('prestashop/*.elm', [ 'compilePrestashop' ]);
});

gulp.task('default', ['compileShopify', 'compilePrestashop', 'watch']);
