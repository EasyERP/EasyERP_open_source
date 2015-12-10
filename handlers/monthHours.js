
var mongoose = require('mongoose');
var async = require('async');

var MonthHours = function (event, models) {
    var MonthHoursSchema = mongoose.Schemas['MonthHours'];
    var access = require("../Modules/additions/access.js")(models);

    this.create = function(req, res, next){
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var body = req.body;
        var monthHours = new  MonthHoursModel(body);

        access.getEditWritAccess(req, req.session.uId, 68, function (access) {
            if (access) {

                monthHours.save(function (err, monthHours) {
                    if (err) {
                        return next(err);
                    }

                    event.emit('dropHoursCashes', req);
                    var params = {
                        req: req,
                        year: monthHours.year,
                        month: monthHours.month,
                        fixedExpense: monthHours.fixedExpense,
                        expenseCoefficient: monthHours.expenseCoefficient,
                        hours: monthHours.hours
                    };
                    event.emit('updateCost', params);
                    res.status(200).send(monthHours);
                });
            } else {
                res.status(404);
            }
        });
    };

    this.patchM = function (req, res, next) {
        var body = req.body;
        var uId;
        var monthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 68, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;
                        delete data._id;
                        monthHoursModel.findByIdAndUpdate(id, {$set: data}, {new: true}, function(err, result){
                            if (err){
                                return cb(err);
                            }
                            var params = {
                                req: req,
                                year: result.year,
                                month: result.month,
                                fixedExpense: result.fixedExpense,
                                expenseCoefficient: result.expenseCoefficient,
                                hours: result.hours
                            };
                            event.emit('updateCost', params);
                            cb(null, result);
                        });

                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        event.emit('dropHoursCashes', req);
                        res.status(200).send({success: 'updated'});
                    });
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.getList = function (req, res, next) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema );
        var sort = {};
        var count = req.query.count ? req.query.count : 100;
        var page = req.query.page;
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;
        var query = req.query;

        if (query.sort) {
            sort = query.sort;
        } else sort = {};

        access.getReadAccess(req, req.session.uId, 68, function (access) {
            if (access) {
                MonthHoursModel
                    .find()
                    .limit(count)
                    .skip(skip)
                    .sort(sort)
                    .exec(function (err, data) {
                        if (err) {
                            return next(err);
                        } else {
                            res.status(200).send(data);
                        }
                    });
            } else {
                res.status(403).send();
            }
        });
    };

    this.getData = function (req, res, next) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema );
        var queryObj = {};

        var query = req.query;


            if (query.month) {
                queryObj.month = Number(query.month);
            }
            if (query.year) {
                queryObj.year = Number(query.year);
            }

        //access.getReadAccess(req, req.session.uId, 68, function (access) { // commented for PM profile for create wTracks
        //    if (access) {
                MonthHoursModel
                    .aggregate(
                    [{
                        $match: queryObj
                    }]
                )
                    .exec(function (err, data) {
                        if (err) {
                            return next(err);
                        } else {
                            res.status(200).send(data);
                        }
                    });
        //    } else {
        //        res.status(403).send();
        //    }
        //});
    };

    this.totalCollectionLength = function(req, res, next) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        MonthHoursModel.find().count(function(err, count){
            if (err){
                next(err)
            }
            res.status(200).send( {count: count});

        });
    };

    this.remove = function(req, res, id, next) {
       var MonthHoursModel = models.get(req.session.lastDb, "MonthHours", MonthHoursSchema);

        access.getDeleteAccess(req, req.session.uId, 68, function (access) {
            if (access) {
                MonthHoursModel.findByIdAndRemove(id, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    event.emit('dropHoursCashes', req);
                    res.status(200).send({success: result});

                });
            } else {
                res.status(403).send();
            }
        });
    };

};

module.exports = MonthHours;