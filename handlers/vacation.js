/**
 * Created by soundstorm on 30.06.15.
 */
var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var objectId = mongoose.Types.ObjectId;
var Vacation = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var VacationSchema = mongoose.Schemas['Vacation'];
    var async = require('async');
    var _ = require('lodash');

    function calculate(data, year) {
        var leaveDays = 0;
        var workingDays = 0;
        var vacation = 0;
        var personal = 0;
        var sick = 0;
        var education = 0;
        var weekend = 0;
        var startYear;
        var endYear;
        var dayCount;
        var dayMonthCount;
        var startType;
        var endType;
        var monthArray;
        var monthYear;
        var startMonth;

        data.forEach(function (attendance) {
            attendance.vacationArray.forEach(function (day) {
                startType = moment(day.startDate).date();
                endType = moment(day.endDate).date();

                for (var k = startType - 1; k < endType; k++) {
                    switch (day.vacationType) {
                        case 'V':
                            vacation++;
                            break;
                        case 'P':
                            personal++;
                            break;
                        case 'S':
                            sick++;
                            break;
                        case 'E':
                            education++;
                            break;
                    }
                }
            });
        });

        if (year !== 'Line Year') {
            monthArray = new Array(12);

            for (var i = 0; i < monthArray.length; i++) {
                dayMonthCount = moment().set('year', year).set('month', i).endOf('month').date();

                for (var j = 1; j <= dayMonthCount; j++) {
                    var day = new Date(year, i, j);
                    day = day.getDay();
                    if (day === 0 || day === 6) {
                        weekend++;
                    }
                }
            }

            startYear = moment([year, 0, 1]);
            endYear = moment([year, 11, 31]);
        } else {
            monthArray = new Array(13);
            startMonth = moment().month();

            for (var i = 0; i < monthArray.length; i++) {
                if (i >= startMonth) {
                    monthYear = moment().year() - 1;
                } else {
                    monthYear = moment().year();
                }
                dayMonthCount = moment().set('year', monthYear).set('month', i).endOf('month').date();

                for (var j = 1; j <= dayMonthCount; j++) {
                    var day = new Date(monthYear, i, j);
                    day = day.getDay();
                    if (day === 0 || day === 6) {
                        weekend++;
                    }
                }
            }

            dayCount = moment().set('year', moment().year()).set('month', moment().month()).endOf('month').date();
            startYear = moment([moment().year() - 1, moment().month(), 1]);
            endYear = moment([moment().year(), moment().month(), dayCount]);
        }

        leaveDays = vacation + personal + sick + education;
        workingDays = endYear.diff(startYear, 'days') - leaveDays - weekend;

        return {
            leaveDays: leaveDays,
            workingDays: workingDays,
            vacation: vacation,
            personal: personal,
            sick: sick,
            education: education
        }
    };

    this.getYears = function (req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var query;

        query = Vacation.distinct('year');

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            result = _.map(result, function(element) {
                var el = element;

                element = {};
                element._id = el;
                element.name = el;

                return element;
            })
            res.status(200).send(result);
        });
    };

    /*function getVacationFilter(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 70, function (access) {
                if (access) {
                    var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
                    var options = req.query;
                    var queryObject = {};
                    var query;

                    var startDate;
                    var endDate;

                    if (options) {
                        if (options.employee) {
                            queryObject['employee._id'] = objectId(options.employee);
                        }
                        if (options.year && options.year !== 'Line Year') {
                            if (options.month) {
                                queryObject.year = options.year;
                                queryObject.month = options.month;
                            } else {
                                endDate = moment([options.year, 12]);
                                startDate = moment([options.year, 1]);

                                queryObject.year = {'$in': [options.year, (options.year - 1).toString()]};
                            }
                        } else if (options.year) {
                            var date = new Date();

                            date = moment([date.getFullYear(), date.getMonth()]);

                            endDate = new Date(date);
                            queryObject.endDate = {'$lte': endDate};

                            date.subtract(12, 'M');
                            startDate = new Date(date);

                            date.subtract(12, 'M');
                            queryObject.startDate = {'$gte': new Date(date)};
                        }
                    }

                    query = Vacation.aggregate(
                        [
                            {$match: queryObject},
                            {
                                $group: {
                                    _id: {
                                        employee: "$employee",
                                        department: "$department",
                                        month: "$month",
                                        year: "$year"
                                    },
                                    vacationArray: {
                                        $push: {
                                            _idVacation: "$_id",
                                            vacationType: "$vacationType",
                                            startDate: "$startDate",
                                            endDate: "$endDate"
                                        }
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: {$concat: ["$_id.month", "$_id.year", "$_id.employee.name"]},
                                    employee: "$_id.employee",
                                    department: "$_id.department",
                                    month: "$_id.month",
                                    year: "$_id.year",
                                    vacationArray: 1
                                }
                            }
                        ]
                    );

                    *//*REMOVE*//*
                    console.dir(queryObject);

                    query.exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        if (options.month) {
                            res.status(200).send(result);
                        } else {
                            async.waterfall([
                                    function (callback) {
                                        var resultObj = {
                                            curYear: [],
                                            preYear: []
                                        };

                                        result.forEach(function(element) {
                                            var date = moment([element.year, element.month]);

                                            if (date >= startDate && date <= endDate) {
                                                resultObj['curYear'].push(element);
                                            } else {
                                                resultObj['preYear'].push(element);
                                            }
                                        });

                                        callback(null, resultObj);
                                    },
                                    function (result, callback) {
                                        var stat = calculate(result['preYear'], options.year - 1);

                                        callback(null, result, stat);
                                    }
                                ],
                                function (err, object, stat) {
                                    if (err) {
                                        return next(err);
                                    }
                                    res.status(200).send({data: object['curYear'], stat: stat});

                                }
                            );
                        }
                    });
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };*/

    function getVacationFilter(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 70, function (access) {
                if (access) {
                    var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
                    var options = req.query;
                    var queryObject = {};
                    var query;

                    var startDate;
                    var endDate;

                    if (options) {
                        if (options.employee) {
                            queryObject['employee._id'] = objectId(options.employee);
                        }
                        if (options.year && options.year !== 'Line Year') {
                            if (options.month) {
                                queryObject.year = options.year;
                                queryObject.month = options.month;
                            } else {
                                endDate = moment([options.year, 11]);
                                startDate = moment([options.year, 0]);

                                queryObject.year = {'$in': [options.year, (options.year - 1).toString()]};
                            }
                        } else if (options.year) {
                            var date = new Date();
                            var startQuery;
                            var endQuery;
                            var condition1;
                            var condition2;
                            var employeeQuery = {};

                            employeeQuery['employee._id'] = queryObject['employee._id'];

                            date = moment([date.getFullYear(), date.getMonth()]);

                            endDate = new Date(date);

                            condition1 = {month: {'$lte': parseInt(date.format('M'))}};
                            condition2 = {year: {'$lte': parseInt(date.format('YYYY'))}};

                            console.dir(condition1);
                            console.dir(condition2);

                            endQuery = {'$and': [condition1, condition2, employeeQuery]};

                            date.subtract(12, 'M');
                            startDate = new Date(date);

                            date.subtract(12, 'M');

                            condition1 = {month: {'$gte': parseInt(date.format('M'))}};
                            condition2 = {year: {'$gte': parseInt(date.format('YYYY'))}};

                            console.dir(condition1);
                            console.dir(condition2);

                            startQuery = {'$and': [condition1, condition2, employeeQuery]};

                            queryObject = {};

                            queryObject['$or'] = [startQuery, endQuery];
                        }
                    }

                    query = Vacation.find(queryObject);

                    console.dir(startQuery);
                    console.dir(endQuery);
                    console.dir(queryObject);

                    query.exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        if (options.month) {
                            res.status(200).send(result);
                        } else {
                            async.waterfall([
                                    function (callback) {
                                        var resultObj = {
                                            curYear: [],
                                            preYear: []
                                        };

                                        result.forEach(function(element) {
                                            var date = moment([element.year, element.month]);

                                            if (date >= startDate && date <= endDate) {
                                                resultObj['curYear'].push(element);
                                            } else {
                                                resultObj['preYear'].push(element);
                                            }
                                        });

                                        callback(null, resultObj);
                                    },
                                    function (result, callback) {
                                        var stat = calculate(result['preYear'], options.year - 1);

                                        callback(null, result, stat);
                                    }
                                ],
                                function (err, object, stat) {
                                    if (err) {
                                        return next(err);
                                    }
                                    res.status(200).send({data: object['curYear'], stat: stat});

                                }
                            );
                        }
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

    this.create = function (req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var body = req.body;
        var Vacation = new Vacation(body);

        Vacation.save(function (err, Vacation) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: Vacation});
        });
    };

};

module.exports = Vacation;