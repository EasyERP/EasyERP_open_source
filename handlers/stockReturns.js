var StockReturns = function (models) {
    'use strict';

    var mongoose = require('mongoose');

    var StockReturnsService = require('../services/stockReturns.js')(models);

    var async = require('async');
    var _ = require('lodash');

    this.getAll = function(req, res, next) {
        var queryObject = {_type: 'stockReturns'};
        var dbName = req.session.lastDb;

        StockReturnsService.find(queryObject, {dbName: dbName}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getById = function (req, res, next) {
        var id = req.query.id || req.params.id;
        var dbName = req.session.lastDb;

        if (id.length < 24) {
            return res.status(400).send();
        }

        StockReturnsService.findById(id, {dbName: dbName}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };
};

module.exports = StockReturns;
