var fs = require('fs');
var path = require('path');
var os = require('os');

/**
 * 创建多级目录
 * @param realDir
 * @param mode
 */
var mkdirs = function (realDir, mode) {
    mode = mode || '0755';
    var tmpPath = os.platform() == 'linux' ? '/' : '';
    realDir.split(path.sep).forEach(function (dir) {
        if (tmpPath) {
            tmpPath = path.join(tmpPath, dir);
        } else {
            tmpPath = dir;
        }
        if (!fs.existsSync(tmpPath)) {
            if (!fs.mkdirSync(tmpPath, mode)) {
                return false;
            }
        }
    });
};

/**
 * 取得文件树
 * @param dir
 * @returns {Array|*}
 */
var tree = function (dir) {
    var file = [];
    var rFile = [];
    var names = fs.readdirSync(dir);
    names.forEach(function (name) {
        var fileDir = path.join(dir, name);
        var stat = fs.lstatSync(fileDir);
        if (stat.isDirectory()) {
            rFile = tree(fileDir);
            if ('object' == typeof rFile) {
                for (var i in rFile) if (rFile.hasOwnProperty(i)) {
                    file.push(rFile[i]);
                }
            }
        } else {
            file.push(fileDir);
        }
    });
    return file;
};

module.exports = {
    mkdirs: mkdirs,
    tree: tree
};