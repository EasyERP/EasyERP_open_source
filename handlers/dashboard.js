
var mongoose = require('mongoose');
var wTrack = function (models) {
        var access = require("../Modules/additions/access.js")(models);
        var _ = require('lodash');
        var moment = require('../public/js/libs/moment/moment');
        var async = require('async');

        var CONSTANTS = require('../constants/mainConstants');

        var objectId = mongoose.Types.ObjectId;

        var wTrackSchema = mongoose.Schemas['wTrack'];
        var DepartmentSchema = mongoose.Schemas['Department'];
        var EmployeeSchema = mongoose.Schemas['Employee'];
        var HolidaySchema = mongoose.Schemas['Holiday'];
        var VacationSchema = mongoose.Schemas['Vacation'];

        this.composeForVacation = function (req, res, next) {
            var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
            var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
            var weeksArr;
            var week;
            var startDate;
            var endDate;

            var currentWeek = moment().isoWeek();
            var currentStartWeek = currentWeek - 6;
            var currentYear = moment().weekYear();

            weeksArr = [];
            startDate = currentYear * 100 + currentStartWeek;

            for (var i = 0; i <= 13; i++) {
                if (currentStartWeek + i > 53) {
                    week = currentStartWeek + i - 53;
                    weeksArr.push({
                        dateByWeek: (currentYear + 1) * 100 + week,
                        week: week,
                        year: currentYear + 1
                    });
                } else {
                    week = currentStartWeek + i;
                    weeksArr.push({
                        dateByWeek: (currentYear) * 100 + week,
                        week: week,
                        year: currentYear
                    });
                }
            }

            weeksArr = _.sortBy(weeksArr, function (monthObject) {
                return monthObject.dateByWeek
            });

            endDate = weeksArr[weeksArr.length - 1].dateByWeek;

            function resultMapper(err, result) {
                var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
                var employeesByDep;
                var dashBoardResult;
                var holidays;
                var vacations;

                if (err) {
                    return next(err);
                }

                employeesByDep = result[0];
                dashBoardResult = result[1];
                holidays = result[2];
                vacations = result[3];

                function departmentMapper(department, departmentCb) {
                    var dashDepartment = _.find(dashBoardResult, function (deps) {
                        if(deps.department == null){
                            console.log('==================== deps =======================');
                            console.log(deps);
                            console.log('===========================================');
                        }
                        if(department.department == null){
                            console.log('===================== department ======================');
                            console.log(department);
                            console.log('===========================================');
                        }
                        return deps.department.toString() === department.department.toString();
                    });

                    async.each(department.employees, function (_employee, employeeCb) {
                        var dashResultByEmployee;
                        var tempWeekArr = deepCloner(weeksArr);

                        if (dashDepartment) {
                            dashResultByEmployee = _.find(dashDepartment.employeeData, function (employeeData) {
                                return employeeData.employee.toString() === _employee._id.toString();
                            });

                            if (dashResultByEmployee) {
                                _employee.weekData = _.map(tempWeekArr, function (weekData) {
                                    var data;
                                    var holidayCount = 0;
                                    var _vacations;

                                    data = _.find(dashResultByEmployee.weekData, function (d) {
                                        return parseInt(d.dateByWeek) === parseInt(weekData.dateByWeek);
                                    });

                                    if (data) {
                                        weekData = data;
                                    }
                                    _vacations = _.find(vacations, function (vacationObject) {
                                        return (vacationObject.employee.toString() === _employee._id.toString());
                                    });

                                    if (_vacations) {
                                        _vacations.vacations.forEach(function (vacation) {
                                            if (vacation.hasOwnProperty(weekData.dateByWeek)) {
                                                holidayCount += vacation[weekData.dateByWeek];
                                            }
                                        });
                                    }

                                    weekData.holidays = holidays[weekData.dateByWeek] || 0;
                                    weekData.vacations = holidayCount || 0;
                                    return weekData;
                                });
                            } else {
                                _employee.weekData = _.map(tempWeekArr, function (weekData) {
                                    var holidayCount = 0;
                                    var _vacations;

                                    _vacations = _.find(vacations, function (vacationObject) {
                                        return (vacationObject.employee.toString() === _employee._id.toString());
                                    });

                                    if (_vacations) {
                                        _vacations.vacations.forEach(function (vacation) {
                                            if (vacation.hasOwnProperty(weekData.dateByWeek)) {
                                                holidayCount += vacation[weekData.dateByWeek];
                                            }
                                        });
                                    }

                                    weekData.holidays = holidays[weekData.dateByWeek] || 0;
                                    weekData.vacations = holidayCount || 0;
                                    return weekData;
                                });
                            }
                        } else {
                            _employee.weekData = weeksArr;
                        }

                        _employee.maxProjects = dashResultByEmployee ? dashResultByEmployee.maxProjects : 0;

                        employeeCb();
                    }, function () {
                        departmentCb();
                    });
                };

                function sendResponse() {
                    Department.populate(employeesByDep, {
                        path: 'department',
                        select: 'departmentName _id'
                    }, function () {
                        res.status(200).send(employeesByDep);
                    });
                };

                async.each(employeesByDep, departmentMapper, sendResponse);

                function deepCloner(targetArrayOfObjects) {
                    var result = [];
                    var resObject;
                    var length = targetArrayOfObjects.length;

                    for (var i = 0; i < length; i++) {
                        resObject = _.clone(targetArrayOfObjects[i]);
                        result.push(resObject);
                    }

                    return result;
                }
            };

            function holidaysComposer(parallelCb) {
                var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);

                Holiday.aggregate([{
                    $project: {
                        dateByWeek: {$add: [{$multiply: [100, '$year']}, '$week']},
                        day: {$dayOfWeek: '$date'},
                        date: 1,
                        comment: 1,
                        ID: 1,
                        _id: 0
                    }
                }, {
                    $match: {
                        $and: [{dateByWeek: {$gte: startDate, $lte: endDate}}, {day: {$nin: [1, 7]}}]
                    }
                }], /*parallelCb*/function (err, holidays) {
                    var holidaysObject = {};
                    var key;

                    if (err) {
                        return parallelCb(err);
                    }

                    for (var i = holidays.length - 1; i >= 0; i--) {
                        key = holidays[i].dateByWeek;

                        if (!holidaysObject[key]) {
                            holidaysObject[key] = 1;
                        } else {
                            holidaysObject[key]++;
                        }
                    }

                    parallelCb(null, holidaysObject);
                });
            };

            function vacationComposer(parallelCb) {
                var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
                var startMonth = moment().weekYear(currentYear).week(currentStartWeek).month() + 1;
                var endWeek = weeksArr[weeksArr.length - 1].week;
                var endYear = weeksArr[weeksArr.length - 1].year;
                var endMonth = moment().weekYear(currentYear).week(endWeek).month() + 1;

                Vacation.aggregate([{
                    $match: {
                        $and: [{year: {$gte: currentYear, $lte: endYear}}, {month: {$gte: startMonth, $lte: endMonth}}]
                    }
                }, {
                    $group: {
                        _id: {_id: '$employee._id', name: '$employee.name'},
                        vacations: {$push: '$vacations'}
                    }
                }, {
                    $project: {
                        employee: '$_id._id',
                        employeeName: '$_id.name',
                        vacations: 1
                    }
                }], parallelCb);
            };

            function employeeByDepComposer(parallelCb) {
                var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

                Employee
                    .aggregate([
                        {
                            $project: {
                                isEmployee: 1,
                                department: 1,
                                isLead: 1,
                                fire: 1,
                                hire: 1,
                                name: 1,
                                /*firedCount: {$size: '$fire'},*/
                                lastFire: 1
                            }
                        },
                        {
                            $match: {
                                /*isEmployee: true,*/
                                $or: [
                                    {
                                        isEmployee: true
                                    }, {
                                        $and: [{isEmployee: false}, {
                                            lastFire: {
                                                $ne: null,
                                                $gte: startDate
                                            }
                                        } /*{firedCount: {$gt: 0}}*/]
                                    }
                                ],
                                'department._id': {$nin: [objectId(CONSTANTS.HR_DEPARTMENT_ID), objectId(CONSTANTS.BUSINESS_DEPARTMENT_ID), objectId(CONSTANTS.MARKETING_DEPARTMENT_ID)]}
                            }
                        }, {
                            $group: {
                                _id: "$department._id",
                                employees: {
                                    $push: {
                                        isLead: '$isLead',
                                        fired: '$fire',
                                        hired: '$hire',
                                        name: {$concat: ['$name.first', ' ', '$name.last']},
                                        _id: '$_id'
                                    }
                                }
                            }
                        }, {
                            $project: {
                                department: '$_id',
                                employees: 1,
                                _id: 0
                            }
                        }], function (err, employees) {
                        if (err) {
                            return parallelCb(err);
                        }

                        parallelCb(null, employees);
                    });
            };

            function dashComposer(parallelCb) {
                function employeeFinder(waterfallCb) {
                    function findEmployee(_employeesIds, inerWaterfallCb) {
                        Employee
                            .aggregate([
                                {
                                    $project: {
                                        isEmployee: 1,
                                        department: 1,
                                        fire: 1,
                                        firedCount: {$size: '$fire'}
                                    }
                                },
                                {
                                    $match: {
                                        /*isEmployee: true,*/
                                        $or: [
                                            {
                                                isEmployee: true
                                            }, {
                                                $and: [{isEmployee: false}, {firedCount: {$gt: 0}}, {_id: {$in: _employeesIds}}]
                                            }
                                        ],
                                        'department._id': {$nin: [objectId(CONSTANTS.HR_DEPARTMENT_ID), objectId(CONSTANTS.BUSINESS_DEPARTMENT_ID), objectId(CONSTANTS.MARKETING_DEPARTMENT_ID)]}
                                    }
                                }], function (err, employees) {
                                if (err) {
                                    return inerWaterfallCb(err);
                                    //return waterfallCb(err);
                                }

                                employees = _.pluck(employees, '_id');

                                inerWaterfallCb(null, employees);
                            });
                    };

                    function groupWtrackByEmployee(inerWaterfallCb) {
                        WTrack.aggregate([{
                            $group: {
                                _id: '$employee._id',
                                hours: {$sum: '$worked'}
                            }
                        }, {
                            $match: {
                                hours: {$gt: 0}
                            }
                        }, {
                            $project: {
                                _id: 1
                            }
                        }], function (err, employees) {
                            if (err) {
                                return inerWaterfallCb(err);
                            }

                            employees = _.pluck(employees, '_id');
                            inerWaterfallCb(null, employees);
                        });
                    }

                    async.waterfall([groupWtrackByEmployee, findEmployee], function (err, result) {
                        if (err) {
                            return waterfallCb(err);
                        }

                        waterfallCb(null, result);
                    });
                };

                function wTrackComposer(employeesArray, waterfallCb) {
                    WTrack.aggregate([
                        {
                            $match: {
                                'employee._id': {$in: employeesArray},
                                dateByWeek: {$gte: startDate, $lte: endDate},
                                'department._id': {$nin: [objectId(CONSTANTS.HR_DEPARTMENT_ID), objectId(CONSTANTS.BUSINESS_DEPARTMENT_ID), objectId(CONSTANTS.MARKETING_DEPARTMENT_ID)]}
                            }
                        }, {
                            $group: {
                                _id: {
                                    department: '$department._id',
                                    employee: '$employee._id',
                                    dateByWeek: '$dateByWeek',
                                    project: '$project.projectName'
                                },
                                hours: {$sum: '$worked'}
                            }
                        }, {
                            $project: {
                                department: '$_id.department',
                                employee: '$_id.employee',
                                dateByWeek: '$_id.dateByWeek',
                                project: '$_id.project',
                                hours: 1,
                                _id: 0
                            }
                        }, {
                            $group: {
                                _id: {
                                    department: '$department',
                                    employee: '$employee',
                                    dateByWeek: '$dateByWeek'
                                },
                                projectRoot: {$push: '$$ROOT'},
                                hours: {$sum: '$hours'}
                            }
                        }, {
                            $project: {
                                department: '$_id.department',
                                employee: '$_id.employee',
                                dateByWeek: '$_id.dateByWeek',
                                projectRoot: 1,
                                projects: {$size: '$projectRoot'},
                                hours: 1,
                                _id: 0
                            }
                        }, {
                            $group: {
                                _id: {
                                    department: '$department',
                                    employee: '$employee'
                                },
                                maxProjects: {$max: '$projects'},
                                weekData: {$push: '$$ROOT'}
                            }
                        }, {
                            $project: {
                                department: '$_id.department',
                                employee: '$_id.employee',
                                weekData: 1,
                                maxProjects: 1,
                                _id: 0
                            }
                        }, {
                            $group: {
                                _id: {
                                    department: '$department'
                                },
                                root: {$push: '$$ROOT'}
                            }
                        }, {
                            $project: {
                                department: '$_id.department',
                                employeeData: '$root',
                                _id: 0
                            }
                        }], function (err, response) {
                        if (err) {
                            return waterfallCb(err);
                        }
                        waterfallCb(null, response);
                    });
                };

                function masterWaterfallCb(err, result) {
                    if (err) {
                        return parallelCb(err);
                    }

                    parallelCb(null, result);
                }

                async.waterfall([employeeFinder, wTrackComposer], masterWaterfallCb);
            };

            async.parallel([employeeByDepComposer, dashComposer, holidaysComposer, vacationComposer], resultMapper);
        };

        this.composeForHr = function (req, res, next) {
            var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
            var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
            var startDate;
            var endDate;

            var endMonth = moment().month() + 1;
            var endYear = moment().isoWeekYear();
            var start = moment().subtract(11, 'month').date(1);
            var startMonth = start.month() + 1;
            var startYear = start.isoWeekYear();

            startDate = new Date(startYear + '-' + startMonth + '-01');
            endDate = new Date(endYear + '-' + endMonth + '-31');

            function resultMapper(err, result) {
                var hiredArr;
                var firedArr;
                var month;
                var year;
                var arrOfDates;
                var finalResult;

                if (err) {
                    return next(err);
                }

                hiredArr = result[0];
                firedArr = result[1];

                /* for (var i = 0; i < 12; i++) {
                 month = startMonth + i;
                 if (month > 12) {
                 year = startYear + 1;
                 month -= 12;
                 } else {
                 year = startYear;
                 }
                 arrOfDates.push({
                 month: month,
                 year: year,
                 dateByMonth: year * 100 + month
                 });
                 }*/

                finalResult = [{
                    _id: 'hired',
                    data: hiredArr
                }, {
                    _id: 'fired',
                    data: firedArr
                }];

                res.status(200).send(finalResult);
            };

            function hiredEmployees(parallelCb) {
                Employee
                    .aggregate([
                        {
                            $match: {
                                hire: {$gte: startDate, $lte: endDate}
                            }
                        },
                        {
                            $project: {
                                isEmployee: 1,
                                department: 1,
                                isLead: 1,
                                hire: 1,
                                name: 1,
                                firedCount: {$size: '$fire'},
                            }
                        },
                        {
                            $match: {
                                $or: [
                                    {
                                        isEmployee: true
                                    }, {
                                        $and: [{
                                            isEmployee: false
                                        }, {
                                            firedCount: {$gt: 0}
                                        }]
                                    }
                                ]
                            }
                        }, {
                            $unwind: '$hire'
                        }, {
                            $match: {
                                hire: {$gte: startDate, $lte: endDate}
                            }
                        }, {
                            $project: {
                                isEmployee: 1,
                                department: 1,
                                isLead: 1,
                                hireDate: {$add: [{$multiply: [{$year: '$hire'}, 100]}, {$month: '$hire'}]},
                                name: 1
                            }
                        }, {
                            $group: {
                                _id: '$hireDate',
                                hiredCount: {$sum: 1},
                                hiredEmployees: {$addToSet: '$$ROOT'}
                            }
                        }, {
                            $sort: {
                                _id: 1
                            }
                        }], function (err, employees) {
                        if (err) {
                            return parallelCb(err);
                        }

                        Department.populate(employees, {
                            path: 'hiredEmployees.department._id',
                            select: '_id departmentName'
                        }, function(err, deps){
                            if(err){
                                return  parallelCb(err);
                            }

                            parallelCb(null, employees);
                        });
                    });
            };

            function firedEmployees(parallelCb) {
                Employee
                    .aggregate([
                        {
                            $match: {
                                $and: [{fire: {$gte: startDate}}, {fire: {$lte: endDate}}]
                            }
                        },
                        {
                            $project: {
                                isEmployee: 1,
                                department: 1,
                                isLead: 1,
                                fire: 1,
                                name: 1,
                                firedCount: {$size: '$fire'},
                            }
                        },
                        {
                            $match: {
                                $or: [
                                    {
                                        isEmployee: true
                                    }, {
                                        $and: [{
                                            isEmployee: false
                                        }, {
                                            firedCount: {$gt: 0}
                                        }]
                                    }
                                ]
                            }
                        }, {
                            $unwind: '$fire'
                        }, {
                            $match: {
                                fire: {$gte: startDate, $lte: endDate}
                            }
                        }, {
                            $project: {
                                isEmployee: 1,
                                department: 1,
                                isLead: 1,
                                fireDate: {$add: [{$multiply: [{$year: '$fire'}, 100]}, {$month: '$fire'}]},
                                name: 1
                            }
                        }, {
                            $group: {
                                _id: '$fireDate',
                                firedCount: {$sum: 1},
                                firedEmployees: {$addToSet: '$$ROOT'}
                            }
                        }, {
                            $sort: {
                                _id: 1
                            }
                        }], function (err, employees) {
                        if (err) {
                            return parallelCb(err);
                        }

                        Department.populate(employees, {
                            path: 'firedEmployees.department._id',
                            select: '_id departmentName',
                            options: {
                                lean: true
                            }
                        }, function(err, deps){
                            if(err){
                                return  parallelCb(err);
                            }

                            parallelCb(null, employees);
                        });
                    });
            };

            async.parallel([hiredEmployees, firedEmployees], resultMapper);
        };

    }
    ;

module.exports = wTrack;