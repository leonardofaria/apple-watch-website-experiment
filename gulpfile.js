var gulp = require('gulp'), 
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync'),
    eslint = require('gulp-eslint'),
    gulpFilter = require('gulp-filter'),
    notify = require("gulp-notify")
    sass = require('gulp-ruby-sass')
    sourcemaps = require('gulp-sourcemaps');

var config = {
  sassPath: './resources/sass',
  jsPath: './resources/js',
  publicPath: './public'
};

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: config.publicPath
    },
    notify: false
  });
});

gulp.task('js', function() {
  return gulp.src([
      config.jsPath + '/app.js',
      config.jsPath + '/util.js',
      config.jsPath + '/home.js'
    ])
    // .pipe(uglify())
    .pipe(concat({ path: 'app.js' }))
    .pipe(gulp.dest(config.publicPath));
});

gulp.task('lint', function () {
  return gulp.src(config.jsPath + '/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
});

gulp.task('css', function() { 
  // prevent reading sourcemaps to autoprefix them or make sourcemaps of sourcemaps
  var filter = gulpFilter(['*.css', '!*.map'], { restore: true });

  return gulp.src(config.sassPath + '/style.scss')
    .pipe(sass().on("error", notify.onError(function (error) {
        return "Error: " + error.message;
    })))
    .pipe(filter)
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(filter.restore)
    .pipe(gulp.dest(config.publicPath));
});

 gulp.task('watch', function() {
  gulp.watch(config.publicPath + '/**/*.html', [browserSync.reload]); 
  gulp.watch(config.sassPath + '/**/*.scss', ['css', browserSync.reload]); 
  gulp.watch(config.jsPath + '/**/*.js', ['js', 'lint', browserSync.reload]); 
});

  gulp.task('default', ['server', 'watch']);
