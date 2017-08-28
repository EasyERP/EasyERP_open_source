var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Schema.Types.ObjectId;

var workCentres = function (models, event) {
    'use strict';

    var workCentreSchema = mongoose.Schemas.workCentre;
    var routingSchema = mongoose.Schemas.routing;

    this.getById = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var workCentre = models.get(db, 'workCentres', workCentreSchema);
        var id = req.params.id;
        var query = {};
        var err;

        if (!id) {
            err = new Error();
            err.message = 'Id not found';

            return next(err);
        }

        query.id = ObjectId(id);

        workCentre.findOne(query).exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send(response);
        });
    };
    this.get = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var workCentre = models.get(db, 'workCentres', workCentreSchema);
        var sort = req.query.sort;

        workCentre.find().sort(sort).exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send(response);
        });
    };

    this.getForDD = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var workCentre = models.get(db, 'workCentres', workCentreSchema);

        workCentre.find({}, {name: 1}).exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: response});
        });
    };

    this.create = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var WorkCentre = models.get(db, 'workCentres', workCentreSchema);
        var data = req.body;
        var workCentre;

        workCentre = new WorkCentre(data);
        workCentre.save(function (error, result) {
            if (error) {
                return next(error);
            }

            res.status(200).send(result);
        });
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var workCentre = models.get(db, 'workCentres', workCentreSchema);
        var body = req.body;
        var id = req.params.id;
        var err;

        if (!id) {
            err = new Error();
            err.status = 404;
            err.message = 'Id not found';

            return next(err);
        }

        workCentre.findByIdAndUpdate(id, body, {}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.remove = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var workCentre = models.get(db, 'workCentres', workCentreSchema);
        var routing = models.get(db, 'routing', routingSchema);
        var ids = req.params.id ? [req.params.id] : null;
        var err;

        if (!ids) {
            ids = req.body.ids;
        }

        if (!ids) {
            err = new Error();
            err.status = 404;
            err.message = 'Id not found';

            return next(err);
        }

        async.each(ids, function (id, cb) {
            routing.count({'steps.workCentre': id}, function (err, count) {
                if (err) {
                    return cb(err);
                }

                if (!count) {
                    workCentre.remove({_id: id}, cb);
                } else {
                    cb();
                }
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });
    };
};

module.exports = workCentres;
