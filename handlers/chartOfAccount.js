var mongoose = require('mongoose');
var chartOfAccountSchema = mongoose.Schemas.chartOfAccount;
var accountTypesSchema = mongoose.Schemas.accountTypes;
var async = require('async');
var _ = require('lodash');

var Chart = function (models) {
    var pageHelper = require('../helpers/pageHelper');

    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);
        var body = req.body;
        var newModel;

        if (!body.code || !body.account) {
            return res.status(400).send();
        }

        body.name = body.code + ' ' + body.account;
        newModel = new Model(body);

        newModel.save(function (err, model) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: model});
        });
    };

    this.createAccountType = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'accountTypes', accountTypesSchema);
        var body = req.body;
        var newModel;

        if (!body.name) {
            return res.status(400).send();
        }

        newModel = new Model(body);

        newModel.save(function (err, model) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: model});
        });
    };

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);
        var data = req.query;
        var sort = data.sort ? data.sort : {_id: 1};
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var getTotal;
        var getData;
        var sortKey;
        var key;
        var i;

        if (data.sort) {
            sort = {};
            sortKey = Object.keys(data.sort);
            for (i = sortKey.length - 1; i >= 0; i--) {
                key = sortKey[i];
                sort[key] = parseInt(data.sort[key], 10);
            }
        }

        getTotal = function (cb) {
            Model
                .find({})
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        getData = function (cb) {

            Model.find({})
                .lean()
                .sort(sort)
                .populate('type', 'name')
                .exec(function (err, result) {
                    var groupedRusult;
                    var keys;
                    var array = [];
                    var newResult = [];

                    if (err) {
                        return cb(err);
                    }

                 /*   groupedRusult = _.groupBy(result, 'subAccount');
                    keys = Object.keys(groupedRusult);

                    keys.forEach(function (subId) {

                        var parent = _.find(result, function (el) {
                            return el._id.toString() === subId.toString();
                        });

                        if (parent) {
                            if (!parent.children) {
                                parent.children = [];
                            }

                            parent.children = parent.children.concat(groupedRusult[subId]);
                            delete groupedRusult[subId];
                        }

                    });

                    result.forEach(function (elem) {
                        if (elem.children) {
                            elem.children.forEach(function (item) {
                                var parent = _.find(result, function (el) {
                                    return el._id ? item._id.toString() === el._id.toString() : false;
                                });

                                if (parent && parent.children) {
                                    item.children = parent.children;
                                }
                            });

                        }

                        array.push(elem);
                    });

                    array.forEach(function (id) {
                        if (!id.subAccount) {
                            newResult.push(id);
                        }
                    });*/

                    cb(null, result);
                });
        };

        async.parallel([getTotal, getData], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({total: result[0], data: result[1]});
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        async.each(body, function (data, cb) {
            var id = data._id;

            data.editedBy = {
                user: uId,
                date: new Date().toISOString()
            };
            delete data._id;
            // data.name = data.code + ' ' + data.account;

            Model.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, model) {
                if (err) {
                    return cb(err);
                }

                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        Model.findByIdAndRemove(id, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: removed});
        });
    };

    this.bulkRemove = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        Model.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };

    this.getForDd = function (req, res, next) {
        var query;
        var data = req.query;
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        query = Model.find(data);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

};

module.exports = Chart;
