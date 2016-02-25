var mongoose = require('mongoose');
var chartOfAccountSchema = mongoose.Schemas['chartOfAccount'];
var journalSchema = mongoose.Schemas['journal'];

var _ = require('underscore');

var Module = function (models) {
    var access = require("../Modules/additions/access.js")(models);

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
        var body = req.body;
        var journal = new Model(body);

        var data = req.query;
        var sort = data.sort || {_id: 1};

        access.getReadAccess(req, req.session.uId, 85, function (access) {
            if (access) {
                Model
                    .find({})
                    .sort(sort)
                    .populate('debitAccount', '_id name')
                    .populate('creditAccount', '_id name')
                    .exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });
            } else {
                res.status(403).send();
            }
        });
    };

    this.getForDd = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journal', journalSchema);
        var query = req.query;

        access.getReadAccess(req, req.session.uId, 85, function (access) {
            if (access) {
                Model
                    .find(query, {_id: 1, name: 1})
                    .sort({name: 1})
                    .exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({data: result});
                    });
            } else {
                res.status(403).send();
            }
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
};

module.exports = Module;
