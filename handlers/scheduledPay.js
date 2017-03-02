var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';

    var ScheduledPaySchema = mongoose.Schemas.scheduledPay;

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;

        var ScheduledPay = models.get(db, 'scheduledPay', ScheduledPaySchema);

        ScheduledPay.find({}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getForDd = function (req, res, next) {
        var db = req.session.lastDb;
        var ScheduledPay = models.get(db, 'scheduledPay', ScheduledPaySchema);

        ScheduledPay.find({}, {name: 1}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var ScheduledPay = models.get(db, 'scheduledPay', ScheduledPaySchema);
        var scheduledPay;

        scheduledPay = new ScheduledPay(req.body);
        scheduledPay.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.delete = function (req, res, next) {
        var db = req.session.lastDb;
        var ScheduledPay = models.get(db, 'scheduledPay', ScheduledPaySchema);
        var id = req.params.id;

        ScheduledPay.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb;
        var ScheduledPay = models.get(db, 'scheduledPay', ScheduledPaySchema);
        var id = req.params.id;
        var data = req.body;

        ScheduledPay.findByIdAndUpdate(id, data, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

};

module.exports = Module;
