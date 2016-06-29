var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var CapacityHandler = require('./capacity');
var CONSTANTS = require('../constants/mainConstants');

var Module = function (event, models) {
    'use strict';

    var capacityHandler = new CapacityHandler(models);
    var objectId = mongoose.Types.ObjectId;
    var VacationSchema = mongoose.Schemas.Vacation;
    var DepartmentSchema = mongoose.Schemas.Department;
    var EmployeeSchema = mongoose.Schemas.Employee;
    var async = require('async');
    var _ = require('lodash');

    function calculateWeeks(array, month, year) {
        var dateValue; // = moment([year, month - 1]);
        var resultObj = {};
        var weekKey;
        var dayNumber;
        var day;

        if (array.length) {
            for (day = array.length; day >= 0; day--) {
                if (array[day]) {
                    dateValue = moment([year, month - 1, day + 1]);
                    // weekKey = year * 100 + moment(dateValue).isoWeek();
                    weekKey = dateValue.isoWeekYear() * 100 + dateValue.isoWeek();

                    dayNumber = dateValue.day();

                    if (dayNumber !== 0 && dayNumber !== 6) {
                        resultObj[weekKey] ? resultObj[weekKey] += 1 : resultObj[weekKey] = 1;
                    }

                    if (resultObj[weekKey] === 0) {
                        delete resultObj[weekKey];
                    }
                }
            }
        }

        return resultObj;
    }

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
        var day;
        var i;
        var j;

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
                    // skip default;
                }
            });
        });

        if (year !== 'Line Year') {
            monthArray = new Array(12);

            for (i = 0; i < monthArray.length; i++) {
                dayMonthCount = moment().set('year', year).set('month', i).endOf('month').date();

                for (j = 1; j <= dayMonthCount; j++) {
                    day = new Date(year, i, j);
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

            for (i = 0; i < monthArray.length; i++) {
                if (i >= startMonth) {
                    monthYear = moment().year() - 1;
                } else {
                    monthYear = moment().year();
                }
                dayMonthCount = moment().set('year', monthYear).set('month', i).endOf('month').date();

                for (j = 1; j <= dayMonthCount; j++) {
                    day = new Date(monthYear, i, j);
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
        };
    }

    this.getYears = function (req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var query;
        var newYear;
        var year;
        /* var lastEl;
         var length;*/
        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var yearFrom = curYear - CONSTANTS.HR_VAC_YEAR_BEFORE;
        var yearTo = curYear + CONSTANTS.HR_VAC_YEAR_AFTER;

        query = Vacation.distinct('year');

        query.exec(function (err, years) {
            var result;

            if (err) {
                return next(err);
            }
            result = _.map(years, function (element) {
                var el = element;

                element = {};
                element._id = el;
                element.name = el;

                return element;
            });

            for (year = yearFrom; year <= yearTo; year++) {
                newYear = {
                    _id : year,
                    name: year
                };

                if (years.indexOf(year) === -1) {
                    result.push(newYear);
                }
            }

            result.sort();

            /* length = result.length;
             lastEl = result[length - 1];*/

            /* if (lastEl._id >= curDate.getFullYear() - 1) {
             result[length] = {};
             result[length]._id = lastEl._id + 1;
             result[length].name = lastEl._id + 1;
             }*/

            res.status(200).send(result);
        });
    };

    this.getStatistic = function (req, res, next) {
        var month = parseInt(req.query.month, 10) + 1;
        var year = parseInt(req.query.year, 10);
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);

        Vacation.aggregate([{
            $match: {
                month: month,
                year : year
            }
        }, {
            $unwind: '$vacArray'
        }, {
            $group: {
                _id  : '$vacArray',
                count: {$sum: 1}
            }
        }], function (err, result) {
            var resObj = {};
            var personal;
            var education;
            var vacation;
            var sick;

            if (err) {
                return next(err);
            }

            personal = _.find(result, function (item) {
                return item._id === 'P';
            });

            education = _.find(result, function (item) {
                return item._id === 'E';
            });

            vacation = _.find(result, function (item) {
                return item._id === 'V';
            });

            sick = _.find(result, function (item) {
                return item._id === 'S';
            });

            resObj.personal = (personal && personal.count) || 0;
            resObj.education = (education && education.count) || 0;
            resObj.vacation = (vacation && vacation.count) || 0;
            resObj.sick = (sick && sick.count) || 0;

            res.status(200).send(resObj);
        });
    };

    function getVacationFilter(req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var options = req.query;
        var queryObject = {};
        var startDate;
        var endDate;
        var stat;
        var date;
        var startQuery;
        var endQuery;
        var condition1;
        var condition2;
        var employeeQuery = {};

        if (options) {
            if (options.employee) {
                queryObject['employee._id'] = objectId(options.employee);
            }
            if (options.year && options.year !== 'Line Year') {
                if (options.month) {
                    queryObject.year = parseInt(options.year, 10);
                    queryObject.month = parseInt(options.month, 10);
                } else {
                    endDate = moment([options.year, 12]);
                    startDate = moment([options.year, 1]);

                    // queryObject.year = {'$in': [options.year, (options.year - 1).toString()]};
                    queryObject.year = {$in: [parseInt(options.year, 10), (options.year - 1)]}; // changed from String to Number
                }
            } else if (options.year) {
                date = new Date();

                employeeQuery['employee._id'] = queryObject['employee._id'];

                date = moment([date.getFullYear(), date.getMonth()]);

                endDate = new Date(date);
                endDate.setMonth(endDate.getMonth() + 1);

                condition1 = {month: {$lte: parseInt(date.format('M'), 10)}};
                condition2 = {year: {$lte: parseInt(date.format('YYYY'), 10)}};

                endQuery = {$and: [condition1, condition2, employeeQuery]};

                date.subtract(12, 'M');
                startDate = new Date(date);

                // date.subtract(12, 'M');

                condition1 = {month: {$gte: parseInt(date.format('M'), 10)}};
                condition2 = {year: {$gte: parseInt(date.format('YYYY'), 10)}};

                startQuery = {$and: [condition1, condition2, employeeQuery]};

                queryObject = {};

                queryObject.$or = [startQuery, endQuery];
            }
        }

        // query = Vacation.find(queryObject);

        // query.exec(function (err, result) {
        Vacation.aggregate([{
            $lookup: {
                from        : 'Employees',
                localField  : 'employee',
                foreignField: '_id',
                as          : 'employee'
            }
        }, {
            $lookup: {
                from        : 'Department',
                localField  : 'department',
                foreignField: '_id',
                as          : 'department'
            }
        }, {
            $project: {
                department: {$arrayElemAt: ['$department', 0]},
                employee  : {$arrayElemAt: ['$employee', 0]},
                month     : 1,
                year      : 1,
                vacations : 1,
                vacArray  : 1,
                monthTotal: 1
            }
        }, {
            $project: {
                'department.name': 1,
                'employee.name'  : 1,
                'employee._id'   : 1,
                month            : 1,
                year             : 1,
                vacations        : 1,
                vacArray         : 1,
                monthTotal       : 1
            }
        }, {
            $match: queryObject
        }, {
            $sort: {'employee.name.first': 1}
        }
        ], function (err, result) {
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
                            date = moment([element.year, element.month]);

                            if (date >= startDate && date <= endDate) {
                                resultObj.curYear.push(element);
                            } else {
                                resultObj.preYear.push(element);
                            }
                        });

                        callback(null, resultObj);
                    }, function (result, callback) {
                        if (options.year !== 'Line Year') {
                            stat = calculate(result.preYear, options.year - 1);
                        } else {
                            stat = calculate(result.preYear, options.year);
                        }

                        callback(null, result, stat);
                    }
                ], function (err, object, stat) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({data: object.curYear, stat: stat});
                });
            }
        });

    }

    function getVacationByWeek(req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var options = req.query;
        var year = parseInt(options.year, 10);
        var week = parseInt(options.week, 10);
        var employee = options.employee;
        var dateByWeek = week + year * 100;
        var dateByWeekField = 'vacations.' + dateByWeek;
        var date = moment().isoWeekYear(year);
        var aggregateQuery = [];
        var vacationsWeek = {};
        var daysOfMonth = {};
        var query = {};
        var monthDay;
        var month;
        var day;
        var i;

        date.isoWeek(week);

        for (i = 1; i <= 7; i++) {
            date.isoWeekday(i);
            month = date.month() + 1;
            day = date.date();
            daysOfMonth[day + 100 * month] = i;
        }

        query.$match = {};
        query.$match[dateByWeekField] = {$exists: true};
        query.$match.employee = objectId(employee);

        aggregateQuery.push(query);

        query = {
            $project: {
                _id     : 0,
                vacArray: 1,
                month   : 1
            }
        };

        aggregateQuery.push(query);

        query = {
            $unwind: {
                path             : '$vacArray',
                includeArrayIndex: 'day'
            }
        };

        aggregateQuery.push(query);

        Vacation.aggregate(aggregateQuery,
            function (err, result) {
                if (err) {
                    return next(err);
                }
                result.forEach(function (vacation) {
                    day = vacation.day + 1;
                    month = vacation.month;
                    monthDay = day + 100 * month;
                    if (daysOfMonth[monthDay]) {
                        vacationsWeek[daysOfMonth[monthDay]] = vacation.vacArray;
                    }
                });

                res.status(200).send(vacationsWeek);
            });

    }

    this.getForView = function (req, res, next) {

        if (req.query.week) {
            getVacationByWeek(req, res, next);
        } else {
            getVacationFilter(req, res, next);
        }
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = req.body;
        var vacArr = data.vacArray || [];
        var dbName = req.session.lastDb;
        var Vacation = models.get(dbName, 'Vacation', VacationSchema);
        var capData = {
            db: dbName
        };

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };

        data.vacations = calculateWeeks(vacArr, data.month, data.year);

        Vacation.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, response) {
            if (err) {
                return next(err);
            }

            capacityHandler.vacationChanged(capData, next);
            capData.id = response.employee;
            capData.year = response.year;
            capData.month = response.month;

            res.status(200).send({success: 'updated'});
            event.emit('setReconcileTimeCard', {
                req     : req,
                month   : response.month,
                year    : response.year,
                employee: response.employee
            });
            event.emit('recollectVacationDash', {dbName: dbName});
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var Vacation = models.get(dbName, 'Vacation', VacationSchema);
        var capData = {db: dbName};
        var uId;

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

            Vacation.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, result) {
                if (err) {
                    return cb(err);
                }

                capData.vacation = result.toJSON();

                capacityHandler.vacationChanged(capData, next);
                event.emit('setReconcileTimeCard', {
                    req     : req,
                    month   : result.month,
                    year    : result.year,
                    employee: result.employee
                });
                cb(null, result);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
            event.emit('recollectVacationDash', {dbName: dbName});
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var dbName = req.session.lastDb;
        var Vacation = models.get(dbName, 'Vacation', VacationSchema);

        Vacation.findByIdAndRemove({_id: id}, function (err, vacation) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: vacation});
            event.emit('setReconcileTimeCard', {
                req     : req,
                month   : vacation.month,
                year    : vacation.year,
                employee: vacation.employee
            });
            event.emit('recollectVacationDash', {dbName: dbName});
        });
    };

    this.create = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Vacation = models.get(dbName, 'Vacation', VacationSchema);
        var Department = models.get(dbName, 'Department', DepartmentSchema);
        var Employee = models.get(dbName, 'Employees', EmployeeSchema);
        var body = req.body;
        var vacArr = body.vacArray || [];
        var vacation;
        var vacationKeys;
        var result = 0;
        var parallelTasks;
        var dateByMonth;

        body.vacations = calculateWeeks(vacArr, body.month, body.year);

        vacationKeys = Object.keys(body.vacations);

        vacationKeys.forEach(function (key) {
            result += body.vacations[key];
        });

        body.monthTotal = result;

        dateByMonth = parseInt(body.year, 10) * 100 + parseInt(body.month, 10);

        body.dateByMonth = dateByMonth;

        vacation = new Vacation(body);

        vacation.save(function (err, vacationResult) {
            if (err) {
                return next(err);
            }

            event.emit('setReconcileTimeCard', {
                req     : req,
                month   : vacationResult.month,
                year    : vacationResult.year,
                employee: vacationResult.employee
            });

            function populateEmployees(cb) {
                Employee.populate(vacationResult, {
                    path  : 'employee',
                    select: '_id name fullName',
                    lean  : true
                }, cb);
            }

            function populateDeps(cb) {
                Department.populate(vacationResult, {
                    path  : 'department',
                    select: '_id name',
                    lean  : true
                }, cb);
            }

            parallelTasks = [populateEmployees, populateDeps];

            async.parallel(parallelTasks, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: vacationResult});
                event.emit('recollectVacationDash', {dbName: dbName});
            });
        });
    };

};

module.exports = Module;
