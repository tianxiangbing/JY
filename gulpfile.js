let gulp = require('gulp');
let iwatch = require('gulp-watch');
let ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
gulp.task('ts',function(){
    var tsResult = gulp.src(['src/*.ts','example/**/*.ts'])
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(ts({
            // ...
        }));

    return tsResult.js
       // .pipe( ... ) // You can use other plugins that also support gulp-sourcemaps
        .pipe(sourcemaps.write('./')) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('dist'));
});
gulp.task('watch',function(){
    iwatch(['src/*.ts','example/**/*.ts'],function(){
        gulp.start('ts')
    });
});
gulp.task('build', function () {
    return gulp.src('src/**/index.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'JY.js'
        }))
        .pipe(gulp.dest('./'));
});
gulp.task('default', ['ts','build']);