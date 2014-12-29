'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var gulpThemeLess = require('../index');


gulp.task('less-theme', ['theme-less'], function () {
    return gulp.src(['./app/styles/themes/theme-blue.less',
                     './app/styles/themes/theme-red.less'])
        .pipe(less())
        .pipe(gulp.dest('./public/styles/themes/'))
});


gulp.task('theme-less', function(){
    return gulp.src('./app/styles/main-style.less')
        .pipe(gulpThemeLess({excludeLessFiles: ['variables.less'], removeExcludeLessFiles: true}))
        .pipe(gulp.dest('./app/styles/themes/'));
});


gulp.task('default', ['less-theme'], function () {

});