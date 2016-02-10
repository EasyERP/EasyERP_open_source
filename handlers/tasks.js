var mongoose = require('mongoose');
var tasksSchema = mongoose.Schemas['Task'];
var department = mongoose.Schemas['Department'];
var projectSchema = mongoose.Schemas['Project'];
var prioritySchema = mongoose.Schemas['Priority'];
var objectId = mongoose.Types.ObjectId;
var _ = require('underscore');

var Tasks = function (models, event) {
    "use strict";
    var access = require("../Modules/additions/access.js")(models);
    var validator = require('../helpers/validator');

    //ToDo move validation logic to validator and use it

    this.createTask = function (req, res, next) {
        var body = req.body;
        body.uId = req.session.uId;
        var projectId = body.project;
        var TasksModel = models.get(req.session.lastDb, 'Tasks', tasksSchema);

        if (!validator.validTaskBody(body)) {
            err = new Error();
            err.status = 404;
            err.message = RESPONSES.PAGE_NOT_FOUND;

            return next(err);
        }

        TasksModel.find({project: projectId})
            .sort({taskCount: -1})
            .exec(function (err, tasks) {
                if (err) {
                    err.status = 404;
                    err.message = RESPONSES.PAGE_NOT_FOUND;

                    return next(err);
                }

                var n = (tasks[0]) ? ++tasks[0].taskCount : 1;
                body = validator.parseTaskBody(body);
                body.taskCount = n;

                var task = new TasksModel(body);

                event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), "sequence", 0, 0, task.workflow._id, task.workflow._id, true, false, function (sequence) {
                    task.sequence = sequence;
                    task.save(function (err, task) {
                        if (err) {
                            console.log(err);
                            res.send(500, {error: 'Task.save BD error'});
                        } else {
                            event.emit('updateContent', req, res, task.project, 'create', task);
                            res.send(201, {success: 'An new Task crate success', id: task._id});
                        }
                    });
                });
            });

    };

    this.taskUpdateOnlySelectedFields = function (req, res, next) {
        var _id = req.param('_id');
        var data = req.body;
        var fileName = data.fileName;
        var obj;

        delete data._id;
        delete data.createdBy;
        delete data.fileName;

        if (data.notes && data.notes.length != 0) {
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
        if (data.estimated && data.logged) {
            data['remaining'] = data.estimated - data.logged;
        }
        if (data && data.EndDate) {
            data.duration = returnDuration(data.StartDate, data.EndDate);
        }
        if (data.estimated && data.estimated != 0) {
            if (data.progress === 100) {
                data.progress = 100;
            } else {
                data.progress = Math.round((data.logged / data.estimated) * 100);
                var StartDate = (data.StartDate) ? new Date(data.StartDate) : new Date();
                data.EndDate = calculateTaskEndDate(StartDate, data.estimated);
                data.duration = returnDuration(data.StartDate, data.EndDate);
            }
        } else if (!data.estimated && data.logged) {
            data.progress = 0;
        }

        if (data.assignedTo && typeof (data.assignedTo) == 'object') {
            data.assignedTo = data.assignedTo._id;
        }
        if (data.customer && typeof (data.customer) == 'object') {
            data.customer = data.customer._id;
        }
        if (data.project) {
            event.emit('updateContent', req, res, data.project, 'update', _id, data);
        } else if (data.workflow) {
            sequenceUpdate();
        } else {
            updateTask();
        }
        function sequenceUpdate() {
            if (data.sequence == -1) {
                event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), "sequence", data.sequenceStart, data.sequence, data.workflowStart, data.workflowStart, false, true, function () {
                    event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), "sequence", data.sequenceStart, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;
                        if (data.workflow == data.workflowStart) {
                            data.sequence -= 1;
                        }
                        updateTask();
                    });
                });
            } else {
                event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), "sequence", data.sequenceStart, data.sequence, data.workflowStart, data.workflow, false, false, function (sequence) {
                    delete data.sequenceStart;
                    delete data.workflowStart;
                    data.sequence = sequence;
                    updateTask();
                });
            }
        }

        function updateTask() {
            models.get(req.session.lastDb, 'Tasks', tasksSchema).findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                if (!err) {
                    if (fileName) {
                        var os = require("os");
                        var osType = (os.type().split('_')[0]);
                        var path;
                        var dir;
                        var newDirname;
                        switch (osType) {
                            case "Windows":
                            {
                                newDirname = __dirname.replace("\\Modules", "");
                                while (newDirname.indexOf("\\") !== -1) {
                                    newDirname = newDirname.replace("\\", "\/");
                                }
                                path = newDirname + "\/uploads\/" + _id + "\/" + fileName;
                                dir = newDirname + "\/uploads\/" + _id;
                            }
                                break;
                            case "Linux":
                            {
                                newDirname = __dirname.replace("/Modules", "");
                                while (newDirname.indexOf("\\") !== -1) {
                                    newDirname = newDirname.replace("\\", "\/");
                                }
                                path = newDirname + "\/uploads\/" + _id + "\/" + fileName;
                                dir = newDirname + "\/uploads\/" + _id;
                            }
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
                } else {
                    res.send(500, {error: "Can't update Tasks"});
                    console.log(err);
                }

            });
        }
    };

    this.getTasks = function (req, res, next) {
        var data = req.query;
        var viewType = req.params.viewType;
        switch (viewType) {
            case "form":
                getTaskById(req, data, res);
                break;
            case "list":
                getTasksForList(req, data, res);
                break;
            case "kanban":
                getTasksForKanban(req, data, res);
                break;
        }
        ;
        function getTaskById(req, data, response) {
            var query = models.get(req.session.lastDb, 'Tasks', tasksSchema).findById(data.id);
            query.populate('project', '_id projectShortDesc projectName').populate(' assignedTo', '_id name imageSrc').populate('createdBy.user').populate('createdBy.user').populate('editedBy.user').populate('groups.users').populate('groups.group').populate('workflow').exec(function (err, task) {
                if (err) {
                    console.log(err);
                    logWriter.log("Project.js getTasksByProjectId task.find " + err);
                    response.send(500, {error: "Can't find Tasks"});
                } else {
                    response.send(task);
                }
            });
        };
        function getTasksForList(req, data, response) {

            var skip = (parseInt(data.page ? data.page : 1) - 1) * parseInt(data.count);
            var limit = parseInt(data.count);
            var res = {};
            var obj = {};
            var addObj = {};
            var query;
            var keys;
            var arrOfObjectId;
            var sort;

            res['data'] = [];


            if (data.parrentContentId) {
                addObj['_id'] = objectId(data.parrentContentId);
            }
            models.get(req.session.lastDb, "Department", department).aggregate(
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
                    if (!err) {
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
                                                {whoCanRW: "everyOne"}
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
                            function (err, result) { // added aggregate function for filtration, sort moved to aggregate
                                if (!err) {
                                    obj = {'$and': [{'project._id': {$in: _.pluck(result, '_id')}}]};

                                    if (data && data.filter) {
                                        obj['$and'].push({$and: caseFilter(data.filter)});
                                    }

                                    if (data.sort) {
                                        keys = Object.keys(data.sort)[0];
                                        data.sort[keys] = parseInt(data.sort[keys]);
                                        sort = data.sort;
                                    } else {
                                        sort = {"editedBy.date": -1};
                                    }

                                    query = models.get(req.session.lastDb, 'Tasks', tasksSchema);

                                    query
                                        .aggregate([{
                                            $lookup: {
                                                from: "Employees",
                                                localField: "assignedTo",
                                                foreignField: "_id",
                                                as: "assignedTo"
                                            }
                                        }, {
                                            $lookup: {
                                                from: "Project",
                                                localField: "project",
                                                foreignField: "_id",
                                                as: "project"
                                            }
                                        }, {
                                            $lookup: {
                                                from: "Users",
                                                localField: "createdBy.user",
                                                foreignField: "_id",
                                                as: "createdBy.user"
                                            }
                                        }, {
                                            $lookup: {
                                                from: "Users",
                                                localField: "editedBy.user",
                                                foreignField: "_id",
                                                as: "editedBy.user"
                                            }
                                        }, {
                                            $lookup: {
                                                from: "workflows",
                                                localField: "workflow",
                                                foreignField: "_id",
                                                as: "workflow"
                                            }
                                        }, {
                                            $project: {
                                                _id: 1,
                                                summary: 1,
                                                type: 1,
                                                workflow: {$arrayElemAt: ["$workflow", 0]},
                                                assignedTo: {$arrayElemAt: ["$assignedTo", 0]},
                                                project: {$arrayElemAt: ["$project", 0]},
                                                'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                                                'editedBy.user': {$arrayElemAt: ["$editedBy.user", 0]},
                                                'createdBy.date': 1,
                                                'editedBy.date': 1,
                                                StartDate: 1,
                                                EndDate: 1,
                                                logged: 1,
                                                tags: 1,
                                                progress: 1,
                                                status: 1,
                                                estimated: 1,
                                                sequence: 1,
                                                taskCount: 1
                                            }
                                        }, {
                                            $project: {
                                                _id: 1,
                                                summary: 1,
                                                type: 1,
                                                workflow: 1,
                                                project: 1,
                                                assignedTo: 1,
                                                'createdBy.date': 1,
                                                'editedBy.date': 1,
                                                'createdBy.user': 1,
                                                'editedBy.user': 1,
                                                StartDate: 1,
                                                EndDate: 1,
                                                logged: 1,
                                                tags: 1,
                                                progress: 1,
                                                status: 1,
                                                estimated: 1,
                                                sequence: 1,
                                                taskCount: 1
                                            }
                                        }, {
                                            $match: obj
                                        }, {
                                            $sort: sort
                                        }, {
                                            $skip: skip
                                        }, {
                                            $limit: limit
                                        }], function (err, tasks) {
                                            if (err) {
                                                return console.log(err);
                                            }

                                            res['data'] = tasks;
                                            response.send(res);
                                        });
                                } else {
                                    logWriter.log("Projects.js getTasksForList task.find " + err);
                                    response.send(500, {error: "Can't find Projects"});
                                }
                            });

                    } else {
                        console.log(err);
                    }
                }
            );
        };
        function getTasksForKanban(req, data, response) {
            var res = {};
            var startTime = new Date();

            res['data'] = [];
            res['workflowId'] = data.workflowId;
            var addObj = {};
            if (data.parrentContentId) {
                addObj['_id'] = objectId(data.parrentContentId);
            }

            models.get(req.session.lastDb, "Department", department).aggregate(
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
                    if (!err) {
                        var arrOfObjectId = deps.objectID();
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
                                                {whoCanRW: "everyOne"}
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
                                if (!err) {
                                    var query = models.get(req.session.lastDb, 'Tasks', tasksSchema).where('project').in(projectsId.objectID()).where('workflow', objectId(data.workflowId));

                                    if (data.filter && data.filter.type) {
                                        query.where('type').in(data.filter.type);
                                    }

                                    query.select("_id assignedTo workflow editedBy.date project taskCount summary type remaining priority sequence").populate('assignedTo', 'name').populate('project', 'projectShortDesc').sort({'sequence': -1}).limit(req.session.kanbanSettings.tasks.countPerPage).exec(function (err, result) {
                                        if (!err) {
                                            var localRemaining = 0;
                                            result.forEach(function (value) {
                                                localRemaining = localRemaining + value.remaining;
                                            });
                                            res['remaining'] = localRemaining;
                                            res['data'] = result;
                                            res['time'] = (new Date() - startTime);
                                            res['fold'] = (req.session.kanbanSettings.tasks.foldWorkflows && req.session.kanbanSettings.tasks.foldWorkflows.indexOf(data.workflowId.toString()) !== -1);
                                            response.send(res);
                                        } else {
                                            logWriter.log("Projects.js getTasksForKanban task.find" + err);
                                            response.send(500, {error: "Can't find Tasks"});
                                        }
                                    });
                                } else {
                                    logWriter.log("Projects.js getTasksForKanban task.find " + err);
                                    response.send(500, {error: "Can't group Tasks"});
                                }
                            });
                    } else {
                        console.log(err);
                    }
                });
        };
    };

    this.removeTask = function (req, res, next) {
        var _id = req.param('_id');
        models.get(req.session.lastDb, 'Tasks', tasksSchema).findById(_id, function (err, task) {
            if (err) {
                logWriter.log("Project.js remove task.remove " + err);
                res.send(500, {error: "Can't remove Task"});
            } else {
                models.get(req.session.lastDb, 'Tasks', tasksSchema).findByIdAndRemove(_id, function (err) {
                    if (err) {
                        console.log(err);
                        logWriter.log("Project.js remove task.remove " + err);
                        res.send(500, {error: "Can't remove Task"});
                    } else {
                        event.emit('updateContent', req, res, task.project, "remove");
                        event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), "sequence", task.sequence, 0, task.workflow, task.workflow, false, true);
                        res.send(200, {success: "Success removed"});
                    }
                });

            }
        });
    };

    this.getTasksPriority = function (req, res, next) {
        var response = {};
        response['data'] = [];
        models.get(req.session.lastDb, 'Priority', prioritySchema).find({}, function (err, _priority) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getTasksPriority priority.find " + err);
                res.send(500, {error: "Can't find Priority"});
            } else {
                response['data'] = _priority;
                res.send(response);
            }
        });
    };

    this.getLengthByWorkflows = function (req, res, next) {
        var options = {};
        for (var i in req.query) {
            options[i] = req.query[i];
        }
        var data = {};
        data['showMore'] = false;
        var addObj = {};
        if (options.parrentContentId) {
            addObj['_id'] = objectId(options.parrentContentId);
        }
        models.get(req.session.lastDb, "Department", department).aggregate(
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
                if (!err) {
                    var arrOfObjectId = deps.objectID();

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
                                            {whoCanRW: "everyOne"}
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
                            if (!err) {
                                var arrayOfProjectsId = projectsId.objectID();
                                models.get(req.session.lastDb, 'Tasks', tasksSchema).aggregate(
                                    {
                                        $match: {
                                            project: {$in: arrayOfProjectsId}
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            workflow: 1,
                                            remaining: 1
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: "$workflow",
                                            count: {$sum: 1},
                                            totalRemaining: {$sum: '$remaining'}
                                        }
                                    },
                                    function (err, responseTasks) {
                                        if (!err) {
                                            responseTasks.forEach(function (object) {
                                                if (object.count > req.session.kanbanSettings.tasks.countPerPage) {
                                                    data['showMore'] = true;
                                                }
                                            });
                                            data['arrayOfObjects'] = responseTasks;
                                            res.send(data);
                                        } else {
                                            console.log(err);
                                        }
                                    }
                                );
                            } else {
                                console.log(err);
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    }

    //ToDo refactor and move this to helpers (and pull out from everywhere)
    var calculateTaskEndDate = function (startDate, estimated) {
        var iWeeks, iDateDiff, iAdjust = 0;

        estimated = estimated * 1000 * 60 * 60;              // estimated in ticks

        var endDate = startDate.getTime() + estimated;
        endDate = new Date(endDate);

        if (endDate < startDate) {
            return -1;
        }                 // error code if dates transposed

        var iWeekday1 = startDate.getDay();                // day of week
        var iWeekday2 = endDate.getDay();

        iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1;   // change Sunday from 0 to 7
        iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;

        if ((iWeekday1 <= 5) && (iWeekday2 <= 5) && (iWeekday1 > iWeekday2)) {
            iAdjust = 1;
        }  // adjustment if both days on weekend

        iWeekday1 = (iWeekday1 <= 5) ? 0 : 1;    // only count weekdays
        iWeekday2 = (iWeekday2 <= 5) ? 0 : 1;
        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((endDate.getTime() - startDate.getTime()) / 604800000);

        if (iWeekday1 < iWeekday2) {
            iDateDiff = (iWeeks * 2) + 2 * (iWeekday2 - iWeekday1);
        } else if ((iWeekday1 == iWeekday2) && (iWeekday1 == 0)) {
            iDateDiff = (iWeeks * 2) + 2 * iAdjust;
        } else {
            iDateDiff = (iWeeks * 2) + 2 * (iWeekday1 - iWeekday2);
        }

        //iDateDiff++;
        iDateDiff = iDateDiff * 1000 * 60 * 60 * 24;
        endDate = endDate.getTime() + iDateDiff;
        endDate = new Date(endDate);

        return endDate;
    };

    //ToDo refactor and move this to helpers (and pull out from everywhere)
    var returnDuration = function (StartDate, EndDate) {
        var days = 0;
        if (StartDate && EndDate) {
            var startDate = new Date(StartDate);
            var endDate = new Date(EndDate);
            var tck = endDate - startDate;
            var realDays = (((tck / 1000) / 60) / 60) / 8;

            days = realDays.toFixed(1);
        }
        return days;
    };
};

module.exports = Tasks;