var Project = function (models, event) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var objectId = mongoose.Types.ObjectId;
    var department = mongoose.Schemas['Department'];
    var workflow = mongoose.Schemas['workflow'];
    var tasksSchema = mongoose.Schemas['Task'];
    var projectSchema = mongoose.Schemas['Project'];
    var projectTypeSchema = mongoose.Schemas['projectType'];
    var prioritySchema = mongoose.Schemas['Priority'];
    var userSchema = mongoose.Schemas['User'];
    var fs = require('fs');
    var async = require('async');
    var _ = require('underscore');

    var CONSTANTS = require('../constants/mainConstants');

    event.on('updateContent', updateContent);//binding for Event

    function updateContent(request, response, projectId, eventType, tasks, data) {
        function updatePr(projectId) {
            models.get(request.session.lastDb, 'Tasks', tasksSchema).aggregate(
                {
                    $match: {project: projectId}
                },
                {
                    $group: {
                        _id     : "$project",
                        progress: {$sum: '$progress'},
                        count   : {$sum: 1},
                        endDate : {$max: '$EndDate'},
                        tasks   : {$addToSet: '$_id'}
                    }
                },
                function (err, result) {
                    if (err) {
                        console.log(err);
                        logWriter.log('updateContent in Projects module eventType="' + eventType + '" by ProjectId="' + projectId + '" error=' + err);
                        return;
                    } else {
                        var progress = 0;
                        var tasks = [];
                        var EndDate = null;

                        if (result.length !== 0) {
                            progress = (result[0].count !== 0) ? (result[0].progress / result[0].count) : 0;
                            tasks = result[0].tasks;
                            EndDate = result[0].endDate;
                        }

                        models.get(request.session.lastDb, 'Project', projectSchema).findByIdAndUpdate(projectId, {
                                $set: {
                                    task    : tasks,
                                    EndDate : EndDate,
                                    progress: progress
                                }
                            }, {new: true},
                            function (updateError) {
                                if (updateError) {
                                    console.log(updateError);
                                    logWriter.log('updateContent in Projects module eventType="' + eventType + '" by ProjectId="' + projectId + '" error=' + updateError);
                                }
                                return;
                            });
                    }
                });
        };
        switch (eventType) {
            case "create":
            {
                models.get(request.session.lastDb, 'Project', projectSchema).findById(projectId,
                    function (error, result) {
                        if (error) {
                            console.log(error);
                            logWriter.log('updateContent in Projects module eventType="' + eventType + '" by ProjectId="' + projectId + '" error=' + error);
                            response.send(500, {error: "Can't update Project"});
                        } else {
                            //tasks - singleTask, not array in this method
                            if (result) {
                                var updateCondition = {};
                                if (!result.EndDate || (result.EndDate < tasks.EndDate)) {
                                    updateCondition['EndDate'] = tasks.EndDate;
                                }
                                updateCondition['progress'] = (result.progress + tasks.progress) / (result.task.length + 1);
                                models.get(request.session.lastDb, 'Project', projectSchema).findByIdAndUpdate(
                                    projectId,
                                    {
                                        $set : updateCondition,
                                        $push: {task: tasks._id}
                                    }, {new: true},
                                    function (err) {
                                        if (err) {
                                            console.log(err);
                                            logWriter.log('updateContent in Projects module eventType="' + eventType + '" by ProjectId="' + projectId + '" error=' + err);
                                        }
                                        return;
                                    });
                            } else {
                                return;
                            }
                        }
                    });
            }
                break;
            case "remove":
            {
                updatePr(projectId);
            }
                break;
            case "update":
            {
                models.get(request.session.lastDb, 'Tasks', tasksSchema).findById(tasks, function (err, task) {
                    if (err) {
                        console.log(err);
                        logWriter.log('updateContent in Projects module eventType="' + eventType + '" by ProjectId="' + projectId + '" error=' + err);
                        response.send(500, {error: 'Task update error'});
                    } else if (task) {
                        var oldProjectId = task.project;
                        models.get(request.session.lastDb, 'Project', projectSchema).findByIdAndUpdate(oldProjectId,
                            {$pull: {task: task._id}}, {new: true},
                            function (findError) {
                                if (findError) {
                                    console.log(findError);
                                    logWriter.log('updateContent in Projects module eventType="' + eventType + '" by ProjectId="' + projectId + '" error=' + findError);
                                    response.send(500, {error: 'Task update error'});
                                }
                            });
                        var query = models.get(request.session.lastDb, 'Tasks', tasksSchema).find({project: projectId});
                        query.sort({taskCount: -1});
                        query.exec(function (error, _tasks) {
                            if (error) {
                                console.log(error);
                                logWriter.log("Project.js updateTask tasks.find doc.length === 0" + error);
                                res.send(500, {error: 'Task find error'});
                            } else {
                                if (!_tasks[0] || (task.project != projectId)) {
                                    var n = (_tasks[0]) ? ++_tasks[0].taskCount : 1;
                                    data.taskCount = n;
                                }
                                models.get(request.session.lastDb, 'Tasks', tasksSchema).findByIdAndUpdate(tasks, {
                                    $set: data
                                }, {new: true}, function (err, res) {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log('updateContent in Projects module eventType="' + eventType + '" by ProjectId="' + projectId + '" error=' + findError);
                                        response.send(500, {error: 'Task update error'});
                                    } else if (res) {
                                        updatePr(oldProjectId);
                                        updatePr(res.project);
                                        response.send(200, {success: 'Task update success'});
                                    } else {
                                        response.send(500, {error: 'Task update error'});
                                    }
                                });
                            }
                        });
                    } else {
                        response.send(204, {error: 'Task update error'});
                    }
                });
            }
        }
    };

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

    function create(req, data, res) {
        try {
            if (!data.projectName || !data.projectShortDesc) {
                logWriter.log('Project.create Incorrect Incoming Data');
                res.send(400, {error: 'Project.create Incorrect Incoming Data'});
                return;
            } else {
                models.get(req.session.lastDb, 'Project', projectSchema).find({projectName: data.projectName}, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log("Project.js create project.find " + error);
                        res.send(500, {error: 'Project.create find error'});
                    }
                    if (doc.length > 0) {
                        res.send(400, {error: 'An project with the same name already exists'});
                    } else if (doc.length === 0) {
                        saveProjectToBd(data);
                    }
                });
            }
            function saveProjectToBd(data) {
                try {
                    _project = new models.get(req.session.lastDb, 'Project', projectSchema)();
                    if (data.projectName) {
                        _project.projectName = data.projectName;
                    }
                    if (data.projectShortDesc) {
                        _project.projectShortDesc = data.projectShortDesc;
                    }
                    if (data.uId) {
                        var now = new Date();
                        _project.createdBy.user = data.uId;
                        _project.createdBy.date = now;
                        //uId for edited by field on creation
                        _project.editedBy.date = now;
                        _project.editedBy.user = data.uId;
                    }

                    if (data.task) {
                        _project.task = data.task;
                    }

                    if (data.description) {
                        _project.description = data.description;
                    }

                    if (data.groups) {
                        _project.groups = data.groups;
                    }
                    if (data.whoCanRW) {
                        _project.whoCanRW = data.whoCanRW;
                    }
                    if (data.StartDate) {
                        _project.StartDate = data.StartDate;
                    }
                    if (data.EndDate) {
                        _project.EndDate = data.EndDate;
                    }
                    if (data.TargetEndDate) {
                        _project.TargetEndDate = data.TargetEndDate;
                    }
                    if (data.sequence) {
                        _project.sequence = data.sequence;
                    }
                    if (data.parent) {
                        _project.parent = data.parent;
                    }
                    if (data.projecttype) {
                        _project.projecttype = data.projecttype;
                    }
                    if (data.workflow) {
                        _project.workflow = data.workflow;
                    }
                    if (data.customer) {
                        _project.customer = data.customer;
                    }
                    if (data.projectmanager) {
                        _project.projectmanager = data.projectmanager;
                    }

                    if (data.notes) {
                        _project.notes = data.notes;
                    }

                    if (data.health) {
                        _project.health = data.health;
                    }

                    if (data.bonus) {
                        _project.bonus = data.bonus;
                    }

                    _project.save(function (err, result) {
                        try {
                            if (err) {
                                console.log(err);
                                logWriter.log("Project.js saveProjectToDb _project.save" + err);
                                res.send(500, {error: 'Project.save BD error'});
                            } else {

                                if (result._id) {
                                    event.emit('updateProjectDetails', {req: req, _id: result._id});
                                }

                                event.emit('recollectProjectInfo');
                                res.send(201, {success: 'A new Project crate success', result: result, id: result._id});
                            }
                        }
                        catch (error) {
                            logWriter.log("Project.js create savetoBd _employee.save " + error);
                        }
                    });

                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Project.js create savetoDB " + error);
                    res.send(500, {error: 'Project.save  error'});
                }
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Project.js  " + Exception);
            res.send(500, {error: 'Project.save  error'});
        }
    };

    function getProjectStatusCountForDashboard(req, response) {
        models.get(req.session.lastDb, "Workflows", workflow).find({"wId": "Projects"}).select("_id name").exec(function (error, resWorkflow) {
            if (!error) {
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
                            models.get(req.session.lastDb, "Project", projectSchema).aggregate(
                                {
                                    $match: {
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
                                },
                                {
                                    $project: {
                                        _id: 1
                                    }
                                },
                                function (err, result) {
                                    if (!err) {
                                        var result1 = result.map(function (item) {
                                            return item._id
                                        });
                                        var query = models.get(req.session.lastDb, "Project", projectSchema).aggregate(
                                            {
                                                $match: {
                                                    "_id": {
                                                        $in: result1
                                                    }
                                                }
                                            },
                                            {
                                                $group: {
                                                    _id  : "$workflow._id",
                                                    count: {$sum: 1}

                                                }
                                            }
                                        )
                                        query.exec(function (error, _res) {
                                            if (!error) {
                                                res = {};
                                                res['data'] = _res;
                                                res['workflow'] = resWorkflow;
                                                response.send(res);
                                            } else {
                                                console.log(error);
                                            }
                                        });
                                    } else {
                                        console.log(err);
                                    }
                                }
                            );
                        } else {
                            console.log(error);
                        }
                    });
            }
        });

    };

    function getForDd(req, response, next) {
        var res = {};
        res['data'] = [];
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
                    models.get(req.session.lastDb, "Project", projectSchema).aggregate(
                        {
                            $match: {
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
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {
                                var query = models.get(req.session.lastDb, "Project", projectSchema).find().where('_id').in(result);
                                query.select("_id projectName projectShortDesc")
                                    .lean()
                                    .sort({'projectName': 1})
                                    .exec(function (error, _res) {
                                        if (!error) {
                                            res['data'] = _res;
                                            response.send(res);
                                        } else {
                                            next(error);
                                        }
                                    });
                            } else {
                                next(err);
                            }
                        }
                    );
                } else {
                    next(err);
                }
            });
    };

    function caseFilter(filter) {
        var condition = [];

        for (var key in filter) {   // added correct fields for Tasks and one new field Summary
            switch (key) {
                case 'workflow':
                    condition.push({'workflow._id': {$in: filter.workflow.value.objectID()}});
                    break;
                case 'project':
                    condition.push({'project._id': {$in: filter.project.value.objectID()}});
                    break;
                case 'customer':
                    condition.push({'customer._id': {$in: filter.customer.value.objectID()}});
                    break;
                case 'projectmanager':
                    condition.push({'projectmanager._id': {$in: filter.projectmanager.value.objectID()}});
                    break;
                case 'name':
                    condition.push({'_id': {$in: filter.name.value.objectID()}});
                    break;
                case 'summary':
                    condition.push({'_id': {$in: filter.summary.value.objectID()}});
                    break;
                case 'type':
                    condition.push({'type': {$in: filter.type.value}});
                    break;
                case 'assignedTo':
                    condition.push({'assignedTo._id': {$in: filter.assignedTo.value.objectID()}});
                    break;
            }
        }

        return condition;
    };

    function getProjectsForList(req, data, response) {
        var res = {};
        var Users = models.get(req.session.lastDb, 'Users', userSchema);
        var skip = (parseInt(data.page) - 1) * parseInt(data.count);
        var limit = parseInt(data.count);
        var sort;
        var obj = {};
        var query;
        var arrOfObjectId;
        var keys;

        res['data'] = [];

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
                if (err) {
                    return console.log(err);
                }

                arrOfObjectId = deps.objectID();

                models.get(req.session.lastDb, "Project", projectSchema).aggregate(
                    {
                        $match: {
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
                    },
                    {
                        $project: {
                            _id: 1
                        }
                    },
                    function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        obj = {'$and': [{_id: {$in: _.pluck(result, '_id')}}]};

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

                        query = models.get(req.session.lastDb, "Project", projectSchema);

                        query
                            .aggregate([{
                                $lookup: {
                                    from        : "Employees",
                                    localField  : "projectmanager",
                                    foreignField: "_id", as: "projectmanager"
                                }
                            }, {
                                $lookup: {
                                    from        : "Customers",
                                    localField  : "customer",
                                    foreignField: "_id", as: "customer"
                                }
                            }, {
                                $lookup: {
                                    from        : "workflows",
                                    localField  : "workflow",
                                    foreignField: "_id", as: "workflow"
                                }
                            }, {
                                $lookup: {
                                    from        : "Users",
                                    localField  : "createdBy.user",
                                    foreignField: "_id", as: "createdBy.user"
                                }
                            }, {
                                $lookup: {
                                    from        : "Users",
                                    localField  : "editedBy.user",
                                    foreignField: "_id", as: "editedBy.user"
                                }
                            }, {
                                $project: {
                                    /*notRemovable : {
                                        $size: {"$ifNull": [ "$budget.projectTeam", [] ]} // added check on field value null
                                    },*/
                                    projectmanager  : {$arrayElemAt: ["$projectmanager", 0]},
                                    workflow        : {$arrayElemAt: ["$workflow", 0]},
                                    customer        : {$arrayElemAt: ["$customer", 0]},
                                    'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                                    'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                                    'createdBy.date': 1,
                                    'editedBy.date' : 1,
                                    projectName     : 1,
                                    health          : 1,
                                    progress        : 1,
                                    StartDate       : 1,
                                    EndDate         : 1,
                                    TargetEndDate   : 1
                                }
                            }, {
                                $project: {
                                    projectmanager  : 1,
                                    notRemovable    : 1,
                                    workflow        : 1,
                                    projectName     : 1,
                                    health          : 1,
                                    customer        : 1,
                                    progress        : 1,
                                    StartDate       : 1,
                                    EndDate         : 1,
                                    TargetEndDate   : 1,
                                    'createdBy.date': 1,
                                    'editedBy.date' : 1,
                                    'createdBy.user': 1,
                                    'editedBy.user' : 1
                                }
                            }, {
                                $match: obj
                            }, {
                                $sort: sort
                            }, {
                                $skip: skip
                            }, {
                                $limit: limit
                            }], function (err, projects) {
                                if (err) {
                                    return console.log(err);
                                }

                                res['data'] = projects;
                                response.send(res);
                            });

                    }
                );
            });
    }

    function getProjectByEndDateForDashboard(req, response) {
        var res = {};
        res['data'] = [];
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        startDate.setHours(0, 0, 0, 0);

        var endDate = new Date();
        endDate.setDate(endDate.getDate() - endDate.getDay() + 28);
        endDate.setHours(24, 59, 59, 0);

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
                    models.get(req.session.lastDb, "Project", projectSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {'TargetEndDate': {$gte: startDate}},
                                    {'TargetEndDate': {$lte: endDate}},
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
                        function (err, result) {
                            if (!err) {
                                var query = models.get(req.session.lastDb, "Project", projectSchema).find().where('_id').in(result);
                                query.select("_id TargetEndDate projectmanager projectName health").
                                    // populate('projectmanager', 'name _id').
                                    exec(function (error, _res) {
                                        if (!error) {
                                            var endThisWeek = new Date();
                                            endThisWeek.setDate(endThisWeek.getDate() - endThisWeek.getDay() + 7);
                                            endThisWeek.setHours(24, 59, 59, 0);

                                            var endNextWeek = new Date();
                                            endNextWeek.setDate(endNextWeek.getDate() - endNextWeek.getDay() + 14);
                                            endNextWeek.setHours(24, 59, 59, 0);

                                            var ret = {"This": [], "Next": [], "Next2": []};
                                            for (var i = 0, n = _res.length; i < n; i++) {
                                                var d = new Date(_res[i].TargetEndDate);
                                                endDate.setDate(endDate.getDate() - endDate.getDay() + 7);
                                                if (d < endThisWeek) {
                                                    ret.This.push(_res[i]);
                                                }
                                                else {
                                                    if (d < endNextWeek) {
                                                        ret.Next.push(_res[i]);
                                                    }
                                                    else {
                                                        ret.Next2.push(_res[i]);
                                                    }

                                                }

                                            }

                                            res['data'] = ret;
                                            response.send(res);
                                        } else {
                                            console.log(error);
                                        }
                                    });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                }
            });
    }

    function get(req, data, response) {
        var skip = (parseInt(data.page ? data.page : 1) - 1) * parseInt(data.count);
        var limit = parseInt(data.count);
        var res = {};
        var qObj = {};

        res['data'] = [];
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

                    models.get(req.session.lastDb, "Project", projectSchema).aggregate(
                        {
                            $match: {
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
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        },
                        function (err, result) {
                            if (!err) {

                                qObj = {$and: [{_id: {$in: _.pluck(result, '_id')}}]};

                                if (data && data.filter) {
                                    qObj['$and'].push({$and: caseFilter(data.filter)});
                                }

                                var Project = models.get(req.session.lastDb, "Project", projectSchema);

                                Project
                                    .aggregate([{
                                        $lookup: {
                                            from        : "Employees",
                                            localField  : "projectmanager",
                                            foreignField: "_id", as: "projectmanager"
                                        }
                                    }, {
                                        $lookup: {
                                            from        : "Customers",
                                            localField  : "customer",
                                            foreignField: "_id", as: "customer"
                                        }
                                    }, {
                                        $lookup: {
                                            from        : "workflows",
                                            localField  : "workflow",
                                            foreignField: "_id", as: "workflow"
                                        }
                                    }, {
                                        $project: {
                                            projectName   : 1,
                                            workflow      : {$arrayElemAt: ["$workflow", 0]},
                                            task          : 1,
                                            customer      : {$arrayElemAt: ["$customer", 0]},
                                            health        : 1,
                                            projectmanager: {$arrayElemAt: ["$projectmanager", 0]}
                                        }
                                    }, {
                                        $project: {
                                            _id           : 1,
                                            projectName   : 1,
                                            task          : 1,
                                            workflow      : 1,
                                            projectmanager: 1,
                                            customer      : 1,
                                            health        : 1
                                        }
                                    }, {
                                        $match: qObj
                                    }, {
                                        $skip: skip
                                    }, {
                                        $limit: limit
                                    }], function (err, projects) {
                                        if (err) {
                                            return console.log(err);
                                        }

                                        res['data'] = projects;
                                        response.send(res);
                                    });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                }
            });

    };

    function getById(req, data, response) {
        var query = models.get(req.session.lastDb, 'Project', projectSchema).findById(data.id);

        query.populate('bonus.employeeId', '_id name')
            .populate('bonus.bonusId', '_id name value isPercent')
            .populate('createdBy.user', '_id login')
            .populate('editedBy.user', '_id login')
            .populate('groups.owner', '_id name')
            .populate('groups.users', '_id login')
            .populate('groups.group', '_id departmentName')
            .populate('groups.owner', '_id login')
            .populate('budget.projectTeam')
            .populate('projectmanager', '_id name fullName')
            .populate('customer', '_id name fullName')
            .populate('workflow', '_id name');

        query.exec(function (err, project) {
            if (err) {
                logWriter.log("Project.js getProjectById project.find " + err);
                response.send(500, {error: "Can't find Project"});
            } else {
                response.send(project);
            }
        });
    };

    function getTotalCount(req, response) {
        var query;
        var res = {};
        var data = {};
        var addObj = {};
        var obj = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        res['showMore'] = false;

        if (data && data.contentType !== 'Tasks' && data.filter) {

            addObj['$and'] = caseFilter(data.filter);

            /*for (var key in data.filter) {
             var condition = data.filter[key];

             switch (key) {
             case 'workflow':
             condition = condition.map(function (item) {
             return item === "null" ? null : item;
             });
             addObj['workflow'] = {$in: condition.objectID()};
             break;
             case 'project':
             addObj['projectName'] = {$in: condition};
             break;
             case 'startDate':
             addObj['StartDate'] = {$in: condition};
             break;
             case 'endDate':
             addObj['EndDate'] = {$in: condition};
             break;
             }
             }*/

            /* data.filter.workflow = data.filter.workflow.map(function (item) {
             return item === "null" ? null : item;
             });
             addObj['workflow'] = {$in: data.filter.workflow.objectID()};*/
        }

        if (data && data.parrentContentId) {
            addObj['$and'].push({_id: objectId(data.parrentContentId)});
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
                                    //  addObj,
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
                                models.get(req.session.lastDb, 'Project', projectSchema)
                                    .aggregate([{
                                        $lookup: {
                                            from        : "Employees",
                                            localField  : "projectmanager",
                                            foreignField: "_id", as: "projectmanager"
                                        }
                                    }, {
                                        $lookup: {
                                            from        : "Customers",
                                            localField  : "customer",
                                            foreignField: "_id", as: "customer"
                                        }
                                    }, {
                                        $lookup: {
                                            from        : "workflows",
                                            localField  : "workflow",
                                            foreignField: "_id", as: "workflow"
                                        }
                                    }, {
                                        $project: {
                                            projectName   : 1,
                                            workflow      : {$arrayElemAt: ["$workflow", 0]},
                                            task          : 1,
                                            customer      : {$arrayElemAt: ["$customer", 0]},
                                            health        : 1,
                                            projectmanager: {$arrayElemAt: ["$projectmanager", 0]}
                                        }
                                    }, {
                                        $project: {
                                            _id           : 1,
                                            projectName   : 1,
                                            task          : 1,
                                            workflow      : 1,
                                            projectmanager: 1,
                                            customer      : 1,
                                            health        : 1
                                        }
                                    }, {
                                        $match: addObj
                                    }], function (err, projects) {
                                        if (!err) {
                                            if (data && data.contentType === 'Tasks') {    // added aggregation function for filters in Tasks
                                                query = models.get(req.session.lastDb, 'Tasks', tasksSchema);
                                                obj = {'$and': [{'project._id': {$in: _.pluck(projects, '_id')}}]};

                                                if (data && data.filter) {
                                                    obj['$and'].push({$and: caseFilter(data.filter)});
                                                }

                                                query    // added for correct counting in filters in Tasks
                                                    .aggregate([{
                                                        $lookup: {
                                                            from        : "Employees",
                                                            localField  : "assignedTo",
                                                            foreignField: "_id",
                                                            as: "assignedTo"
                                                        }
                                                    }, {
                                                        $lookup: {
                                                            from        : "Project",
                                                            localField  : "project",
                                                            foreignField: "_id",
                                                            as: "project"
                                                        }
                                                    },  {
                                                        $lookup: {
                                                            from        : "workflows",
                                                            localField  : "workflow",
                                                            foreignField: "_id",
                                                            as: "workflow"
                                                        }
                                                    }, {
                                                        $project: {
                                                            _id             : 1,
                                                            summary         : 1,
                                                            project         : {$arrayElemAt: ["$project", 0]},
                                                            workflow        : {$arrayElemAt: ["$workflow", 0]},
                                                            assignedTo      : {$arrayElemAt: ["$assignedTo", 0]},
                                                            type            : 1
                                                        }
                                                    }, {
                                                        $project: {
                                                            _id             : 1,
                                                            summary         : 1,
                                                            project         : 1,
                                                            workflow        : 1,
                                                            assignedTo      : 1,
                                                            type            : 1
                                                        }
                                                    }, {
                                                        $match: obj
                                                    }], function (err, tasks) {
                                                        if (err) {
                                                            logWriter.log("Projects.js getListLength task.find" + err);
                                                            response.send(500, {error: "Can't find Tasks"});
                                                        }
                                                        if (data.currentNumber && data.currentNumber < result.length) {
                                                            res['showMore'] = true;
                                                        }

                                                        res['count'] = tasks.length;
                                                        response.send(res);
                                                    });
                                            } else {
                                                if (data.currentNumber && data.currentNumber < projects.length) {
                                                    res['showMore'] = true;
                                                }
                                                res['count'] = projects.length;
                                                response.send(res);
                                            }
                                        } else {
                                            logWriter.log("Projects.js getListLength task.find " + err);
                                            response.send(500, {error: "Can't find projects"});
                                        }
                                    });
                            } else {
                                console.log(err);
                            }
                        });
                }
            });
    };

    function getCollectionLengthByWorkflows(req, options, res) {
        data = {};
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
                                            _id      : 1,
                                            workflow : 1,
                                            remaining: 1
                                        }
                                    },
                                    {
                                        $group: {
                                            _id           : "$workflow",
                                            count         : {$sum: 1},
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

    function update(req, _id, data, res, remove) {
        var dbName = req.session.lastDb;
        var wTrackSchema;
        var wTrackModel;

        var InvoiceSchema;
        var Invoice;

        delete data._id;
        delete data.createdBy;
        delete data.task;

        if (data.groups) {
            if (data.groups.users) {
                data.groups.users = data.groups.users.map(function (currentValue) {
                    return (currentValue._id) ? currentValue._id : currentValue;
                });
            }
            if (data.groups.group) {
                data.groups.group = data.groups.group.map(function (currentValue) {
                    return (currentValue._id) ? currentValue._id : currentValue;
                });
            }
        }
        if (data.workflow) {
            data.workflow = data.workflow;
        }

        if (data.notes && data.notes.length != 0 && !remove) {
            var obj = data.notes[data.notes.length - 1];
            obj._id = mongoose.Types.ObjectId();
            obj.date = new Date();
            obj.author = req.session.uName;
            data.notes[data.notes.length - 1] = obj;
        }

        var query = models.get(dbName, 'Project', projectSchema).findByIdAndUpdate({_id: _id}, data, {new: true});
        query.populate("editedBy.user", "login");
        query.exec(function (err, project) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js update project.update " + err);
                res.send(500, {error: "Can't update Project"});
            } else {

                if (project._id) {
                    event.emit('updateProjectDetails', {req: req, _id: project._id});
                }

                res.send(200, project);
                //event.emit('recollectProjectInfo');
                //event.emit('updateName', _id, wTrackModel, 'project._id', 'project.projectName', project.projectName);
                //event.emit('updateName', _id, wTrackModel, 'project._id', 'project.customer._id', project.customer._id);
                //event.emit('updateName', _id, wTrackModel, 'project._id', 'project.customer.name', project.customer.name);
                //event.emit('updateName', _id, wTrackModel, 'project._id', 'project.projectmanager._id', project.projectmanager._id);
                //event.emit('updateName', _id, wTrackModel, 'project._id', 'project.projectmanager.name', project.projectmanager.name);
                //event.emit('updateName', _id, wTrackModel, 'project._id', 'project.workflow._id', project.workflow._id);
                //event.emit('updateName', _id, wTrackModel, 'project._id', 'project.workflow.name', project.workflow.name);
                //
                //event.emit('updateName', _id, Invoice, 'project._id', 'project.name', project.projectName);
                //event.emit('updateName', _id, Invoice, 'project._id', 'supplier._id', project.customer._id);
                //event.emit('updateName', _id, Invoice, 'project._id', 'supplier.name', project.customer.name);
                //event.emit('updateName', _id, Invoice, 'project._id', 'salesPerson._id', project.projectmanager._id);
                //event.emit('updateName', _id, Invoice, 'project._id', 'salesPerson.name', project.projectmanager.name);

            }
        });
    };

    function updateOnlySelectedFields(req, _id, data, res) {
        var obj;
        var fileName = data.fileName;

        delete data._id;

        delete data.fileName;
        if (data.notes && data.notes.length != 0) {
            obj = data.notes[data.notes.length - 1];
            if (!obj._id) {
                obj._id =  mongoose.Types.ObjectId();
            }
            obj.date = new Date();
            obj.author = req.session.uName;
            data.notes[data.notes.length - 1] = obj;
        }
        models.get(req.session.lastDb, 'Project', projectSchema).findByIdAndUpdate({_id: _id}, {$set: data}, {new: true}, function (err, projects) {
            var os = require("os");
            var osType = (os.type().split('_')[0]);
            var path;
            var dir;
            var newDirname;

            if (err) {
                console.log(err);
                logWriter.log("Project.js update project.update " + err);
                res.send(500, {error: "Can't update Project"});
            } else {
                if (fileName) {

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
                if (projects._id) {
                    event.emit('updateProjectDetails', {req: req, _id: projects._id});
                }
                event.emit('recollectProjectInfo');
                res.send(200, projects);
            }
        });
    };

    function taskUpdateOnlySelectedFields(req, _id, data, res) {
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
                    logWriter.log("Project.js taskUpdateOnlySelectedFields data.sequence == -1 " + err);
                }

            });
        }
    }

    function remove(req, _id, res) {
        models.get(req.session.lastDb, 'Project', projectSchema).remove({_id: _id}, function (err, projects) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js remove project.remove " + err);
                res.send(500, {error: "Can't remove Project"});
            } else {
                event.emit('recollectProjectInfo');
                removeTasksByPorjectID(req, _id);
                res.send(200, {success: 'Remove all tasks Starting...'});
            }
        });
    };

    function removeTasksByPorjectID(req, _id) {
        models.get(req.session.lastDb, 'Tasks', tasksSchema).find({'project': _id}, function (err, taskss) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js removeTasksByPorjectID task.find " + err);
            } else {
                for (var i in taskss) {
                    models.get(req.session.lastDb, 'Tasks', tasksSchema).remove({_id: taskss[i]._id}, function (errr) {
                        if (errr) {
                            console.log(errr);
                            logWriter.log("Project.js removeTasksByPorjectID tasks.remove " + err);
                        }
                    });
                }
            }
        });
    };

    function createTask(req, res) {
        var data = {};
        data = req.body;
        data.uId = req.session.uId;
        try {
            if (!data.summary || !data.project) {
                logWriter.log('Task.create Incorrect Incoming Data');
                res.send(400, {error: 'Task.create Incorrect Incoming Data'});
                return;
            } else {
                var projectId = data.project;
                var query = models.get(req.session.lastDb, 'Tasks', tasksSchema).find({project: projectId});
                query.sort({taskCount: -1});
                query.exec(function (error, _tasks) {
                    if (error) {
                        console.log(error);
                        logWriter.log("Project.js createTask tasks.find doc.length === 0" + error);
                        res.send(500, {error: 'Task find error'});
                    } else {
                        var n = (_tasks[0]) ? ++_tasks[0].taskCount : 1;
                        saveTaskToBd(data, n);
                    }
                });
            }
            function saveTaskToBd(data, n) {
                try {
                    _task = new models.get(req.session.lastDb, 'Tasks', tasksSchema)({taskCount: n});
                    _task.summary = data.summary;
                    if (data.project) {
                        _task.project = data.project;
                    }
                    if (data.assignedTo) {
                        _task.assignedTo = data.assignedTo;
                        _task.assignedTo = data.assignedTo;
                    }
                    if (data.type) {
                        _task.type = data.type;
                    }
                    if (data.tags) {
                        _task.tags = data.tags;
                    }
                    if (data.description) {
                        _task.description = data.description;
                    }
                    if (data.priority) {
                        _task.priority = data.priority;
                    }
                    if (data.sequence) {
                        _task.sequence = data.sequence;
                    }
                    if (data.customer) {
                        _task.customer = data.customer;
                    }
                    if (data.StartDate) {
                        _task.StartDate = new Date(data.StartDate);
                        if (!data.estimated) {
                            _task.EndDate = new Date(data.StartDate);
                        }
                    }
                    if (data.workflow) {
                        _task.workflow = data.workflow;
                    }
                    if (data.uId) {
                        _task.createdBy.user = data.uId;
                        _task.createdBy.date = new Date();
                        _task.editedBy.date = new Date();
                        _task.editedBy.user = data.uId;
                    }
                    if (data.logged) {
                        _task.logged = data.logged;
                    }

                    if (data.attachments) {
                        if (data.attachments.id) {
                            _task.attachments.id = data.attachments.id;
                        }
                        if (data.attachments.name) {
                            _task.attachments.name = data.attachments.name;
                        }
                        if (data.attachments.path) {
                            _task.attachments.path = data.attachments.path;
                        }
                        if (data.attachments.size) {
                            _task.attachments.size = data.attachments.size;
                        }
                        if (data.attachments.uploadDate) {
                            _task.attachments.uploadDate = data.attachments.uploadDate;
                        }
                        if (data.attachments.uploaderName) {
                            _task.attachments.uploaderName = data.attachments.uploaderName;
                        }
                    }

                    if (data.notes) {
                        _task.notes = data.notes;
                    }

                    if (data.estimated) {
                        _task.remaining = data.estimated - data.logged;
                        if (data.estimated !== 0) {
                            _task.progress = Math.round((data.logged / data.estimated) * 100);
                        } else {
                            _task.progress = 0;
                        }
                        _task.estimated = data.estimated;

                        var StartDate = (data.StartDate) ? new Date(data.StartDate) : new Date();
                        _task.EndDate = calculateTaskEndDate(StartDate, data.estimated);
                        _task.duration = returnDuration(StartDate, _task.EndDate);
                    }

                    console.log(req.session.lastDb, 'Tasks', tasksSchema);

                    event.emit('updateSequence', models.get(req.session.lastDb, 'Tasks', tasksSchema), "sequence", 0, 0, _task.workflow._id, _task.workflow._id, true, false, function (sequence) {
                        _task.sequence = sequence;
                        _task.save(function (err, _task) {
                            if (err) {
                                console.log(err);
                                logWriter.log("Project.js createTask saveTaskToBd _task.save " + err);
                                res.send(500, {error: 'Task.save BD error'});
                            } else {
                                event.emit('updateContent', req, res, _task.project, 'create', _task);
                                res.send(201, {success: 'An new Task crate success', id: _task._id});
                            }
                        });
                    });
                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Project.js  createTask saveTaskToDb " + error);
                    res.send(500, {error: 'Task.save  error'});
                }
            }
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Project.js  createTask " + Exception);
            res.send(500, {error: 'Task.save  error'});
        }
    };

    function removeTask(req, _id, res) {//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Використовується
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

    function getTasksPriority(req, response) {
        var res = {};
        res['data'] = [];
        models.get(req.session.lastDb, 'Priority', prioritySchema).find({}, function (err, _priority) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js getTasksPriority priority.find " + err);
                response.send(500, {error: "Can't find Priority"});
            } else {
                res['data'] = _priority;
                response.send(res);
            }
        });
    };

    function getProjectType(req, response) {
        var res = {};
        res['data'] = [];
        models.get(req.session.lastDb, 'projectType', projectTypeSchema).find({}, function (err, projectType) {
            if (err) {
                console.log(err);
                logWriter.log("Project.js projectType projectType.find " + err);
                response.send(500, {error: "Can't find Priority"});
            } else {
                res['data'] = projectType;
                response.send(res);
            }
        });
    };

    function getTaskById(req, data, response) {
        var query = models.get(req.session.lastDb, 'Tasks', tasksSchema).findById(data.id);
        query.populate('project', '_id projectShortDesc projectName').
            populate(' assignedTo', '_id name imageSrc').
            populate('createdBy.user').
            populate('createdBy.user').
            populate('editedBy.user').
            populate('groups.users').
            populate('groups.group').
            populate('workflow').
            exec(function (err, task) {
                if (err) {
                    console.log(err);
                    logWriter.log("Project.js getTasksByProjectId task.find " + err);
                    response.send(500, {error: "Can't find Tasks"});
                } else {
                    response.send(task);
                }
            });
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
                                var query = models.get(req.session.lastDb, 'Tasks', tasksSchema).
                                    where('project').in(projectsId.objectID()).
                                    where('workflow', objectId(data.workflowId));

                                if (data.filter && data.filter.type) {
                                    query.where('type').in(data.filter.type);
                                }

                                query.select("_id assignedTo workflow editedBy.date project taskCount summary type remaining priority sequence").
                                    populate('assignedTo', 'name').
                                    populate('project', 'projectShortDesc').
                                    sort({'sequence': -1}).
                                    limit(req.session.kanbanSettings.tasks.countPerPage).
                                    exec(function (err, result) {
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
                                            from        : "Employees",
                                            localField  : "assignedTo",
                                            foreignField: "_id",
                                            as: "assignedTo"
                                        }
                                    }, {
                                        $lookup: {
                                            from        : "Project",
                                            localField  : "project",
                                            foreignField: "_id",
                                            as: "project"
                                        }
                                    }, {
                                        $lookup: {
                                            from        : "Users",
                                            localField  : "createdBy.user",
                                            foreignField: "_id",
                                            as: "createdBy.user"
                                        }
                                    }, {
                                        $lookup: {
                                            from        : "Users",
                                            localField  : "editedBy.user",
                                            foreignField: "_id",
                                            as: "editedBy.user"
                                        }
                                    }, {
                                        $lookup: {
                                            from        : "workflows",
                                            localField  : "workflow",
                                            foreignField: "_id",
                                            as: "workflow"
                                        }
                                    }, {
                                        $project: {
                                            _id             : 1,
                                            summary         : 1,
                                            type            : 1,
                                            workflow        : {$arrayElemAt: ["$workflow", 0]},
                                            assignedTo      : {$arrayElemAt: ["$assignedTo", 0]},
                                            project         : {$arrayElemAt: ["$project", 0]},
                                            'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                                            'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
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
                                    }, {
                                        $project: {
                                            _id             : 1,
                                            summary         : 1,
                                            type            : 1,
                                            workflow        : 1,
                                            project         : 1,
                                            assignedTo      : 1,
                                            'createdBy.date': 1,
                                            'editedBy.date' : 1,
                                            'createdBy.user': 1,
                                            'editedBy.user' : 1,
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

    function addAtachments(req, id, data, res) {
        models.get(req.session.lastDb, 'Tasks', tasksSchema).findByIdAndUpdate(id, data, {new: true}, function (err, result) {
            if (!err) {
                res.send(200, {success: 'Tasks updated', attachments: result.attachments});
            } else {
                res.send(500, {error: "Can't update Tasks"});
                console.log(err);
                logWriter.log("Project.js addAtachments " + err);
            }

        });
    };

    return {
        create: create,//End create

        getForDd: getForDd,

        get: get,

        getTotalCount: getTotalCount,

        getCollectionLengthByWorkflows: getCollectionLengthByWorkflows,//For Kanban

        getProjectsForList: getProjectsForList,

        // getProjectPMForDashboard: getProjectPMForDashboard,

        getProjectStatusCountForDashboard: getProjectStatusCountForDashboard,

        getProjectByEndDateForDashboard: getProjectByEndDateForDashboard,

        getById: getById,//For Project Ediit View

        update: update,

        updateOnlySelectedFields: updateOnlySelectedFields,//Project Patch method

        taskUpdateOnlySelectedFields: taskUpdateOnlySelectedFields,//Tasks Patch Method

        remove: remove,

        createTask: createTask,

        addAtachments: addAtachments,//For Task Project?

        removeTask: removeTask,

        getTaskById: getTaskById,//For Form/EditView

        getTasksForList: getTasksForList,

        getTasksForKanban: getTasksForKanban,

        getTasksPriority: getTasksPriority,

        getProjectType: getProjectType
    };
};

module.exports = Project;
