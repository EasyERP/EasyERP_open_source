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
    var journalEntrySchema = mongoose.Schemas.journalEntry;
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
                case 'salesmanager':
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
        var salesManagerMatch = {
            $and: [
                {$eq: ["$$projectMember.projectPositionId", objectId(CONSTANTS.SALESMANAGER)]},
                {
                    $or: [{
                        $and: [{
                            $eq: ['$$projectMember.startDate', null]
                        }, {
                            $eq: ['$$projectMember.endDate', null]
                        }]
                    }, {
                        $and: [{
                            $lte: ['$$projectMember.startDate', '$quotation.orderDate']
                        }, {
                            $eq: ['$$projectMember.endDate', null]
                        }]
                    }, {
                        $and: [{
                            $eq: ['$$projectMember.startDate', null]
                        }, {
                            $gte: ['$$projectMember.endDate', '$quotation.orderDate']
                        }]
                    }, {
                        $and: [{
                            $lte: ['$$projectMember.startDate', '$quotation.orderDate']
                        }, {
                            $gte: ['$$projectMember.endDate', '$quotation.orderDate']
                        }]
                    }]
                }]
        };

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
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
                }
            }, {
                $lookup: {
                    from        : 'Project',
                    localField  : 'project',
                    foreignField: '_id',
                    as          : 'project'
                }
            }, {
                $lookup: {
                    from        : 'Invoice',
                    localField  : 'invoice',
                    foreignField: '_id',
                    as          : 'invoice'
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
                    from        : 'Quotation',
                    localField  : 'quotation',
                    foreignField: '_id',
                    as          : 'quotation'
                }
            }, {
                $project: {
                    name         : 1,
                    workflow     : {$arrayElemAt: ['$workflow', 0]},
                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : salesManagerMatch
                        }
                    },
                    wTracks      : 1,
                    project      : {$arrayElemAt: ['$project', 0]},
                    quotation    : {$arrayElemAt: ['$quotation', 0]},
                    invoice      : {$arrayElemAt: ['$invoice', 0]}
                }
            }, {
                $project: {
                    name         : 1,
                    workflow     : 1,
                    salesmanagers: {$arrayElemAt: ['$salesmanagers', 0]},
                    wTracks      : 1,
                    project      : 1,
                    quotation    : 1,
                    invoice      : 1
                }
            }, {
                $lookup: {
                    from        : 'Payment',
                    localField  : 'invoice._id',
                    foreignField: 'invoice',
                    as          : 'payments'
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesmanagers.employeeId',
                    foreignField: '_id',
                    as          : 'salesmanagers'
                }
            }, {
                $project: {
                    order       : {
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
                    name        : 1,
                    workflow    : 1,
                    wTracks     : 1,
                    project     : 1,
                    quotation   : 1,
                    salesmanager: {$arrayElemAt: ['$salesmanagers', 0]},
                    payment     : {
                        paid : {$sum: '$payments.paidAmount'},
                        count: {$size: '$payments'}
                    }
                }
            }, {
                $match: queryObject
            }, {
                $match: queryObjectStage2
            }], function (err, jobs) {
                if (err) {
                    next(err);
                }
                res.status(200).send({count: jobs ? jobs.length : 0});
            });

    };

    this.getData = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', jobsInvoiceSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var JournalEntryModel = models.get(req.session.lastDb, "journalEntry", journalEntrySchema);

        var queryObject = {};
        var queryObjectStage2 = {};
        var ArrayTasks = [];

        var data = req.query;
        var forDashboard = data.forDashboard;
        var sort = {"budget.budgetTotal.costSum": -1};
        var count = parseInt(data.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        var page = parseInt(data.page, 10);
        var skip;
        var salesManagerMatch = {
            $and: [
                {$eq: ["$$projectMember.projectPositionId", objectId(CONSTANTS.SALESMANAGER)]},
                {
                    $or: [{
                        $and: [{
                            $eq: ['$$projectMember.startDate', null]
                        }, {
                            $eq: ['$$projectMember.endDate', null]
                        }]
                    }, {
                        $and: [{
                            $lte: ['$$projectMember.startDate', '$quotation.orderDate']
                        }, {
                            $eq: ['$$projectMember.endDate', null]
                        }]
                    }, {
                        $and: [{
                            $eq: ['$$projectMember.startDate', null]
                        }, {
                            $gte: ['$$projectMember.endDate', '$quotation.orderDate']
                        }]
                    }, {
                        $and: [{
                            $lte: ['$$projectMember.startDate', '$quotation.orderDate']
                        }, {
                            $gte: ['$$projectMember.endDate', '$quotation.orderDate']
                        }]
                    }]
                }]
        };

        var filter = data ? data.filter : {};

        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
        skip = (page - 1) > 0 ? (page - 1) * count : 0;

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
                    from        : "projectMembers",
                    localField  : "project",
                    foreignField: "projectId",
                    as          : "projectMembers"
                }
            }, {
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id",
                    as          : "project"
                }
            }, {
                $lookup: {
                    from        : "Invoice",
                    localField  : "invoice",
                    foreignField: "_id",
                    as          : "invoice"
                }
            }, {
                $lookup: {
                    from        : "wTrack",
                    localField  : "_id",
                    foreignField: "jobs",
                    as          : "wTracksDocs"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id",
                    as          : "workflow"
                }
            }, {
                $lookup: {
                    from        : "Quotation",
                    localField  : "quotation",
                    foreignField: "_id",
                    as          : "quotation"
                }
            }, {
                $project: {
                    name          : 1,
                    workflow      : {$arrayElemAt: ['$workflow', 0]},
                    wTracksQa     : {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId(CONSTANTS.QADEPARTMENT)]}
                        }
                    },
                    wTracksDesign    : {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId(CONSTANTS.DESDEPARTMENT)]}
                        }
                    },
                    wTracksIOS     : {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId("55b92ace21e4b7c40f00000f")]}
                        }
                    },
                    wTracksAndroid: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId("55b92ace21e4b7c40f000010")]}
                        }
                    },
                    wTracksUnity  : {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId("56e175c4d62294582e10ca68")]}
                        }
                    },
                    wTracksDotNet : {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId("55b92ace21e4b7c40f000012")]}
                        }
                    },
                    wTracksWeb : {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$or: [{$eq: ['$$wTrack.department', objectId("56802eb31afe27f547b7ba52")]}, {$eq: ['$$wTrack.department', objectId("56802e9d1afe27f547b7ba51")]}, {$eq: ['$$wTrack.department', objectId("56802ec21afe27f547b7ba53")]}, {$eq: ['$$wTrack.department', objectId("55b92ace21e4b7c40f000016")]}]}
                        }
                    },
                    wTracksDev    : {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$and: [{$ne: ['$$wTrack.department', objectId(CONSTANTS.DESDEPARTMENT)]}, {$ne: ['$$wTrack.department', objectId(CONSTANTS.QADEPARTMENT)]}]}
                        }
                    },
                    wTracksROR : {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId("566ee11b8453e8b464b70b73")]}
                        }
                    },
                    type          : 1,
                    wTracks       : 1,
                    project       : {$arrayElemAt: ["$project", 0]},
                    budget        : 1,
                    quotation     : {$arrayElemAt: ["$quotation", 0]},
                    invoice       : {$arrayElemAt: ["$invoice", 0]},
                    projectMembers: 1
                }
            }, {
                $lookup: {
                    from                       : "Payment",
                    localField                 : "invoice._id",
                    foreignField: "invoice", as: "payments"
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
                    cost          : '$wTracks',
                    costQA        : '$wTracksQa._id',
                    costDesign    : '$wTracksDesign._id',
                    costIOS       : '$wTracksIOS._id',
                    costAndroid   : '$wTracksAndroid._id',
                    costUnity     : '$wTracksUnity._id',
                    costDotNet    : '$wTracksDotNet._id',
                    costWeb       : '$wTracksWeb._id',
                    costROR       : '$wTracksROR._id',
                    costDev       : '$wTracksDev._id',
                    hoursQA       : {$sum: '$wTracksQa.worked'},
                    hoursDesign   : {$sum: '$wTracksDesign.worked'},
                    hoursIOS      : {$sum: '$wTracksIOS.worked'},
                    hoursAndroid  : {$sum: '$wTracksAndroid.worked'},
                    hoursUnity    : {$sum: '$wTracksUnity.worked'},
                    hoursDotNet   : {$sum: '$wTracksDotNet.worked'},
                    hoursWeb      : {$sum: '$wTracksWeb.worked'},
                    hoursROR      : {$sum: '$wTracksROR.worked'},
                    hoursDev      : {$sum: '$wTracksDev.worked'},
                    name          : 1,
                    workflow      : 1,
                    type          : 1,
                    project       : 1,
                    budget        : 1,
                    quotation     : 1,
                    invoice       : 1,
                    salesmanagers : {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : salesManagerMatch
                        }
                    },
                    payment       : {
                        paid : {$sum: '$payments.paidAmount'},
                        count: {$size: '$payments'}
                    }
                }
            }, {
                $project: {
                    order       : 1,
                    name        : 1,
                    workflow    : 1,
                    type        : 1,
                    project     : 1,
                    budget      : 1,
                    quotation   : 1,
                    invoice     : 1,
                    payment     : 1,
                    cost        : 1,
                    costQA      : 1,
                    costDesign  : 1,
                    costIOS     : 1,
                    costAndroid : 1,
                    costUnity   : 1,
                    costDotNet  : 1,
                    costWeb     : 1,
                    costROR     : 1,
                    costDev     : 1,
                    hoursQA     : 1,
                    hoursDesign : 1,
                    hoursIOS    : 1,
                    hoursAndroid: 1,
                    hoursUnity  : 1,
                    hoursDotNet : 1,
                    hoursROR    : 1,
                    hoursWeb    : 1,
                    hoursDev    : 1,
                    salesmanager: {$arrayElemAt: ["$salesmanagers", 0]}
                }
            }, {
                $lookup: {
                    from                   : 'Employees',
                    localField             : 'salesmanager.employeeId',
                    foreignField: '_id', as: 'salesmanager'
                }
            }, {
                $project: {
                    order       : 1,
                    name        : 1,
                    workflow    : 1,
                    type        : 1,
                    project     : 1,
                    budget      : 1,
                    quotation   : 1,
                    invoice     : 1,
                    payment     : 1,
                    cost        : 1,
                    costQA      : 1,
                    costDesign  : 1,
                    costIOS     : 1,
                    costAndroid : 1,
                    costUnity   : 1,
                    costDotNet  : 1,
                    costWeb     : 1,
                    costROR     : 1,
                    costDev     : 1,
                    hoursQA     : 1,
                    hoursDesign : 1,
                    hoursIOS    : 1,
                    hoursAndroid: 1,
                    hoursUnity  : 1,
                    hoursDotNet : 1,
                    hoursWeb    : 1,
                    hoursROR    : 1,
                    hoursDev    : 1,
                    salesmanager: {$arrayElemAt: ['$salesmanager', 0]}
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
                    return next(err);
                }

                async.each(jobs, function (job, cb) {

                    function costs(el, eachCb) {
                        JournalEntryModel.aggregate([{
                            $match: {
                                'sourceDocument.model': 'wTrack',
                                "sourceDocument._id"  : {$in: job[el]}
                            }
                        }, {
                            $group: {
                                _id  : null,
                                debit: {$sum: '$debit'}
                            }
                        }], function (err, result) {
                            job[el] = result[0] ? result[0].debit : 0;
                            eachCb();
                        });
                    }

                    ArrayTasks = ['cost', 'costQA', 'costDesign', 'costIOS', 'costAndroid', 'costUnity', 'costDotNet', 'costWeb', 'costROR','costDev'];

                    async.each(ArrayTasks, costs, function (err, result) {
                        if (err) {
                            cb(err);
                        }

                        job.margin = job.quotation ? ((1 - job.cost / job.quotation.paymentInfo.total) * 100) : 0;
                        job.devMargin = job.quotation ? ((1 - job.costDev / job.quotation.paymentInfo.total) * 100) : 0;
                        job.avDevRate = job.quotation && job.hoursDev ? ((job.quotation.paymentInfo.total - job.costQA - job.costDesign) / (100 * job.hoursDev)) : 0;
                        job.profit = job.quotation ? ((job.quotation.paymentInfo.total - job.cost) / 100) : 0;

                        cb();
                    })

                }, function (err, result) {
                    var sortField = Object.keys(sort)[0];
                    var sortingFields = ['profit', 'margin', 'devMargin', 'avDevRate', 'cost', 'costQA', 'costDesign', 'costIOS', 'costAndroid', 'costUnity', 'costDotNet', 'costWeb', 'costROR','costDev'];

                    if (err) {
                        return next(err);
                    }

                    if (sortField && sortingFields.indexOf(sortField) !== -1) {
                        jobs = jobs.sort(function (a, b) {
                            function compareField(elA, elB) {
                                if (elA[sortField] > elB[sortField]) {
                                    return 1;
                                } else if (elA[sortField] < elB[sortField]) {
                                    return -1;
                                }
                                return 0;
                            }

                            if (sort[sortField] === 1) {
                                return compareField(a, b);
                            } else {
                                return compareField(b, a);
                            }
                        });
                    }
                    res.status(200).send(jobs);
                });

            });
    };

    this.getForDD = function (req, res, next) {
        var pId = req.query.projectId;
        var query = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var all = req.query.all;
        var queryObj;

        if (!pId || !pId.length) {
            return res.status(200).send([]);
        }

        queryObj = {type: "Not Quoted", 'project': objectId(pId)};

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

            if (result) {
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
            }

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

                res.status(200).send(result);
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
