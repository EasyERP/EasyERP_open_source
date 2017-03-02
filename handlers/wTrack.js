var mongoose = require('mongoose');

var TCard = function (event, models) {
    'use strict';

    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var _ = require('underscore');
    var wTrackSchema = mongoose.Schemas.wTrack;
    var MonthHoursSchema = mongoose.Schemas.MonthHours;
    var HolidaySchema = mongoose.Schemas.Holiday;
    var VacationSchema = mongoose.Schemas.Vacation;
    var jobsSchema = mongoose.Schemas.jobs;
    var ProjectSchema = mongoose.Schemas.Project;
    var EmployeeSchema = mongoose.Schemas.Employee;
    var objectId = mongoose.Types.ObjectId;

    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var moment = require('../public/js/libs/moment/moment');
    var CONSTANTS = require('../constants/mainConstants.js');
    var dateArrayGenerator = require('../helpers/dateArrayGenerator');

    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').wTrack;

    var overTimeHelper = require('../helpers/tCard');

    var JournalEntryHandler = require('./journalEntry');
    var journalEntry = new JournalEntryHandler(models);
    var ProductService = require('../services/products')(models);
    var AvailabilityService = require('../services/productAvailability')(models);

    var lookupForWTrackArrayBeforeFilter = [{
        $lookup: {
            from        : 'Project',
            localField  : 'project',
            foreignField: '_id',
            as          : 'project'
        }
    }, {
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
        $project: {
            project         : {$arrayElemAt: ['$project', 0]},
            employee        : {$arrayElemAt: ['$employee', 0]},
            department      : {$arrayElemAt: ['$department', 0]},
            'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
            'editedBy.user' : {$arrayElemAt: ['$editedBy.user', 0]},
            month           : 1,
            year            : 1,
            week            : 1,
            worked          : 1,
            _type           : 1,
            1               : 1,
            2               : 1,
            3               : 1,
            4               : 1,
            5               : 1,
            6               : 1,
            7               : 1,
            'editedBy.date' : 1,
            'createdBy.date': 1
        }
    }, {
        $lookup: {
            from        : 'Customers',
            localField  : 'project.customer',
            foreignField: '_id',
            as          : 'customer'
        }
    }, {
        $project: {
            1                    : 1,
            2                    : 1,
            3                    : 1,
            4                    : 1,
            5                    : 1,
            6                    : 1,
            7                    : 1,
            'project.projectName': '$project.name',
            'project.customer'   : {$arrayElemAt: ['$customer', 0]},
            'employee.name'      : {$concat: ['$employee.name.first', ' ', '$employee.name.last']},
            department           : 1,
            'createdBy.user'     : '$createdBy.user.login',
            'editedBy.user'      : '$editedBy.user.login',
            _type                : 1,
            year                 : 1,
            month                : 1,
            week                 : 1,
            worked               : 1,
            'editedBy.date'      : 1,
            'createdBy.date'     : 1,
            'employee._id'       : '$employee._id',
            'project._id'        : '$project._id'
        }
    }, {
        $project: {
            1                      : 1,
            2                      : 1,
            3                      : 1,
            4                      : 1,
            5                      : 1,
            6                      : 1,
            7                      : 1,
            'project.projectName'  : 1,
            'project.customer.Name': {$concat: ['$project.customer.name.first', ' ', '$project.customer.name.last']},
            'employee.name'        : 1,
            department             : 1,
            'createdBy.user'       : 1,
            'editedBy.user'        : 1,
            _type                  : 1,
            year                   : 1,
            month                  : 1,
            week                   : 1,
            worked                 : 1,
            'editedBy.date'        : 1,
            'createdBy.date'       : 1,
            'employee._id'         : 1,
            'customer._id'         : '$project.customer._id',
            'project._id'          : 1
        }
    }];

    var lookupForWTrackArrayAfterFilter = [{
        $project: {
            1                      : 1,
            2                      : 1,
            3                      : 1,
            4                      : 1,
            5                      : 1,
            6                      : 1,
            7                      : 1,
            'project.projectName'  : 1,
            'project.customer.Name': 1,
            'employee.name'        : 1,
            'department.name'      : '$department.name',
            'createdBy.user'       : 1,
            'editedBy.user'        : 1,
            year                   : 1,
            month                  : 1,
            week                   : 1,
            worked                 : 1,
            'editedBy.date'        : 1,
            'createdBy.date'       : 1
        }
    }, {
        $project: {
            1                      : 1,
            2                      : 1,
            3                      : 1,
            4                      : 1,
            5                      : 1,
            6                      : 1,
            7                      : 1,
            'project.projectName'  : 1,
            'project.customer.Name': 1,
            'employee.name'        : 1,
            'department.name'      : 1,
            'createdBy.user'       : 1,
            'editedBy.user'        : 1,
            year                   : 1,
            month                  : 1,
            week                   : 1,
            worked                 : 1,
            'editedBy.date'        : 1,
            'createdBy.date'       : 1
        }
    }
    ];

    /* exporter.addExportFunctionsToHandler(this, function (req) {
     return models.get(req.session.lastDb, 'wTrack', wTrackSchema);
     }, exportMap, "wTrack");*/

    this.create = function (req, res, next) {
        var dbName = req.session.lastDb;
        var docs = [];
        var wTracks = [];
        var body = mapObject(req.body);
        var overTimeTcard = overTimeHelper(body);
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);
        var wTrack;
        var worked = parseInt(body.worked, 10);

        worked = isNaN(worked) ? 0 : worked;

        docs.push(body);

        if (overTimeTcard && overTimeTcard.worked) {
            docs.push(overTimeTcard);
        }

        if (worked) {
            async.each(docs, function (body, cb) {
                wTrack = new WTrack(body);
                wTrack.save(function (err, _wTrack) {
                    if (err) {
                        return cb(err);
                    }

                    wTracks.push(_wTrack);
                    cb();
                    event.emit('setReconcileTimeCard', {req: req, jobs: _wTrack.jobs});
                    event.emit('recalculateKeys', {req: req, wTrack: _wTrack});
                    event.emit('recollectVacationDash', {dbName: dbName});
                });
            }, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(wTracks);
            });

        } else {
            res.status(200).send({success: 'Empty tCard'});
        }
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body) || {};
        var dbName = req.session.lastDb;
        // var overTimeTcard = overTimeHelper(data);
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);
        var needUpdateKeys = data.month || data.week || data.year || data.isoYear;

        var worked = 0;
        var hours;
        var day;

        for (day = 7; day >= 1; day--) {
            hours = data[day];

            if (hours) {
                worked += parseInt(hours, 10);
            }
        }

        function resultCb(err, tCard) {
            if (err) {
                return next(err);
            }

            if (tCard) {
                event.emit('setReconcileTimeCard', {req: req, jobs: tCard.jobs});
                event.emit('recollectVacationDash', {dbName: dbName});

                if (needUpdateKeys) {
                    event.emit('recalculateKeys', {req: req, wTrack: tCard});
                }
            }
            res.status(200).send({success: 'updated'});
        }

        data.editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        if (isFinite(worked) && worked === 0) {
            WTrack.findByIdAndRemove(id, resultCb);
        } else {
            if (isFinite(worked)) {
                data.worked = worked;
            }

            WTrack.findByIdAndUpdate(id, {$set: data}, {new: true}, resultCb);
        }
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);
        var uId = req.session.uId;

        function resultCb(err, tCard, needUpdateKeys, cb) {
            if (err) {
                return cb(err);
            }

            if (tCard) {
                event.emit('setReconcileTimeCard', {req: req, jobs: tCard.jobs});
                event.emit('recollectVacationDash', {dbName: dbName});

                if (needUpdateKeys) {
                    event.emit('recalculateKeys', {req: req, wTrack: tCard});
                }
            }

            cb(null, tCard);
        }

        async.each(body, function (_data, cb) {
            var needUpdateKeys;
            var worked;
            var data;
            var id;

            data = _data || {};
            worked = data.worked;

            id = data._id;
            needUpdateKeys = data.month || data.week || data.year || data.isoYear;

            if (data.revenue) {
                data.revenue *= 100;
            }

            if (data.cost) {
                data.cost *= 100;
            }

            data.editedBy = {
                user: uId,
                date: new Date().toISOString()
            };

            delete data._id;

            if (isFinite(worked) && worked === 0) {
                WTrack.findByIdAndRemove(id, function (err, tCard) {
                    resultCb(err, tCard, needUpdateKeys, cb);
                });
            } else {
                if (isFinite(worked)) {
                    data.worked = worked;
                }

                WTrack.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, tCard) {
                    resultCb(err, tCard, needUpdateKeys, cb);
                });
            }
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var contentSearcher;
        var query = req.query;
        var filter = query.filter;
        var filterObj = {};
        var waterfallTasks;

        var accessRollSearcher = function (cb) {
            accessRoll(req, WTrack, cb);
        };

        if (filter) {
            filterObj.$and = filterMapper.mapFilter(filter, {contentType: 'wTrack'});
        }

        contentSearcher = function (wTrackIDs, waterfallCallback) {
            var queryObject = {};

            queryObject.$and = [];

            if (filterObj) {
                queryObject.$and.push(filterObj);
            }

            queryObject.$and.push({_id: {$in: wTrackIDs}});

            WTrack.aggregate([/* {
             $lookup: {
             from        : 'projectMembers',
             localField  : 'project',
             foreignField: 'projectId',
             as          : 'projectMembers'
             }
             },*/
                {
                    $lookup: {
                        from        : 'Project',
                        localField  : 'project',
                        foreignField: '_id',
                        as          : 'project'
                    }
                }, {
                    $project: {
                        project   : {$arrayElemAt: ['$project', 0]},
                        /* salesmanagers: {
                         $filter: {
                         input: '$projectMembers',
                         as   : 'projectMember',
                         cond : {$eq: ["$$projectMember.projectPositionId", objectId(CONSTANTS.SALESMANAGER)]}
                         }
                         },*/
                        employee  : 1,
                        dateByWeek: 1,
                        department: 1,
                        month     : 1,
                        year      : 1,
                        week      : 1,
                        isPaid    : 1,
                        customer  : 1,
                        _type     : 1
                    }
                }, {
                    $lookup: {
                        from        : 'Customers',
                        localField  : 'project.customer',
                        foreignField: '_id',
                        as          : 'customer'
                    }
                }, /* {
                 $unwind: {
                 path                      : '$salesmanagers',
                 preserveNullAndEmptyArrays: true
                 }
                 },*/
                {
                    $project: {
                        customer  : {$arrayElemAt: ['$customer', 0]},
                        // salesmanagers: 1,
                        dateByWeek: 1,
                        project   : 1,
                        employee  : 1,
                        department: 1,
                        month     : 1,
                        year      : 1,
                        week      : 1,
                        isPaid    : 1,
                        _type     : 1
                    }
                }, {
                    $project: {
                        project       : 1,
                        employee      : 1,
                        department    : 1,
                        month         : 1,
                        year          : 1,
                        week          : 1,
                        isPaid        : 1,
                        'customer._id': 1,
                        _type         : 1
                    }
                }, {
                    $match: queryObject
                }], function (err, result) {
                if (err) {
                    return next(err);
                }

                waterfallCallback(null, result.length);
            });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result});
        });
    };

    this.getHours = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Employees = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var month = parseInt(req.query.month, 10) + 1;
        var year = parseInt(req.query.year, 10);
        var startMomentDate = moment().year(year).month(month - 1).startOf('month');
        var endMomentDate = moment().year(year).month(month - 1).endOf('month');
        var startDate = year * 100 + moment(startMomentDate).week();
        var endDate = year * 100 + moment(endMomentDate).week();
        var workedDays = 0;
        var employeeQueryForEmployeeByDep;
        var i;

        for (i = moment(endMomentDate).date(); i >= 1; i--) {
            if ((moment(endMomentDate).date(i).day() !== 6) && (moment(endMomentDate).date(i).day() !== 0)) {
                workedDays++;
            }
        }

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
                }]
            }]
        };

        function getByEmployees(callback) {
            Employees.aggregate([{
                $match: {
                    department: {$nin: CONSTANTS.NOT_DEV_ARRAY.objectID()}
                }
            }, {
                $project: {
                    weeklyScheduler: 1,
                    lastFire       : 1,
                    hire           : 1,
                    fire           : 1,
                    isEmployee     : 1,
                    lastHire       : {
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
                $lookup: {
                    from        : 'weeklySchedulers',
                    localField  : 'weeklyScheduler',
                    foreignField: '_id',
                    as          : 'weeklyScheduler'
                }
            }, {
                $project: {
                    weeklyScheduler: {$arrayElemAt: ['$weeklyScheduler', 0]}
                }
            }, {
                $group: {
                    _id  : null,
                    hours: {$sum: '$weeklyScheduler.totalHours'}
                }
            }, {
                $project: {
                    hours: {$multiply: [{$divide: ['$hours', 5]}, workedDays]}
                }
            }], function (err, hours) {
                if (err) {
                    return callback(err);
                }

                callback(null, hours);
            });
        }

        function getBywTrack(callback) {
            WTrack.aggregate([{
                $match: {
                    month: month,
                    year : year
                }
            }, {
                $group: {
                    _id  : '$_type',
                    hours: {$sum: '$worked'}
                }
            }], function (err, hours) {
                if (err) {
                    return callback(err);
                }

                callback(null, hours);
            });
        }

        async.parallel([
            getBywTrack,
            getByEmployees
        ], function (err, result) {
            var wTr;
            var byEmployee;
            var resObj;
            var overtime;
            var actual;

            if (err) {
                return next(err);
            }

            wTr = result[0];
            byEmployee = result[1];
            resObj = {};

            resObj.total = byEmployee && byEmployee.length ? byEmployee[0].hours : 0;

            overtime = _.find(wTr, function (item) {
                return item._id === 'overtime';
            });

            actual = _.find(wTr, function (item) {
                return item._id === 'ordinary';
            });

            actual = actual || {};
            actual.hours = actual.hours || 0;
            resObj.overtime = (overtime && overtime.hours) || 0;
            resObj.actual = (actual.hours + resObj.overtime) || 0;
            resObj.idle = resObj.total - actual.hours;

            res.status(200).send(resObj);
        });
    };

    this.getByViewType = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        var query = req.query;
        var filter = query.filter;
        var contentSearcher;
        var waterfallTasks;
        var key;
        var keyForDay;
        var sortArray;
        var sortLength;
        var dynamicKey = '';
        var i;
        var sortObj = {
            Mo: 1,
            Tu: 2,
            We: 3,
            Th: 4,
            Fr: 5,
            Sa: 6,
            Su: 7
        };

        var sort = {};
        var filterObj = filter ? filterMapper.mapFilter(filter, {contentType: 'wTrack'}) : null;
        var count = parseInt(query.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        var page = parseInt(query.page, 10);
        var skip;

        var accessRollSearcher = function (cb) {
            accessRoll(req, WTrack, cb);
        };

        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
        skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (query.sort) {
            key = Object.keys(query.sort)[0].toString();
            keyForDay = sortObj[key];

            if (key.indexOf('.name.first') !== -1) {
                sortArray = key.split('.');
                sortLength = sortArray.length;

                for (i = 0; i < sortLength - 1; i++) {
                    dynamicKey += sortArray[i] + '.';
                }

                dynamicKey += 'last';
                query.sort[dynamicKey] = parseInt(query.sort[key], 10);
                sort = query.sort;
            }

            if (sortObj.hasOwnProperty(key)) {
                sort[keyForDay] = parseInt(query.sort[key], 10);
            } else {
                query.sort[key] = parseInt(query.sort[key], 10);
                sort = query.sort;
            }
        } else {
            sort = {'createdBy.date': -1};
        }

        contentSearcher = function (wtrackIds, waterfallCallback) {
            var queryObject = {};
            var aggregation;

            queryObject.$and = [];
            queryObject.$and.push({_id: {$in: wtrackIds}});

            if (filterObj) {
                queryObject.$and.push(filterObj);
            }

            aggregation = WTrack.aggregate([{
                $lookup: {
                    from        : 'Project',
                    localField  : 'project',
                    foreignField: '_id',
                    as          : 'project'
                }
            }, {
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
                $lookup: {
                    from        : 'jobs',
                    localField  : 'jobs',
                    foreignField: '_id',
                    as          : 'jobs'
                }
            }, {
                $project: {
                    project         : {$arrayElemAt: ['$project', 0]},
                    jobs            : {$arrayElemAt: ['$jobs', 0]},
                    employee        : {$arrayElemAt: ['$employee', 0]},
                    department      : {$arrayElemAt: ['$department', 0]},
                    'createdBy.date': 1,
                    dateByWeek      : 1,
                    month           : 1,
                    year            : 1,
                    week            : 1,
                    worked          : 1,
                    _type           : 1,
                    1               : 1,
                    2               : 1,
                    3               : 1,
                    4               : 1,
                    5               : 1,
                    6               : 1,
                    7               : 1
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'project.customer',
                    foreignField: '_id',
                    as          : 'customer'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'project.workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
                $project: {
                    customer: {$arrayElemAt: ['$customer', 0]},
                    workflow: {$arrayElemAt: ['$workflow', 0]},

                    project: {
                        _id : '$project._id',
                        name: '$project.name'
                    },

                    jobs: {
                        _id : '$jobs._id',
                        name: '$jobs.name'
                    },

                    employee: {
                        _id : '$employee._id',
                        name: '$employee.name'
                    },

                    department: {
                        _id : '$department._id',
                        name: '$department.name'
                    },

                    'createdBy.date': 1,
                    dateByWeek      : 1,
                    month           : 1,
                    year            : 1,
                    week            : 1,
                    worked          : 1,
                    isPaid          : 1,
                    _type           : 1,
                    1               : 1,
                    2               : 1,
                    3               : 1,
                    4               : 1,
                    5               : 1,
                    6               : 1,
                    7               : 1
                }
            }, {
                $match: queryObject
            }, {
                $project: {
                    customer: {
                        _id : '$customert._id',
                        name: '$customer.name'
                    },

                    workflow: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    },

                    'createdBy.date': 1,
                    project         : 1,
                    jobs            : 1,
                    employee        : 1,
                    department      : 1,
                    dateByWeek      : 1,
                    month           : 1,
                    year            : 1,
                    week            : 1,
                    worked          : 1,
                    isPaid          : 1,
                    _type           : 1,
                    1               : 1,
                    2               : 1,
                    3               : 1,
                    4               : 1,
                    5               : 1,
                    6               : 1,
                    7               : 1,
                    notRemovable    : {
                        $cond: {
                            if: {
                                $eq: ['$workflow.name', 'Closed']
                            },

                            then: true,
                            else: false
                        }
                    }
                }
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    _id             : '$root._id',
                    customer        : '$root.customer',
                    project         : '$root.project',
                    employee        : '$root.employee',
                    department      : '$root.department',
                    jobs            : '$root.jobs',
                    workflow        : '$root.workflow',
                    dateByWeek      : '$root.dateByWeek',
                    month           : '$root.month',
                    year            : '$root.year',
                    week            : '$root.week',
                    worked          : '$root.worked',
                    isPaid          : '$root.isPaid',
                    _type           : '$root._type',
                    'createdBy.date': '$root.createdBy.date',
                    1               : '$root.1',
                    2               : '$root.2',
                    3               : '$root.3',
                    4               : '$root.4',
                    5               : '$root.5',
                    6               : '$root.6',
                    7               : '$root.7',
                    notRemovable    : '$root.notRemovable',
                    total           : 1
                }
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: count
            }]);

            aggregation.options = {allowDiskUse: true};
            aggregation.exec(function (err, result) {
                waterfallCallback(err, result);
            });

        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            var count;
            var response = {};

            if (err) {
                return next(err);
            }

            count = result[0] && result[0].total ? result[0].total : 0;

            response.total = count;
            response.data = result;
            res.status(200).send(response);
        });
    };

    this.bulkRemove = function (req, res, next) {
        var dbName = req.session.lastDb;
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            WTrack.findByIdAndRemove(id, function (err, tCard) {
                var projectId;

                if (err) {
                    return next(err);
                }

                projectId = tCard ? tCard.project : null;

                journalEntry.removeBySourceDocument(req, tCard._id);

                event.emit('setReconcileTimeCard', {req: req, jobs: tCard.jobs});

                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            event.emit('recollectVacationDash', {dbName: dbName});

            res.status(200).send({success: true});
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var dbName = req.session.lastDb;
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);

        WTrack.findByIdAndRemove(id, function (err, tCard) {
            var projectId;

            if (err) {
                return next(err);
            }

            projectId = tCard ? tCard.project : null;

            journalEntry.removeBySourceDocument(req, tCard._id);

            event.emit('recollectVacationDash', {dbName: dbName});
            event.emit('setReconcileTimeCard', {req: req, jobs: tCard.jobs});

            res.status(200).send({success: tCard});
        });
    };

    this.getForProjects = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var query = req.query;
        /* var queryObject = filter ? filterMapper.mapFilter(filter) : {};
         var filter = query.filter;*/
        var contentSearcher;
        var waterfallTasks;
        var key;
        var keyForDay;
        var months = [];
        var years = [];
        var uMonth;
        var uYear;
        var sortArray;
        var sortLength;
        var dynamicKey = '';
        var i;
        var sortObj = {
            Mo: 1,
            Tu: 2,
            We: 3,
            Th: 4,
            Fr: 5,
            Sa: 6,
            Su: 7
        };

        var sort = {};
        var count = parseInt(query.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        var page = query.page || 1;

        var skip;

        var accessRollSearcher = function (cb) {
            accessRoll(req, WTrack, cb);
        };

        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
        skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (query.sort) {
            key = Object.keys(query.sort)[0];
            keyForDay = sortObj[key];

            if (key.indexOf('.name.first') !== -1) {
                sortArray = key.split('.');
                sortLength = sortArray.length;

                for (i = 0; i < sortLength - 1; i++) {
                    dynamicKey += sortArray[i] + '.';
                }

                dynamicKey += 'last';
                query.sort[dynamicKey] = parseInt(query.sort[key], 10);
                sort = query.sort;
            }

            if (sortObj.hasOwnProperty(key)) {
                sort[keyForDay] = query.sort[key];
            } else {
                sort = query.sort;
            }
        } else {
            sort = {'project.name': 1, year: 1, month: 1, week: 1};
        }

        contentSearcher = function (wtrackIds, waterfallCallback) {
            var queryObject = {_id: {$in: wtrackIds}};

            WTrack
                .find(queryObject)
                .limit(count)
                .skip(skip)
                .sort(sort)
                .lean()
                .exec(waterfallCallback);
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            result.forEach(function (elem) {
                months.push(elem.month);
                years.push(elem.year);
            });

            uMonth = _.uniq(months);
            uYear = _.uniq(years);

            monthHours.aggregate([{
                $match: {
                    year : {$in: uYear},
                    month: {$in: uMonth}
                }
            }, {
                $project: {
                    date : {$add: [{$multiply: ['$year', 100]}, '$month']},
                    hours: '$hours'

                }
            }, {
                $group: {
                    _id  : '$date',
                    value: {$addToSet: '$hours'}
                }
            }], function (err, months) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({wTrack: result, monthHours: months});
            });
        });
    };

    this.generateWTrack = function (req, res, next) {
        var dbName = req.session.lastDb;
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);
        var Job = models.get(dbName, 'jobs', jobsSchema);
        var Project = models.get(dbName, 'Project', ProjectSchema);
        var data = req.body;
        var jobId = req.headers.jobid;

        var createJob = req.headers.createjob === 'true';
        var jobName = req.headers.jobname;
        var jobDescr = req.headers.jobdesc;
        var project = req.headers.project;
        var warehouse = req.headers.warehouse;
        var productType = req.headers.producttype;
        var categoryIds = JSON.parse(req.headers.categoryids);

        var tasks;

        if (jobId && jobId.length >= 24) {
            jobId = objectId(jobId);
        }

        function createJobFunc(mainCb) {
            var job = {
                name       : jobName,
                workflow   : CONSTANTS.JOBSINPROGRESS,
                description: jobDescr,
                type       : 'Not Ordered',
                wTracks    : [],
                project    : objectId(project)
            };
            var newJob;
            var editedBy;
            var body;

            if (createJob) {
                editedBy = {
                    user: req.session.uId,
                    date: new Date()
                };
                job.createdBy = editedBy;

                newJob = new Job(job);

                newJob.save(function (err, job) {
                    if (err) {
                        return mainCb(err);
                    }

                    jobId = job.toJSON()._id;

                    body = {
                        job      : job._id,
                        warehouse: warehouse,
                        name     : job.name,
                        info     : {
                            productType: productType,
                            categories : categoryIds
                        }
                    };

                    ProductService.createProduct({
                        body  : body,
                        dbName: req.session.lastDb,
                        uId   : req.session.uId
                    }, function (err, data) {
                        if (!err && data) {
                            AvailabilityService.createAvailabilityJob({product: data._id, dbName: req.session.lastDb});
                        }
                    });

                    Project.findByIdAndUpdate(objectId(project), {
                        $push: {'budget.projectTeam': jobId},
                        $set : {editedBy: editedBy}
                    }, {new: true}, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });

                    mainCb(null, jobId);
                });
            } else {
                mainCb(null, jobId);
            }
        }

        function generatewTracks(job, mainCb) {
            var jobForwTrack = job;
            var userId = req.session.uId;

            async.each(data, function (options, asyncCb) {
                var startDate = moment(new Date(options.startDate));
                var startIsoYear = startDate.isoWeekYear();
                var endDate = moment(new Date(options.endDate));
                var endIsoYear = options.endDate ? endDate.isoWeekYear() : startIsoYear + 1;
                var hours = parseInt(options.hours, 10);
                var project = options.project;
                var employee = options.employee;
                var department = options.department;
                var hoursInWeek = 0;

                journalEntry.setReconcileDate(req, startDate);

                function canFillIt(hours) {
                    return (isFinite(hours) && hours > 0) || isNaN(hours);

                }

                function endDateCalculator(startDate, hoursInWeek, totalHours) {
                    var weekCount = Math.ceil(totalHours / hoursInWeek);
                    var endDate;

                    if (!isFinite(weekCount)) {
                        return moment();
                    }

                    endDate = moment(startDate).add(weekCount, 'weeks');

                    return endDate;
                }

                function dateSplitter(startDate, endDate) {
                    var datesArray = [];
                    var lastDateInStartWeek = moment(startDate).endOf('isoWeek');

                    var _dateObject;

                    function dateHelper(date) {
                        var startDate;
                        var endDate;

                        date = moment(date);
                        startDate = date.add(1, 'day').hours(0).minutes(0);
                        endDate = moment(startDate).endOf('isoWeek');

                        return {
                            startDate: startDate,
                            endDate  : endDate
                        };
                    }

                    if (lastDateInStartWeek > endDate) {
                        datesArray.push({
                            startDate: startDate,
                            endDate  : endDate
                        });

                        return datesArray;
                    }

                    startDate = moment(startDate);
                    endDate = moment(endDate);

                    datesArray.push({
                        startDate: moment(startDate),
                        endDate  : moment(lastDateInStartWeek)
                    });

                    while (lastDateInStartWeek < endDate) {
                        _dateObject = dateHelper(lastDateInStartWeek);

                        lastDateInStartWeek = _dateObject.endDate;

                        if (lastDateInStartWeek > endDate) {
                            datesArray.push({
                                startDate: _dateObject.startDate,
                                endDate  : endDate
                            });
                        } else {
                            datesArray.push({
                                startDate: _dateObject.startDate,
                                endDate  : _dateObject.endDate
                            });
                        }
                    }

                    return datesArray;
                }

                function comparator(holidaysArray, vacationsArray, dateByWeek, day) {
                    return !!((vacationsArray && vacationsArray[dateByWeek] && vacationsArray[dateByWeek][day]) || (holidaysArray && holidaysArray[dateByWeek] && holidaysArray[dateByWeek][day]));
                }

                function filler(startDay, endDay, options) {
                    var holidaysArray = options.holidaysArray;
                    var vacationsArray = options.vacationsArray;
                    var weekData = options.weekData;
                    var dateByWeek = options.dateByWeek;
                    var dateByMonth = options.dateByMonth;
                    var isoYear = options.isoYear;
                    var year = options.year;
                    var week = options.week;
                    var month = options.month;
                    var weekObject = {
                        1          : 0,
                        2          : 0,
                        3          : 0,
                        4          : 0,
                        5          : 0,
                        6          : 0,
                        7          : 0,
                        worked     : 0,
                        dateByWeek : dateByWeek,
                        dateByMonth: dateByMonth,
                        isoYear    : isoYear,
                        year       : year,
                        week       : week,
                        month      : month,
                        employee   : employee,
                        department : department,
                        project    : project,
                        cost       : 0,
                        isPaid     : false,
                        jobs       : jobForwTrack,
                        whoCanRW   : 'everyOne',
                        createdBy  : {
                            date: new Date(),
                            user: userId
                        },

                        groups: {
                            group: [],
                            users: [],
                            owner: null
                        }
                    };
                    var canFillIt = !!options.canFillIt;
                    var hasHolidayOrVacation;
                    var isData;
                    var day;
                    var diffHours;
                    var worked;

                    if (startDay !== 0 && endDay !== 0) {
                        startDay = startDay || 1;
                    }
                    if (!endDay && endDay === 0 && endDay !== startDay) {
                        endDay = 7;
                    }

                    for (day = startDay; day <= endDay; day++) {
                        hasHolidayOrVacation = comparator(holidaysArray, vacationsArray, dateByWeek, day);

                        if (!hasHolidayOrVacation && weekData[day] && canFillIt) {
                            isData = true;
                            worked = parseInt(weekData[day], 10);

                            if (isNaN(worked)) {
                                worked = 0;
                            }

                            if (hours > 0) {
                                diffHours = hours - worked;

                                if (diffHours < 0) {
                                    worked = hours;
                                }

                                hours -= worked;
                            }

                            if (isNaN(hours) || diffHours) {
                                weekObject[day] = worked;
                                weekObject.worked += worked;

                                if (diffHours < 0) {
                                    diffHours = 0;
                                }
                            }
                        }
                    }

                    return isData ? weekObject : null;
                }

                function divider(startDate, endDate, holidaysArray, vacationsArray, optionsData) {
                    var startMonth = startDate.month() + 1;
                    var startDay = startDate.day();
                    var startIsoYear = startDate.isoWeekYear();
                    var startYear = startDate.year();

                    var endMonth = endDate.month() + 1;
                    var endDay = endDate.day();
                    /* var endIsoYear = endDate.isoWeekYear();*/
                    var endYear = endDate.year();

                    var week = startDate.isoWeek();
                    var dateByWeek = startIsoYear * 100 + week;
                    var dateByMonth = startYear * 100 + startMonth;

                    var options = {
                        holidaysArray : holidaysArray,
                        vacationsArray: vacationsArray,
                        weekData      : optionsData,
                        dateByWeek    : dateByWeek,
                        dateByMonth   : dateByMonth,
                        isoYear       : startIsoYear,
                        year          : startYear,
                        week          : week,
                        month         : startMonth
                    };

                    var result = [];

                    var lastDayInMonth;
                    var firstDayInMonth;
                    var clonedOptions;

                    if ((endYear * 100 + endMonth) > dateByMonth) {
                        clonedOptions = _.clone(options);
                        lastDayInMonth = moment(startDate).endOf('month').day();
                        firstDayInMonth = moment(endDate).startOf('month').day();

                        options.canFillIt = canFillIt(hours);
                        result.push(filler(startDay, lastDayInMonth, options));

                        if (startYear < endYear) {
                            dateByMonth = endYear * 100 + endMonth;
                            clonedOptions.dateByMonth = dateByMonth;
                            clonedOptions.year = endYear;
                        }

                        clonedOptions.month = endMonth;
                        clonedOptions.canFillIt = canFillIt(hours);
                        result.push(filler(firstDayInMonth, endDay, clonedOptions));
                    } else {
                        options.canFillIt = canFillIt(hours);
                        result.push(filler(startDay, endDay, options));
                    }

                    return result;
                }

                function getVacationsHolidays(generateCb) {
                    var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
                    var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
                    var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
                    var totalHolidays = 0;
                    var total = 0;
                    var employee = options.employee;
                    var j;

                    for (j = 7; j >= 1; j--) {
                        options[j] = parseInt(options[j], 10);
                    }

                    function getEmployee(parallelCb) {
                        var query = Employee.find({_id: objectId(employee)}, {name: 1, hire: 1, fire: 1});

                        query.exec(function (err, result) {
                            if (err) {
                                parallelCb(err);
                            }

                            parallelCb(null, result[0].toString());
                        });
                    }

                    function getHolidays(parallelCb) {
                        var newResultHolidays = {};
                        var queryHolidays = Holiday.find({year: {$gte: startIsoYear, $lte: endIsoYear}}).lean();

                        queryHolidays.exec(function (err, result) {
                            if (err) {
                                parallelCb(err);
                            }

                            result.forEach(function (element) {
                                var date = element.date;
                                var d = moment(date);
                                var year = d.isoWeekYear();
                                var week = d.isoWeek();
                                var key = year * 100 + week;
                                var dayOfWeek = moment(date).day();

                                key = key.toString();

                                if (!newResultHolidays[key]) {
                                    newResultHolidays[key] = {};
                                }

                                newResultHolidays[key][dayOfWeek.toString()] = dayOfWeek;
                                totalHolidays++;
                            });

                            parallelCb(null, {holidays: newResultHolidays, total: totalHolidays});
                        });
                    }

                    function getVacations(parallelCb) {
                        var query = Vacation.find({
                            year    : {$gte: startIsoYear, $lte: endIsoYear},
                            employee: employee
                        }, {month: 1, year: 1, vacArray: 1}).lean();

                        query.exec(function (err, result) {
                            var newResult = {};

                            if (err) {
                                parallelCb(err);
                            }

                            if (result) {
                                result.forEach(function (element) {
                                    var vacArr = element.vacArray;
                                    var year = element.year;
                                    var month = element.month;
                                    var weekKey;
                                    var dayNumber;
                                    var dateValue;
                                    var key;
                                    var dayKey;
                                    var day;

                                    for (day = vacArr.length - 1; day >= 0; day--) {

                                        if (vacArr[day]) {
                                            dateValue = moment([year, month - 1, day + 1]);
                                            weekKey = /*year*/moment(dateValue).isoWeekYear() * 100 + moment(dateValue).isoWeek();
                                            key = weekKey.toString();

                                            dayNumber = dateValue.day();

                                            dayKey = dayNumber.toString();

                                            if (!newResult[key]) {
                                                newResult[key] = {};
                                            }

                                            newResult[key][dayKey] = dayNumber;
                                            total++;
                                        }
                                    }
                                });
                                parallelCb(null, {vacations: newResult, total: total});
                            }
                        });
                    }

                    async.parallel([getHolidays, getVacations, getEmployee], generateCb);
                }

                function taskRunner(vacationsHolidays, generateCb) {
                    var dayHours;
                    var dayNumber;
                    var err;

                    if (!hours && endDate.toString() !== 'Invalid Date') {
                        calculateWeeks(startDate, endDate, vacationsHolidays, generateCb);
                    } else if (hours) {
                        for (dayNumber = 7; dayNumber >= 1; dayNumber--) {
                            dayHours = options[dayNumber];
                            hoursInWeek += parseInt(dayHours, 10);
                        }

                        endDate = endDateCalculator(startDate, hoursInWeek, hours);
                        calculateWeeks(startDate, endDate, vacationsHolidays, function (err) {
                            if (err) {
                                return generateCb(err);
                            }

                            if (hours && hours > 0) {
                                taskRunner(vacationsHolidays, generateCb);
                            } else {
                                generateCb();
                            }
                        });
                    } else {
                        err = new Error('Bad Request');
                        err.status = 400;

                        generateCb(err);
                    }
                }

                function calculateWeeks(startDate, endDate, vacationsHolidays, cb) {
                    var holidays = vacationsHolidays[0] ? vacationsHolidays[0].holidays : {};
                    var vacations = vacationsHolidays[1] ? vacationsHolidays[1].vacations : {};

                    var datesArr = dateSplitter(startDate, endDate);
                    var result = [];

                    datesArr.forEach(function (dateObject) {
                        result.push(divider(dateObject.startDate, dateObject.endDate, holidays, vacations, options));
                    });

                    result = _.flatten(result);
                    result = _.compact(result);

                    WTrack.create(result, function (err, _tCards) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    });
                }

                async.waterfall([getVacationsHolidays, taskRunner], asyncCb);
            }, mainCb);

        }

        tasks = [createJobFunc, generatewTracks];

        async.waterfall(tasks, function (err) {
            if (err) {
                return next(err);
            }

            event.emit('recollectVacationDash', {dbName: dbName});

            res.status(200).send('success');
        });

    };

    this.getForDashVacation = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        var query = req.query;
        var mongoQuery = {
            dateByWeek: parseInt(query.dateByWeek, 10),
            employee  : objectId(query.employee)
        };

        WTrack.aggregate([{
            $match: mongoQuery
        }, {
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $project: {
                1          : 1,
                2          : 1,
                3          : 1,
                4          : 1,
                5          : 1,
                6          : 1,
                7          : 1,
                cost       : 1,
                worked     : 1,
                week       : 1,
                month      : 1,
                year       : 1,
                dateByWeek : 1,
                dateByMonth: 1,
                info       : 1,
                department : 1,
                employee   : 1,
                project    : {$arrayElemAt: ['$project', 0]},
                jobs       : 1,
                revenue    : 1,
                _type      : 1
            }
        }, {
            $match: {
                'project.name': query.project
            }
        }, {
            $lookup: {
                from        : 'jobs',
                localField  : 'jobs',
                foreignField: '_id',
                as          : 'jobs'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'project.customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
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
                1          : 1,
                2          : 1,
                3          : 1,
                4          : 1,
                5          : 1,
                6          : 1,
                7          : 1,
                cost       : 1,
                worked     : 1,
                week       : 1,
                month      : 1,
                year       : 1,
                dateByWeek : 1,
                dateByMonth: 1,
                info       : 1,
                _type      : 1,
                revenue    : 1,
                project    : 1,
                department : {$arrayElemAt: ['$department', 0]},
                customer   : {$arrayElemAt: ['$customer', 0]},
                employee   : {$arrayElemAt: ['$employee', 0]},
                jobs       : {$arrayElemAt: ['$jobs', 0]}
            }
        }, {
            $project: {
                1          : 1,
                2          : 1,
                3          : 1,
                4          : 1,
                5          : 1,
                6          : 1,
                7          : 1,
                cost       : 1,
                worked     : 1,
                week       : 1,
                month      : 1,
                year       : 1,
                dateByWeek : 1,
                dateByMonth: 1,
                info       : 1,
                _type      : 1,
                revenue    : 1,
                project    : 1,
                department : {
                    _id : '$department._id',
                    name: '$department.name'
                },

                customer: {
                    _id : '$customer._id',
                    name: '$customer.name'
                },

                employee: {
                    _id : '$employee._id',
                    name: '$employee.name'
                },

                jobs: {
                    _id : '$jobs._id',
                    name: '$jobs.name'
                }
            }
        }], function (err, wTrack) {
            var firstWtrack;
            var customer;
            var projectmanager;

            if (err) {
                return next(err);
            }

            firstWtrack = wTrack[0];

            customer = firstWtrack ? firstWtrack.customer : null;
            projectmanager = firstWtrack ? firstWtrack.salesmanager : null;

            res.status(200).send({
                customer      : customer,
                projectmanager: projectmanager,
                wTracks       : wTrack
            });
        });
    };

    this.getForProject = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var projectId = req.params.id;
        var query = req.query;
        var contentSearcher;
        var waterfallTasks;
        var key;
        var keyForDay;
        var sortArray;
        var sortLength;
        var dynamicKey = '';
        var i;
        var sortObj = {
            Mo: 1,
            Tu: 2,
            We: 3,
            Th: 4,
            Fr: 5,
            Sa: 6,
            Su: 7
        };

        var sort = {};
        var count = parseInt(query.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        var page = parseInt(query.page, 10);
        var skip;
        var queryObject = {};

        var accessRollSearcher = function (cb) {
            accessRoll(req, WTrack, cb);
        };

        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
        skip = (page - 1) > 0 ? (page - 1) * count : 0;
        projectId = projectId ? objectId(projectId) : null;

        if (projectId) {
            queryObject.project = projectId;
        }
        if (query.sort) {
            key = Object.keys(query.sort)[0].toString();
            keyForDay = sortObj[key];

            if (key.indexOf('.name.first') !== -1) {
                sortArray = key.split('.');
                sortLength = sortArray.length;

                for (i = 0; i < sortLength - 1; i++) {
                    dynamicKey += sortArray[i] + '.';
                }

                dynamicKey += 'last';
                query.sort[dynamicKey] = parseInt(query.sort[key], 10);
                sort = query.sort;
            }

            if (sortObj.hasOwnProperty(key)) {
                sort[keyForDay] = parseInt(query.sort[key], 10);
            } else {
                query.sort[key] = parseInt(query.sort[key], 10);
                sort = query.sort;
            }
        } else {
            sort = {'createdBy.date': -1};
        }

        contentSearcher = function (wtrackIds, waterfallCallback) {
            var aggregation;

            queryObject.$and = [];
            queryObject.$and.push({_id: {$in: wtrackIds}});

            aggregation = WTrack.aggregate([{
                $match: queryObject
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: count
            }, {
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
                $lookup: {
                    from        : 'Project',
                    localField  : 'project',
                    foreignField: '_id',
                    as          : 'project'
                }
            }, {
                $lookup: {
                    from        : 'jobs',
                    localField  : 'jobs',
                    foreignField: '_id',
                    as          : 'jobs'
                }
            }, {
                $project: {
                    jobs      : {$arrayElemAt: ['$jobs', 0]},
                    employee  : {$arrayElemAt: ['$employee', 0]},
                    department: {$arrayElemAt: ['$department', 0]},
                    project   : {$arrayElemAt: ['$project', 0]},
                    dateByWeek: 1,
                    month     : 1,
                    year      : 1,
                    week      : 1,
                    hours     : 1,
                    cost      : 1,
                    worked    : 1,
                    isPaid    : 1,
                    _type     : 1,
                    1         : 1,
                    2         : 1,
                    3         : 1,
                    4         : 1,
                    5         : 1,
                    6         : 1,
                    7         : 1
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'project.customer',
                    foreignField: '_id',
                    as          : 'customer'
                }
            }, {
                $project: {
                    jobs: {
                        _id : '$jobs._id',
                        name: '$jobs.name'
                    },

                    project: {
                        _id : '$project._id',
                        name: '$project.name'
                    },

                    employee: {
                        _id : '$employee._id',
                        name: '$employee.name'
                    },

                    department: {
                        _id : '$department._id',
                        name: '$department.name'
                    },

                    customer  : {$arrayElemAt: ['$customer', 0]},
                    month     : 1,
                    dateByWeek: 1,
                    year      : 1,
                    week      : 1,
                    revenue   : 1,
                    amount    : 1,
                    rate      : 1,
                    hours     : 1,
                    cost      : 1,
                    worked    : 1,
                    isPaid    : 1,
                    _type     : 1,
                    1         : 1,
                    2         : 1,
                    3         : 1,
                    4         : 1,
                    5         : 1,
                    6         : 1,
                    7         : 1
                }
            }, {
                $project: {
                    jobs      : 1,
                    employee  : 1,
                    department: 1,
                    customer  : {
                        _id : '$customer._id',
                        name: '$customer.name'
                    },

                    project   : 1,
                    dateByWeek: 1,
                    month     : 1,
                    year      : 1,
                    week      : 1,
                    revenue   : 1,
                    amount    : 1,
                    rate      : 1,
                    hours     : 1,
                    cost      : 1,
                    worked    : 1,
                    isPaid    : 1,
                    _type     : 1,
                    1         : 1,
                    2         : 1,
                    3         : 1,
                    4         : 1,
                    5         : 1,
                    6         : 1,
                    7         : 1
                }
            }]);

            aggregation.options = {allowDiskUse: true};

            function getTotal(pcb) {
                WTrack.aggregate([{
                    $match: queryObject
                }], function (err, result) {
                    if (err) {
                        return pcb(err);
                    }

                    pcb(null, result.length);
                });
            }

            function getData(pcb) {
                aggregation.exec(function (err, result) {
                    pcb(err, result);
                });
            }

            async.parallel([getTotal, getData], function (err, result) {
                var responseObject = {};
                if (err) {
                    return waterfallCallback(err);
                }

                responseObject.total = result[0] || 0;
                responseObject.data = result[1] || [];

                waterfallCallback(null, responseObject);
            });

        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.exportToXlsx = function (req, res, next) {
        var dbName = req.session.lastDb;
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type || 'wTrack';
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {contentType: type});
        }

        options = {
            res         : res,
            next        : next,
            Model       : WTrack,
            map         : exportMap,
            returnResult: true,
            fileName    : type
        };

        function lookupForWTrack(cb) {
            var query = [];
            var i;

            for (i = 0; i < lookupForWTrackArrayBeforeFilter.length; i++) {
                query.push(lookupForWTrackArrayBeforeFilter[i]);
            }

            query.push({$match: filterObj});

            for (i = 0; i < lookupForWTrackArrayAfterFilter.length; i++) {
                query.push(lookupForWTrackArrayAfterFilter[i]);
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        async.parallel([lookupForWTrack], function (err, result) {
            var resultArray = result[0];

            exporter.exportToXlsx({
                res        : res,
                next       : next,
                Model      : WTrack,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type
            });
        });

    };

    this.exportToCsv = function (req, res, next) {
        var dbName = req.session.lastDb;
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type || 'wTrack';
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {contentType: type});
        }

        options = {
            res         : res,
            next        : next,
            Model       : WTrack,
            map         : exportMap,
            returnResult: true,
            fileName    : type
        };

        function lookupForWTrack(cb) {
            var query = [];
            var i;

            for (i = 0; i < lookupForWTrackArrayBeforeFilter.length; i++) {
                query.push(lookupForWTrackArrayBeforeFilter[i]);
            }

            query.push({$match: filterObj});

            for (i = 0; i < lookupForWTrackArrayAfterFilter.length; i++) {
                query.push(lookupForWTrackArrayAfterFilter[i]);
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        async.parallel([lookupForWTrack], function (err, result) {
            var resultArray = result[0];

            exporter.exportToCsv({
                res        : res,
                next       : next,
                Model      : WTrack,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type
            });
        });

    };

};

module.exports = TCard;
