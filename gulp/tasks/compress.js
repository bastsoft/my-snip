var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

module.exports = function () {
    gulp.task('compress', function () {
        return gulp.src('./btr.js')
            .pipe(uglify())
            .pipe(rename({ suffix: '-min' }))
            .pipe(gulp.dest('./'));
    });
};
