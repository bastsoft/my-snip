var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

module.exports = function () {
    gulp.task('browserify', function () {
        return browserify('./src/app.js')
            .bundle()
            .pipe(source('btr.js'))
            .pipe(gulp.dest('./'));
    });
};
