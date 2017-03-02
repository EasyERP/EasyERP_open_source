var mongoose = require('mongoose');
var async = require('async');

var Module = function (models, event) {
    'use strict';

    var JobsSchema = mongoose.Schemas.jobs;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var ProjectSchema = mongoose.Schemas.Project;
    var ProjectMembersSchema = mongoose.Schemas.ProjectMember;
    var journalEntrySchema = mongoose.Schemas.journalEntry;

    var CONSTANTS = require('../constants/mainConstants.js');
    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').jobs;
    var objectId = mongoose.Types.ObjectId;
    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    var ProductService = require('../services/products')(models);
    var AvailabilityService = require('../services/productAvailability')(models);
    var JournalEntryHandler = require('./journalEntry');
    var jobsService = require('../services/jobs')(models);
    var ProductPriceService = require('../services/productPrice')(models);
    var ProductCategoryService = require('../services/productCategory')(models);
    var JournalEntryService = require('../services/journalEntry')(models);
    var _journalEntryHandler = new JournalEntryHandler(models, event);

    var salesManagerMatchForDashboard = {
        $and: [
            {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]},
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

    var JobsDashboardAggregateBeforeFilter = [{
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
            from        : 'wTrack',
            localField  : '_id',
            foreignField: 'jobs',
            as          : 'wTracksDocs'
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
            name    : 1,
            workflow: {$arrayElemAt: ['$workflow', 0]},

            wTracksQa: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {$eq: ['$$wTrack.department', objectId(CONSTANTS.QADEPARTMENT)]}
                }
            },

            wTracksDesign: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {$eq: ['$$wTrack.department', objectId(CONSTANTS.DESDEPARTMENT)]}
                }
            },

            wTracksIOS: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {$eq: ['$$wTrack.department', objectId('55b92ace21e4b7c40f00000f')]}
                }
            },

            wTracksAndroid: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {$eq: ['$$wTrack.department', objectId('55b92ace21e4b7c40f000010')]}
                }
            },

            wTracksUnity: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {$eq: ['$$wTrack.department', objectId('56e175c4d62294582e10ca68')]}
                }
            },

            wTracksDotNet: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {$eq: ['$$wTrack.department', objectId('55b92ace21e4b7c40f000012')]}
                }
            },

            wTracksWeb: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {
                        $or: [{$eq: ['$$wTrack.department', objectId('56802eb31afe27f547b7ba52')]},
                            {$eq: ['$$wTrack.department', objectId('56802e9d1afe27f547b7ba51')]},
                            {$eq: ['$$wTrack.department', objectId('56802ec21afe27f547b7ba53')]},
                            {$eq: ['$$wTrack.department', objectId('55b92ace21e4b7c40f000016')]}]
                    }
                }
            },

            wTracksDev: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {
                        $and: [{$ne: ['$$wTrack.department', objectId(CONSTANTS.DESDEPARTMENT)]},
                            {$ne: ['$$wTrack.department', objectId(CONSTANTS.QADEPARTMENT)]}]
                    }
                }
            },

            wTracksROR: {
                $filter: {
                    input: '$wTracksDocs',
                    as   : 'wTrack',
                    cond : {$eq: ['$$wTrack.department', objectId('566ee11b8453e8b464b70b73')]}
                }
            },

            type          : 1,
            wTracks       : 1,
            project       : {$arrayElemAt: ['$project', 0]},
            budget        : 1,
            quotation     : {$arrayElemAt: ['$quotation', 0]},
            invoice       : {$arrayElemAt: ['$invoice', 0]},
            projectMembers: 1
        }
    }, {
        $lookup: {

            from        : 'Payment',
            localField  : 'invoice._id',
            foreignField: 'invoice',
            as          : 'payments'
        }
    }, {
        $project: {
            order: {
                $cond: {
                    if: {
                        $eq: ['$type', 'Not Ordered']
                    },

                    then: -1,
                    else: {
                        $cond: {
                            if: {
                                $eq: ['$type', 'Ordered']
                            },

                            then: 0,
                            else: 1
                        }
                    }
                }
            },

            hoursQA      : {$sum: '$wTracksQa.worked'},
            hoursDesign  : {$sum: '$wTracksDesign.worked'},
            hoursIOS     : {$sum: '$wTracksIOS.worked'},
            hoursAndroid : {$sum: '$wTracksAndroid.worked'},
            hoursUnity   : {$sum: '$wTracksUnity.worked'},
            hoursDotNet  : {$sum: '$wTracksDotNet.worked'},
            hoursWeb     : {$sum: '$wTracksWeb.worked'},
            hoursROR     : {$sum: '$wTracksROR.worked'},
            hoursDev     : {$sum: '$wTracksDev.worked'},
            name         : 1,
            workflow     : 1,
            type         : 1,
            project      : 1,
            budget       : 1,
            quotation    : 1,
            invoice      : 1,
            salesmanagers: {
                $filter: {
                    input: '$projectMembers',
                    as   : 'projectMember',
                    cond : salesManagerMatchForDashboard
                }
            },

            payment: {
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
            hoursQA     : 1,
            hoursDesign : 1,
            hoursIOS    : 1,
            hoursAndroid: 1,
            hoursUnity  : 1,
            hoursDotNet : 1,
            hoursROR    : 1,
            hoursWeb    : 1,
            hoursDev    : 1,
            salesManager: {$arrayElemAt: ['$salesmanagers', 0]}
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
            order       : 1,
            name        : 1,
            workflow    : 1,
            type        : 1,
            project     : 1,
            budget      : 1,
            quotation   : 1,
            invoice     : 1,
            payment     : 1,
            hoursQA     : 1,
            hoursDesign : 1,
            hoursIOS    : 1,
            hoursAndroid: 1,
            hoursUnity  : 1,
            hoursDotNet : 1,
            hoursWeb    : 1,
            hoursROR    : 1,
            hoursDev    : 1,
            salesManager: {$arrayElemAt: ['$salesManager', 0]}
        }
    }];

    var aggregateArrForJobsDashboard = [{
        $lookup: {
            from        : 'Employees',
            localField  : 'sourceDocument.employee',
            foreignField: '_id',
            as          : 'employee'
        }
    }, {
        $project: {
            employee: {$arrayElemAt: ['$employee', 0]},
            debit   : 1
        }
    }, {
        $project: {
            department: '$employee.department',
            debit     : 1
        }
    }, {
        $group: {
            _id     : null,
            elements: {
                $addToSet: {
                    _id       : '$_id',
                    department: '$department',
                    debit     : '$debit'
                }
            }
        }
    }, {
        $project: {
            cost  : '$elements',
            costQA: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId(CONSTANTS.QADEPARTMENT)]}
                }
            },

            costDesign: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId(CONSTANTS.DESDEPARTMENT)]}
                }
            },

            costIOS: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f00000f')]}
                }
            },

            costAndroid: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f000010')]}
                }
            },

            costUnity: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId('56e175c4d62294582e10ca68')]}
                }
            },

            costDotNet: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f000012')]}
                }
            },

            costWeb: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {
                        $or: [{$eq: ['$$el.department', objectId('56802eb31afe27f547b7ba52')]},
                            {$eq: ['$$el.department', objectId('56802e9d1afe27f547b7ba51')]},
                            {$eq: ['$$el.department', objectId('56802ec21afe27f547b7ba53')]},
                            {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f000016')]}]
                    }
                }
            },

            costDev: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {
                        $and: [{$ne: ['$$el.department', objectId(CONSTANTS.DESDEPARTMENT)]},
                            {$ne: ['$$el.department', objectId(CONSTANTS.QADEPARTMENT)]}]
                    }
                }
            },

            costROR: {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId('566ee11b8453e8b464b70b73')]}
                }
            }
        }
    }, {
        $project: {}
    }];

    this.create = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var data = req.body;
        var newModel;
        var jobId;
        var projectId;
        var productType = data.productType;
        var warehouse = data.warehouse;
        var categoryIds = data.categoryIds;
        var body;

        data.workflow = CONSTANTS.JOBSINPROGRESS;
        data.type = 'Not Ordered';
        data.wTracks = [];

        data.project = objectId(data.project);

        data.createdBy = {
            user: req.session.uId,
            date: new Date()
        };

        delete data.productType;

        newModel = new JobsModel(data);

        newModel.save(function (err, model) {
            if (err) {
                return next(err);
            }

            body = {
                job      : model._id,
                warehouse: warehouse,
                name     : model.name,
                info     : {
                    productType: productType,
                    categories : categoryIds
                }
            };

            ProductService.createProduct({
                body  : body,
                dbName: req.session.lastDb,
                uId   : req.session.uId
            }, function (err, product) {
                if (err) {
                    return next(err);
                }

                AvailabilityService.createAvailabilityJob({product: product._id});
            });

            res.status(200).send({success: model});
        });
    };

    this.getData = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var JournalEntryModel = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var queryObject;
        var queryObjectStage2 = {};
        var ArrayTasks = [];
        var data = req.query;
        var forDashboard = data.forDashboard;
        var sort = {'budget.budgetTotal.costSum': -1};
        var count = parseInt(data.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        var page = parseInt(data.page, 10);
        var skip;
        var sortKey;
        var key;
        var i;
        var salesManagerMatch = {
            $and: [
                {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]},
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

        var filter = data.filter || {};

        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
        skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (data.sort) {
            sort = {};
            sortKey = Object.keys(data.sort);
            for (i = sortKey.length - 1; i >= 0; i--) {
                key = sortKey[i];
                sort[key] = parseInt(data.sort[key], 10);
            }
        }

        if (data && data.project) {
            filter.project = {};
            filter.project.key = 'project._id';
            filter.project.value = objectId(data.project);
        }

        if (filter && typeof filter === 'object') {
            queryObject = filterMapper.mapFilter(filter, {
                contentType: 'jobsDashboard'
            });
        }

        if (forDashboard) { // add for jobsDash need refactor
            queryObjectStage2.$or = [];
            queryObjectStage2.$or.push({type: 'Not Ordered'});
            queryObjectStage2.$or.push({'invoice._type': 'Invoices'});
            queryObjectStage2.$or.push({quotation: {$exists: true}});
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
                    from        : 'wTrack',
                    localField  : '_id',
                    foreignField: 'jobs',
                    as          : 'wTracksDocs'
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
                    name     : 1,
                    employee : {$arrayElemAt: ['$employee', 0]},
                    cost     : {$arrayElemAt: ['$journalEntries.cost', 0]},
                    workflow : {$arrayElemAt: ['$workflow', 0]},
                    wTracksQa: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId(CONSTANTS.QADEPARTMENT)]}
                        }
                    },

                    wTracksDesign: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId(CONSTANTS.DESDEPARTMENT)]}
                        }
                    },

                    wTracksIOS: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId('55b92ace21e4b7c40f00000f')]}
                        }
                    },

                    wTracksAndroid: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId('55b92ace21e4b7c40f000010')]}
                        }
                    },

                    wTracksUnity: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId('56e175c4d62294582e10ca68')]}
                        }
                    },

                    wTracksDotNet: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId('55b92ace21e4b7c40f000012')]}
                        }
                    },

                    wTracksWeb: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {
                                $or: [{$eq: ['$$wTrack.department', objectId('56802eb31afe27f547b7ba52')]},
                                    {$eq: ['$$wTrack.department', objectId('56802e9d1afe27f547b7ba51')]},
                                    {$eq: ['$$wTrack.department', objectId('56802ec21afe27f547b7ba53')]},
                                    {$eq: ['$$wTrack.department', objectId('55b92ace21e4b7c40f000016')]}]
                            }
                        }
                    },

                    wTracksDev: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {
                                $and: [{$ne: ['$$wTrack.department', objectId(CONSTANTS.DESDEPARTMENT)]},
                                    {$ne: ['$$wTrack.department', objectId(CONSTANTS.QADEPARTMENT)]}]
                            }
                        }
                    },

                    wTracksROR: {
                        $filter: {
                            input: '$wTracksDocs',
                            as   : 'wTrack',
                            cond : {$eq: ['$$wTrack.department', objectId('566ee11b8453e8b464b70b73')]}
                        }
                    },

                    type          : 1,
                    wTracks       : 1,
                    project       : {$arrayElemAt: ['$project', 0]},
                    budget        : 1,
                    quotation     : {$arrayElemAt: ['$quotation', 0]},
                    invoice       : {$arrayElemAt: ['$invoice', 0]},
                    projectMembers: 1
                }
            }, {
                $lookup: {
                    from        : 'Payment',
                    localField  : 'invoice._id',
                    foreignField: 'invoice',
                    as          : 'payments'
                }
            }, {
                $project: {
                    order: {
                        $cond: {
                            if: {
                                $eq: ['$type', 'Not Ordered']
                            },

                            then: -1,
                            else: {
                                $cond: {
                                    if: {
                                        $eq: ['$type', 'Quoted']
                                    },

                                    then: 0,
                                    else: 1
                                }
                            }
                        }
                    },

                    hoursQA      : {$sum: '$wTracksQa.worked'},
                    hoursDesign  : {$sum: '$wTracksDesign.worked'},
                    hoursIOS     : {$sum: '$wTracksIOS.worked'},
                    hoursAndroid : {$sum: '$wTracksAndroid.worked'},
                    hoursUnity   : {$sum: '$wTracksUnity.worked'},
                    hoursDotNet  : {$sum: '$wTracksDotNet.worked'},
                    hoursWeb     : {$sum: '$wTracksWeb.worked'},
                    hoursROR     : {$sum: '$wTracksROR.worked'},
                    hoursDev     : {$sum: '$wTracksDev.worked'},
                    name         : 1,
                    workflow     : 1,
                    type         : 1,
                    project      : 1,
                    budget       : 1,
                    quotation    : 1,
                    invoice      : 1,
                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : salesManagerMatch
                        }
                    },

                    payment: {
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
                    hoursQA     : 1,
                    hoursDesign : 1,
                    hoursIOS    : 1,
                    hoursAndroid: 1,
                    hoursUnity  : 1,
                    hoursDotNet : 1,
                    hoursROR    : 1,
                    hoursWeb    : 1,
                    hoursDev    : 1,
                    salesmanager: {$arrayElemAt: ['$salesmanagers', 0]}
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesmanager.employeeId',
                    foreignField: '_id',
                    as          : 'salesmanager'
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
                    hoursQA     : 1,
                    hoursDesign : 1,
                    hoursIOS    : 1,
                    hoursAndroid: 1,
                    hoursUnity  : 1,
                    hoursDotNet : 1,
                    hoursWeb    : 1,
                    hoursROR    : 1,
                    hoursDev    : 1,
                    salesManager: {$arrayElemAt: ['$salesmanager', 0]}
                }
            }, {
                $match: queryObject
            }, {
                $match: queryObjectStage2
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    _id                : '$root._id',
                    order              : '$root.order',
                    name               : '$root.name',
                    'workflow._id'     : '$root.workflow._id',
                    'workflow.name'    : '$root.workflow.name',
                    'workflow.status'  : '$root.workflow.status',
                    type               : '$root.type',
                    'project._id'      : '$root.project._id',
                    'project.name'     : '$root.project.name',
                    budget             : '$root.budget',
                    quotation          : '$root.quotation.paymentInfo.total',
                    invoice            : '$root.invoice.paymentInfo.total',
                    payment            : '$root.payment',
                    hoursQA            : '$root.hoursQA',
                    hoursDesign        : '$root.hoursDesign',
                    hoursIOS           : '$root.hoursIOS',
                    hoursAndroid       : '$root.hoursAndroid',
                    hoursUnity         : '$root.hoursUnity',
                    hoursDotNet        : '$root.hoursDotNet',
                    hoursWeb           : '$root.hoursWeb',
                    hoursROR           : '$root.hoursROR',
                    hoursDev           : '$root.hoursDev',
                    'salesManager._id' : '$root.salesManager._id',
                    'salesManager.name': '$root.salesManager.name',
                    total              : 1
                }
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
                    var aggregateArr;

                    ArrayTasks = ['cost', 'costQA', 'costDesign', 'costIOS', 'costAndroid',
                        'costUnity', 'costDotNet', 'costWeb', 'costROR', 'costDev'];

                    aggregateArr = [{
                        $match: {
                            'sourceDocument.model': 'wTrack',
                            'sourceDocument._id'  : job._id
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'sourceDocument.employee',
                            foreignField: '_id',
                            as          : 'employee'
                        }
                    }, {
                        $project: {
                            employee: {$arrayElemAt: ['$employee', 0]},
                            debit   : 1
                        }
                    }, {
                        $project: {
                            department: '$employee.department',
                            debit     : 1
                        }
                    }, {
                        $group: {
                            _id     : null,
                            elements: {
                                $addToSet: {
                                    _id       : '$_id',
                                    department: '$department',
                                    debit     : '$debit'
                                }
                            }
                        }
                    }, {
                        $project: {
                            cost: '$elements',

                            costQA: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId(CONSTANTS.QADEPARTMENT)]}
                                }
                            },

                            costDesign: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId(CONSTANTS.DESDEPARTMENT)]}
                                }
                            },

                            costIOS: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f00000f')]}
                                }
                            },

                            costAndroid: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f000010')]}
                                }
                            },

                            costUnity: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId('56e175c4d62294582e10ca68')]}
                                }
                            },

                            costDotNet: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f000012')]}
                                }
                            },

                            costWeb: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {
                                        $or: [{$eq: ['$$el.department', objectId('56802eb31afe27f547b7ba52')]},
                                            {$eq: ['$$el.department', objectId('56802e9d1afe27f547b7ba51')]},
                                            {$eq: ['$$el.department', objectId('56802ec21afe27f547b7ba53')]},
                                            {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f000016')]}]
                                    }
                                }
                            },

                            costDev: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {
                                        $and: [{$ne: ['$$el.department', objectId(CONSTANTS.DESDEPARTMENT)]},
                                            {$ne: ['$$el.department', objectId(CONSTANTS.QADEPARTMENT)]}]
                                    }
                                }
                            },

                            costROR: {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId('566ee11b8453e8b464b70b73')]}
                                }
                            }
                        }
                    }, {
                        $project: {}
                    }];
                    /* ArrayTasks.forEach(function (el) {
                     aggregateArr[2].$project[el] = {
                     $filter: {
                     input: '$elements',
                     as   : 'element',
                     cond : {$setIsSubset: [['$$element.sourceDocument'], job[el]]}
                     }

                     };
                     });*/
                    ArrayTasks.forEach(function (el) {
                        var name = '$' + el + '.debit';
                        aggregateArr[aggregateArr.length - 1].$project[el] = {$sum: name};
                    });

                    JournalEntryModel.aggregate(aggregateArr, function (err, result) {
                        if (err) {
                            cb(err);
                        }

                        ArrayTasks.forEach(function (el) {
                            job[el] = result[0] ? result[0][el] : 0;
                        });

                        job.margin = job.quotation ? ((1 - job.cost / job.quotation) * 100) : 0;
                        job.devMargin = job.quotation ? ((1 - job.costDev / job.quotation) * 100) : 0;
                        job.avDevRate = job.quotation && job.hoursDev ? ((job.quotation - job.costQA - job.costDesign) / (100 * job.hoursDev)) : 0;
                        job.profit = job.quotation ? ((job.quotation - job.cost) / 100) : 0;

                        cb();
                    });

                }, function (err, result) {
                    var sortField = Object.keys(sort)[0];
                    var sortingFields = ['profit', 'margin', 'devMargin', 'avDevRate', 'cost', 'costQA', 'costDesign', 'costIOS', 'costAndroid', 'costUnity', 'costDotNet', 'costWeb', 'costROR', 'costDev'];
                    var count;
                    var response = {};

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
                            }

                            return compareField(b, a);
                        });
                    }
                    count = jobs[0] && jobs[0].total ? jobs[0].total : 0;

                    response.total = count;
                    response.data = jobs;
                    res.status(200).send(response);
                });

            });
    };

    this.exportToCsv = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var JournalEntryModel = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var queryObject = {};
        var queryObjectStage2 = {};
        var ArrayTasks = [];
        var sort = {'budget.budgetTotal.costSum': -1};
        var query = [];
        var i;
        var data = req.query;
        var forDashboard = data.forDashboard;

        var filter = data.filter ? JSON.parse(data.filter) : JSON.stringify({});

        if (data && data.project) {
            filter.project = {};
            filter.project.key = 'project._id';
            filter.project.value = objectId(data.project);
        }

        if (filter && typeof filter === 'object') {
            queryObject = filterMapper.mapFilter(filter, {
                contentType: 'jobsDashboard'
            });
        }

        if (forDashboard) { // add for jobsDash need refactor
            queryObjectStage2.$or = [];
            queryObjectStage2.$or.push({type: 'Not Ordered'});
            queryObjectStage2.$or.push({'invoice._type': 'Invoices'});
            queryObjectStage2.$or.push({quotation: {$exists: true}});
        }

        for (i = 0; i < JobsDashboardAggregateBeforeFilter.length; i++) {
            query.push(JobsDashboardAggregateBeforeFilter[i]);
        }

        query.push(
            {
                $match: queryObject
            }, {
                $match: queryObjectStage2
            }, {
                $sort: sort
            }, {
                $project: {
                    order       : 1,
                    name        : 1,
                    workflow    : '$workflow.name',
                    type        : 1,
                    project     : '$project.name',
                    budget      : 1,
                    quotation   : 1,
                    invoice     : 1,
                    payment     : 1,
                    hoursQA     : 1,
                    hoursDesign : 1,
                    hoursIOS    : 1,
                    hoursAndroid: 1,
                    hoursUnity  : 1,
                    hoursDotNet : 1,
                    hoursWeb    : 1,
                    hoursROR    : 1,
                    hoursDev    : 1,
                    salesManager: {$concat: ['$salesManager.name.first', ' ', '$salesManager.name.last']}
                }
            });

        JobsModel
            .aggregate(query,
                function (err, jobs) {
                    if (err) {
                        return next(err);
                    }

                    async.each(jobs, function (job, cb) {
                        var i;
                        var aggregateArr = [{
                            $match: {
                                'sourceDocument.model': 'wTrack',
                                'sourceDocument._id'  : job._id
                            }
                        }];

                        ArrayTasks = ['cost', 'costQA', 'costDesign', 'costIOS', 'costAndroid', 'costUnity', 'costDotNet', 'costWeb', 'costROR', 'costDev'];

                        for (i = 0; i < aggregateArrForJobsDashboard.length; i++) {
                            aggregateArr.push(aggregateArrForJobsDashboard[i]);
                        }
                        /* ArrayTasks.forEach(function (el) {
                         aggregateArr[2].$project[el] = {
                         $filter: {
                         input: '$elements',
                         as   : 'element',
                         cond : {$setIsSubset: [['$$element.sourceDocument'], job[el]]}
                         }

                         };
                         });*/
                        ArrayTasks.forEach(function (el) {
                            var name = '$' + el + '.debit';
                            aggregateArr[aggregateArr.length - 1].$project[el] = {$sum: name};
                        });
                        JournalEntryModel.aggregate(aggregateArr, function (err, result) {
                            if (err) {
                                cb(err);
                            }
                            ArrayTasks.forEach(function (el) {
                                job[el] = result[0] ? result[0][el] : 0;
                            });
                            job.margin = job.quotation ? ((1 - job.cost / job.quotation.paymentInfo.total) * 100) : 0;
                            job.devMargin = job.quotation ? ((1 - job.costDev / job.quotation.paymentInfo.total) * 100) : 0;
                            job.avDevRate = job.quotation && job.hoursDev ? ((job.quotation.paymentInfo.total - job.costQA - job.costDesign) / (100 * job.hoursDev)) : 0;
                            job.profit = job.quotation ? ((job.quotation.paymentInfo.total - job.cost) / 100) : 0;
                            job.invoice = job.invoice ? (job.invoice.paymentInfo.total / 100).toFixed(2) : 0;
                            job.count = job.payment ? job.payment.count : 0;
                            job.payment = job.payment ? (job.payment.paid / 100).toFixed(2) : 0;
                            job.quotation = job.quotation ? (job.quotation.paymentInfo.total / 100).toFixed(2) : 0;
                            delete job.budget;

                            ArrayTasks.forEach(function (el) {
                                job[el] = (job[el] / 100).toFixed(2);
                            });

                            cb();
                        });

                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                        exporter.exportToCsv({
                            res        : res,
                            next       : next,
                            Model      : JobsModel,
                            resultArray: jobs,
                            map        : exportMap,
                            fileName   : 'jobsDashboard'
                        });
                    });

                }
            );
    };

    this.exportToXlsx = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var JournalEntryModel = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var queryObject = {};
        var queryObjectStage2 = {};
        var ArrayTasks = [];
        var sort = {'budget.budgetTotal.costSum': -1};
        var query = [];
        var data = req.query;
        var forDashboard = data.forDashboard;
        var filter = data.filter ? JSON.parse(data.filter) : JSON.stringify({});
        var i;

        if (data && data.project) {
            filter.project = {};
            filter.project.key = 'project._id';
            filter.project.value = objectId(data.project);
        }

        if (filter && typeof filter === 'object') {
            queryObject = filterMapper.mapFilter(filter, {
                contentType: 'jobsDashboard'
            });
        }

        if (forDashboard) { // add for jobsDash need refactor
            queryObjectStage2.$or = [];
            queryObjectStage2.$or.push({type: 'Not Ordered'});
            queryObjectStage2.$or.push({'invoice._type': 'Invoices'});
            queryObjectStage2.$or.push({quotation: {$exists: true}});
        }

        for (i = 0; i < JobsDashboardAggregateBeforeFilter.length; i++) {
            query.push(JobsDashboardAggregateBeforeFilter[i]);
        }

        query.push(
            {
                $match: queryObject
            }, {
                $match: queryObjectStage2
            }, {
                $sort: sort
            }, {
                $project: {
                    order       : 1,
                    name        : 1,
                    workflow    : '$workflow.name',
                    type        : 1,
                    project     : '$project.name',
                    budget      : 1,
                    quotation   : 1,
                    invoice     : 1,
                    payment     : 1,
                    hoursQA     : 1,
                    hoursDesign : 1,
                    hoursIOS    : 1,
                    hoursAndroid: 1,
                    hoursUnity  : 1,
                    hoursDotNet : 1,
                    hoursWeb    : 1,
                    hoursROR    : 1,
                    hoursDev    : 1,
                    salesManager: {$concat: ['$salesManager.name.first', ' ', '$salesManager.name.last']}
                }
            });

        JobsModel
            .aggregate(query,
                function (err, jobs) {
                    if (err) {
                        return next(err);
                    }

                    async.each(jobs, function (job, cb) {
                        var i;
                        var aggregateArr = [{
                            $match: {
                                'sourceDocument.model': 'wTrack',
                                'sourceDocument._id'  : job._id
                            }
                        }];

                        ArrayTasks = ['cost', 'costQA', 'costDesign', 'costIOS', 'costAndroid', 'costUnity', 'costDotNet', 'costWeb', 'costROR', 'costDev'];

                        for (i = 0; i < aggregateArrForJobsDashboard.length; i++) {
                            aggregateArr.push(aggregateArrForJobsDashboard[i]);
                        }
                        /* ArrayTasks.forEach(function (el) {
                         aggregateArr[2].$project[el] = {
                         $filter: {
                         input: '$elements',
                         as   : 'element',
                         cond : {$setIsSubset: [['$$element.sourceDocument'], job[el]]}
                         }

                         };
                         });*/
                        ArrayTasks.forEach(function (el) {
                            var name = '$' + el + '.debit';
                            aggregateArr[aggregateArr.length - 1].$project[el] = {$sum: name};
                        });
                        JournalEntryModel.aggregate(aggregateArr, function (err, result) {
                            if (err) {
                                cb(err);
                            }
                            ArrayTasks.forEach(function (el) {
                                job[el] = result[0] ? result[0][el] : 0;
                            });
                            job.margin = job.quotation ? ((1 - job.cost / job.quotation.paymentInfo.total) * 100) : 0;
                            job.devMargin = job.quotation ? ((1 - job.costDev / job.quotation.paymentInfo.total) * 100) : 0;
                            job.avDevRate = job.quotation && job.hoursDev ? ((job.quotation.paymentInfo.total - job.costQA - job.costDesign) / (100 * job.hoursDev)) : 0;
                            job.profit = job.quotation ? ((job.quotation.paymentInfo.total - job.cost) / 100) : 0;
                            job.invoice = job.invoice ? (job.invoice.paymentInfo.total / 100).toFixed(2) : 0;
                            job.count = job.payment ? job.payment.count : 0;
                            job.payment = job.payment ? (job.payment.paid / 100).toFixed(2) : 0;
                            job.quotation = job.quotation ? (job.quotation.paymentInfo.total / 100).toFixed(2) : 0;
                            delete job.budget;

                            ArrayTasks.forEach(function (el) {
                                job[el] = (job[el] / 100).toFixed(2);
                            });

                            cb();
                        });

                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                        exporter.exportToXlsx({
                            res        : res,
                            next       : next,
                            Model      : JobsModel,
                            resultArray: jobs,
                            map        : exportMap,
                            fileName   : 'jobsDashboard'
                        });
                    });

                }
            );
    };

    this.getAsyncData = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var ProjectMemberModel = models.get(req.session.lastDb, 'ProjectMember', ProjectMembersSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var query = req.query;
        var _id = query._id || null;
        var filter = query.filter;
        var matchObject = {};

        if (filter && typeof filter === 'object') {
            matchObject = filterMapper.mapFilter(filter, {
                contentType: 'projectsDashboard'
            });
        }

        if (_id) {
            ProjectMemberModel.aggregate([{
                $match: {
                    employeeId       : objectId(_id),
                    projectPositionId: objectId(CONSTANTS.PROJECTSMANAGER)
                }
            }, {
                $lookup: {
                    from        : 'jobs',
                    localField  : 'projectId',
                    foreignField: 'project',
                    as          : 'jobs'
                }
            }, {
                $project: {
                    projectId: 1,
                    startDate: 1,
                    endDate  : 1,
                    jobs     : {
                        $filter: {
                            input: '$jobs',
                            as   : 'job',
                            cond : {
                                $or: [{
                                    $and: [{
                                        $gte: ['$$job.createdBy.date', '$startDate']
                                    }, {
                                        $lte: ['$$job.createdBy.date', '$endDate']
                                    }]
                                }, {$eq: ['$startDate', null]},
                                    {$eq: ['$endDate', null]}
                                ]
                            }
                        }
                    }
                }
            }, {
                $unwind: '$jobs'
            }, {
                $lookup: {
                    from        : 'Project',
                    localField  : 'jobs.project',
                    foreignField: '_id',
                    as          : 'jobs.project'
                }
            }, {
                $lookup: {
                    from        : 'Invoice',
                    localField  : 'jobs.invoice',
                    foreignField: '_id',
                    as          : 'jobs.invoice'
                }
            }, {
                $lookup: {
                    from        : 'Quotation',
                    localField  : 'jobs.quotation',
                    foreignField: '_id',
                    as          : 'jobs.quotation'
                }
            }, {
                $project: {
                    'jobs.invoice'  : {$arrayElemAt: ['$jobs.invoice', 0]},
                    'jobs.quotation': {$arrayElemAt: ['$jobs.quotation', 0]},
                    'jobs.project'  : {$arrayElemAt: ['$jobs.project', 0]},
                    'jobs.name'     : '$jobs.name',
                    workflow        : '$jobs.workflow',
                    type            : '$jobs.type'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'jobs.project.customer',
                    foreignField: '_id',
                    as          : 'jobs.customer'
                }
            }, {
                $project: {
                    workflow           : 1,
                    type               : 1,
                    'project._id'      : '$jobs.project._id',
                    customer           : {$arrayElemAt: ['$jobs.customer', 0]},
                    'jobs.invoice'     : 1,
                    'jobs.quotation'   : 1,
                    'jobs.project._id' : '$jobs.project._id',
                    'jobs.project.name': '$jobs.project.name',
                    'jobs.customer'    : {$arrayElemAt: ['$jobs.customer', 0]},
                    'jobs.name'        : 1
                }
            }, {
                $match: matchObject
            }, {
                $project: {
                    'jobs.invoice'      : 1,
                    'jobs.quotation'    : 1,
                    'jobs.project'      : 1,
                    'jobs.customer._id' : '$jobs.customer._id',
                    'jobs.customer.name': {$concat: ['$jobs.customer.name.first', ' ', '$jobs.customer.name.last']},
                    'jobs.name'         : 1
                }
            }, {
                $sort: {
                    'jobs.project.name': 1
                }
            }, {
                $group: {
                    _id : null,
                    jobs: {$push: '$jobs'}
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result[0] ? result[0].jobs : []});
            });
        } else {
            Project.aggregate([{
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
                }
            }, {
                $project: {
                    name          : 1,
                    customer      : 1,
                    projectManager: {
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
                    }
                }
            }, {
                $match: {
                    projectManager: []
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
                    from        : 'jobs',
                    localField  : '_id',
                    foreignField: 'project',
                    as          : 'jobs'
                }
            }, {
                $project: {
                    jobs    : 1,
                    name    : 1,
                    customer: {$arrayElemAt: ['$customer', 0]}
                }
            }, {
                $unwind: '$jobs'
            }, {
                $lookup: {
                    from        : 'Quotation',
                    localField  : 'jobs.quotation',
                    foreignField: '_id',
                    as          : 'jobs.quotation'
                }
            }, {
                $project: {
                    'jobs.quotation'    : {$arrayElemAt: ['$jobs.quotation', 0]},
                    'jobs.project.name' : '$name',
                    'jobs.project._id'  : '$_id',
                    'jobs.customer.name': {$concat: ['$customer.name.first', ' ', '$customer.name.last']},
                    'jobs.customer._id' : '$customer._id',
                    'jobs.name'         : 1,
                    'jobs.workflow'     : 1,
                    'project._id'       : '$_id',
                    'customer._id'      : '$customer._id',
                    workflow            : '$jobs.workflow',
                    type                : '$jobs.type'
                }
            }, {
                $match: matchObject
            }, {
                $sort: {
                    'jobs.project.name': 1
                }
            }, {
                $group: {
                    _id : null,
                    jobs: {$push: '$jobs'}
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result[0] ? result[0].jobs : []});
            });
        }
    };

    this.getForProjectsDashboard = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var query = req.query;
        var filter = query.filter;
        var matchObject = {};

        if (filter && typeof filter === 'object') {
            matchObject = filterMapper.mapFilter(filter, {
                contentType: 'projectsDashboard'
            });
        }

        JobsModel.aggregate([{
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
            $project: {
                workflow      : 1,
                type          : 1,
                project       : {$arrayElemAt: ['$project', 0]},
                projectManager: {
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
                }
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'project.customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $project: {
                workflow      : 1,
                type          : 1,
                customer      : {$arrayElemAt: ['$customer', 0]},
                'project._id' : 1,
                projectManager: {$arrayElemAt: ['$projectManager', 0]}
            }
        }, {
            $match: matchObject
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'projectManager.employeeId',
                foreignField: '_id',
                as          : 'projectManagerEmployee'
            }
        }, {
            $project: {
                projectManager: {$arrayElemAt: ['$projectManagerEmployee', 0]}
            }
        }, {
            $lookup: {
                from        : 'JobPosition',
                localField  : 'projectManager.jobPosition',
                foreignField: '_id',
                as          : 'projectManager.jobPosition'
            }
        }, {
            $project: {
                'projectManager.jobPosition': {$arrayElemAt: ['$projectManager.jobPosition', 0]},
                'projectManager.name'       : {$concat: ['$projectManager.name.first', ' ', '$projectManager.name.last']},
                'projectManager._id'        : 1
            }
        }, {
            $group: {
                _id      : '$projectManager',
                jobsCount: {$sum: 1}
            }
        }, {
            $sort: {jobsCount: -1}
        }], function (err, jobs) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: jobs});
        });
    };

    function getForOverview(req, res, next, options) {
        var projectId = req.params.id;
        var match = {
            project: objectId(projectId)
        };
        var query = options ? options.query : null;
        var opt = {
            dbName: req.session.lastDb,
            query : query || match
        };

        jobsService.getForOverview(opt, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });

    }

    this.getForOverview = function (req, res, next) {
        getForOverview(req, res, next);
    };

    this.getForDD = function (req, res, next) {
        var pId = req.query.projectId;
        var notPayed = req.query.notPayed;
        var query = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var all = req.query.all;
        var queryObj;

        if (!pId || !pId.length) {
            return res.status(200).send([]);
        }

        queryObj = {type: 'Not Ordered', project: objectId(pId)};

        if (all) {
            queryObj = {project: objectId(pId)};
        }
        if (notPayed) {
            queryObj = {workflow: {$ne: objectId('56337c675d49d8d6537832ea')}, project: objectId(pId)};
        }

        query.find(queryObj, {
            name       : 1,
            _id        : 1,
            budget     : 1,
            description: 1
        }, function (err, jobs) {
            if (err) {
                return next(err);
            }

            res.status(200).send(jobs);
        });
    };

    this.remove = function (req, res, next) {
        var dbName = req.session.lastDb;
        var JobsModel = models.get(dbName, 'jobs', JobsSchema);
        var wTrack = models.get(dbName, 'wTrack', wTrackSchema);
        var id = req.params._id;
        var waterfallTasks;
        var removeWTrack;
        var removeProduct;

        JobsModel.findByIdAndRemove(id, function (err, result) {
            var jobId;

            if (err) {
                return next(err);
            }

            if (result) {
                jobId = result.get('_id');

                removeProduct = function (cb) {
                    var product;

                    async.waterfall([
                        function (wCb) {
                            var options = {
                                dbName: dbName,
                                query : {job: jobId}
                            };

                            ProductService.findOneAndRemove(options, wCb);
                        },

                        /*function (opt, wCb) {
                            var options = {
                                dbName   : dbName,
                                query    : {_id: {$in: opt.categoriesIds}},
                                setObject: {$inc: {productsCount: -1}}
                            };

                            product = opt.product;

                            ProductCategoryService.update(options, wCb);

                        },*/

                        function (wCb) {
                            var options = {
                                dbName: dbName,
                                query : {product: product}
                            };

                            ProductPriceService.remove(options, wCb);
                        },

                        function (wCb) {
                            var options = {
                                dbName: dbName,
                                query : {'sourceDocument._id': product}
                            };

                            JournalEntryService.remove(options, wCb);
                        }
                    ], function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null);
                    });

                };

                removeWTrack = function (cb) {
                    wTrack.remove({jobs: jobId}, function (err, result) {
                        if (err) {
                            return cb(err);
                        }
                        cb();

                        event.emit('recollectVacationDash', {dbName: dbName});
                    });

                };

                waterfallTasks = [removeProduct, removeWTrack];

                async.waterfall(waterfallTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            }
            else {
                res.status(200).send(result);
            }

        });
    };

    this.update = function (req, res, next) {
        var dbName = req.session.lastDb;
        var JobsModel = models.get(dbName, 'jobs', JobsSchema);
        var data = req.body;
        var id = data._id;
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };
        var project;
        var query;
        var products;
        var type;

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
                var waterFallTasks;

                var workflow = result && result.workflow ? result.workflow.toJSON() : null;
                if (err) {
                    return next(err);
                }

                function createCosts(wCb) {
                    _journalEntryHandler.createCostsForJob({
                        req     : req,
                        jobId   : objectId(id),
                        workflow: CONSTANTS.JOBSFINISHED,
                        callback: wCb
                    });
                }

                function getJobCosts(wCb) {

                    JobsModel
                        .aggregate([{
                            $match: {
                                _id: objectId(id)
                            }
                        }, {
                            $lookup: {
                                from        : 'Products',
                                localField  : '_id',
                                foreignField: 'job',
                                as          : 'product'
                            }
                        }, {
                            $project: {
                                product: {$arrayElemAt: ['$product', 0]}
                            }
                        }, {
                            $lookup: {
                                from        : 'journalentries',
                                localField  : 'product._id',
                                foreignField: 'sourceDocument._id',
                                as          : 'journalentries'
                            }
                        }, {
                            $unwind: {
                                path                      : '$journalentries',
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $group: {
                                _id : '$_id',
                                cost: {$sum: '$journalentries.debit'}
                            }
                        }], function (err, result) {
                            var cost;

                            if (err) {
                                return wCb(err);
                            }

                            cost = result && result.length ? result[0].cost : 0;

                            wCb(null, cost);
                        });
                }

                function findAvailabilty(cost, wCb) {
                    var options = {
                        dbName: dbName,
                        job   : id
                    };

                    ProductService.getAvailabilityByJob(options, function (err, opt) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, {
                            id     : opt._id,
                            account: opt.account,
                            cost   : cost
                        });
                    });
                }

                function updateAvailabilty(data, wCb) {
                    var options = {
                        dbName: dbName,
                        id    : data.id,
                        body  : {
                            onHand: 1,
                            cost  : data.cost
                        }
                    };

                    AvailabilityService.updateById(options, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, data);
                    });
                }

                function callBack(err) {
                    if (err) {
                        return next(err);
                    }

                    event.emit('recollectVacationDash', {dbName: dbName});

                    res.status(200).send(result);
                }

                waterFallTasks = [createCosts, getJobCosts, findAvailabilty, updateAvailabilty];

                if (workflow === CONSTANTS.JOBSFINISHED) {
                    async.waterfall(waterFallTasks, callBack);
                } else {
                    callBack();
                }
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
                    event.emit('fetchJobsCollection', {project: project, dbName: dbName});
                }

                event.emit('recollectVacationDash', {dbName: dbName});
            });
        }
    };

    this.getForJournalSource = function (req, res, next) {
        var data = req.query;
        var _id = data._id;
        var query = {_id: objectId(_id)};

        getForOverview(req, res, next, {query: query});
    };
};

module.exports = Module;
