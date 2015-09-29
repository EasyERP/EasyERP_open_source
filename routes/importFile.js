var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var csv = require('fast-csv');
var xlsx = require('node-xlsx');
var fs = require('fs');
var importMap = require('../helpers/importer/map/csvMap');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models) {

    function getExtension(filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    }

    function importFileToDb(req, res, next) {
        var body = req.body;
        var modelName;
        var files = req.files;
        var filePath;
        var error;
        var task;
        var collection, schema, Model;
        var keysAliases = [];
        var expertedKey = [];

        if (body && files && files.filePath) {

            filePath = files.filePath.path;
            modelName = body.modelName;

            if (!modelName || !filePath) {
                error = new Error((!modelName) ? 'Model name empty': 'File path empty');
                error.status = 400;
                next(error);
                return;
            }
            task = importMap[modelName];

            if (!task) {
                error = new Error('Model name\"' + modelName + '\" is not valid');
                error.status = 400;
                next(error);
                return;
            }
            collection = task.collection;
            schema = mongoose.Schemas[task.schema];
            Model = models.get(req.session.lastDb, collection, schema);

            for (var key in aliases) {
                keysAliases.push(key);
                expertedKey.push(aliases[key]);
            }

            switch (getExtension(filePath)) {
                case '.csv':
                    importCsvToDb(res, next);
                    break;
                case '.xlsx':
                    importXlsxToDb(res, next);
                    break;
                default:
                    error = new Error('Extension file \"' + getExtension(filePath) + '\" not support');
                    error.status = 400;
                    next(error);
            }
        } else {
            res.status(400).send('Bad Request');
        }

        function importCsvToDb(res, next) {
            var headers;
            var arrayKeys = task.arrayKeys;

            csv
                .fromPath(filePath)
                .validate(function (data) {

                    if (!headers) {
                        headers = data;

                        if (headers.length != expertedKey.length) {
                            error = new Error('Different lengths headers');
                            error.status = 400;
                            next(error);
                            return false;
                        }

                        for (var i = expertedKey.length - 1; i >= 0; i--) {
                            if (headers[i] !== expertedKey[i]) {
                                error = new Error('Field \"' + headers[i] + '\" not valid. Need ' + expertedKey[i]);
                                error.status = 400;
                                next(error);
                                return false;
                            }
                        }

                        return false;
                    }
                    //TODO IF NEED VALIDATE IMPLEMENT HERE FOR CSV
                    return true;
                })
                .on("data-invalid", function (data) {
                    //TODO maybe info and User
                })
                .on("data", function (data) {
                    var insertObj = {};
                    var id, objectToSave;

                    Object.keys(data).forEach(function (key) {
                        var val = data[key];

                        if (arrayKeys && arrayKeys[keysAliases[key]] === true) {
                            val = val.split(',');
                        }
                        if (!val) {
                            insertObj[keysAliases[key]] = val;
                        }
                    });

                    id = insertObj.ID;

                    if (id) {
                        Model.update({ID: id}, insertObj, {upsert: true}, function (err) {
                            if (err) {
                                next(err);
                            }
                        });
                    } else {
                        objectToSave = new Model(insertObj);
                        objectToSave.save(function (err) {
                            if (err) {
                                next(err);
                            }
                        })
                    }
                })
                .on("end", function () {
                    if (!error) {
                        res.status(200).send();
                    } else {
                        next(error);
                    }
                });
        }

        function importXlsxToDb(res, next) {
            var obj = xlsx.parse(filePath);
            var sheet;
            var headers, data;
            var arrayKeys = task.arrayKeys;
            var insertObj = {};
            var id, lengthData;

            if (!obj) {
                error = new Error('Parse Error');
                next(error);
                return;
            }
            sheet = obj[0];

            if (sheet && sheet.data) {
                headers = sheet.data[0];
                lengthData = sheet.data.length - 1;

                if (headers.length != expertedKey.length) {
                    error = new Error('Different lengths headers');
                    next(error);
                    return;
                }

                for (var i = expertedKey.length - 1; i >= 0; i--) {

                    if (headers[i] !== expertedKey[i]) {
                        error = new Error('Different lengths headers');
                        next(error);
                        res.status(400).send('Field \"' + headers[i] + '\" not valid. Need ' + expertedKey[i]);
                        return;
                    }
                }

                for (i = lengthData; i > 0; i--) {
                    data = sheet.data[i];
                    insertObj = {};
                    for (var j = data.length - 1; j >= 0; j--) {
                        var val = data[j];

                        if (val && arrayKeys && arrayKeys[keysAliases[j]] === true) {
                            val = val.split(',');
                        }

                        if (val) {
                            insertObj[keysAliases[j]] = val;
                        }
                    }
                    id = insertObj.ID;
                    insertObj = new Model(insertObj);

                    if (id) {
                        insertObj = insertObj.toObject();
                        delete insertObj._id;
                        Model.update({ID: id}, insertObj, {upsert: true}, function (err) {
                            if (err) {
                                next(err);
                            }
                        });
                    } else {
                        insertObj.save(function (err) {
                            if (err) {
                                next(err);
                            }
                        })
                    }
                }
                if (!error) {
                    res.status(200).send('Imported success');
                } else {
                    next(error);
                }
            }
            res.status(400).send('Parse Error');
        }
    }

    router.post('/', multipartMiddleware, importFileToDb);

    return router;
};