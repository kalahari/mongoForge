var gulp = require('gulp');  
var sourcemaps = require('gulp-sourcemaps');  
var ts = require('gulp-typescript');  
var babel = require('gulp-babel');
const tslint = require('gulp-tslint');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', function() {  
    return gulp.src(['**/*.ts', '!node_modules/**/*.ts'])
        .pipe(tslint())
        .pipe(tslint.report('verbose'))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(babel({ "presets": ["es2015-node5"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});