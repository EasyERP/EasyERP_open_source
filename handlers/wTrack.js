var mongoose = require('mongoose');

var wTrack = function (event, models) {
    'use strict';
    var access = require("../Modules/additions/access.js")(models);
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

    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').wTrack;

    exportDecorator.addExportFunctionsToHandler(this, function (req) {
        return models.get(req.session.lastDb, 'wTrack', wTrackSchema);
    }, exportMap, "wTrack");

    this.create = function (req, res, next) {
        access.getEditWritAccess(req, req.session.uId, 75, function (access) {
            if (access) {

                var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
                var body = mapObject(req.body);

                wTrack = new WTrack(body);

                wTrack.save(function (err, wTrack) {
                    if (err) {
                        return next(err);
                    }

                    event.emit('updateRevenue', {wTrack: wTrack, req: req});
                    event.emit('recalculateKeys', {req: req, wTrack: wTrack});
                    event.emit('dropHoursCashes', req);
                    event.emit('recollectVacationDash');
                    event.emit('updateProjectDetails', {req: req, _id: wTrack.project});
                    event.emit('recollectProjectInfo');

                    res.status(200).send({success: wTrack});
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var needUpdateKeys = data.month || data.week || data.year || data.isoYear;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 75, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date()
                    };

                    //if (data && data.revenue) {
                    //    data.revenue *= 100;
                    //}

                    WTrack.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, wTrack) {
                        if (err) {
                            return next(err);
                        }
                        if (wTrack) {
                            event.emit('updateRevenue', {wTrack: wTrack, req: req});
                            event.emit('updateProjectDetails', {req: req, _id: wTrack.project});
                            event.emit('recollectProjectInfo');
                            event.emit('dropHoursCashes', req);
                            event.emit('recollectVacationDash');

                            if (needUpdateKeys) {
                                event.emit('recalculateKeys', {req: req, wTrack: wTrack});
                            }
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

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var needUpdateKeys = body.month || body.week || body.year || body.isoYear;
        var uId;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 75, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;

                        if (data && data.revenue) {
                            data.revenue *= 100;
                        }

                        if (data && data.cost) {
                            data.cost *= 100;
                        }

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };
                        delete data._id;

                        WTrack.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, wTrack) {
                            if (err) {
                                return cb(err);
                            }

                            if (wTrack) {
                                event.emit('updateRevenue', {wTrack: wTrack, req: req});
                                event.emit('updateProjectDetails', {req: req, _id: wTrack.project});
                                event.emit('recollectProjectInfo');
                                event.emit('recollectVacationDash');

                                if (needUpdateKeys) {
                                    event.emit('recalculateKeys', {req: req, wTrack: wTrack});
                                }
                            }

                            cb(null, wTrack);
                        });
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        event.emit('dropHoursCashes', req);
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
            condition = filter[filterName].value;
            key = filter[filterName].key;

            switch (filterName) {
                case 'projectManager':
                    filtrElement['projectmanager._id'] = {$in: condition.objectID()};
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
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
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
                    //queryObject,
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
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $project: {
                    project   : {$arrayElemAt: ["$project", 0]},
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
                    from        : "Employees",
                    localField  : "project.projectmanager",
                    foreignField: "_id", as: "projectmanager"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "project.customer",
                    foreignField: "_id", as: "customer"
                }
            }, {
                $project: {
                    customer      : {$arrayElemAt: ["$customer", 0]},
                    projectmanager: {$arrayElemAt: ["$projectmanager", 0]},
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
                    'projectmanager._id': 1
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
        var sortObj = {
            "Mo": 1,
            "Tu": 2,
            "We": 3,
            "Th": 4,
            "Fr": 5,
            "Sa": 6,
            "Su": 7
        };

        var sort = {};
        var filterObj = filter ? filterMapper.mapFilter(filter) : null;
        var count = parseInt(query.count, 10) || 100;
        var page = parseInt(query.page, 10);
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (query.sort) {
            key = Object.keys(query.sort)[0].toString();
            keyForDay = sortObj[key];

            if (sortObj.hasOwnProperty(key)) {
                sort[keyForDay] = parseInt(query.sort[key], 10);
            } else {
                query.sort[key] = parseInt(query.sort[key], 10);
                sort = query.sort;
            }
        } else {
            sort = {"createdBy.date": -1};
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
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
                    //queryObject,
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

            queryObject.$and = [];
            queryObject.$and.push({_id: {$in: _.pluck(wtrackIds, '_id')}});

            if (filterObj) {
                queryObject.$and.push(filterObj);
            }

            var aggregation = WTrack.aggregate([{
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "employee",
                    foreignField: "_id", as: "employee"
                }
            }, {
                $lookup: {
                    from        : "Department",
                    localField  : "department",
                    foreignField: "_id", as: "department"
                }
            }, {
                $lookup: {
                    from        : "jobs",
                    localField  : "jobs",
                    foreignField: "_id", as: "jobs"
                }
            }, {
                $project: {
                    project   : {$arrayElemAt: ["$project", 0]},
                    jobs      : {$arrayElemAt: ["$jobs", 0]},
                    employee  : {$arrayElemAt: ["$employee", 0]},
                    department: {$arrayElemAt: ["$department", 0]},
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
                    "1"       : 1,
                    "2"       : 1,
                    "3"       : 1,
                    "4"       : 1,
                    "5"       : 1,
                    "6"       : 1,
                    "7"       : 1
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "project.projectmanager",
                    foreignField: "_id", as: "projectmanager"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "project.customer",
                    foreignField: "_id", as: "customer"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "project.workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $project: {
                    customer      : {$arrayElemAt: ["$customer", 0]},
                    workflow      : {$arrayElemAt: ["$workflow", 0]},
                    projectmanager: {$arrayElemAt: ["$projectmanager", 0]},
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
                    "1"           : 1,
                    "2"           : 1,
                    "3"           : 1,
                    "4"           : 1,
                    "5"           : 1,
                    "6"           : 1,
                    "7"           : 1
                }
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

        access.getReadAccess(req, req.session.uId, 75, function (access) {
            if (!access) {
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

        access.getDeleteAccess(req, req.session.uId, 75, function (access) {
            if (access) {
                WTrack.findByIdAndRemove(id, function (err, wTrack) {
                    var projectId;

                    if (err) {
                        return next(err);
                    }

                    projectId = wTrack ? wTrack.project : null;

                    event.emit('dropHoursCashes', req);
                    event.emit('recollectVacationDash');
                    event.emit('updateRevenue', {wTrack: wTrack, req: req});

                    if (projectId) {
                        event.emit('updateProjectDetails', {req: req, _id: projectId});
                    }

                    event.emit('recollectProjectInfo');

                    res.status(200).send({success: wTrack});
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
        var sortObj = {
            "Mo": 1,
            "Tu": 2,
            "We": 3,
            "Th": 4,
            "Fr": 5,
            "Sa": 6,
            "Su": 7
        };

        var sort = {};
        var count = query.count || 100;
        var page = query.page || 1;

        var skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (query.sort) {
            key = Object.keys(query.sort)[0];
            keyForDay = sortObj[key];

            if (sortObj.hasOwnProperty(key)) {
                sort[keyForDay] = query.sort[key];
            } else {
                sort = query.sort;
            }
        } else {
            sort = {"project.projectName": 1, "year": 1, "month": 1, "week": 1};
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
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
                    //queryObject,
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
        var keyConst = ['', 'Mo', 'Tu', 'Wd', 'Th', 'Fr', 'Sa', 'Su'];
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
            var totalHours = 0;

            async.each(data, function (options, asyncCb) {
                function getVacationsHolidays(generateCb) {
                    var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
                    var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
                    var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
                    var totalHolidays = 0;
                    var total = 0;
                    var employee = options.employee;
                    var stDate = new Date(options.startDate);
                    var enDate = new Date(options.endDate);
                    var startYear = moment(stDate).year();
                    var endYear = options.endDate ? moment(enDate).year() : startYear + 1;

                    for (var j = 7; j >= 1; j--) {
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
                        var queryHolidays = Holiday.find({year: {$gte: startYear, $lte: endYear}}).lean();

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
                            year    : {$gte: startYear, $lte: endYear},
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
                                            weekKey = year * 100 + moment(dateValue).isoWeek();
                                            key = weekKey.toString();

                                            dayNumber = dateValue.day();

                                            dayKey = dayNumber.toString();

                                            if (dayNumber !== 0 && dayNumber !== 6) {

                                                if (!newResult[key]) {
                                                    newResult[key] = {};
                                                }

                                                newResult[key][dayKey] = dayNumber;
                                                total++;
                                            }
                                        }
                                    }
                                });
                                parallelCb(null, {vacations: newResult, total: total});
                            }
                        });
                    }

                    async.parallel([getHolidays, getVacations, getEmployee], generateCb);
                }

                function calculateWeeks(vacationsHolidays, generateCb) {
                    var holidays = vacationsHolidays[0] ? vacationsHolidays[0].holidays : {};
                    var vacations = vacationsHolidays[1] ? vacationsHolidays[1].vacations : {};
                    var startDate = new Date(options.startDate);
                    var endDate = new Date(options.endDate);
                    var startIsoWeek = moment(startDate).isoWeek();
                    var startYear = moment(startDate).isoWeekYear();
                    var hours = parseInt(options.hours, 10);
                    var project = options.project;
                    var employee = options.employee;
                    var department = options.department;
                    var weekCounter;
                    var totalForWeek = 0;
                    var totalRendered = 0;
                    var isoWeeksInYear = moment(startDate).isoWeeksInYear();
                    var endIsoWeek;
                    var endYear;
                    var yearDiff;
                    var result;
                    var i;

                    function calcWeeks(weeks, startD, endD) {
                        var result = [];
                        var startWeek = moment(startD).isoWeek();
                        var startYear = moment(startD).isoWeekYear();
                        var startDay = moment(startD).day();
                        var endWeek = moment(endD).isoWeek();
                        var resArr;
                        var endDay = moment(endD).day();

                        if (startWeek === isoWeeksInYear && weeks) { //added &&weeks because double calc data for 53 week
                            resArr = checkWeekToDivide(startWeek, startYear, startDay);
                            result = resArr;
                            startYear++;
                            startWeek = 0;
                            weeks -= 1;
                        } else if (weeks) {//added &&weeks because double calc data for 53 week
                            resArr = checkWeekToDivide(startWeek, startYear, startDay);
                            result = resArr;
                        }

                        for (var i = weeks - 1; i > 0; i--) {
                            resArr = checkWeekToDivide(startWeek + i, startYear);
                            result = result.concat(resArr)
                        }

                        if (options.hours && (options.hours - totalHours >= totalForWeek)) {
                            return result;
                        }

                        resArr = checkWeekToDivide(endWeek, startYear, null, endDay);
                        result = result.concat(resArr);

                        function checkWeekToDivide(week, year, day, endDay) {
                            //todo set real year for week = 1 ???
                            var arrayResult = [];
                            var weekObj = {};
                            var weekObjNext = {};
                            var d = moment().isoWeekYear(year).isoWeek(week);
                            var checkWeek = d.isoWeek();
                            var checkToDivide = true;
                            var checkDate;
                            var month;
                            var endOfMonth;
                            var date;
                            var dateForCheck;
                            var dayForEndOfMonth;
                            var key;
                            var dateByWeek;

                            if (checkWeek > week) {
                                week--;
                            }

                            day = day || 1;
                            checkDate = moment().isoWeekYear(year).isoWeek(checkWeek).isoWeekday(day).hours(0).minutes(0);
                            month = checkDate.month();
                            endOfMonth = moment().isoWeekYear(year).month(month).hours(0).minutes(0).endOf('month').date();
                            //date = checkDate.day(day);
                            dateForCheck = checkDate.date();
                            dayForEndOfMonth = checkDate.day(1).date(endOfMonth).day();

                            if (endDay === 0 || endDay === 6) {
                                endDay = 5;
                            }

                            if (week === endWeek && dateForCheck <= moment(endD).date()) {
                                checkToDivide = false;
                            }

                            if (dateForCheck + 7 > endOfMonth && checkToDivide) {
                                weekObj.week = week;
                                weekObj.year = year;
                                weekObj.total = 0;

                                dateByWeek = weekObj.year * 100 + weekObj.week;
                                dateByWeek = dateByWeek.toString();

                                for (var k = 7; k >= 1; k--) {
                                    key = keyConst[k];

                                    if (k <= dayForEndOfMonth) {
                                        weekObj[key] = options[k];
                                        totalHours += options[k];
                                        weekObj.total += weekObj[key];

                                        if ((vacations && vacations[dateByWeek] && vacations[dateByWeek][k.toString()]) || (( holidays && holidays[dateByWeek] && holidays[dateByWeek][k.toString()]))) {
                                            totalHours -= weekObj[key];
                                            weekObj.total -= weekObj[key];
                                            weekObj[key] = 0;
                                        }
                                    } else {
                                        weekObj[key] = 0;
                                    }
                                }

                                weekObjNext.week = week;
                                weekObjNext.nextMonth = weekObj.total ? true : false;
                                weekObjNext.year = year;
                                weekObjNext.total = 0;

                                dateByWeek = weekObjNext.year * 100 + weekObjNext.week;
                                dateByWeek = dateByWeek.toString();

                                for (var j = 7; j >= 1; j--) {
                                    key = keyConst[j];

                                    if (j > dayForEndOfMonth) {

                                        if (endDay) {

                                            if (j <= endDay) {
                                                weekObjNext[key] = options[j];
                                                totalHours += options[j];
                                                weekObjNext.total += weekObjNext[key];

                                                if ((vacations && vacations[dateByWeek] && vacations[dateByWeek][j.toString()]) || (( holidays && holidays[dateByWeek] && holidays[dateByWeek][j.toString()]))) {
                                                    totalHours -= weekObjNext[key];
                                                    weekObjNext.total -= weekObjNext[key];
                                                    weekObjNext[key] = 0;
                                                }
                                            } else {
                                                weekObjNext[key] = 0;
                                            }
                                        } else {
                                            weekObjNext[key] = options[j];
                                            totalHours += options[j];
                                            weekObjNext.total += weekObjNext[key];

                                            if ((vacations && vacations[dateByWeek] && vacations[dateByWeek][j.toString()]) || (( holidays && holidays[dateByWeek] && holidays[dateByWeek][j.toString()]))) {
                                                totalHours -= weekObjNext[key];
                                                weekObjNext.total -= weekObjNext[key];
                                                weekObjNext[key] = 0;
                                            }
                                        }
                                    } else {
                                        weekObjNext[key] = 0;
                                    }
                                }

                                arrayResult.push(weekObj);
                                arrayResult.push(weekObjNext);
                            } else {
                                weekObj.week = week;
                                weekObj.year = year;
                                weekObj.total = 0;

                                dateByWeek = weekObj.year * 100 + weekObj.week;
                                dateByWeek = dateByWeek.toString();

                                for (var l = 7; l >= 1; l--) {
                                    key = keyConst[l];

                                    if (l >= day) {

                                        if (endDay) {

                                            if (l < endDay + 1) {
                                                weekObj[key] = options[l];
                                                totalHours += options[l];
                                                weekObj.total += weekObj[key];

                                                if ((vacations && vacations[dateByWeek] && vacations[dateByWeek][l.toString()]) || (( holidays && holidays[dateByWeek] && holidays[dateByWeek][l.toString()]))) {
                                                    totalHours -= weekObj[key];
                                                    weekObj.total -= weekObj[key];
                                                    weekObj[key] = 0;
                                                }
                                            } else {
                                                weekObj[key] = 0;
                                            }
                                        } else {
                                            weekObj[key] = options[l];
                                            totalHours += options[l];
                                            weekObj.total += weekObj[key];

                                            if ((vacations && vacations[dateByWeek] && vacations[dateByWeek][l.toString()]) || (( holidays && holidays[dateByWeek] && holidays[dateByWeek][l.toString()]))) {
                                                totalHours -= weekObj[key];
                                                weekObj.total -= weekObj[key];
                                                weekObj[key] = 0;
                                            }
                                        }
                                    } else {
                                        weekObj[key] = 0;
                                    }
                                }

                                arrayResult.push(weekObj);
                            }

                            return arrayResult;
                        }

                        return result;
                    }

                    function generateItems(weeksArray) {

                        weeksArray.forEach(function (arrayEl) {
                            var week = arrayEl.week;
                            var year = arrayEl.year;
                            var weekValues = arrayEl;
                            var wTrackToSave;
                            var date = moment().isoWeekYear(year).isoWeek(week);
                            var day = 1;

                            if (week === startIsoWeek) {
                                day = moment(startDate).day();
                            }

                            var month = date.day(day).month() + 1;
                            var dateByWeek = year * 100 + week;
                            var dateByMonth = year * 100 + month;
                            var worked = arrayEl.total;
                            var cost = 0;
                            var diff;
                            var keys = keyConst;
                            var i = 1;

                            if (options.hours && options.hours - totalRendered <= totalForWeek) {
                                diff = options.hours - totalRendered;
                                worked = 0;

                                while (diff - weekValues[keys[i]] >= 0 && i <= 7) {
                                    weekValues[keys[i]] = weekValues[keys[i]];
                                    diff -= weekValues[keys[i]];
                                    worked += weekValues[keys[i]];
                                    i++;
                                }

                                if (i <= 7) {
                                    weekValues[keys[i]] = Math.abs(diff);
                                    worked += weekValues[keys[i]];

                                    for (var j = i + 1; j <= 7; j++) {
                                        weekValues[keys[j]] = 0;
                                    }
                                }
                            }

                            totalRendered += worked;

                            if (arrayEl.nextMonth) {
                                month += 1;

                                if (month > 12) {
                                    month = 1;
                                    year += 1;
                                }
                            }

                            var newwTrack = {
                                employee   : employee,
                                department : department,
                                project    : project,
                                cost       : cost,
                                isPaid     : false,
                                jobs       : jobForwTrack,
                                dateByWeek : dateByWeek,
                                dateByMonth: dateByMonth,
                                month      : month,
                                year       : year,
                                week       : week,
                                worked     : worked,
                                whoCanRW   : "everyOne",
                                createdBy  : {
                                    date: new Date(),
                                    user: req.session.uId
                                },
                                groups     : {
                                    "group": [],
                                    "users": [],
                                    "owner": null
                                },
                                "1"        : weekValues['Mo'],
                                "2"        : weekValues['Tu'],
                                "3"        : weekValues['Wd'],
                                "4"        : weekValues['Th'],
                                "5"        : weekValues['Fr'],
                                "6"        : weekValues['Sa'],
                                "7"        : weekValues['Su']
                            };

                            if (worked > 0) {
                                wTrackToSave = new WTrack(newwTrack);

                                wTrackToSave.save(function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                        });
                    }

                    function firstPart(pCb) {
                        var weeks = isoWeeksInYear - startIsoWeek;
                        var endD = moment([startYear, 11, 31]);
                        var result = calcWeeks(weeks, startDate, endD);

                        pCb(null, result);
                    }

                    function secondPart(pCb) {
                        //var weeks = weekCounter - isoWeeksInYear - startIsoWeek;
                        var weeks = endIsoWeek + 1;
                        var startD = moment([endYear, 0, 1]);
                        var result = calcWeeks(weeks, startD, endDate);

                        pCb(null, result);
                    }

                    for (i = 7; i > 0; i--) {
                        totalForWeek += parseInt(options[i]);
                    }

                    if (hours) {
                        weekCounter = Math.ceil(hours / totalForWeek);

                        endDate = moment(startDate).isoWeek(startIsoWeek + weekCounter + 1).day(5);
                    }

                    endIsoWeek = moment(endDate).isoWeek();
                    endYear = moment(endDate).isoWeekYear();

                    yearDiff = endYear - startYear;

                    if (yearDiff === 0) {

                        /*if (endIsoWeek - startIsoWeek < 0) {
                            result = calcWeeks(endIsoWeek + 1, startDate, endDate);
                        } else {
                            result = calcWeeks(endIsoWeek - startIsoWeek, startDate, endDate);
                        }*/

                        result = calcWeeks(endIsoWeek - startIsoWeek, startDate, endDate);

                        generateItems(result);
                        generateCb();
                    } else if (yearDiff > 0) {
                        async.parallel([firstPart, secondPart], function (err, result) {
                            var firstPart = result[0];
                            var secondPart = result[1];

                            result = firstPart.concat(secondPart);

                            generateItems(result);
                            generateCb();
                        });
                    }
                }

                async.waterfall([getVacationsHolidays, calculateWeeks], function (err) {
                    if (err) {
                        return next(err);
                    }

                    asyncCb();
                });
            }, function () {
                mainCb();
            });

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