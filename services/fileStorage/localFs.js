var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');

var LocalFs = function () {
    var defaultFileDir = process.env.FOLDER_NAME || 'uploads';
    var defaultImageDir = process.env.IMAGE_FOLDER || 'customImages';

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

    function convertFromBase64(Base64String) {
        return new Buffer(Base64String.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    }

    function writeFile(filePath, item, callback) {
        var data;

        if (Object.keys(item).indexOf('path') === -1) {

            data = convertFromBase64(item);

            return fs.writeFile(filePath, data, callback);
        }

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

    this.postImage = function (folderName, imageData, options, callback) {
        var targetPath = path.join(defaultImageDir, folderName);
        var imagePath = path.join(targetPath, imageData.name);

        imagePath = imagePath.split('\\').join('/');

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        makeDir(targetPath, function (err) {
            if (err) {
                return callback(err);
            }

            writeFile(imagePath, imageData.data, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, imagePath);
            });
        });
    };

    this.removeFile = function (filePath, callback) {
        var error;

        if (!callback && typeof filePath === 'function') {
            callback = filePath;

            error = new Error('File path required');
            error.status = 400;

            return callback(error);
        }

        fs.access(filePath, function (err) {
            if (err) {
                return callback();
            }

            fs.unlink(filePath, callback);
        });
    };

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

            function resultMaker(err) {
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
            }

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

                writeFile(filePath, item, resultMaker);
            } else {
                makeDir(targetPath, function (err) {
                    if (err) {
                        eachCb(err);
                    } else {
                        writeFile(filePath, item, resultMaker);
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

    this.readImage = function (imagePath, callback) {
        var fullImagePath = path.join(appRoot, imagePath);

        fs.readFile(fullImagePath, 'base64', function (err, base64Data) {
            if (err) {
                return callback(err);
            }

            callback(null, base64Data);
        });
    };

    function deleteFolderRecursive(path) {
        var files = [];

        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + '/' + file;

                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });

            fs.rmdirSync(path);
        }
    }

    this.removeDir = function (dirName, dir) {
        var dirPath;

        defaultImageDir = dir || defaultImageDir;
        dirPath = path.join(appRoot, defaultImageDir, dirName);

        deleteFolderRecursive(dirPath);
    };
};

module.exports = LocalFs;
