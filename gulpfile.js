let gulp = require('gulp');
let iwatch = require('gulp-watch');
let ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
gulp.task('ts', function () {
    var tsResult = gulp.src(['src/*.ts', 'example/**/*.ts'])
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(ts({
            // ...
            module: "commonjs"
        }));

    return tsResult.js
        .pipe(uglify())
        // .pipe( ... ) // You can use other plugins that also support gulp-sourcemaps
        .pipe(sourcemaps.write('./')) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('dist'));
});
gulp.task('watch', function () {
    iwatch(['src/*.ts', 'example/**/*.ts'], function () {
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

gulp.task('lib', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            module: "commonjs",
            noImplicitAny: true,
            target: "es5",
            allowJs: true,
            outDir: "out",
            noImplicitAny: true,
            moduleResolution: "node"
        }))
        .pipe(gulp.dest('./lib/'));
});
gulp.task('default', ['ts', 'build','lib']);