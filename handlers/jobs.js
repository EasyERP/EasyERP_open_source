/*TODO remove caseFilter methid after testing filters*/

var mongoose = require('mongoose');
var async = require('async');

var Module = function (models, event) {
    'use strict';

    var JobsSchema = mongoose.Schemas.jobs;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var QuotationSchema = mongoose.Schemas.Quotation;
    var jobsInvoiceSchema = mongoose.Schemas.wTrackInvoice;
    var ProjectSchema = mongoose.Schemas.Project;
    var PaymentSchema = mongoose.Schemas.Payment;
    var ProjectMembersSchema = mongoose.Schemas.ProjectMember;
    var journalEntrySchema = mongoose.Schemas.journalEntry;
    var CONSTANTS = require('../constants/mainConstants.js');
    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').jobs;
    var objectId = mongoose.Types.ObjectId;
    var FilterMapper = require('../helpers/filterMapper');

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
            order        : {
                $cond: {
                    if: {
                        $eq: ['$type', 'Not Quoted']
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
                    cond : salesManagerMatchForDashboard
                }
            },
            payment      : {
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
            cost      : '$elements',
            costQA    : {
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

            costIOS    : {
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
            costUnity  : {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId('56e175c4d62294582e10ca68')]}
                }
            },
            costDotNet : {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f000012')]}
                }
            },
            costWeb    : {
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
            costDev    : {
                $filter: {
                    input: '$elements',
                    as   : 'el',
                    cond : {
                        $and: [{$ne: ['$$el.department', objectId(CONSTANTS.DESDEPARTMENT)]},
                            {$ne: ['$$el.department', objectId(CONSTANTS.QADEPARTMENT)]}]
                    }
                }
            },
            costROR    : {
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

    /*function caseFilter(filter) {
     var condition;
     var resArray = [];
     var filtrElement = {};
     var key;
     var filterName;
     var filterNameKeys = Object.keys(filter);
     var i;

     for (i = filterNameKeys.length - 1; i >= 0; i--) {
     filterName = filterNameKeys[i];
     condition = filter[filterName].value;
     key = filter[filterName].key;

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
     case 'salesManager':
     filtrElement[key] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'paymentsCount':
     filtrElement[key] = {$in: condition.toNumber()};
     resArray.push(filtrElement);
     break;
     // skip default;
     }
     }

     return resArray;
     }*/

    this.create = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var data = req.body;
        var newModel;
        var jobId;
        var projectId;

        data.workflow = CONSTANTS.JOBSINPROGRESS;
        data.type = 'Not Quoted';
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

            res.status(200).send({success: model});
        });
    };

    this.getData = function (req, res, next) {
        var filterMapper = new FilterMapper();
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
            queryObject = filterMapper.mapFilter(filter, 'jobsDashboard'); // caseFilter(filter);
        }

        if (forDashboard) { // add for jobsDash need refactor
            queryObjectStage2.$or = [];
            queryObjectStage2.$or.push({type: 'Not Quoted'});
            queryObjectStage2.$or.push({'invoice._type': 'wTrackInvoice'});
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
                    order        : {
                        $cond: {
                            if: {
                                $eq: ['$type', 'Not Quoted']
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
                    'quotation'        : '$root.quotation.paymentInfo.total',
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

                    ArrayTasks = ['cost', 'costQA', 'costDesign', 'costIOS', 'costAndroid', 'costUnity', 'costDotNet', 'costWeb', 'costROR', 'costDev'];

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
                            cost      : '$elements',
                            costQA    : {
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

                            costIOS    : {
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
                            costUnity  : {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId('56e175c4d62294582e10ca68')]}
                                }
                            },
                            costDotNet : {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {$eq: ['$$el.department', objectId('55b92ace21e4b7c40f000012')]}
                                }
                            },
                            costWeb    : {
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
                            costDev    : {
                                $filter: {
                                    input: '$elements',
                                    as   : 'el',
                                    cond : {
                                        $and: [{$ne: ['$$el.department', objectId(CONSTANTS.DESDEPARTMENT)]},
                                            {$ne: ['$$el.department', objectId(CONSTANTS.QADEPARTMENT)]}]
                                    }
                                }
                            },
                            costROR    : {
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

        var filterMapper = new FilterMapper();

        var data = req.query;
        var forDashboard = data.forDashboard;

        var filter = data.filter ? JSON.parse(data.filter) : JSON.stringify({});

        if (data && data.project) {
            filter.project = {};
            filter.project.key = 'project._id';
            filter.project.value = objectId(data.project);
        }

        if (filter && typeof filter === 'object') {
            queryObject = filterMapper.mapFilter(filter, 'jobsDashboard'); // caseFilter(filter);
        }

        if (forDashboard) { // add for jobsDash need refactor
            queryObjectStage2.$or = [];
            queryObjectStage2.$or.push({type: 'Not Quoted'});
            queryObjectStage2.$or.push({'invoice._type': 'wTrackInvoice'});
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
        var i;

        var filterMapper = new FilterMapper();

        var data = req.query;
        var forDashboard = data.forDashboard;

        var filter = data.filter ? JSON.parse(data.filter) : JSON.stringify({});

        if (data && data.project) {
            filter.project = {};
            filter.project.key = 'project._id';
            filter.project.value = objectId(data.project);
        }

        if (filter && typeof filter === 'object') {
            queryObject = filterMapper.mapFilter(filter, 'jobsDashboard'); // caseFilter(filter);
        }

        if (forDashboard) { // add for jobsDash need refactor
            queryObjectStage2.$or = [];
            queryObjectStage2.$or.push({type: 'Not Quoted'});
            queryObjectStage2.$or.push({'invoice._type': 'wTrackInvoice'});
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
        var filterMapper = new FilterMapper();

        if (filter && typeof filter === 'object') {
            matchObject = filterMapper.mapFilter(filter, 'projectsDashboard'); // caseFilter(filter);
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
        var filterMapper = new FilterMapper();

        if (filter && typeof filter === 'object') {
            matchObject = filterMapper.mapFilter(filter, 'projectsDashboard'); // caseFilter(filter);
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
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var projectId = req.params.id;
        var data = req.query;
        var match = {
            project: objectId(projectId)
        };
        var query = options ? options.query : null;

        JobsModel
            .aggregate([{
                $match: query || match
            }, {
                $lookup: {
                    from        : 'journalentries',
                    localField  : '_id',
                    foreignField: 'sourceDocument._id',
                    as          : 'journalentries'
                }
            }, {
                $project: {
                    journalentries: {
                        $filter: {
                            input: '$journalentries',
                            as   : 'je',
                            cond : {
                                $or: [{
                                    $eq: ['$$je.journal', objectId('56cc727e541812c07197356c')]
                                }, {
                                    $eq: ['$$je.journal', objectId('56cc734b541812c071973572')]
                                }, {
                                    $eq: ['$$je.journal', objectId('56cc7383541812c071973574')]
                                }]
                            }
                        }
                    },

                    type       : 1,
                    name       : 1,
                    description: 1,
                    project    : 1,
                    invoice    : 1,
                    quotation  : 1,
                    workflow   : 1
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
                    journalentries: 1,
                    type          : 1,
                    name          : 1,
                    description   : 1,
                    project       : {$arrayElemAt: ['$project', 0]},
                    invoice       : {$arrayElemAt: ['$invoice', 0]},
                    quotation     : {$arrayElemAt: ['$quotation', 0]},
                    workflow      : {$arrayElemAt: ['$workflow', 0]}
                }
            }, {
                $project: {
                    journalentries: 1,
                    type          : 1,
                    name          : 1,
                    'project._id' : '$project._id',
                    'project.name': '$project.name',
                    invoice       : {
                        $cond: [{$eq: ['$invoice._type', 'writeOff']}, null, {
                            _id     : '$invoice._id',
                            name    : '$invoice.name',
                            currency: '$invoice.currency'
                        }]
                    },

                    quotation: {
                        _id     : '$quotation._id',
                        name    : '$quotation.name',
                        currency: '$quotation.currency',
                        isOrder : '$quotation.isOrder'
                    },

                    jobPriceQuotation: {
                        $filter: {
                            input: '$quotation.products',
                            as   : 'products',
                            cond : {
                                $eq: ['$$products.jobs', '$_id']
                            }
                        }
                    },

                    jobPriceInvoice: {
                        $filter: {
                            input: '$invoice.products',
                            as   : 'products',
                            cond : {
                                $eq: ['$$products.jobs', '$_id']
                            }
                        }
                    },

                    workflow: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    },

                    description: 1
                }
            }, {
                $project: {
                    journalentries: 1,
                    project       : 1,
                    type          : 1,
                    description   : 1,
                    name          : 1,
                    invoice       : 1,
                    quotation     : 1,
                    workflow      : 1,
                    jobPrice      : {$cond: [{$eq: ['$jobPriceInvoice', null]}, {$arrayElemAt: ['$jobPriceQuotation', 0]}, {$arrayElemAt: ['$jobPriceInvoice', 0]}]}
                }
            }, {
                $unwind: {
                    path                      : '$journalentries',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    _id        : '$_id',
                    name       : {$first: '$name'},
                    invoice    : {$first: '$invoice'},
                    project    : {$first: '$project'},
                    description: {$first: '$description'},
                    type       : {$first: '$type'},
                    quotation  : {$first: '$quotation'},
                    workflow   : {$first: '$workflow'},
                    cost       : {$sum: '$journalentries.debit'},
                    jobPrice   : {$first: '$jobPrice.unitPrice'}
                }
            }, {
                $lookup: {
                    from        : 'wTrack',
                    localField  : '_id',
                    foreignField: 'jobs',
                    as          : 'tCards'
                }
            }, {
                $unwind: {
                    path                      : '$tCards',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $sort: {
                    'tCards.dateByWeek': 1,
                    'tCards.1'         : -1,
                    'tCards.2'         : -1,
                    'tCards.3'         : -1,
                    'tCards.4'         : -1,
                    'tCards.5'         : -1
                }
            }, {
                $project: {
                    name             : 1,
                    invoice          : 1,
                    type             : 1,
                    quotation        : 1,
                    workflow         : 1,
                    description      : 1,
                    cost             : 1,
                    jobPrice         : 1,
                    tCards           : 1,
                    project          : 1,
                    totalQAWorked    : {$cond: [{$eq: ['$tCards.department', objectId('55b92ace21e4b7c40f000011')]}, '$tCards.worked', 0]},
                    totalDesignWorked: {$cond: [{$eq: ['$tCards.department', objectId('55bb1f14cb76ca630b000006')]}, '$tCards.worked', 0]}

                }
            }, {
                $group: {
                    _id              : '$_id',
                    name             : {$first: '$name'},
                    invoice          : {$first: '$invoice'},
                    type             : {$first: '$type'},
                    project          : {$first: '$project'},
                    quotation        : {$first: '$quotation'},
                    workflow         : {$first: '$workflow'},
                    description      : {$first: '$description'},
                    cost             : {$first: '$cost'},
                    jobPrice         : {$first: '$jobPrice'},
                    totalWorked      : {$sum: '$tCards.worked'},
                    tCards           : {$push: '$tCards'},
                    tCardMinDate     : {$first: '$tCards'},
                    tCardMaxDate     : {$last: '$tCards'},
                    totalQAWorked    : {$sum: '$totalQAWorked'},
                    totalDesignWorked: {$sum: '$totalDesignWorked'}
                }
            }, {
                $unwind: {
                    path                      : '$tCards',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    _id: {
                        _id       : '$_id',
                        employee  : '$tCards.employee',
                        department: '$tCards.department'
                    },

                    tCardDateByWeek  : {$last: '$tCards.dateByWeek'},
                    name             : {$first: '$name'},
                    project          : {$first: '$project'},
                    invoice          : {$first: '$invoice'},
                    type             : {$first: '$type'},
                    tCardMinDate     : {$first: '$tCardMinDate'},
                    tCardMaxDate     : {$last: '$tCardMaxDate'},
                    quotation        : {$first: '$quotation'},
                    description      : {$first: '$description'},
                    workflow         : {$first: '$workflow'},
                    cost             : {$first: '$cost'},
                    jobPrice         : {$first: '$jobPrice'},
                    worked           : {$sum: '$tCards.worked'},
                    totalWorked      : {$first: '$totalWorked'},
                    totalQAWorked    : {$first: '$totalQAWorked'},
                    totalDesignWorked: {$first: '$totalDesignWorked'}
                }
            }, {
                $project: {
                    name        : 1,
                    invoice     : 1,
                    type        : 1,
                    quotation   : 1,
                    workflow    : 1,
                    cost        : 1,
                    project     : 1,
                    description : 1,
                    jobPrice    : 1,
                    tCardMinDate: 1,
                    tCardMaxDate: 1,
                    totalWorked : {
                        $cond: [{$eq: ['$totalWorked', 0]}, 1, '$totalWorked']
                    },

                    totalQAWorked    : 1,
                    totalDesignWorked: 1,
                    worked           : 1,
                    tCardDateByWeek  : 1
                }
            }, {
                $project: {
                    name             : 1,
                    invoice          : 1,
                    type             : 1,
                    quotation        : 1,
                    workflow         : 1,
                    project          : 1,
                    cost             : 1,
                    tCardMinDate     : 1,
                    tCardMaxDate     : 1,
                    jobPrice         : 1,
                    totalWorked      : 1,
                    totalQAWorked    : 1,
                    description      : 1,
                    totalDesignWorked: 1,
                    worked           : 1,
                    tCardDateByWeek  : 1,
                    revenue          : {
                        $cond: {
                            if: {
                                $eq: ['$invoice', {}]
                            },

                            then: {
                                $cond: {
                                    if  : {$eq: ['$quotation', {}]},
                                    then: {
                                        $multiply: [{$divide: ['$worked', '$totalWorked']}, '$jobPrice']
                                    },
                                    else: {
                                        $divide: [{$multiply: [{$divide: ['$worked', '$totalWorked']}, '$jobPrice']}, '$quotation.currency.rate']
                                    }
                                }
                            },
                            else: {
                                $divide: [{$multiply: [{$divide: ['$worked', '$totalWorked']}, '$jobPrice']}, '$invoice.currency.rate']
                            }
                        }
                    }
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : '_id.employee',
                    foreignField: '_id',
                    as          : 'employee'
                }
            }, {
                $lookup: {
                    from        : 'Department',
                    localField  : '_id.department',
                    foreignField: '_id',
                    as          : 'department'
                }
            }, {
                $project: {
                    name             : 1,
                    invoice          : 1,
                    type             : 1,
                    quotation        : 1,
                    workflow         : 1,
                    project          : 1,
                    cost             : 1,
                    jobPrice         : 1,
                    tCardMinDate     : 1,
                    description      : 1,
                    tCardMaxDate     : 1,
                    totalWorked      : 1,
                    totalQAWorked    : 1,
                    totalDesignWorked: 1,
                    worked           : 1,
                    revenue          : 1,
                    tCardDateByWeek  : 1,
                    employee         : {
                        $arrayElemAt: ['$employee', 0]
                    },

                    department: {
                        $arrayElemAt: ['$department', 0]
                    }
                }
            }, {
                $lookup: {
                    from        : 'transfers',
                    localField  : 'employee._id',
                    foreignField: 'employee',
                    as          : 'employee.transfer'
                }
            }, {
                $project: {
                    name             : 1,
                    invoice          : 1,
                    type             : 1,
                    quotation        : 1,
                    project          : 1,
                    description      : 1,
                    workflow         : 1,
                    cost             : 1,
                    jobPrice         : 1,
                    totalWorked      : 1,
                    totalQAWorked    : 1,
                    totalDesignWorked: 1,
                    tCardMinDate     : 1,
                    tCardMaxDate     : 1,
                    worked           : 1,
                    revenue          : 1,
                    employee         : 1,
                    department       : '$department.name',

                    transfer: {
                        $filter: {
                            input: '$employee.transfer',
                            as   : 'transfer',
                            cond : {
                                $lte: [{$add: [{$multiply: [{$year: '$$transfer.date'}, 100]}, {$week: '$$transfer.date'}]}, '$tCardDateByWeek']
                            }
                        }
                    }
                }
            }, {
                $unwind: {
                    path                      : '$transfer',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $sort: {
                    'transfer.date': -1
                }
            }, {
                $group: {
                    _id              : '$_id',
                    name             : {
                        $first: '$name'
                    },
                    project          : {
                        $first: '$project'
                    },
                    invoice          : {
                        $first: '$invoice'
                    },
                    type             : {
                        $first: '$type'
                    },
                    quotation        : {
                        $first: '$quotation'
                    },
                    workflow         : {
                        $first: '$workflow'
                    },
                    description      : {
                        $first: '$description'
                    },
                    cost             : {
                        $first: '$cost'
                    },
                    jobPrice         : {
                        $first: '$jobPrice'
                    },
                    tCardMinDate     : {
                        $first: '$tCardMinDate'
                    },
                    tCardMaxDate     : {
                        $first: '$tCardMaxDate'
                    },
                    worked           : {
                        $first: '$worked'
                    },
                    totalWorked      : {
                        $first: '$totalWorked'
                    },
                    revenue          : {
                        $first: '$revenue'
                    },
                    employee         : {
                        $first: '$employee'
                    },
                    department       : {
                        $first: '$department'
                    },
                    transfer         : {
                        $first: '$transfer'
                    },
                    totalQAWorked    : {
                        $first: '$totalQAWorked'
                    },
                    totalDesignWorked: {
                        $first: '$totalDesignWorked'
                    }
                }
            }, {
                $lookup: {
                    from        : 'JobPosition',
                    localField  : 'transfer.jobPosition',
                    foreignField: '_id',
                    as          : 'jobPosition'
                }
            }, {
                $project: {
                    name             : 1,
                    invoice          : 1,
                    type             : 1,
                    quotation        : 1,
                    project          : 1,
                    workflow         : 1,
                    cost             : 1,
                    tCardMinDate     : 1,
                    tCardMaxDate     : 1,
                    description      : 1,
                    jobPrice         : 1,
                    totalWorked      : 1,
                    totalQAWorked    : 1,
                    totalDesignWorked: 1,
                    worked           : 1,
                    revenue          : 1,
                    employee         : 1,
                    department       : 1,
                    jobPosition      : {
                        $arrayElemAt: ['$jobPosition', 0]
                    }
                }
            }, {
                $group: {
                    _id              : '$_id._id',
                    name             : {
                        $first: '$name'
                    },
                    invoice          : {
                        $first: '$invoice'
                    },
                    project          : {
                        $first: '$project'
                    },
                    type             : {
                        $first: '$type'
                    },
                    quotation        : {
                        $first: '$quotation'
                    },
                    workflow         : {
                        $first: '$workflow'
                    },
                    description      : {
                        $first: '$description'
                    },
                    cost             : {
                        $first: '$cost'
                    },
                    tCardMinDate     : {
                        $first: '$tCardMinDate'
                    },
                    tCardMaxDate     : {
                        $first: '$tCardMaxDate'
                    },
                    jobPrice         : {
                        $first: '$jobPrice'
                    },
                    totalWorked      : {
                        $sum: '$worked'
                    },
                    totalQAWorked    : {
                        $first: '$totalQAWorked'
                    },
                    totalDesignWorked: {
                        $first: '$totalDesignWorked'
                    },
                    totalRevenue     : {
                        $sum: '$revenue'
                    },

                    revenue: {
                        $push: {
                            employee: {
                                _id        : '$employee._id',
                                name       : {
                                    $concat: ['$employee.name.first', ' ', '$employee.name.last']
                                },
                                jobPosition: '$jobPosition.name',
                                worked     : '$worked'
                            },

                            department: '$department',
                            revenue   : '$revenue'
                        }
                    }
                }
            }, {
                $project: {
                    name             : 1,
                    invoice          : 1,
                    type             : 1,
                    description      : 1,
                    quotation        : 1,
                    workflow         : 1,
                    cost             : 1,
                    project          : 1,
                    tCardMinDate     : 1,
                    tCardMaxDate     : 1,
                    jobPrice         : 1,
                    totalWorked      : 1,
                    totalQAWorked    : 1,
                    totalDesignWorked: 1,
                    worked           : 1,
                    revenue          : 1,
                    totalRevenue     : 1,
                    profit           : {
                        $subtract: ['$totalRevenue', '$cost']
                    }
                }
            }, {
                $group: {
                    _id         : null,
                    revenueTotal: {
                        $sum: '$totalRevenue'
                    },
                    profitTotal : {
                        $sum: '$profit'
                    },
                    costTotal   : {
                        $sum: '$cost'
                    },
                    workedTotal : {
                        $sum: '$totalWorked'
                    },
                    root        : {
                        $push: '$$ROOT'
                    }
                }
            }, {
                $unwind: {
                    path                      : '$root',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    _id              : '$root._id',
                    name             : '$root.name',
                    invoice          : '$root.invoice',
                    type             : '$root.type',
                    quotation        : '$root.quotation',
                    workflow         : '$root.workflow',
                    cost             : '$root.cost',
                    project          : '$root.project',
                    jobPrice         : '$root.jobPrice',
                    totalWorked      : '$root.totalWorked',
                    worked           : '$root.worked',
                    revenue          : '$root.revenue',
                    totalRevenue     : '$root.totalRevenue',
                    profit           : '$root.profit',
                    tCardMinDate     : '$root.tCardMinDate',
                    tCardMaxDate     : '$root.tCardMaxDate',
                    revenueTotal     : 1,
                    profitTotal      : 1,
                    costTotal        : 1,
                    description      : '$root.description',
                    workedTotal      : 1,
                    totalQAWorked    : '$root.totalQAWorked',
                    totalDesignWorked: '$root.totalDesignWorked'
                }
            }
            ], function (err, jobs) {
                if (err) {
                    return next(err);
                }

                if (query) {
                    return res.status(200).send(jobs.length ? jobs[0] : {});
                }

                res.status(200).send(jobs);
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

        queryObj = {type: 'Not Quoted', project: objectId(pId)};

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

        JobsModel.findByIdAndRemove(id, function (err, result) {
            var jobId;
            var projectId;

            if (err) {
                return next(err);
            }

            if (result) {
                jobId = result.get('_id');
                projectId = result.get('project');

                wTrack.find({jobs: jobId}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    async.each(result, function (wTrackEl, cb) {
                        var _id = wTrackEl.get('_id');

                        wTrack.findByIdAndRemove(_id, function () {
                            cb();
                        });
                    }, function () {
                        event.emit('recollectVacationDash', {dbName: dbName});
                    });

                });
            }

            res.status(200).send(result);
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
                if (err) {
                    return next(err);
                }

                event.emit('recollectVacationDash', {dbName: dbName});

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
