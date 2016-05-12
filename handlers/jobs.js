var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var Jobs = function (models, event) {
    "use strict";
    var JobsSchema = mongoose.Schemas['jobs'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var QuotationSchema = mongoose.Schemas['Quotation'];
    var jobsInvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var ProjectSchema = mongoose.Schemas['Project'];
    var PaymentSchema = mongoose.Schemas['Payment'];
    var CONSTANTS = require('../constants/mainConstants.js');

    var access = require("../Modules/additions/access.js")(models);
    var objectId = mongoose.Types.ObjectId;

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter) {
            condition = filter[filterName]['value'];
            key = filter[filterName]['key'];

            switch (filterName) {
                case 'workflow':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'type':
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'project':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'projectManager':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'paymentsCount':
                    filtrElement[key] = {$in: condition.toNumber()};
                    resArray.push(filtrElement);
                    break;
            }
        }

        return resArray;
    };

    this.create = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var data = req.body;
        var newModel;
        var jobId;
        var projectId;

        data.workflow = CONSTANTS.JOBSINPROGRESS;
        data.type = "Not Quoted";
        data.wTracks = [];

        data.project = objectId(data.project);

        data.createdBy = {
            user: req.session.uId,
            date: new Date()
        };

        newModel = new JobsModel(data);

        newModel.save(function (err, model) {
            if (err) {
                return next(err);
            }

            jobId = model._id;
            projectId = model.project;

            if (projectId) {
                event.emit('updateProjectDetails', {req: req, _id: projectId, jobId: jobId});
                event.emit('recollectProjectInfo');
            }

            res.status(200).send({success: model});
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var queryObject = {};
        var queryObjectStage2 = {};
        var data = req.query;
        var forDashboard = true;
        var filter = data ? data.filter : {};

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                queryObject['$or'] = caseFilter(filter);
            } else {
                queryObject['$and'] = caseFilter(filter);
            }
        }

        if (forDashboard) { //add for jobsDash need refactor
            queryObjectStage2['$or'] = [];
            queryObjectStage2['$or'].push({type: 'Not Quoted'});
            queryObjectStage2['$or'].push({"invoice._type": 'wTrackInvoice'});
            queryObjectStage2['$or'].push({quotation: {$exists: true}});
        }

        JobsModel
            .aggregate([{
                $lookup: {
                    from                   : "Project",
                    localField             : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $lookup: {
                    from                   : "Invoice",
                    localField             : "invoice",
                    foreignField: "_id", as: "invoice"
                }
            }, {
                $lookup: {
                    from                   : "workflows",
                    localField             : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from                   : "Quotation",
                    localField             : "quotation",
                    foreignField: "_id", as: "quotation"
                }
            }, {
                $project: {
                    name     : 1,
                    workflow : {$arrayElemAt: ["$workflow", 0]},
                    type     : 1,
                    wTracks  : 1,
                    project  : {$arrayElemAt: ["$project", 0]},
                    budget   : 1,
                    quotation: {$arrayElemAt: ["$quotation", 0]},
                    invoice  : {$arrayElemAt: ["$invoice", 0]}
                }
            }, {
                $lookup: {
                    from                       : "Payment",
                    localField                 : "invoice._id",
                    foreignField: "invoice", as: "payments"
                }
            }, {
                $lookup: {
                    from                   : "Employees",
                    localField             : "project.projectmanager",
                    foreignField: "_id", as: "projectmanager"
                }
            }, {
                $project: {
                    order         : {
                        $cond: {
                            if  : {
                                $eq: ['$type', 'Not Quoted']
                            },
                            then: -1,
                            else: {
                                $cond: {
                                    if  : {
                                        $eq: ['$type', 'Quoted']
                                    },
                                    then: 0,
                                    else: 1
                                }
                            }
                        }
                    },
                    name          : 1,
                    workflow      : 1,
                    type          : 1,
                    wTracks       : 1,
                    project       : 1,
                    budget        : 1,
                    quotation     : 1,
                    invoice       : 1,
                    projectmanager: {$arrayElemAt: ["$projectmanager", 0]},
                    payment       : {
                        paid : {$sum: '$payments.paidAmount'},
                        count: {$size: '$payments'}
                    }
                }
            }, {
                $project: {
                    order         : 1,
                    name          : 1,
                    workflow      : 1,
                    type          : 1,
                    wTracks       : 1,
                    project       : 1,
                    budget        : 1,
                    quotation     : 1,
                    invoice       : 1,
                    payment       : 1,
                    projectmanager: 1
                }
            }, {
                $match: queryObject
            }, {
                $match: queryObjectStage2
            }], function (err, jobs) {
                if (err) {
                    next(err);
                }
                res.status(200).send({count: jobs.length});
            });

    };

    this.getData = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', jobsInvoiceSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);

        var queryObject = {};
        var queryObjectStage2 = {};

        var data = req.query;
        var forDashboard = data.forDashboard;
        var sort = {"budget.budgetTotal.costSum": -1};
        var count = parseInt(data.count, 10) || 100;
        var page = parseInt(data.page, 10);
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;

        var filter = data ? data.filter : {};

        if (data.sort) {
            sort = {};

            for (var sortKey in data.sort) {
                sort[sortKey] = parseInt(data.sort[sortKey]);
            }
        }

        if (data && data.project) {
            filter['project'] = {};
            filter['project']['key'] = 'project._id';
            filter['project']['value'] = objectId(data.project);
        }

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                queryObject['$or'] = caseFilter(filter);
            } else {
                queryObject['$and'] = caseFilter(filter);
            }
        }

        if (forDashboard) { //add for jobsDash need refactor
            queryObjectStage2['$or'] = [];
            queryObjectStage2['$or'].push({type: 'Not Quoted'});
            queryObjectStage2['$or'].push({"invoice._type": 'wTrackInvoice'});
            queryObjectStage2['$or'].push({quotation: {$exists: true}});
        }

        JobsModel
            .aggregate([{
                $lookup: {
                    from                   : "Project",
                    localField             : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $lookup: {
                    from                   : "Invoice",
                    localField             : "invoice",
                    foreignField: "_id", as: "invoice"
                }
            }, {
                $lookup: {
                    from                   : "workflows",
                    localField             : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from                   : "Quotation",
                    localField             : "quotation",
                    foreignField: "_id", as: "quotation"
                }
            }, {
                $project: {
                    name     : 1,
                    workflow : {$arrayElemAt: ["$workflow", 0]},
                    type     : 1,
                    wTracks  : 1,
                    project  : {$arrayElemAt: ["$project", 0]},
                    budget   : 1,
                    quotation: {$arrayElemAt: ["$quotation", 0]},
                    invoice  : {$arrayElemAt: ["$invoice", 0]}
                }
            }, {
                $lookup: {
                    from                       : "Payment",
                    localField                 : "invoice._id",
                    foreignField: "invoice", as: "payments"
                }
            }, {
                $lookup: {
                    from                   : "Employees",
                    localField             : "project.projectmanager",
                    foreignField: "_id", as: "projectmanager"
                }
            }, {
                $project: {
                    order         : {
                        $cond: {
                            if  : {
                                $eq: ['$type', 'Not Quoted']
                            },
                            then: -1,
                            else: {
                                $cond: {
                                    if  : {
                                        $eq: ['$type', 'Quoted']
                                    },
                                    then: 0,
                                    else: 1
                                }
                            }
                        }
                    },
                    name          : 1,
                    workflow      : 1,
                    type          : 1,
                    wTracks       : 1,
                    project       : 1,
                    budget        : 1,
                    quotation     : 1,
                    invoice       : 1,
                    projectmanager: {$arrayElemAt: ["$projectmanager", 0]},
                    payment       : {
                        paid : {$sum: '$payments.paidAmount'},
                        count: {$size: '$payments'}
                    }
                }
            }, {
                $project: {
                    order         : 1,
                    name          : 1,
                    workflow      : 1,
                    type          : 1,
                    wTracks       : 1,
                    project       : 1,
                    budget        : 1,
                    quotation     : 1,
                    invoice       : 1,
                    payment       : 1,
                    projectmanager: 1
                }
            }, {
                $match: queryObject
            }, {
                $match: queryObjectStage2
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: count
            }], function (err, jobs) {
                if (err) {
                    next(err);
                }
                res.status(200).send(jobs);
            });
    };

    this.getForDD = function (req, res, next) {
        var pId = req.query.projectId;
        var query = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var all = req.query.all;
        var queryObj = {type: "Not Quoted", 'project': objectId(pId)};

        if (all) {
            queryObj = {'project': objectId(pId)};
        }

        query.find(queryObj, {
            name    : 1,
            _id     : 1,
            "budget": 1
        }, function (err, jobs) {
            if (err) {
                return next(err);
            }
            res.status(200).send(jobs);

        });
    };

    this.remove = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        var data = req.body;
        var id = data._id;

        JobsModel.findByIdAndRemove(id, function (err, result) {
            var jobId;
            var projectId;

            if (err) {
                return next(err);
            }

            jobId = result.get('_id');
            projectId = result.get('project');

            wTrack.find({"jobs": jobId}, function (err, result) {
                if (err) {
                    return next(err);
                }

                async.each(result, function (wTrackEl, cb) {
                    var _id = wTrackEl.get('_id');

                    wTrack.findByIdAndRemove(_id, function (err, r) {
                        cb();
                    });
                }, function () {
                    if (projectId) {
                        event.emit('updateProjectDetails', {req: req, _id: projectId});
                    }

                    event.emit('recollectVacationDash');
                });

            });

            res.status(200).send(result)
        })
    };

    this.update = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var project;

        var data = req.body;
        var id = data._id;
        var query;
        var products;
        var type;
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        if (id) {
            if (data.workflowId) {
                query = {workflow: data.workflowId};
            } else if (data.name) {
                query = {name: data.name};
            } else if (data.type) {
                query = {type: data.type};
            }

            query.editedBy = editedBy;

            delete data._id;

            JobsModel.findByIdAndUpdate(id, query, {new: true}, function (err, result) {
                if (err) {
                    return next(err);
                }

                event.emit('recollectVacationDash');
                res.status(200).send(result)
            });
        } else if (data.products && data.products.length) {
            products = JSON.parse(data.products);
            type = data.type;

            async.each(products, function (product, cb) {

                JobsModel.findByIdAndUpdate(product.jobs, {
                    type    : type,
                    editedBy: editedBy
                }, {new: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    project = result.get('project');

                    cb();
                });

            }, function () {
                if (project) {
                    event.emit('fetchJobsCollection', {project: project});
                }

                event.emit('recollectVacationDash');
            });
        }
    };
};

module.exports = Jobs;
