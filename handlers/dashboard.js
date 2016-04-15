var mongoose = require('mongoose');

var wTrack = function (models) {
    'use strict';
    //var access = require("../Modules/additions/access.js")(models);
    var _ = require('lodash');
    var moment = require('../public/js/libs/moment/moment');
    var async = require('async');
    var redisStore = require('../helpers/redisClient');
    var CONSTANTS = require('../constants/mainConstants');
    var constForView = [
        '55b92ace21e4b7c40f00000f',
        '55b92ace21e4b7c40f000010',
        '55b92ace21e4b7c40f000016',
        '56802eb31afe27f547b7ba52',
        '566ee11b8453e8b464b70b73',
        '56802e9d1afe27f547b7ba51',
        '56802ec21afe27f547b7ba53',
        '55b92ace21e4b7c40f000012',
        '55b92ace21e4b7c40f000011',
        '55bb1f14cb76ca630b000006',
        '55bb1f40cb76ca630b000007',
        '56e175c4d62294582e10ca68'
    ];

    var objectId = mongoose.Types.ObjectId;

    var wTrackSchema = mongoose.Schemas.wTrack;
    var DepartmentSchema = mongoose.Schemas.Department;
    var EmployeeSchema = mongoose.Schemas.Employee;
    var HolidaySchema = mongoose.Schemas.Holiday;
    var VacationSchema = mongoose.Schemas.Vacation;

    this.composeForVacation = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var query = req.query;
        var employeesArray = [];
        var filter = query.filter || {};
        var departmentsArray = [objectId(CONSTANTS.HR_DEPARTMENT_ID),
            objectId(CONSTANTS.BUSINESS_DEPARTMENT_ID),
            objectId(CONSTANTS.MARKETING_DEPARTMENT_ID),
            objectId(CONSTANTS.PM_ID)
        ];
        var departmentQuery = {
            $nin: departmentsArray
        };
        var employeeQueryForEmployeeByDep;

        var weeksArr = [];
        var week;
        var year;
        var startDate;
        var endDate;
        var _startDate;
        var _endDate;
        var _startDateByMonth;
        var _endDateByMonth;
        var _dateStr;
        var duration;
        var weeks = 0;
        var key;
        var i;

        function getDate(dateStr) {
            return dateStr.isoWeekday(5).format("DD.MM");
        }

        if (filter.department && filter.department.value) {
            departmentQuery = {
                $in: filter.department.value.objectID()
            };
        }

        if (filter && filter.startDate && filter.endDate) {
            startDate = new Date(filter.startDate);
            startDate = moment(startDate);
            endDate = new Date(filter.endDate);
            endDate = moment(endDate);
        } else {
            startDate = moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'weeks');
            endDate = moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'weeks');
        }

        _startDate = moment(startDate);
        _startDateByMonth = _startDate.year() * 100 + _startDate.month() + 1;
        _startDate = _startDate.isoWeekYear() * 100 + _startDate.isoWeek();
        _endDate = moment(endDate);
        _endDateByMonth = _endDate.year() * 100 + _endDate.month() + 1;
        _endDate = _endDate.isoWeekYear() * 100 + _endDate.isoWeek();

        duration = endDate.diff(startDate, 'weeks');

        for (i = 0; i <= duration; i++) {
            _dateStr = startDate.add(weeks, 'weeks');
            week = _dateStr.isoWeek();
            year = _dateStr.isoWeekYear();
            weeksArr.push({
                lastDate  : getDate(_dateStr),
                dateByWeek: year * 100 + week,
                week      : week,
                year      : year
            });
            weeks = weeks || 1;
        }

        startDate = weeksArr[0].dateByWeek;
        endDate = weeksArr[weeksArr.length - 1].dateByWeek;

        delete filter.startDate;
        delete filter.endDate;

        key = _startDate + '_' + _endDate + '_' + JSON.stringify(filter);

        employeeQueryForEmployeeByDep = {
            $and: [{
                $or: [{
                    $and: [{
                        isEmployee: true
                    }, {
                        $or: [{
                            lastFire: null,
                            lastHire: {
                                $ne : null,
                                $lte: endDate
                            }
                        }, {
                            lastFire: {
                                $ne : null,
                                $gte: startDate
                            }
                        }, {
                            lastHire: {
                                $ne : null,
                                $lte: endDate
                            }
                        }]
                    }]
                }, {
                    $and: [{
                        isEmployee: false
                    }, {
                        lastFire: {
                            $ne : null,
                            $gte: startDate
                        }
                    }, {
                        lastHire: {
                            $ne : null,
                            $lte: endDate
                        }
                    }]
                }]/*,
                 department: departmentQuery*/
            }]
        };

        if (filter && filter.name) {
            employeesArray = filter.name.value;
            employeesArray = employeesArray.objectID();

            if (employeesArray.length) {
                employeeQueryForEmployeeByDep.$and.unshift({
                    _id: {$in: employeesArray}
                });
            }
        }

        weeksArr = _.sortBy(weeksArr, function (monthObject) {
            return monthObject.dateByWeek;
        });

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
                    // todo fix this bad low code after add logic transfer employee

                    // bad low code start
                    function unityWpChecker(dep1, dep2) {

                    }

                    // bad low code end
                    return deps.department.toString() === department.department.toString();
                });

                async.each(department.employees, function (_employee, employeeCb) {
                    var dashResultByEmployee;
                    var tempWeekArr;

                    function deepCloner(targetArrayOfObjects) {
                        var _result = [];
                        var resObject;
                        var length = targetArrayOfObjects.length;
                        var i;

                        for (i = 0; i < length; i++) {
                            resObject = _.clone(targetArrayOfObjects[i]);
                            _result.push(resObject);
                        }

                        return _result;
                    }

                    function holidaysVacationComposer(_employee, dashResultByEmployee) {
                        _employee.weekData = _.map(tempWeekArr, function (weekData) {
                            var data;
                            var holidayCount = 0;
                            var _vacations;

                            data = dashResultByEmployee ? _.find(dashResultByEmployee.weekData, function (d) {
                                return parseInt(d.dateByWeek, 10) === parseInt(weekData.dateByWeek, 10);
                            }) : null;

                            if (data) {
                                weekData = data;
                            }

                            _vacations = _.find(vacations, function (vacationObject) {
                                var employee = vacationObject.employee;

                                return (employee && employee._id.toString() === _employee._id.toString());
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

                    tempWeekArr = deepCloner(weeksArr);

                    if (dashDepartment) {
                        dashResultByEmployee = _.find(dashDepartment.employeeData, function (employeeData) {
                            return employeeData.employee.toString() === _employee._id.toString();
                        });

                        if (dashResultByEmployee) {
                            holidaysVacationComposer(_employee, dashResultByEmployee);
                        } else {
                            holidaysVacationComposer(_employee);
                        }
                    } else {
                        holidaysVacationComposer(_employee);
                    }

                    _employee.maxProjects = dashResultByEmployee ? dashResultByEmployee.maxProjects : 0;

                    employeeCb();
                }, function () {
                    departmentCb();
                });
            }

            function sendResponse() {
                Department.populate(employeesByDep, {
                    path  : 'department',
                    select: 'departmentName _id'
                }, function () {
                    var sortDepartments = [];
                    var resultData = {
                        weeksArray: weeksArr
                    };

                    constForView.forEach(function (dep) {
                        employeesByDep.forEach(function (department, index) {
                            var _dep = employeesByDep[index].department;

                            if (_dep && _dep._id) {
                                if (dep === _dep._id.toString()) {
                                    sortDepartments.push(employeesByDep[index]);
                                }
                            }
                        });
                    });

                    resultData.sortDepartments = sortDepartments;

                    res.status(200).send(resultData);
                    redisStore.writeToStorage('dashboardVacation', key, JSON.stringify(resultData));
                });
            }

            async.each(employeesByDep, departmentMapper, sendResponse);
            //res.status(200).send(employeesByDep);
        }

        function holidaysComposer(parallelCb) {
            var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);

            Holiday.aggregate([{
                $project: {
                    dateByWeek: {$add: [{$multiply: [100, '$year']}, '$week']},
                    day       : 1,
                    date      : 1,
                    comment   : 1,
                    ID        : 1,
                    _id       : 0
                }
            }, {
                $match: {
                    $and: [{dateByWeek: {$gte: startDate, $lte: endDate}}, {day: {$nin: [0, 6]}}]
                }
            }], /*parallelCb*/function (err, holidays) {
                var holidaysObject = {};
                var key;
                var i;

                if (err) {
                    return parallelCb(err);
                }

                for (i = holidays.length - 1; i >= 0; i--) {
                    key = holidays[i].dateByWeek;

                    if (!holidaysObject[key]) {
                        holidaysObject[key] = 1;
                    } else {
                        holidaysObject[key]++;
                    }
                }

                console.log(holidaysObject);

                parallelCb(null, holidaysObject);
            });
        }

        function vacationComposer(parallelCb) {
            //ToDo optimize and refactor
            var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
            var matchObject = {
                $and: [{dateByMonth: {$gte: _startDateByMonth, $lte: _endDateByMonth}}]
            };

            if (employeesArray.length) {
                matchObject.$and.unshift({
                    employee: {$in: employeesArray}
                });
            }

            Vacation.aggregate([{
                $project: {
                    _id        : 1,
                    month      : 1,
                    year       : 1,
                    vacations  : 1,
                    vacArray   : 1,
                    department : 1,
                    employee   : 1,
                    dateByMonth: {$add: ['$month', {$multiply: ['$year', 100]}]}
                }
            }, {
                $match: matchObject
            }, {
                $group: {
                    _id      : '$employee',
                    vacations: {$push: '$vacations'}
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : '_id',
                    foreignField: '_id',
                    as          : 'employee'
                }
            }, {
                $project: {
                    employee    : {$arrayElemAt: ["$employee", 0]},
                    employeeName: '$employee.name',
                    vacations   : 1
                }
            }], parallelCb);
        }

        function employeeByDepComposer(parallelCb) {
            var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

            Employee.aggregate([{
                $match: {
                    hire: {$ne: []} //add by Liliya for new Application ToDO review
                }
            }, {
                $project: {
                    isEmployee  : 1,
                    department  : 1,
                    isLead      : 1,
                    fire        : 1,
                    hire        : 1,
                    name        : 1,
                    lastFire    : 1,
                    transfer    : 1,
                    lastTransfer: {$max: '$transfer.date'},
                    hireCount   : {$size: '$hire'},
                    lastHire    : {
                        $let: {
                            vars: {
                                lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                            },
                            in  : {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                        }
                    }
                }
            }, {
                $match: employeeQueryForEmployeeByDep
            }, {
                $unwind: '$transfer'
            }, {
                $match: {
                    'transfer.department': departmentQuery
                }
            }, {
                $group: {
                    _id              : {
                        _id       : '$_id',
                        department: '$transfer.department',
                        isEmployee: '$isEmployee',
                        isLead    : '$isLead'
                    },
                    firstTransferDate: {$min: '$transfer.date'},
                    lastTransferDate : {$max: '$transfer.date'},
                    isTransfer       : {
                        $addToSet: {
                            status: '$transfer.status',
                            date  : '$transfer.date'
                        }
                    },
                    name             : {$first: {$concat: ['$name.first', ' ', '$name.last']}},
                    lastTransfer     : {$first: '$lastTransfer'},
                    lastHire         : {$first: '$lastHire'}
                }
            }, {
                $unwind: '$isTransfer'
            }, {
                $sort: {'isTransfer.date': 1}
            }, {
                $group: {
                    _id              : '$_id',
                    firstTransferDate: {$first: '$firstTransferDate'},
                    lastTransferDate : {$first: '$lastTransferDate'},
                    isTransfer       : {
                        $push: '$isTransfer'
                    },
                    name             : {$first: '$name'},
                    lastTransfer     : {$first: '$lastTransfer'},
                    lastHire         : {$first: '$lastHire'}
                }
            }, {
                $project: {
                    _id              : 1,
                    isTransfer       : 1,
                    firstTransferDate: 1,
                    lastTransferDate : 1,
                    lastTransfer     : 1,
                    name             : 1,
                    lastHire         : 1,
                    _lastTransferDate: {$add: [{$multiply: [{$year: '$lastTransferDate'}, 100]}, {$week: '$lastTransferDate'}]}
                }
            }, {
                $match: {
                    $or: [
                        {
                            _lastTransferDate  : {$gte: startDate},
                            'isTransfer.status': 'transfer'
                        }, {
                            'isTransfer.status': {$nin: ['transfer']}
                        }
                    ]
                }
            }, {
                $project: {
                    department       : '$_id.department',
                    isEmployee       : '$_id.isEmployee',
                    isLead           : '$_id.isLead',
                    _id              : '$_id._id',
                    transferArr      : {
                        $filter: {
                            input: '$isTransfer',
                            as   : 'transfer',
                            cond : {$eq: ['$$transfer.status', 'transfer']}
                        }
                    },
                    isTransfer       : 1,
                    firstTransferDate: 1,
                    lastTransferDate : 1,
                    lastTransfer     : 1,
                    name             : 1,
                    lastHire         : 1
                }
            }, {
                $group: {
                    _id      : '$department',
                    employees: {
                        $addToSet: {
                            isEmployee       : '$isEmployee',
                            isLead           : '$isLead',
                            firstTransferDate: '$firstTransferDate',
                            lastTransferDate : '$lastTransferDate',
                            lastHire         : '$lastHire',
                            lastTransfer     : '$lastTransfer',
                            name             : '$name',
                            isTransfer       : '$isTransfer',
                            transferArr      : '$transferArr',
                            _id              : '$_id'
                        }
                    }
                }
            }, {
                $project: {
                    department: '$_id',
                    employees : 1,
                    _id       : 0
                }
            }], function (err, employees) {
                if (err) {
                    return parallelCb(err);
                }

                parallelCb(null, employees);
            });
        }

        function dashComposer(parallelCb) {
            function employeeFinder(waterfallCb) {
                var aggregateQuery = [{
                    $group: {
                        _id  : '$employee',
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
                }];

                if (employeesArray && employeesArray.length) {
                    aggregateQuery.unshift({
                        $match: {
                            employee: {$in: employeesArray}
                        }
                    });
                }

                function findEmployee(_employeesIds, inerWaterfallCb) {
                    Employee
                        .aggregate([
                            {
                                $project: {
                                    isEmployee: 1,
                                    department: 1,
                                    fire      : 1,
                                    firedCount: {$size: '$fire'}
                                }
                            },
                            {
                                $match: {
                                    $or: [
                                        {
                                            isEmployee: true
                                        }, {
                                            $and: [{isEmployee: false}, {firedCount: {$gt: 0}}, {_id: {$in: _employeesIds}}]
                                        }
                                    ]/*,
                                     department: departmentQuery*/
                                }
                            }], function (err, employees) {
                            if (err) {
                                return inerWaterfallCb(err);
                            }

                            employees = _.pluck(employees, '_id');

                            inerWaterfallCb(null, employees);
                        });
                }

                function groupWtrackByEmployee(inerWaterfallCb) {
                    WTrack.aggregate(aggregateQuery, function (err, employees) {
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
            }

            function wTrackComposer(employeesArray, waterfallCb) {
                WTrack.aggregate([
                    {
                        $match: {
                            employee  : {$in: employeesArray},
                            dateByWeek: {$gte: startDate, $lte: endDate},
                            department: departmentQuery
                        }
                    }, {
                        $group: {
                            _id  : {
                                department: '$department',
                                employee  : '$employee',
                                dateByWeek: '$dateByWeek',
                                project   : '$project'
                            },
                            hours: {$sum: '$worked'}
                        }
                    }, {
                        $lookup: {
                            from        : 'Project',
                            localField  : '_id.project',
                            foreignField: '_id',
                            as          : 'project'
                        }
                    }, {
                        $project: {
                            department: '$_id.department',
                            employee  : '$_id.employee',
                            dateByWeek: '$_id.dateByWeek',
                            project   : {$arrayElemAt: ['$project', 0]},
                            hours     : 1,
                            _id       : 0
                        }
                    }, {
                        $project: {
                            department: 1,
                            employee  : 1,
                            dateByWeek: 1,
                            project   : '$project.projectName',
                            hours     : 1
                        }
                    }, {
                        $group: {
                            _id        : {
                                department: '$department',
                                employee  : '$employee',
                                dateByWeek: '$dateByWeek'
                            },
                            projectRoot: {$push: '$$ROOT'},
                            hours      : {$sum: '$hours'}
                        }
                    }, {
                        $project: {
                            department : '$_id.department',
                            employee   : '$_id.employee',
                            dateByWeek : '$_id.dateByWeek',
                            projectRoot: 1,
                            projects   : {$size: '$projectRoot'},
                            hours      : 1,
                            _id        : 0
                        }
                    }, {
                        $group: {
                            _id        : {
                                department: '$department',
                                employee  : '$employee'
                            },
                            maxProjects: {$max: '$projects'},
                            weekData   : {$push: '$$ROOT'}
                        }
                    }, {
                        $project: {
                            department : '$_id.department',
                            employee   : '$_id.employee',
                            weekData   : 1,
                            maxProjects: 1,
                            _id        : 0
                        }
                    }, {
                        $group: {
                            _id : {
                                department: '$department'
                            },
                            root: {$push: '$$ROOT'}
                        }
                    }, {
                        $project: {
                            department  : '$_id.department',
                            employeeData: '$root',
                            _id         : 0
                        }
                    }], function (err, response) {
                    if (err) {
                        return waterfallCb(err);
                    }
                    waterfallCb(null, response);
                });
            }

            function masterWaterfallCb(err, result) {
                if (err) {
                    return parallelCb(err);
                }

                parallelCb(null, result);
            }

            async.waterfall([employeeFinder, wTrackComposer], masterWaterfallCb);
        }

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
            var finalResult;

            if (err) {
                return next(err);
            }

            hiredArr = result[0];
            firedArr = result[1];
            finalResult = [{
                _id : 'hired',
                data: hiredArr
            }, {
                _id : 'fired',
                data: firedArr
            }];

            res.status(200).send(finalResult);
        }

        function hiredEmployees(parallelCb) {
            Employee
                .aggregate([{
                    $project: {
                        isEmployee: 1,
                        department: 1,
                        isLead    : 1,
                        hire      : 1,
                        fire      : 1,
                        name      : 1,
                        firedCount: {$size: '$fire'},
                        firstHired: {$arrayElemAt: ['$hire', 0]}
                    }
                }, {
                    $project: {
                        isEmployee    : 1,
                        department    : 1,
                        isLead        : 1,
                        hire          : 1,
                        fire          : 1,
                        name          : 1,
                        firedCount    : 1,
                        firstHiredDate: '$firstHired'
                    }
                },
                    {
                        $match: {
                            'firstHiredDate': {$gte: startDate, $lte: endDate}
                        }
                    }, {
                        $project: {
                            isEmployee: 1,
                            department: 1,
                            isLead    : 1,
                            hireDate  : {$add: [{$multiply: [{$year: '$firstHiredDate'}, 100]}, {$month: '$firstHiredDate'}]},
                            name      : 1
                        }
                    }, {
                        $group: {
                            _id           : '$hireDate',
                            hiredCount    : {$sum: 1},
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
                        path  : 'hiredEmployees.department',
                        select: '_id departmentName'
                    }, function (err/*, deps*/) {
                        if (err) {
                            return parallelCb(err);
                        }

                        parallelCb(null, employees);
                    });
                });
        }

        function firedEmployees(parallelCb) {
            Employee
                .aggregate([
                    /* {
                     $match: {
                     $and: [{'fire': {$gte: startDate}}, {'fire': {$lte: endDate}}]
                     }
                     },*/
                    {
                        $project: {
                            isEmployee: 1,
                            department: 1,
                            isLead    : 1,
                            fire      : 1,
                            name      : 1,
                            firedCount: {$size: '$fire'},
                            hiredCount: {$size: '$hire'}
                        }
                    },
                    {
                        $match: {
                            $or: [
                                {
                                    $and: [{
                                        isEmployee: true
                                    }, {
                                        firedCount: {$lt: '$hiredCount'}
                                    }]
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
                            isLead    : 1,
                            fireDate  : {$add: [{$multiply: [{$year: '$fire'}, 100]}, {$month: '$fire'}]},
                            name      : 1
                        }
                    }, {
                        $group: {
                            _id           : '$fireDate',
                            firedCount    : {$sum: 1},
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
                        path   : 'firedEmployees.department',
                        select : '_id departmentName',
                        options: {
                            lean: true
                        }
                    }, function (err/*, deps*/) {
                        if (err) {
                            return parallelCb(err);
                        }

                        parallelCb(null, employees);
                    });
                });
        }

        async.parallel([hiredEmployees, firedEmployees], resultMapper);
    };

};

module.exports = wTrack;