module.exports = function (models, event) {
    'use strict';

    var mongoose = require('mongoose');
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var _ = require('../node_modules/underscore');
    var moment = require('../public/js/libs/moment/moment');
    var async = require('async');
    var CONSTANTS = require('../constants/mainConstants.js');
    var Mailer = require('../helpers/mailer');
    var Uploader = require('../services/fileStorage/index');
    var pathMod = require('path');

    var fs = require('fs');
    var path = require('path');
    var ProjectSchema = mongoose.Schemas.Project;
    var ProjectTypeSchema = mongoose.Schemas.projectType;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var EmployeeSchema = mongoose.Schemas.Employee;
    var OrgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
    var wTrackInvoiceSchema = mongoose.Schemas.wTrackInvoice;
    var tasksSchema = mongoose.Schemas.Task;
    var jobsSchema = mongoose.Schemas.jobs;

    var objectId = mongoose.Types.ObjectId;
    var mailer = new Mailer();
    var uploader = new Uploader();

    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Project;

    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    var projectCT = 'Project';

    var lookupForProjectArray = [
        {
            $lookup: {
                from        : 'projectMembers',
                localField  : '_id',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'customer',
                foreignField: '_id',
                as          : 'customer'
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
                from        : 'Users',
                localField  : 'createdBy.user',
                foreignField: '_id',
                as          : 'createdBy.user'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                projectShortDesc: 1,
                projectName     : '$name',
                customer        : {$arrayElemAt: ['$customer', 0]},
                projectManager  : {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.PROJECTSMANAGER)]
                            }, {
                                $or: [{
                                    $max: '$$projectMember.startDate'
                                }, {
                                    $eq: ['$$projectMember.startDate', null]
                                }]
                            }]
                        }
                    }
                },

                salesManager    : {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                            }, {
                                $or: [{
                                    $max: '$$projectMember.startDate'
                                }, {
                                    $eq: ['$$projectMember.startDate', null]
                                }]
                            }]
                        }
                    }
                },
                description     : '$description',
                StartDate       : '$StartDate',
                EndDate         : '$EndDate',
                TargetEndDate   : '$TargetEndDate',
                workflow        : {$arrayElemAt: ['$workflow', 0]},
                'createdBy.user': '$createdBy.user.login',
                'createdBy.date': '$createdBy.date',
                projecttype     : '$projecttype',
                'editedBy.user' : '$editedBy.user.login',
                'editedBy.date' : '$editedBy.date'
            }
        }, {
            $project: {
                projectShortDesc: 1,
                projectName     : 1,
                customername    : {$concat: ['$customer.name.first', ' ', '$customer.name.last']},
                projectManager  : {$arrayElemAt: ['$projectManager', 0]},
                salesManager    : {$arrayElemAt: ['$salesManager', 0]},
                description     : 1,
                StartDate       : 1,
                EndDate         : 1,
                TargetEndDate   : 1,
                workflow        : 1,
                'createdBy.user': 1,
                'createdBy.date': 1,
                projecttype     : 1,
                'editedBy.user' : 1,
                'editedBy.date' : 1,
                'customer._id'  : '$customer._id'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'projectManager.employeeId',
                foreignField: '_id',
                as          : 'projectManagerEmployee'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManager.employeeId',
                foreignField: '_id',
                as          : 'salesManagerEmployee'
            }
        }, {
            $project: {
                projectShortDesc      : 1,
                projectName           : 1,
                customername          : 1,
                projectManagerEmployee: {$arrayElemAt: ['$projectManagerEmployee', 0]},
                salesManagerEmployee  : {$arrayElemAt: ['$salesManagerEmployee', 0]},
                description           : 1,
                StartDate             : 1,
                EndDate               : 1,
                TargetEndDate         : 1,
                workflow              : 1,
                'createdBy.user'      : 1,
                'createdBy.date'      : 1,
                projecttype           : 1,
                'editedBy.user'       : 1,
                'editedBy.date'       : 1,
                'customer._id'        : 1
            }
        }, {
            $project: {
                projectShortDesc     : 1,
                projectName          : 1,
                customername         : 1,
                'projectmanager.name': {$concat: ['$projectManagerEmployee.name.first', ' ', '$projectManagerEmployee.name.last']},
                'salesmanager.name'  : {$concat: ['$salesManagerEmployee.name.first', ' ', '$salesManagerEmployee.name.last']},
                'projectManager._id' : '$projectManagerEmployee._id',
                'salesManager._id'   : '$salesManagerEmployee._id',
                description          : 1,
                StartDate            : 1,
                EndDate              : 1,
                TargetEndDate        : 1,
                workflow             : 1,
                'createdBy.user'     : 1,
                'createdBy.date'     : 1,
                projecttype          : 1,
                'editedBy.user'      : 1,
                'editedBy.date'      : 1,
                'customer._id'       : 1
            }
        }
    ];

    function pageHelper(data) {
        var count = data.count;
        var page = data.page || 1;
        var skip;

        count = parseInt(count, 10);
        count = !isNaN(count) ? count : CONSTANTS.COUNT_PER_PAGE;
        page = parseInt(page, 10);
        page = !isNaN(page) && page ? page : 1;
        skip = (page - 1) * count;

        return {
            skip : skip,
            limit: count
        };
    }

    this.create = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var body = req.body;
        var newProject;

        body.createdBy = {
            date: new Date(),
            user: req.session.uId
        };

        newProject = new Project(body);

        newProject.save(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: 'A new Project crate success', result: result, id: result._id});
        });
    };

    this.updateOnlySelectedFields = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var data = req.body;
        var _id = req.params.id;
        var obj;
        var fileName = data.fileName;

        delete data._id;

        delete data.fileName;

        if (data.notes && data.notes.length !== 0) {
            obj = data.notes[data.notes.length - 1];
            if (!obj._id) {
                obj._id = mongoose.Types.ObjectId();
            }
            // obj.date = new Date();
            obj.author = req.session.uName;
            data.notes[data.notes.length - 1] = obj;
        }

        Project.findByIdAndUpdate({_id: _id}, {$set: data}, {new: true}, function (err, project) {
            var os = require('os');
            var osType = (os.type().split('_')[0]);
            var path;
            var dir;
            var newDirname;

            if (err) {
                return next(err);
            }

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
                }

                fs.unlink(path, function (err) {
                    console.log(err);
                    fs.readdir(dir, function (err, files) {
                        if (files && files.length === 0) {
                            fs.rmdir(dir, function () {
                            });
                        }
                    });
                });

            }

            // event.emit('recollectProjectInfo');
            res.status(200).send(project);
        });
    };

    function removeTasksByPorjectID(req, _id) {
        var TasksModel = models.get(req.session.lastDb, 'Tasks', tasksSchema);

        TasksModel.remove({project: _id}, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }

    this.getByViewType = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var sort = data.sort || {'createdBy.date': -1};
        var viewType = data.viewType;
        var optionsObject;
        var filter = data.filter || {};
        var response = {};
        var lookupPipeline = [{
            $lookup: {
                from        : 'projectMembers',
                localField  : '_id',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }];

        var projectThumbPipeline = [{
            $project: {
                name            : 1,
                workflow        : {$arrayElemAt: ['$workflow', 0]},
                task            : 1,
                customer        : {$arrayElemAt: ['$customer', 0]},
                health          : 1,
                projecttype     : 1,
                'createdBy.date': 1,
                salesManagers   : {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }
                    }
                },

                projectManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.PROJECTSMANAGER)]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }
                    }
                }
            }
        }, {
            $project: {
                _id             : 1,
                name            : 1,
                task            : 1,
                workflow        : 1,
                salesManager    : {$arrayElemAt: ['$salesManagers', 0]},
                projectManager  : {$arrayElemAt: ['$projectManagers', 0]},
                customer        : 1,
                health          : 1,
                projecttype     : 1,
                'createdBy.date': 1
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManager.employeeId',
                foreignField: '_id',
                as          : 'salesManager'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'projectManager.employeeId',
                foreignField: '_id',
                as          : 'projectManager'
            }
        }, {
            $project: {
                _id             : 1,
                name            : 1,
                task            : 1,
                workflow        : 1,
                salesManager    : {$arrayElemAt: ['$salesManager', 0]},
                projectManager  : {$arrayElemAt: ['$projectManager', 0]},
                customer        : 1,
                health          : 1,
                projecttype     : 1,
                'createdBy.date': 1
            }
        }];

        var projectListPipeline = [{
            $project: {
                name            : 1,
                workflow        : {$arrayElemAt: ['$workflow', 0]},
                'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                'editedBy.user' : {$arrayElemAt: ['$editedBy.user', 0]},
                'createdBy.date': 1,
                'editedBy.date' : 1,

                notRemovable: {
                    $size: {$ifNull: ['$budget.projectTeam', []]} // added check on field value null
                },

                progress     : 1,
                customer     : {$arrayElemAt: ['$customer', 0]},
                StartDate    : 1,
                EndDate      : 1,
                TargetEndDate: 1,
                health       : 1,
                projecttype  : 1,

                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }
                    }
                },

                projectManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.PROJECTSMANAGER)]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }
                    }
                }
            }
        }, {
            $project: {
                _id             : 1,
                'createdBy.date': 1,
                'editedBy.date' : 1,
                'createdBy.user': '$createdBy.user.login',
                'editedBy.user' : '$editedBy.user.login',
                notRemovable    : 1,
                progress        : 1,
                StartDate       : 1,
                EndDate         : 1,
                TargetEndDate   : 1,
                name            : 1,
                workflow        : 1,
                salesManager    : {$arrayElemAt: ['$salesManagers', 0]},
                projectManager  : {$arrayElemAt: ['$projectManagers', 0]},
                customer        : 1,
                health          : 1,
                projecttype     : 1
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManager.employeeId',
                foreignField: '_id',
                as          : 'salesManager'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'projectManager.employeeId',
                foreignField: '_id',
                as          : 'projectManager'
            }
        }, {
            $project: {
                _id           : 1,
                name          : 1,
                createdBy     : 1,
                editedBy      : 1,
                notRemovable  : 1,
                progress      : 1,
                workflow      : 1,
                StartDate     : 1,
                EndDate       : 1,
                TargetEndDate : 1,
                salesManager  : {$arrayElemAt: ['$salesManager', 0]},
                projectManager: {$arrayElemAt: ['$projectManager', 0]},
                customer      : 1,
                health        : 1,
                projecttype   : 1
            }
        }];

        var projectionOptions = {
            name       : 1,
            task       : 1,
            health     : 1,
            createdBy  : 1,
            editedBy   : 1,
            projecttype: 1,

            workflow: {
                name: '$workflow.name'
            },

            salesManager: {
                _id: '$salesManager._id'
            },

            customer: {
                name: '$customer.name'
            }
        };
        var projectionLastStepOptions = {
            _id         : '$root._id',
            name        : '$root.name',
            task        : '$root.task',
            workflow    : '$root.workflow',
            salesManager: '$root.salesManager',
            customer    : '$root.customer',
            health      : '$root.health',
            projecttype : '$root.projecttype',
            editedBy    : '$root.editedBy',
            createdBy   : '$root.createdBy',
            total       : 1
        };
        var keysSort = Object.keys(sort);
        var sortLength = keysSort.length - 1;
        var sortKey;
        var waterfallTasks;
        var accessRollSearcher;
        var contentSearcher;
        var mainPipeline;
        var i;

        if (viewType === 'list') {
            lookupPipeline.push({
                $lookup: {
                    from        : 'Users',
                    localField  : 'createdBy.user',
                    foreignField: '_id',
                    as          : 'createdBy.user'
                }
            });

            lookupPipeline.push({
                $lookup: {
                    from        : 'Users',
                    localField  : 'editedBy.user',
                    foreignField: '_id',
                    as          : 'editedBy.user'
                }
            });

            projectionOptions.StartDate = 1;
            projectionOptions.EndDate = 1;
            projectionOptions.TargetEndDate = 1;
            projectionOptions.createdBy = 1;
            projectionOptions.editedBy = 1;
            projectionOptions.progress = 1;
            projectionOptions.notRemovable = 1;
            projectionOptions.workflow = {
                _id : '$workflow._id',
                name: '$workflow.name'
            };

            delete projectionOptions.task;

            projectionLastStepOptions.StartDate = '$root.StartDate';
            projectionLastStepOptions.EndDate = '$root.EndDate';
            projectionLastStepOptions.TargetEndDate = '$root.TargetEndDate';
            projectionLastStepOptions.progress = '$root.TargetEndDate';
            projectionLastStepOptions.notRemovable = '$root.notRemovable';
            projectionLastStepOptions.createdBy = '$root.createdBy';
            projectionLastStepOptions.editedBy = '$root.editedBy';

            delete projectionLastStepOptions.task;

            mainPipeline = lookupPipeline.concat(projectListPipeline);
        } else if (viewType === 'thumbnails') {
            mainPipeline = lookupPipeline.concat(projectThumbPipeline);
        }

        for (i = 0; i <= sortLength; i++) {
            sortKey = keysSort[i];
            sort[sortKey] = parseInt(sort[sortKey], 10);
        }

        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: 'Projects'
            });
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Project, cb);
        };

        contentSearcher = function (ids, cb) {
            var queryObject = {};

            queryObject.$and = [];

            if (optionsObject) {
                queryObject.$and.push(optionsObject);
            }

            queryObject.$and.push({_id: {$in: ids}});

            mainPipeline.push({
                $match: queryObject
            }, {
                $project: projectionOptions
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: projectionLastStepOptions
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            });

            Project.aggregate(mainPipeline, function (err, result) {
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

            if (err) {
                return next(err);
            }

            firstElement = result[0];
            count = firstElement && firstElement.total ? firstElement.total : 0;
            response.total = count;
            response.data = result;

            res.status(200).send(response);
        });
    };

    this.getByViewTypeTest = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var contentType = data.contentType;
        var optionsObject;
        var filter = data.filter || {};
        var response = {};
        var waterfallTasks;
        var accessRollSearcher;
        var contentSearcher;
        var projectionOptions = {
            name  : 1,
            task  : 1,
            health: 1,

            workflow: {
                name: '$workflow.name'
            },

            salesManager: {
                _id: '$salesManager._id'
            },

            customer: {
                name: '$customer.name'
            }
        };
        var projectionLastStepOptions = {
            _id         : '$root._id',
            name        : '$root.name',
            task        : '$root.task',
            workflow    : '$root.workflow',
            salesManager: '$root.salesManager',
            customer    : '$root.customer',
            health      : '$root.health',
            count       : 1
        };

        response.showMore = false;

        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: 'Projects'
            });
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Project, cb);
        };

        contentSearcher = function (ids, cb) {
            var queryObject = {};

            queryObject.$and = [];

            if (optionsObject) {
                queryObject.$and.push(optionsObject);
            }

            queryObject.$and.push({_id: {$in: ids}});

            async.parallel([function (cb) {
                Project
                    .aggregate([{
                        $lookup: {
                            from        : 'projectMembers',
                            localField  : '_id',
                            foreignField: 'projectId',
                            as          : 'projectMembers'
                        }
                    }, {
                        $lookup: {
                            from        : 'Customers',
                            localField  : 'customer',
                            foreignField: '_id',
                            as          : 'customer'
                        }
                    }, {
                        $lookup: {
                            from        : 'workflows',
                            localField  : 'workflow',
                            foreignField: '_id',
                            as          : 'workflow'
                        }
                    }, {
                        $project: {
                            name         : 1,
                            workflow     : {$arrayElemAt: ['$workflow', 0]},
                            task         : 1,
                            customer     : {$arrayElemAt: ['$customer', 0]},
                            health       : 1,
                            salesmanagers: {
                                $filter: {
                                    input: '$projectMembers',
                                    as   : 'projectMember',
                                    cond : {
                                        $and: [{
                                            $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                        }, {
                                            $eq: ['$$projectMember.endDate', null]
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            task        : 1,
                            workflow    : 1,
                            salesManager: {$arrayElemAt: ['$salesmanagers', 0]},
                            customer    : 1,
                            health      : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'salesManager.employeeId',
                            foreignField: '_id',
                            as          : 'salesManager'
                        }
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            task        : 1,
                            workflow    : 1,
                            salesManager: {$arrayElemAt: ['$salesManager', 0]},
                            customer    : 1,
                            health      : 1
                        }
                    }, {
                        $match: queryObject
                    }, {
                        $project: {_id: 1}
                    }], function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, result);
                    });
            }, function (cb) {
                Project
                    .aggregate([{
                        $lookup: {
                            from        : 'projectMembers',
                            localField  : '_id',
                            foreignField: 'projectId',
                            as          : 'projectMembers'
                        }
                    }, {
                        $lookup: {
                            from        : 'Customers',
                            localField  : 'customer',
                            foreignField: '_id',
                            as          : 'customer'
                        }
                    }, {
                        $lookup: {
                            from        : 'workflows',
                            localField  : 'workflow',
                            foreignField: '_id',
                            as          : 'workflow'
                        }
                    }, {
                        $project: {
                            name         : 1,
                            workflow     : {$arrayElemAt: ['$workflow', 0]},
                            task         : 1,
                            customer     : {$arrayElemAt: ['$customer', 0]},
                            health       : 1,
                            salesmanagers: {
                                $filter: {
                                    input: '$projectMembers',
                                    as   : 'projectMember',
                                    cond : {
                                        $and: [{
                                            $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                        }, {
                                            $eq: ['$$projectMember.endDate', null]
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            task        : 1,
                            workflow    : 1,
                            salesManager: {$arrayElemAt: ['$salesmanagers', 0]},
                            customer    : 1,
                            health      : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'salesManager.employeeId',
                            foreignField: '_id',
                            as          : 'salesManager'
                        }
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            task        : 1,
                            workflow    : 1,
                            salesManager: {$arrayElemAt: ['$salesManager', 0]},
                            customer    : 1,
                            health      : 1
                        }
                    }, {
                        $match: queryObject
                    }, {
                        $project: projectionOptions
                    }, {
                        $skip: skip
                    }, {
                        $limit: limit
                    }], function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, result);
                    });
            }], cb);
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            var count;

            if (err) {
                return next(err);
            }

            count = result[0].count || 0;

            response.count = count;
            response.data = result;
            res.status(200).send(response);
        });
    };

    this.getForWtrack = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var data = req.query;
        var inProgress = data && data.inProgress || false;
        var id = data ? data._id : null;
        var filter = inProgress ? {workflow: {$ne: CONSTANTS.PROJECTCLOSED}} : {};

        if (id) {
            filter._id = objectId(id);
        }// add fof Projects in wTrack

        Project
            .find(filter)
            .sort({name: 1})
            .lean()
            .populate('workflow', '_id name')
            .populate('customer', '_id name')
            .populate('salesmanager', '_id name')
            .populate('paymentTerms', '_id name')
            .exec(function (err, projects) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: projects});
            });
    };

    this.getProjectType = function (req, res, next) {
        var ProjectType = models.get(req.session.lastDb, 'proectType', ProjectTypeSchema);

        ProjectType.find({}, function (err, projectType) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: projectType});
        });
    };

    this.getForQuotation = function (req, res, next) {
        var pId = req.query.projectId;
        var Project = models.get(req.session.lastDb, projectCT, ProjectSchema);

        Project.findOne({_id: objectId(pId)}, function (err, project) {
            if (err) {
                return next(err);
            }

            res.status(200).send(project);
        });
    };

    this.sendInvoice = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        var data = req.body;
        var attachments;
        var mailOptions;

        data.attachments = JSON.parse(data.attachments);

        attachments = data.attachments.map(function (att) {
            return {
                path: pathMod.join(__dirname, '../routes', decodeURIComponent(att))
            };
        });

        mailOptions = {
            to         : data.To,
            cc         : data.Cc,
            subject    : 'Invoice ' + data.name,
            attachments: attachments,
            req        : req
        };

        getFromMail(mailOptions, function (err, result) {
            if (err) {
                return next(err);
            }
            Invoice.findByIdAndUpdate(data.id, {$set: {emailed: true}}, function (err, result) {
                res.status(200).send({});
            });
        });
    };

    function getFromMail(mailOptions, cb) {

        var OrgSettings;
        if (mailOptions.req) {
            OrgSettings = models.get(mailOptions.req.session.lastDb, 'orgSettings', OrgSettingsSchema);
            OrgSettings.findOne()
                .populate('contact', 'email')
                .exec(function (err, settings) {
                    if (err) {
                        return console.log(err);
                    }

                    if (settings && !settings.defaultEmail && settings.contact) {
                        mailOptions.from = settings.contact.email;
                    }

                    mailer.sendInvoice(mailOptions, cb);
                });
        } else {
            mailer.sendInvoice(mailOptions, cb);
        }
    }

    this.getEmails = function (req, res, next) {
        var projectId = req.params.id;
        var Project = models.get(req.session.lastDb, projectCT, ProjectSchema);

        Project.aggregate([
            {
                $match: {
                    _id: objectId(projectId)
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesmanager',
                    foreignField: '_id',
                    as          : 'salesmanager'
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'projectmanager',
                    foreignField: '_id',
                    as          : 'projectmanager'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'customer',
                    foreignField: '_id',
                    as          : 'customerCompany'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'customer',
                    foreignField: 'company',
                    as          : 'customerPersons'
                }
            }, {
                $project: {
                    salesmanager   : {$arrayElemAt: ['$salesmanager', 0]},
                    projectmanager : {$arrayElemAt: ['$projectmanager', 0]},
                    customerCompany: {$arrayElemAt: ['$customerCompany', 0]},
                    customerPersons: 1
                }
            }, {
                $project: {
                    _id            : 0,
                    salesmanager   : '$salesmanager.workEmail',
                    projectmanager : '$projectmanager.workEmail',
                    customerCompany: '$customerCompany.email',
                    customerPersons: '$customerPersons.email'
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });

    };

    this.getFilterValues = function (req, res, next) {
        var project = models.get(req.session.lastDb, projectCT, ProjectSchema);

        project.aggregate([
            {
                $group: {
                    _id    : null,
                    project: {
                        $addToSet: '$name'
                    },

                    startDate: {
                        $addToSet: '$StartDate'
                    },

                    endDate: {
                        $addToSet: '$EndDate'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'project':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;

                }
            });

            res.status(200).send(result);
        });
    };

    this.getById = function (req, res, next) {
        var id = req.params.id;
        var Project = models.get(req.session.lastDb, projectCT, ProjectSchema);

        Project.aggregate([{
            $match: {
                _id: objectId(id)
            }
        }, {
            $project: {
                name            : 1,
                EndDate         : 1,
                StartDate       : 1,
                health          : 1,
                editedBy        : 1,
                attachments     : 1,
                notes           : 1,
                projecttype     : 1,
                createdBy       : 1,
                workflow        : 1,
                groups          : 1,
                whoCanRW        : 1,
                customer        : 1,
                projectShortDesc: 1,
                TargetEndDate   : 1,
                description     : 1,
                paymentTerms    : 1,
                paymentMethod   : 1
            }
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : '_id',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Users',
                localField  : 'groups.owner',
                foreignField: '_id',
                as          : 'groups.owner'
            }
        }, {
            $project: {
                name            : 1,
                EndDate         : 1,
                StartDate       : 1,
                health          : 1,
                attachments     : 1,
                notes           : 1,
                projecttype     : 1,
                notRemovable    : 1,
                workflow        : {$arrayElemAt: ['$workflow', 0]},
                'groups.owner'  : {$arrayElemAt: ['$groups.owner', 0]},
                'groups.group'  : 1,
                'groups.users'  : 1,
                whoCanRW        : 1,
                customer        : {$arrayElemAt: ['$customer', 0]},
                projectShortDesc: 1,
                TargetEndDate   : 1,
                description     : 1,
                paymentTerms    : 1,
                paymentMethod   : 1,

                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }
                    }
                },

                projectManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.PROJECTSMANAGER)]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }
                    }
                }
            }
        }, {
            $project: {
                name        : 1,
                EndDate     : 1,
                StartDate   : 1,
                health      : 1,
                attachments : 1,
                notes       : 1,
                projecttype : 1,
                notRemovable: 1,

                workflow: {
                    _id : '$workflow._id',
                    name: '$workflow.name'
                },

                'groups.owner._id'  : '$groups.owner._id',
                'groups.owner.login': '$groups.owner.login',
                'groups.group'      : 1,
                'groups.users'      : 1,

                whoCanRW: 1,

                customer: {
                    _id     : '$customer._id',
                    fullName: {$concat: ['$customer.name.first', ' ', '$customer.name.last']}
                },

                projectShortDesc: 1,
                TargetEndDate   : 1,
                description     : 1,
                paymentTerms    : 1,
                paymentMethod   : 1,

                salesManager: {$arrayElemAt: ['$salesManagers', 0]},

                projectManager: {$arrayElemAt: ['$projectManagers', 0]}
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManager.employeeId',
                foreignField: '_id',
                as          : 'salesManager'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'projectManager.employeeId',
                foreignField: '_id',
                as          : 'projectManager'
            }
        }, {
            $lookup: {
                from        : 'PaymentMethod',
                localField  : 'paymentMethod',
                foreignField: '_id',
                as          : 'paymentMethod'
            }
        }, {
            $lookup: {
                from        : 'paymentTerms',
                localField  : 'paymentTerms',
                foreignField: '_id',
                as          : 'paymentTerms'
            }
        }, {
            $project: {
                name            : 1,
                EndDate         : 1,
                StartDate       : 1,
                health          : 1,
                attachments     : 1,
                notes           : 1,
                projecttype     : 1,
                notRemovable    : 1,
                workflow        : 1,
                groups          : 1,
                whoCanRW        : 1,
                customer        : 1,
                projectShortDesc: 1,
                TargetEndDate   : 1,
                description     : 1,
                paymentTerms    : {$arrayElemAt: ['$paymentTerms', 0]},
                paymentMethod   : {$arrayElemAt: ['$paymentMethod', 0]},

                salesManager  : {$arrayElemAt: ['$salesManager', 0]},
                projectManager: {$arrayElemAt: ['$projectManager', 0]}
            }
        }, {
            $project: {
                name            : 1,
                EndDate         : 1,
                StartDate       : 1,
                health          : 1,
                attachments     : 1,
                notes           : 1,
                projecttype     : 1,
                notRemovable    : 1,
                workflow        : 1,
                groups          : 1,
                whoCanRW        : 1,
                customer        : 1,
                projectShortDesc: 1,
                TargetEndDate   : 1,
                description     : 1,
                paymentTerms    : 1,
                paymentMethod   : 1,

                salesManager: {
                    _id     : '$salesManager._id',
                    fullName: {$concat: ['$salesManager.name.first', ' ', '$salesManager.name.last']}
                },

                projectManager: {
                    _id     : '$projectManager._id',
                    fullName: {$concat: ['$projectManager.name.first', ' ', '$projectManager.name.last']}
                }
            }
        }]).exec(function (err, project) {
            if (err) {
                return next(err);
            }

            res.status(200).send(project[0]);
        });
    };

    this.getForDd = function (req, res, next) {
        var project = models.get(req.session.lastDb, projectCT, ProjectSchema);
        var waterfallTasks;
        var accessRollSearcher = function (cb) {
            accessRoll(req, project, cb);
        };

        var contentSearcher = function (result, cb) {

            project.find({_id: {$in: result}}, {name: 1, projectShortDesc: 1})
                .lean()
                .sort({name: 1})
                .exec(function (err, _res) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, _res);
                });

        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });

    };

    this.updateAllProjects = function (req, res, next) {
        var projectId;
        var Project = models.get(req.session.lastDb, projectCT, ProjectSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var count = 0;

        var query = Job.find({}).lean();

        query
            .populate('wTracks');

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            Employee.populate(result, {
                path  : 'wTracks.employee',
                select: '_id, name',
                lean  : true
            }, function (err, result) {
                async.each(result, function (job, cb) {
                    var jobID = job._id;
                    var projectTeam = {};
                    var projectValues = {};
                    var budgetTotal = {};
                    var wTRack = job.wTracks;
                    var empKeys;
                    var keys;
                    var hoursByMonth = {};
                    var employees = {};
                    var keysForPT;
                    var sortBudget = [];
                    var budget = {};
                    var minDate = 1 / 0;
                    var maxDate = 0;
                    var nextDate;
                    var nextMaxDate;
                    var empQuery;

                    budgetTotal.profitSum = 0;
                    budgetTotal.costSum = 0;
                    budgetTotal.revenueSum = 0;
                    budgetTotal.hoursSum = 0;

                    wTRack.forEach(function (wTrack) {
                        var key;
                        var employee = wTrack.employee;

                        if (!(employee._id in employees)) {
                            employees[employee._id] = employee.name.first + ' ' + employee.name.last;
                        }

                        key = wTrack.year * 100 + wTrack.month;

                        if (hoursByMonth[key]) {
                            hoursByMonth[key] += parseFloat(wTrack.worked);
                        } else {
                            hoursByMonth[key] = parseFloat(wTrack.worked);
                        }
                    });

                    empKeys = Object.keys(employees);

                    empKeys.forEach(function (empId) {
                        wTRack.forEach(function (wTrack) {
                            var emp = (wTrack.employee._id).toString();

                            nextDate = wTrack.dateByWeek;
                            nextMaxDate = wTrack.dateByWeek;

                            if (nextDate <= minDate) {
                                minDate = nextDate;
                            }

                            if (nextMaxDate > maxDate) {
                                maxDate = nextMaxDate;
                            }

                            if (empId === emp) {
                                if (projectTeam[empId]) {
                                    /*                                    if (wTrack.department.toString() === '55b92ace21e4b7c40f000011') {
                                     projectTeam[empId].byQA.revenue += parseFloat(wTrack.revenue);
                                     projectTeam[empId].byQA.hours += parseFloat(wTrack.worked);
                                     }*/
                                    projectTeam[empId].profit += parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                    projectTeam[empId].cost += parseFloat((wTrack.cost / 100).toFixed(2));
                                    // projectTeam[empId].rate += parseFloat(wTrack.rate);
                                    projectTeam[empId].hours += parseFloat(wTrack.worked);
                                    projectTeam[empId].revenue += parseFloat((wTrack.revenue / 100).toFixed(2));
                                } else {
                                    projectTeam[empId] = {};

                                    /*                                    if (wTrack.department.toString() === '55b92ace21e4b7c40f000011') {
                                     projectTeam[empId].byQA = {};
                                     projectTeam[empId].byQA.revenue = parseFloat(wTrack.revenue) / 100;
                                     projectTeam[empId].byQA.hours = parseFloat(wTrack.worked);
                                     }*/

                                    projectTeam[empId].profit = parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                    projectTeam[empId].cost = parseFloat((wTrack.cost / 100).toFixed(2));
                                    // projectTeam[empId].rate = parseFloat(wTrack.rate);
                                    projectTeam[empId].hours = parseFloat(wTrack.worked);
                                    projectTeam[empId].revenue = parseFloat((wTrack.revenue / 100).toFixed(2));
                                }
                            }
                        });

                        budgetTotal.maxDate = maxDate;
                        budgetTotal.minDate = minDate;
                    });

                    keys = Object.keys(projectTeam);
                    if (keys.length > 0) {

                        keys.forEach(function (key) {
                            budgetTotal.profitSum += parseFloat(projectTeam[key].profit);
                            budgetTotal.costSum += parseFloat(projectTeam[key].cost);
                            budgetTotal.hoursSum += parseFloat(projectTeam[key].hours);
                            budgetTotal.revenueSum += parseFloat(projectTeam[key].revenue);
                        });

                        projectValues.revenue = budgetTotal.revenueSum;
                        projectValues.profit = budgetTotal.profitSum;
                        projectValues.markUp = ((budgetTotal.profitSum / budgetTotal.costSum) * 100);
                        if (!isFinite(projectValues.markUp)) {
                            projectValues.markUp = 0;
                        }
                        projectValues.radio = ((budgetTotal.profitSum / budgetTotal.revenueSum) * 100);
                        if (!isFinite(projectValues.radio)) {
                            projectValues.radio = 0;
                        }

                        empQuery = Employee
                            .find({_id: {$in: keys}}, {
                                name       : 1,
                                jobPosition: 1,
                                department : 1
                            })
                            .populate('department', '_id name')
                            .populate('jobPosition', '_id name')
                            .lean();
                        empQuery.exec(function (err, response) {

                            if (err) {
                                return next(err);
                            }

                            keysForPT = Object.keys(projectTeam);

                            response.forEach(function (employee) {
                                keysForPT.forEach(function (id) {
                                    if ((employee._id).toString() === id) {
                                        sortBudget.push(projectTeam[id]);
                                    }
                                });
                            });

                            budget = {
                                projectTeam: response,
                                budget     : sortBudget,
                                budgetTotal: budgetTotal
                            };

                            Job.update({_id: jobID}, {$set: {budget: budget}}, function (err, result) {
                                if (err) {
                                    return next(err);
                                }

                                console.log(count++);
                            });
                        });
                    } else {
                        budget = {
                            projectTeam: [],
                            budget     : [],
                            budgetTotal: budgetTotal
                        };

                        Job.update({_id: jobID}, {$set: {budget: budget}}, function (err) {
                            if (err) {
                                return next(err);
                            }

                            console.log(count++);

                        });
                    }
                    cb();
                }, function () {
                    res.status(200).send('success');

                    /* Job.aggregate([{
                     $match: {
                     'project': ObjectId(pId)
                     }
                     },
                     {
                     $group: {
                     _id   : '$project',
                     jobIds: {$addToSet: '$_id'}
                     }
                     }
                     ], function (err, result) {
                     if (err) {
                     return console.log(err);
                     }

                     async.each(result, function (res, cb) {

                     projectId = res._id;
                     var jobIds = res.jobIds;

                     Project.findByIdAndUpdate(projectId, {$set: {'budget.projectTeam': jobIds}}, {new: true}, function (err, result) {
                     if (err) {
                     console.log(err);
                     }
                     cb();
                     });

                     }, function () {
                     callback();
                     if (projectId) {
                     //event.emit('fetchJobsCollection', {project: projectId});
                     }
                     })
                     })*/
                });
            });

        });

    };

    this.getForDashboard = function (req, res, next) {
        var Project = models.get(req.session.lastDb, projectCT, ProjectSchema);

        Project
            .find()
            .sort({name: 1})
            .lean()
            .exec(function (err, projects) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(projects);
            });
    };

    this.getProjectPMForDashboard = function (req, res, next) {
        var Project = models.get(req.session.lastDb, projectCT, ProjectSchema);
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var data = {};
        var sort = req.query.sort;
        var key;
        var collection;

        if (sort) {
            key = Object.keys(sort)[0];
            sort[key] = parseInt(sort[key], 10);
        } else {
            sort = {'projectmanager.name.first': 1};
        }

        Project.aggregate([{
            $unwind: '$budget.projectTeam'
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesmanager',
                foreignField: '_id',
                as          : 'salesmanager'
            }
        }, {
            $lookup: {
                from        : 'jobs',
                localField  : 'budget.projectTeam',
                foreignField: '_id',
                as          : 'budget.projectTeam'
            }
        }, {
            $project: {
                'budget.projectTeam': {$arrayElemAt: ['$budget.projectTeam', 0]},
                salesmanager        : {$arrayElemAt: ['$salesmanager', 0]},
                'budget.budgetTotal': 1,
                name                : 1
            }
        }, {
            $project: {
                salesmanager        : 1,
                name                : 1,
                'budget.projectTeam': 1,
                'budget.budgetTotal': 1
            }
        }, {
            $group: {
                _id         : '$_id',
                salesmanager: {
                    $addToSet: '$salesmanager'
                },

                projectTeam: {
                    $push: '$budget.projectTeam'
                },

                budgetTotal: {
                    $addToSet: '$budget.budgetTotal'
                },

                name: {
                    $addToSet: '$name'
                }
            }
        }, {
            $project: {
                _id                 : 1,
                salesmanager        : {$arrayElemAt: ['$salesmanager', 0]},
                name                : {$arrayElemAt: ['$name', 0]},
                'budget.projectTeam': '$projectTeam',
                'budget.budgetTotal': '$budgetTotal'
            }
        }, {
            $sort: sort
        }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            collection = result;

            collection.forEach(function (project) {
                var totalInPr = 0;
                var totalFinished = 0;
                var total = 0;
                var totalObj = {};
                var jobs = (project.budget && project.budget.projectTeam) ? project.budget.projectTeam : [];
                var minDate;
                var maxDate;
                var min;
                var max;
                var parallelTasks;

                project.total = {};

                totalObj.totalInPr = 0;
                totalObj.totalNew = 0;
                totalObj.totalFinished = 0;
                totalObj.total = 0;
                totalObj.revenueSum = 0;
                totalObj.costSum = 0;
                totalObj.profitSum = 0;
                totalObj.hoursSum = 0;
                totalObj.markUp = 0;
                totalObj.radio = 0;
                minDate = 1000000;
                maxDate = 0;
                /*                totalObj.rateSum = {
                 byDev: 0,
                 byQA : 0
                 };*/

                jobs.forEach(function (job) {
                    var jobBudgetTotal = job.budget.budgetTotal;

                    if (job.workflow.name === 'In Progress') {
                        totalInPr += jobBudgetTotal ? jobBudgetTotal.costSum : 0;
                    } else if (job.workflow.name === 'Finished') {
                        totalFinished += jobBudgetTotal.costSum;
                    }

                    if (jobBudgetTotal && jobBudgetTotal.minDate) {
                        if (jobBudgetTotal.minDate <= minDate) {
                            totalObj.minDate = jobBudgetTotal.minDate;
                            minDate = totalObj.minDate;
                        }
                    }

                    if (jobBudgetTotal && jobBudgetTotal.maxDate) {
                        if (jobBudgetTotal.maxDate >= maxDate) {
                            totalObj.maxDate = jobBudgetTotal.maxDate;
                            maxDate = totalObj.maxDate;
                        }
                    }

                    total += jobBudgetTotal ? jobBudgetTotal.costSum : 0;

                    totalObj.revenueSum += jobBudgetTotal ? jobBudgetTotal.revenueSum : 0;
                    totalObj.costSum += jobBudgetTotal ? jobBudgetTotal.costSum : 0;

                    if (jobBudgetTotal && jobBudgetTotal.revenueSum) {
                        if (jobBudgetTotal.costSum) {
                            totalObj.profitSum += jobBudgetTotal.revenueSum - jobBudgetTotal.costSum;
                        } else {
                            totalObj.profitSum += jobBudgetTotal.revenueSum;
                        }
                    } else {
                        totalObj.profitSum = 0;
                    }
                    totalObj.hoursSum += jobBudgetTotal ? jobBudgetTotal.hoursSum : 0;
                });

                totalObj.totalInPr = totalInPr;
                totalObj.totalFinished = totalFinished;
                totalObj.total = total;

                totalObj.markUp = ((totalObj.profitSum / totalObj.costSum) * 100);

                if (!isFinite(totalObj.markUp)) {
                    totalObj.markUp = 0;
                }

                totalObj.radio = ((totalObj.profitSum / totalObj.revenueSum) * 100);

                if (!isFinite(totalObj.radio)) {
                    totalObj.radio = 0;
                }

                project.total = totalObj;
                min = totalObj.minDate;
                max = totalObj.maxDate;

                function getMinWTrack(cb) {
                    var newDate;
                    var wTrack;
                    var i;
                    var day;

                    WTrack.find({
                        project   : 'project._id',
                        dateByWeek: min
                    }).sort({worked: -1}).exec(function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        wTrack = result ? result[0] : null;

                        if (wTrack) {
                            newDate = moment().year(wTrack.year).isoWeek(wTrack.week);

                            for (i = 1; i <= 7; i++) {
                                day = wTrack[i];
                                if (day) {
                                    break;
                                }
                            }

                            newDate = newDate.day(i);
                            cb(null, newDate);
                        }
                    });
                }

                function getMaxWTrack(cb) {
                    var wTrack;
                    var newDate;

                    WTrack.find({
                        project   : project._id,
                        dateByWeek: max
                    }).sort({worked: 1}).exec(function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        wTrack = result ? result[0] : null;

                        if (wTrack) {
                            newDate = moment().year(wTrack.year).isoWeek(wTrack.week);

                            if (wTrack['7']) {
                                newDate = newDate.day(7);
                                return cb(null, newDate);
                            } else if (wTrack['6']) {
                                newDate = newDate.day(6);
                                return cb(null, newDate);
                            } else if (wTrack['5']) {
                                newDate = newDate.day(5);
                                return cb(null, newDate);
                            } else if (wTrack['4']) {
                                newDate = newDate.day(4);
                                return cb(null, newDate);
                            } else if (wTrack['3']) {
                                newDate = newDate.day(3);
                                return cb(null, newDate);
                            } else if (wTrack['2']) {
                                newDate = newDate.day(2);
                                return cb(null, newDate);
                            } else if (wTrack['1']) {
                                newDate = newDate.day(1);
                                return cb(null, newDate);
                            }
                        }
                    });
                }

                parallelTasks = [getMinWTrack, getMaxWTrack];

                async.parallel(parallelTasks, function (err, result) {
                    var startDate = result[0];
                    var endDate = result[1];

                    Project.findByIdAndUpdate(project._id, {
                        $set: {
                            StartDate: startDate,
                            EndDate  : endDate
                        }
                    }, function () {

                    });
                });
            });

            if (collection[0].total.hasOwnProperty(key)) {

                collection.sort(function (a, b) {

                    var fieldA = a.total[key] || 0;
                    var fieldB = b.total[key] || 0;

                    if (sort[key] === 1) {
                        if (fieldA > fieldB) {
                            return 1;
                        }
                        if (fieldA < fieldB) {
                            return -1;
                        }
                        return 0;
                    }
                    if (fieldA < fieldB) {
                        return 1;
                    }
                    if (fieldA > fieldB) {
                        return -1;
                    }
                    return 0;
                });
            }

            data.data = collection;

            res.status(200).send(data);
        });
    };

    this.remove = function (req, res, next) {
        var Project = models.get(req.session.lastDb, projectCT, ProjectSchema);
        var _id = req.params.id;

        Project.findByIdAndRemove(_id, function (err) {
            if (err) {
                return next(err);
            }

            removeTasksByPorjectID(req, _id);

            res.status(200).send({success: 'Remove all tasks Starting...'});
        });
    };

    this.bulkRemove = function (req, res, next) {
        var Project = models.get(req.session.lastDb, projectCT, ProjectSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        // todo some validation on ids array, like check for objectId

        Project.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, projectCT, ProjectSchema);
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

    this.exportToXlsx = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Project = models.get(dbName, projectCT, ProjectSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type || 'Projects';
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {
                contentType: type
            });
        }

        options = {
            res         : res,
            next        : next,
            Model       : Project,
            map         : exportMap,
            returnResult: true,
            fileName    : type
        };

        function lookupForProject(cb) {
            var query = [];
            var i;

            for (i = 0; i < lookupForProjectArray.length; i++) {
                query.push(lookupForProjectArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        async.parallel([lookupForProject], function (err, result) {
            var resultArray = result[0];

            exporter.exportToXlsx({
                res        : res,
                next       : next,
                Model      : Project,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type
            });
        });

    };

    this.exportToCsv = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Project = models.get(dbName, projectCT, ProjectSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type || 'Project';
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {
                contentType: type
            });
        }

        options = {
            res         : res,
            next        : next,
            Model       : Project,
            map         : exportMap,
            returnResult: true,
            fileName    : type
        };

        function lookupForProject(cb) {
            var query = [];
            var i;

            for (i = 0; i < lookupForProjectArray.length; i++) {
                query.push(lookupForProjectArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        async.parallel([lookupForProject], function (err, result) {
            var resultArray = result[0];

            exporter.exportToCsv({
                res        : res,
                next       : next,
                Model      : Project,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type
            });
        });

    };

};

