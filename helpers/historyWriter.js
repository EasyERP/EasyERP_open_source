var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var historyMapper = require('../constants/historyMapper');
var async = require('async');

var History = function (models) {
    'use strict';

    var HistoryEntrySchema = mongoose.Schemas.History;

    function generateHistoryEntry(contetntType, keyValue) {
        var mapSchema = historyMapper[contetntType.toUpperCase()];
        var mapSchemaKeys = Object.keys(mapSchema.map);
        var historyEntry;
        var i;

        function processKey(keyPath) {
            var keys = keyPath.split('.');
            var val;

            if (keys[0] === keyValue.key) {
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

                historyEntry = {
                    collectionName: mapSchema.collectionName,
                    contetntType  : contetntType,
                    newValue      : val,
                    changedField  : mapSchema.map[keyPath].name
                };
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
        var contetntType = options.contentType;
        var data = options.data;
        var historyRecords = [];
        var date = new Date();
        var HistoryEntry = models.get(options.req.session.lastDb, 'History', HistoryEntrySchema);
        var dataKeys = Object.keys(data);
        var keyValue;
        var historyEntry;
        var key;
        var i;

        for (i = dataKeys.length - 1; i >= 0; i--) {
            key = dataKeys[i];
            keyValue = {
                key  : key,
                value: data[key]
            };
            historyEntry = generateHistoryEntry(contetntType, keyValue);

            if (historyEntry) {

                historyEntry.editedBy = ObjectId(options.req.session.uId);
                historyEntry.contentId = ObjectId(options.trackedObj);
                historyEntry.date = date;

                historyRecords.push(historyEntry);
            }
        }

        if (historyRecords.length) {

            async.each(historyRecords, function (historyRecord, cb) {
                HistoryEntry.aggregate([{
                    $match: {
                        changedField: historyRecord.changedField,
                        contentId  : historyRecord.contentId
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

                        HistoryEntry.collection.insert(historyRecord, function (error, res) {
                            if (error) {
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
                contentId: id
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
                // populateFields(result, callback);
                callback(err, result);
            }
        });


    };
};

module.exports = History;
