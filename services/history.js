'use strict';

var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var historyMapper = require('../constants/historyMapper');
var _ = require('lodash');
var async = require('async');
var HistoryEntrySchema = mongoose.Schemas.History;
var namesRetriever = require('../helpers/namesRetriever');

module.exports = function (models) {
    function generateHistoryEntry(contentType, keyValue) {
        var mapSchema = historyMapper[contentType.toUpperCase()];
        var mapSchemaKeys = Object.keys(mapSchema.map);
        var historyEntry;
        var mappedValue;
        var i;

        function processKey(keyPath) {
            var keys = keyPath.split('.');
            var val;

            if (keys[0] === keyValue.key && (keys.length === 1 || keys[1] === Object.keys(keyValue.value)[0])) {
                val = keyValue.value;

                if (keys.length > 1) {
                    keys.shift();

                    for (i = keys.length - 1; i >= 0; i--) {
                        if (val.hasOwnProperty(keys[i])) {
                            val = val[keys[i]];
                        } else {
                            return null;
                        }
                    }
                }

                mappedValue = mapSchema.map[keyPath];

                historyEntry = {
                    collectionName: mapSchema.collectionName,
                    contentType   : contentType,
                    newValue      : val,
                    changedField  : mappedValue.name,
                    isRef         : mappedValue.isRef
                };

                if (mappedValue.isRef) {
                    if (objectId.isValid(val)) {
                        historyEntry.newValue = objectId(val);  // toDo need to be investigated, sometimes an error occurs
                    } else {
                        historyEntry.newValue = val; // toDo need to be investigated, sometimes an error occurs
                    }
                }
            } else {
                return null;
            }
        }

        for (i = mapSchemaKeys.length - 1; i >= 0; i--) {
            processKey(mapSchemaKeys[i]);
        }

        return historyEntry;
    }

    function composeHistoryRecords(data, _options) {
        var historyRecords = [];
        var date = new Date();
        var dataKeys = Object.keys(data);
        var contentType = _options.contentType;
        var arrayDataKey;
        var historyEntry;
        var keyArray;
        var keyValue;
        var name;
        var key;
        var i;
        var j;

        for (i = dataKeys.length - 1; i >= 0; i--) {
            key = dataKeys[i];

            if (key.indexOf('.') !== -1) {
                keyArray = key.split('.');

                if (!data[keyArray[0]]) {
                    data[keyArray[0]] = {};
                }

                data[keyArray[0]][keyArray[1]] = data[key];
                dataKeys.unshift(keyArray[0]);
                i++;

                continue;
            }

            keyValue = {
                key  : key,
                value: data[key]
            };

            if (data[key]) {
                if (typeof data[key] === 'object' && !(data[key] instanceof objectId) && !(data[key] instanceof Date)) {
                    arrayDataKey = Object.keys(data[key]);
                    j = arrayDataKey.length - 1;

                    for (j; j >= 0; j--) {
                        name = arrayDataKey[j];
                        keyValue.value = {};
                        keyValue.value[name] = data[key][name];

                        historyEntry = generateHistoryEntry(contentType, keyValue);

                        if (historyEntry) {
                            historyEntry.editedBy = objectId(_options.userId);
                            historyEntry.contentId = objectId(_options.contentId);
                            historyEntry.date = date;

                            historyRecords.push(historyEntry);
                        }

                        delete data[key][name];
                    }
                } else {
                    historyEntry = generateHistoryEntry(contentType, keyValue);

                    if (historyEntry) {

                        historyEntry.editedBy = objectId(_options.userId);
                        historyEntry.contentId = objectId(_options.contentId);
                        historyEntry.date = date;

                        historyRecords.push(historyEntry);
                    }
                }
            }

        }

        return historyRecords;
    }

    function getHistoryForTrackedObject(options, callback) {
        var query = {};
        var matchObject = {};
        var queryObj = {};
        var HistoryEntry;
        var forNote;
        var dbName;
        var filter;
        var err;
        var _id;
        var id;

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (typeof callback !== 'function') {
            callback = function () {
            };
        }

        dbName = options.dbName;
        delete options.dbName;

        if (!dbName) {
            err = new Error('Invalid input parameters');
            err.status = 400;

            return callback(err);
        }

        HistoryEntry = models.get(dbName, 'History', HistoryEntrySchema);

        forNote = !!options.forNote;
        id = options.id;
        _id = options._id;
        filter = options.filter || {};

        if (_id) {
            query._id = _id;
            matchObject._id = _id;
            queryObj._id = _id;
        } else {
            query.contentId = id;
            matchObject.contentId = id;
            matchObject.isRef = {$ne: true};
            queryObj.contentId = id;
        }

        function getFunctionToGetForRefField(fieldDescription) {
            var fieldCollection = fieldDescription.collection;
            var changedField = fieldDescription.name;
            var project = fieldDescription.project;

            return function getHistoryWithPopulation(cb) {

                query.changedField = changedField;

                HistoryEntry.aggregate([{
                    $match: query
                }, {
                    $match: filter
                }, {
                    $lookup: {
                        from        : 'Users',
                        localField  : 'editedBy',
                        foreignField: '_id',
                        as          : 'editedBy'
                    }
                }, {
                    $lookup: {
                        from        : fieldCollection,
                        localField  : 'newValue',
                        foreignField: '_id',
                        as          : 'tmp'
                    }
                }, {
                    $project: {
                        editedBy      : {$arrayElemAt: ['$editedBy', 0]},
                        tmp           : {$arrayElemAt: ['$tmp', 0]},
                        newValue      : 1,
                        prevValue     : 1,
                        date          : 1,
                        changedField  : 1,
                        contentId     : 1,
                        collectionName: 1
                    }
                }, {
                    $project: {
                        'editedBy.login': '$editedBy.login',
                        'editedBy._id'  : '$editedBy._id',
                        newValue        : project,
                        prevValue       : 1,
                        date            : 1,
                        changedField    : 1,
                        contentId       : 1,
                        collectionName  : 1
                    }
                }, {
                    $lookup: {
                        from        : fieldCollection,
                        localField  : 'prevValue',
                        foreignField: '_id',
                        as          : 'tmp'
                    }
                }, {
                    $project: {
                        editedBy      : 1,
                        tmp           : {$arrayElemAt: ['$tmp', 0]},
                        newValue      : 1,
                        prevValue     : 1,
                        date          : 1,
                        changedField  : 1,
                        contentId     : 1,
                        collectionName: 1
                    }
                }, {
                    $project: {
                        editedBy      : 1,
                        newValue      : 1,
                        prevValue     : project,
                        date          : 1,
                        changedField  : 1,
                        _id           : 0,
                        contentId     : 1,
                        collectionName: 1
                    }
                }], function (err, result) {
                    if (typeof cb === 'function') {
                        cb(err, result);
                    }
                });
            };
        }

        function getHistoryWithoutPopulation(cb) {

            HistoryEntry.aggregate([{
                $match: matchObject
            }, {
                $match: filter
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'editedBy',
                    foreignField: '_id',
                    as          : 'editedBy'
                }
            }, {
                $project: {
                    editedBy      : {$arrayElemAt: ['$editedBy', 0]},
                    newValue      : 1,
                    prevValue     : 1,
                    date          : 1,
                    changedField  : 1,
                    contentId     : 1,
                    collectionName: 1
                }
            }, {
                $project: {
                    'editedBy.login': '$editedBy.login',
                    'editedBy._id'  : '$editedBy._id',
                    newValue        : 1,
                    prevValue       : 1,
                    date            : 1,
                    changedField    : 1,
                    _id             : 0,
                    contentId       : 1,
                    collectionName  : 1
                }
            }], function (err, result) {
                if (typeof callback === 'function') {
                    cb(err, result);
                }
            });
        }

        HistoryEntry.findOne(queryObj, function (err, res) {
            var contentType;
            var mapSchema;
            var mapSchemaKeys;
            var parallel = [];
            var parallelFunc;
            var field;
            var key;
            var i;

            if (res) {
                contentType = res.contentType;
                mapSchema = historyMapper[contentType.toUpperCase()];
                mapSchemaKeys = Object.keys(mapSchema.map);

                for (i = mapSchemaKeys.length - 1; i >= 0; i--) {
                    key = mapSchemaKeys[i];
                    field = mapSchema.map[key];

                    if (field.isRef) {
                        parallelFunc = getFunctionToGetForRefField(field);
                        parallel.push(parallelFunc);
                    }
                }

                parallel.push(getHistoryWithoutPopulation);

                async.parallel(parallel, function (errr, results) {
                    var emptyArr = [];
                    var responseArr = emptyArr.concat.apply(emptyArr, results);

                    responseArr = _.sortBy(responseArr, 'date');

                    if (!forNote) {
                        responseArr = _.groupBy(responseArr, 'date');
                    }

                    callback(errr, responseArr);
                });
            } else {
                callback(null, []);
            }
        });

    }

    return new function () {
        this.addEntry = function (options, callback) {
            var _options = {};
            var createdEntries = [];
            var historyRecords;
            var HistoryEntry;
            var dbName;
            var data;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            if (!_options.userId && !_options.contentId) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            // contentName = _options.contentName;

            dbName = _options.dbName;
            delete _options.dbName;

            data = _options.data;
            delete _options.data;

            if (!dbName || !data) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            HistoryEntry = models.get(dbName, 'History', HistoryEntrySchema);

            historyRecords = composeHistoryRecords(data, _options);

            if (historyRecords.length) {
                async.each(historyRecords, function (historyRecord, cb) {
                    HistoryEntry.aggregate([{
                        $match: {
                            changedField: historyRecord.changedField,
                            contentId   : historyRecord.contentId
                        }
                    }, {
                        $sort: {
                            date: -1
                        }
                    }, {
                        $limit: 1
                    }], function (err, result) {
                        var historyItem;

                        if (err) {
                            console.log(err);
                            return cb();
                        }

                        if (result.length) {
                            historyRecord.prevValue = result[0].newValue;
                        } else {
                            historyRecord.prevValue = null;
                        }

                        if (historyRecord.prevValue || historyRecord.newValue) {
                            if (historyRecord.prevValue && historyRecord.prevValue.toString() !== historyRecord.newValue.toString()) {
                                historyItem = new HistoryEntry(historyRecord);
                            } else if (!historyRecord.prevValue) {
                                historyItem = new HistoryEntry(historyRecord);
                            }

                            if (historyItem) {
                                historyItem.save(function (error, res) {
                                    if (error) {
                                        return console.log(error);
                                    }

                                    if (res) {
                                        createdEntries.push(res);
                                    }

                                    cb();
                                });
                            } else {
                                cb();
                            }

                        } else {
                            cb();
                        }
                    });
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, createdEntries);
                });

            } else {
                callback(null, createdEntries);
            }
        };

        this.deleteHistory = function (options, callback) {
            var dbName;
            var err;
            var HistoryEntry;

            if (typeof callback !== 'function') {
                callback = function () {
                }
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            HistoryEntry = models.get(dbName, 'History', HistoryEntrySchema);
            HistoryEntry.remove(options, function (err, response) {
                if (err) {
                    return callback(err);
                }

                callback(null, response);
            });
        };

        this.getHistoryForTrackedObject = getHistoryForTrackedObject;
    };
};
