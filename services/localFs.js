var fs = require('fs');
var path = require('path');
var async = require('async');

var LocalFs = function () {
    var defaultFileDir = process.env.FOLDER_NAME || 'attachments';

    this.getFileUrl = function (folderName, fileName, callback) {
        var folder = folderName || defaultFileDir;
        var fileUrl = path.join(folder, fileName);

        if (callback) {
            callback(null, fileUrl);
        }
    };

    function makeDir(p, opts, f, made) {
        var mode;
        var xfs;
        var cb;

        if (typeof opts === 'function') {
            f = opts;
            opts = {};
        } else if (!opts || typeof opts !== 'object') {
            opts = {mode: opts};
        }

        mode = opts.mode;
        xfs = opts.fs || fs;

        if (!made) {
            made = null;
        }

        cb = f || function () {
            };

        p = path.resolve(p);

        xfs.mkdir(p, mode, function (er) {
            if (!er) {
                made = made || p;

                return cb(null, made);
            }

            switch (er.code) {
                case 'ENOENT':
                    makeDir(path.dirname(p), opts, function (er, made) {
                        if (er) {
                            return cb(er, made);
                        }

                        makeDir(p, opts, cb, made);
                    });
                    break;

                default:
                    xfs.stat(p, function (er2, stat) {
                        if (er2 || !stat.isDirectory()) {
                            cb(er, made);
                        } else {
                            cb(null, made);
                        }
                    });
                    break;
            }
        });
    }

    function writeFile(filePath, fileData, callback) {
        try {
            fs.writeFile(filePath, fileData, function (err, data) {
                if (callback && typeof callback === 'function') {
                    callback(err);
                }
            });
        } catch (err) {
            console.log('ERROR:', err);

            if (callback && typeof callback === 'function') {
                callback(err);
            }
        }
    }

    this.postFile = function (folderName, fileData, callback) {
        var targetPath = path.join(defaultFileDir, folderName);
        var filePath;

        if (!(fileData instanceof Array)) {
            fileData = [fileData];
        }

        async.each(fileData, function (item, eachCb) {
            var files;
            var k = '';
            var maxK = 0;
            var checkIs = false;
            var attachfileName = item.name.slice(0, item.name.lastIndexOf('.'));

            filePath = path.join(defaultFileDir, folderName, item.name);

            if (fs.existsSync(targetPath)) {
                files = fs.readdirSync(targetPath);
                files.forEach(function (fileName) {
                    var intVal;

                    if (fileName === item.name) {
                        k = 1;
                        checkIs = true;
                    } else {
                        if ((fileName.indexOf(attachfileName) === 0) &&
                            (fileName.lastIndexOf(attachfileName) === 0) &&
                            (fileName.lastIndexOf(').') !== -1) &&
                            (fileName.lastIndexOf('(') !== -1) &&
                            (fileName.lastIndexOf('(') < fileName.lastIndexOf(').')) &&
                            (attachfileName.length === fileName.lastIndexOf('('))) {
                            intVal = fileName.slice(fileName.lastIndexOf('(') + 1, fileName.lastIndexOf(').'));
                            k = parseInt(intVal, 10) + 1;
                        }
                    }
                    if (maxK < k) {
                        maxK = k;
                    }
                });

                if (!(maxK === 0) && checkIs) {
                    item.name = attachfileName + '(' + maxK + ')' + item.name.slice(item.name.lastIndexOf('.'));
                }

                filePath = path.join(defaultFileDir, folderName, item.name);

                writeFile(filePath, fileData, eachCb);
            } else {
                makeDir(targetPath, function (err) {
                    if (err) {
                        eachCb(err);
                    } else {
                        writeFile(filePath, fileData, eachCb);
                    }
                });
            }
        }, callback);
    };
};

module.exports = LocalFs;
