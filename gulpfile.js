const { src, dest, watch, parallel, series } = require("gulp");

const sass = require('gulp-sass')(require('node-sass'));
const rename = require("gulp-rename");
const eslint = require("gulp-eslint");
const sync = require("browser-sync").create();


function generateCSS(cb) {
    src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('public/stylesheets'))
        .pipe(sync.stream());
    cb();
}


function runLinter(cb) {
    return src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError())
        .on('end', function() {
            cb();
        });
}


function watchFiles(cb) {
    watch('sass/**.scss', generateCSS);
    watch([ '**/*.js', '!node_modules/**'], parallel(runLinter));
}


function browserSync(cb) {
    sync.init({
        server: {
            baseDir: "./public"
        }
    });

    watch('sass/**.scss', generateCSS).on('change', sync.reload);
    watch("public/**.html").on('change', sync.reload);
}


exports.css = generateCSS;
exports.lint = runLinter;
exports.watch = watchFiles;
exports.sync = browserSync;

exports.default = series(runLinter,parallel(generateCSS));