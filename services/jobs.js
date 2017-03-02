'use strict';
var mongoose = require('mongoose');
var jobsSchema = mongoose.Schemas.jobs;
var objectId = mongoose.Types.ObjectId;

module.exports = function (models) {
    return new function () {
        this.getForOverview = function (options, callback) {
            var Model;
            var dbName;
            var err;
            var query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'jobs', jobsSchema);
            query = options.query;

            Model.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : '_id',
                    foreignField: 'job',
                    as          : 'product'
                }
            }, {
                $project: {
                    product    : {$arrayElemAt: ['$product', 0]},
                    type       : 1,
                    name       : 1,
                    description: 1,
                    project    : 1,
                    invoice    : 1,
                    order      : 1,
                    workflow   : 1
                }
            }, {
                $lookup: {
                    from        : 'journalentries',
                    localField  : 'product._id',
                    foreignField: 'sourceDocument._id',
                    as          : 'journalentries'
                }
            }, {
                $lookup: {
                    from        : 'orderRows',
                    localField  : 'order',
                    foreignField: 'order',
                    as          : 'orderRows'
                }
            }, {
                $project: {
                    orderRows: {
                        $filter: {
                            input: '$orderRows',
                            as   : 'item',
                            cond : {$eq: ['$$item.product', '$product._id']}
                        }
                    },

                    journalentries: 1,
                    order         : 1,
                    product       : 1,
                    type          : 1,
                    name          : 1,
                    description   : 1,
                    project       : 1,
                    invoice       : 1,
                    quotation     : 1,
                    workflow      : 1
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
                    from        : 'Order',
                    localField  : 'order',
                    foreignField: '_id',
                    as          : 'order'
                }
            }, {
                $project: {
                    orderRow      : {$arrayElemAt: ['$orderRows', 0]},
                    journalentries: 1,
                    type          : 1,
                    name          : 1,
                    description   : 1,
                    product       : 1,
                    project       : {$arrayElemAt: ['$project', 0]},
                    invoice       : {$arrayElemAt: ['$invoice', 0]},
                    order         : {$arrayElemAt: ['$order', 0]},
                    workflow      : {$arrayElemAt: ['$workflow', 0]}
                }
            }, {
                $project: {
                    jobPrice      : '$orderRow.subTotal',
                    orderRow      : 1,
                    journalentries: 1,
                    type          : 1,
                    name          : 1,
                    product       : 1,
                    'project._id' : '$project._id',
                    'project.name': '$project.name',
                    invoice       : {
                        $cond: [{$eq: ['$invoice._type', 'writeOff']}, null, {
                            _id     : '$invoice._id',
                            name    : '$invoice.name',
                            currency: '$invoice.currency'
                        }]
                    },

                    'order._id'          : 1,
                    'order.name'         : 1,
                    'order.currency._id' : 1,
                    'order.currency.rate': {$ifNull: ['$order.currency.rate', 1]},

                    workflow: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    },

                    description: 1
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
                    order      : {$first: '$order'},
                    invoice    : {$first: '$invoice'},
                    project    : {$first: '$project'},
                    jobPrice   : {$first: '$jobPrice'},
                    description: {$first: '$description'},
                    type       : {$first: '$type'},
                    workflow   : {$first: '$workflow'},
                    cost       : {$sum: '$journalentries.debit'}
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
                    order            : 1,
                    type             : 1,
                    workflow         : 1,
                    description      : 1,
                    cost             : 1,
                    tCards           : 1,
                    project          : 1,
                    jobPrice         : 1,
                    totalQAWorked    : {$cond: [{$eq: ['$tCards.department', objectId('55b92ace21e4b7c40f000011')]}, '$tCards.worked', 0]},
                    totalDesignWorked: {$cond: [{$eq: ['$tCards.department', objectId('55bb1f14cb76ca630b000006')]}, '$tCards.worked', 0]}

                }
            }, {
                $group: {
                    _id              : '$_id',
                    name             : {$first: '$name'},
                    invoice          : {$first: '$invoice'},
                    order            : {$first: '$order'},
                    type             : {$first: '$type'},
                    project          : {$first: '$project'},
                    workflow         : {$first: '$workflow'},
                    jobPrice         : {$first: '$jobPrice'},
                    description      : {$first: '$description'},
                    cost             : {$first: '$cost'},
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
                    order            : {$first: '$order'},
                    type             : {$first: '$type'},
                    jobPrice         : {$first: '$jobPrice'},
                    tCardMinDate     : {$first: '$tCardMinDate'},
                    tCardMaxDate     : {$last: '$tCardMaxDate'},
                    description      : {$first: '$description'},
                    workflow         : {$first: '$workflow'},
                    cost             : {$first: '$cost'},
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
                    workflow    : 1,
                    cost        : 1,
                    project     : 1,
                    description : 1,
                    order       : 1,
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
                    workflow         : 1,
                    order            : 1,
                    project          : 1,
                    cost             : 1,
                    tCardMinDate     : 1,
                    tCardMaxDate     : 1,
                    totalWorked      : 1,
                    totalQAWorked    : 1,
                    description      : 1,
                    totalDesignWorked: 1,
                    jobPrice         : 1,
                    worked           : 1,
                    tCardDateByWeek  : 1,
                    revenue          : {
                        $cond: {
                            if: {
                                $eq: ['$invoice', {}]
                            },

                            then: {
                                $cond: {
                                    if  : {$eq: ['$order', {}]},
                                    then: {
                                        $multiply: [{$divide: ['$worked', '$totalWorked']}, '$jobPrice']
                                    },
                                    else: {
                                        $divide: [{$multiply: [{$divide: ['$worked', '$totalWorked']}, '$jobPrice']}, '$order.currency.rate']
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
                    workflow         : 1,
                    project          : 1,
                    cost             : 1,
                    jobPrice         : 1,
                    order            : 1,
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
                    order            : 1,
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
                                $and: [{
                                    $ifNull: ['$$transfer.date', null]
                                }, {
                                    $lte: [{$add: [{$multiply: [{$year: '$$transfer.date'}, 100]}, {$week: '$$transfer.date'}]}, '$tCardDateByWeek']
                                }]

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
                    name             : {$first: '$name'},
                    project          : {$first: '$project'},
                    invoice          : {$first: '$invoice'},
                    type             : {$first: '$type'},
                    workflow         : {$first: '$workflow'},
                    description      : {$first: '$description'},
                    order            : {$first: '$order'},
                    cost             : {$first: '$cost'},
                    jobPrice         : {$first: '$jobPrice'},
                    tCardMinDate     : {$first: '$tCardMinDate'},
                    tCardMaxDate     : {$first: '$tCardMaxDate'},
                    worked           : {$first: '$worked'},
                    totalWorked      : {$first: '$totalWorked'},
                    revenue          : {$first: '$revenue'},
                    employee         : {$first: '$employee'},
                    department       : {$first: '$department'},
                    transfer         : {$first: '$transfer'},
                    totalQAWorked    : {$first: '$totalQAWorked'},
                    totalDesignWorked: {$first: '$totalDesignWorked'}
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
                    order            : 1,
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
                    name             : {$first: '$name'},
                    invoice          : {$first: '$invoice'},
                    project          : {$first: '$project'},
                    type             : {$first: '$type'},
                    workflow         : {$first: '$workflow'},
                    description      : {$first: '$description'},
                    cost             : {$first: '$cost'},
                    order            : {$first: '$order'},
                    tCardMinDate     : {$first: '$tCardMinDate'},
                    tCardMaxDate     : {$first: '$tCardMaxDate'},
                    jobPrice         : {$first: '$jobPrice'},
                    totalWorked      : {$sum: '$worked'},
                    totalQAWorked    : {$first: '$totalQAWorked'},
                    totalDesignWorked: {$first: '$totalDesignWorked'},
                    totalRevenue     : {$sum: '$revenue'},

                    revenue: {
                        $push: {
                            employee: {
                                _id : '$employee._id',
                                name: {
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
                    order            : 1,
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
                    revenueTotal: {$sum: '$totalRevenue'},
                    profitTotal : {$sum: '$profit'},
                    costTotal   : {$sum: '$cost'},
                    workedTotal : {$sum: '$totalWorked'},
                    root        : {$push: '$$ROOT'}
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
                    workflow         : '$root.workflow',
                    cost             : '$root.cost',
                    order            : '$root.order',
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
            }], function (err, jobs) {
                if (err) {
                    return callback(err);
                }

                callback(null, jobs);
            });
        };

        this.setInvoiceToJobs = function (options, callback) {
            var Model;
            var dbName;
            var err;
            var order;
            var invoice;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'jobs', jobsSchema);
            order = options.order;
            invoice = options.invoice;

            Model.update({order: order}, {
                $set: {
                    invoice: invoice,
                    type   : 'Invoiced'
                }
            }, {multi: true}, function (err, result) {
                callback();
            });
        };

        this.removeInvoiceFromJobs = function (options, callback) {
            var Model;
            var dbName;
            var err;
            var invoice;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'jobs', jobsSchema);
            invoice = options.invoice;

            Model.update({invoice: invoice}, {
                $set: {
                    invoice: null,
                    type   : 'Ordered'
                }
            }, {multi: true}, callback);
        };

    };
};

