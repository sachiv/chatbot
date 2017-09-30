
////////////////////////////////
//Setup//
////////////////////////////////

// Plugins
var gulp = require('gulp'),
    pjson = require('./package.json'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    pixrem = require('gulp-pixrem'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;


// Relative paths function
var pathsConfig = function () {
    this.app = "./";
    this.src = "src/";
    this.dist = "dist/";

    return {
        app: this.app,
        templates: this.app,
        src: {
            styles: this.src + 'scss',
            scripts: this.src + 'js',
            images: this.src + 'images'
        },
        srcPath: this.src,
        dist: {
            styles: this.dist + 'css',
            scripts: this.dist + 'js',
            images: this.dist + 'images'
        },
        distPath: this.dist
    }
};

var paths = pathsConfig();

////////////////////////////////
//Tasks//
////////////////////////////////

gulp.task('clean:dist', function () {
    return del.sync(paths.distPath);
});

// Styles autoprefixing and minification
gulp.task('styles', function () {
    return gulp.src(paths.src.styles + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(plumber()) // Checks for errors
        .pipe(autoprefixer({ browsers: ['last 2 versions'] })) // Adds vendor prefixes
        .pipe(pixrem())  // add fallbacks for rem units
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano()) // Minifies the result
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(browserSync.reload({ stream: true }));
});

// Javascript minification
gulp.task('scripts', function () {
    return gulp.src(paths.src.scripts + '/**/*.js')
        .pipe(plumber()) // Checks for errors
        .pipe(uglify()) // Minifies the js
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(browserSync.reload({ stream: true }));
});

// Image compression
gulp.task('imgCompression', function () {
    return gulp.src(paths.src.images + '/*')
        .pipe(imagemin()) // Compresses PNG, JPEG, GIF and SVG images
        .pipe(gulp.dest(paths.dist.images))
});

// Copy Favicon
gulp.task('copy', function () {
    return gulp.src(paths.srcPath + '/libs/**/*')
        .pipe(gulp.dest(paths.distPath));
});

// Browser sync server for live reload
gulp.task('browserSync', function () {
    browserSync.init(
        [paths.templates + '*.html'], {
            server: {
                baseDir: "./"
            }
        });
});

// Watch
gulp.task('watch', function () {

    gulp.watch(paths.sass + '/**/*.scss', ['styles']);
    gulp.watch(paths.js + '/**/*.js', ['scripts']).on("change", reload);
    gulp.watch(paths.images + '/*', ['imgCompression']);
    gulp.watch(paths.templates + '/**/*.html').on("change", reload);

});

// Default task
gulp.task('default', function () {
    runSequence('clean:dist', ['styles', 'scripts', 'imgCompression', 'copy'], ['browserSync', 'watch']);
});
