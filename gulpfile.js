const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const clean = require('gulp-clean');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();


function buildCss() {
    return gulp.src("./src/sass/style.scss")
        .pipe(sass())
        .pipe(cssnano())
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(gulp.dest("./build"))
        .pipe(browserSync.stream())
}

function buildHtml() {
    return gulp.src("./src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./build"));
}

function clear() {
    return gulp.src('./build', {read: false, allowEmpty: true})
      .pipe(clean());
  };

function watching() {
     gulp.watch("./src/*.html", buildHtml).on("change", browserSync.reload);
     gulp.watch("./src/sass/**/*.scss", buildCss);
}

function copy() {
    return gulp.src("./src/assets/**/*", {
        encoding:false,
    })
    .pipe(gulp.dest("./build"));
}



function server() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
};




exports.default = gulp.series(clear, copy, gulp.series(buildCss, buildHtml), gulp.parallel(watching, server));