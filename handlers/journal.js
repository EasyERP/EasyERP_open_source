var mongoose = require('mongoose');
var journalSchema = mongoose.Schemas.journal;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journal', journalSchema);
        var body = req.body;
        var journal = new Model(body);

        journal.save(function (err, _journal) {
            if (err) {
                return next(err);
            }

            res.status(201).send(_journal);
        });
    };

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journal', journalSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;

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
            Model
                .find({})
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('debitAccount', '_id name')
                .populate('creditAccount', '_id name')
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

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

    this.getForDd = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journal', journalSchema);
        var query = req.query;

        Model
            .find(query, {_id: 1, name: 1, debitAccount: 1, creditAccount: 1})
            .populate('debitAccount', 'name')
            .populate('creditAccount', 'name')
            .sort({name: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
    };

    this.getWriteOff = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journal', journalSchema);

        Model
            .find({transaction: 'WriteOff'}, {_id: 1, name: 1})
            .sort({name: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
    };

    this.getByAccount = function (req, res, next) {
        var body = req.query;
        var Model = models.get(req.session.lastDb, 'journal', journalSchema);
        var transaction = body.transaction;
        var debitAccount = body.debitAccount;
        var creditAccount = body.creditAccount;
        var query = {};

        if (transaction) {
            query.transaction = transaction;
        }

        if (debitAccount) {
            query.debitAccount = debitAccount;
        }

        if (creditAccount) {
            query.creditAccount = creditAccount;
        }

        Model.find(query, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result || []});
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Model = models.get(req.session.lastDb, 'journal', journalSchema);

        async.each(body, function (data, cb) {
            var id = data._id;

            data.editedBy = {
                user: uId,
                date: new Date().toISOString()
            };
            delete data._id;

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
        var Journal = models.get(req.session.lastDb, 'journal', journalSchema);

        Journal.findByIdAndRemove(id, function (err, journal) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: journal});

        });
    };

    this.bulkRemove = function (req, res, next) {
        var Journal = models.get(req.session.lastDb, 'journal', journalSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        Journal.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };
};

module.exports = Module;
