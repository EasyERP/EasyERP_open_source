var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var historyMapper = require('../constants/historyMapper');
var async = require('async');
var _ = require('../public/js/libs/underscore/underscore');

var History = function (models) {
    'use strict';

    var HistoryEntrySchema = mongoose.Schemas.History;

    function generateHistoryEntry(contentType, keyValue) {
        var mapSchema = historyMapper[contentType.toUpperCase()];
        var mapSchemaKeys = Object.keys(mapSchema.map);
        var historyEntry;
        var mappedValue;
        var i;

        function processKey(keyPath) {
            var keys = keyPath.split('.');
            var val;

            if (keys[0] === keyValue.key && (keys.length === 1 || keys[1] === Object.keys(keyValue.value)[0]) ) {
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
                    historyEntry.newValue = objectId(val); // toDo need to be investigated, sometimes an error occurs
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

    this.addEntry = function (options, callback) {
        var contentType = options.contentType;
        var data = options.data;
        var historyRecords = [];
        var date = new Date();
        var HistoryEntry = models.get(options.req.session.lastDb, 'History', HistoryEntrySchema);
        var dataKeys = Object.keys(data);
        var keyValue;
        var historyEntry;
        var key;
        var i;
        var keyArray;
        var arrayDataKey;
        for (i = dataKeys.length - 1; i >= 0; i--) {
            key = dataKeys[i];

        }


        for (i = dataKeys.length - 1; i >= 0; i--) {

            key = dataKeys[i];

            if (key.indexOf('.') !== -1) {
                keyArray = key.split('.');
                if (!data[keyArray[0]]){
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
                if (typeof data[key] === 'object' && !data[key]._bsontype) {
                    arrayDataKey = Object.keys(data[key]);
                    arrayDataKey.forEach(function (elem, index) {
                        var name = arrayDataKey[index];

                        keyValue.value = {};
                        keyValue.value[name] = data[key][name];
                        historyEntry = generateHistoryEntry(contentType, keyValue);

                        if (historyEntry) {

                            historyEntry.editedBy = objectId(options.req.session.uId);
                            historyEntry.contentId = objectId(options.contentId);
                            historyEntry.date = date;

                            historyRecords.push(historyEntry);
                        }
                        delete data[key][name];
                    });
                } else {
                    historyEntry = generateHistoryEntry(contentType, keyValue);

                    if (historyEntry) {

                        historyEntry.editedBy = objectId(options.req.session.uId);
                        historyEntry.contentId = objectId(options.contentId);
                        historyEntry.date = date;

                        historyRecords.push(historyEntry);
                    }
                }
            }

        }

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
                        cb();
                    } else {
                        if (result.length) {
                            historyRecord.prevValue = result[0].newValue;
                        } else {
                            historyRecord.prevValue = null;
                        }

                        if (historyRecord.prevValue || historyRecord.newValue) {
                            historyItem = new HistoryEntry(historyRecord);

                            historyItem.save(function (error, res) {
                                if (error) {
                                    console.log(error);
                                }
                                cb();
                            });
                        } else {
                            cb();
                        }
                    }
                });
            }, function () {
                if (typeof callback === 'function') {
                    callback();
                }
            });

        } else if (typeof callback === 'function') {
            callback();
        }
    };

    this.getHistoryForTrackedObject = function (options, callback, forNote) {
        var id = options.id;
        var HistoryEntry = models.get(options.req.session.lastDb, 'History', HistoryEntrySchema);

        function getFunctionToGetForRefField(fieldDescription) {
            var fieldCollection = fieldDescription.collection;
            var changedField = fieldDescription.name;
            var project = fieldDescription.project;

            return function getHistoryWithPopulation(cb) {

                HistoryEntry.aggregate([{
                    $match: {
                        contentId   : id,
                        changedField: changedField
                    }
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
                        editedBy    : {$arrayElemAt: ['$editedBy', 0]},
                        tmp         : {$arrayElemAt: ['$tmp', 0]},
                        newValue    : 1,
                        prevValue   : 1,
                        date        : 1,
                        changedField: 1,
                        contentId   : 1,
                        collectionName : 1
                    }
                }, {
                    $project: {
                        'editedBy.login'    : '$editedBy.login',
                        'editedBy._id'    : '$editedBy._id',
                        newValue    : project,
                        prevValue   : 1,
                        date        : 1,
                        changedField: 1,
                        contentId   : 1,
                        collectionName : 1
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
                        editedBy    : 1,
                        tmp         : {$arrayElemAt: ['$tmp', 0]},
                        newValue    : 1,
                        prevValue   : 1,
                        date        : 1,
                        changedField: 1,
                        contentId   : 1,
                        collectionName : 1
                    }
                }, {
                    $project: {
                        editedBy    : 1,
                        newValue    : 1,
                        prevValue   : project,
                        date        : 1,
                        changedField: 1,
                        _id         : 0,
                        contentId   : 1,
                        collectionName : 1
                    }
                }], function (err, result) {
                    if (typeof callback === 'function') {
                        cb(err, result);
                    }
                });
            };
        }

        function getHistoryWithoutPopulation(cb) {

            HistoryEntry.aggregate([{
                $match: {
                    contentId: id,
                    isRef    : {$ne: true}
                }
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'editedBy',
                    foreignField: '_id',
                    as          : 'editedBy'
                }
            }, {
                $project: {
                    editedBy    : {$arrayElemAt: ['$editedBy', 0]},
                    newValue    : 1,
                    prevValue   : 1,
                    date        : 1,
                    changedField: 1,
                    contentId   : 1,
                    collectionName : 1
                }
            }, {
                $project: {
                    'editedBy.login'    : '$editedBy.login',
                    'editedBy._id'    : '$editedBy._id',
                    newValue    : 1,
                    prevValue   : 1,
                    date        : 1,
                    changedField: 1,
                    _id         : 0,
                    contentId   : 1,
                    collectionName : 1
                }
            }], function (err, result) {
                if (typeof callback === 'function') {
                    cb(err, result);
                }
            });
        }

        HistoryEntry.findOne({contentId: id}, function (err, res) {
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
                    var responseArr = [].concat.apply([], results);
                    responseArr = _.sortBy(responseArr, 'date');


                    if (!forNote){
                        responseArr = _.groupBy(responseArr, 'date');
                    }
                    callback(errr, responseArr);
                });
            } else {
                callback(null, []);
            }
        });

    };
};

module.exports = History;
