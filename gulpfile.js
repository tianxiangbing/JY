var gulp = require('gulp'),
    watchF = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');
var path = ['JY.js','JYSizzle.js','JY.cookie.js','JY.soundManage.js','touch.js'];
gulp.task('js',function(){
	return gulp.src(path).pipe(concat('JY.js')).pipe(gulp.dest('dist')).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('dist')).pipe(gulp.dest('.'));
});
gulp.task('watch',function(){
	watchF(path,function(){
        gulp.start('default');
    });
});
gulp.task('default',['js'])