const gulp = require('gulp');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const webserver = require('gulp-webserver');
const connect = require('gulp-connect');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const livereload = require('gulp-livereload');
const htmlmin = require('gulp-htmlmin');
const concatCss = require('gulp-concat-css');

const WEBSERVER_FILTER_REGEXP = /\.css$/;

const webserverFilter = (fileName) => WEBSERVER_FILTER_REGEXP.test(fileName)

const options = {
  autoprefixer: 'last 10 version',
  scss: {
    outputStyle: 'compressed'
  },
  clean: {
    read: false,
    allowEmpty: true
  },
  webserver: {
    localOnly: true,
    open: true,
    notify: false,
    open: true,
    cors: true,
    ui: false,
    livereload: {
      enable: true,
      filter: webserverFilter
    }
  }
};

gulp.task('sass', () => {
  return gulp.src('./app/scss/**/*.scss')
    .pipe(sass(options.sass).on('error', sass.logError))
    .pipe(autoprefixer(options.autoprefixer))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./app/assets/css'))
    .pipe(connect.reload())
    .pipe(livereload())
    .pipe(notify({ message: 'SASS task complete.' }));
});

gulp.task('minify', () => {
  return gulp.src('./app/html/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload())
    .pipe(livereload())
    .pipe(notify({ message: 'HTML task complete.' }));
});

gulp.task('vue-compile', function() {
  return gulp.src('./app/vue/**/*.vue')
    .pipe(vueCompiler({
    	newExtension: 'js',
	    babel: {
	      babelrc: false,
	      presets: [
	        ['env', {
	          modules: false,
	          targets: {
	            browsers: [ '> 1%', 'last 2 versions' ]
	          }
	        }],
	        'stage-3'
	      ]
	    }
  	}))
    .pipe(gulp.dest('./app/assets/js'))
    .pipe(notify({ message: 'VUEjs task complete.' }));
});


gulp.task('clean', () => {
  return gulp.src('./build', options.clean)
    .pipe(clean())
    .pipe(notify({ message: 'CLEAN task complete.' }));
})

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('build', gulp.series('clean', 'sass', 'minify'));

gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('./app/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./app/html/**/*.html', gulp.series('minify'));
  gulp.watch('./app/vue/**/*.vue', gulp.series('vue-compile'));
});

gulp.task('webserver', () => {
  return gulp.src('./app')
    .pipe(webserver(options.webserver));
})

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'connect')));