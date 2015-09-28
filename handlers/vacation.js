var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var CapacityHandler = require('./capacity');
var objectId = mongoose.Types.ObjectId;
var Vacation = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var capacityHandler = new CapacityHandler(models);
    var VacationSchema = mongoose.Schemas['Vacation'];
    var async = require('async');
    var _ = require('lodash');

    function calculateWeeks(array, month, year) {
        var dateValue; // = moment([year, month - 1]);
        var resultObj = {};
        var weekKey;
        var dayNumber;

        for (var day = array.length; day >= 0; day--) {
            if (array[day]) {
                dateValue = moment([year, month - 1, day + 1]);
                //dateValue.date(day + 1);
                // weekKey = year * 100 + moment(dateValue).isoWeek();
                weekKey = year * 100 + moment(dateValue).isoWeek();

                dayNumber = moment(dateValue).day();

                if (dayNumber !== 0 && dayNumber !== 6) {
                    resultObj[weekKey] ? resultObj[weekKey] += 1 : resultObj[weekKey] = 1;
                }

                if (resultObj[weekKey] === 0) {
                    delete resultObj[weekKey];
                }
            }
        }

        return resultObj;
    };

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
            attendance.vacArray.forEach(function (day) {
                switch (day) {
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
            leaveDays  : leaveDays,
            workingDays: workingDays,
            vacation   : vacation,
            personal   : personal,
            sick       : sick,
            education  : education
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
            result = _.map(result, function (element) {
                var el = element;

                element = {};
                element._id = el;
                element.name = el;

                return element;
            })
            res.status(200).send(result);
        });
    };

    function getVacationFilter(modelId, req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, modelId, function (access) {
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

                            endQuery = {'$and': [condition1, condition2, employeeQuery]};

                            date.subtract(12, 'M');
                            startDate = new Date(date);

                            date.subtract(12, 'M');

                            condition1 = {month: {'$gte': parseInt(date.format('M'))}};
                            condition2 = {year: {'$gte': parseInt(date.format('YYYY'))}};

                            startQuery = {'$and': [condition1, condition2, employeeQuery]};

                            queryObject = {};

                            queryObject['$or'] = [startQuery, endQuery];
                        }
                    }

                    query = Vacation.find(queryObject);

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

                                        result.forEach(function (element) {
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
                                        if (options.year !== 'Line Year') {
                                            var stat = calculate(result['preYear'], options.year - 1);
                                        } else {
                                            var stat = calculate(result['preYear'], options.year);
                                        }

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
                getVacationFilter(70, req, res, next);
                break;
            case "attendance":
                getVacationFilter(71, req, res, next);
                break;
        }
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = req.body;
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var capData = {
            db: req.session.lastDb,
        }

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 70, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };

                    data.vacations = calculateWeeks(data.vacArray, data.month, data.year);

                    Vacation.findByIdAndUpdate(id, {$set: data}, function (err, response) {
                        if (err) {
                            return next(err);
                        }

                        capacityHandler.vacationChanged(capData, next);
                        capData.id = response.employee._id;
                        capData.year = response.year;
                        capData.month = response.month;

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

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var capData = {db: req.session.lastDb};

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 70, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;

                        capData.id = id;

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };
                        delete data._id;

                        if (data.vacArray) {
                            data.vacations = calculateWeeks(data.vacArray, data.month, data.year);
                        }

                        Vacation.findByIdAndUpdate(id, {$set: data}, function(err, result) {
                            if (err) {
                                return cb(err);
                            }

                            capData.vacation = result.toJSON();

                            capacityHandler.vacationChanged(capData, next);

                            cb(null, result);
                        });
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

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);


        access.getDeleteAccess(req, req.session.uId, 72, function (access) {
            if (access) {


                Vacation.remove({_id: id}, function (err, vacation) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: vacation});
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.create = function (req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var body = req.body;
        var vacation;
        var vacationKeys;
        var result = 0;

        body.vacations = calculateWeeks(body.vacArray, body.month, body.year);

        vacationKeys = Object.keys(body.vacations);

        vacationKeys.forEach(function (key) {
            result += body.vacations[key];
        });

        body.monthTotal = result;

        vacation = new Vacation(body);

        vacation.save(function (err, Vacation) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: Vacation});
        });
    };

};

module.exports = Vacation;