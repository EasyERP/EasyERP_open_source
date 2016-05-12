var mongoose = require('mongoose');

var Invoice = function (models) {
    "use strict";

    var WeeklySchedulerSchema = mongoose.Schemas.weeklyScheduler;

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                var WeeklyScheduler = models.get(db, 'weeklyScheduler', WeeklySchedulerSchema);

                if (access) {

                    WeeklyScheduler.find({}, function(err, res) {
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