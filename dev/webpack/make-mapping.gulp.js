var fs = require('fs');
var path = require('path');

var classify = {
    css: ['.css'],
    js: ['.js']
};

module.exports = function (paths, webpackConf) {
    var dir = webpackConf.output.path || '';
    var url = webpackConf.output.publicPath || '';
    var result = {}, filePath = '', filename = '', fileInfo = {};
    for (var i in paths) if (paths.hasOwnProperty(i)) {
        var fileExt = path.extname(paths[i]);
        for (var c in classify) if (classify.hasOwnProperty(c)) {
            if (classify[c].indexOf(fileExt) != -1) {
                filePath = path.join(dir, paths[i]);
                filename = path.basename(filePath);
                var fileTmp = [];
                if (webpackConf.debug) {
                    fileTmp = filename.match(/(.*?)\.[\w\d]+/i);
                    fileInfo = {
                        path: filePath,
                        fileName: fileTmp[0],
                        realName: fileTmp[1] + fileExt,
                        url: url + paths[i]
                    };
                } else {
                    fileTmp = filename.match(/([\w\d]{8})\.(.*?)\.min\.[\w\d]+/i);
                    fileInfo = {
                        path: filePath,
                        filename: fileTmp[0],
                        realName: fileTmp[2] + fileExt,
                        url: url + paths[i]
                    };
                }

                if (!result[c]) result[c] = {};
                result[c][fileInfo['realName']] = fileInfo;
                break;
            }
        }
    }

    fs.writeFile(path.join(dir, 'mapping.source.json'), JSON.stringify(result), function (err) {
        if (err) console.log(err);
        console.log('copy has finished');
    });
    // console.log(result);
};