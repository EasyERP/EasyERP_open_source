var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var CONSTANTS = require('../constants/mainConstants.js');
var pageHelper = require('../helpers/pageHelper');
var async = require('async');
var FilterMapper = require('../helpers/filterMapper');

var Countries = function (models) {
    var JobsSchema = mongoose.Schemas.jobs;

    this.getForOverview = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var parallelTasks;
        var filter = data.filter || {};
        var contentType = 'contractJobs';
        var filterMapper = new FilterMapper();
        // var startDate = data.startDate;
        // var endDate = data.endDate;
        // var matchObject = {};
        var sort = data.sort || {_id: -1};
        var sortKeys = Object.keys(sort);
        var dateQuery = filterMapper.mapFilter(filter, {
            contentType: contentType,
            keysArray  : ['date']
        });
        var filterObject = filterMapper.mapFilter(filter, {
            contentType : contentType,
            keysArray   : ['date'],
            withoutState: true
        });

        sortKeys.forEach(function (el) {
            sort[el] = parseInt(sort[el], 10);
        });

        /* if (filter && typeof filter === 'object') {
         filterObject = filterMapper.mapFilter(filter, contentType);
         }

         if (filterObject.date) {
         matchObject = filterObject.date;

         delete filterObject.date;
         }

         startDate = startDate || matchObject.$gte;
         endDate = endDate || matchObject.$lte; */

        function getData(pCb) {
            JobsModel.aggregate([{
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
                }
            }, {
                $project: {
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
                    },

                    salesManager: {
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

                    type     : 1,
                    name     : 1,
                    project  : 1,
                    invoice  : 1,
                    quotation: 1,
                    workflow : 1
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
                    type          : 1,
                    name          : 1,
                    project       : {$arrayElemAt: ['$project', 0]},
                    invoice       : {$arrayElemAt: ['$invoice', 0]},
                    quotation     : {$arrayElemAt: ['$quotation', 0]},
                    workflow      : {$arrayElemAt: ['$workflow', 0]},
                    projectManager: {$arrayElemAt: ['$projectManager', 0]},
                    salesManager  : {$arrayElemAt: ['$salesManager', 0]}
                }
            }, {
                $match: {
                    $or: [dateQuery, {'invoice.invoiceDate': null}]
                }
            }, {
                $match: filterObject
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }, {
                $lookup: {
                    from        : 'journalentries',
                    localField  : '_id',
                    foreignField: 'sourceDocument._id',
                    as          : 'journalentries'
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
                $lookup: {
                    from        : 'Invoice',
                    localField  : 'project._id',
                    foreignField: 'project',
                    as          : 'proformas'
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
                    journalentries: {
                        $filter: {
                            input: '$journalentries',
                            as   : 'je',
                            cond : {
                                $or: [{
                                    $eq: ['$$je.journal', objectId('56cc727e541812c07197356c')]
                                }, {
                                    $eq: ['$$je.journal', objectId('56cc7383541812c071973574')]
                                }]
                            }
                        }
                    },

                    journalentriesOverhead: {
                        $filter: {
                            input: '$journalentries',
                            as   : 'je',
                            cond : {
                                $eq: ['$$je.journal', objectId('56cc734b541812c071973572')]
                            }
                        }
                    },

                    type                  : 1,
                    name                  : 1,
                    projectManagerEmployee: {$arrayElemAt: ['$projectManagerEmployee', 0]},
                    salesManagerEmployee  : {$arrayElemAt: ['$salesManagerEmployee', 0]},
                    invoice               : {
                        $cond: [{$eq: ['$invoice._type', 'writeOff']}, null, {
                            _id        : '$invoice._id',
                            name       : '$invoice.name',
                            currency   : '$invoice.currency',
                            date       : '$invoice.invoiceDate',
                            dueDate    : '$invoice.dueDate',
                            paymentInfo: '$invoice.paymentInfo',
                            workflow   : '$invoice.workflow'
                        }]
                    },

                    proforma: {
                        $filter: {
                            input: '$proformas',
                            as   : 'proforma',
                            cond : {$eq: ['$$proforma._type', 'Proforma']}
                        }
                    },

                    project: {
                        _id : '$project._id',
                        name: '$project.name'
                    },

                    customer: {
                        $arrayElemAt: ['$customer', 0]
                    },

                    quotation: {
                        _id     : '$quotation._id',
                        name    : '$quotation.name',
                        currency: '$quotation.currency'
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
                    }
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'invoice.workflow',
                    foreignField: '_id',
                    as          : 'invoice.workflow'
                }
            },
                {
                    $project: {
                        journalentries        : 1,
                        journalentriesOverhead: 1,
                        customer              : {
                            $concat: ['$customer.name.first', ' ', '$customer.name.last']
                        },

                        'projectManager.name': {
                            $concat: ['$projectManagerEmployee.name.first', ' ', '$projectManagerEmployee.name.last']
                        },

                        'salesManager.name': {
                            $concat: ['$salesManagerEmployee.name.first', ' ', '$salesManagerEmployee.name.last']
                        },

                        'projectManager._id' : '$projectManagerEmployee._id',
                        'salesManager._id'   : '$salesManagerEmployee._id',
                        project              : 1,
                        type                 : 1,
                        name                 : 1,
                        proforma             : 1,
                        'invoice._id'        : 1,
                        'invoice.name'       : 1,
                        'invoice.currency'   : 1,
                        'invoice.date'       : 1,
                        'invoice.dueDate'    : 1,
                        'invoice.paymentInfo': 1,
                        'invoice.workflow'   : {
                            $arrayElemAt: ['$invoice.workflow', 0]
                        },

                        quotation: 1,
                        workflow : 1,

                        jobPrice: {
                            $cond: [
                                {$eq: ['$jobPriceInvoice', null]},
                                {$arrayElemAt: ['$jobPriceQuotation', 0]},
                                {$arrayElemAt: ['$jobPriceInvoice', 0]}
                            ]
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$journalentries',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id: '$_id',

                        project: {
                            $first: '$project'
                        },

                        projectManager: {
                            $first: '$projectManager'
                        },

                        customer: {
                            $first: '$customer'
                        },

                        salesManager: {
                            $first: '$salesManager'
                        },

                        name: {
                            $first: '$name'
                        },

                        invoice: {
                            $first: '$invoice'
                        },

                        proforma: {
                            $first: '$proforma'
                        },

                        type: {
                            $first: '$type'
                        },

                        quotation: {
                            $first: '$quotation'
                        },

                        workflow: {
                            $first: '$workflow'
                        },

                        costLabour: {
                            $sum: '$journalentries.debit'
                        },

                        journalentriesOverhead: {
                            $first: '$journalentriesOverhead'
                        },

                        jobPrice: {
                            $first: '$jobPrice.unitPrice'
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$journalentriesOverhead',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id: '$_id',

                        project: {
                            $first: '$project'
                        },

                        projectManager: {
                            $first: '$projectManager'
                        },

                        customer: {
                            $first: '$customer'
                        },

                        salesManager: {
                            $first: '$salesManager'
                        },

                        name: {
                            $first: '$name'
                        },

                        invoice: {
                            $first: '$invoice'
                        },

                        proforma: {
                            $first: '$proforma'
                        },

                        type: {
                            $first: '$type'
                        },

                        quotation: {
                            $first: '$quotation'
                        },

                        workflow: {
                            $first: '$workflow'
                        },

                        costLabour: {
                            $first: '$costLabour'
                        },

                        costMaterials: {
                            $sum: '$journalentriesOverhead.debit'
                        },

                        jobPrice: {
                            $first: '$jobPrice'
                        }
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
                        project       : 1,
                        projectManager: 1,
                        customer      : 1,
                        salesManager  : 1,
                        name          : 1,
                        invoice       : 1,
                        proforma      : 1,
                        type          : 1,
                        quotation     : 1,
                        workflow      : 1,
                        costLabour    : 1,
                        costMaterials : 1,
                        jobPrice      : 1,
                        tCards        : 1,

                        totalQAWorked: {
                            $cond: [{$eq: ['$tCards.department', objectId('55b92ace21e4b7c40f000011')]}, '$tCards.worked', 0]
                        },

                        totalDesignWorked: {
                            $cond: [{$eq: ['$tCards.department', objectId('55bb1f14cb76ca630b000006')]}, '$tCards.worked', 0]
                        }

                    }
                }, {
                    $group: {
                        _id: '$_id',

                        project: {
                            $first: '$project'
                        },

                        projectManager: {
                            $first: '$projectManager'
                        },

                        customer: {
                            $first: '$customer'
                        },

                        salesManager: {
                            $first: '$salesManager'
                        },

                        name: {
                            $first: '$name'
                        },

                        invoice: {
                            $first: '$invoice'
                        },

                        proforma: {
                            $first: '$proforma'
                        },

                        type: {
                            $first: '$type'
                        },

                        quotation: {
                            $first: '$quotation'
                        },

                        workflow: {
                            $first: '$workflow'
                        },

                        costLabour: {
                            $first: '$costLabour'
                        },

                        costMaterials: {
                            $first: '$costMaterials'
                        },

                        jobPrice: {
                            $first: '$jobPrice'
                        },

                        totalWorked: {
                            $sum: '$tCards.worked'
                        },

                        tCards: {
                            $push: '$tCards'
                        },

                        tCardMinDate: {
                            $first: '$tCards'
                        },

                        tCardMaxDate: {
                            $last: '$tCards'
                        },

                        totalQAWorked: {
                            $sum: '$totalQAWorked'
                        },

                        totalDesignWorked: {
                            $sum: '$totalDesignWorked'
                        }
                    }
                }, {
                    $project: {
                        project       : 1,
                        projectManager: 1,
                        customer      : 1,
                        salesManager  : 1,
                        name          : 1,
                        invoice       : 1,
                        proforma      : 1,
                        type          : 1,
                        quotation     : 1,
                        workflow      : 1,
                        costLabour    : 1,
                        costMaterials : 1,
                        jobPrice      : 1,
                        tCardMinDate  : 1,
                        tCardMaxDate  : 1,

                        totalWorked: {
                            $cond: [{$eq: ['$totalWorked', 0]}, 1, '$totalWorked']
                        },

                        totalQAWorked    : 1,
                        totalDesignWorked: 1
                    }
                }, {
                    $project: {
                        project          : 1,
                        projectManager   : 1,
                        customer         : 1,
                        salesManager     : 1,
                        name             : 1,
                        invoice          : 1,
                        proforma         : 1,
                        type             : 1,
                        quotation        : 1,
                        workflow         : 1,
                        costLabour       : 1,
                        costMaterials    : 1,
                        tCardMinDate     : 1,
                        tCardMaxDate     : 1,
                        jobPrice         : 1,
                        totalWorked      : 1,
                        totalQAWorked    : 1,
                        totalDesignWorked: 1,
                        tCardDateByWeek  : 1,
                        revenue          : {
                            $cond: {
                                if: {
                                    $eq: ['$invoice', {}]
                                },

                                then: {
                                    $cond: {
                                        if: {
                                            $eq: ['$quotation', {}]
                                        },

                                        then: '$jobPrice',
                                        else: {
                                            $divide: ['$jobPrice', '$quotation.currency.rate']
                                        }
                                    }
                                },
                                else: {
                                    $divide: ['$jobPrice', '$invoice.currency.rate']
                                }
                            }
                        }
                    }
                }], function (err, jobs) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, jobs);
            });
        }

        function getCount(pCb) {
            JobsModel.aggregate([{
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
                }
            }, {
                $project: {
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
                    },

                    salesManager: {
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

                    type     : 1,
                    name     : 1,
                    project  : 1,
                    invoice  : 1,
                    quotation: 1,
                    workflow : 1
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
                    type          : 1,
                    name          : 1,
                    project       : {$arrayElemAt: ['$project', 0]},
                    invoice       : {$arrayElemAt: ['$invoice', 0]},
                    quotation     : {$arrayElemAt: ['$quotation', 0]},
                    workflow      : {$arrayElemAt: ['$workflow', 0]},
                    projectManager: {$arrayElemAt: ['$projectManager', 0]},
                    salesManager  : {$arrayElemAt: ['$salesManager', 0]}
                }
            }, {
                $match: {
                    $or: [dateQuery, {'invoice.invoiceDate': null}]
                }
            }, {
                $match: filterObject
            }], function (err, count) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, count.length);
            });
        }

        parallelTasks = [getData, getCount];

        async.parallel(parallelTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result[0], total: result[1]});
        });
    };

};

module.exports = Countries;
