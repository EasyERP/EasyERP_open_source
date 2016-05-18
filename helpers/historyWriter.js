var mongoose = require('mongoose');
var historyMapper = require('../constants/historyMapper');

var History = function (models) {
    'use strict';

    var HistoryEntrySchema = mongoose.Schemas.History;

    this.addEntry = function (options, callback) {
        var trackedObj = options.trackedObj;
        var contetntType = options.contentType;
        var data = options.data;
        var dbIndex = options.req.session.lastDb;

        var date = Date.now();

        var HistoryEntry = models.get(dbIndex, 'History', HistoryEntrySchema);

        data.forEach(function (field) {
            var query = generateQuery(contetntType, field);
            query.editedBy = req.session.uId;
            query.date = date;
        });

        var query = generateQuery(contetntType, data);

        query.editedBy = options.req.session.uId;

        HistoryEntry.findOneAndUpdate({trackedObj: trackedObj}, query, {upsert: true}, function (err, res) {
            if (err) {
                console.log(err)
            } else if (typeof callback === 'function') {
                callback();
            }
        });
    };

};

module.exports = History;
