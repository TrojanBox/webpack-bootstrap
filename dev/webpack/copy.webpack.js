var fs = require('fs');
var path = require('path');
var folder = require('./folder.webpack');

function copyImages(source, target) {
    var dir = path.resolve(source, 'images');
    var names = folder.tree(dir);
    var map = {};
    var readable, writable;

    if (0 == target.indexOf('.')) {
        target = target.substr(1, target.length);
    }
    target = path.join('/../', target);

    names.forEach(function (name) {
        var m = name.match(/(.+)\.(jpe?g|png|gif|svg)/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(dir, name) : '';
        var realDir = path.dirname(name);
        var subDir = realDir.replace(path.resolve(dir), '');
        var targetName, dirName;
        if (entry) map[entry] = entryPath;
        readable = fs.createReadStream(name);

        if (subDir == undefined || subDir == '') subDir = '';
        dirName = path.join(process.cwd(), target, 'images', subDir);
        targetName = path.join(process.cwd(), target, 'images', subDir, path.basename(name));

        if (false !== folder.mkdirs(dirName)) {
            writable = fs.createWriteStream(targetName);
        }

        readable.pipe(writable);
    });
    return map;
}


function copyHtmls(source, target) {
    var dir = path.resolve(source, 'template');
    var names = folder.tree(dir);
    var map = {};
    var readable, writable;

    if (0 == target.indexOf('.')) {
        target = target.substr(1, target.length);
    }
    target = path.join('/../', target);

    names.forEach(function (name) {
        var m = name.match(/(.+)\.(html)/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(dir, name) : '';
        var realDir = path.dirname(name);
        var subDir = realDir.replace(path.resolve(dir), '');
        var targetName, dirName;
        if (entry) map[entry] = entryPath;
        readable = fs.createReadStream(name);

        if (subDir == undefined || subDir == '') subDir = '';
        dirName = path.join(process.cwd(), target, 'template', subDir);
        targetName = path.join(process.cwd(), target, 'template', subDir, path.basename(name));
        if (false !== folder.mkdirs(dirName)) {
            writable = fs.createWriteStream(targetName);
        }

        readable.pipe(writable);
    });
    return map;
}


module.exports = {
    image: copyImages,
    html: copyHtmls
};