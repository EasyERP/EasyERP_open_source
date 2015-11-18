var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
//var importMap = require('../helpers/importer/map/xlsx');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var async = require('async');
var logWriter = require('../helpers/logWriter.js');
var payrollSchema = mongoose.Schemas['PayRoll'];

module.exports = function (models) {
    var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

    function getExtension(filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    }

    function importFileToDb(req, res, next) {
        var headers = req.headers;
        var files = req.files;
        var modelName = 'PayRoll';
        var filePath;
        var error;
        var task;
        var rows = 0;
        var collection, schema, Model;
        var keysAliases = [];
        var expertedKey = [];

        if (req.session && req.session.loggedIn && req.session.lastDb) {

            if (headers && files && files.attachfile) {

                filePath = files.attachfile.path;
                modelName = headers.modelname;

                if (!modelName || !filePath) {
                    error = new Error((!modelName) ? 'Model name empty' : 'File path empty');
                    error.status = 400;
                    logWriter.log("importFile.js importFileToDb " + error);
                    next(error);

                    return;
                }
                task = importMap[modelName];

                if (!task) {
                    error = new Error('Model name\"' + modelName + '\" is not valid');
                    error.status = 400;
                    logWriter.log("importFile.js importFileToDb " + error);
                    next(error);

                    return;
                }
               /* aliases = task.aliases;
                collection = task.collection;
                schema = mongoose.Schemas[task.schema];
                Model = models.get(req.session.lastDb, collection, schema);*/

               /* for (var key in aliases) {
                    keysAliases.push(key);
                    expertedKey.push(aliases[key]);
                }*/

                switch (getExtension(filePath)) {
                    case '.xlsx':
                        importXlsxToDb(res, next);
                        break;
                    default:
                        error = new Error('Extension file \"' + getExtension(filePath) + '\" not support');
                        error.status = 400;
                        logWriter.log("importFile.js importFileToDb " + error);
                        next(error);
                }

            } else {
                logWriter.log("importFile.js importFileToDb Bad Request");
                res.status(400).send('Bad Request');
            }
        } else {
            logWriter.log("importFile.js importFileToDb Unauthorized");
            res.status(401).send('Unauthorized');
        }

        function importXlsxToDb(res, next) {
            var obj = xlsx.parse(filePath);
            var sheet;
            var headers;

            if (!obj) {
                error = new Error('Parse Error');
                logWriter.log("importFile.js importXlsxToDb " + error);
                next(error);
                return;
            }
            sheet = obj[0];

            if (sheet && sheet.data) {
                async.eachLimit(sheet.data, 100, function (data, cb) {
                        var error;

                        if (!headers) {
                            headers = data;

                            if (headers.length !== expertedKey.length) {
                                error = new Error('Different lengths headers');
                                error.status = 400;
                                logWriter.log("importFile.js importXlsxToDb " + error);
                                cb(error);
                            }

                            for (var i = expertedKey.length - 1; i >= 0; i--) {

                                if (headers[i] !== expertedKey[i]) {
                                    error = new Error('Field \"' + headers[i] + '\" not valid. Need \"' + expertedKey[i] + '\"');
                                    error.status = 400;
                                    logWriter.log("importFile.js importXlsxToDb " + error);
                                    cb(error);
                                }
                            }
                            cb();
                        } else {
                            saveToDbOrUpdate(data, cb);
                        }
                    },
                    function (err) {
                        var obj = {};

                        if (err) {
                            logWriter.log("importFile.js importXlsxToDb " + err);
                            next(err);
                        } else {
                            obj.countRows = rows;
                            res.status(200).send(obj);
                        }
                    }
                );
            } else {
                logWriter.log("importFile.js importXlsxToDb \"Bad request\"");
                res.status(400).send('Bad request');
            }
        }

        function saveToDbOrUpdate(objectToDb, callback) {
            var id = objectToDb.ID;
            var objectForSave;

            if (id) {
                Model.update({ID: id}, objectToDb, {upsert: true}, function (err) {

                    if (err) {
                        logWriter.log("importFile.js saveToDbOrUpdate " + err);
                        callback(err);
                    } else {
                        callback();
                    }

                });
            } else {
                objectForSave = new Model(objectToDb);
                objectForSave.save(function (err) {
                    if (err) {
                        logWriter.log("importFile.js saveToDbOrUpdate " + err);
                        callback(err);
                    } else {
                        callback();
                    }
                })
            }
        }
    }

    router.post('/', multipartMiddleware, importFileToDb);

    return router;
};