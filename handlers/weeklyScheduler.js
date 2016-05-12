var mongoose = require('mongoose');

var Invoice = function (models) {
    "use strict";

    var WeeklySchedulerSchema = mongoose.Schemas.weeklyScheduler;
    var access = require("../Modules/additions/access.js")(models);

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);

                if (access) {

                    WeeklyScheduler.find({}, function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);
                var weeklyScheduler;

                if (access) {

                    weeklyScheduler = new WeeklyScheduler(req.body);
                    weeklyScheduler.save(function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.delete = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);
                var id = req.params.id;

                if (access) {

                    WeeklyScheduler.findByIdAndRemove(id, function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);
                var id = req.params.id;
                var data = req.body;

                if (access) {

                    WeeklyScheduler.findByIdAndUpdate(id, data, function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

};

module.exports = Invoice;