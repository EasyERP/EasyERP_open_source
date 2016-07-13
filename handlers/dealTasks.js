/*TODO remove caseFilter methid after testing filters*/

var mongoose = require('mongoose');
var RESPONSES = require('../constants/responses');
var tasksSchema = mongoose.Schemas.DealTasks;
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
        var dealId = body.deal;
        var TasksModel = models.get(req.session.lastDb, 'DealTasks', tasksSchema);

        body.uId = req.session.uId;

        TasksModel.find({deal: dealId})
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

                event.emit('updateSequence', TasksModel, 'sequence', 0, 0, task.workflow, task.workflow, true, false, function (sequence) {
                    task.sequence = sequence;
                    task.save(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(201).send({success: 'New Task created success', id: result._id});
                    });
                });
            });

    };

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'DealTasks', tasksSchema);
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

        delete data._id;

        function updateTask() {
            models.get(req.session.lastDb, 'DealTasks', tasksSchema).findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {

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
                event.emit('updateSequence', models.get(req.session.lastDb, 'DealTasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflowStart, data.workflowStart, false, true, function () {
                    event.emit('updateSequence', models.get(req.session.lastDb, 'DealTasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;
                        if (data.workflow === data.workflowStart) {
                            data.sequence -= 1;
                        }
                        updateTask();
                    });
                });
            } else {
                event.emit('updateSequence', models.get(req.session.lastDb, 'DealTasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflowStart, data.workflow, false, false, function (sequence) {
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
            obj.date = new Date();
            if (!obj.author) {
                obj.author = req.session.uName;
            }
            data.notes[data.notes.length - 1] = obj;
        }

        if (data.assignedTo && typeof (data.assignedTo) === 'object') {
            data.assignedTo = data.assignedTo._id;
        }
        if (data.customer && typeof (data.customer) === 'object') {
            data.customer = data.customer._id;
        }
        if (data.workflow) {
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
        var query;
        var filter = data.filter || {};
        var or;
        var filterObj = {};
        var optionsObject = {};

        var filterMapper = new FilterMapper();

        responseData.workflowId = data.workflowId;

        if (data.parrentContentId) {
            addObj._id = objectId(data.parrentContentId);
        }

        query = models.get(req.session.lastDb, 'DealTasks', tasksSchema).where('workflow', objectId(data.workflowId));

        if (data && Object.keys(filter).length) {
            optionsObject.$and = [];
            optionsObject.$and.push(filterMapper.mapFilter(filter, 'DealTasks'));
        }

        query.find(optionsObject)
            .select('_id assignedTo deal workflow editedBy.date taskCount sequence dueDate description')
            .populate('assignedTo', 'name')
            .populate('workflow', 'name sequence status')
            .populate('deal', 'name')
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
                responseData.data = result;
                responseData.total = result.length;
                responseData.time = (new Date() - startTime);
                res.send(responseData);
            });

    }

    function getTaskById(req, res, next) {
        var data = req.query;
        var Tasks = models.get(req.session.lastDb, 'DealTasks', tasksSchema);

        Tasks.findById(data.id)
            .populate('deal', '_id name')
            .populate('company', '_id name')
            .populate('contact', '_id name')
            .populate(' assignedTo', '_id name imageSrc')
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
        var Task = models.get(req.session.lastDb, 'DealTasks', tasksSchema);
        var filterMapper = new FilterMapper();

        var keys;
        var sort;

        if (data.parrentContentId) {
            addObj._id = objectId(data.parrentContentId);
        }

        if (data && data.filter) {
            obj.$and = [];
            obj.$and.push(filterMapper.mapFilter(data.filter, 'DealTasks'));
        }

        if (data.sort) {
            keys = Object.keys(data.sort)[0];
            data.sort[keys] = parseInt(data.sort[keys], 10);
            sort = data.sort;
        } else {
            sort = {'dueDate': -1};
        }

        Task
            .aggregate([{
                $match: obj
            },
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
                        from        : 'Customers',
                        localField  : 'contact',
                        foreignField: '_id',
                        as          : 'contact'
                    }
                },
                {
                    $lookup: {
                        from        : 'Customers',
                        localField  : 'company',
                        foreignField: '_id',
                        as          : 'company'
                    }
                },
                {
                    $lookup: {
                        from        : 'Opportunities',
                        localField  : 'deal',
                        foreignField: '_id',
                        as          : 'deal'
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
                        workflow        : {$arrayElemAt: ['$workflow', 0]},
                        assignedTo      : {$arrayElemAt: ['$assignedTo', 0]},
                        description     : 1,
                        deal            : {$arrayElemAt: ['$deal', 0]},
                        contact         : {$arrayElemAt: ['$contact', 0]},
                        company         : {$arrayElemAt: ['$company', 0]},
                        dueDate         : 1,
                        sequence        : 1,
                        taskCount       : 1
                    }
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
                        workflow        : '$root.workflow',
                        assignedTo      : '$root.assignedTo',
                        description     : '$root.description',
                        dueDate         : '$root.dueDate',
                        taskCount       : '$root.taskCount',
                        company         : '$root.company',
                        contact         : '$root.contact',
                        deal            : '$root.deal',
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
        var Model = models.get(req.session.lastDb, 'DealTasks', tasksSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            Model.findByIdAndRemove(id, function (err, task) {
                if (err) {
                    return err(err);
                }

                event.emit('updateSequence', models.get(req.session.lastDb, 'DealTasks', tasksSchema), 'sequence', task.sequence, 0, task.workflow, task.workflow, false, true);

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
        var DealTask = models.get(req.session.lastDb, 'DealTasks', tasksSchema);

        DealTask.findByIdAndRemove(_id, function (err, task) {
            if (err) {
                return next(err);
            }

            event.emit('updateContent', req, res, task.project, 'remove');
            event.emit('updateSequence', DealTask, 'sequence', task.sequence, 0, task.workflow, task.workflow, false, true);
            res.send(200, {success: 'Success removed'});
        });
    };

    this.getFilterValues = function (req, res, next) {
        var task = models.get(req.session.lastDb, 'DealTasks', tasksSchema);

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
        var Tasks = models.get(req.session.lastDb, 'DealTasks', tasksSchema);
        var data = {};
        var addObj = {};

        data.showMore = false;

        if (options.parrentContentId) {
            addObj._id = objectId(options.parrentContentId);
        }

        Tasks.aggregate(
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


    };

};

module.exports = Module;
