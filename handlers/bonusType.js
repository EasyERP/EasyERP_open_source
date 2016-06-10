var mongoose = require('mongoose');

var BonusType = function (models) {
    'use strict';

    var bonusTypeSchema = mongoose.Schemas.bonusType;

    var async = require('async');
    var pageHelper = require('../helpers/pageHelper');

    this.create = function (req, res, next) {
        var BonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);
        var body = req.body;
        var bonusType = new BonusTypeModel(body);

        bonusType.save(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: result});
        });

    };

    this.patchM = function (req, res, next) {
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);
        var body = req.body;

        async.each(body, function (data, cb) {
            var id = data._id;

            delete data._id;
            bonusTypeModel.findByIdAndUpdate(id, {$set: data}, {new: true}, cb);
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
        });
    };

    this.getList = function (req, res, next) {
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);
        var data = req.query;
        var sort = data.sort || {};
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var parallelTasks;

        var getTotal = function (pCb) {

            bonusTypeModel.count(function (err, _res) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, _res);
            });
        };

        var getData = function (pCb) {
            bonusTypeModel.find().skip(skip).limit(limit).sort(sort).exec(function (err, _res) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, _res);
            });
        };

        parallelTasks = [getTotal, getData];

        async.parallel(parallelTasks, function (err, result) {
            var count;
            var response = {};

            if (err) {
                return next(err);
            }

            count = result[0] || 0;

            response.total = count;
            response.data = result[1];

            res.status(200).send(response);
        });

    };

    this.remove = function (req, res, next) {
        var id = req.params._id;
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);

        bonusTypeModel.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: result});
        });
    };

    this.bulkRemove = function (req, res, next) {
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        bonusTypeModel.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };

    this.getForDD = function (req, res, next) {
        var Bonus = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);

        Bonus
            .find()
            .select('_id name')
            .sort({name: 1})
            .lean()
            .exec(function (err, bonusTypes) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: bonusTypes});
            });
    };
};

module.exports = BonusType;
