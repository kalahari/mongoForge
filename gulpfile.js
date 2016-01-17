const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const tslint = require('gulp-tslint');
const runSequence = require('run-sequence');
const run = require('gulp-run');

const tsProject = ts.createProject('./tsconfig.json');

gulp.task('transpile', function () {
    return gulp.src(['**/*.ts', '!node_modules/**/*.ts', '!typings/browser.d.ts', '!typings/browser/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(babel({ "presets": ["es2015-node5"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});

gulp.task('tslint', function () {
    return gulp.src(['**/*.ts', '!node_modules/**/*.ts'])
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('typings', function () {
    run("sed -e 's!^(/// <reference path=\"\\.\\./es6-shim/es6-shim.d.ts\" />)$!// ### REDUNDANT FOR ES6/ES2015 ### \\1!' -i.bak node_modules/angular2/typings/zone/zone.d.ts").exec()
    run("sed -e 's!^(/// <reference path=\"\\.\\./typings/node/node.d.ts\" />)$!// ### REDUNDANT FOR ES6/ES2015 ### \\1!' -i.bak node_modules/angular2/manual_typings/globals-es6.d.ts").exec()
    run('typings install').exec();
});

gulp.task('build', ['typings'], function (cb) {
    runSequence(['tslint', 'transpile'], cb);
});

gulp.task('default', ['build']);
