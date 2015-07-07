/**
 * Created by ����� on 23.06.2015.
 */
var mongoose = require('mongoose');
var async = require('async');

var MonthHours = function (models) {
    var MonthHoursSchema = mongoose.Schemas['MonthHours'];
    var access = require("../Modules/additions/access.js")(models);

    this.create = function(req, res, next){
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var body = req.body;
        var monthHours = new  MonthHoursModel(body);

        monthHours.save(function(err, monthHours){
            if (err){
                return next(err);
            }
            res.status(200).send(monthHours);
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
                        monthHoursModel.findByIdAndUpdate(id, {$set: data}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

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
        var count = req.query.count ? req.query.count : 50;
        var page = req.query.page;
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;
        var query = req.query;

        if (query.sort) {
            sort = query.sort;
        } else sort = {};

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

        MonthHoursModel.findByIdAndRemove(id, function (err, result) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({success: result});
            }
        });
    };
};

module.exports = MonthHours;