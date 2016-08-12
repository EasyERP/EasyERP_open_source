var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var ImportSchema = mongoose.Schemas.Imports;
    var UserSchema = mongoose.Schemas.User;
    var PersonSchema = mongoose.Schemas.Customer;
    var ImportHistorySchema = mongoose.Schemas.ImportHistories;

    var schemaObj = {
        Customers    : mongoose.Schemas.Customer,
        Opportunities: mongoose.Schemas.Opportunitie
    };

    var exportMap = require('../helpers/csvMap');
    var exporter = require('../helpers/exporter/exportDecorator');
    var async = require('async');
    var mapObject = require('../public/js/constants/importMapping');
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('lodash');
    var arrayKeys = {
        'groups.users': true,
        'groups.group': true
    };

    function toOneCase(item) {
        item = item ? item.toString().toLowerCase() : null;
        item = item ? item.toString().replace(/[-+=_() !@#$%^&*`{}\[\]:;.,|\\]/g, '') : null;

        return item;
    }

    function comparing(item1, item2) {
        var changedItem1 = toOneCase(item1);
        var changedItem2 = toOneCase(item2);

        if (!changedItem1 || !changedItem2) {
            return false;
        }

        if (changedItem1.indexOf(changedItem2) >= 0 || changedItem2.indexOf(changedItem1) >= 0 || changedItem1 === changedItem2) {
            return true;
        }

        return false;
    }

    function splitFields(firstArr, secondArr) {
        var result = {};
        var isChanged;

        for (var i = 0; i < secondArr.length; i++) {
            isChanged = false;

            for (var j = 0; j < firstArr.length; j++) {

                if (firstArr[j] && (comparing(secondArr[i], firstArr[j]))) {
                    result[secondArr[i]] = firstArr[j];
                    firstArr[j] = null;

                    isChanged = !isChanged;
                    break;
                }
            }

            if (!isChanged) {
                result[secondArr[i]] = '';
            }
        }

        return {
            result  : result,
            unMapped: firstArr
        };
    }

    function createXlsxReport(res, next, resultArray, fileName) {
        var exportMapImport = exportMap[fileName];
        var options;

        options = {
            res         : res,
            next        : next,
            resultArray : resultArray,
            map         : exportMapImport,
            returnResult: true,
            fileName    : fileName || 'Customer'
        };

        return exporter.reportToXlsx(options);
    }

    function mapImportFileds(importObj, fieldsArray) {
        var mappedFields = {};

        for (var i in importObj) {

            if (importObj[i] !== '') {
                mappedFields[importObj[i]] = fieldsArray.indexOf(i);
            }
        }

        return mappedFields;
    }

    function prepareSaveObject(mappedFields, saveItemArray) {
        var saveObj = {};
        var val;
        var arr;

        for (var i in mappedFields) {
            val = saveItemArray[mappedFields[i]];
            arr = [];

            if (val && arrayKeys && arrayKeys[mappedFields[i]] === true) {
                if (typeof +val === 'number') {
                    arr.push(val);
                    val = arr;
                } else {
                    val = val.split(',');
                }
            }

            if (val) {
                if (!isNaN(+val)) {
                    saveObj[i] = +val;
                } else if (val === 'false') {
                    saveObj[i] = false;
                } else if (val === 'true') {
                    saveObj[i] = true;
                } else {
                    saveObj[i] = val;
                }
            }

        }

        return saveObj;
    }

    function writeHistory(options, ImportHistoryModel, callback) {
        var importHistoryObj = {
            dateHistory   : options.dateHistory,
            fileName      : options.fileName,
            user          : options.userId,
            type          : options.type,
            status        : options.status,
            reportFile    : options.reportFile,
            reportFileName: options.reportFileName
        };

        var importHistory = new ImportHistoryModel(importHistoryObj);

        importHistory.save(function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
    }

    this.getImportMapObject = function (req, res, next) {
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var userId = req.session.uId;
        var query = req.query;
        var type = query.type || 'Customers';
        var personKeysArray = mapObject[type].slice();
        var mappedObj;
        var unmappedResult = {};
        var mappedResult = {};
        var findObj = {
            user: userId
        };

        if (query.timeStamp) {
            findObj.timeStamp = query.timeStamp;
        }

        ImportModel.findOne(findObj, function (err, importedData) {
            if (err) {
                return next(err);
            }

            if (importedData) {
                mappedObj = splitFields(personKeysArray, importedData.result);
            }

            mappedObj.unMapped = _.compact(mappedObj.unMapped);
            unmappedResult[type] = mappedObj.unMapped;

            mappedResult[type] = mappedObj.result;

            res.status(200).send({
                mappedObj  : mappedResult,
                unmappedObj: unmappedResult
            });
        });
    };

    this.getImportHistory = function (req, res, next) {
        var ImportHistoryModel = models.get(req.session.lastDb, 'ImportHistories', ImportHistorySchema);

        ImportHistoryModel.aggregate([
            {
                $match: {}
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'user',
                    foreignField: '_id',
                    as          : 'user'
                }
            }, {
                $unwind: {
                    path: '$user'
                }
            }, {
                $project: {
                    date          : '$date',
                    fileName      : '$fileName',
                    user          : '$user.login',
                    type          : '$type',
                    status        : '$status',
                    reportFileName: '$reportFile',
                    reportFile    : '$reportFileName'
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getForPreview = function (req, res, next) {
        var query = req.query;
        var timeStamp = +query.timeStamp;
        var userId = req.session.uId;
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var criteria = {user: userId};
        var titleArray;
        var mappedFields;
        var resultArray = [];
        var map;
        var type;
        var result;

        if (timeStamp) {
            criteria.timeStamp = timeStamp;
        }

        UserModel.findOne({_id: userId}, {imports: 1}, function (err, userModel) {
            if (err) {
                return next(err);
            }

            map = userModel.imports && userModel.imports.map;
            type = map.type;
            result = map.result;

            ImportModel
                .find(criteria)
                .limit(6)
                .exec(function (err, importData) {
                    if (err) {
                        return next(err);
                    }

                    if (!importData.length) {
                        res.status(404).send({result: 'Imported data not found'});
                        return;
                    }

                    titleArray = importData.shift().result;

                    mappedFields = mapImportFileds(result, titleArray);

                    async.each(importData, function (importItem, cb) {
                        var saveObj;
                        var importItemObj = importItem.toJSON().result;

                        saveObj = prepareSaveObject(mappedFields, importItemObj);
                        resultArray.push(saveObj);
                        cb();

                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({
                            result: resultArray,
                            keys  : _.values(result),
                            type  : type
                        });
                    });
                });
        });
    };

    function compearingForMerge(importedItems, compareFiled, callback) {
        var conflictItems = [];
        var itemsToSave = [];

        for (var i = 0; i <= importedItems.length - 1; i++) {
            for (var j = i + 1; j <= importedItems.length - 1; j++) {

                if (importedItems[i][compareFiled] && importedItems[j][compareFiled] && importedItems[i][compareFiled] === importedItems[j][compareFiled]) {
                    conflictItems.push(i);
                    conflictItems.push(j);
                }
            }
        }

        for (var i = 0; i <= importedItems.length - 1; i++) {
            if (conflictItems.indexOf(i) === -1) {
                itemsToSave.push(importedItems[i]);
            }
        }

        callback(null, itemsToSave);
    }

    this.getConflictedItems = function (req, res, next) {
        var query = req.query;
        var timeStamp = +query.timeStamp;
        var userId = req.session.uId;
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var criteria = {user: userId};
        var titleArray;
        var mappedFields;
        var resultArray = [];
        var map;
        var type;
        var result;
        var conflictedData;

        if (timeStamp) {
            criteria.timeStamp = timeStamp;
        }

        UserModel.findOne({_id: userId}, {imports: 1}, function (err, userModel) {
            if (err) {
                return next(err);
            }

            map = userModel.imports && userModel.imports.map;
            type = map.type;
            result = map.result;

            ImportModel
                .find(criteria)
                .exec(function (err, importData) {
                    if (err) {
                        return next(err);
                    }

                    if (!importData.length) {
                        res.status(404).send({result: 'Imported data not found'});
                        return;
                    }

                    titleArray = importData.shift().result;

                    mappedFields = mapImportFileds(result, titleArray);

                    async.each(importData, function (importItem, cb) {
                        var conflictItem;
                        var importItemObj = importItem.toJSON().result;

                        conflictItem = prepareSaveObject(mappedFields, importItemObj);
                        conflictItem.importId = importItem._id;
                        resultArray.push(conflictItem);
                        cb(null);

                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        conflictedData = _.groupBy(resultArray, 'name.last');

                        res.status(200).send(conflictedData);
                    });
                });
        });
    };

    this.saveImportedData = function (req, res, next) {
        var data = req.body;
        var userId = req.session.uId;
        var map = data.map || {};
        var type = map.type;
        var timeStamp = map.timeStamp;
        var mapResult = map.result || {};
        var mapFileName = data.fileName;
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var Model = models.get(req.session.lastDb, type, schemaObj[type]);
        var ImportHistoryModel = models.get(req.session.lastDb, 'ImportHistories', ImportHistorySchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var titleArray;
        var mappedFields;
        var skippedArray = [];
        var importedIds = [];
        var headerItem;
        var criteria = {
            user: userId
        };
        var saveItems = [];
        var idsForRemove = [];

        if (timeStamp) {
            criteria.timeStamp = timeStamp;
        }

        ImportModel.find(criteria, function (err, importData) {
            if (err) {
                return next(err);
            }

            if (!importData.length) {
                res.status(404).send({result: 'Imported data not found'});
                return;
            }

            headerItem = importData.shift();
            titleArray = headerItem.result;

            mappedFields = mapImportFileds(mapResult, titleArray);

            async.waterfall([
                function (wCb) {
                    async.each(importData, function (importItem, cb) {
                        var saveObj;
                        var importItemObj = importItem.toJSON().result;

                        saveObj = prepareSaveObject(mappedFields, importItemObj);
                        saveObj.importId = importItem._id;
                        saveItems.push(saveObj);

                        cb(null);

                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, saveItems);
                    });
                },

                function (saveItems, wCb) {
                    compearingForMerge(saveItems, 'name.last', wCb);
                },

                function (itemsToSave, wCb) {
                    var saveModel;
                    async.each(itemsToSave, function (item, eachCb) {

                        saveModel = new Model(item);
                        saveModel.save(function (err) {
                            if (err) {
                                item.reason = err.message;
                                skippedArray.push(
                                    item
                                );
                            }

                            idsForRemove.push(item.importId);
                            eachCb(null);
                        });
                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null);
                    });
                },

                function (wCb) {
                    ImportModel.remove({_id: {$in: idsForRemove}}, function () {
                    });
                    wCb(null);
                },

                function (wCb) {
                    createXlsxReport(res, wCb, skippedArray, type);
                },

                function (fileOptions, wCb) {
                    var option = {
                        fileName      : mapFileName,
                        userId        : userId,
                        type          : type,
                        status        : 'Finished',
                        reportFile    : fileOptions.pathName,
                        reportFileName: fileOptions.fileName
                    };

                    writeHistory(option, ImportHistoryModel, wCb);
                }

            ], function (err) {
                var imported = importedIds.length;
                var skipped = skippedArray.length;

                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    imported: imported,
                    skipped : skipped
                });
            });
        });
    };

};

module.exports = Module;
