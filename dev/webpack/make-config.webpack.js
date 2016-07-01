// HELPER
// 通过 webpack-config.js 文件中的 {debug: true} 属性来处理工作环境。
// Webpack 在编译时只会编译资源目录(src)中的根 js 文件，并根据他们内容中的依赖去查找相应的文件。

// 资源约定目录 js, images, css

// @see es6-es2015 http://babeljs.io/docs/plugins/preset-es2015/

'use strict';

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var Copy = require('./copy.webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');         // 单独打包 css 文件，否则 css 文件会同 js 文件打包在一起
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;                   // 代码压缩
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;           // 公共块

/**
 * 配置文件生成
 * @param option
 * @constructor
 */
var Configure = function (option) {
    this.conf = option;
    if (!this.conf.env[this.conf.target]) throw Error('undefined work environment.');
    this.r = this.conf.env[this.conf.target];
    this.debug = this.r.debug == true;
};

/**
 * 取得源文件目录
 * @returns {boolean}
 */
Configure.prototype.getSrc = function () {
    return this.r.src ? this.r.src : false;
};

/**
 * 取得目标目录
 * @returns {*}
 */
Configure.prototype.getDist = function () {
    return this.r.dist ? this.r.dist : false;
};

/**
 * 取得目标URL地址
 * @returns {*}
 */
Configure.prototype.getUrlDist = function () {
    return this.r.urlDist ? this.r.urlDist : false;
};

/**
 * 取得 JS 文件
 * @returns {{}}
 */
Configure.prototype.genEntries = function () {
    var jsDir = path.resolve(this.getSrc(), 'js');
    var names = fs.readdirSync(jsDir);
    var map = {};

    names.forEach(function (name) {
        var m = name.match(/(.+)\.jsx?$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(jsDir, name) : '';
        if (entry) map[entry] = entryPath;
    });
    return map;
};

/**
 * 取得不参加编译的第三方库
 * @returns {*|env.env.debug.externals|{jquery}|{}}
 */
Configure.prototype.getExternals = function () {
    return this.r.externals || {};
};

/**
 * 取得无需解析的文件列表
 * @returns {Configure.noParse|*|Array|boolean}
 */
Configure.prototype.getNoParse = function () {
    return this.r.noParse || [];
};

/**
 * 取得模块配置信息
 * @returns {{}}
 */
Configure.prototype.getModule = function () {
    var module = {};
    if (this.debug) {
        module = {
            noParse: this.getNoParse(),
            loaders: [
                {
                    test: /\.ts(x?)$/,
                    loader: 'babel-loader!ts-loader'
                }, {
                    test: /\.(jpe?g|png|gif)$/i,
                    loader: "file-loader?name=images/[name].[ext]"
                }, {
                    test: /\.(tpl|ejs)$/,
                    loader: 'ejs'
                }, {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'jsx'
                }, {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css')
                }, {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style', 'css!sass')
                }, {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style', 'css!less')
                }, {
                    test: /\.jsx?$/,
                    loader: "babel-loader"
                }
            ],
            postLoaders: [
                {
                    test: /\.js$/,
                    loader: 'es3ify-loader'
                }
            ]
        };
    } else {
        module = {
            noParse: this.getNoParse(),
            loaders: [
                {
                    test: /\.ts(x?)$/,
                    loader: 'babel-loader!ts-loader'
                }, {
                    test: /\.(jpe?g|png|gif)$/i,
                    loader: "file-loader?name=images/[name].[ext]"
                }, {
                    test: /\.(tpl|ejs)$/,
                    loader: 'ejs'
                }, {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'jsx'
                }, {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style', 'css?minimize!sass')
                }, {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style', 'css?minimize!less')
                }, {
                    test: /\.jsx?$/,
                    loader: 'babel'
                }
            ],
            postLoaders: [
                {
                    test: /\.js$/,
                    loader: 'es3ify-loader'
                }
            ]
        };
    }
    return module;
};

/**
 * 取得插件配置
 * @returns {Array}
 */
Configure.prototype.getPlugin = function () {
    var plugin = [];
    if (this.debug) {
        plugin = [
            new CommonsChunkPlugin({name: 'vendors', chunks: Object.keys(this.getExternals())}),
            new ExtractTextPlugin('css/[name].css', {allChunks: false})
        ];
    } else {
        plugin = [
            new CommonsChunkPlugin({name: 'vendors', chunks: Object.keys(this.getExternals())}),
            new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {allChunks: false}),
            new UglifyJsPlugin()
        ];
    }
    return plugin;
};

/**
 * 生成配置文件
 * @returns {{entry: {}, externals: (*|env.env.debug.externals|{jquery}|{}), output: {path: *, filename: string, chunkFilename: string, hotUpdateChunkFilename: string, publicPath: *}, resolve: {root: string[], alias: (*|{}), extensions: string[]}, module: {}, plugins: Array, devServer: {stats: {cached: boolean, colors: boolean}}}}
 */
Configure.prototype.makeConf = function () {
    return {
        myConf: this.conf,
        debug: this.debug,
        entry: this.genEntries(),
        externals: this.getExternals(),
        output: {
            path: path.resolve(this.getDist()),
            filename: this.debug ? 'js/[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: this.debug ? 'js/[id].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: this.debug ? 'js/[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: this.getUrlDist()
        },
        resolve: {
            root: [this.getSrc(), './node_modules'],
            alias: this.getSourceMap(),
            extensions: ['', '.js', '.css', '.less', '.scss', '.tpl', '.png', '.jpg']
        },
        module: this.getModule(),
        plugins: this.getPlugin(),
        devServer: {
            stats: {
                cached: false,
                colors: true
            }
        }
    };
};

/**
 * 取得资源映射
 * @returns {*|{}}
 */
Configure.prototype.getSourceMap = function () {
    return this.r.sourceMap || {};
};

module.exports = function (config) {
    var configure = new Configure(config);
    Copy.image(configure.getSrc(), configure.getDist());
    return configure.makeConf();
};
