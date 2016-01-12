var mongoose = require('mongoose');
var wTrack = function (event, models) {
    'use strict';
    var access = require("../Modules/additions/access.js")(models);
    var rewriteAccess = require('../helpers/rewriteAccess');
    var _ = require('underscore');
    var wTrackSchema = mongoose.Schemas.wTrack;
    var DepartmentSchema = mongoose.Schemas.Department;
    var MonthHoursSchema = mongoose.Schemas.MonthHours;
    var SalarySchema = mongoose.Schemas.Salary;
    var HolidaySchema = mongoose.Schemas.Holiday;
    var VacationSchema = mongoose.Schemas.Vacation;
    var WorkflowSchema = mongoose.Schemas.workflow;
    var jobsSchema = mongoose.Schemas.jobs;
    var ProjectSchema = mongoose.Schemas.Project;
    var EmployeeSchema = mongoose.Schemas.Employee;
    /*var CustomerSchema = mongoose.Schemas['Customer'];
     var EmployeeSchema = mongoose.Schemas['Employee'];
     var WorkflowSchema = mongoose.Schemas['workflow'];*/
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

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 75, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date()
                    };

                    if (data && data.revenue) {
                        data.revenue *= 100;
                    }

                    WTrack.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err) {
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

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

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
                            event.emit('recalculateKeys', {req: req, wTrack: wTrack});
                            event.emit('updateProjectDetails', {req: req, _id: wTrack.project._id});
                            event.emit('recollectProjectInfo');
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

    function ConvertType(array, type) {
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
                    filtrElement['employee'] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'department':
                    filtrElement['department'] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'year':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'month':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'week':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'isPaid':
                    ConvertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'jobs':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
            }
        }

        return resArray;
    };

    this.totalCollectionLength = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var query = req.query;
        var filter = query.filter;
        // var filterObj = filter ? filterMapper.mapFilter(filter) : null;
        if (filter) {
            var filterObj = {};
            filterObj['$and'] = caseFilter(filter);
        }

        var waterfallTasks;

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

            queryObject['$and'] = [];

            if (filterObj) {
                queryObject['$and'].push(filterObj);
            }

            queryObject['$and'].push({_id: {$in: _.pluck(wTrackIDs, '_id')}});

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
        var count = parseInt(query.count) ? parseInt(query.count) : 100;
        var page = parseInt(query.page);
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (query.sort) {
            key = Object.keys(query.sort)[0].toString();
            keyForDay = sortObj[key];

            if (key in sortObj) {
                sort[keyForDay] = parseInt(query.sort[key]);
            } else {
                query.sort[key] = parseInt(query.sort[key]);
                sort = query.sort;
            }
        } else {
            // sort = {"year": -1, "month": -1, "week": -1};
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
            queryObject['$and'] = [];
            queryObject['$and'].push({_id: {$in: _.pluck(wtrackIds, '_id')}});

            if (filterObj) {
                queryObject['$and'].push(filterObj);
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

    // region Not used ?

    //todo Check it

    //this.getById = function (req, res, next) {
    //    var id = req.params.id;
    //    var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
    //    /* var queryParams = {};
    //     for (var i in req.query) {
    //     queryParams[i] = req.query[i];
    //     }*/
    //
    //    var departmentSearcher;
    //    var contentIdsSearcher;
    //    var contentSearcher;
    //    var waterfallTasks;
    //
    //    var contentType = req.query.contentType;
    //    var isOrder = !!(contentType === 'Order');
    //
    //    /* var data = {};
    //     for (var i in req.query) {
    //     data[i] = req.query[i];
    //     }*/
    //
    //    departmentSearcher = function (waterfallCallback) {
    //        models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
    //            {
    //                $match: {
    //                    users: objectId(req.session.uId)
    //                }
    //            }, {
    //                $project: {
    //                    _id: 1
    //                }
    //            },
    //
    //            waterfallCallback);
    //    };
    //
    //    contentIdsSearcher = function (deps, waterfallCallback) {
    //        var arrOfObjectId = deps.objectID();
    //
    //        models.get(req.session.lastDb, "Quotation", QuotationSchema).aggregate(
    //            {
    //                $match: {
    //                    $and: [
    //                        /*optionsObject,*/
    //                        {
    //                            $or: [
    //                                {
    //                                    $or: [
    //                                        {
    //                                            $and: [
    //                                                {whoCanRW: 'group'},
    //                                                {'groups.users': objectId(req.session.uId)}
    //                                            ]
    //                                        },
    //                                        {
    //                                            $and: [
    //                                                {whoCanRW: 'group'},
    //                                                {'groups.group': {$in: arrOfObjectId}}
    //                                            ]
    //                                        }
    //                                    ]
    //                                },
    //                                {
    //                                    $and: [
    //                                        {whoCanRW: 'owner'},
    //                                        {'groups.owner': objectId(req.session.uId)}
    //                                    ]
    //                                },
    //                                {whoCanRW: "everyOne"}
    //                            ]
    //                        }
    //                    ]
    //                }
    //            },
    //            {
    //                $project: {
    //                    _id: 1
    //                }
    //            },
    //            waterfallCallback
    //        );
    //    };
    //
    //    contentSearcher = function (quotationsIds, waterfallCallback) {
    //        var queryObject = {_id: id};
    //        var query;
    //
    //        queryObject.isOrder = isOrder;
    //        query = Quotation.findOne(queryObject);
    //
    //        query.populate('supplier', '_id name fullName');
    //        query.populate('destination');
    //        query.populate('incoterm');
    //        query.populate('invoiceControl');
    //        query.populate('paymentTerm');
    //        query.populate('products.product', '_id, name');
    //        query.populate('groups.users');
    //        query.populate('groups.group');
    //        query.populate('groups.owner', '_id login');
    //        query.populate('workflow', '-sequence');
    //        query.populate('deliverTo', '_id, name');
    //
    //        query.exec(waterfallCallback);
    //    };
    //
    //    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];
    //
    //    access.getReadAccess(req, req.session.uId, 75, function (access) {
    //        if (!access) {
    //            return res.status(403).send();
    //        }
    //
    //        async.waterfall(waterfallTasks, function (err, result) {
    //            if (err) {
    //                return next(err);
    //            }
    //
    //            res.status(200).send(result);
    //        });
    //    });
    //};

    //endregion

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        access.getDeleteAccess(req, req.session.uId, 75, function (access) {
            if (access) {
                WTrack.findByIdAndRemove(id, function (err, wTrack) {
                    if (err) {
                        return next(err);
                    }

                    var id = wTrack ? wTrack.project : null;

                    event.emit('dropHoursCashes', req);
                    event.emit('recollectVacationDash');
                    if (id) {
                        event.emit('updateProjectDetails', {req: req, _id: id});
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
        var queryObject = filter ? filterMapper.mapFilter(filter) : {};
        var filter = query.filter;
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
        var count = query.count ? query.count : 100;
        var page = query.page ? query.page : 1;

        var skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (query.sort) {
            key = Object.keys(query.sort)[0];
            keyForDay = sortObj[key];

            if (key in sortObj) {
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
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var data = req.body;
        var addHours = 0;
        var savedwTrack = [];
        var globalTotal = 0;
        var job = {};

        var jobId = req.headers.jobid;

        if (jobId.length > 24) {
            jobId = objectId(jobId);
        }

        var createJob = req.headers.createjob === 'true';
        var jobName = req.headers.jobname;
        var project = req.headers.project;

        async.waterfall([createJobFunc, generateFunc], function (err, result) {

            if (err) {
                return next(err);
            }

            event.emit('updateProjectDetails', {req: req, _id: project, jobId: jobId});
            event.emit('dropHoursCashes', req);
            event.emit('recollectVacationDash');
            event.emit('recollectProjectInfo');

            res.status(200).send('success');
        });

        function createJobFunc(waterfallCB) {
            var jobForwTrack = jobId;

            if (createJob) {
                job = {
                    name    : jobName,
                    workflow: CONSTANTS.JOBSINPROGRESS,
                    type    : "Not Quoted",
                    wTracks : [],
                    project : objectId(project)
                };

                var newJob = new Job(job);

                newJob.save(function (err, job) {
                    if (err) {
                        return console.log(err);
                    }
                    var jobName;

                    jobId = job.toJSON()._id;
                    jobName = job.get('name');

                    jobForwTrack = jobId;

                    Project.findByIdAndUpdate(objectId(project), {$push: {"budget.projectTeam": jobId}}, {new: true}, function () {

                    });

                    waterfallCB(null, jobForwTrack);
                });

            } else {
                waterfallCB(null, jobForwTrack);
            }

        }

        function generateFunc(jobObj, waterfallCB) {
            async.each(data, function (options, call) {
                generate(options, call);

                function generate(opt, call) {
                    var employee = opt.employee;
                    var project = opt.project;
                    var projectWorkflowId = project.workflow;
                    var department = opt.department;
                    var revenue = opt.revenue;
                    var currentUser = req.session.uId;
                    var employeeId = employee;
                    var dateArray;
                    var wTrackObj;
                    var monthsArr = [];
                    var weeksArr = [];
                    var yearsArr = [];
                    var uniqMonths;
                    var uniqWeeks;
                    var uniqYears;
                    var totalHours = 0;

                    var renderedTotal = 0;
                    var dateArrLength;

                    var options = {
                        startDate: opt.startDate,
                        endDate  : opt.endDate,
                        hours    : parseInt(opt.hours)
                    };

                    async.parallel([calculateWeeks /*getWorkflowStatus*/], function (err, result) {
                        dateArray = result[0];
                        // project.workflow.status = result[1];

                        dateArrLength = dateArray.length;

                        if (err) {
                            console.log(err);
                        }

                        dateArray.forEach(function (obj) {
                            monthsArr.push(obj.month);
                            weeksArr.push(obj.week);
                            yearsArr.push(obj.year);
                        });

                        uniqMonths = _.uniq(monthsArr);
                        uniqWeeks = _.uniq(weeksArr);
                        uniqYears = _.uniq(yearsArr);

                        dateArray.forEach(function (element, ind) {
                            var year = element.year;
                            var month = element.month;
                            var week = element.week;
                            var dateByWeek = year * 100 + week;
                            var dateByMonth = year * 100 + month;
                            var parallelTasks = [getHolidays, getVacations];

                            async.parallel(parallelTasks, function (err, result) {
                                var holidays = result[0] ? result[0].holidays : {};
                                var vacations = result[1] ? result[1].vacations : {};
                                var totalHolidays = result[0] ? result[0].total : 0;
                                var totalVacations = result[1] ? result[1].total : 0;
                                var trackWeek = {};
                                var year = element.year;
                                var month = element.month;
                                var week = element.week;

                                function calcCost(callB) {
                                    var cost;
                                    var m = element.month;
                                    var y = element.year;

                                    var waterfallTasks = [getBaseSalary];
                                    var wTrack = models.get(req.session.lastDb, "wTrack", wTrackSchema);
                                    var monthHours = models.get(req.session.lastDb, "MonthHours", MonthHoursSchema);

                                    function getBaseSalary(cb) {
                                        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);
                                        var query = Salary
                                            .find(
                                                {
                                                    'employee._id': objectId(employee),
                                                    month         : m,
                                                    year          : y
                                                }, {
                                                    baseSalary    : 1,
                                                    'employee._id': 1
                                                })
                                            .lean();
                                        query.exec(function (err, salary) {
                                            if (err) {
                                                return cb(err);
                                            }

                                            if (salary.length > 0) {
                                                cb(null, salary[0].baseSalary)
                                            } else {
                                                cb(null, 0)
                                            }

                                        });
                                    }

                                    async.waterfall(waterfallTasks, function (err, result) {
                                        var baseSalary = result;
                                        var fixedExpense;
                                        var expenseCoefficient;
                                        var hoursForMonth;
                                        var hours;

                                        if (err) {
                                            callB(err);
                                        }

                                        var query = monthHours.find({month: month, year: year}).lean();

                                        query.exec(function (err, monthHour) {
                                            if (err) {
                                                callB(err);
                                            }
                                            if (monthHour[0]) {
                                                fixedExpense = parseInt(monthHour[0].fixedExpense);
                                                expenseCoefficient = parseFloat(monthHour[0].expenseCoefficient);
                                                hoursForMonth = parseInt(monthHour[0].hours);
                                            } else {
                                                fixedExpense = 0;
                                                expenseCoefficient = 0;
                                                hours = 1;
                                            }

                                            cost = ((((baseSalary * expenseCoefficient) + fixedExpense) / hoursForMonth) * totalHours).toFixed(2);

                                            callB(null, parseFloat(cost));
                                        });

                                    });
                                }

                                var tasks = [calcCost];

                                async.parallel(tasks, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    var cost = result[0] ? result[0] : 0;

                                    var weekArray = element.weekValues;

                                    totalHours = 0;

                                    for (var i = 7;
                                        i > 0;
                                        i--) {
                                        if ((vacations && vacations[dateByWeek] && vacations[dateByWeek][i]) || (( holidays && holidays[dateByWeek] && holidays[dateByWeek][i]))) {
                                            trackWeek[i] = 0;
                                            totalHours += trackWeek[i];

                                            addHours += 8;

                                        } else {
                                            trackWeek[i] = weekArray[i];
                                            totalHours += trackWeek[i];
                                        }
                                    }

                                    renderedTotal += totalHours;
                                    var diff = opt.hours - renderedTotal;

                                    if ((diff > 0) && (diff < 8)) {
                                        var index;

                                        for (var i = 1;
                                            i <= 7;
                                            i++) {
                                            if (trackWeek[i] !== 0) {
                                                index = i;
                                            }

                                        }

                                        if ((trackWeek[index + 1] + diff >= 8) || (index + 1 > 5)) {
                                            if ((trackWeek[index + 2] + diff >= 8) && (index + 3 <= 5)) {
                                                trackWeek[index + 3] = trackWeek[index + 3] + diff;
                                                totalHours += diff;
                                            } else {
                                                if ((index + 2 <= 5)) {
                                                    trackWeek[index + 2] = trackWeek[index + 2] + diff;
                                                    totalHours += diff;
                                                }
                                            }
                                        } else {
                                            trackWeek[index + 1] = trackWeek[index + 1] + diff;
                                            totalHours += diff;
                                        }
                                    }

                                    globalTotal += totalHours;

                                    wTrackObj = {
                                        dateByWeek : dateByWeek,
                                        dateByMonth: dateByMonth,
                                        project    : project,
                                        employee   : employee,
                                        department : department,
                                        year       : year,
                                        month      : month,
                                        week       : week,
                                        worked     : totalHours,
                                        revenue    : parseFloat(revenue),
                                        cost       : cost,
                                        rate       : parseFloat((parseFloat(revenue) / parseFloat(totalHours)).toFixed(2)),
                                        1          : trackWeek['1'],
                                        2          : trackWeek['2'],
                                        3          : trackWeek['3'],
                                        4          : trackWeek['4'],
                                        5          : trackWeek['5'],
                                        6          : trackWeek['6'],
                                        7          : trackWeek['7'],
                                        "createdBy": {
                                            "date": new Date(),
                                            "user": currentUser
                                        },
                                        "editedBy" : {
                                            "user": currentUser
                                        },
                                        "groups"   : {
                                            "group": [],
                                            "users": [],
                                            "owner": currentUser
                                        },
                                        jobs       : jobObj

                                    };

                                    wTrack = new WTrack(wTrackObj);
                                    savedwTrack.push(wTrackObj);

                                    if (totalHours > 0) {
                                        wTrack.save(function (err, wTrack) {
                                            if (err) {
                                                return next(err);
                                            }
                                        });
                                    }

                                    if (opt.hours && (savedwTrack.length === dateArray.length)) {

                                        if (((totalHolidays + totalVacations) * 8 > 0) || (globalTotal < opt.hours)) {
                                            generateAddWeeks(opt.hours - globalTotal, dateArray[dateArray.length - 1], savedwTrack);
                                        }
                                    }

                                    function generateAddWeeks(addHours, lastWeek, savedwTrack) {
                                        // if (dateByWeek === (lastWeek.year * 100 + lastWeek.week)) {
                                        var dateByMonth;
                                        var dateByWeek;
                                        var newMonth;
                                        var newYear;
                                        var newWeek;
                                        var newObj;
                                        var hours;
                                        var wTrack = models.get(req.session.lastDb, "wTrack", wTrackSchema);
                                        var lastwTrack;
                                        var total = 0;

                                        savedwTrack.forEach(function (element) {
                                            if ((lastWeek.year * 100 + lastWeek.week) === element.dateByWeek) {
                                                lastwTrack = element;
                                                if (lastwTrack[1] === 0) {
                                                    for (var i = 7;
                                                        i >= 1;
                                                        i--) {
                                                        lastwTrack[i] = parseInt(opt[i]);
                                                    }
                                                }
                                            }

                                        });

                                        if (lastwTrack) {
                                            hours = 0;
                                            newObj = _.clone(lastwTrack);

                                            for (var i = 7;
                                                i > 0;
                                                i--) {
                                                hours += parseInt(opt[i]);
                                                newObj[i] = parseInt(opt[i]);
                                            }
                                            var weekCount = addHours / hours;

                                            for (var i = Math.round(weekCount) - 1;
                                                i > 0;
                                                i--) {
                                                newWeek = lastwTrack.week + i;
                                                newYear = newObj.year;
                                                if (newWeek > moment([newObj.year, newObj.month]).isoWeeksInYear()) {
                                                    newYear++;
                                                }
                                                newMonth = moment().isoWeek(newWeek).get('month') + 1;

                                                dateByWeek = newYear * 100 + newWeek;
                                                dateByMonth = newYear * 100 + newMonth;

                                                newObj.month = newMonth;
                                                newObj.worked = hours;
                                                newObj.week = newWeek;
                                                newObj.dateByWeek = dateByWeek;
                                                newObj.dateByMonth = dateByMonth;

                                                total += hours;

                                                wTrack = new WTrack(newObj);

                                                wTrack.save(function (err, wTrack) {
                                                    if (err) {
                                                        return console.log(err);
                                                    }
                                                });
                                            }
                                            lastwTrack = newObj;
                                            var diff = addHours - total;
                                            if (diff > 0) {
                                                var h = total / (Math.round(weekCount) - 1);

                                                if ((diff <= h) || (diff <= globalTotal)) {
                                                    newWeek = lastwTrack.week + 1;
                                                    newYear = newObj.year;
                                                    if (newWeek > moment([newObj.year, newObj.month]).isoWeeksInYear()) {
                                                        newYear++;
                                                    }
                                                    newMonth = moment().isoWeek(newWeek).get('month') + 1;

                                                    dateByWeek = newYear * 100 + newWeek;
                                                    dateByMonth = newYear * 100 + newMonth;

                                                    newObj.month = newMonth;
                                                    newObj.week = newWeek;
                                                    newObj.dateByWeek = dateByWeek;
                                                    newObj.dateByMonth = dateByMonth;

                                                    var i = 1;
                                                    var hoursInWeek = 0;

                                                    while (hoursInWeek < diff) {
                                                        if (i <= 7) {
                                                            newObj[i] = lastwTrack[i];
                                                            hoursInWeek += parseInt(lastwTrack[i]);
                                                            globalTotal += lastwTrack[i];
                                                        }
                                                        i++;
                                                    }

                                                    newObj[i - 1] = newObj[i - 1] - (globalTotal - opt.hours);

                                                    for (var j = i;
                                                        j <= 7;
                                                        j++) {
                                                        newObj[j] = 0;
                                                    }

                                                    hoursInWeek = 0;
                                                    for (var j = 7;
                                                        j >= 1;
                                                        j--) {
                                                        hoursInWeek += parseInt(newObj[j]);
                                                    }

                                                    newObj.worked = hoursInWeek;
                                                    newObj.rate = parseFloat((parseFloat(newObj.revenue) / hoursInWeek).toFixed(2))

                                                    wTrack = new WTrack(newObj);

                                                    wTrack.save(function (err, wTrack) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                    });
                                                } else {
                                                    for (var i = 2;
                                                        i >= 1;
                                                        i--) {
                                                        newWeek = lastwTrack.week + i;
                                                        newYear = newObj.year;
                                                        if (newWeek > moment([newObj.year, newObj.month]).isoWeeksInYear()) {
                                                            newYear++;
                                                        }
                                                        newMonth = moment().isoWeek(newWeek).get('month') + 1;

                                                        dateByWeek = newYear * 100 + newWeek;
                                                        dateByMonth = newYear * 100 + newMonth;

                                                        newObj.month = newMonth;
                                                        newObj.worked = hours;
                                                        newObj.week = newWeek;
                                                        newObj.dateByWeek = dateByWeek;
                                                        newObj.dateByMonth = dateByMonth;

                                                        wTrack = new WTrack(newObj);

                                                        wTrack.save(function (err, wTrack) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }

                                });

                            });

                        });

                        call();

                    });

                    function getHolidays(callback) {
                        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
                        var newResult = {};
                        var query = Holiday.find({year: {$in: uniqYears}, week: {$in: uniqWeeks}}).lean();
                        var total = 0;

                        query.exec(function (err, result) {
                            if (err) {
                                callback(err);
                            }

                            result.forEach(function (element) {
                                var date = element.date;
                                var year = element.year;
                                var week = element.week;
                                var key = year * 100 + week;
                                var dayOfWeek = moment(date).day();

                                if (!newResult[key]) {
                                    newResult[key] = {};
                                }
                                newResult[key][dayOfWeek] = dayOfWeek;
                                total++;
                            });

                            callback(null, {holidays: newResult, total: total});
                        });
                    };

                    function getVacations(callback) {
                        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
                        var newResult = {};
                        var total = 0;
                        var query = Vacation.find({
                            month         : {$in: uniqMonths},
                            year          : {$in: uniqYears},
                            "employee._id": employee
                        }, {month: 1, year: 1, vacArray: 1}).lean();

                        query.exec(function (err, result) {
                            if (err) {
                                callback(err);
                            }

                            if (result) {
                                result.forEach(function (element) {
                                    var vacArr = element.vacArray;
                                    var year = element.year;
                                    var month = element.month;
                                    var weekKey;
                                    var dayNumber;
                                    var dateValue;

                                    for (var day = vacArr.length - 1;
                                        day >= 0;
                                        day--) {
                                        if (vacArr[day]) {
                                            dateValue = moment([year, month - 1, day + 1]);
                                            weekKey = year * 100 + moment(dateValue).isoWeek();

                                            dayNumber = moment(dateValue).day();

                                            if (dayNumber !== 0 && dayNumber !== 6) {
                                                if (!newResult[weekKey]) {
                                                    newResult[weekKey] = {};
                                                }
                                                newResult[weekKey][dayNumber] = dayNumber;
                                                total++;
                                            }
                                        }
                                    }
                                });
                                callback(null, {vacations: newResult, total: total});
                            }
                        });
                    }

                    //function getWorkflowStatus(fCb) {
                    //    var workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
                    //
                    //    var query = workflow.find({_id: objectId(projectWorkflowId)}, {status: 1}).lean();
                    //
                    //    query.exec(function (err, result) {
                    //        if (err) {
                    //            return fCb(err);
                    //        }
                    //
                    //        if (result.length > 0) {
                    //            fCb(null, result[0].status);
                    //        }
                    //
                    //    });
                    //}

                    function calculateWeeks(fCb) {
                        var data = options;
                        var startDate = new Date(data.startDate);
                        var endDate = data.endDate ? new Date(data.endDate) : '';
                        var hours = parseInt(data.hours);
                        var resultArray = [];
                        var diff;
                        var diffYear;
                        var endYear;
                        var endMonth;
                        var endWeek;
                        var weekNumber;
                        var newDate;
                        var startYear;
                        var startWeek;
                        var isoWeeks;
                        var startD;
                        var dayNumber;
                        var dayOfWeek;
                        var parallelTasks;
                        var totalForWeek;
                        var endDay;
                        var day;
                        var addedWeek = true;

                        var query = Employee.find({_id: objectId(employeeId)}, {hire: 1}).lean();

                        query.exec(function (err, result) {
                            var hireDateArr = result ? result[0].hire : [];
                            var hireDate = hireDateArr[hireDateArr.length - 1] ? hireDateArr[hireDateArr.length - 1] : startDate;

                            if (startDate < hireDate) {
                                startDate = hireDate;
                            }

                            startYear = moment(startDate).year();
                            startWeek = moment(startDate).isoWeek();
                            isoWeeks = moment(startYear).isoWeeksInYear();

                            if (endDate) {

                                if (endDate < hireDate) {
                                    endDate = hireDate;
                                }

                                if (moment(startDate).day() === 0 || moment(startDate).day() === 6) {
                                    startDate = moment(startDate).day(1);
                                    addedWeek = false;
                                }

                                endYear = moment(endDate).year();
                                endMonth = moment(endDate).month();
                                endWeek = moment(endDate).isoWeek();
                                endDay = moment(endDate).date();

                                day = moment(endDate).day();

                                totalForWeek = 0;

                                for (var i = 7; i >= 1; i--) {
                                    totalForWeek += parseInt(opt[i]);
                                }

                            } else {
                                var date = startDate;
                                totalForWeek = 0;

                                for (var i = 7; i >= 1; i--) {
                                    totalForWeek += parseInt(opt[i]);
                                }

                                endYear = startYear;
                                weekNumber = hours / totalForWeek;
                                startD = moment(date).date();

                                if (hours % 8 === 0) {
                                    dayNumber = hours / 8;
                                } else {
                                    dayNumber = Math.ceil(hours / 8);
                                }

                                endMonth = moment(date).month();

                                if (dayNumber > moment(date).endOf('month').date()) {
                                    dayNumber = startD + dayNumber;
                                    endMonth = parseInt(dayNumber / 30) + 1;
                                    dayNumber = dayNumber - (parseInt(dayNumber / 30) * 30);
                                }

                                endWeek = startWeek + Math.ceil(weekNumber) - 1;

                                if (startWeek + weekNumber > moment().isoWeeksInYear()) {
                                    endYear = moment(date).year() + 1;
                                    endWeek = endWeek - isoWeeks + 1;
                                    date = moment(startDate).year(endYear);
                                }

                                newDate = moment(date).isoWeek(endWeek);
                                endMonth = moment(newDate).month();
                                endDate = moment().year(endYear).month(endMonth).isoWeek(endWeek);
                                endDate.day(startD + dayNumber);

                                if (endDate < hireDate) {
                                    endDate = hireDate;
                                }
                            }

                            diff = endWeek - startWeek;
                            diffYear = endYear - startYear;

                            if ((day === 0) || (day === 6) /*&& (diffYear > 0)*/) {
                                endWeek += 1;
                                //addedWeek = false;
                            }

                            if (diff < 0) {
                                diff = isoWeeks - startWeek;
                                parallelTasks = [firstPart, secondPart];

                                async.parallel(parallelTasks, function (err, result) {
                                    resultArray = result[0].concat(result[1]);

                                    fCb(null, resultArray);
                                });
                            } else if (diff === 0 && (startDate == endDate)) {
                                fCb(null, []);
                            } else if ((diff >= 0) && (diffYear === 0)) {
                                parallelTasks = [thirdPart];

                                async.parallel(parallelTasks, function (err, result) {
                                    resultArray = result[0];

                                    fCb(null, resultArray);
                                });
                            } else if ((diff > 0) && (diffYear === 1)) {
                                diff = isoWeeks - startWeek;
                                parallelTasks = [firstPart, secondPart];

                                async.parallel(parallelTasks, function (err, result) {
                                    resultArray = result[0].concat(result[1]);

                                    fCb(null, resultArray);
                                });
                            }

                            function firstPart(parallelCb) {
                                endDate = moment(startDate).date(31);
                                setObj(parallelCb, diff, isoWeeks, startDate, startYear, true);
                            }

                            function secondPart(parallelCb) {
                                diff = endWeek;

                                var year = moment(startDate).year();
                                var endYear = moment(endDate).year();

                                if (diffYear > 0) {
                                    endYear++;
                                }

                                startDate = moment().year(endYear).isoWeek(1).day(1);
                                startWeek = moment(startDate).isoWeek();
                                endDate = moment(endDate).isoWeek(endWeek - 1).date(endDay);

                                setObj(parallelCb, diff, endWeek - 1, startDate, endYear, false)
                            }

                            function thirdPart(parallelCb) {
                                setObj(parallelCb, diff, endWeek, startDate, startYear, true)
                            }

                            function setObj(parallelCb, diff, endWeek, date, year, checkFirstWeek) {
                                var result = [];
                                var total = 0;
                                var z;

                                if (diff === 1) {
                                    z = 1;
                                } else {
                                    z = 0;
                                }

                                for (var y = diff;
                                    y >= z;
                                    y--) {
                                    var obj = {};
                                    var objNext = {};
                                    var newDate;
                                    var day;
                                    var lastMonth;

                                    obj.weekValues = {};
                                    objNext.weekValues = {};

                                    if (y === 0) {
                                        obj.week = endWeek - y;

                                        newDate = moment(date).isoWeek(obj.week);

                                        var d = moment(endDate).isoWeek(obj.week);
                                        var day2 = moment(startDate).day();

                                        day = moment(d).day();

                                        if (day === 0) {
                                            day = 5;
                                        }

                                        dayOfWeek = moment(newDate).day();

                                        var endOfMonth = moment(newDate).endOf('month').date();

                                        if ((moment(newDate).date() + 7 > endOfMonth) && ((opt.hours > totalForWeek) || opt.endDate) && (newDate > d)) {

                                            for (var j = 1;
                                                j <= 5;
                                                j++) {
                                                if (j <= moment(newDate).endOf('month').day()) {
                                                    obj.weekValues[j] = parseInt(opt[j]);
                                                    objNext.weekValues[j] = 0;
                                                    total += parseInt(opt[j]);
                                                } else {
                                                    obj.weekValues[j] = 0;
                                                    objNext.weekValues[j] = parseInt(opt[j]);
                                                    total += parseInt(opt[j]);
                                                }
                                            }

                                            obj.weekValues[6] = 0;
                                            obj.weekValues[7] = 0;
                                            objNext.weekValues[6] = parseInt(opt['6']);
                                            objNext.weekValues[7] = parseInt(opt['7']);
                                            total += parseInt(opt['6']);
                                            total += parseInt(opt['7']);

                                            obj.month = moment(newDate).month() + 1;
                                            obj.year = year;
                                            obj.week = moment(newDate).isoWeek();

                                            lastMonth = obj.month;

                                            if (lastMonth + 1 > 12) {
                                                objNext.month = 1;
                                                objNext.week = obj.week;
                                                objNext.year = year + 1;
                                            } else {
                                                objNext.month = lastMonth + 1;
                                                objNext.week = obj.week;
                                                objNext.year = year;
                                            }

                                            result.push(obj);
                                            result.push(objNext);
                                        } else {
                                            if (obj.week === endWeek) {
                                                var i = 1;
                                                var hoursInWeek = 0;

                                                obj.month = moment(newDate).month() + 1;
                                                obj.year = year;
                                                obj.week = moment(newDate).isoWeek();

                                                if (opt.hours) {
                                                    while (opt.hours - total >= hoursInWeek) {
                                                        if (i <= 5) {
                                                            obj.weekValues[i] = parseInt(opt[i]);
                                                            hoursInWeek += parseInt(opt[i]);
                                                            total += parseInt(opt[i]);
                                                            i++;
                                                        }
                                                    }

                                                    if (opt.hours - total > 0) {
                                                        if (i !== 6 && i !== 7) {
                                                            if (opt.hours - total <= parseInt(opt[i])) {
                                                                obj.weekValues[i] = opt.hours - total;
                                                                i++;
                                                            } else {
                                                                obj.weekValues[i] = parseInt(opt[i]);
                                                                total += parseInt(opt[i]);
                                                                i++;
                                                                obj.weekValues[i] = opt.hours - total;
                                                                i++;
                                                            }
                                                        }
                                                    }

                                                    for (var k = i;
                                                        k <= 7;
                                                        k++) {
                                                        obj.weekValues[k] = 0;
                                                    }
                                                } else {

                                                    obj.month = moment(newDate).month() + 1;
                                                    obj.year = moment(newDate).year();
                                                    obj.week = moment(newDate).isoWeek();

                                                    if ((obj.week === 53) && (obj.month === 1)) {
                                                        // day = moment(newDate).day();
                                                        for (var k = 1; k <= 7; k++) {
                                                            if (k >= moment(newDate).day()) {
                                                                obj.weekValues[k] = parseInt(opt[k]);
                                                            } else {
                                                                obj.weekValues[k] = 0;
                                                            }
                                                        }
                                                    } else {
                                                        for (var k = 1; k <= 7; k++) {
                                                            if (k <= day) {
                                                                obj.weekValues[k] = parseInt(opt[k]);
                                                            } else {
                                                                obj.weekValues[k] = 0;
                                                            }
                                                        }
                                                    }

                                                }
                                                result.push(obj);
                                            }

                                            //if (weekValidate && !(diffYear > 0)) {
                                            //    obj.month = moment(newDate).month();
                                            //} else {
                                            //    obj.month = moment(newDate).month() + 1;
                                            //}

                                        }

                                    } else if (y === diff) {
                                        var weekValidate;

                                        obj.week = endWeek - y;

                                        if (addedWeek) {
                                            weekValidate = obj.week >= startWeek;
                                        } else {
                                            weekValidate = obj.week > startWeek;
                                        }

                                        newDate = moment(startDate).isoWeek(obj.week);

                                        dayOfWeek = moment(newDate).day();

                                        if ((dayOfWeek !== 0) && (dayOfWeek !== 6) /*&& obj.week > 0*/) {

                                            var endOfMonth = moment(newDate).endOf('month').date();

                                            if ((addedWeek && weekValidate)  /*(obj.week === startWeek)*/ || (diff === 1)) {

                                                if ((moment(newDate).date() + 7 > endOfMonth) && (moment(newDate).date() < moment(endDate).date())) {
                                                    day = moment(date).day();

                                                    for (var k = 5; k >= 1; k--) {
                                                        if (k <= moment(newDate).endOf('month').day()) {
                                                            obj.weekValues[k] = parseInt(opt[k]);
                                                            objNext.weekValues[k] = 0;
                                                            total += parseInt(opt[k]);
                                                        } else {
                                                            obj.weekValues[k] = 0;
                                                            objNext.weekValues[k] = parseInt(opt[k]);
                                                            total += parseInt(opt[k]);
                                                        }

                                                    }
                                                    obj.weekValues[6] = 0;
                                                    obj.weekValues[7] = 0;
                                                    objNext.weekValues[6] = parseInt(opt['6']);
                                                    objNext.weekValues[7] = parseInt(opt['7']);
                                                    total += parseInt(opt['6']);
                                                    total += parseInt(opt['7']);

                                                    obj.month = moment(newDate).month() + 1;
                                                    obj.year = year;
                                                    obj.week = moment(newDate).isoWeek();

                                                    lastMonth = obj.month;

                                                    if (lastMonth + 1 > 12) {
                                                        objNext.month = 1;
                                                        objNext.week = obj.week;
                                                        objNext.year = year + 1;
                                                    } else {
                                                        objNext.month = lastMonth + 1;
                                                        objNext.week = obj.week;
                                                        objNext.year = year;
                                                    }

                                                    result.push(obj);
                                                    result.push(objNext);
                                                } else {
                                                    day = moment(newDate).day();
                                                    for (var j = 5; j >= 1; j--) {
                                                        if (day <= j) {
                                                            obj.weekValues[j] = parseInt(opt[j]);
                                                            total += parseInt(opt[j]);
                                                        } else {
                                                            obj.weekValues[j] = 0;
                                                        }
                                                    }
                                                    obj.weekValues[6] = parseInt(opt['6']);
                                                    obj.weekValues[7] = parseInt(opt['7']);
                                                    total += parseInt(opt['6']);
                                                    total += parseInt(opt['7']);

                                                    obj.month = moment(newDate).month() + 1;
                                                    obj.year = year;
                                                    obj.week = moment(newDate).isoWeek();

                                                    result.push(obj);
                                                }
                                            }
                                        }
                                    } else {
                                        var dayOfWeek;

                                        obj.week = endWeek - y;

                                        newDate = moment(date).isoWeek(obj.week).day(1);

                                        if (obj.week === 1 && !checkFirstWeek) {
                                            newDate = moment(date);
                                        }

                                        dayOfWeek = moment(newDate).day();

                                        var endOfMonth = moment(newDate).endOf('month').date();

                                        if (obj.week > 0) {

                                            if (moment(newDate).date() + 7 > endOfMonth) {
                                                day = moment(newDate).day();

                                                for (var k = 5; k >= 1; k--) {
                                                    if (k <= moment(newDate).endOf('month').day()) {
                                                        obj.weekValues[k] = parseInt(opt[k]);
                                                        objNext.weekValues[k] = 0;
                                                        total += parseInt(opt[k]);
                                                    } else {
                                                        obj.weekValues[k] = 0;
                                                        objNext.weekValues[k] = parseInt(opt[k]);
                                                        total += parseInt(opt[k]);
                                                    }
                                                }
                                                obj.weekValues[6] = 0;
                                                obj.weekValues[7] = 0;
                                                objNext.weekValues[6] = parseInt(opt['6']);
                                                objNext.weekValues[7] = parseInt(opt['7']);
                                                total += parseInt(opt['6']);
                                                total += parseInt(opt['7']);

                                                obj.month = moment(newDate).month() + 1;
                                                obj.year = year;
                                                obj.week = moment(newDate).isoWeek();

                                                lastMonth = obj.month;

                                                if (lastMonth + 1 > 12) {
                                                    objNext.month = 1;
                                                    objNext.week = obj.week;
                                                    objNext.year = year;
                                                } else {
                                                    objNext.month = lastMonth + 1;
                                                    objNext.week = obj.week;
                                                    objNext.year = year;
                                                }

                                                result.push(obj);
                                                result.push(objNext);
                                            } else {
                                                day = moment(newDate).day();

                                                for (var k = 5; k >= 1; k--) {
                                                    if (k >= day) {
                                                        obj.weekValues[k] = parseInt(opt[k]);
                                                        total += parseInt(opt[k]);
                                                    } else {
                                                        obj.weekValues[k] = 0;
                                                    }

                                                }
                                                obj.weekValues[6] = parseInt(opt['6']);
                                                obj.weekValues[7] = parseInt(opt['7']);
                                                total += parseInt(opt['6']);
                                                total += parseInt(opt['7']);

                                                obj.month = moment(newDate).month() + 1;
                                                obj.week = moment(newDate).isoWeek();
                                                obj.year = year;

                                                result.push(obj);
                                            }

                                        }
                                    }
                                }

                                parallelCb(null, result);
                            }
                        });

                    }
                }

            }, function (err) {
                if (err) {
                    return waterfallCB(err);
                }

                waterfallCB();
            });
        }

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
                revenue    : 1
            }
        }, {
            $match: {
                'project.projectName': query.projectName
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