/*
 * @Author: dmyang
 * @Date:   2015-06-16 15:19:59
 * @Last Modified by:   dmyang
 * @Last Modified time: 2015-08-27 11:16:12
 */

'use strict';

var fs = require('fs');
var gulp = require('gulp');
var webpack = require('webpack');
var gutil = require('gulp-util');
var webpackConf = require('./webpack.config');
var typescript = require('gulp-typescript');
var path = require('path');
var makeMapping = require('./dev/webpack/make-mapping.gulp');

var tsProject = typescript.createProject('tsconfig.json');
var src = process.cwd() + '/src';
var assets = path.join(process.cwd(), webpackConf.myConf.env[webpackConf.myConf.target].dist);

// 构建 ts 文件
gulp.task('build:typescript', function () {
    gulp.src(src + '/**/*.ts')
        .pipe(typescript(tsProject))
        .pipe(gulp.dest(src));
});

// js 检查
gulp.task('hint', ['build:typescript'], function () {
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');
    return gulp.src([
            '!' + src + '/js/lib/**/*.js',
            src + '/js/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// 清理
gulp.task('clean', ['hint'], function () {
    var clean = require('gulp-clean');
    return gulp.src(assets, {read: true}).pipe(clean());
});

// webpack 项目构建
gulp.task('webpack', ['build:typescript'], function (done) {
    webpack(webpackConf, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);

        // 生成映射文件
        var paths = [];
        var obj = stats.compilation.assets;
        for (var i in obj) if (obj.hasOwnProperty(i)) paths.push(i);
        makeMapping(paths, webpackConf);

        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
});

// 项目部署
gulp.task('default', ['webpack'], function () {
    fs.readdirSync(assets);
});

// 项目部署到远程服务器
gulp.task('deploy', function () {
    var sftp = require('gulp-sftp');
    return gulp.src(assets + '/**')
        .pipe(sftp({
            host: '[remote server ip]',
            remotePath: '/www/app/',
            user: 'foo',
            pass: 'bar'
        }));
});