var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';

    var WeeklySchedulerSchema = mongoose.Schemas.weeklyScheduler;

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;

        var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);

        WeeklyScheduler.find({}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getForDd = function (req, res, next) {
        var db = req.session.lastDb;
        var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);

        WeeklyScheduler.find({}, {name: 1}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);
        var weeklyScheduler;

        weeklyScheduler = new WeeklyScheduler(req.body);
        weeklyScheduler.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.delete = function (req, res, next) {
        var db = req.session.lastDb;
        var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);
        var id = req.params.id;

        WeeklyScheduler.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb;
        var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);
        var id = req.params.id;
        var data = req.body;

        WeeklyScheduler.findByIdAndUpdate(id, data, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

};

module.exports = Module;
