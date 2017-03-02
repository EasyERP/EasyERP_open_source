var mongoose = require('mongoose');
var RESPONSES = require('../constants/responses');
var taxesSchema = mongoose.Schemas.taxes;
var objectId = mongoose.Types.ObjectId;
var _ = require('underscore');
var async = require('async');

var Module = function (models, event) {
    'use strict';

    this.getAll = function (req, res, next) {
        var query = models.get(req.session.lastDb, 'taxes', taxesSchema).find();

        query
            .select('_id name code rate country sequence fullName isDefault')
            .sort({isDefault: -1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };

    this.getForDd = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'taxes', taxesSchema);

        Model.aggregate([{
            $project: {
                name     : '$fullName',
                rate     : 1,
                isDefault: 1
            }
        }, {
            $sort: {isDefault: -1}
        }], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.update = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'taxes', taxesSchema);
        var body = req.body;
        var id = req.params.id;
        var updateOther = false;

        if (body.isDefault) {
            updateOther = true;
        }

        Model.findByIdAndUpdate(id, body, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }

            if (updateOther) {
                Model.update({_id: {$ne: id}}, {$set: {isDefault: false}}, {multi: true}, function (err) {
                    if (err) {
                        return next(err);
                    }
                });
            }

            res.status(200).send(result);
        });
    };

    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'taxes', taxesSchema);
        var body = req.body;
        var updateOther = false;
        var isCreate = true;
        var item;

        /*function checkDefault(wCb) {
            if (!body.isDefault) {
                return wCb();
            }

            Model.findOne({isDefault: true}, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                if (result) {
                    isCreate = false;
                }

                wCb();
            });
        }*/

        function createTax(wCb) {
            var err;

            /*if (!isCreate) {
                err = new Error('Old default tax was overwritten by new one');
                err.status = 400;

                return wCb(err);
            }*/

            Model.count({}, function (err, count) {
                body.sequence = count++;

                if (body.isDefault) {
                    updateOther = true;
                }

                item = new Model(body);
                item.save(function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    if (updateOther) {
                        Model.update({_id: {$ne: result._id}}, {$set: {isDefault: false}}, {multi: true}, function (err) {
                            if (err) {
                                return wCb(err);
                            }
                        });
                    }

                    wCb(null, result);
                });
            });
        }

        async.waterfall(
            [
                //checkDefault,
                createTax
            ], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
    };

    this.remove = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'taxes', taxesSchema);
        var id = req.params.id;

        Model.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };
};

module.exports = Module;
