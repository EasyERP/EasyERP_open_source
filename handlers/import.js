var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var ImportSchema = mongoose.Schemas.Imports;
    var UserSchema = mongoose.Schemas.User;
    var ImportHistorySchema = mongoose.Schemas.ImportHistories;

    var schemaObj = {
        Customers    : mongoose.Schemas.Customer,
        Opportunities: mongoose.Schemas.Opportunitie,
        Employees    : mongoose.Schemas.Employee
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
    var importedFileName;
    var importedFilePath;


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
        //var exportMapImport = exportMap[fileName];
        var options;
        var exportMapImport = mapObject[fileName];

        options = {
            res         : res,
            next        : next,
            resultArray : resultArray,
            map         : exportMapImport,
            returnResult: true,
            fileName    : fileName || 'Customers'
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
            filePath      : options.filePath,
            user          : options.userId,
            type          : options.type,
            reportFile    : options.reportFile,
            reportFileName: options.reportFileName
        };

        var importHistory = new ImportHistoryModel(importHistoryObj);

        importHistory.save(function (err) {
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

            importedFileName = importedData.fileName;
            importedFilePath = importedData.fileName;

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
        var query = req.query;
        var limit = parseInt(query.count);
        var page = parseInt(query.page);
        var skip = limit * (page - 1);

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
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    _id  : 0,
                    total: 1,
                    data : {
                        date          : '$root.date',
                        fileName      : '$root.fileName',
                        user          : '$root.user.login',
                        type          : '$root.type',
                        status        : '$root.status',
                        reportFileName: '$root.reportFile',
                        reportFile    : '$root.reportFileName'
                    }
                }
            }, {
                $sort: {
                    'data.date': -1
                }
            }, {
                $skip: skip
            }, {
                $limit: limit
            }, {
                $group: {
                    _id  : null,
                    total: {$first: '$total'},
                    data : {$push: '$data'}
                }
            }, {
                $project: {
                    _id  : 0,
                    total: '$total',
                    data : '$data'
                }
            }
        ], function (err, result) {
            var data = {};

            if (err) {
                return next(err);
            }

            if (result.length) {
                data = result[0];
            }

            res.status(200).send(data);
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

    function nestedToFlat(into, target, currentKey) {
        var newKey;
        var newVal;

        if (!currentKey) {
            currentKey = '';
        }

        for (var i in into) {
            if (into.hasOwnProperty(i)) {
                newKey = i;
                newVal = into[i];

                if (currentKey.length > 0) {
                    newKey = currentKey + '.' + i;
                }

                if (typeof newVal === 'object') {
                    nestedToFlat(newVal, target, newKey);
                } else {
                    target[newKey] = newVal;
                }
            }
        }
    }

    function flatten(obj) {
        var newObj = {};
        nestedToFlat(obj, newObj);
        return newObj;
    }

    function deepMap(obj, mapper) {
        return mapper(_.mapValues(obj, function (v) {
            return _.isPlainObject(v) ? deepMap(v, mapper) : v;
        }));
    }

    function compearingForMerge(savedItems, importedItems, compareFiled, callback) {
        var itemsToSave = [];
        var conflictSavedItems = [];
        var savedItem;
        var jsonSavedItem;
        var conflictItemsIndex = [];

        if (!compareFiled) {
            return callback(null, importedItems, []);
        }

        for (var i = 0; i <= importedItems.length - 1; i++) {
            for (var j = i + 1; j <= importedItems.length - 1; j++) {

                if (importedItems[i][compareFiled] && importedItems[j][compareFiled] && importedItems[i][compareFiled].trim() === importedItems[j][compareFiled].trim()) {
                    conflictItemsIndex.push(i);
                    conflictItemsIndex.push(j);
                }
            }
        }

        for (var i = 0; i <= importedItems.length - 1; i++) {
            for (var j = 0; j <= savedItems.length - 1; j++) {
                savedItem = savedItems[j].toJSON();
                savedItem._id = savedItem._id.toString();
                jsonSavedItem = flatten(savedItem);

                if (importedItems[i][compareFiled] && jsonSavedItem[compareFiled] && importedItems[i][compareFiled].trim() === jsonSavedItem[compareFiled].trim()) {
                    conflictItemsIndex.push(i);
                    jsonSavedItem.isExists = true;
                    if (conflictSavedItems.indexOf(jsonSavedItem.id.toString()) === -1) {
                        conflictSavedItems.push(jsonSavedItem.id.toString());
                    }
                }
            }
        }

        for (var i = 0; i <= importedItems.length - 1; i++) {
            if (conflictItemsIndex.indexOf(i) === -1) {
                itemsToSave.push(importedItems[i]);
            }
        }

        callback(null, itemsToSave, conflictSavedItems);
    }

    this.getConflictedItems = function (req, res, next) {
        var query = req.query;
        var timeStamp = +query.timeStamp;
        var userId = req.session.uId;
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var criteria = {$and: [{user: userId}]};
        var titleArray;
        var mappedFields;
        var resultArray = [];
        var map;
        var type;
        var result;
        var conflictedData;
        var skipped;
        var imported;
        var conflictedSaveItems;
        var userImports;
        var Model;
        var compearingField;

        if (timeStamp) {
            criteria.$and.push({timeStamp: timeStamp});
        }

        UserModel.findOne({_id: userId}, {imports: 1}, function (err, userModel) {
            if (err) {
                return next(err);
            }

            userImports = userModel.imports || {};

            map = userImports.map || {};
            type = userImports.type;
            result = map.result;
            skipped = userImports.skipped;
            imported = userImports.importedCount;
            conflictedSaveItems = userImports.conflictedItems;
            compearingField = userImports.comparingField;

            criteria.$and.push({_id: {$nin: skipped}});

            Model = models.get(req.session.lastDb, type, schemaObj[type]);

            async.parallel({
                conflictedUnsavedItems: function (parCb) {
                    ImportModel
                        .find(criteria)
                        .exec(function (err, importData) {
                            if (err) {
                                return parCb(err);
                            }

                            if (!importData.length) {
                                res.status(404).send({result: 'Imported data not found'});
                                return;
                            }

                            titleArray = importData.shift().result;

                            mappedFields = mapImportFileds(result, titleArray);

                            async.each(importData, function (importItem, eachCb) {
                                var conflictItem;
                                var importItemObj = importItem.toJSON().result;

                                conflictItem = prepareSaveObject(mappedFields, importItemObj);
                                conflictItem.importId = importItem._id;
                                resultArray.push(conflictItem);
                                eachCb(null);

                            }, function (err) {
                                if (err) {
                                    return parCb(err);
                                }

                                parCb(null, resultArray);
                            });
                        });
                },

                conflictedSavedItems: function (parCb) {
                    Model.find({_id: {$in: conflictedSaveItems}}, function (err, resultItems) {
                        var conflictSavedItems;

                        if (err) {
                            return parCb(err);
                        }

                        conflictSavedItems = resultItems.map(function (item) {
                            var currentItem = item.toJSON();
                            currentItem._id = currentItem._id.toString();
                            currentItem.isExist = true;

                            return flatten(currentItem);
                        });

                        parCb(null, conflictSavedItems);

                    });
                },

                getHeaderId: function (parCb) {
                    ImportModel.findOne(function(err, result){
                        if (err) {
                            return parCb(err);
                        }

                        parCb(null, result._id);
                    });
                }
            }, function (err, resultItems) {

                if (err) {
                    return next(err);
                }

                conflictedData = _.union(resultItems.conflictedSavedItems, resultItems.conflictedUnsavedItems);

                conflictedData = _.groupBy(conflictedData, compearingField);

                res.status(200).send({
                    result  : conflictedData,
                    keys    : _.values(result),
                    type    : type,
                    headerId: resultItems.getHeaderId || null
                });
            });
        });
    };

    this.saveMergedData = function (req, res, next) {
        var body = req.body;
        var importIds = body.data;
        var userId = req.session.uId;
        var ids = _.pluck(importIds, 'id');
        var timeStamp = body.timeStamp;
        var criteria = {
            $and: [
                {user: userId}
            ]
        };
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var ImportHistoryModel = models.get(req.session.lastDb, 'ImportHistories', ImportHistorySchema);
        var headerId = body.headerId;
        var headerItem;
        var titleArray;
        var mappedFields;
        var skippedArray = [];
        var skipped;
        var idsForRemove = [];
        var Model;
        var importedCount = 0;
        var mergedCount = 0;
        var type;
        var importFileName;
        var importFilePath;
        var reportFilePath;
        var reportFileName;

        if (timeStamp) {
            criteria.$and.push({timeStamp: timeStamp});
        }

        criteria.$and.push({
            $or: [
                {_id: {$in: ids}},
                {_id: headerId}
            ]
        });

        async.waterfall([
            function (wCb) {
                UserModel.findOne({_id: userId}, {imports: 1}, function (err, userModel) {
                    var userImports;

                    if (err) {
                        return wCb(err);
                    }

                    userImports = userModel.toJSON().imports || {};

                    skipped = userImports.skipped;
                    importedCount = userImports.importedCount;
                    type = userImports.type;
                    //importFileName = userImports.fileName;
                    //importFile = userImports.filePath;

                    wCb(null, userImports);
                });
            },

            function (userImports, wCb) {
                ImportModel.find(criteria, function (err, importData) {
                    var mapResult;
                    var type = userImports.type;

                    //console.log(importData);
                    importFileName = importData[0].fileName;
                    importFilePath = importData[0].filePath;

                    if (err) {
                        return wCb(err);
                    }

                    if (!importData.length) {
                        res.status(404).send({result: 'Imported data not found'});
                        return;
                    }

                    Model = models.get(req.session.lastDb, type, schemaObj[type]);

                    mapResult = userImports.map.result;

                    headerItem = _.filter(importData, function (item) {
                        return item.toJSON()._id.toString() === headerId.toString();
                    });

                    if (headerItem[0]) {
                        titleArray = headerItem[0].toJSON().result;
                    }

                    mappedFields = mapImportFileds(mapResult, titleArray);

                    wCb(null, mappedFields, importData);
                });
            },

            function (mappedFields, importData, wCb) {
                var skippedItem;

                if (!skipped.length) {
                    return wCb(null, mappedFields, importData);
                }

                ImportModel.find({_id: {$in: skipped}}, function (err, resultItems) {
                    if (err) {
                        return wCb(null);
                    }

                    resultItems.forEach(function (item) {
                        skippedItem = prepareSaveObject(mappedFields, item.result);

                        skippedArray.push(skippedItem);
                    });

                    wCb(null, mappedFields, importData);
                });
            },

            function (mappedFields, importData, wCb) {
                var item;
                var importItem;
                var itemObj;
                var saveModel;
                var existId;

                if (!importIds.length) {
                    return wCb(null);
                }

                async.each(importIds, function (id, eachCb) {
                    item = _.filter(importData, function (item) {
                        return item._id.toString() === id.id;
                    });

                    itemObj = item[0].toJSON().result;

                    importItem = prepareSaveObject(mappedFields, itemObj);

                    if (id.action === 'skip') {
                        importItem.reason = 'Skipped by merge';
                        skippedArray.push(importItem);
                        eachCb(null);
                        return;
                    } else if (id.action === 'import') {
                        saveModel = new Model(importItem);
                        saveModel.save(function (err) {
                            if (err) {
                                itemObj.reason = err.message;
                                skippedArray.push(
                                    importItem
                                );
                            } else {
                                importedCount++;
                            }

                            eachCb(null);
                        });
                    } else {
                        existId = id.existId;

                        Model.update({_id: existId}, {$set: importItem}, function (err) {
                            if (err) {
                                importItem.reason = err.message;
                                skippedArray.push(importItem);
                            }

                            mergedCount++;
                            eachCb(null);
                        });
                    }

                    idsForRemove.push(itemObj._id);

                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null);
                });
            },

            function (wCb) {
                if (!skippedArray.length) {
                    return wCb(null, {});
                }

                createXlsxReport(res, wCb, skippedArray, type);
            },

            function (reportOptions, wCb) {
                var options;

                reportFilePath = reportOptions.pathName;
                reportFileName = reportOptions.fileName;

                console.log(importFileName, importFilePath);

                options = {
                    fileName      : importFileName,
                    filePath      : importFilePath,
                    userId        : userId,
                    type          : type,
                    reportFile    : reportFilePath,
                    reportFileName: reportFileName
                };

                writeHistory(options, ImportHistoryModel, wCb);
            },

            function (wCb) {
                ImportModel.remove({user: userId}, function () {
                });

                wCb(null);
            },

            function (wCb) {
                UserModel.update({_id: userId}, {$set: {imports: {}}}, wCb);
            }
        ], function (err) {

            if (err) {
                return next(err);
            }

            res.status(200).send({
                imported      : importedCount,
                skipped       : skippedArray.length ? skippedArray.length - 1 : 0,
                merged        : mergedCount,
                reportFilePath: reportFilePath,
                reportFileName: reportFileName
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
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var Model = models.get(req.session.lastDb, type, schemaObj[type]);
        var titleArray;
        var mappedFields;
        var skippedArray = [];
        var importedCount = 0;
        var headerItem;
        var criteria = {
            user: userId
        };
        var importItems = [];
        var idsForRemove = [];
        var compearingFiled = data.comparingField;

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
                        importItems.push(saveObj);

                        cb(null);

                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null);
                    });
                },

                function (wCb) {

                    Model.find({}, wCb);
                },

                function (savedItems, wCb) {
                    compearingForMerge(savedItems, importItems, compearingFiled, wCb);
                },

                function (itemsToSave, conflictedItems, wCb) {
                    var saveModel;

                    async.each(itemsToSave, function (item, eachCb) {
                        saveModel = new Model(item);
                        saveModel.save(function (err) {
                            if (err) {
                                item.reason = err.message;
                                skippedArray.push(item.importId.toString());
                            } else {
                                importedCount++;
                                idsForRemove.push(item.importId);
                            }

                            eachCb(null);
                        });
                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, conflictedItems);
                    });
                },

                function (conflictedItems, wCb) {
                    ImportModel.remove({_id: {$in: idsForRemove}}, function () {
                    });
                    wCb(null, conflictedItems);
                }
            ], function (err, conflictedItems) {

                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    imported       : importedCount,
                    skippedArray   : skippedArray,
                    conflictedItems: conflictedItems
                });
            });
        });
    };

};

module.exports = Module;
