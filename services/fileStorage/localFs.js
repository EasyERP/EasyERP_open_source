var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');

var LocalFs = function () {
    var defaultFileDir = process.env.FOLDER_NAME || 'uploads';

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

    function writeFile(filePath, item, callback) {
        async.waterfall([function (waterfallCb) {
            fs.readFile(item.path, waterfallCb);
        }, function (data, waterfallCb) {
            try {
                fs.writeFile(filePath, data, waterfallCb);
            } catch (err) {
                waterfallCb(err);
            }
        }], callback);

    }

    this.postFile = function (folderName, fileData, options, callback) {
        var targetPath;
        var filePath;
        var authorId;
        var _files = [];

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        authorId = options.userId || null;

        folderName = folderName || '/';
        targetPath = path.join(defaultFileDir, folderName);

        if (!(fileData instanceof Array)) {
            fileData = [fileData];
        }

        async.eachSeries(fileData, function (item, eachCb) {
            var attachfileName = item.name.slice(0, item.name.lastIndexOf('.'));
            var checkIs = false;
            var maxK = 0;
            var k = '';
            var files;

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

                writeFile(filePath, item, function (err) {
                    var file = {};

                    if (err) {
                        return eachCb(err);
                    }

                    file._id = mongoose.Types.ObjectId();
                    file.name = item.name;
                    file.shortPas = encodeURIComponent(filePath);

                    if (item.size >= 1024) {
                        file.size = (Math.round(item.size / 1024 / 1024 * 1000) / 1000) + '&nbsp;Mb';
                    } else {
                        file.size = (Math.round(item.size / 1024 * 1000) / 1000) + '&nbsp;Kb';
                    }
                    file.uploadDate = new Date();
                    file.uploaderName = authorId;

                    _files.push(file);
                    
                    eachCb();
                });
            } else {
                makeDir(targetPath, function (err) {
                    if (err) {
                        eachCb(err);
                    } else {
                        writeFile(filePath, item, eachCb);
                    }
                });
            }
        }, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, _files);
        });
    };
};

module.exports = LocalFs;
