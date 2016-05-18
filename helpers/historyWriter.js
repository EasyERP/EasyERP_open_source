var mongoose = require('mongoose');
var historyMapper = require('../constants/historyMapper');

var History = function (models) {
    'use strict';

    var HistoryEntrySchema = mongoose.Schemas.History;

    function generateHistoryEntry(contetntType, keyValue) {
        var mapSchema = historyMapper[contetntType.toUpperCase()];
        var historyEntry;

        Object.keys(mapSchema.map).forEach(function(keyPath) {
            var keys = keyPath.split('.');

            if (keys[0] === keyValue.key) {
                var val = keyValue.value;

                if (keys.length > 1) {
                    keys.shift();
                    keys.forEach(function(key) {
                        if (val.hasOwnProperty(key)) {
                            val = val[key];
                        } else {
                            return null;
                        }
                    });
                }
                historyEntry = {
                    collectionName: mapSchema.collectionName,
                    contetntType: contetntType,
                    newValue: val,
                    changedField: mapSchema.map[keyPath]
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
                key: key,
                value: data[key]
            };
            var historyEntry = generateHistoryEntry(contetntType, keyValue);

            if (historyEntry) {

                historyEntry.editedBy = options.req.session.uId;
                historyEntry.trackedObj = options.trackedObj;
                historyEntry.date = date;

                historyRecords.push(historyEntry);
            }
        });

        if (historyRecords.length) {
            HistoryEntry.collection.insert(historyRecords, function (err, res) {
                if (err) {
                    console.log(err);
                } else if (typeof callback === 'function') {
                    callback();
                }
            });
        } else if (typeof callback === 'function') {
            callback();
        }
    };
};

module.exports = History;
