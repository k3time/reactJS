var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var debug = require('gulp-debug');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var sass = require("gulp-sass");
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

// Paths
var paths = {
    base: './',
    app: './app/',
    dist: './app/dist/',
    scss: './app/scss/',
    src: './app/src/',
    vendor: './app/src/vendor/',
    images: './app/images/*',
    css: './app/dist/css/',
    js: './app/dist/js/'
};

paths.out = {
    cssDir: paths.dist + 'css/',
    jsDir: paths.dist + 'js/',
    imagesDir: paths.dist + 'images/',
    fontsDir: paths.dist + 'fonts/'
}

var fs = require('fs');
var createDir = dir => {
    if (!fs.existsSync(dir)) {
        console.log("Create dir:" + dir);
        fs.mkdirSync(dir);
    }
}
createDir(paths.dist);
Object.keys(paths.out).forEach(key => createDir(paths.out[key]));

gulp.task('clean', function () {
    return del(paths.dist + '**/*.*');
});

gulp.task('static:images', function () {
    return gulp.src(paths.images)
        .pipe(debug({ title: 'copy images - files' }))
        .pipe(gulp.dest(paths.out.imagesDir));
});

gulp.task('static:js', function () {
    return gulp.src(paths.vendor + '*.js')
        .pipe(debug({ title: 'copy vendor js - files' }))
        .pipe(gulp.dest(paths.out.jsDir));
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
    })
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('build:sass', function () {
    return gulp.src(paths.scss +'*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.out.cssDir))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('transform', function () {
    return gulp.src(paths.src + '*.jsx')
        .pipe(babel({
            presets: ["react", "es2015"]
        }))
        .pipe(gulp.dest(paths.src));
})

gulp.task('build:js', ['transform'], function () {
    return browserify(paths.src + 'main.js')
        .bundle()
        .on('error', gutil.log)
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest(paths.out.jsDir))
});

// create a task that ensures the `js` task is complete before reloading browsers
gulp.task('js-watch', ['build:js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('static', ['static:images', 'static:js']);
gulp.task('build', ['build:js', 'build:sass']);

gulp.task('publish', function (callback) {
    runSequence(
        'clean',
        'static',
        'build',
        callback);
});

gulp.task('watch', ['build:sass', 'build:js', 'static:images', 'static:js', 'browserSync'], function () {
    gulp.watch(`${paths.src}*.jsx`, ['js-watch']);
    gulp.watch(`${paths.scss}*.scss`, ['build:sass']);
    gulp.watch(`${paths.base}index.html`).on('change', browserSync.reload);
});

gulp.task('default', ['publish']);