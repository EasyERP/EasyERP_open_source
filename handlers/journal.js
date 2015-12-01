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
        var sort = data.sort ? data.sort : {_id: 1};

        access.getReadAccess(req, req.session.uId, 82, function (access) {
            if (access) {
                Model.find({}).sort(sort).exec(function (err, result) {
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
};

module.exports = Module;
