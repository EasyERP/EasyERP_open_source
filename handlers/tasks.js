var mongoose = require('mongoose');
var RESPONSES = require('../constants/responses');
var tasksSchema = mongoose.Schemas.Task;
var department = mongoose.Schemas.Department;
var projectSchema = mongoose.Schemas.Project;
var prioritySchema = mongoose.Schemas.Priority;
var objectId = mongoose.Types.ObjectId;
var _ = require('underscore');
var async = require('async');

var Module = function (models, event) {
    'use strict';

    var validator = require('../helpers/validator');

    var fs = require('fs');
    var path = require('path');
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();
    var FilterMapper = require('../helpers/filterMapper');

    this.createTask = function (req, res, next) {
        var body = req.body;
        var error;
        var projectId = body.project;
        var TasksModel = models.get(req.session.lastDb, 'Tasks', tasksSchema);

        body.uId = req.session.uId;

        if (!validator.validTaskBody(body)) {
            error = new Error();
            error.status = 404;
            error.message = RESPONSES.PAGE_NOT_FOUND;

            return next(error);
        }

        TasksModel.find({project: projectId})
            .sort({taskCount: -1})
            .exec(function (err, tasks) {
                var n;
                var task;

                if (err) {
                    return next(err);
                }

                n = (tasks[0]) ? ++tasks[0].taskCount : 1;
                body = validator.parseTaskBody(body);
                body.taskCount = n;

                task = new TasksModel(body);

                event.emit('updateSequence', TasksModel, 'sequence', 0, 0, task.workflow._id, task.workflow._id, true, false, function (sequence) {
                    task.sequence = sequence;
                    task.save(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        event.emit('updateContent', req, res, result.project, 'create', result);
                        res.status(201).send({success: 'New Task created success', id: result._id});
                    });
                });
            });

    };

    // ToDo refactor and move this to helpers (and pull out from everywhere)
    function calculateTaskEndDate(startDate, estimated) {
        var iWeeks = 0;
        var iDateDiff = 0;
        var iAdjust = 0;
        var endDate;
        var iWeekday1;
        var iWeekday2;

        estimated = estimated * 1000 * 60 * 60;              // estimated in ticks

        endDate = startDate.getTime() + estimated;
        endDate = new Date(endDate);

        if (endDate < startDate) {
            return -1;
        }                 // error code if dates transposed

        iWeekday1 = startDate.getDay();                // day of week
        iWeekday2 = endDate.getDay();

        iWeekday1 = (iWeekday1 === 0) ? 7 : iWeekday1;   // change Sunday from 0 to 7
        iWeekday2 = (iWeekday2 === 0) ? 7 : iWeekday2;

        if ((iWeekday1 <= 5) && (iWeekday2 <= 5) && (iWeekday1 > iWeekday2)) {
            iAdjust = 1;
        }  // adjustment if both days on weekend

        iWeekday1 = (iWeekday1 <= 5) ? 0 : 1;    // only count weekdays
        iWeekday2 = (iWeekday2 <= 5) ? 0 : 1;
        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((endDate.getTime() - startDate.getTime()) / 604800000);

        if (iWeekday1 < iWeekday2) {
            iDateDiff = (iWeeks * 2) + 2 * (iWeekday2 - iWeekday1);
        } else if ((iWeekday1 === iWeekday2) && (iWeekday1 === 0)) {
            iDateDiff = (iWeeks * 2) + 2 * iAdjust;
        } else {
            iDateDiff = (iWeeks * 2) + 2 * (iWeekday1 - iWeekday2);
        }

        // iDateDiff++;
        iDateDiff = iDateDiff * 1000 * 60 * 60 * 24;
        endDate = endDate.getTime() + iDateDiff;
        endDate = new Date(endDate);

        return endDate;
    }

    // ToDo refactor and move this to helpers (and pull out from everywhere)
    function returnDuration(StartDate, EndDate) {
        var days = 0;
        var tck;
        var realDays;

        if (StartDate && EndDate) {
            StartDate = new Date(StartDate);
            EndDate = new Date(EndDate);
            tck = EndDate - StartDate;
            realDays = (((tck / 1000) / 60) / 60) / 8;
            days = realDays.toFixed(1);
        }

        return days;
    }

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Tasks', tasksSchema);
        var headers = req.headers;
        var id = headers.modelid || 'empty';
        var contentType = headers.modelname || 'tasks';
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

                res.status(200).send({success: 'Tasks updated success', data: response});
            });
        });
    };

    this.taskUpdateOnlySelectedFields = function (req, res, next) {
        var _id = req.params._id;
        var data = req.body;
        var fileName = data.fileName;
        var obj;
        var StartDate;

        delete data._id;
        delete data.createdBy;
        delete data.fileName;

        function updateTask() {
            models.get(req.session.lastDb, 'Tasks', tasksSchema).findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {

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
                res.send(200, {success: 'Tasks updated', notes: result.notes, sequence: result.sequence});
            });
        }

        function sequenceUpdate() {
            if (data.sequence === -1) {
                event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflowStart, data.workflowStart, false, true, function () {
                    event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;
                        if (data.workflow === data.workflowStart) {
                            data.sequence -= 1;
                        }
                        updateTask();
                    });
                });
            } else {
                event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflowStart, data.workflow, false, false, function (sequence) {
                    delete data.sequenceStart;
                    delete data.workflowStart;
                    data.sequence = sequence;
                    updateTask();
                });
            }
        }

        if (data.notes && data.notes.length !== 0) {
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
        if (data.estimated && data.logged) {
            data.remaining = data.estimated - data.logged;
        }
        if (data && data.EndDate) {
            data.duration = returnDuration(data.StartDate, data.EndDate);
        }
        if (data.estimated && data.estimated !== 0) {
            if (data.progress !== 100) {
                data.progress = Math.round((data.logged / data.estimated) * 100);
                StartDate = (data.StartDate) ? new Date(data.StartDate) : new Date();
                data.EndDate = calculateTaskEndDate(StartDate, data.estimated);
                data.duration = returnDuration(data.StartDate, data.EndDate);
            }
        } else if (!data.estimated && data.logged) {
            data.progress = 0;
        }

        if (data.assignedTo && typeof (data.assignedTo) === 'object') {
            data.assignedTo = data.assignedTo._id;
        }
        if (data.customer && typeof (data.customer) === 'object') {
            data.customer = data.customer._id;
        }
        if (data.project) {
            event.emit('updateContent', req, res, data.project, 'update', _id, data);
        } else if (data.workflow) {
            sequenceUpdate();
        } else {
            updateTask();
        }
    };

    function getTasksForKanban(req, res, next) {
        var startTime = new Date();
        var data = req.query;
        var responseData = {};
        var addObj = {};

        responseData.workflowId = data.workflowId;

        if (data.parrentContentId) {
            addObj._id = objectId(data.parrentContentId);
        }

        models.get(req.session.lastDb, 'Department', department).aggregate(
            {
                $match: {
                    users: objectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                var arrOfObjectId;
                if (err) {
                    return next(err);
                }

                arrOfObjectId = deps.objectID();

                models.get(req.session.lastDb, 'Project', projectSchema).aggregate(
                    {
                        $match: {
                            $and: [
                                addObj,
                                {
                                    $or: [
                                        {
                                            $or: [
                                                {
                                                    $and: [
                                                        {whoCanRW: 'group'},
                                                        {'groups.users': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'group'},
                                                        {'groups.group': {$in: arrOfObjectId}}
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            $and: [
                                                {whoCanRW: 'owner'},
                                                {'groups.owner': objectId(req.session.uId)}
                                            ]
                                        },
                                        {whoCanRW: 'everyOne'}
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            _id: 1
                        }
                    },
                    function (err, projectsId) {
                        var query;

                        if (err) {
                            return next(err);
                        }

                        query = models.get(req.session.lastDb, 'Tasks', tasksSchema).where('project').in(projectsId.objectID()).where('workflow', objectId(data.workflowId));

                        if (data.filter && data.filter.type) {
                            query.where('type').in(data.filter.type);
                        }

                        query.select('_id assignedTo workflow editedBy.date project taskCount summary type remaining priority sequence')
                            .populate('assignedTo', 'name')
                            .populate('project', 'projectShortDesc')
                            .sort({sequence: -1})
                            .limit(req.session.kanbanSettings.tasks.countPerPage)
                            .exec(function (err, result) {
                                var localRemaining = 0;

                                if (err) {
                                    return next(err);
                                }

                                result.forEach(function (value) {
                                    localRemaining = localRemaining + value.remaining;
                                });

                                responseData.remaining = localRemaining;
                                responseData.data = result;
                                responseData.total = result.length;
                                responseData.time = (new Date() - startTime);
                                responseData.fold = (req.session.kanbanSettings.tasks.foldWorkflows && req.session.kanbanSettings.tasks.foldWorkflows.indexOf(data.workflowId.toString()) !== -1);
                                res.send(responseData);
                            });
                    });

            });
    }

    function getTaskById(req, res, next) {
        var data = req.query;
        var Tasks = models.get(req.session.lastDb, 'Tasks', tasksSchema);

        Tasks.findById(data.id)
            .populate('project', '_id projectShortDesc name')
            .populate(' assignedTo', '_id name imageSrc')
            .populate('createdBy.user')
            .populate('createdBy.user')
            .populate('editedBy.user')
            .populate('groups.users')
            .populate('groups.group')
            .populate('workflow')
            .exec(function (err, task) {
                if (err) {
                    next(err);
                }
                res.status(200).send(task);
            });
    }

    function getTasksForList(req, res, next) {
        var data = req.query;
        var limit = parseInt(data.count, 10);
        var skip = (parseInt(data.page || 1, 10) - 1) * limit;
        var obj = {};
        var addObj = {};
        var Task = models.get(req.session.lastDb, 'Tasks', tasksSchema);
        var filterMapper = new FilterMapper();

        var keys;
        var arrOfObjectId;
        var sort;

        if (data.parrentContentId) {
            addObj._id = objectId(data.parrentContentId);
        }

        models.get(req.session.lastDb, 'Department', department).aggregate(
            {
                $match: {
                    users: objectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (err) {
                    return next(err);
                }

                arrOfObjectId = deps.objectID();

                models.get(req.session.lastDb, 'Project', projectSchema).aggregate(
                    {
                        $match: {
                            $and: [
                                addObj,
                                {
                                    $or: [
                                        {
                                            $or: [
                                                {
                                                    $and: [
                                                        {whoCanRW: 'group'},
                                                        {'groups.users': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'group'},
                                                        {'groups.group': {$in: arrOfObjectId}}
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            $and: [
                                                {whoCanRW: 'owner'},
                                                {'groups.owner': objectId(req.session.uId)}
                                            ]
                                        },
                                        {whoCanRW: 'everyOne'}
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            _id: 1
                        }
                    },
                    function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        obj = {$and: [{'project._id': {$in: _.pluck(result, '_id')}}]};

                        if (data && data.filter) {
                            obj.$and.push(filterMapper.mapFilter(data.filter, {contentType: 'Tasks'}));
                        }

                        if (data.sort) {
                            keys = Object.keys(data.sort)[0];
                            data.sort[keys] = parseInt(data.sort[keys], 10);
                            sort = data.sort;
                        } else {
                            sort = {'editedBy.date': -1};
                        }

                        Task
                            .aggregate([
                                {
                                    $lookup: {
                                        from        : 'Employees',
                                        localField  : 'assignedTo',
                                        foreignField: '_id',
                                        as          : 'assignedTo'
                                    }
                                },
                                {
                                    $lookup: {
                                        from        : 'Project',
                                        localField  : 'project',
                                        foreignField: '_id',
                                        as          : 'project'
                                    }
                                },
                                {
                                    $lookup: {
                                        from        : 'Users',
                                        localField  : 'createdBy.user',
                                        foreignField: '_id',
                                        as          : 'createdBy.user'
                                    }
                                },
                                {
                                    $lookup: {
                                        from        : 'Users',
                                        localField  : 'editedBy.user',
                                        foreignField: '_id',
                                        as          : 'editedBy.user'
                                    }
                                },
                                {
                                    $lookup: {
                                        from        : 'workflows',
                                        localField  : 'workflow',
                                        foreignField: '_id',
                                        as          : 'workflow'
                                    }
                                },
                                {
                                    $project: {
                                        _id             : 1,
                                        summary         : 1,
                                        type            : 1,
                                        workflow        : {$arrayElemAt: ['$workflow', 0]},
                                        assignedTo      : {$arrayElemAt: ['$assignedTo', 0]},
                                        project         : {$arrayElemAt: ['$project', 0]},
                                        'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                                        'editedBy.user' : {$arrayElemAt: ['$editedBy.user', 0]},
                                        'createdBy.date': 1,
                                        'editedBy.date' : 1,
                                        StartDate       : 1,
                                        EndDate         : 1,
                                        logged          : 1,
                                        tags            : 1,
                                        progress        : 1,
                                        status          : 1,
                                        estimated       : 1,
                                        sequence        : 1,
                                        taskCount       : 1
                                    }
                                },
                                {
                                    $match: obj
                                },
                                {
                                    $group: {
                                        _id  : null,
                                        total: {$sum: 1},
                                        root : {$push: '$$ROOT'}
                                    }
                                },
                                {
                                    $unwind: '$root'
                                },
                                {
                                    $project: {
                                        _id             : '$root._id',
                                        summary         : '$root.summary',
                                        type            : '$root.type',
                                        workflow        : '$root.workflow',
                                        assignedTo      : '$root.assignedTo',
                                        project         : '$root.project',
                                        'editedBy.user' : '$root.editedBy.user',
                                        'createdBy.user': '$root.createdBy.user',
                                        'editedBy.date' : '$root.editedBy.date',
                                        'createdBy.date': '$root.createdBy.date',
                                        StartDate       : '$root.StartDate',
                                        EndDate         : '$root.EndDate',
                                        logged          : '$root.logged',
                                        tags            : '$root.tags',
                                        progress        : '$root.progress',
                                        status          : '$root.status',
                                        estimated       : '$root.estimated',
                                        sequence        : '$root.sequence',
                                        taskCount       : '$root.taskCount',
                                        total           : 1
                                    }
                                },
                                {
                                    $sort: sort
                                }, {
                                    $skip: skip
                                }, {
                                    $limit: limit
                                }
                            ], function (err, result) {
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
                    });
            }
        );
    }

    this.getTasks = function (req, res, next) {
        var viewType = req.query.viewType;

        switch (viewType) {
            case 'form':
                getTaskById(req, res, next);
                break;
            case 'list':
                getTasksForList(req, res, next);
                break;
            default :
                getTasksForKanban(req, res, next);
                break;
        }

    };

    this.bulkRemove = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Tasks', tasksSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            Model.findByIdAndRemove(id, function (err, task) {
                if (err) {
                    return err(err);
                }

                event.emit('updateContent', req, res, task.project, 'remove');
                event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), 'sequence', task.sequence, 0, task.workflow, task.workflow, false, true);

                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });
    };

    this.removeTask = function (req, res, next) {
        var _id = req.params._id;

        models.get(req.session.lastDb, 'Tasks', tasksSchema).findByIdAndRemove(_id, function (err, task) {
            if (err) {
                return next(err);
            }

            event.emit('updateContent', req, res, task.project, 'remove');
            event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), 'sequence', task.sequence, 0, task.workflow, task.workflow, false, true);
            res.send(200, {success: 'Success removed'});
        });
    };

    this.getFilterValues = function (req, res, next) {
        var task = models.get(req.session.lastDb, 'Task', tasksSchema);

        task.aggregate([
            {
                $group: {
                    _id : null,
                    type: {
                        $addToSet: '$type'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getTasksPriority = function (req, res, next) {

        models.get(req.session.lastDb, 'Priority', prioritySchema).find({}, function (err, _priority) {
            if (err) {
                return next(err);
            }

            res.send({data: _priority});
        });
    };

    this.getLengthByWorkflows = function (req, res, next) {
        var options = req.query;
        var Tasks = models.get(req.session.lastDb, 'Tasks', tasksSchema);
        var data = {};
        var addObj = {};

        data.showMore = false;

        if (options.parrentContentId) {
            addObj._id = objectId(options.parrentContentId);
        }

        models.get(req.session.lastDb, 'Department', department).aggregate([{ // toDo on accessRollHelper
            $match: {
                users: objectId(req.session.uId)
            }
        }, {
            $project: {
                _id: 1
            }
        }], function (err, deps) {
            var arrOfObjectId;
            if (err) {
                return next(err);
            }

            arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, 'Project', projectSchema).aggregate(
                {
                    $match: {
                        $and: [
                            addObj,
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.users': objectId(req.session.uId)}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.group': {$in: arrOfObjectId}}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    },
                                    {whoCanRW: 'everyOne'}
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                function (err, projectsId) {
                    var arrayOfProjectsId;

                    if (err) {
                        return next(err);
                    }

                    arrayOfProjectsId = projectsId.objectID();

                    Tasks.aggregate(
                        {
                            $match: {
                                project: {$in: arrayOfProjectsId}
                            }
                        },
                        {
                            $project: {
                                _id      : 1,
                                workflow : 1,
                                remaining: 1
                            }
                        },
                        {
                            $group: {
                                _id           : '$workflow',
                                count         : {$sum: 1},
                                totalRemaining: {$sum: '$remaining'}
                            }
                        },
                        function (err, responseTasks) {
                            if (err) {
                                return next(err);
                            }

                            responseTasks.forEach(function (object) {
                                if (object.count > req.session.kanbanSettings.tasks.countPerPage) {
                                    data.showMore = true;
                                }
                            });
                            data.arrayOfObjects = responseTasks;
                            res.send(data);
                        }
                    );

                });

        });
    };

};

module.exports = Module;
