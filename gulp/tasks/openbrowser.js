var gulp = require('gulp');
var opn = require('opn');

module.exports = function () {
    gulp.task('openbrowser', function () {
        opn('http://localhost:13000/');
    });
};
