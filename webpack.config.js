'use strict';
var webpack = require('./dev/webpack/make-config.webpack');

// 配置环境变量
var env = {
    target: 'debug',                                            // 设置当前的工作环境
    env: {
        debug: {                                                // 定义工作环境
            debug: true,                                        // 项目类型，debug, release
            src: './dev/src/home',                              // 资源目录
            dist: './build/home/',                              // 输出目录
            urlDist: '/build/home/',                            // 输出 URL 路径
            externals: {                                        // 指定忽略列表
                jquery: "$"
            },
            sourceMap: {
                jquery: "js/lib/zepto",
                commonCss: "css/common.css",
                webpackLogo: "img/webpack.png"
            }
        },
        release: {                                              // 定义工作环境
            debug: false,
            src: './dev/src/home',                              // 资源目录
            dist: './dist/home/',                               // 输出目录
            urlDist: '/build/home/',                            // 输出 URL 路径
            externals: {jquery: "$"},                           // 指定忽略列表
            noParse: [],                                        // 忽略对已知文件的解析操作，加快编译速度
            sourceMap: {
                jquery: "js/lib/zepto",
                commonCss: "css/common.css",
                webpackLogo: "img/webpack.png"
            }
        }
    }
};

module.exports = webpack(env);