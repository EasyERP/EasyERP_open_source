var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var historyMapper = require('../constants/historyMapper');
var async = require('async');

var History = function (models) {
    'use strict';

    var HistoryEntrySchema = mongoose.Schemas.History;

    function generateHistoryEntry(contetntType, keyValue) {
        var mapSchema = historyMapper[contetntType.toUpperCase()];
        var historyEntry;

        Object.keys(mapSchema.map).forEach(function (keyPath) {
            var keys = keyPath.split('.');

            if (keys[0] === keyValue.key) {
                var val = keyValue.value;

                if (keys.length > 1) {
                    keys.shift();
                    keys.forEach(function (key) {
                        if (val.hasOwnProperty(key)) {
                            val = val[key];
                        } else {
                            return null;
                        }
                    });
                }
                historyEntry = {
                    collectionName: mapSchema.collectionName,
                    contetntType  : contetntType,
                    newValue      : val,
                    changedField  : mapSchema.map[keyPath]
                };
            } else {
                return null;
            }
        });

        return historyEntry;
    }

    this.addEntry = function (options, callback) {
        var contetntType = options.contentType;
        var data = options.data;
        var historyRecords = [];
        var date = Date.now();
        var HistoryEntry = models.get(options.req.session.lastDb, 'History', HistoryEntrySchema);

        Object.keys(data).forEach(function (key) {
            var keyValue = {
                key  : key,
                value: data[key]
            };
            var historyEntry = generateHistoryEntry(contetntType, keyValue);

            if (historyEntry) {

                historyEntry.editedBy = ObjectId(options.req.session.uId);
                historyEntry.trackedObj = ObjectId(options.trackedObj);
                historyEntry.date = date;

                historyRecords.push(historyEntry);
            }
        });

        if (historyRecords.length) {

            async.each(historyRecords, function (historyRecord, cb) {
                HistoryEntry.aggregate([{
                    $match: {
                        changedField: historyRecord.changedField,
                        trackedObj  : historyRecord.trackedObj
                    }
                }, {
                    $sort: {
                        date: -1
                    }
                }, {
                    $limit: 1
                }], function (err, result) {
                    if (err) {
                        console.log(err);
                        cb();
                    } else {
                        if (result.length) {
                            historyRecord.prevValue = result[0].newValue;
                        } else {
                            historyRecord.prevValue = null;
                        }

                        HistoryEntry.collection.insert(historyRecord, function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            cb();
                        });
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

    this.getHistoryForTrackedObject = function (options, callback) {
        var id = options.id;
        var HistoryEntry = models.get(options.req.session.lastDb, 'History', HistoryEntrySchema);

        HistoryEntry.aggregate([{
            $match: {
                trackedObj: id
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
                editedBy    : {$arrayElemAt: ["$editedBy", 0]},
                date        : 1,
                changedField: 1,
                prevValue   : 1,
                newValue    : 1
            }
        }, {
            $group: {
                _id   : '$date',
                editedBy: {$first: '$editedBy.login'},
                events: {
                    $push: {
                        field   : '$changedField',
                        prevVal : '$prevValue',
                        newVal  : '$newValue'
                    }
                }

            }
        }], function (err, result) {
            if (typeof callback === 'function') {
                callback(err, result);
            }
        });


    };
};

module.exports = History;
