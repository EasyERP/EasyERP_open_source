var mongoose = require('mongoose');
var async = require('async');
var objectId = mongoose.Types.ObjectId;
var moment = require('../public/js/libs/moment/moment');

var Employee = function (event, models) {
    'use strict';
    var EmployeeSchema = mongoose.Schemas.Employee;
    var ProjectSchema = mongoose.Schemas.Project;
    var DepartmentSchema = mongoose.Schemas.Department;
    var SourceSchema = mongoose.Schemas.source;
    var birthdaysSchema = mongoose.Schemas.birthday;
    var TransferSchema = mongoose.Schemas.Transfer;

    var _ = require('underscore');
    var fs = require('fs');
    var path = require('path');
    var validatorEmployee = require('../helpers/validator');
    var randomPass = require('../helpers/randomPass');
    var ids = ['52203e707d4dba8813000003',
        '563f673270bbc2b740ce89ae',
        '55b8cb7d0ce4affc2a0015cb',
        '55ba2ef1d79a3a343900001c',
        '560255d1638625cf32000005'];
    var CONSTANTS = require('../constants/mainConstants.js');
    var RESPONSES = require('../constants/responses');

    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Employees;

    var accessRoll = require('../helpers/accessRollHelper.js')(models);

    var Payroll = require('../handlers/payroll');
    var pageHelper = require('../helpers/pageHelper');
    var payrollHandler = new Payroll(models);

    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();

    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    var UserService = require('../services/user')(models);
    var EmployeeService = require('../services/employee')(models);
    var SettingsService = require('../services/settings')(models, event);
    var SessionService = require('../services/session')(models);

    var lookupForEmployeeArray = CONSTANTS.LOOKUP_FOR_EMPLOYEE_ARRAY;

    var logger = require('../helpers/logger');

    // var zimbra = require('../helpers/zimbra')();

    function recalculate(req, res, next) {
        getEmployeesInDateRange(req, res, next, set);
    }

    function accessEmployeeSalary(profileId) {
        var profiles = CONSTANTS.ACCESS_EMPLOYEE_SALARY;

        if (profileId) {
            return !(profiles.indexOf(profileId.toString()) < 0);
        }

        return false;
    }

    function getNameAndDepartment(db, query, callback) {
        var Model = models.get(db, 'Employees', EmployeeSchema);
        var matchQuery = {};

        if (query) {
            if (query.devDepartments) {
                matchQuery['department.isDevelopment'] = true;
            }
            if (query.isEmployee) {
                matchQuery.isEmployee = true;
            }
            if (query.salesDepartments) {
                matchQuery['department._id'] = {$in: CONSTANTS.SALESDEPARTMENTS.objectID()};
            }
        }

        Model.aggregate([{
            $project: {
                name      : 1,
                department: 1,
                isEmployee: 1
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
                isEmployee: 1,
                name      : 1
            }
        }, {
            $match: matchQuery
        }, {
            $sort: {'name.first': 1}
        }], function (err, employees) {
            if (err) {
                return callback(err);
            }

            callback(null, employees);
        });
    }

    function getDate(date) {
        var _date = new Date(date);
        var currentTimeZoneOffsetInMiliseconds = -_date.getTimezoneOffset() * 60 * 1000;
        var valueOfDate = _date.valueOf();

        valueOfDate += currentTimeZoneOffsetInMiliseconds;

        return new Date(valueOfDate);
    }

    function getAge(birthday) {
        var today = new Date();
        var years;

        birthday = new Date(birthday);
        years = today.getFullYear() - birthday.getFullYear();

        birthday.setFullYear(today.getFullYear());

        if (today < birthday) {
            years--;
        }

        return (years < 0) ? 0 : years;
    }

    function getById(req, res, next) {
        var projectSalary = {
            department          : 1,
            jobPosition         : 1,
            weeklyScheduler     : 1,
            manager             : 1,
            date                : 1,
            status              : 1,
            jobType             : 1,
            info                : 1,
            employee            : 1,
            scheduledPay        : 1,
            payrollStructureType: 1
        };
        var data = req.query;
        var profileId = req.session.profileId;
        var dbName = req.session.lastDb;
        var query;
        var getTransfer;
        var getEmployee;
        var parallelTasks;
        var transfers = models.get(dbName, 'transfers', TransferSchema);

        var isMethod = typeof res === 'function';

        // todo refactor it
        getTransfer = function (pCb) {
            if (req.notCheck || accessEmployeeSalary(profileId)) {
                projectSalary.salary = 1;
            }

            transfers
                .aggregate([{
                    $match: {employee: objectId(data.id)}
                }, {
                    $lookup: {
                        from        : 'Department',
                        localField  : 'department',
                        foreignField: '_id',
                        as          : 'department'
                    }
                }, {
                    $lookup: {
                        from        : 'JobPosition',
                        localField  : 'jobPosition',
                        foreignField: '_id',
                        as          : 'jobPosition'
                    }
                }, {
                    $lookup: {
                        from        : 'weeklySchedulers',
                        localField  : 'weeklyScheduler',
                        foreignField: '_id',
                        as          : 'weeklyScheduler'
                    }
                }, {
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'manager',
                        foreignField: '_id',
                        as          : 'manager'
                    }
                }, {
                    $lookup: {
                        from        : 'scheduledPays',
                        localField  : 'scheduledPay',
                        foreignField: '_id',
                        as          : 'scheduledPay'
                    }
                }, {
                    $lookup: {
                        from        : 'payrollStructureTypes',
                        localField  : 'payrollStructureType',
                        foreignField: '_id',
                        as          : 'payrollStructureType'
                    }
                }, {
                    $project: {
                        department          : {$arrayElemAt: ['$department', 0]},
                        jobPosition         : {$arrayElemAt: ['$jobPosition', 0]},
                        weeklyScheduler     : {$arrayElemAt: ['$weeklyScheduler', 0]},
                        manager             : {$arrayElemAt: ['$manager', 0]},
                        date                : 1,
                        status              : 1,
                        jobType             : 1,
                        salary              : 1,
                        info                : 1,
                        employee            : 1,
                        scheduledPay        : {$arrayElemAt: ['$scheduledPay', 0]},
                        payrollStructureType: {$arrayElemAt: ['$payrollStructureType', 0]}
                    }
                }, {
                    $project: {
                        'department._id'           : '$department._id',
                        'department.name'          : '$department.name',
                        'jobPosition._id'          : '$jobPosition._id',
                        'jobPosition.name'         : '$jobPosition.name',
                        'weeklyScheduler._id'      : '$weeklyScheduler._id',
                        'weeklyScheduler.name'     : '$weeklyScheduler.name',
                        'manager._id'              : '$manager._id',
                        'manager.name'             : '$manager.name',
                        date                       : 1,
                        status                     : 1,
                        jobType                    : 1,
                        salary                     : 1,
                        info                       : 1,
                        employee                   : 1,
                        'scheduledPay._id'         : '$scheduledPay._id',
                        'scheduledPay.name'        : '$scheduledPay.name',
                        'payrollStructureType._id' : '$payrollStructureType._id',
                        'payrollStructureType.name': '$payrollStructureType.name'
                    }
                }, {
                    $project: projectSalary
                }, {
                    $sort: {date: 1}
                }], function (err, transfer) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, transfer);
                });
        };

        getEmployee = function (pCb) {
            query = EmployeeService.findById(data.id, {dbName: dbName});

            query.populate('coach', 'name _id')
                .populate('relatedUser', 'login _id')
                .populate('workflow')
                .populate('createdBy.user')
                .populate('editedBy.user')
                .populate('groups.users')
                .populate('manager', '_id name')
                .populate('jobPosition', '_id name fullName')
                .populate('weeklyScheduler', '_id name')
                .populate('payrollStructureTypes', '_id name')
                .populate('scheduledPay', '_id name')
                .populate('department', '_id name')
                .populate('groups.group')
                .populate('groups.owner', '_id login');

            query.exec(function (err, foundEmployee) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, foundEmployee);
            });
        };

        parallelTasks = [getEmployee, getTransfer];

        async.parallel(parallelTasks, function (err, result) {
            var response;

            if (err) {
                if (!isMethod) {
                    return next(err);
                }

                return res(err);
            }

            response = result && result[0].set('transfer', result[1]);

            if (!isMethod) {
                return res.status(200).send(response);
            }

            res(null, response);
        });

    }

    function getFilter(req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var contentType = data.contentType;
        var viewType = data.viewType;
        var optionsObject = {};
        var filter = data.filter || {};
        var waterfallTasks;
        var accessRollSearcher;
        var contentSearcher;
        var keySort;
        var sort;
        var project;
        var projectSecond;
        var projectAfterRoot;
        var quickSearch = data.quickSearch;
        var regExp = new RegExp(quickSearch, 'ig');
        var matchObject = {};

        if (quickSearch) {
            matchObject.fullName = {$regex: regExp};
        }

        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: contentType
            });
        }

        if (data.sort) {
            keySort = Object.keys(data.sort)[0];
            data.sort[keySort] = parseInt(data.sort[keySort], 10);
            sort = data.sort;
        } else {
            sort = {'editedBy.date': -1};
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Model, cb);
        };

        contentSearcher = function (idsArray, cb) {
            var queryObject = {};

            queryObject.$and = [];

            if (optionsObject) {
                queryObject.$and.push(optionsObject);
            }

            queryObject.$and.push({_id: {$in: idsArray}});

            if (contentType === 'Employees') {
                queryObject.$and.push({isEmployee: true});

                switch (viewType) {
                    case ('list'):
                        project = {
                            manager         : {$arrayElemAt: ['$manager', 0]},
                            jobPosition     : {$arrayElemAt: ['$jobPosition', 0]},
                            department      : {$arrayElemAt: ['$department', 0]},
                            'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                            'editedBy.user' : {$arrayElemAt: ['$editedBy.user', 0]},
                            name            : 1,
                            fullName        : {
                                $concat: ['$name.first', ' ', '$name.last']
                            },
                            'editedBy.date' : 1,
                            'createdBy.date': 1,
                            dateBirth       : 1,
                            skype           : 1,
                            workEmail       : 1,
                            workPhones      : 1,
                            jobType         : 1,
                            isEmployee      : 1
                        };

                        projectSecond = {
                            'manager._id'     : '$manager._id',
                            'manager.name'    : '$manager.name',
                            'jobPosition._id' : '$jobPosition._id',
                            'jobPosition.name': '$jobPosition.name',
                            'department._id'  : '$department._id',
                            'department.name' : '$department.name',
                            'createdBy.user'  : 1,
                            'editedBy.user'   : 1,
                            'editedBy.date'   : 1,
                            'createdBy.date'  : 1,
                            name              : 1,
                            dateBirth         : 1,
                            skype             : 1,
                            workEmail         : 1,
                            workPhones        : 1,
                            jobType           : 1,
                            isEmployee        : 1
                        };

                        projectAfterRoot = {
                            _id             : '$root._id',
                            manager         : '$root.manager',
                            jobPosition     : '$root.jobPosition',
                            department      : '$root.department',
                            'createdBy.user': '$root.createdBy.user.login',
                            'editedBy.user' : '$root.editedBy.user.login',
                            'editedBy.date' : '$root.editedBy.date',
                            'createdBy.date': '$root.createdBy.date',
                            name            : '$root.name',
                            dateBirth       : '$root.dateBirth',
                            skype           : '$root.skype',
                            workEmail       : '$root.workEmail',
                            workPhones      : '$root.workPhones',
                            jobType         : '$root.jobType',
                            isEmployee      : '$root.isEmployee',
                            total           : 1
                        };

                        break;
                    case ('thumbnails'):
                        project = {
                            manager            : {$arrayElemAt: ['$manager', 0]},
                            jobPosition        : {$arrayElemAt: ['$jobPosition', 0]},
                            age                : 1,
                            relatedUser        : {$arrayElemAt: ['$relatedUser', 0]},
                            department         : {$arrayElemAt: ['$department', 0]},
                            'workPhones.mobile': 1,
                            name               : 1,
                            dateBirth          : 1,
                            isEmployee         : 1,
                            'editedBy.date'    : 1
                        };

                        projectSecond = {
                            'manager.name'     : '$manager.name',
                            'manager._id'      : '$manager._id',
                            'jobPosition._id'  : '$jobPosition._id',
                            'jobPosition.name' : '$jobPosition.name',
                            age                : 1,
                            'relatedUser.login': '$relatedUser.login',
                            workPhones         : 1,
                            name               : 1,
                            dateBirth          : 1,
                            isEmployee         : 1,
                            'department.name'  : '$department.name',
                            'department._id'   : '$department._id',
                            'editedBy.date'    : 1
                        };

                        projectAfterRoot = {
                            _id            : '$root._id',
                            jobPosition    : '$root.jobPosition',
                            manager        : '$root.manager',
                            age            : '$root.age',
                            relatedUser    : '$root.relatedUser',
                            workPhones     : '$root.workPhones',
                            name           : '$root.name',
                            department     : '$root.department',
                            dateBirth      : '$root.dateBirth',
                            isEmployee     : '$root.isEmployee',
                            total          : 1,
                            'editedBy.date': '$root.editedBy.date'
                        };
                        break;
                    // skip default;
                }
            } else if (contentType === 'Applications') {
                queryObject.$and.push({isEmployee: false});

                switch (viewType) {
                    case ('list'):
                        if (data && data.filter && data.filter.workflow) {
                            data.filter.workflow = data.filter.workflow.map(function (item) {
                                return item === 'null' ? null : item;
                            });
                        }

                        project = {
                            jobPosition     : {$arrayElemAt: ['$jobPosition', 0]},
                            'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                            'editedBy.user' : {$arrayElemAt: ['$editedBy.user', 0]},
                            department      : {$arrayElemAt: ['$department', 0]},
                            fullName        : {
                                $concat: ['$name.first', ' ', '$name.last']
                            },
                            name            : 1,
                            'editedBy.date' : 1,
                            'createdBy.date': 1,
                            dateBirth       : 1,
                            skype           : 1,
                            workEmail       : 1,
                            workPhones      : 1,
                            jobType         : 1,
                            isEmployee      : 1,
                            workflow        : {$arrayElemAt: ['$workflow', 0]},
                            personalEmail   : 1,
                            sequence        : 1,
                            hire            : 1,
                            fire            : 1
                        };

                        projectSecond = {
                            jobPosition     : 1,
                            'createdBy.user': 1,
                            'editedBy.user' : 1,
                            'editedBy.date' : 1,
                            'createdBy.date': 1,
                            name            : 1,
                            dateBirth       : 1,
                            skype           : 1,
                            department      : 1,
                            workEmail       : 1,
                            workPhones      : 1,
                            jobType         : 1,
                            isEmployee      : 1,
                            workflow        : 1,
                            personalEmail   : 1,
                            sequence        : 1,
                            hire            : 1,
                            fire            : 1
                        };

                        projectAfterRoot = {
                            _id               : '$root._id',
                            'jobPosition.name': '$root.jobPosition.name',
                            'jobPosition._id' : '$root.jobPosition._id',
                            'createdBy.user'  : '$root.createdBy.user.login',
                            'editedBy.user'   : '$root.editedBy.user.login',
                            'editedBy.date'   : '$root.editedBy.date',
                            'createdBy.date'  : '$root.createdBy.date',
                            'department._id'  : '$root.department._id',
                            'department.name' : '$root.department.name',
                            name              : '$root.name',
                            dateBirth         : '$root.dateBirth',
                            skype             : '$root.skype',
                            workEmail         : '$root.workEmail',
                            workPhones        : '$root.workPhones',
                            jobType           : '$root.jobType',
                            isEmployee        : '$root.isEmployee',
                            workflow          : '$root.workflow',
                            personalEmail     : '$root.personalEmail',
                            sequence          : '$root.sequence',
                            hire              : '$root.hire',
                            fire              : '$root.fire',
                            total             : 1
                        };
                        break;
                    // skip default;
                }
            }

            Model.aggregate([{
                $lookup: {
                    from        : 'Employees',
                    localField  : 'manager',
                    foreignField: '_id',
                    as          : 'manager'
                }
            }, {
                $lookup: {
                    from        : 'JobPosition',
                    localField  : 'jobPosition',
                    foreignField: '_id',
                    as          : 'jobPosition'
                }
            }, {
                $lookup: {
                    from        : 'Department',
                    localField  : 'department',
                    foreignField: '_id',
                    as          : 'department'
                }
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'relatedUser',
                    foreignField: '_id',
                    as          : 'relatedUser'
                }
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'createdBy.user',
                    foreignField: '_id',
                    as          : 'createdBy.user'
                }
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'editedBy.user',
                    foreignField: '_id',
                    as          : 'editedBy.user'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
                $project: project
            }, {
                $match: matchObject
            }, {
                $project: projectSecond
            }, {
                $match: queryObject
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: projectAfterRoot
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }
            ], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            var count;
            var firstElement;
            var response = {};

            if (err) {
                return next(err);
            }

            firstElement = result[0];
            count = firstElement && firstElement.total ? firstElement.total : 0;
            response.total = count;
            response.data = result;

            res.status(200).send(response);
        });

    }

    function getApplicationsForKanban(req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var response = {};
        var startTime = new Date();
        var data = req.query;
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var filterObj = {};

        response.data = [];
        response.workflowId = data.workflowId;

        accessRollSearcher = function (cb) {
            accessRoll(req, Model, cb);
        };

        contentSearcher = function (responseApplications, cb) {
            filterObj.$and = [];
            filterObj.$and.push({isEmployee: false});
            filterObj.$and.push({workflow: objectId(data.workflowId)});
            filterObj.$and.push({_id: {$in: responseApplications}});

            Model
                .find(filterObj)
                .select('_id name proposedSalary jobPosition nextAction workflow editedBy.date sequence fired')
                .populate('workflow', '_id')
                .populate('jobPosition', '_id name')
                .sort({lastFire: -1, sequence: -1})
                .limit(req.session.kanbanSettings.applications.countPerPage)
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            response.data = result;
            response.time = (new Date() - startTime);
            response.workflowId = data.workflowId;
            response.fold = (req.session.kanbanSettings.applications.foldWorkflows && req.session.kanbanSettings.applications.foldWorkflows.indexOf(data.workflowId.toString()) !== -1);

            res.status(200).send(response);
        });
    }

    function check(req, callback) {
        var now = new Date();
        var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var Birthdays = models.get(req.session.lastDb, 'birthdays', birthdaysSchema);

        Birthdays.find({}, function (err, birth) {
            if (err) {
                return callback(-1);
            }

            if (birth.length === 0) {
                return callback(0);
            }

            if (birth[0].date < dateOnly) {
                callback(0);
            } else {
                callback(1, birth[0].currentEmployees);
            }
        });
    }

    function getEmployeesInDateRange(req, res, next, callback) {
        var now = new Date();
        var day = 0;
        var _month = now.getMonth() + 1;
        var NUMBER_OF_MONTH = 1;
        var tempMonthLength = _month + NUMBER_OF_MONTH;
        var realPart;
        var query;
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        var separateWeklyAndMonthly = function (arrayOfEmployees) {
            var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var dayNumber = dateOnly.getDay();
            var LeftOffset = dayNumber - 1;
            var RightOffset = 7 - dayNumber;
            var FirstDateWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - LeftOffset).valueOf();
            var LastDateWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset).valueOf();
            var FirstDateNxtWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset + 1).valueOf();
            var LastDateNxtWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset * 2 + 1).valueOf();

            var currentEmployees = {};

            function getDaysToBirthday(birthday) {
                var today = new Date();
                var days;
                var firstDayOfYear = new Date(today.getFullYear() + 1, 0, 1);
                var lastDayOfYear = new Date(today.getFullYear(), 11, 31);
                if (birthday.getMonth() >= today.getMonth()) {
                    birthday.setFullYear(today.getFullYear());
                    days = Math.round((birthday - today) / 1000 / 60 / 60 / 24);
                } else {
                    days = Math.round((lastDayOfYear - today) / 1000 / 60 / 60 / 24);
                    days += Math.round((birthday.setFullYear(today.getFullYear() + 1) - firstDayOfYear) / 1000 / 60 / 60 / 24);
                }
                return days;
            }

            currentEmployees.monthly = arrayOfEmployees.map(function (employee) {
                if (employee.dateBirth) {
                    employee.daysForBirth = getDaysToBirthday(employee.dateBirth);
                }
                return employee;
            });

            currentEmployees.nextweek = currentEmployees.monthly.filter(function (employee) {
                var birthday;
                var valueOfBirthday;

                if (employee.dateBirth) {
                    birthday = new Date(employee.dateBirth);
                    birthday.setHours(0);
                    valueOfBirthday = birthday.valueOf();

                    if (valueOfBirthday >= FirstDateNxtWeek) {
                        if ((valueOfBirthday <= LastDateNxtWeek)) {
                            return true;
                        }
                    }
                }

                return false;
            });

            currentEmployees.weekly = currentEmployees.monthly.filter(function (employee) {
                var birthday;
                var valueOfBirthday;

                if (employee.dateBirth) {
                    birthday = new Date(employee.dateBirth);
                    birthday.setHours(0);
                    valueOfBirthday = birthday.valueOf();

                    if (valueOfBirthday >= FirstDateWeek) {
                        if ((valueOfBirthday <= LastDateWeek)) {
                            return true;
                        }
                    }

                }

                return false;
            });

            currentEmployees.monthly.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth) {
                    return 1;
                }

                if (a.daysForBirth < b.daysForBirth) {
                    return -1;
                }

                return 0;
            });
            currentEmployees.weekly.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth) {
                    return 1;
                }

                if (a.daysForBirth < b.daysForBirth) {
                    return -1;
                }

                return 0;
            });

            currentEmployees.nextweek.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth) {
                    return 1;
                }

                if (a.daysForBirth < b.daysForBirth) {
                    return -1;
                }

                return 0;
            });
            return currentEmployees;
        };

        if (tempMonthLength / 12 < 1) {

            query = {
                $or: [
                    {$and: [{month: _month}, {days: {$gte: day}}, {days: {$lte: 31}}]},
                    {$and: [{month: {$gt: _month}}, {month: {$lt: tempMonthLength}}]},
                    {$and: [{month: tempMonthLength}, {days: {$lte: day}}]}
                ]
            };
        } else {
            realPart = tempMonthLength % 12;
            query = {
                $or: [
                    {$and: [{month: _month}, {days: {$gte: day}}, {days: {$lte: 31}}]},
                    {$and: [{month: {$gte: 1}}, {month: {$lt: realPart}}]},
                    {$and: [{month: realPart}, {days: {$lt: day}}]}
                ]
            };
        }

        Model.aggregate(
            {
                $match: {
                    $and: [
                        {dateBirth: {$ne: null}},
                        {isEmployee: true}
                    ]
                }
            },
            {
                $project: {
                    _id  : 1,
                    month: {$month: '$dateBirth'},
                    days : {$dayOfMonth: '$dateBirth'}
                }
            },
            {
                $match: query
            },
            function (err, result) {
                if (err) {
                    return next(err);
                }

                Model.find().where('_id').in(result)
                    .select('_id name dateBirth age jobPosition workPhones.mobile department')
                    .populate('jobPosition', '_id name')
                    .populate('department', ' _id name')
                    .lean()
                    .exec(function (err, resArray) {
                        if (err) {
                            return callback(req, res, next, separateWeklyAndMonthly([]));
                        }

                        resArray.map(function (employee) {
                            employee.age = getAge(employee.dateBirth);
                            return employee;
                        });

                        callback(req, res, next, separateWeklyAndMonthly(resArray));
                    });
            });
    }

    function set(req, res, next, currentEmployees) {
        var result = {};
        var data = {};
        var now = new Date();
        var Birthdays = models.get(req.session.lastDb, 'birthdays', birthdaysSchema);

        data.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        data.currentEmployees = currentEmployees;

        Birthdays.findByIdAndUpdate({_id: 1}, data, {new: true, upsert: true}, function (err, birth) {
            if (err) {
                return next(err);
            }

            result.data = birth.currentEmployees;

            if (res && res.status) {
                res.status(200).send(result);
            }
        });
    }

    function checkNameUniq(req, model, modelSchema, callback) {
        var Model = models.get(req.session.lastDb, model, modelSchema);
        var response;

        Model.findOne({name: req.body.name}).exec(function (err, doc) {
            if (err) {
                return callback(err);
            }

            doc ? response = false : response = true;

            return callback(null, response);
        });
    }

    this.exportToXlsx = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Employees', EmployeeSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type;
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {
                contentType: 'Employees'
            });
        }

        options = {
            res         : res,
            next        : next,
            Model       : Model,
            map         : exportMap,
            returnResult: true,
            fileName    : type
        };

        function lookupForEmployee(cb) {
            var query = [];
            var i;

            query.push({$match: {isEmployee: type === 'Employees'}});

            for (i = 0; i < lookupForEmployeeArray.length; i++) {
                query.push(lookupForEmployeeArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        async.parallel([lookupForEmployee], function (err, result) {
            var resultArray = result[0];

            exporter.exportToXlsx({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type
            });
        });

    };

    this.exportToCsv = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Employees', EmployeeSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type;
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {
                contentType: 'Employees'
            });
        }

        options = {
            res         : res,
            next        : next,
            Model       : Model,
            map         : exportMap,
            returnResult: true,
            fileName    : type
        };

        function lookupForEmployee(cb) {
            var query = [];
            var i;

            query.push({$match: {isEmployee: type === 'Employees'}});

            for (i = 0; i < lookupForEmployeeArray.length; i++) {
                query.push(lookupForEmployeeArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        async.parallel([lookupForEmployee], function (err, result) {
            var resultArray = result[0];

            exporter.exportToCsv({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type
            });
        });

    };

    this.getNameAndDepartment = getNameAndDepartment;

    this.getEmployeesCount = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Model.find({isEmployee: true}).count(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result});
        });
    };

    this.getEmployeesCountForDashboard = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var month = parseInt(req.query.month, 10) + 1;
        var year = parseInt(req.query.year, 10);
        var startMomentDate = moment().year(year).month(month - 1).startOf('month');
        var endMomentDate = moment().year(year).month(month - 1).endOf('month');
        var startDate = year * 100 + moment(startMomentDate).week();
        var endDate = year * 100 + moment(endMomentDate).week();
        var employeeQueryForEmployeeByDep = {
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
                }]
            }]
        };

        function isEmployee(callback) {
            Employee.aggregate([{
                $match: {
                    isEmployee: true
                }
            }, {
                $lookup: {
                    from        : 'transfers',
                    localField  : '_id',
                    foreignField: 'employee',
                    as          : 'transfer'
                }
            }, {
                $project: {
                    lastFire  : 1,
                    hire      : 1,
                    fire      : 1,
                    isEmployee: 1,
                    lastHire  : {
                        $let: {
                            vars: {
                                lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                            },

                            in: {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                        }
                    }
                }
            }, {
                $match: employeeQueryForEmployeeByDep
            }, {
                $group: {
                    _id  : null,
                    count: {$sum: 1}
                }
            }], function (err, result) {
                var count;

                if (err) {
                    return callback(err);
                }

                count = result && result.length ? result[0].count : 0;

                callback(null, count);
            });
        }

        function hired(callback) {
            Employee.aggregate([{
                $match: {
                    isEmployee: true
                }
            }, {
                $lookup: {
                    from        : 'transfers',
                    localField  : '_id',
                    foreignField: 'employee',
                    as          : 'transfer'
                }
            }, {
                $project: {
                    lastFire  : 1,
                    hire      : 1,
                    fire      : 1,
                    isEmployee: 1,
                    lastHire  : {
                        $let: {
                            vars: {
                                lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                            },

                            in: {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                        }
                    }
                }
            }, {
                $match: {
                    $and: [{
                        lastFire: null,
                        lastHire: {
                            $ne : null,
                            $gte: startDate
                        }
                    }, {
                        lastHire: {
                            $ne : null,
                            $lte: endDate
                        }
                    }]
                }
            }, {
                $group: {
                    _id  : null,
                    count: {$sum: 1}
                }
            }], function (err, result) {
                var count;

                if (err) {
                    return callback(err);
                }

                count = result && result.length ? result[0].count : 0;

                callback(null, count);
            });
        }

        function fired(callback) {
            Employee.aggregate([{
                $match: {
                    isEmployee: false,
                    hire      : {$ne: []}
                }
            }, {
                $lookup: {
                    from        : 'transfers',
                    localField  : '_id',
                    foreignField: 'employee',
                    as          : 'transfer'
                }
            }, {
                $project: {
                    lastFire  : 1,
                    hire      : 1,
                    fire      : 1,
                    isEmployee: 1,
                    lastHire  : {
                        $let: {
                            vars: {
                                lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                            },

                            in: {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                        }
                    }
                }
            }, {
                $match: {
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
                }
            }, {
                $group: {
                    _id  : null,
                    count: {$sum: 1}
                }
            }], function (err, result) {
                var count;

                if (err) {
                    return callback(err);
                }

                count = result && result.length ? result[0].count : 0;

                callback(null, count);
            });
        }

        async.parallel([
            isEmployee,
            hired,
            fired
        ], function (err, result) {
            var employeeCount;
            var hiredCount;
            var firedCount;

            if (err) {
                return next(err);
            }

            result = result && result.length ? result : [];

            employeeCount = result[0];
            hiredCount = result[1];
            firedCount = result[2];

            res.status(200).send({employeeCount: employeeCount, hiredCount: hiredCount, firedCount: firedCount});
        });
    };

    this.getSalaryForChart = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var query = req.query;
        var month = parseInt(query.month, 10) + 1;
        var year = parseInt(query.year, 10);
        var startMomentDate = moment().year(year).month(month - 1).startOf('month');
        var endMomentDate = moment().year(year).month(month - 1).endOf('month');
        var startDate = new Date(startMomentDate);
        var endDate = new Date(endMomentDate);

        Employee.aggregate([{
            $project: {
                transfer  : 1,
                isEmployee: 1
            }
        }, {
            $lookup: {
                from        : 'transfers',
                localField  : '_id',
                foreignField: 'employee',
                as          : 'transfer'
            }
        }, {
            $unwind: '$transfer'
        }, {
            $project: {
                _id       : 1,
                isEmployee: 1,
                date      : '$transfer.date',
                salary    : '$transfer.salary'
            }
        }, {
            $match: {
                $and: [{
                    isEmployee: true
                }, {
                    date: {
                        $ne : null,
                        $lte: endDate
                    }
                }]
            }
        }, {
            $group: {
                _id   : '$_id',
                salary: {$last: '$salary'}
            }
        }, {
            $project: {
                _id: '$salary'
            }
        }], function (err, result) {
            var salary;

            if (err) {
                return next(err);
            }

            salary = _.map(result, function (item) {
                return item._id;
            });

            res.status(200).send({data: salary});
        });
    };

    this.getSalaryForChartByDepartment = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var query = req.query;
        var month = parseInt(query.month, 10) + 1;
        var year = parseInt(query.year, 10);
        var startMomentDate = moment().year(year).month(month - 1).startOf('month');
        var endMomentDate = moment().year(year).month(month - 1).endOf('month');
        var startDate = new Date(startMomentDate);
        var endDate = new Date(endMomentDate);

        Employee.aggregate([{
            $project: {
                transfer  : 1,
                isEmployee: 1
            }
        }, {
            $lookup: {
                from        : 'transfers',
                localField  : '_id',
                foreignField: 'employee',
                as          : 'transfer'
            }
        }, {
            $unwind: '$transfer'
        }, {
            $project: {
                _id       : 1,
                isEmployee: 1,
                date      : '$transfer.date',
                salary    : '$transfer.salary',
                department: '$transfer.department'
            }
        }, {
            $lookup: {
                from        : 'Department',
                localField  : 'department',
                foreignField: '_id',
                as          : 'department'
            }
        }, {
            $match: {
                $and: [{
                    isEmployee: true
                }, {
                    date: {
                        $ne : null,
                        $lte: endDate
                    }
                }]
            }
        }, {
            $group: {
                _id       : '$_id',
                salary    : {$last: '$salary'},
                department: {$first: '$department'}//{$push: ['$department', 0]}*/
            }
        }, {
            $group: {
                _id   : '$department',
                salary: {$sum: '$salary'}
            }
        }, {
            $project: {
                _id   : '$_id.name',
                salary: 1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.getYears = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Model.aggregate([{
            $project: {
                hire: 1
            }
        }, {
            $unwind: '$hire'
        }, {
            $project: {
                date: '$hire'
            }
        }, {
            $group: {
                _id: '$date'
            }
        }], function (err, result) {
            var arr;
            var min;

            if (err) {
                return next(err);
            }

            arr = _.pluck(result, '_id');
            min = _.min(arr);

            res.status(200).send({min: min});
        });

    };

    this.getForDD = function (req, res, next) {
        var query = req.query;

        getNameAndDepartment(req.session.lastDb, query, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.getBySales = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        function assigneFinder(cb) {
            var match = {
                projectmanager: {$ne: null}
            };

            Project.aggregate([{
                $match: match
            }, {
                $group: {
                    _id: '$projectmanager'
                }
            }], cb);
        }

        function employeeFinder(assignedArr, cb) {
            Model
                .find({_id: {$in: assignedArr}})
                .select('_id name')
                .sort({'name.first': 1, 'name.last': 1})
                .lean()
                .exec(cb);
        }

        async.waterfall([assigneFinder, employeeFinder], function (err, employees) {
            if (err) {
                return next(err);
            }

            res.status(200).send(employees);
        });

    };

    this.getEmployeesForChart = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee
            .aggregate([{
                $match: {isEmployee: true}
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
                    gender    : 1,
                    name      : 1
                }
            }, {
                $group: {
                    _id           : '$department',
                    employeesCount: {
                        $sum: 1
                    },

                    maleCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ['$gender', 'male']
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    },

                    femaleCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ['$gender', 'female']
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            }, {
                $project: {
                    _id           : '$_id.name',
                    employeesCount: 1,
                    maleCount     : 1,
                    femaleCount   : 1
                }
            }], function (err, employees) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(employees);
            });
    };

    this.byDepartmentForChart = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);

        Department.aggregate([{
            $lookup: {
                from        : 'Employees',
                localField  : '_id',
                foreignField: 'department',
                as          : 'employees'
            }
        }, {
            $unwind: '$employees'
        }, {
            $match: {
                'employees.isEmployee': true
            }
        }, {
            $project: {
                employees: {
                    name: {
                        $concat: ['$employees.name.first', ' ', '$employees.name.last']
                    },
                    _id : '$employees._id'
                },

                parentDepartment: 1,
                _id             : 1,
                name            : 1
            }
        }, {
            $group: {
                _id             : '$_id',
                parentDepartment: {$push: '$parentDepartment'},
                name            : {$push: '$name'},
                employees       : {$push: '$employees'}
            }
        }, {
            $project: {
                employees       : 1,
                parentDepartment: {$arrayElemAt: ['$parentDepartment', 0]},
                _id             : 1,
                name            : {$arrayElemAt: ['$name', 0]}
            }
        }, {
            $group: {
                _id        : '$parentDepartment',
                departments: {
                    $push: {
                        _id             : '$_id',
                        name            : '$name',
                        employees       : '$employees',
                        parentDepartment: '$parentDepartment'
                    }
                }
            }
        }, {
            $lookup: {
                from        : 'Department',
                localField  : '_id',
                foreignField: '_id',
                as          : 'parent'
            }
        }, {
            $project: {
                _id        : 1,
                departments: 1,
                selfData   : {
                    $arrayElemAt: ['$parent', 0]
                }
            }
        }, {
            $lookup: {
                from        : 'Department',
                localField  : 'selfData.parentDepartment',
                foreignField: '_id',
                as          : 'mainParent'
            }
        }, {
            $project: {
                _id        : 1,
                departments: 1,
                name       : '$selfData.name',
                parent     : {$arrayElemAt: ['$mainParent', 0]}
            }
        }, {
            $match: {_id: {$ne: null}}
        }], function (err, result) {
            var data = {};

            if (err) {
                return next(err);
            }

            result.forEach(function (item) {
                if (item && item.departments) {
                    item.departments.forEach(function (department) {
                        var d = _.find(result, function (el) {
                            return department._id && el._id ? department._id.toString() === el._id.toString() : null;
                        });

                        if (d && d.departments) {
                            department.departments = d.departments;
                            result.splice(result.indexOf(d), 1);
                        }

                        if (department.name === 'Web') {
                            department.departments.push({
                                name            : 'JS',
                                employees       : department.employees,
                                parentDepartment: department._id
                            });

                            department.employees = null;
                        }
                    });
                }
            });

            data._id = null;
            data.name = 'Departments';
            data.children = result;

            res.status(200).send(data);
        });
    };

    this.byDepartment = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Model
            .aggregate([{
                $match: {isEmployee: true}
            }, {
                $group: {
                    _id      : '$department',
                    employees: {
                        $push: {
                            name: {$concat: ['$name.first', ' ', '$name.last']},
                            _id : '$_id'
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
                    return next(err);
                }

                res.status(200).send(employees);
            });
    };

    this.getForProjectDetails = function (req, res, next) {
        var idsArray = req.query.data || [];
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Model
            .find({_id: {$in: idsArray}})
            .populate('jobPosition', '_id name')
            .populate('department', '_id name')
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });

    };

    this.create = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Employees', EmployeeSchema);
        var userId = req.session.uId;
        var currentDate = new Date();
        var body = req.body;
        var err;
        var noteObj;

        body.dbName = dbName;

        if (body.dateBirth) {
            body.dateBirth = getDate(body.dateBirth);
            body.age = getAge(body.dateBirth);
        }
        if (body.notes && body.notes.length) {
            body.notes[0]._id = mongoose.Types.ObjectId();
            body.notes[0].date = currentDate;
        }
        if (body.notes && body.notes.length) {
            noteObj = body.notes[0];

            noteObj._id = mongoose.Types.ObjectId();
            noteObj.date = currentDate;
            noteObj.author = req.session.uName;
        }

        if (body.transfer && body.transfer.length) {
            body.transfer[0].salary = body.transfer[0].salary || 0;
        }

        if (!validatorEmployee.validEmployeeBody(body)) {
            err = new Error();
            err.status = 404;

            return next(err);
        }

        body.createdBy = body.createdBy || Object.create(null);
        body.editedBy = body.editedBy || Object.create(null);

        body.createdBy.user = userId;
        body.editedBy.user = userId;
        body.createdBy.date = currentDate;
        body.editedBy.date = currentDate;

        function create(body, callback) {
            var waterfallTasks;
            var password;
            var email;

            function employeeCreator(waterfallCb) {
                EmployeeService.create(body, waterfallCb);
            }

            function defaultProfile(employee, waterfallCb) {
                SettingsService.getSettings({dbName: dbName}, function (err, _defaultProfile) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    waterfallCb(null, employee, _defaultProfile._id);
                });

            }

            function userCreator(employee, profileId, waterfallCb) {
                var _user;

                email = employee.workEmail || employee.personalEmail;

                password = randomPass.generate(8);

                _user = {
                    login          : body.userName,
                    imageSrc       : employee.imageSrc,
                    pass           : password,
                    profile        : profileId,
                    email          : email,
                    relatedEmployee: employee._id,
                    dbName         : dbName
                };

                UserService.create(_user, function (err, user) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    waterfallCb(null, employee, user);
                });
            }

            function employeeUpdater(employee, user, waterfallCb) {
                var _id = employee._id;

                EmployeeService.findByIdAndUpdate(_id, {$set: {relatedUser: user._id}}, {dbName: dbName}, waterfallCb);
            }

            waterfallTasks = [employeeCreator];

            if (body.isEmployee) {
                waterfallTasks.push(defaultProfile, userCreator, employeeUpdater);
            }

            async.waterfall(waterfallTasks, callback);
        }

        if (!body.isEmployee) {
            event.emit('updateSequence', Model, 'sequence', 0, 0, body.workflow, body.workflow, true, false, function (sequence) {
                body.sequence = sequence;

                create(body, function (err, employee) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send({result: employee, id: employee._id});
                });
            });
        } else {
            create(body, function (err, employee) {
                if (err) {
                    return next(err);
                }

                res.status(201).send({result: employee, id: employee._id});
            });
        }
    };

    this.createTransfer = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Transfers', TransferSchema);
        var body = req.body;
        var transfer = new Model(body);

        transfer.save(function (err, result) {
            if (err) {
                return next(err);
            }

            res.send(201, {success: 'A new Transfer create success'/* , data: result*/});
        });
    };

    this.updateTransfer = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Transfers', TransferSchema);
        var body = req.body;

        async.each(body, function (data, cb) {
            var id = data._id;

            delete data._id;

            Model.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, updatedDoc) {
                var transferKey = updatedDoc ? updatedDoc.transferKey : null;
                var transferDate;
                var employee;

                if (err) {
                    return cb(err);
                }

                if (!transferKey) {
                    return cb();
                }

                transferDate = moment(new Date(updatedDoc.date)).subtract(1, 'days');
                transferDate = transferDate.toDate();
                employee = updatedDoc.employee;

                Model.update({
                    transferKey: transferKey,
                    employee   : employee,
                    status     : 'transfer'
                }, {
                    $set: {
                        date: transferDate
                    }
                }, {new: true}, cb);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'A Transfer update success'});
        });
    };

    this.removeTransfer = function (req, res, next) {
        var TransferModel = models.get(req.session.lastDb, 'Transfers', TransferSchema);
        var body = req.body;
        var removeIdArray = body.removeTransfer;

        async.each(removeIdArray, function (id, cb) {

            TransferModel.findByIdAndRemove(id, function (err, result) {
                var transferKey;
                var employee;

                if (err) {
                    return cb(err);
                }

                transferKey = result ? result.transferKey : null;

                if (transferKey) {
                    employee = result.employee;
                    return TransferModel.remove({employee: employee, transferKey: transferKey, status: 'transfer'}, cb);
                }

                cb();
            });

        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'A Transfers delete success'});
        });
    };

    this.updateOnlySelectedFields = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Employees', EmployeeSchema);
        var _id = req.params.id;
        var UsersSchema = mongoose.Schemas.User;
        var UsersModel = models.get(dbName, 'Users', UsersSchema);
        var data = req.body;
        var fileName = data.fileName;
        var isUpdateSequence;
        var waterfallTasks;
        var startWorkflow;
        var startSequence;
        var obj;

        var remove = req.headers.remove;

        function updateEmployee(_id, updateObject, options, waterfallCb) {
            EmployeeService.findByIdAndUpdate(_id, updateObject, options, waterfallCb);
        }

        function defaultProfile(employee, waterfallCb) {
            SettingsService.getSettings({dbName: dbName}, function (err, _defaultProfile) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, employee, _defaultProfile._id);
            });

        }

        function userCreator(employee, profileId, waterfallCb) {
            var email = employee.workEmail || employee.personalEmail;
            var password = randomPass.generate(8);

            function findUser(query, options, _waterfallCb) {
                UserService.find(query, options, function (err, _users) {
                    if (err) {
                        return _waterfallCb(err);
                    }

                    _waterfallCb(null, _users);
                });
            }

            function updateUser(_user, _waterfallCb) {
                var id = _user._id;

                UserService.findByIdAndUpdate(id, {$set: {profile: profileId}}, {dbName: dbName}, function (err, result) {
                    if (err) {
                        return _waterfallCb(err);
                    }

                    _waterfallCb(null, result);
                });
            }

            function userManipulator(users, _waterfallCb) {
                var user = users && users[0];
                var _user = {
                    login          : data.userName,
                    imageSrc       : employee.imageSrc,
                    pass           : password,
                    profile        : profileId,
                    email          : email,
                    relatedEmployee: employee._id,
                    dbName         : dbName
                };

                if (user && user._id) {
                    return updateUser(user, _waterfallCb);
                }

                UserService.create(_user, function (err, user) {
                    if (err) {
                        return _waterfallCb(err);
                    }

                    _waterfallCb(null, user);
                });
            }

            async.waterfall([async.apply(findUser, {$or: [{login: data.userName}, {email: email}]}, {dbName: dbName}), userManipulator], function (err, user) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, employee, user);
            });

        }

        function userUpdater(employee, waterfallCb) {
            var _id = employee.relatedUser;

            if (!_id) {
                return waterfallCb(null, employee);
            }

            UserService.findByIdAndUpdate(_id, {
                $set: {
                    profile: CONSTANTS.BANED_PROFILE
                }
            }, {
                dbName: dbName
            }, function (err, user) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, employee);

                SessionService.findByUserIdAndRemove(_id);
            });
        }

        function employeeUpdater(employee, user, waterfallCb) {
            var _id = employee._id;

            EmployeeService.findByIdAndUpdate(_id, {$set: {relatedUser: user._id}}, {dbName: dbName}, waterfallCb);
        }

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };

        if (data.notes && data.notes.length !== 0 && !remove) {
            obj = data.notes[data.notes.length - 1];
            if (!obj._id) {
                obj._id = mongoose.Types.ObjectId();
            }
            // obj.date = new Date();

            if (!obj.author) {
                obj.author = req.session.uName;
            }
            data.notes[data.notes.length - 1] = obj;
        }

        startWorkflow = data.workflowStart;
        startSequence = parseInt(data.sequenceStart, 10);
        isUpdateSequence = !isNaN(startSequence) && startWorkflow;

        delete data.fileName;

        // todo separate it into application & employee

        if (data.workflow && isUpdateSequence) {
            if (data.sequence === -1) {
                event.emit('updateSequence', Model, 'sequence', startSequence, data.sequence, startWorkflow, startWorkflow, false, true, function () {
                    event.emit('updateSequence', Model, 'sequence', startSequence, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;

                        if (data.workflow === startWorkflow) {
                            data.sequence -= 1;
                        }

                        Model.findByIdAndUpdate(_id, data, {new: true}, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            res.status(200).send({success: 'Employees updated', sequence: result.sequence});
                        });
                    });
                });
            } else {
                event.emit('updateSequence', Model, 'sequence', startSequence, data.sequence, startWorkflow, data.workflow, false, false, function (sequence) {
                    delete data.sequenceStart;
                    delete data.workflowStart;

                    data.sequence = sequence;

                    Model.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err) {
                        if (err) {
                            return next(err);
                        }

                        if (data.relatedUser) {
                            // todo update user profile
                            UsersModel.findByIdAndUpdate(data.relatedUser, {$set: {relatedEmployee: _id}}, function (error) {
                                if (error) {
                                    return next(error);
                                }

                                res.status(200).send({success: 'Employees updated'});
                            });
                        } else {
                            res.status(200).send({success: 'Employees updated'});
                        }
                    });
                });
            }
        } else {
            if (data.dateBirth) {
                data.age = getAge(data.dateBirth);
            }

            if (data.workflow === 0) {
                data.workflow = objectId('528ce682f3f67bc40b00001a');
            }

            waterfallTasks = [async.apply(updateEmployee, _id, {$set: data}, {dbName: dbName})];

            if (data.isHire) {
                waterfallTasks.push(defaultProfile, userCreator, employeeUpdater);
            } else if (data.isFire) {
                waterfallTasks.push(userUpdater);
            }

            async.waterfall(waterfallTasks, function (err, result) {
                var os = require('os');
                var osType = (os.type().split('_')[0]);
                var _userId;
                var newDirname;
                var path;
                var dir;

                if (err) {
                    return next(err);
                }

                if (data.dateBirth || data.hired) {
                    event.emit('recalculate', req, null, next);
                }

                // todo refactor it
                if (fileName) {
                    switch (osType) {
                        case 'Windows':
                            newDirname = __dirname.replace('\\Modules', '');
                            while (newDirname.indexOf('\\') !== -1) {
                                newDirname = newDirname.replace('\\', '\/');
                            }
                            path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                            dir = newDirname + '\/uploads\/' + _id;
                            break;
                        case 'Linux':
                            newDirname = __dirname.replace('/Modules', '');
                            while (newDirname.indexOf('\\') !== -1) {
                                newDirname = newDirname.replace('\\', '\/');
                            }
                            path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                            dir = newDirname + '\/uploads\/' + _id;
                            break;
                        // skip default;
                    }

                    fs.unlink(path, function (err) {
                        fs.readdir(dir, function (err, files) {
                            if (files && files.length === 0) {
                                fs.rmdir(dir, function () {
                                });
                            }
                        });
                    });

                }

                event.emit('recollectVacationDash', {dbName: dbName});

                res.status(200).send(result);

                _userId = result && result.relatedUser;

                if (data.imageSrc && _userId) {

                    UserService.findByIdAndUpdate(_userId, {
                        $set: {
                            imageSrc: data.imageSrc
                        }
                    }, {
                        dbName: dbName
                    }, function (err) {
                        if (err) {
                            logger.error(err);
                        }

                        console.log('>> User updated');
                    });
                }

                // todo add check if salary report need update
                payrollHandler.composeSalaryReport(req);
            });
        }
    };

    this.remove = function (req, res, next) {
        var _id = req.params.id;
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Employees', EmployeeSchema);
        var TransferModel = models.get(dbName, 'transfers', TransferSchema);

        EmployeeService.findByIdAndRemove(_id, {dbName: dbName}, function (err, result) {
            var employee;

            if (err) {
                return next(err);
            }

            if (result && !result.isEmployee) {
                event.emit('updateSequence', Model, 'sequence', result.sequence, 0, result.workflow, result.workflow, false, true);
            }

            employee = result;

            event.emit('recalculate', req, null, next);
            event.emit('recollectVacationDash', {dbName: dbName});

            TransferModel.remove({employee: objectId(_id)}, function (err, result) {
                var _id;

                if (err) {
                    return next(err);
                }

                if (employee && employee.relatedUser) {
                    _id = employee.relatedUser;

                    UserService.findByIdAndRemove(_id, {
                        dbName: dbName
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send({success: 'Employees removed'});
                    });
                } else {
                    res.status(200).send({success: 'Employees removed'});
                }
            });
        });
    };

    this.bulkRemove = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Employees', EmployeeSchema);
        var TransferModel = models.get(dbName, 'transfers', TransferSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            EmployeeService.findByIdAndRemove(id, {
                dbName: dbName
            }, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (result && !result.isEmployee) {
                    event.emit('updateSequence', Model, 'sequence', result.sequence, 0, result.workflow, result.workflow, false, true);
                }

                event.emit('recalculate', req, null, next);
                event.emit('recollectVacationDash', {dbName: dbName});

                TransferModel.remove({employee: objectId(id)}, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                });
                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            UserService.findAndRemove({
                _id: {$in: ids}
            }, {
                dbName: dbName
            }, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: true});
            });
        });
    };

    this.getForDdByRelatedUser = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var result = {};
        var uId = req.session.uId;

        var query = Model.find({relatedUser: uId, isEmployee: true}, {name: 1}).sort({'name.first': 1});

        query.exec(function (err, user) {
            if (err) {
                return next(err);
            }

            result.data = user;
            res.status(200).send(result);

        });
    };

    this.forProfile = function (req, res, next) {
        var userId = req.params.userId;
        var dbName = req.session.lastDb;
        var _findUser;

        function findUser(userId, waterfallCb) {
            UserService.find({_id: userId}, {relatedEmployee: 1}, {dbName: dbName}, function (err, users) {
                var user;

                if (err) {
                    return waterfallCb(err);
                }

                user = users && users[0];

                waterfallCb(null, user);
            });
        }

        function findEmployee(user, waterfallCb) {
            req.query = req.query || {};
            req.query.id = user && user.relatedEmployee;

            getById(req, function (err, employee) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, employee);
            });
        }

        _findUser = async.apply(findUser, userId);

        async.waterfall([_findUser, findEmployee], function (err, employee) {
            if (err) {
                return next(err);
            }

            res.status(200).send(employee);
        });
    };

    this.getByViewTpe = function (req, res, next) { // toDO refactor id only by params or query
        var query = req.query;
        var viewType = query.viewType;
        var id = req.query.id;

        if (id && id.length >= 24) {
            getById(req, res, next);
            return false;
        }

        switch (viewType) {
            case 'form':
                getById(req, res, next);
                break;
            case 'kanban':
                getApplicationsForKanban(req, res, next);
                break;
            case 'thumbnails':
                getFilter(req, res, next);
                break;
            case 'list':
                getFilter(req, res, next);
                break;
            // skip default;
        }
    };

    this.getForJournalSource = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var data = req.query;
        var _id = data._id;

        Model.findById(_id)
            .select('department manager jobPosition name imageSrc dateBirth personalEmail workPhones skype relatedUser jobType workEmail')
            .populate('department', 'name')
            .populate('manager', 'name')
            .populate('jobPosition', 'name')
            .populate('relatedUser', 'login')
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
    };

    this.getSalesPerson = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var result = {};
        var query = Model.find(/* {'isEmployee': true}*/{}, {name: 1}).sort({'name.first': 1});

        query.exec(function (err, employees) {
            if (err) {
                return next(err);
            }

            result.data = employees;
            res.status(200).send(result);
        });

    };

    this.getEmployeesAlphabet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var response = {};
        var query = Model
            .aggregate([{
                $match: {
                    isEmployee: true
                }
            }, {
                $project: {
                    later: {$substr: ['$name.last', 0, 1]}
                }
            }, {
                $group: {
                    _id: '$later'
                }
            }]);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            response.data = result;
            res.status(200).send(response);
        });
    };

    this.getEmployeesImages = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var data = req.params;
        var idsArray = data.ids || [];
        var query;

        if (!idsArray.length) {
            idsArray = req.query.ids || [];
        }

        query = Model.find({isEmployee: true, _id: {$in: idsArray}}, {imageSrc: 1, name: 1});

        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: response});

        });
    };

    this.getCollectionLengthByWorkflows = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var data = {};

        data.showMore = false;

        accessRollSearcher = function (cb) {
            accessRoll(req, Model, cb);
        };

        contentSearcher = function (deps, cb) {
            Model
                .aggregate([{
                    $match: {
                        _id       : {$in: deps},
                        isEmployee: false
                    }
                }, {
                    $project: {
                        _id     : 1,
                        workflow: 1
                    }
                },
                    {
                        $group: {
                            _id  : '$workflow',
                            count: {$sum: 1}
                        }
                    }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            result.forEach(function (object) {
                if (object.count > req.session.kanbanSettings.applications.countPerPage) {
                    data.showMore = true;
                }
            });
            data.arrayOfObjects = result;
            res.send(data);
        });

    };

    this.getSources = function (req, res, next) {
        var Sources = models.get(req.session.lastDb, 'sources', SourceSchema);

        Sources.find({}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var headers = req.headers;
        var id = headers.modelid || 'empty';
        var contentType = headers.modelname || 'persons';
        var files = req.files && req.files.attachfile ? req.files.attachfile : null;
        var dir;
        var err;

        contentType = contentType.toLowerCase();
        dir = path.join(contentType, id);

        if (!files) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        uploader.postFile(dir, files, {userId: req.session.uName}, function (err, file) {
            if (err) {
                return next(err);
            }

            Model.findByIdAndUpdate(id, {$push: {attachments: {$each: file}}}, {new: true}, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Customers updated success', data: response});
            });
        });
    };

    this.setSettings = function (req, res, next) {
        var dbName = req.session.lastDb;
        var body = req.body;

        body.dbName = dbName;

        SettingsService.setSettings(body, function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send(response);
        });
    };

    this.getSettings = function (req, res, next) {
        var dbName = req.session.lastDb;
        var body = req.body;

        body.dbName = dbName;

        SettingsService.getSettings(body, function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send(response);
        });
    };

    this.getBirthdays = function (req, res, next) {

        var err = new Error();
        var result = {};
        result.data = [];

        check(req, function (status, employees) {
            switch (status) {
                case -1:
                    err.status = 500;
                    next(err);
                    break;
                case 0:
                    getEmployeesInDateRange(req, res, next, set);
                    break;
                case 1:
                    result.data = employees;
                    res.status(200).send(result);
                    break;
                // skip default;
            }
        });
    };

    event.on('recalculate', recalculate);
};

module.exports = Employee;
