var gulp = require('./gulp')([
    'browserify',
    'webserver',
    'openbrowser'
]);

gulp.task('build', ['browserify']);
gulp.task('default', ['build', 'webserver', 'openbrowser']);
