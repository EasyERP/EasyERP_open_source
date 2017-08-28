var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var RESPONSES = require('../constants/responses');
var tasksSchema = mongoose.Schemas.DealTasks;
var prioritySchema = mongoose.Schemas.Priority;
var EmployeeSchema = mongoose.Schemas.Employee;
var OrgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
var objectId = mongoose.Types.ObjectId;
var _ = require('underscore');
var async = require('async');
var Mailer = require('../helpers/mailer');
var mailer = new Mailer();

var Module = function (models, event) {
    'use strict';

    var validator = require('../helpers/validator');

    var fs = require('fs');
    var path = require('path');
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();
    var HistoryService = require('../services/history.js')(models);
    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    var dealTasksCT = 'DealTasks';

    function sendEmailToAssigned(req, dealTask) {
        var mailOptions;
        var Employee;

        Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee.findById(dealTask.assignedTo, {}, function (err, modelEmployee) {
            var workEmail;
            var employee;
            var description;

            if (err) {
                return console.log('email send to assigned error');
            }

            workEmail = modelEmployee.get('workEmail');
            employee = modelEmployee.get('name');

            description = dealTask.description || '';

            if (workEmail) {
                mailOptions = {
                    to         : workEmail,
                    employee   : employee.first + ' ' + employee.last,
                    description: description,
                    date       : dealTask.dueDate,
                    req        : req
                };

                getFromMail(mailOptions, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('email was send to ' + workEmail);
                });
            } else {
                console.log('employee have not work email');
            }
        });
    }

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
                    mailer.sendEmailFromTask(mailOptions, cb);
                });
        } else {
            mailer.sendEmailFromTask(mailOptions, cb);
        }
    }

    function getTasksForKanban(req, res, next) {
        var startTime = new Date();
        var data = req.query || {};
        var quickSearch = data.quickSearch || '';
        var filter = data.filter;
        var optionsObject = {};
        var responseData = {};
        var addObj = {};
        var matchObject = {};
        var regExp;
        var limit;
        var pipeline;
        var worflowObj = data.workflowId ? {workflow: objectId(data.workflowId)} : {};
        var query;

        if (quickSearch) {
            regExp = new RegExp(quickSearch, 'ig');
            matchObject.description = {$regex: regExp};
        }

        responseData.workflowId = data.workflowId;

        if (data.parrentContentId) {
            addObj._id = objectId(data.parrentContentId);
        }

        query = models.get(req.session.lastDb, dealTasksCT, tasksSchema);

        if (filter) {
            optionsObject.$and = [];
            optionsObject.$and.push(filterMapper.mapFilter(filter, {contentType: dealTasksCT}));
        }

        limit = req.session.kanbanSettings.tasks.countPerPage;
        pipeline = [
            {
                $match: worflowObj
            },
            {
                $match: optionsObject
            }, {
                $match: matchObject
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'assignedTo',
                    foreignField: '_id',
                    as          : 'assignedTo'
                }
            },
            {
                $lookup: {
                    from        : 'tags',
                    localField  : 'category',
                    foreignField: '_id',
                    as          : 'category'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'company',
                    foreignField: '_id',
                    as          : 'company'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'contact',
                    foreignField: '_id',
                    as          : 'contact'
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
                    from        : 'Opportunities',
                    localField  : 'deal',
                    foreignField: '_id',
                    as          : 'deal'
                }
            }, {
                $project: {
                    taskCount  : 1,
                    dealDate   : 1,
                    description: 1,
                    sequence   : 1,
                    companyDate: 1,
                    contactDate: 1,
                    dueDate    : 1,
                    type       : 1,
                    notes      : 1,
                    attachments: 1,
                    editedBy   : 1,
                    assignedTo : {$arrayElemAt: ['$assignedTo', 0]},
                    category   : {$arrayElemAt: ['$category', 0]},
                    company    : {$arrayElemAt: ['$company', 0]},
                    contact    : {$arrayElemAt: ['$contact', 0]},
                    workflow   : {$arrayElemAt: ['$workflow', 0]},
                    deal       : {$arrayElemAt: ['$deal', 0]}
                }
            }, {
                $project: {
                    taskCount            : 1,
                    dealDate             : 1,
                    description          : 1,
                    sequence             : 1,
                    companyDate          : 1,
                    contactDate          : 1,
                    dueDate              : 1,
                    type                 : 1,
                    notes                : 1,
                    attachments          : 1,
                    editedBy             : 1,
                    assignedTo           : 1,
                    category             : 1,
                    'company.name'       : '$company.name',
                    'company.imageSrc'   : '$company.imageSrc',
                    'contact.imageSrc'   : '$contact.imageSrc',
                    'contact.name'       : '$contact.name',
                    'workflow.name'      : '$workflow.name',
                    'workflow.sequence'  : '$workflow.sequence',
                    'workflow.status'    : '$workflow.status',
                    'deal.name'          : '$deal.name',
                    'deal.isOpportunitie': '$deal.isOpportunitie'
                }
            },
            {
                $sort: {
                    sequence: -1
                }
            }, {
                $limit: limit
            }
        ];

        query.aggregate(pipeline, function (err, result) {
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
        var id = req.params.id;
        var Tasks = models.get(req.session.lastDb, 'DealTasks', tasksSchema);

        Tasks.findById(data.id || id)
            .populate('deal', '_id name')
            .populate('company', '_id name imageSrc')
            .populate('contact', '_id name imageSrc')
            .populate('category')
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
        var data = req.query || {};
        var filter = data.filter;
        var quickSearch = data.quickSearch;

        var limit = parseInt(data.count, 10);
        var skip = (parseInt(data.page || 1, 10) - 1) * limit;
        var Task = models.get(req.session.lastDb, dealTasksCT, tasksSchema);
        var addObj = {};
        var obj = {};

        var regExp = new RegExp(quickSearch, 'ig');
        var matchObject = {};

        if (quickSearch) {
            matchObject.description = {$regex: regExp};
        }

        var keys;
        var sort;

        if (data.parrentContentId) {
            addObj._id = objectId(data.parrentContentId);
        }

        if (filter) {
            obj.$and = [];
            obj.$and.push(filterMapper.mapFilter(data.filter, {contentType: dealTasksCT}));
        }

        if (data.sort) {
            keys = Object.keys(data.sort)[0];
            data.sort[keys] = parseInt(data.sort[keys], 10);
            sort = data.sort;
        } else {
            sort = {'dueDate': -1};
        }

        Task.aggregate([{
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
                $lookup: {
                    from        : 'tags',
                    localField  : 'category',
                    foreignField: '_id',
                    as          : 'category'
                }
            },
            {
                $match: matchObject
            },
            {
                $project: {
                    _id        : 1,
                    workflow   : {$arrayElemAt: ['$workflow', 0]},
                    category   : {$arrayElemAt: ['$category', 0]},
                    assignedTo : {$arrayElemAt: ['$assignedTo', 0]},
                    description: 1,
                    deal       : {$arrayElemAt: ['$deal', 0]},
                    contact    : {$arrayElemAt: ['$contact', 0]},
                    company    : {$arrayElemAt: ['$company', 0]},
                    dueDate    : 1,
                    sequence   : 1,
                    taskCount  : 1
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
                    _id        : '$root._id',
                    workflow   : '$root.workflow',
                    category   : '$root.category',
                    assignedTo : '$root.assignedTo',
                    description: '$root.description',
                    dueDate    : '$root.dueDate',
                    taskCount  : '$root.taskCount',
                    company    : '$root.company',
                    contact    : '$root.contact',
                    deal       : '$root.deal',
                    total      : 1
                }
            },
            {
                $sort: sort
            },
            {
                $skip: skip
            },
            {
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

    function getTasksForDateList(req, res, next) {
        var data = req.query;
        var filter = data.filter;
        var obj = {};
        var addObj = {};
        var Task = models.get(req.session.lastDb, dealTasksCT, tasksSchema);

        if (data.parrentContentId) {
            addObj._id = objectId(data.parrentContentId);
        }

        if (filter) {
            obj.$and = [];
            obj.$and.push(filterMapper.mapFilter(data.filter, {contentType: dealTasksCT}));
        }

        Task
            .aggregate([
                {
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
                    $lookup: {
                        from        : 'tags',
                        localField  : 'category',
                        foreignField: '_id',
                        as          : 'category'
                    }
                },
                {
                    $project: {
                        _id        : 1,
                        workflow   : {$arrayElemAt: ['$workflow', 0]},
                        category   : {$arrayElemAt: ['$category', 0]},
                        assignedTo : {$arrayElemAt: ['$assignedTo', 0]},
                        description: 1,
                        deal       : {$arrayElemAt: ['$deal', 0]},
                        contact    : {$arrayElemAt: ['$contact', 0]},
                        company    : {$arrayElemAt: ['$company', 0]},
                        dueDate    : 1,
                        sequence   : 1,
                        taskCount  : 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        doc: {$push: '$$ROOT'}
                    }
                },
                {
                    $project: {
                        _id      : 0,
                        overdue  : {
                            $filter: {
                                input: '$doc',
                                as   : 'task',
                                cond : {
                                    $and: [{
                                        $lt: ['$$task.dueDate', moment().startOf('day').toDate()]
                                    }, {$ne: ['$$task.workflow.status', 'Done']}, {$ne: ['$$task.workflow.status', 'Cancelled']}]

                                }
                            }
                        },
                        today    : {
                            $filter: {
                                input: '$doc',
                                as   : 'task',
                                cond : {
                                    $and: [{$gte: ['$$task.dueDate', moment().startOf('day').toDate()]},
                                        {$lte: ['$$task.dueDate', moment().endOf('day').toDate()]}
                                    ]
                                }
                            }
                        },
                        next7days: {
                            $filter: {
                                input: '$doc',
                                as   : 'task',
                                cond : {
                                    $and: [
                                        {$gte: ['$$task.dueDate', moment().endOf('day').toDate()]},
                                        {$lte: ['$$task.dueDate', moment().add(8, 'days').endOf('day').toDate()]}
                                    ]
                                }
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result[0]});
            });

    }

    this.createTask = function (req, res, next) {
        var dbName = req.session.lastDb;
        var body = req.body;
        var dealId = body.deal;
        var TasksModel = models.get(dbName, 'DealTasks', tasksSchema);

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
                        var historyOptions;

                        if (err) {
                            return next(err);
                        }

                        historyOptions = {
                            contentType: 'dealTask',
                            data       : result.toJSON(),
                            dbName     : dbName,
                            contentId  : result._id,
                            deal       : result.deal,
                            followerId : result.assignedTo
                        };

                        sendEmailToAssigned(req, result);

                        HistoryService.addEntry(historyOptions, function () {
                            res.status(201).send({success: 'New Task created success', id: result._id});
                        });

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
        var dbName = req.session.lastDb;
        var _id = req.params._id;
        var data = req.body;
        var obj;

        delete data._id;

        function updateTask() {
            models.get(dbName, 'DealTasks', tasksSchema).findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                var historyOptions;

                if (err) {
                    return next(err);
                }

                historyOptions = {
                    contentType: 'dealTask',
                    data       : data,
                    dbName     : dbName,
                    contentId  : result._id,
                    deal       : result.deal,
                    followerId : result.assignedTo
                };

                HistoryService.addEntry(historyOptions, function () {
                    res.send(200, {success: 'Tasks updated', sequence: result.sequence});
                });

            });
        }

        function sequenceUpdate() {
            if (data.sequence === -1) {
                event.emit('updateSequence', models.get(dbName, 'DealTasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflowStart, data.workflowStart, false, true, function () {
                    event.emit('updateSequence', models.get(dbName, 'DealTasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;
                        if (data.workflow === data.workflowStart) {
                            data.sequence -= 1;
                        }
                        updateTask();
                    });
                });
            } else {
                event.emit('updateSequence', models.get(dbName, 'DealTasks', tasksSchema), 'sequence', data.sequenceStart, data.sequence, data.workflowStart, data.workflow, false, false, function (sequence) {
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

    this.getActivity = function (req, res, next) {
        var dbName = req.session.lastDb;
        var data = req.query || {};
        var filter = data.filter;
        var obj = {};
        var Task;

        if (filter) {
            obj.$and = [];
            obj.$and.push(filterMapper.mapFilter(data.filter, {contentType: dealTasksCT}));
        }

        Task = models.get(dbName, dealTasksCT, tasksSchema);
        Task.find(obj, {_id: 1, description: 1}, function (err, docs) {
            var ids;
            var historyOptions;

            if (err) {
                return next(err);
            }

            ids = docs.map(function (elem) {
                return elem._id;
            });
            historyOptions = {
                dbName: dbName,
                id    : {$in: ids},

                filter: {
                    date: {$gte: moment().subtract(1, 'days').toDate()}
                },

                forNote: true
            };
            HistoryService.getHistoryForTrackedObject(historyOptions, function (err, history) {
                if (err) {
                    return next(err);
                }

                history = history.map(function (elem) {
                    var doc = _.find(docs, function (opp) {
                        return (opp._id.toJSON() === elem.contentId.toJSON());
                    });

                    elem.name = doc ? doc.description : '';
                    return elem;
                });

                history = history.reverse();

                res.status(200).send({data: history});

            });
        });

    };

    this.getTasks = function (req, res, next) {
        var viewType = req.query.viewType;

        switch (viewType) {
            case 'form':
                getTaskById(req, res, next);
                break;
            case 'list':
                getTasksForList(req, res, next);
                break;
            case 'datelist':
                getTasksForDateList(req, res, next);
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
        var deleteHistory = req.query.deleteHistory;
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

    this.getById = function (req, res, next) {
        getTaskById(req, res, next);
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
