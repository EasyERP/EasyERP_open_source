/**
 * Created by liliy on 04.02.2016.
 */
module.exports = function () {
    'use strict';
    var mongoose = require('mongoose');
    var fs = require("fs");

    function addAtach(res, next, Model, _id, files) {
        Model.findByIdAndUpdate(_id, {$push: {attachments: {$each: files}}}, {
            upsert: true,
            new   : true
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.send(200, {success: 'Model update success', data: result});
        });
    }

    function uploadFileArray(req, res, callback) {
        var files = [];
        if (req.files && req.files.attachfile && !req.files.attachfile.length) {
            req.files.attachfile = [req.files.attachfile];
        }
        var path;
        var os = require("os");
        var osType = (os.type().split('_')[0]);

        req.files.attachfile.forEach(function (item) {
            var localPath;
            switch (osType) {
                case "Windows":
                {
                    localPath = __dirname + "\\uploads\\" + req.headers.id;
                }
                    break;
                case "Linux":
                {
                    localPath = __dirname + "\/uploads\/" + req.headers.id;
                }
                    break;
            }

            fs.readdir(localPath, function (err, files) {
                if (!err) {
                    var k = '';
                    var maxK = 0;
                    var checkIs = false;
                    var attachfileName = item.name.slice(0, item.name.lastIndexOf('.'));
                    files.forEach(function (fileName) {
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
                                var intVal = fileName.slice(fileName.lastIndexOf('(') + 1, fileName.lastIndexOf(').'));
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
                }
            });

            fs.readFile(item.path, function (err, data) {
                var shortPas;
                switch (osType) {
                    case "Windows":
                    {
                        path = __dirname + "\\uploads\\" + req.headers.id + "\\" + item.name;
                        shortPas = "\\uploads\\" + req.headers.id + "\\" + item.name;
                    }
                        break;
                    case "Linux":
                    {
                        path = __dirname + "\/uploads\/" + req.headers.id + "\/" + item.name;
                        shortPas = "\/uploads\/" + req.headers.id + "\/" + item.name;
                    }
                        break;
                }
                fs.writeFile(path, data, function (err) {
                    if (!err) {
                        var file = {};
                        file._id = mongoose.Types.ObjectId();
                        file.name = item.name;
                        file.shortPas = encodeURIComponent(shortPas);
                        if (item.size >= 1024) {
                            file.size = (Math.round(item.size / 1024 / 1024 * 1000) / 1000) + '&nbsp;Mb';
                        }
                        else {
                            file.size = (Math.round(item.size / 1024 * 1000) / 1000) + '&nbsp;Kb';
                        }
                        file.uploadDate = new Date();
                        file.uploaderName = req.session.uName;
                        files.push(file);

                        if (files.length === req.files.attachfile.length) {
                            if (callback) {
                                callback(files);
                            }
                        }
                    } else {
                        console.log(err);
                        res.send(500);
                    }

                });
            });
        });
    }

    return function (req, res, next, Model) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr) {
                        dir += req.headers.id;
                    }
                    fs.mkdir(dir, function (errr) {
                        if (!errr) {
                            uploadFileArray(req, res, function (files) {
                                addAtach(res, next, Model, req.headers.id, files);
                            });
                        }
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr) {
                                uploadFileArray(req, res, function (files) {
                                    addAtach(res, next, Model, req.headers.id, files);
                                });
                            }
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            addAtach(res,  next, Model, req.headers.id, files);
                        });
                    }
                });
            }
        });
    };
};