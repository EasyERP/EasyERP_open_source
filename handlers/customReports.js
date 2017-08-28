var mongoose = require('mongoose');

var customReports = function (models) {
    'use strict';
    var async = require('async');

    var customReportsService = require('../services/customReports')(models);

    this.create = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var user = req.session.uId;
        var error;

        if (!body.name) {
            error = new Error('Not enough parameters');
            error.status = 400;

            return next(error);
        }

        body.dbName = dbName;
        body.createdBy = {
            user: user
        };

        body.editedBy = {
            user: user
        };

        customReportsService.create(body, function (err, createdReport) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Custom report created success'});
        });

    };

    this.get = function (req, res, next) {
        var dbName = req.session.lastDb;
        var user = req.session.uId;

        var parallelTasks;
        var getCreatedByMe;
        var getPrivate;
        var getPublic;
        var getAll;
        var getRecent;

        getCreatedByMe = function (pCb) {
            var query = {'createdBy.user': user};

            customReportsService.get({dbName: dbName, query: query}, pCb);
        };

        getPrivate = function (pCb) {
            var query = {publicAccess: false};

            customReportsService.get({dbName: dbName, query: query}, pCb);
        };

        getPublic = function (pCb) {
            var query = {publicAccess: true};

            customReportsService.get({dbName: dbName, query: query}, pCb);
        };

        getAll = function (pCb) {
            var query = {};

            customReportsService.get({dbName: dbName, query: query}, pCb);
        };

        getRecent = function (pCb) {
            customReportsService.get({dbName: dbName})
                .sort({recentDate: -1})
                .limit(5)
                .exec(pCb);
        };

        parallelTasks = [getCreatedByMe, getPrivate, getPublic, getAll, getRecent];

        async.parallel(parallelTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send([{
                _id        : null,
                createdByMe: result[0] || [],
                private    : result[1] || [],
                public     : result[2] || [],
                all        : result[3] || [],
                recent     : result[4] || []
            }]);
        });

    };
};

module.exports = customReports;
