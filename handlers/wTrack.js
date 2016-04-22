var mongoose = require('mongoose');

var wTrack = function (event, models) {
    'use strict';
    var access = require('../Modules/additions/access.js')(models);
    var rewriteAccess = require('../helpers/rewriteAccess');
    var _ = require('underscore');
    var wTrackSchema = mongoose.Schemas.wTrack;
    var DepartmentSchema = mongoose.Schemas.Department;
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

    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').wTrack;

    var JournalEntryHandler = require('./journalEntry');
    var journalEntry = new JournalEntryHandler(models);

    //
    //exportDecorator.addExportFunctionsToHandler(this, function (req) {
    //    return models.get(req.session.lastDb, 'wTrack', wTrackSchema);
    //}, exportMap, "wTrack");

    this.create = function (req, res, next) {
        access.getEditWritAccess(req, req.session.uId, 75, function (success) {
            var WTrack;
            var body;
            var wTrack;
            var worked;

            if (success) {
                WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
                body = mapObject(req.body);
                worked = parseInt(body.worked);
                worked = isNaN(worked) ? 0 : worked;

                if (worked) {
                    wTrack = new WTrack(body);
                    wTrack.save(function (err, _wTrack) {
                        if (err) {
                            return next(err);
                        }

                        event.emit('setReconcileTimeCard', {req: req, week: wTrack.week, year: wTrack.year});
                        event.emit('updateRevenue', {wTrack: _wTrack, req: req});
                        event.emit('recalculateKeys', {req: req, wTrack: _wTrack});
                        event.emit('dropHoursCashes', req);
                        event.emit('recollectVacationDash');
                        event.emit('updateProjectDetails', {req: req, _id: _wTrack.project});
                        event.emit('recollectProjectInfo');

                        res.status(200).send({success: _wTrack});
                    });
                } else {
                    res.status(200).send({success: 'Empty tCard'});
                }
            } else {
                res.status(403).send();
            }
        });
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body) || {};
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
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

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 75, function (success) {
                function resultCb(err, tCard) {
                    if (err) {
                        return next(err);
                    }

                    if (tCard) {
                        event.emit('setReconcileTimeCard', {req: req, week: wTrack.week, year: wTrack.year});
                        event.emit('updateRevenue', {wTrack: tCard, req: req});
                        event.emit('updateProjectDetails', {req: req, _id: tCard.project});
                        event.emit('recollectProjectInfo');
                        event.emit('dropHoursCashes', req);
                        event.emit('recollectVacationDash');

                        if (needUpdateKeys) {
                            event.emit('recalculateKeys', {req: req, wTrack: tCard});
                        }
                    }
                    res.status(200).send({success: 'updated'});
                }

                if (!success) {
                    return res.status(403).send();
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
            });
        } else {
            res.status(401).send();
        }
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var uId;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 75, function (success) {
                if (!success) {
                    return res.status(403).send();
                }

                function resultCb(err, tCard, needUpdateKeys, cb) {
                    if (err) {
                        return cb(err);
                    }

                    if (tCard) {
                        event.emit('setReconcileTimeCard', {req: req, week: tCard.week, year: tCard.year});
                        event.emit('updateRevenue', {wTrack: tCard, req: req});
                        event.emit('updateProjectDetails', {req: req, _id: tCard.project});
                        event.emit('recollectProjectInfo');
                        event.emit('dropHoursCashes', req);
                        event.emit('recollectVacationDash');

                        if (needUpdateKeys) {
                            event.emit('recalculateKeys', {req: req, wTrack: tCard});
                        }
                    }

                    cb(null, tCard);
                }

                async.each(body, function (data, cb) {
                    var id;
                    var needUpdateKeys;
                    var worked;

                    data = data || {};
                    console.log(data);
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

                    event.emit('dropHoursCashes', req);
                    res.status(200).send({success: 'updated'});
                });
            });
        } else {
            res.status(401).send();
        }
    };

    function convertType(array, type) {
        var i;

        if (type === 'integer') {
            for (i = array.length - 1; i >= 0; i--) {
                array[i] = parseInt(array[i], 10);
            }
        } else if (type === 'boolean') {
            for (i = array.length - 1; i >= 0; i--) {
                if (array[i] === 'true') {
                    array[i] = true;
                } else if (array[i] === 'false') {
                    array[i] = false;
                } else {
                    array[i] = null;
                }
            }
        }
    }

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;
        var filterName;

        for (filterName in filter) {
            if (filter.hasOwnProperty(filterName)) {
                condition = filter[filterName].value;
                key = filter[filterName].key;

                switch (filterName) {
                    case 'salesManager':
                        filtrElement['salesmanager._id'] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    case 'projectName':
                        filtrElement['project._id'] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    case 'customer':
                        filtrElement['customer._id'] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    case 'employee':
                        filtrElement.employee = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    case 'department':
                        filtrElement.department = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    case 'year':
                        convertType(condition, 'integer');
                        filtrElement[key] = {$in: condition};
                        resArray.push(filtrElement);
                        break;
                    case 'month':
                        convertType(condition, 'integer');
                        filtrElement[key] = {$in: condition};
                        resArray.push(filtrElement);
                        break;
                    case 'week':
                        convertType(condition, 'integer');
                        filtrElement[key] = {$in: condition};
                        resArray.push(filtrElement);
                        break;
                    case 'isPaid':
                        convertType(condition, 'boolean');
                        filtrElement[key] = {$in: condition};
                        resArray.push(filtrElement);
                        break;
                    case 'jobs':
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;

                    // no default
                }
            }
        }

        return resArray;
    }

    this.totalCollectionLength = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var query = req.query;
        var filter = query.filter;
        var filterObj = {};
        var waterfallTasks;

        if (filter) {
            filterObj.$and = caseFilter(filter);
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    // queryObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };
            WTrack.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (wTrackIDs, waterfallCallback) {
            var queryObject = {};

            queryObject.$and = [];

            if (filterObj) {
                queryObject.$and.push(filterObj);
            }

            queryObject.$and.push({_id: {$in: _.pluck(wTrackIDs, '_id')}});

            WTrack.aggregate([{
                $lookup: {
                    from        : 'Project',
                    localField  : 'project',
                    foreignField: '_id',
                    as          : 'project'
                }
            }, {
                $project: {
                    project   : {$arrayElemAt: ['$project', 0]},
                    employee  : 1,
                    department: 1,
                    month     : 1,
                    year      : 1,
                    week      : 1,
                    isPaid    : 1,
                    customer  : 1
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'project.salesmanager',
                    foreignField: '_id',
                    as          : 'salesmanager'
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
                    customer      : {$arrayElemAt: ['$customer', 0]},
                    salesmanager  : {$arrayElemAt: ['$salesmanager', 0]},
                    project       : 1,
                    employee      : 1,
                    department    : 1,
                    month         : 1,
                    year          : 1,
                    week          : 1,
                    isPaid        : 1
                }
            }, {
                $project: {
                    project             : 1,
                    employee            : 1,
                    department          : 1,
                    month               : 1,
                    year                : 1,
                    week                : 1,
                    isPaid              : 1,
                    'customer._id'      : 1,
                    'salesmanager._id'  : 1
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

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result});
        });
    };

    this.getByViewType = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        var query = req.query;
        var filter = query.filter;
        var departmentSearcher;
        var contentIdsSearcher;
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
        var filterObj = filter ? filterMapper.mapFilter(filter) : null;
        var count = parseInt(query.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        var page = parseInt(query.page, 10);
        var skip;

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

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    // queryObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };
            WTrack.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (wtrackIds, waterfallCallback) {
            var queryObject = {};
            var aggregation;
            var sMObject = {
                $or: [{
                    $and: [{
                        $eq: ['$salesPersons.startDateWeek', null]
                    }, {
                        $eq: ['$salesPersons.endDateWeek', null]
                    }]
                }, {
                    $and: [{
                        $lte: ['$salesPersons.startDateWeek', '$dateByWeek']
                    }, {
                        $eq: ['$salesPersons.endDateWeek', null]
                    }]
                }, {
                    $and: [{
                        $eq: ['$salesPersons.startDateWeek', null]
                    }, {
                        $gte: ['$salesPersons.endDateWeek', '$dateByWeek']
                    }]
                }, {
                    $and: [{
                        $lte: ['$salesPersons.startDateWeek', '$dateByWeek']
                    }, {
                        $gte: ['$salesPersons.endDateWeek', '$dateByWeek']
                    }]
                }]
            };

            queryObject.$and = [];
            queryObject.$and.push({_id: {$in: _.pluck(wtrackIds, '_id')}});

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
                    project   : {$arrayElemAt: ['$project', 0]},
                    jobs      : {$arrayElemAt: ['$jobs', 0]},
                    employee  : {$arrayElemAt: ['$employee', 0]},
                    department: {$arrayElemAt: ['$department', 0]},
                    dateByWeek: 1,
                    createdBy : 1,
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
                    from        : 'ProjectMembers',
                    localField  : 'project._id',
                    foreignField: 'projectId',
                    as          : 'salesmanagers'
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
                $unwind: '$salesmanagers'
            }, {
                $project: {
                    customer      : {$arrayElemAt: ['$customer', 0]},
                    workflow      : {$arrayElemAt: ['$workflow', 0]},
                    dateByWeek    : 1,
                    salesmanager  : 1,
                    'salesmanager.startDateWeek': {
                        $let: {
                            vars: {
                                startDate: '$salesmanager.startDate'
                            },
                            in  : {$add: [{$multiply: [{$year: '$$startDate'}, 100]}, {$week: '$$startDate'}]}
                        }
                    },
                    'salesmanager.endDateWeek': {
                        $let: {
                            vars: {
                                endDate: '$salesmanager.endDate'
                            },
                            in  : {$add: [{$multiply: [{$year: '$$endDate'}, 100]}, {$week: '$$endDate'}]}
                        }
                    },
                    createdBy     : 1,
                    project       : 1,
                    jobs          : 1,
                    employee      : 1,
                    department    : 1,
                    month         : 1,
                    year          : 1,
                    week          : 1,
                    revenue       : 1,
                    amount        : 1,
                    rate          : 1,
                    hours         : 1,
                    cost          : 1,
                    worked        : 1,
                    isPaid        : 1,
                    1             : 1,
                    2             : 1,
                    3             : 1,
                    4             : 1,
                    5             : 1,
                    6             : 1,
                    7             : 1
                }
            },{
                $match: sMObject
            }, {
                $match: queryObject
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

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        access.getReadAccess(req, req.session.uId, 75, function (success) {
            if (!success) {
                return res.status(403).send();
            }

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getDeleteAccess(req, req.session.uId, 75, function (success) {
            if (success) {
                WTrack.findByIdAndRemove(id, function (err, tCard) {
                    var projectId;

                    if (err) {
                        return next(err);
                    }

                    projectId = tCard ? tCard.project : null;

                    journalEntry.removeBySourceDocument(req, wTrack._id);

                    event.emit('dropHoursCashes', req);
                    event.emit('recollectVacationDash');
                    event.emit('setReconcileTimeCard', {req: req, week: wTrack.week, year: wTrack.year});
                    event.emit('updateRevenue', {wTrack: tCard, req: req});

                    if (projectId) {
                        event.emit('updateProjectDetails', {req: req, _id: projectId});
                    }

                    event.emit('recollectProjectInfo');

                    res.status(200).send({success: tCard});
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.getForProjects = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);

        var query = req.query;
        /* var queryObject = filter ? filterMapper.mapFilter(filter) : {};
         var filter = query.filter;*/
        var departmentSearcher;
        var contentIdsSearcher;
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
            sort = {'project.projectName': 1, year: 1, month: 1, week: 1};
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    // queryObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };
            WTrack.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (wtrackIds, waterfallCallback) {
            var queryObject = {_id: {$in: _.pluck(wtrackIds, '_id')}};

            WTrack
                .find(queryObject)
                .limit(count)
                .skip(skip)
                .sort(sort)
                .lean()
                .exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        access.getReadAccess(req, req.session.uId, 75, function (access) {
            if (!access) {
                return res.status(403).send();
            }

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }
                result.forEach(function (res) {
                    months.push(res.month);
                    years.push(res.year);
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
                        date : {$add: [{$multiply: ["$year", 100]}, "$month"]},
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
        });
    };

    this.generateWTrack = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var data = req.body;
        var jobId = req.headers.jobid;

        var createJob = req.headers.createjob === 'true';
        var jobName = req.headers.jobname;
        var project = req.headers.project;

        var tasks;

        if (jobId.length >= 24) {
            jobId = objectId(jobId);
        }

        function createJobFunc(mainCb) {
            var job = {
                name    : jobName,
                workflow: CONSTANTS.JOBSINPROGRESS,
                type    : "Not Quoted",
                wTracks : [],
                project : objectId(project)
            };
            var newJob;
            var editedBy;

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

                    Project.findByIdAndUpdate(objectId(project), {
                        $push: {"budget.projectTeam": jobId},
                        $set : {editedBy: editedBy}
                    }, {new: true}, function (err) {
                        if (err) {
                            console.log(err);
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

                journalEntry.setReconcileDate(req, startDate);

                var endDate = moment(new Date(options.endDate));
                var endIsoYear = options.endDate ? endDate.isoWeekYear() : startIsoYear + 1;
                var hours = parseInt(options.hours, 10);
                var project = options.project;
                var employee = options.employee;
                var department = options.department;
                var hoursInWeek = 0;

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
                        whoCanRW   : "everyOne",
                        createdBy  : {
                            date: new Date(),
                            user: userId
                        },
                        groups     : {
                            "group": [],
                            "users": [],
                            "owner": null
                        }
                    };
                    var canFillIt = !!options.canFillIt;
                    var hasHolidayOrVacation;
                    var isData;
                    var day;
                    var diffHours;
                    var worked;

                    startDay = startDay || 1;

                    if (!endDay && endDay === 0) {
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
                        options[j] = parseInt(options[j]);
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
                        result.push(divider(dateObject.startDate, dateObject.endDate, holidays, vacations, options))
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

        };

        tasks = [createJobFunc, generatewTracks];

        async.waterfall(tasks, function (err, result) {
            if (err) {
                return next(err);
            }

            event.emit('updateRevenue', {project: project, req: req});
            event.emit('updateProjectDetails', {req: req, _id: project, jobId: jobId});
            event.emit('dropHoursCashes', req);
            event.emit('recollectVacationDash');
            event.emit('recollectProjectInfo');

            res.status(200).send('success');
        });

    };

    this.getForDashVacation = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        var query = req.query;
        var mongoQuery = {
            dateByWeek: parseInt(query.dateByWeek, 10),
            'employee': objectId(query.employee)
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
                project    : {$arrayElemAt: ["$project", 0]},
                jobs       : 1,
                revenue    : 1
            }
        }, {
            $match: {
                'project.projectName': query.projectName
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
                localField  : 'project.projectmanager',
                foreignField: '_id',
                as          : 'projectmanager'
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
                1             : 1,
                2             : 1,
                3             : 1,
                4             : 1,
                5             : 1,
                6             : 1,
                7             : 1,
                cost          : 1,
                worked        : 1,
                week          : 1,
                month         : 1,
                year          : 1,
                dateByWeek    : 1,
                dateByMonth   : 1,
                info          : 1,
                department    : {$arrayElemAt: ["$department", 0]},
                project       : 1,
                customer      : {$arrayElemAt: ["$customer", 0]},
                projectmanager: {$arrayElemAt: ["$projectmanager", 0]},
                employee      : {$arrayElemAt: ["$employee", 0]},
                jobs          : {$arrayElemAt: ["$jobs", 0]},
                revenue       : 1
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
            projectmanager = firstWtrack ? firstWtrack.projectmanager : null;

            res.status(200).send({
                customer      : customer,
                projectmanager: projectmanager,
                wTracks       : wTrack
            });
        });
    };

};

module.exports = wTrack;