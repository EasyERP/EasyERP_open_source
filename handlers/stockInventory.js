var async = require('async');
var stockCorrections;
stockCorrections = function (models, event) {
    'use strict';

    var mongoose = require('mongoose');

    var FilterMapper = require('../helpers/filterMapper');
    var AvailabilityService = require('../services/productAvailability')(models);

    this.getList = function (req, res, next) {
        var data = req.query;
        var limit = parseInt(data.count, 10);
        var skip = (parseInt(data.page || 1, 10) - 1) * limit;
        var obj = {};
        var filterMapper = new FilterMapper();
        var keys;
        var sort;
        var options;

        if (data && data.filter) {
            obj.$and = [];
            obj.$and.push(filterMapper.mapFilter(data.filter, 'DealTasks'));
        }

        if (data.sort) {
            keys = Object.keys(data.sort)[0];
            data.sort[keys] = parseInt(data.sort[keys], 10);
            sort = data.sort;
        } else {
            sort = {'dueDate': -1};
        }

        options = {
            sort  : sort,
            dbName: req.session.lastDb,
            skip  : skip,
            limit : limit,
            match : obj
        };

        AvailabilityService.getList(options, function (err, result) {
            var count;
            var response = {};

            if (err) {
                return next(err);
            }

            count = result[0] && result[0].total ? result[0].total : 0;

            response.total = count;
            response.data = result;
            res.status(200).send(response);
        });

    };

    this.transfer = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var id = req.params.id;
        var availabilities = body.availabilities;

        var options = {
            body   : body,
            dbName : dbName,
            id     : id,
            options: {new: true}
        };

        delete body.availabilities;

        AvailabilityService.updateById(options, function (err, doc) {
            if (err) {
                return next(err);
            }

            AvailabilityService.updateByQuery({
                dbName: dbName,
                query : {
                    location     : doc.location,
                    product      : doc.product,
                    onHand       : 0,
                    goodsOutNotes: {$size: 0},
                    orderRows    : {$size: 0}
                },

                body: {$set: {archived: true}}
            }, function (err) {
                if (err) {
                    return next(err);
                }

                async.each(availabilities, function (elem, eachCb) {

                    function callback(err, doc) {
                        if (err) {
                            return eachCb(err);
                        }
                        eachCb();
                    }

                    AvailabilityService.find({
                        dbName: dbName,
                        query : {
                            product    : doc.product,
                            location   : elem.location,
                            goodsInNote: doc.goodsInNote
                        }
                    }, function (err, docs) {
                        var existedAvailability;

                        if (err) {
                            return eachCb(err);
                        }

                        if (docs && docs.length) {
                            existedAvailability = docs[0];
                            AvailabilityService.updateById({
                                dbName: dbName,
                                id    : existedAvailability._id,
                                body  : {
                                    $inc: {
                                        onHand: elem.quantity
                                    }
                                }
                            }, callback);
                        } else {
                            AvailabilityService.create({
                                dbName: dbName,
                                body  : {
                                    product    : doc.product,
                                    location   : elem.location,
                                    goodsInNote: doc.goodsInNote,
                                    warehouse  : doc.warehouse,
                                    onHand     : elem.quantity,
                                    cost       : doc.cost,
                                    isJob      : false
                                }
                            }, callback);
                        }
                    });

                }, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(doc);
                });
            });

        });

    };
};

module.exports = stockCorrections;
