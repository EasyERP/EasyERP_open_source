/**
 * Created by soundstorm on 30.06.15.
 */
var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var Vacation = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var VacationSchema = mongoose.Schemas['Vacation'];
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');

    function getVacationFilter(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 70, function (access) {
                if (access) {
                    var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
                    var options = req.query;
                    var queryObject = {};
                    var sort = {};
                    var query;

                    if (options && options.sort) {
                        sort = options.sort;
                    } else {
                        sort = {"startDate": -1};
                    }

                    if (options) {
                        if (options.sort) {
                            sort = options.sort;
                        } else {
                            sort = {"startDate": -1};
                        }
                        if (options.employee) {
                            queryObject['employee._id'] = options.employee;
                        }
                        if (options.year && options.year !== 'line') {
                            queryObject.year = options.year;
                            if (options.month) {
                                queryObject.month = options.month;
                            }
                        } else if (options.year) {
                            var date;

                            date = new Date();
                            date = moment([date.getFullYear(), date.getMonth() + 1]);
                            queryObject.endDate = {'$lte': date.toISOString()};

                            date.subtract(12, 'M');
                            queryObject.startDate = {'$gte': date.toISOString()};
                        }
                    }

                    query = Vacation.find(queryObject).sort(sort);
                    /*query = Vacation.aggregate(
                     [
                     { $match: queryObject},
                     {$sort: sort},
                     {
                     $group: {
                     _id: {employee: "$employee", month: "$month", year: "$year"}
                     //vacationArray: {$push: {"$"}}
                     }
                     }
                     ]
                     );*/
                    query.exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send({success: result});
                    });
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;

        switch (viewType) {
            case "list":
                getVacationFilter(req, res, next);
                break;
            case "attendance":
                getVacationFilter(req, res, next);
                break;
        }
    };

};

module.exports = Vacation;