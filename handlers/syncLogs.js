var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Module = function (models) {
    'use strict';
    var SyncLogsService = require('../services/syncLogs')(models);
    var SyncLogsSchema = mongoose.Schemas.syncLogs;

    this.getForDd = function (req, res, next) {
        var SyncLogs = models.get(req.session.lastDb, 'syncLogs', SyncLogsSchema);
        var id = req.query && req.query.id;
        var query = {};

        id && (query.channel = ObjectId(id));

        SyncLogs
            .find(query)
            .populate('user')
            .populate('channel')
            .sort({date: -1})
            .limit(5)
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
    };

    this.getStats = function (req, res, next) {
        var query = req.query;
        var SyncLogs = models.get(req.session.lastDb, 'syncLogs', SyncLogsSchema);
        var channels = query.channels;

        SyncLogs.aggregate([{}]).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result/*{data: result[0]}*/);
        });

    };

    this.getLastById = function (req, res, next) {
        var SyncLogs = models.get(req.session.lastDb, 'syncLogs', SyncLogsSchema);
        var id = req.query.id;
        var opts = {
            db: req.session.lastDb
        };

        id && (opts.id = id);

        SyncLogsService.getLastById(opts, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };
};

module.exports = Module;
