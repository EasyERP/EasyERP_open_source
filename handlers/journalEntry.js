var mongoose = require('mongoose');
var journalSchema = mongoose.Schemas.journal;
var journalEntrySchema = mongoose.Schemas.journalEntry;
var CurrencySchema = mongoose.Schemas.Currency;
var wTrackSchema = mongoose.Schemas.wTrack;
var employeeSchema = mongoose.Schemas.Employee;
var jobsSchema = mongoose.Schemas.jobs;
var invoiceSchema = mongoose.Schemas.wTrackInvoice;
var holidaysSchema = mongoose.Schemas.Holiday;
var vacationSchema = mongoose.Schemas.Vacation;
var PaymentMethodSchema = mongoose.Schemas.PaymentMethod;
var cashTransferSchema = mongoose.Schemas.cashTransfer;
var PaymentSchema = mongoose.Schemas.Payment;
var objectId = mongoose.Types.ObjectId;

var oxr = require('open-exchange-rates');
var _ = require('underscore');
var async = require('async');
var moment = require('../public/js/libs/moment/moment');
var pageHelper = require('../helpers/pageHelper');
var FilterMapper = require('../helpers/filterMapper');

var Module = function (models, event) {
    'use strict';
    // ToDo set it to process.env

    var CONSTANTS = require('../constants/mainConstants.js');
    var matchObject = {};
    var notDevArray = CONSTANTS.NOT_DEV_ARRAY;

    var lookupWTrackArray = [
        {
            $match: {
                'sourceDocument.model': 'wTrack',
                debit                 : {$gt: 0}
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'account',
                foreignField: '_id',
                as          : 'account'
            }
        }, {
            $lookup: {
                from        : 'journals',
                localField  : 'journal',
                foreignField: '_id',
                as          : 'journal'
            }
        }, {
            $project: {
                debit         : 1,
                journal       : {$arrayElemAt: ['$journal', 0]},
                account       : {$arrayElemAt: ['$account', 0]},
                sourceDocument: 1,
                date          : 1
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'journal.debitAccount',
                foreignField: '_id',
                as          : 'journal.debitAccount'
            }
        }, {
            $lookup: {
                from        : 'jobs',
                localField  : 'sourceDocument._id',
                foreignField: '_id',
                as          : 'sourceDocument._id'
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'journal.creditAccount',
                foreignField: '_id',
                as          : 'journal.creditAccount'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'sourceDocument.employee',
                foreignField: '_id',
                as          : 'sourceDocument.employee'
            }
        }, {
            $project: {
                debit                   : {$divide: ['$debit', 100]},
                'journal.debitAccount'  : {$arrayElemAt: ['$journal.debitAccount', 0]},
                'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                'journal.name'          : 1,
                date                    : 1,
                'sourceDocument._id'    : 1,
                'sourceDocument.subject': {$arrayElemAt: ['$sourceDocument.employee', 0]},
                'sourceDocument.name'   : '$sourceDocument._id.name'
            }
        }, {
            $project: {
                debit                        : 1,
                'journal.debitAccount'       : 1,
                'journal.creditAccount'      : 1,
                'journal.name'               : 1,
                date                         : 1,
                'sourceDocument._id'         : 1,
                'sourceDocument.subject.name': {$concat: ['$sourceDocument.subject.name.first', ' ', '$sourceDocument.subject.name.last']},
                'sourceDocument.subject._id' : 1,
                'sourceDocument.name'        : 1
            }
        }
    ];

    var lookupEmployeesArray = [{
        $match: {
            'sourceDocument.model': 'Employees',
            debit                 : {$gt: 0}
        }
    }, {
        $lookup: {
            from        : 'chartOfAccount',
            localField  : 'account',
            foreignField: '_id',
            as          : 'account'
        }
    }, {
        $lookup: {
            from        : 'Employees',
            localField  : 'sourceDocument._id',
            foreignField: '_id',
            as          : 'sourceDocument._id'
        }
    }, {
        $lookup: {
            from        : 'journals',
            localField  : 'journal',
            foreignField: '_id',
            as          : 'journal'
        }
    }, {
        $project: {
            debit               : 1,
            journal             : {$arrayElemAt: ['$journal', 0]},
            account             : {$arrayElemAt: ['$account', 0]},
            'sourceDocument._id': {$arrayElemAt: ['$sourceDocument._id', 0]},
            date                : 1
        }
    }, {
        $lookup: {
            from        : 'chartOfAccount',
            localField  : 'journal.debitAccount',
            foreignField: '_id',
            as          : 'journal.debitAccount'
        }
    }, {
        $lookup: {
            from        : 'chartOfAccount',
            localField  : 'journal.creditAccount',
            foreignField: '_id',
            as          : 'journal.creditAccount'
        }
    }, {
        $lookup: {
            from        : 'Department',
            localField  : 'sourceDocument._id.department',
            foreignField: '_id',
            as          : 'sourceDocument._id.department'
        }
    }, {
        $project: {
            debit                          : 1,
            'journal.debitAccount'         : {$arrayElemAt: ['$journal.debitAccount', 0]},
            'journal.creditAccount'        : {$arrayElemAt: ['$journal.creditAccount', 0]},
            'sourceDocument._id.department': {$arrayElemAt: ['$sourceDocument._id.department', 0]},
            'journal.name'                 : 1,
            date                           : 1,
            'sourceDocument.subject'       : '$sourceDocument._id'
        }
    }, {
        $project: {
            debit                        : {$divide: ['$debit', 100]},
            'journal.debitAccount'       : 1,
            'journal.creditAccount'      : 1,
            'sourceDocument._id'         : 1,
            'journal.name'               : 1,
            date                         : 1,
            'sourceDocument.subject.name': {$concat: ['$sourceDocument.subject.name.first', ' ', '$sourceDocument.subject.name.last']},
            'sourceDocument.name'        : '$sourceDocument._id.department.name',
            'sourceDocument.subject._id' : 1
        }
    }];

    var lookupInvoiceArray = [{
        $match: {
            'sourceDocument.model': {$in: ['Invoice', 'proforma', 'dividendInvoice']},
            debit                 : {$gt: 0}
        }
    }, {
        $lookup: {
            from        : 'chartOfAccount',
            localField  : 'account',
            foreignField: '_id',
            as          : 'account'
        }
    }, {
        $lookup: {
            from        : 'Invoice',
            localField  : 'sourceDocument._id',
            foreignField: '_id',
            as          : 'sourceDocument._id'
        }
    }, {
        $lookup: {
            from        : 'journals',
            localField  : 'journal',
            foreignField: '_id',
            as          : 'journal'
        }
    }, {
        $project: {
            debit                 : 1,
            currency              : 1,
            journal               : {$arrayElemAt: ['$journal', 0]},
            account               : {$arrayElemAt: ['$account', 0]},
            'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
            'sourceDocument.model': 1,
            date                  : 1
        }
    }, {
        $lookup: {
            from        : 'chartOfAccount',
            localField  : 'journal.debitAccount',
            foreignField: '_id',
            as          : 'journal.debitAccount'
        }
    }, {
        $lookup: {
            from        : 'chartOfAccount',
            localField  : 'journal.creditAccount',
            foreignField: '_id',
            as          : 'journal.creditAccount'
        }
    }, {
        $lookup: {
            from        : 'Customers',
            localField  : 'sourceDocument._id.supplier',
            foreignField: '_id',
            as          : 'sourceDocument.subject'
        }
    }, {
        $project: {
            debit                   : {$divide: ['$debit', 100]},
            'journal.debitAccount'  : {$arrayElemAt: ['$journal.debitAccount', 0]},
            'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
            'journal.name'          : 1,
            date                    : 1,
            'sourceDocument._id'    : 1,
            'sourceDocument.name'   : '$sourceDocument._id.name',
            'sourceDocument.subject': {$arrayElemAt: ['$sourceDocument.subject', 0]}
        }
    }, {
        $project: {
            debit                        : 1,
            'journal.debitAccount'       : 1,
            'journal.creditAccount'      : 1,
            'journal.name'               : 1,
            date                         : 1,
            'sourceDocument._id'         : 1,
            'sourceDocument.name'        : 1,
            'sourceDocument.subject._id' : 1,
            'sourceDocument.subject.name': {$concat: ['$sourceDocument.subject.name.first', ' ', '$sourceDocument.subject.name.last']}
        }
    }];

    var lookupJobsArray = [
        {
            $match: {
                'sourceDocument.model': 'jobs',
                debit                 : {$gt: 0}
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'account',
                foreignField: '_id',
                as          : 'account'
            }
        }, {
            $lookup: {
                from        : 'jobs',
                localField  : 'sourceDocument._id',
                foreignField: '_id',
                as          : 'sourceDocument._id'
            }
        }, {
            $lookup: {
                from        : 'journals',
                localField  : 'journal',
                foreignField: '_id',
                as          : 'journal'
            }
        }, {
            $project: {
                debit                 : 1,
                currency              : 1,
                journal               : {$arrayElemAt: ['$journal', 0]},
                account               : {$arrayElemAt: ['$account', 0]},
                'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                'sourceDocument.model': 1,
                date                  : 1
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'journal.debitAccount',
                foreignField: '_id',
                as          : 'journal.debitAccount'
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'journal.creditAccount',
                foreignField: '_id',
                as          : 'journal.creditAccount'
            }
        }, {
            $project: {
                debit                   : {$divide: ['$debit', 100]},
                currency                : 1,
                'journal.debitAccount'  : {$arrayElemAt: ['$journal.debitAccount', 0]},
                'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                'journal.name'          : 1,
                date                    : 1,
                'sourceDocument.model'  : 1,
                'sourceDocument.subject': '$sourceDocument._id',
                'sourceDocument._id'    : 1,
                account                 : 1
            }
        }, {
            $project: {
                debit                          : 1,
                currency                       : 1,
                'journal.debitAccount'         : 1,
                'journal.creditAccount'        : 1,
                'sourceDocument._id.department': 1,
                'journal.name'                 : 1,
                date                           : 1,
                'sourceDocument.model'         : 1,
                'sourceDocument.subject._id'   : 1,
                'sourceDocument.subject.name'  : {$concat: ['$sourceDocument.subject.name.first', ' ', '$sourceDocument.subject.name.last']},
                'sourceDocument.name'          : '$sourceDocument._id.name',
                account                        : 1
            }
        }
    ];

    var lookupPaymentsArray = [
        {
            $match: {
                'sourceDocument.model': 'Payment',
                debit                 : {$gt: 0}
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'account',
                foreignField: '_id',
                as          : 'account'
            }
        }, {
            $lookup: {
                from        : 'Payment',
                localField  : 'sourceDocument._id',
                foreignField: '_id',
                as          : 'sourceDocument._id'
            }
        }, {
            $lookup: {
                from        : 'journals',
                localField  : 'journal',
                foreignField: '_id',
                as          : 'journal'
            }
        }, {
            $project: {
                debit                 : 1,
                currency              : 1,
                journal               : {$arrayElemAt: ['$journal', 0]},
                account               : {$arrayElemAt: ['$account', 0]},
                'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                'sourceDocument.model': 1,
                date                  : 1
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'journal.debitAccount',
                foreignField: '_id',
                as          : 'journal.debitAccount'
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'journal.creditAccount',
                foreignField: '_id',
                as          : 'journal.creditAccount'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'sourceDocument._id.supplier',
                foreignField: '_id',
                as          : 'sourceDocument.subject'
            }
        }, {
            $project: {
                debit                   : {$divide: ['$debit', 100]},
                'journal.debitAccount'  : {$arrayElemAt: ['$journal.debitAccount', 0]},
                'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                'journal.name'          : 1,
                date                    : 1,
                'sourceDocument._id'    : 1,
                'sourceDocument.name'   : '$sourceDocument._id.name',
                'sourceDocument.subject': {$arrayElemAt: ['$sourceDocument.subject', 0]}
            }
        }, {
            $project: {
                debit                        : 1,
                'journal.debitAccount'       : 1,
                'journal.creditAccount'      : 1,
                'journal.name'               : 1,
                date                         : 1,
                'sourceDocument._id'         : 1,
                'sourceDocument.name'        : 1,
                'sourceDocument.subject._id' : 1,
                'sourceDocument.subject.name': {$concat: ['$sourceDocument.subject.name.first', ' ', '$sourceDocument.subject.name.last']}
            }
        }
    ];

    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').journalEntry;

    matchObject[CONSTANTS.PRODUCT_SALES] = 'credit';
    matchObject[CONSTANTS.COGS] = 'debit';
    oxr.set({app_id: process.env.OXR_APP_ID});

    function createReconciled(body, dbIndex, cb, uId) {
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var journalId = body.journal;
        var now = moment().endOf('month');
        var date = body.date ? moment(body.date) : now;
        var currency;
        var amount = body.amount;

        var waterfallTasks;

        function journalFinder(waterfallCb) {
            var err;

            if (!journalId) {
                err = new Error('Journal id is required field');
                err.status = 400;

                return waterfallCb(err);
            }

            Journal.findById(journalId, waterfallCb);
        }

        function journalEntrySave(journal, waterfallCb) {
            var err;
            var debitObject;
            var creditObject;
            var parallelTasks = {
                debitSaver : function (parallelCb) {
                    var journalEntry;

                    debitObject.debit = amount;
                    debitObject.account = journal.debitAccount;

                    debitObject.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    debitObject.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    if (debitObject.currency && debitObject.currency.rate) {
                        debitObject.debit *= debitObject.currency.rate;
                    }

                    if (amount && moment(debitObject.date).isBefore(now)) {
                        journalEntry = new Model(debitObject);
                        journalEntry.save(parallelCb);
                    } else {
                        parallelCb();
                    }

                },
                creditSaver: function (parallelCb) {
                    var journalEntry;

                    creditObject.credit = amount;
                    creditObject.account = journal.creditAccount;

                    creditObject.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    creditObject.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    if (creditObject.currency && creditObject.currency.rate) {
                        creditObject.credit *= creditObject.currency.rate;
                    }

                    if (amount && moment(creditObject.date).isBefore(now)) {
                        journalEntry = new Model(creditObject);
                        journalEntry.save(parallelCb);
                    } else {
                        parallelCb();
                    }
                }
            };

            if (!journal || !journal._id) {
                err = new Error('Invalid Journal');
                err.status = 400;

                return waterfallCb(err);
            }

            currency = {
                name: 'USD',
                rate: 1
            };

            body.currency = currency;
            body.journal = journal._id;

            debitObject = _.extend({}, body);
            creditObject = _.extend({}, body);

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, result);
            });
        }

        waterfallTasks = [journalFinder, journalEntrySave];

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return cb(err);
            }

            if (cb) {
                cb(null, response);
            }
        });
    }

    this.createReconciled = function (body, dbIndex, cb, uId) {
        createReconciled(body, dbIndex, cb, uId);
    };

    /*function caseFilter(filter) {
     var condition;
     var resArray = [];
     var filtrElement = {};
     var filterNameKeys = Object.keys(filter);
     var filterName;
     var i;

     for (i = filterNameKeys.length - 1; i >= 0; i--) {
     filterName = filterNameKeys[i];
     condition = filter[filterName].value;

     switch (filterName) {
     case 'journalName':
     filtrElement['journal.name'] = {$in: condition};
     resArray.push(filtrElement);
     break;
     case 'sourceDocument':
     filtrElement['sourceDocument.subject._id'] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'creditAccount':
     filtrElement['journal.creditAccount._id'] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'salesManager':
     filtrElement['salesmanager._id'] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'project':
     filtrElement['project._id'] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'type':
     filtrElement['project.projecttype'] = {$in: condition};
     resArray.push(filtrElement);
     break;
     // skip default;
     }
     }

     return resArray;
     }*/

    /*function caseFilterForTotalCount(filter) {
     var condition;
     var resArray = [];
     var filtrElement = {};
     var key;
     var filterNameKeys = Object.keys(filter);
     var filterName;
     var i;

     for (i = filterNameKeys.length - 1; i >= 0; i--) {
     filterName = filterNameKeys[i];
     condition = filter[filterName].value;
     key = filter[filterName].key;

     switch (filterName) {
     case 'journalName':
     filtrElement['journal.name'] = {$in: condition};
     resArray.push(filtrElement);
     break;
     case 'sourceDocument':
     filtrElement['sourceDocument.subject'] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'creditAccount':
     filtrElement['journal.creditAccount'] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     }
     }

     return resArray;
     }*/

    function totalCollectionLength(req, mainCallback) {
        var dbIndex = req.session.lastDb;
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);

        var data = req.query;
        var findInvoice;
        var findSalary;
        var findByEmployee;
        var filter = data.filter || {};
        var filterObj = {};
        // var startDate = data.startDate || filter.startDate.value;
        // var endDate = data.endDate || filter.endDate.value;
        var findJobsFinished;
        var findPayments;
        var findSalaryPayments;
        var findCashTransfer;
        var matchObject = {};
        // var filterArray;
        var parallelTasks;
        var filterMapper = new FilterMapper();

        // startDate = moment(new Date(startDate)).startOf('day');
        // endDate = moment(new Date(endDate)).endOf('day');

        /*matchObject = {
         date: {
         $gte: new Date(startDate),
         $lte: new Date(endDate)
         }
         };*/

        /*if (filter) {
         filterArray = caseFilter(filter);

         if (filterArray.length) {
         filterObj.$and = filterArray;
         }
         }*/

        filterObj = filterMapper.mapFilter(filter, 'journalEntry');

        if (filterObj.date) {
            matchObject.date = filterObj.date;

            delete filterObj.date;
        }

        findInvoice = function (cb) {
            Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': {$in: ['Invoice', 'Proforma', 'dividendInvoice']},
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'Invoice',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit               : 1,
                        currency            : 1,
                        journal             : {$arrayElemAt: ['$journal', 0]},
                        'sourceDocument._id': {$arrayElemAt: ['$sourceDocument._id', 0]}
                    }
                }, {
                    $project: {
                        debit                   : 1,
                        'journal.name'          : 1,
                        'journal.creditAccount' : 1,
                        'sourceDocument._id'    : 1,
                        'sourceDocument.subject': '$sourceDocument._id.supplier'
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        _id  : 1,
                        debit: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    cb(null, result);
                });
        };

        findCashTransfer = function (cb) {
            Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': 'cashTransfer',
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'cashTransfer',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit                 : 1,
                        currency              : 1,
                        journal               : {$arrayElemAt: ['$journal', 0]},
                        account               : {$arrayElemAt: ['$account', 0]},
                        'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                        'sourceDocument.model': 1,
                        date                  : 1
                    }
                }, {
                    $project: {
                        debit                   : 1,
                        'journal.name'          : 1,
                        'journal.creditAccount' : 1,
                        'sourceDocument._id'    : 1,
                        'sourceDocument.subject': '$sourceDocument.model'
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        _id  : 1,
                        debit: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        findSalary = function (cb) {
            var aggregate;
            var query = [{
                $match: matchObject
            }, {
                $match: {
                    'sourceDocument.model': 'wTrack',
                    debit                 : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    debit         : 1,
                    journal       : {$arrayElemAt: ['$journal', 0]},
                    sourceDocument: 1
                }
            }, {
                $project: {
                    debit                   : 1,
                    'journal.creditAccount' : 1,
                    'journal.name'          : 1,
                    'sourceDocument.subject': '$sourceDocument.employee'
                }
            }];

            if (filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            aggregate = Model.aggregate(query);

            aggregate.options = {allowDiskUse: true};

            aggregate.exec(function (err, result) {
                if (err) {
                    return console.log(err);
                }

                cb(null, result);
            });
        };

        findByEmployee = function (cb) {
            var aggregate;
            var query = [{
                $match: matchObject
            }, {
                $match: {
                    'sourceDocument.model': 'Employees',
                    debit                 : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'sourceDocument._id',
                    foreignField: '_id',
                    as          : 'sourceDocument._id'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    debit               : 1,
                    journal             : {$arrayElemAt: ['$journal', 0]},
                    'sourceDocument._id': {$arrayElemAt: ['$sourceDocument._id', 0]}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.debitAccount',
                    foreignField: '_id',
                    as          : 'journal.debitAccount'
                }
            }, {
                $project: {
                    debit                   : 1,
                    'journal.creditAccount' : 1,
                    'journal.name'          : 1,
                    'sourceDocument.subject': '$sourceDocument._id._id'
                }
            }, {
                $project: {
                    debit                   : 1,
                    'journal.creditAccount' : 1,
                    'journal.name'          : 1,
                    'sourceDocument.subject': 1
                }
            }];

            if (filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            aggregate = Model.aggregate(query);

            aggregate.options = {allowDiskUse: true};

            aggregate.exec(function (err, result) {
                if (err) {
                    return console.log(err);
                }

                cb(null, result);
            });
        };

        findJobsFinished = function (cb) {
            var aggregate;
            var query = [{
                $match: matchObject
            }, {
                $match: {
                    'sourceDocument.model': 'jobs',
                    debit                 : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'jobs',
                    localField  : 'sourceDocument._id',
                    foreignField: '_id',
                    as          : 'sourceDocument._id'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    debit               : 1,
                    journal             : {$arrayElemAt: ['$journal', 0]},
                    'sourceDocument._id': {$arrayElemAt: ['$sourceDocument._id', 0]}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.creditAccount',
                    foreignField: '_id',
                    as          : 'journal.creditAccount'
                }
            }, {
                $project: {
                    debit                   : 1,
                    'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                    'journal.name'          : 1,
                    'sourceDocument.subject': '$sourceDocument._id._id'
                }
            }];

            if (filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            aggregate = Model.aggregate(query);

            aggregate.options = {allowDiskUse: true};

            aggregate.exec(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        findPayments = function (cb) {
            var aggregate;
            var query = [{
                $match: matchObject
            }, {
                $match: {
                    'sourceDocument.model': 'Payment',
                    debit                 : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'Payment',
                    localField  : 'sourceDocument._id',
                    foreignField: '_id',
                    as          : 'sourceDocument._id'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    debit               : 1,
                    journal             : {$arrayElemAt: ['$journal', 0]},
                    'sourceDocument._id': {$arrayElemAt: ['$sourceDocument._id', 0]}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.creditAccount',
                    foreignField: '_id',
                    as          : 'journal.creditAccount'
                }
            }, {
                $project: {
                    debit                   : 1,
                    'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                    'journal.name'          : 1,
                    'sourceDocument.subject': '$sourceDocument._id._id'
                }
            }];

            if (filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            aggregate = Model.aggregate(query);

            aggregate.options = {allowDiskUse: true};

            aggregate.exec(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        findSalaryPayments = function (cb) {
            var aggregate;
            var query = [{
                $match: matchObject
            }, {
                $match: {
                    'sourceDocument.model': 'salaryPayment',
                    debit                 : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'sourceDocument._id',
                    foreignField: '_id',
                    as          : 'sourceDocument._id'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    debit               : 1,
                    journal             : {$arrayElemAt: ['$journal', 0]},
                    'sourceDocument._id': {$arrayElemAt: ['$sourceDocument._id', 0]}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.creditAccount',
                    foreignField: '_id',
                    as          : 'journal.creditAccount'
                }
            }, {
                $project: {
                    debit                   : 1,
                    'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                    'journal.name'          : 1,
                    'sourceDocument.subject': '$sourceDocument._id._id'
                }
            }];

            if (filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            aggregate = Model.aggregate(query);

            aggregate.options = {allowDiskUse: true};

            aggregate.exec(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        parallelTasks = [findInvoice, findSalary, findByEmployee, findJobsFinished, findPayments, findSalaryPayments, findCashTransfer];

        async.parallel(parallelTasks, function (err, result) {
            var invoices = result[0];
            var salary = result[1];
            var jobsFinished = result[3];
            var salaryEmployee = result[2];
            var paymentsResult = result[4];
            var salaryPaymentsResult = result[5];
            var cashTransfer = result[6];
            var totalValue = 0;
            var models = _.union(invoices, salary, jobsFinished, salaryEmployee, paymentsResult, salaryPaymentsResult, cashTransfer);

            if (err) {
                return mainCallback(err);
            }

            models.forEach(function (model) {
                totalValue += model.debit;
            });

            mainCallback(null, {total: models.length, totalValue: totalValue});
        });
    }

    this.exportToXlsx = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var filterObj = {};
        var type = req.query.type;
        var options;
        /*var startDate = filter.startDate.value;
         var endDate = filter.endDate.value;*/
        var matchObject = {};
        var filterMapper = new FilterMapper();

        /*startDate = moment(new Date(startDate)).startOf('day');
         endDate = moment(new Date(endDate)).endOf('day');*/

        /*matchObject = {
         date: {
         $gte: new Date(startDate),
         $lte: new Date(endDate)
         }
         };*/

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, 'journalEntry'); // caseFilter(filter);

            if (filterObj.date) {
                matchObject.date = filterObj.date;

                delete filterObj.date;
            }
        }

        options = {
            res         : res,
            next        : next,
            Model       : Model,
            map         : exportMap,
            returnResult: true,
            fileName    : 'journalEntry'
        };

        function lookupForWTrack(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupWTrackArray.length; i++) {
                query.push(lookupWTrackArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        function lookupForEmployees(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupEmployeesArray.length; i++) {
                query.push(lookupEmployeesArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        function lookupForInvoice(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupInvoiceArray.length; i++) {
                query.push(lookupInvoiceArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        function lookupForJobs(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupJobsArray.length; i++) {
                query.push(lookupJobsArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        function lookupForPayments(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupPaymentsArray.length; i++) {
                query.push(lookupPaymentsArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        async.parallel([lookupForWTrack, lookupForEmployees, lookupForInvoice, lookupForJobs, lookupForPayments], function (err, result) {
            var wTrackResult = result[0];
            var employeesResult = result[1];
            var invoiceResult = result[2];
            var jobsResult = result[3];
            var paymentsResult = result[4];
            var resultArray = _.union(wTrackResult, employeesResult, invoiceResult, jobsResult, paymentsResult);

            exporter.exportToXlsx({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : 'journalEntry'
            });
        });

    };

    this.exportToCsv = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var filterObj = {};
        var type = req.query.type;
        var options;
        var query = [];
        /*var startDate = filter.startDate.value;
         var endDate = filter.endDate.value;*/
        var matchObject = {};
        var filterMapper = new FilterMapper();

        /*startDate = moment(new Date(startDate)).startOf('day');
         endDate = moment(new Date(endDate)).endOf('day');

         matchObject = {
         date: {
         $gte: new Date(startDate),
         $lte: new Date(endDate)
         }
         };*/

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, 'journalEntry'); // caseFilter(filter);

            if (filterObj.date) {
                matchObject.date = filterObj.date;

                delete filterObj.date;
            }
        }

        options = {
            res         : res,
            next        : next,
            Model       : Model,
            map         : exportMap,
            returnResult: true,
            fileName    : 'journalEntry'
        };

        function lookupForWTrack(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupWTrackArray.length; i++) {
                query.push(lookupWTrackArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        function lookupForEmployees(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupEmployeesArray.length; i++) {
                query.push(lookupEmployeesArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        function lookupForInvoice(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupInvoiceArray.length; i++) {
                query.push(lookupInvoiceArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        function lookupForJobs(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupJobsArray.length; i++) {
                query.push(lookupJobsArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        function lookupForPayments(cb) {
            var query = [{$match: type ? {type: type} : {}}];
            var i;

            query.push({$match: matchObject});

            for (i = 0; i < lookupPaymentsArray.length; i++) {
                query.push(lookupPaymentsArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        async.parallel([lookupForWTrack, lookupForEmployees, lookupForInvoice, lookupForJobs, lookupForPayments], function (err, result) {
            var wTrackResult = result[0];
            var employeesResult = result[1];
            var invoiceResult = result[2];
            var jobsResult = result[3];
            var paymentsResult = result[4];
            var resultArray = _.union(wTrackResult, employeesResult, invoiceResult, jobsResult, paymentsResult);

            exporter.exportToCsv({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : 'journalEntry'
            });
        });
    };

    function setReconcileDate(req, date) {
        var db = models.connection(req.session.lastDb);
        db.collection('settings').findOne({name: 'reconcileDate'}, function (err, result) {
            var dateResult;
            var newDae;
            var newReconcileDate;
            var lessDate;

            if (err) {
                return console.log(err);
            }

            dateResult = result ? result.date : new Date();
            newDae = moment(date);
            newReconcileDate = moment(dateResult);
            lessDate = newDae.isBefore(newReconcileDate) ? true : false;

            if (lessDate) {
                db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: {date: new Date(newDae)}}, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                });
            }
        });
    }

    this.setReconcileDate = function (req, date) {
        setReconcileDate(req, date);
    };

    this.removeBySourceDocument = function (req, sourceId) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);

        Model.find({'sourceDocument._id': sourceId}, function (err, result) {
            var ids = [];

            if (err) {
                return console.log(err);
            }

            result.forEach(function (el) {
                setReconcileDate(req, el.date);
                ids.push(el._id);
            });

            Model.remove({_id: {$in: ids}}, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    };

    function checkAndCreateForJob(options) {
        var req = options.req;
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var jobId = options.jobId;
        var workflow = options.workflow;
        var remove = false;
        var bodyFinishedJob = {
            currency      : CONSTANTS.CURRENCY_USD,
            journal       : CONSTANTS.FINISHED_JOB_JOURNAL,
            sourceDocument: {
                model: 'jobs',
                _id  : jobId
            },

            amount: 0
        };

        var bodyClosedJob = {
            currency      : CONSTANTS.CURRENCY_USD,
            journal       : CONSTANTS.CLOSED_JOB,
            sourceDocument: {
                model: 'jobs',
                _id  : jobId
            },

            amount: 0
        };

        var date;

        var jobFinshedCb = function () {
            return false;
        };

        Job.findById(jobId, {workflow: 1, invoice: 1}).populate('invoice').exec(function (err, result) {
            if (err) {
                return console.log(err);
            }

            if (result) {
                if (result.workflow.toString() !== CONSTANTS.JOB_FINISHED) {
                    remove = true;
                }

                if (remove) {
                    Model.remove({
                        journal             : {$in: [CONSTANTS.FINISHED_JOB_JOURNAL, CONSTANTS.CLOSED_JOB, CONSTANTS.SALARY_PAYABLE, CONSTANTS.OVERTIME_PAYABLE, CONSTANTS.OVERHEAD]},
                        'sourceDocument._id': jobId
                    }, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                } else {

                    date = result && result.invoice ? moment(result.invoice.date).subtract(1, 'seconds') : null;

                    if (date) {
                        bodyFinishedJob.date = new Date(date);
                        bodyClosedJob.date = new Date(moment(date).subtract(1, 'seconds'));

                        Model.aggregate([{
                            $match: {
                                'sourceDocument._id'  : jobId,
                                'sourceDocument.model': 'wTrack',
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $group: {
                                _id   : null,
                                amount: {$sum: '$debit'}
                            }
                        }], function (err, result) {
                            if (err) {
                                return console.log(err);
                            }

                            bodyFinishedJob.amount = result && result[0] ? result[0].amount : 0;
                            bodyClosedJob.amount = result && result[0] ? result[0].amount : 0;

                            if (bodyFinishedJob.amount > 0) {
                                createReconciled(bodyFinishedJob, req.session.lastDb, jobFinshedCb, req.session.uId);
                            }

                            if (bodyClosedJob.amount > 0) {
                                createReconciled(bodyClosedJob, req.session.lastDb, jobFinshedCb, req.session.uId);
                            }

                        });

                    }

                }

            }
        });

    }

    this.checkAndCreateForJob = function (options) {
        checkAndCreateForJob(options);
    };

    this.createIdleByMonth = function (options) {
        var req = options.req;
        var callback = options.callback;
        var month = options.month;
        var year = options.year;
        var Holidays = models.get(req.session.lastDb, 'Holiday', holidaysSchema);
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var Vacation = models.get(req.session.lastDb, 'Vacation', vacationSchema);
        var startDate = moment(new Date()).year(year).month(month - 1).startOf('month');
        var endDate = moment(new Date()).year(year).month(month - 1).endOf('month');
        var parallelFuncs;
        var waterfallFuncs;
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var date = moment(endDate).set({
            hour       : 20,
            minute     : 0,
            second     : 0,
            millisecond: 0
        });
        var dateByMonth = year * 100 + month;

        function parallelFuncFind(wfCb) {

            function findHolidays(pCb) {
                var query = Holidays.find({dateByMonth: year * 100 + month}).lean();

                query.exec(function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            }

            function findAllDevs(pCb) {
                var query = {
                    $and: [{
                        $or: [{
                            $and: [{
                                isEmployee: true
                            }, {
                                $or: [{
                                    lastFire: null
                                }, {
                                    lastFire: {
                                        $ne : null,
                                        $gte: new Date(startDate)
                                    }
                                }, {
                                    lastHire: {
                                        $ne : null,
                                        $lte: new Date(endDate)
                                    }
                                }]
                            }]
                        }, {
                            $and: [{
                                isEmployee: false
                            }, {
                                lastFire: {
                                    $ne : null,
                                    $gte: new Date(startDate)
                                }
                            }]
                        }
                        ]
                    }]
                };

                Employee.aggregate([{
                    $match: {
                        // 'department': {$nin: notDevArray},
                        hire: {$ne: []}
                    }
                }, {
                    $lookup: {
                        from        : 'transfers',
                        localField  : '_id',
                        foreignField: 'employee',
                        as          : 'transfer'
                    }
                }, {
                    $project: {
                        isEmployee: 1,
                        department: 1,
                        fire      : 1,
                        transfer  : 1,
                        hire      : 1,
                        lastFire  : 1,
                        lastHire  : {
                            $let: {
                                vars: {
                                    lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                                },

                                in: {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                            }
                        }
                    }
                }, {
                    $project: {
                        _id     : 1,
                        transfer: 1,
                        hire    : 1,
                        fire    : 1
                    }
                }, {
                    $unwind: '$transfer'
                }, {
                    $lookup: {
                        from        : 'weeklySchedulers',
                        localField  : 'transfer.weeklyScheduler',
                        foreignField: '_id',
                        as          : 'transfer.weeklyScheduler'
                    }
                }, {
                    $project: {
                        'transfer.weeklyScheduler': {$arrayElemAt: ['$transfer.weeklyScheduler', 0]},
                        'transfer.date'           : 1,
                        'transfer.salary'         : 1,
                        'transfer.department'     : 1,
                        'transfer.status'         : 1,
                        hire                      : 1,
                        fire                      : 1
                    }
                }, {
                    $group: {
                        _id     : '$_id',
                        transfer: {$addToSet: '$transfer'},
                        hire    : {$addToSet: '$hire'},
                        fire    : {$addToSet: '$fire'}
                    }
                }, {
                    $lookup: {
                        from        : 'Vacation',
                        localField  : '_id',
                        foreignField: 'employee',
                        as          : 'vacations'
                    }
                }, {
                    $project: {
                        vacations: 1,
                        transfer : 1,
                        hire     : {$arrayElemAt: ['$hire', 0]},
                        fire     : {$arrayElemAt: ['$fire', 0]}
                    }
                }], function (err, employees) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, employees);
                });

            }

            function findOrdinaryWorked(pCb) {
                wTrack.aggregate([{
                    $match: {
                        month: month,
                        year : year,
                        _type: 'ordinary'
                    }
                }, {
                    $group: {
                        _id        : '$employee',
                        worked     : {$sum: '$worked'},
                        dateByMonth: {$addToSet: '$dateByMonth'}
                    }
                }, {
                    $project: {
                        dateByMonth: {$arrayElemAt: ['$dateByMonth', 0]},
                        worked     : 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            }

            function removeIdleAndVacation(pCb) {
                Model.remove({
                    journal: {$in: [objectId(CONSTANTS.VACATION_PAYABLE), objectId(CONSTANTS.IDLE_PAYABLE)]},
                    date   : {$gte: new Date(startDate), $lte: new Date(endDate)}
                }, function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            }

            parallelFuncs = [findHolidays, findAllDevs, findOrdinaryWorked, removeIdleAndVacation];

            async.parallel(parallelFuncs, function (err, result) {
                if (err) {
                    return wfCb(err);
                }

                wfCb(null, {holidays: result[0], employees: result[1], employeeWorked: result[2]});
            });
        }

        function forEachEmployee(result, wfCb) {
            var holidays = result.holidays;
            var employeeWorked = result.employeeWorked;
            var employees = result.employees;

            async.each(employees, function (empObject, asyncCb) {
                var employeeId = empObject._id;
                var transfer = empObject.transfer;
                var hire = empObject.hire;
                var fire = empObject.fire;
                var salaryForDate = 0;
                var hoursInMonth = 0;
                var weeklyScheduler = {};
                var hoursToRemove = 0;
                var costForHour;
                var checkDate;
                var vacationObject;
                var transferLength = empObject.transfer.length;
                var vacationDate;
                var dayOfWeek;
                var vacationHours = 0;
                var vacationCost = 0;
                var employeeWorkedObject = _.find(employeeWorked, function (el) {
                    return el._id.toString() === employeeId.toString()
                });
                var vacations = empObject && empObject.vacations ? empObject.vacations : [];
                var localEndDate = moment(endDate).date();
                var localStartKey = 1;
                var i;
                var department = '';
                var vacationBody = {
                    currency      : CONSTANTS.CURRENCY_USD,
                    journal       : CONSTANTS.VACATION_PAYABLE,
                    date          : new Date(date),
                    sourceDocument: {
                        model: 'Employees',
                        _id  : employeeId
                    },

                    amount: 0
                };

                var cb = _.after(2, asyncCb);

                var salaryIdleBody = {
                    currency: CONSTANTS.CURRENCY_USD,
                    journal : CONSTANTS.IDLE_PAYABLE,
                    date    : new Date(date),

                    sourceDocument: {
                        model: 'Employees',
                        _id  : employeeId
                    }
                };
                var worked = employeeWorkedObject && employeeWorkedObject.worked ? employeeWorkedObject.worked : 0;
                var idleHours;
                var transferObj;
                var totalInMonth = 0;
                var hireKey = moment(new Date(hire[hire.length - 1])).year() * 100 + moment(new Date(hire[hire.length - 1])).month() + 1;
                var fireKey = fire[0] ? moment(new Date(fire[fire.length - 1])).year() * 100 + moment(new Date(fire[fire.length - 1])).month() + 1 : Infinity;
                var localKey = moment(endDate).year() * 100 + moment(endDate).month() + 1;

                if (hireKey === localKey) {
                    localStartKey = moment(new Date(hire[hire.length - 1])).date();
                    startDate = moment(new Date(hire[hire.length - 1]));
                }

                if (fireKey === localKey) {
                    localEndDate = moment(new Date(fire[fire.length - 1])).date();
                } else if (fireKey < localKey) {
                    localEndDate = localStartKey - 1;
                }

                transfer = _.sortBy(transfer, 'date');

                for (i = transferLength - 1; i >= 0; i--) {
                    transferObj = transfer[i];

                    if ((moment(moment(startDate).add(12, 'hours')).isAfter(moment(transferObj.date))) || (moment(moment(startDate)).isSame(moment(transferObj.date)))) {
                        if (transferObj.status === 'fired') {
                            if (transfer[i - 1] && moment(startDate).isAfter(transfer[i - 1].date)) {
                                salaryForDate = transferObj.salary;
                                weeklyScheduler = transferObj.weeklyScheduler;
                                department = transferObj.department;
                                break;
                            }
                        } else if (transferObj.status !== 'transfer') {
                            salaryForDate = transferObj.salary;
                            weeklyScheduler = transferObj.weeklyScheduler;
                            department = transferObj.department;
                            break;
                        }
                    }
                }

                if (notDevArray.indexOf(department.toString()) !== -1) {
                    salaryForDate = 0;
                }

                weeklyScheduler = weeklyScheduler || {};

                holidays.forEach(function (holiday) {
                    if ((holiday.day !== 0) && (holiday.day !== 6)) {
                        hoursToRemove += parseInt(weeklyScheduler[holiday.day], 10) || 0;
                    }
                });

                for (i = localEndDate; i >= localStartKey; i--) {
                    checkDate = moment(endDate).date(i).day();

                    if (checkDate === 0) {
                        checkDate = 7;
                    }
                    hoursInMonth += parseInt(weeklyScheduler[checkDate], 10) || 0;

                }

                for (i = moment(endDate).date(); i >= 1; i--) {
                    checkDate = moment(endDate).date(i).day();

                    if (checkDate === 0) {
                        checkDate = 7;
                    }
                    totalInMonth += parseInt(weeklyScheduler[checkDate], 10) || 0;

                }
                totalInMonth -= hoursToRemove;
                hoursInMonth -= hoursToRemove;
                idleHours = hoursInMonth - worked;

                costForHour = isFinite(salaryForDate / totalInMonth) ? salaryForDate / totalInMonth : 0;

                if (idleHours >= 0) {

                    vacationObject = _.find(vacations, function (vacation) {
                        return ((vacation.employee.toString() === employeeId.toString()) && (vacation.dateByMonth === dateByMonth));
                    });

                    if (vacationObject && vacationObject.vacArray) {
                        vacationObject.vacArray.forEach(function (vac, index) {
                            vacationDate = moment(startDate).date(index + 1);
                            dayOfWeek = vacationDate.day();

                            if (vac && (vac !== 'P') && (vac !== 'E') && (dayOfWeek !== 6) && (dayOfWeek !== 0)) {
                                vacationHours += parseInt(weeklyScheduler[dayOfWeek], 10) || 0;
                            }
                        });
                    }

                    vacationCost = vacationHours * costForHour * 100;

                    salaryIdleBody.amount = (idleHours - vacationHours) * costForHour * 100;
                    vacationBody.amount = vacationCost;

                    if (vacationBody.amount > 0) {
                        createReconciled(vacationBody, req.session.lastDb, cb, req.session.uId);
                    } else {
                        cb();
                    }

                    if (salaryIdleBody.amount > 0) {
                        createReconciled(salaryIdleBody, req.session.lastDb, cb, req.session.uId);
                    } else {
                        cb();
                    }

                } else if (idleHours < 0) {
                    console.log('bad employees wTracks', employeeId, localKey, hoursInMonth);
                    asyncCb();
                }

            }, function () {
                wfCb();
            });

        }

        waterfallFuncs = [parallelFuncFind, forEachEmployee];

        async.waterfall(waterfallFuncs, function (err) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    };

    function closeMonth(req, res, next, dateObject, cb) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = dateObject || req.body;
        var month = parseInt(query.month, 10);
        var year = parseInt(query.year, 10);
        var startDate = moment().year(year).month(month - 1).startOf('month');
        var localDate = moment().year(year).month(month - 1).endOf('month');
        var jeDate = moment(localDate).subtract(3, 'hours');
        var waterlallTasks;
        var productSales;
        var COGS;

        var parallelCreate = function (wfCb) {
            var parallelTasks;

            var createIncomeSummary = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(localDate)
                        },

                        account: objectId(CONSTANTS.PRODUCT_SALES)
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var debit;
                    var credit;
                    var balance;
                    var body;

                    if (err) {
                        return cb(err);
                    }

                    debit = result[0] ? result[0].debit : 0;
                    credit = result[0] ? result[0].credit : 0;
                    balance = Math.abs(debit - credit);

                    productSales = balance;

                    body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CREDIT_IS,
                        date          : new Date(jeDate),
                        sourceDocument: {
                            model: 'closeMonth',
                            _id  : null
                        },

                        amount: balance
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                });
            };

            var createCloseCOGS = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(localDate)
                        },

                        account: objectId(CONSTANTS.COGS)
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var debit;
                    var credit;
                    var balance;
                    var body;

                    if (err) {
                        return cb(err);
                    }

                    debit = result[0] ? result[0].debit : 0;
                    credit = result[0] ? result[0].credit : 0;
                    balance = debit - credit;

                    COGS = balance;

                    body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_COGS,
                        date          : new Date(jeDate),
                        sourceDocument: {
                            model: 'closeMonth',
                            _id  : null
                        },

                        amount: balance
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                });
            };

            var cretaeCloseVacation = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(localDate)
                        },

                        account: objectId(CONSTANTS.VACATION_EXPENSES)
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var debit;
                    var credit;
                    var balance;
                    var body;

                    if (err) {
                        return cb(err);
                    }

                    debit = result[0] ? result[0].debit : 0;
                    credit = result[0] ? result[0].credit : 0;
                    balance = debit - credit;

                    body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_VAC_EXP,
                        date          : new Date(jeDate),
                        sourceDocument: {
                            model: 'closeMonth'
                        },

                        amount: balance,
                        _id   : null
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                });
            };

            var createCloseIdle = function (cb) {
                Model.aggregate([{
                    $match: {
                        date                  : {$gte: new Date(startDate), $lte: new Date(localDate)},
                        'sourceDocument.model': 'Employees',
                        journal               : objectId(CONSTANTS.IDLE_PAYABLE),
                        credit                : {$gt: 0}
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var debit;
                    var credit;
                    var balance;
                    var body;

                    if (err) {
                        return cb(err);
                    }

                    debit = result[0] ? result[0].debit : 0;
                    credit = result[0] ? result[0].credit : 0;
                    balance = Math.abs(debit - credit);

                    body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_IDLE_EXP,
                        date          : new Date(jeDate),
                        sourceDocument: {
                            model: 'closeMonth'
                        },

                        amount: balance
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                });
            };

            var createCloseAdminSalary = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(localDate)
                        },

                        account: objectId(CONSTANTS.ADMIN_SALARY_EXPENSES)
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var debit;
                    var credit;
                    var balance;
                    var body;

                    if (err) {
                        return cb(err);
                    }

                    debit = result[0] ? result[0].debit : 0;
                    credit = result[0] ? result[0].credit : 0;
                    balance = debit - credit;

                    body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_ADMIN_EXP,
                        date          : new Date(jeDate),
                        sourceDocument: {
                            model: 'closeMonth'
                        },

                        amount: balance
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                });
            };

            parallelTasks = [createIncomeSummary, createCloseCOGS, cretaeCloseVacation, createCloseIdle, createCloseAdminSalary];
            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return wfCb(err);
                }

                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(localDate)
                        },

                        account: objectId(CONSTANTS.TOTAL_EXPENSES)
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, je) {
                    var debit;
                    var credit;
                    var balance;
                    var body;
                    var cb;

                    if (err) {
                        return wfCb(err);
                    }

                    debit = je[0] ? je[0].debit : 0;
                    credit = je[0] ? je[0].credit : 0;
                    balance = Math.abs(debit - credit);

                    body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_ADMIN_BUD,
                        date          : new Date(jeDate),
                        sourceDocument: {
                            model: 'closeMonth'
                        },

                        amount: balance
                    };

                    cb = function () {
                        wfCb(null, result);
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);

                });
            });
        };

        var createRE = function (result, wfCb) {
            Model.aggregate([{
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(localDate)
                    },

                    account: objectId(CONSTANTS.INCOME_SUMMARY_ACCOUNT)
                }
            }, {
                $group: {
                    _id   : null,
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'}
                }
            }], function (err, result) {
                var debit;
                var credit;
                var balance;
                var body;

                if (err) {
                    return wfCb(err);
                }

                debit = result[0] ? result[0].debit : 0;
                credit = result[0] ? result[0].credit : 0;
                balance = Math.abs(debit - credit);

                if (productSales - COGS < 0) {
                    balance = balance * (-1);
                }

                body = {
                    currency      : CONSTANTS.CURRENCY_USD,
                    journal       : CONSTANTS.RETAINED_EARNINGS,
                    date          : new Date(jeDate),
                    sourceDocument: {
                        model: 'closeMonth'
                    },

                    amount: balance
                };

                createReconciled(body, req.session.lastDb, wfCb, req.session.uId);
            });
        };

        waterlallTasks = [parallelCreate, createRE];

        async.waterfall(waterlallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            if (cb) {
                cb(null, result);
            } else {
                res.status(200).send({success: true});
            }
        });
    }

    this.closeMonth = function (req, res, next) {
        closeMonth(req, res, next);
    };

    this.recloseMonth = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var body = req.body;

        async.each(body, function (date, cb) {
            var endDate = moment(date).endOf('month');
            var startDate = moment(date).startOf('month');

            Model.remove({
                journal: {$in: CONSTANTS.CLOSE_MONTH_JOURNALS},
                date   : {$gte: new Date(startDate), $lte: new Date(endDate)}
            }, function () {
                var month = moment(date).month() + 1;
                var year = moment(date).year();
                closeMonth(req, res, next, {month: month, year: year}, cb);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });
    };

    this.createCostsForJob = function (options) {
        var req = options.req;
        var jobsArray = options.jobId;
        var newReq = req;

        var cb = options.callback || function () {
                return false;
            };

        newReq.body.jobs = jobsArray;

        reconcile(req, null, cb, cb);
    };

    this.reconcile = function (req, res, next) {
        reconcile(req, res, next);
    };

    function reconcile(req, res, next, cb) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'journalEntry', journalEntrySchema);
        var WTrack = models.get(dbName, 'wTrack', wTrackSchema);
        var Invoice = models.get(dbName, 'wTrackInvoice', invoiceSchema);
        var Job = models.get(dbName, 'jobs', jobsSchema);
        var body = req.body;
        var month = parseInt(body.month, 10);
        var year = parseInt(body.year, 10);
        var date = body.date ? moment(new Date(body.date)) : moment().year(year).month(month - 1).endOf('month');
        var jobIds = body.jobs;
        var reconcileSalaryEntries;
        var reconcileInvoiceEntries;
        var timeToSet = {hour: 15, minute: 1, second: 0, millisecond: 0};
        var parallelTasks;
        var resultArray = [];
        var parallelFunction;
        var reconcileJobs;
        var removeEntries;
        var createForJob;
        var mainWaterfallTasks;
        var getJobsToCreateExpenses;
        var waterfallTasks;
        var match = {};

        if (jobIds && !Array.isArray(jobIds)) {
            jobIds = [jobIds];
            match = {
                jobs: {$in: jobIds}
            };
        }

        getJobsToCreateExpenses = function (mainCb) {
            WTrack.aggregate([{
                $match: match
            }, {
                $group: {
                    _id: '$jobs'
                }
            }], function (err, result) {
                if (err) {
                    return mainCb(err);
                }

                jobIds = _.pluck(result, '_id');

                if (res && res.status) {
                    res.status(200).send({success: true});
                }

                mainCb();
            });
        };

        parallelFunction = function (mainCb) {
            reconcileInvoiceEntries = function (mainCallback) {
                Invoice.find({reconcile: true, approved: true, _type: 'wTrackInvoice'}, function (err, result) {
                    var parallelRemove;
                    var parallelCreate;

                    if (err) {
                        return mainCallback(err);
                    }

                    result.forEach(function (el) {
                        resultArray.push(el._id);
                    });

                    parallelRemove = function (cb) {
                        Model.remove({
                            'sourceDocument._id': {$in: resultArray}
                        }, function (err) {
                            if (err) {
                                return cb(err);
                            }

                            cb(null, resultArray);
                        });
                    };

                    function findProformaPayments(resultArray, cb) {
                        Invoice.aggregate([{
                            $match: {
                                _id: {$in: resultArray}
                            }
                        }, {
                            $project: {
                                payments: 1,
                                _id     : 0
                            }
                        }, {
                            $unwind: '$payments'
                        }, {
                            $lookup: {
                                from        : 'Payment',
                                localField  : 'payments',
                                foreignField: '_id',
                                as          : 'payment'
                            }
                        }, {
                            $project: {
                                payment: {$arrayElemAt: ['$payment', 0]}
                            }
                        }, {
                            $lookup: {
                                from        : 'Invoice',
                                localField  : 'payment.invoice',
                                foreignField: '_id',
                                as          : 'invoice'
                            }
                        }, {
                            $project: {
                                payment: 1,
                                invoice: {$arrayElemAt: ['$invoice', 0]}
                            }
                        }, {
                            $match: {
                                'invoice._type': 'Proforma'
                            }
                        }], function (err, result) {
                            if (err) {
                                return cb(err);
                            }

                            cb(null, result);
                        });
                    }

                    parallelCreate = function (result, cb) {
                        async.each(resultArray, function (element, asyncCb) {
                            Invoice.findById(element, function (err, invoice) {
                                var cb = asyncCb;
                                var proformaPayments = [];
                                var proforma;
                                var paidAmount = 0;
                                var beforeInvoiceBody = {};
                                var journalEntryBody = {};

                                if (err) {
                                    return asyncCb(err);
                                }

                                proforma = _.find(result, function (el) {
                                    var payments = invoice.payments || [];
                                    payments.forEach(function (payment) {
                                        if (el.payment && el.payment._id && (payment.toString() === el.payment._id.toString())) {
                                            proformaPayments.push(el);
                                        }
                                    });
                                });

                                if (proformaPayments.length) {
                                    proformaPayments.forEach(function (el) {
                                        var paymentInfo = el.payment;
                                        var paid = paymentInfo.paidAmount;
                                        var paidInUSD = paid / paymentInfo.currency.rate;

                                        paidAmount += paidInUSD;
                                    });

                                    if (paidAmount) {
                                        cb = _.after(2, asyncCb);

                                        beforeInvoiceBody.date = invoice.invoiceDate;
                                        beforeInvoiceBody.journal = CONSTANTS.BEFORE_INVOICE;
                                        beforeInvoiceBody.currency = invoice.currency ? invoice.currency._id : 'USD';
                                        beforeInvoiceBody.amount = invoice.paymentInfo ? paidAmount : 0;
                                        beforeInvoiceBody.sourceDocument = {};
                                        beforeInvoiceBody.sourceDocument._id = invoice._id;
                                        beforeInvoiceBody.sourceDocument.model = 'Proforma';

                                        if (beforeInvoiceBody.amount > 0) {
                                            createReconciled(beforeInvoiceBody, req.session.lastDb, cb, req.session.uId);
                                        } else {
                                            cb();
                                        }

                                    }
                                }

                                journalEntryBody.date = invoice.invoiceDate;
                                journalEntryBody.journal = invoice.journal || CONSTANTS.INVOICE_JOURNAL;
                                journalEntryBody.currency = invoice.currency ? invoice.currency._id : 'USD';
                                journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
                                journalEntryBody.sourceDocument = {};
                                journalEntryBody.sourceDocument._id = invoice._id;
                                journalEntryBody.sourceDocument.model = 'Invoice';

                                if (journalEntryBody.amount > 0) {
                                    createReconciled(journalEntryBody, req.session.lastDb, cb, req.session.uId);
                                } else {
                                    cb();
                                }

                            });
                        }, function () {
                            cb();
                        });

                    };

                    waterfallTasks = [parallelRemove, findProformaPayments, parallelCreate];

                    async.waterfall(waterfallTasks, function (err) {
                        if (err) {
                            return mainCallback(err);
                        }

                        Invoice.update({_id: {$in: resultArray}}, {$set: {reconcile: false}}, {multi: true}, function (err, result) {
                            if (err) {
                                return mainCallback(err);
                            }

                            // res.status(200).send({success: true});
                            event.emit('sendMessage', {
                                view   : 'journalEntry',
                                message: 'Invoices and Proformas were reconciled',
                                dbName : dbName
                            });
                            mainCallback();
                        });
                    });
                });
            };

            reconcileSalaryEntries = function (mainCallback) {
                WTrack.aggregate([{
                    $match: {
                        jobs: {$in: jobIds}
                    }
                }, {
                    $group: {
                        _id: {
                            employee   : '$employee',
                            _type      : '$_type',
                            dateByMonth: '$dateByMonth',
                            jobs       : '$jobs'
                        },

                        hours: {$sum: '$worked'}
                    }
                }, {
                    $lookup: {
                        from        : 'MonthHours',
                        localField  : '_id.dateByMonth',
                        foreignField: 'dateByMonth',
                        as          : 'dateByMonth'
                    }
                }, {
                    $project: {
                        dateByMonth: {$arrayElemAt: ['$dateByMonth', 0]},
                        hours      : 1
                    }
                }, {
                    $lookup: {
                        from        : 'Vacation',
                        localField  : '_id.dateByMonth',
                        foreignField: 'dateByMonth',
                        as          : 'vacations'
                    }
                }, {
                    $project: {
                        overheadRate: '$dateByMonth.overheadRate',
                        hoursInMonth: '$dateByMonth.hours',
                        dateByMonth : '$dateByMonth.dateByMonth',
                        hours       : 1
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
                        from        : 'Holiday',
                        localField  : 'dateByMonth',
                        foreignField: 'dateByMonth',
                        as          : 'holidays'
                    }
                }, {
                    $project: {
                        employee    : {$arrayElemAt: ['$employee', 0]},
                        overheadRate: 1,
                        hoursInMonth: 1,
                        dateByMonth : 1,
                        holidays    : 1,
                        hours       : 1
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
                        transfer    : '$employee.transfer',
                        employee    : '$employee._id',
                        dateByMonth : 1,
                        hoursInMonth: 1,
                        overheadRate: 1,
                        holidays    : 1,
                        hours       : 1
                    }
                }, {
                    $unwind: '$transfer'
                }, {
                    $lookup: {
                        from        : 'weeklySchedulers',
                        localField  : 'transfer.weeklyScheduler',
                        foreignField: '_id',
                        as          : 'transfer.weeklyScheduler'
                    }
                }, {
                    $project: {
                        'transfer.weeklyScheduler': {$arrayElemAt: ['$transfer.weeklyScheduler', 0]},
                        'transfer.date'           : 1,
                        'transfer.salary'         : 1,
                        'transfer.status'         : 1,
                        employee                  : 1,
                        dateByMonth               : 1,
                        hoursInMonth              : 1,
                        overheadRate              : 1,
                        holidays                  : 1,
                        hours                     : 1
                    }
                }, {
                    $group: {
                        _id: {
                            employee   : '$_id.employee',
                            _type      : '$_id._type',
                            dateByMonth: '$_id.dateByMonth',
                            jobs       : '$_id.jobs'
                        },

                        transfer    : {$addToSet: '$transfer'},
                        employee    : {$addToSet: '$employee'},
                        dateByMonth : {$addToSet: '$dateByMonth'},
                        hoursInMonth: {$addToSet: '$hoursInMonth'},
                        overheadRate: {$addToSet: '$overheadRate'},
                        holidays    : {$addToSet: '$holidays'},
                        hours       : {$addToSet: '$hours'}
                    }
                }, {
                    $project: {
                        transfer    : 1,
                        employee    : {$arrayElemAt: ['$employee', 0]},
                        dateByMonth : {$arrayElemAt: ['$dateByMonth', 0]},
                        hoursInMonth: {$arrayElemAt: ['$hoursInMonth', 0]},
                        overheadRate: {$arrayElemAt: ['$overheadRate', 0]},
                        holidays    : {$arrayElemAt: ['$holidays', 0]},
                        hours       : {$arrayElemAt: ['$hours', 0]}
                    }
                }], function (err, result) {
                    if (err) {
                        return mainCallback(err);
                    }

                    async.each(result, function (item, cb) {
                        var employee = item.employee;
                        var hours = item.hours;
                        var jobId = item._id.jobs;
                        var _type = item._id._type;
                        var overheadRate = item.overheadRate;
                        var dateByMonth = item.dateByMonth || item._id.dateByMonth;
                        var holidays = item.holidays;
                        var transfer = item.transfer;
                        var transferLength = transfer.length;
                        var salaryForDate = 0;
                        var hoursInMonth = 0;
                        var costForHour = 0;
                        var weeklyScheduler = {};
                        var hoursToRemove = 0;
                        var year = dateByMonth.toString().slice(0, 4);
                        var month = dateByMonth.toString().slice(4);
                        var endDate = moment().year(year).month(month - 1).endOf('month');
                        var checkDate;
                        var startDate = moment().year(year).month(month - 1).startOf('month');
                        var entryDate = moment(endDate);

                        var bodySalary = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.SALARY_PAYABLE,
                            date          : entryDate.set(timeToSet),
                            sourceDocument: {
                                model   : 'wTrack',
                                _id     : jobId,
                                employee: employee
                            }
                        };

                        var bodyOvertime = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.OVERTIME_PAYABLE,
                            date          : entryDate.set(timeToSet),
                            sourceDocument: {
                                model   : 'wTrack',
                                _id     : jobId,
                                employee: employee
                            }
                        };

                        var bodyOverhead = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.OVERHEAD,
                            date          : entryDate.set(timeToSet),
                            sourceDocument: {
                                model   : 'wTrack',
                                _id     : jobId,
                                employee: employee
                            }
                        };
                        var i;
                        var transferObj;

                        if (!dateByMonth) {
                            console.log('notDateBymonth');
                            return cb();
                        }

                        transfer = _.sortBy(transfer, 'date');

                        if ((parseInt(year, 10) * 100 + parseInt(month, 10)) === (moment(transfer[0].date).year() * 100 + moment(transfer[0].date).month() + 1)) {
                            startDate = moment(transfer[0].date);
                        }
                        /* for (i = transferLength - 1; i >= 0; i--) {
                         transferObj = transfer[i];

                         if ((moment(moment(startDate).add(12, 'hours')).isAfter(moment(transferObj.date))) || (moment(moment(startDate)).isSame(moment(transferObj.date)))) {
                         if (transferObj.status === 'fired') {
                         if (transfer[i - 1] && moment(startDate).isAfter(transfer[i - 1].date)) {
                         salaryForDate = transferObj.salary;
                         weeklyScheduler = transferObj.weeklyScheduler;
                         break;
                         }
                         } else if (transferObj.status !== 'transfer') {
                         salaryForDate = transferObj.salary;
                         weeklyScheduler = transferObj.weeklyScheduler;
                         break;
                         }
                         }
                         }*/

                        transfer = _.sortBy(transfer, 'date');

                        for (i = transferLength - 1; i >= 0; i--) {
                            transferObj = transfer[i];

                            if ((moment(moment(startDate).add(12, 'hours')).isAfter(moment(transferObj.date))) || (moment(moment(startDate)).isSame(moment(transferObj.date)))) {
                                if (transferObj.status === 'fired') {
                                    if (transfer[i - 1] && moment(startDate).isAfter(transfer[i - 1].date)) {
                                        salaryForDate = transferObj.salary;
                                        weeklyScheduler = transferObj.weeklyScheduler;
                                        break;
                                    }
                                } else if (transferObj.status !== 'transfer') {
                                    salaryForDate = transferObj.salary;
                                    weeklyScheduler = transferObj.weeklyScheduler;
                                    break;
                                }
                            }
                        }

                        if (!Object.keys(weeklyScheduler).length) {
                            weeklyScheduler = {
                                1         : 8,
                                2         : 8,
                                3         : 8,
                                4         : 8,
                                5         : 8,
                                6         : 0,
                                7         : 0,
                                name      : 'UA-40',
                                totalHours: 40
                            };
                        }

                        holidays.forEach(function (holiday) {
                            if ((holiday.day !== 0) && (holiday.day !== 6)) {
                                hoursToRemove += parseInt(weeklyScheduler[holiday.day], 10) || 0;
                            }
                        });

                        for (i = endDate.date(); i >= 1; i--) {
                            checkDate = moment(endDate).date(i).day();

                            if (checkDate === 0) {
                                checkDate = 7;
                            }
                            hoursInMonth += parseInt(weeklyScheduler[checkDate], 10) || 0;
                        }

                        hoursInMonth -= hoursToRemove;

                        costForHour = isFinite(salaryForDate / hoursInMonth) ? salaryForDate / hoursInMonth : 0;

                        Model.remove({
                            'sourceDocument._id'     : jobId,
                            date                     : {$gt: new Date(startDate), $lt: new Date(endDate)},
                            'sourceDocument.employee': objectId(employee)
                        }, function () {

                            var methodCb = function () {
                            };

                            if (_type === 'overtime') {
                                bodyOvertime.amount = hours * costForHour * 100;
                                bodyOverhead.amount = hours * overheadRate * 100;

                                if (bodyOverhead.amount > 0) {
                                    createReconciled(bodyOverhead, req.session.lastDb, methodCb, req.session.uId);
                                }
                                if (bodyOvertime.amount > 0) {
                                    createReconciled(bodyOvertime, req.session.lastDb, methodCb, req.session.uId);
                                }

                            } else if (_type === 'ordinary') {
                                bodySalary.amount = hours * costForHour * 100;
                                bodyOverhead.amount = hours * overheadRate * 100;

                                if (bodySalary.amount > 0) {
                                    createReconciled(bodySalary, req.session.lastDb, methodCb, req.session.uId);
                                }

                                if (bodyOverhead.amount > 0) {
                                    createReconciled(bodyOverhead, req.session.lastDb, methodCb, req.session.uId);
                                }
                            }

                        });

                        cb();
                    }, function () {
                        mainCallback();
                    });

                });
            };

            parallelTasks = [reconcileInvoiceEntries, reconcileSalaryEntries];

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return mainCb(err);
                }
                mainCb(null, result);
            });
        };

        reconcileJobs = function (result, mainCb) {

            removeEntries = function (cb) {
                Model.remove({
                    journal             : {$in: [CONSTANTS.FINISHED_JOB_JOURNAL, CONSTANTS.CLOSED_JOB]},
                    'sourceDocument._id': {$in: jobIds}
                }, function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
            };

            createForJob = function (result, cb) {

                Job.find({_id: {$in: jobIds}}, {invoice: 1}).populate('invoice').lean().exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    async.each(result, function (model, asyncCb) {
                        var date;
                        var jobId = model._id;
                        var callback = _.after(3, asyncCb);
                        var startMonthDate;
                        var endMonthDate;
                        var checkWriteOff = false;

                        if (!model.invoice) {
                            return asyncCb();
                        }

                        if (model.invoice._type === 'writeOff') {
                            callback = _.after(4, asyncCb);
                            checkWriteOff = true;
                        }

                        date = moment(new Date(model.invoice.invoiceDate)).subtract(1, 'seconds');

                        Model.aggregate([{
                            $match: {
                                'sourceDocument._id'  : jobId,
                                'sourceDocument.model': 'wTrack',
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $group: {
                                _id   : null,
                                amount: {$sum: '$debit'}
                            }
                        }], function (err, result) {
                            var bodyFinishedJob;
                            var bodyClosedJob;
                            var bodyWriteOff;

                            if (err) {
                                return console.log(err);
                            }

                            bodyFinishedJob = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : CONSTANTS.FINISHED_JOB_JOURNAL,
                                sourceDocument: {
                                    model: 'jobs'
                                },

                                amount: 0
                            };

                            bodyClosedJob = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : CONSTANTS.CLOSED_JOB,
                                sourceDocument: {
                                    model: 'jobs'
                                },

                                amount: 0
                            };

                            bodyWriteOff = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : CONSTANTS.WRITE_OFF,
                                sourceDocument: {
                                    model: 'writeOff'
                                },

                                amount: 0
                            };
                            bodyFinishedJob.amount = result && result[0] ? result[0].amount : 0;
                            bodyClosedJob.amount = result && result[0] ? result[0].amount : 0;
                            bodyWriteOff.amount = result && result[0] ? result[0].amount : 0;
                            bodyFinishedJob.date = new Date(date);
                            bodyClosedJob.date = new Date(moment(date).subtract(1, 'seconds'));
                            bodyWriteOff.date = new Date(moment(date).subtract(1, 'seconds'));
                            bodyFinishedJob.sourceDocument._id = jobId;
                            bodyClosedJob.sourceDocument._id = jobId;
                            bodyWriteOff.sourceDocument._id = model.invoice._id;

                            startMonthDate = moment(bodyClosedJob.date).startOf('month');
                            endMonthDate = moment(bodyClosedJob.date).endOf('month');

                            Model.update({
                                'sourceDocument._id'  : jobId,
                                'sourceDocument.model': 'wTrack',
                                date                  : {$gte: new Date(startMonthDate), $lte: new Date(endMonthDate)}
                            }, {$set: {date: new Date(bodyClosedJob.date)}}, {multi: true}, function (err, result) {
                                if (err) {
                                    return callback(err);
                                }

                                callback();
                            });

                            if (bodyFinishedJob.amount > 0) {
                                createReconciled(bodyFinishedJob, req.session.lastDb, callback, req.session.uId);
                            } else {
                                callback();
                            }

                            if (bodyClosedJob.amount > 0) {
                                createReconciled(bodyClosedJob, req.session.lastDb, callback, req.session.uId);
                            } else {
                                callback();
                            }

                            if (checkWriteOff && bodyWriteOff.amount > 0) {
                                Model.remove({
                                    journal             : {$in: [CONSTANTS.WRITE_OFF, CONSTANTS.WRITE_OFF_RD]},
                                    'sourceDocument._id': model.invoice._id
                                }, function (err, result) {
                                    if (err) {
                                        return callback(err);
                                    }

                                    Invoice.findById(model.invoice._id, {
                                        products   : 1,
                                        paymentInfo: 1
                                    }, function (err, result) {
                                        var products;
                                        var paymentInfo;
                                        var newProducts = [];
                                        var newTotal = 0;

                                        if (err) {
                                            return callback(err);
                                        }

                                        result = result.toJSON();

                                        products = result.products;
                                        paymentInfo = result.paymentInfo;

                                        products.forEach(function (prod) {
                                            if (prod.jobs.toString() === jobId.toString()) {

                                                prod.unitPrice = bodyFinishedJob.amount;
                                                prod.subTotal = bodyFinishedJob.amount;

                                                newProducts.push(prod);

                                            } else {
                                                newProducts.push(prod);
                                            }

                                            newTotal += parseInt(prod.unitPrice, 10);
                                        });

                                        paymentInfo.unTaxed = newTotal;
                                        paymentInfo.total = newTotal;

                                        Invoice.findByIdAndUpdate(model.invoice._id, {
                                            $set: {
                                                products   : newProducts,
                                                paymentInfo: paymentInfo
                                            }
                                        }, function (err, resu) {
                                            if (err) {
                                                return callback(err);
                                            }

                                            createReconciled(bodyWriteOff, req.session.lastDb, callback, req.session.uId);

                                        });

                                    });
                                });

                            }
                            ;

                        });
                    }, function () {
                        cb();
                    });
                });
            };

            async.waterfall([removeEntries, createForJob], function (err, result) {
                if (err) {
                    return mainCb(err);
                }

                mainCb(null, result);
            });
        };

        mainWaterfallTasks = [getJobsToCreateExpenses, parallelFunction, reconcileJobs];
        async.waterfall(mainWaterfallTasks, function (err) {
            var db;
            var setObj;

            if (err) {
                return next(err);
            }
            db = models.connection(req.session.lastDb);
            setObj = {date: date};

            console.log('Success');
            event.emit('sendMessage', {
                view   : 'journalEntry',
                message: 'Please, refresh browser, data was changed.',
                dbName : dbName
            });

            if (cb) {
                event.emit('sendMessage', {
                    view   : 'Projects',
                    message: 'Please, refresh browser, costs were calculated.',
                    dbName : dbName
                });

            }

            Job.update({_id: {$in: jobIds}}, {$set: {reconcile: false}}, {multi: true}, function (err, result) {

            });

            db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: setObj}, function (err, result) {
                if (err) {
                    return next(err);
                }
                if (cb && typeof(cb) === 'function') {
                    cb();
                }

            });
        });
    }

    this.getReconcileDate = function (req, res, next) {
        var db = models.connection(req.session.lastDb);

        db.collection('settings').findOne({name: 'reconcileDate'}, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result && result.length) {
                res.status(200).send({date: result.date});
            } else {
                res.status(200).send({date: new Date('14 Jul 2014')});
            }
        });
    };

    this.create = function (body, dbIndex, cb, uId) {
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var Currency = models.get(dbIndex, 'currency', CurrencySchema);
        var journalId = body.journal;
        var now = moment();
        var date = body.date ? moment(body.date) : now;
        var currency;
        var amount = body.amount;
        var rates;

        var waterfallTasks;

        date = date.format('YYYY-MM-DD');

        function currencyNameFinder(waterfallCb) {

            Currency.findById(body.currency, function (err, result) {
                if (err) {
                    waterfallCb(err);
                }

                waterfallCb(null, result.name);
            });
        }

        function journalFinder(currencyName, waterfallCb) {
            var err;

            if (!journalId) {
                err = new Error('Journal id is required field');
                err.status = 400;

                return waterfallCb(err);
            }

            currency = {
                name: currencyName
            };

            Journal.findById(journalId, waterfallCb);

        }

        function journalEntrySave(journal, waterfallCb) {
            var err;
            var debitObject;
            var creditObject;
            var parallelTasks = {
                debitSaver : function (parallelCb) {
                    var journalEntry;

                    debitObject.debit = amount;
                    debitObject.account = journal.debitAccount;

                    debitObject.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    debitObject.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    if (debitObject.currency && debitObject.currency.rate) {
                        debitObject.debit *= debitObject.currency.rate;
                    }

                    if (amount && moment(debitObject.date).isBefore(now)) {
                        journalEntry = new Model(debitObject);
                        journalEntry.save(parallelCb);
                    } else {
                        parallelCb();
                    }

                },
                creditSaver: function (parallelCb) {
                    var journalEntry;

                    creditObject.credit = amount;
                    creditObject.account = journal.creditAccount;

                    creditObject.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    creditObject.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    if (creditObject.currency && creditObject.currency.rate) {
                        creditObject.credit *= creditObject.currency.rate;
                    }

                    if (amount && moment(creditObject.date).isBefore(now)) {
                        journalEntry = new Model(creditObject);
                        journalEntry.save(parallelCb);
                    } else {
                        parallelCb();
                    }
                }
            };

            if (!journal || !journal._id) {
                err = new Error('Invalid Journal');
                err.status = 400;

                return waterfallCb(err);
            }

            currency = {
                name: 'USD',
                rate: 1
            };

            body.currency = currency;
            body.journal = journal._id;

            debitObject = _.extend({}, body);
            creditObject = _.extend({}, body);

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, result);
            });
        }

        waterfallTasks = [currencyNameFinder, journalFinder, journalEntrySave];

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return cb(err);
            }

            if (cb) {
                cb(null, response);
            }
        });
    };

    this.getAsyncCloseMonth = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var date = query._id;
        var startDate = moment(new Date(date)).startOf('month');
        var endDate = moment(new Date(date)).endOf('month');

        if (!date) {
            return res.status(200).send({journalEntries: []});
        }

        Model.aggregate([{
            $match: {
                'sourceDocument.model': 'closeMonth',
                date                  : {$gte: new Date(startDate), $lte: new Date(endDate)}
            }
        }, {
            $project: {
                date   : 1,
                debit  : 1,
                credit : 1,
                journal: 1
            }
        }, {
            $group: {
                _id   : '$journal',
                debit : {$sum: '$debit'},
                credit: {$sum: '$credit'},
                date  : {$addToSet: '$date'}
            }
        }, {
            $lookup: {
                from        : 'journals',
                localField  : '_id',
                foreignField: '_id',
                as          : 'journal'
            }
        }, {
            $project: {
                _id    : 1,
                date   : {$arrayElemAt: ['$date', 0]},
                debit  : 1,
                credit : 1,
                journal: {$arrayElemAt: ['$journal', 0]}
            }
        }, {
            $sort: {
                _id: -1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({journalEntries: result});
        });
    };

    function matchEditor(account, match) {
        var accountName = matchObject[account];

        if (accountName) {
            match[accountName] = {$gt: 0};
        }

        return match;
    }

    this.getAsyncDataForGL = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var account = query._id;
        var startDate = query.startDate;
        var endDate = query.endDate;
        var contentType = query.contentType;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        var match = {
            date   : {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            account: objectId(account)
        };

        if (!contentType) {
            match = matchEditor(account, match);
        }

        if (!account) {
            return res.status(200).send({journalEntries: []});
        }

        /* if (account === CONSTANTS.FINISHED_GOODS){
         match.journal = objectId(CONSTANTS.CLOSED_JOB);
         }

         if (account === CONSTANTS.ACCOUNT_RECEIVABLE){
         match.journal = objectId(CONSTANTS.INVOICE_JOURNAL);
         }*/

        Model.aggregate([{
            $match: match
        }, {
            $project: {
                date   : 1,
                debit  : 1,
                credit : 1,
                account: 1
            }
        }, /* , {
         $group: {
         _id    : '$date',
         debit  : {$sum: '$debit'},
         credit : {$sum: '$credit'},
         account: {$addToSet: '$account'}
         }
         }*/
            {
                $project: {
                    _id    : '$date',
                    debit  : 1,
                    credit : 1,
                    account: 1
                }
            }, {
                $sort: {
                    _id: -1
                }
            }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({journalEntries: result});
        });

    };

    this.getAsyncData = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var sourceDocument = query._id;
        var date = query.date;

        Model
            .aggregate([{
                $match: {
                    'sourceDocument.model': 'wTrack',
                    'sourceDocument._id'  : objectId(sourceDocument),
                    date                  : new Date(date),
                    debit                 : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    date          : 1,
                    debit         : 1,
                    sourceDocument: 1,
                    journal       : {$arrayElemAt: ['$journal', 0]}
                }
            }, {
                $project: {
                    date          : 1,
                    debit         : 1,
                    sourceDocument: 1,
                    journal       : 1,
                    journalName   : '$journal.name'
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.debitAccount',
                    foreignField: '_id',
                    as          : 'journal.debitAccount'
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.creditAccount',
                    foreignField: '_id',
                    as          : 'journal.creditAccount'
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
                    date                   : 1,
                    debit                  : 1,
                    'journal.creditAccount': {$arrayElemAt: ['$journal.creditAccount', 0]},
                    'journal.debitAccount' : {$arrayElemAt: ['$journal.debitAccount', 0]},
                    employee               : {$arrayElemAt: ['$employee', 0]},
                    journalName            : 1
                }
            }, {
                $project: {
                    date                   : 1,
                    debit                  : 1,
                    'journal.creditAccount': '$journal.creditAccount.name',
                    'journal.debitAccount' : '$journal.debitAccount.name',
                    journalName            : 1,
                    employee               : {$concat: ['$employee.name.first', ' ', '$employee.name.last']}
                }
            }, {
                $sort: {
                    date    : 1,
                    employee: 1,
                    journal : 1
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({journalEntries: result});
            });
    };

    this.getCloseMonth = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var closeMonth = CONSTANTS.CLOSE_MONTH_JOURNALS;

        Model.aggregate([{
            $match: {
                journal: {$in: closeMonth.objectID()}
            }
        }, {
            $group: {
                _id: '$date'
            }
        }, {
            $sort: {
                _id: 1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getBalanceSheet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var getAssets;
        var getLiabilities;
        var getEquities;
        var query = req.query;
        var startDate = query.startDate;
        var endDate = query.endDate;
        var liabilities = CONSTANTS.LIABILITIES.objectID();
        var equity = CONSTANTS.EQUITY.objectID();
        var currentAssets = [CONSTANTS.ACCOUNT_RECEIVABLE, CONSTANTS.WORK_IN_PROCESS, CONSTANTS.FINISHED_GOODS];
        var allAssets = _.union(CONSTANTS.BANK_AND_CASH, currentAssets);
        var replaceToAssets = false;
        var resultLiabilities;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        getAssets = function (cb) {
            Model.aggregate([{
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },

                    account: {$in: allAssets.objectID()}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $project: {
                    credit : 1,
                    debit  : 1,
                    account: {$arrayElemAt: ['$account', 0]}
                }
            }, {
                $group: {
                    _id   : '$account._id',
                    name  : {$addToSet: '$account.name'},
                    credit: {$sum: '$credit'},
                    debit : {$sum: '$debit'}
                }
            }, {
                $project: {
                    _id   : 1,
                    debit : 1,
                    credit: 1,
                    name  : {$arrayElemAt: ['$name', 0]}
                }
            }, {
                $sort: {
                    name: 1
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        getLiabilities = function (cb) {
            var parallelTasks;

            var getAccountPayable = function (pcb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.ACCOUNT_PAYABLE)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        credit: {$sum: '$credit'},
                        debit : {$sum: '$debit'}
                    }
                }, {
                    $project: {
                        _id   : 1,
                        credit: 1,
                        debit : 1,
                        name  : {$arrayElemAt: ['$name', 0]},
                        group : {$concat: ['liabilities']}
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pcb(err);
                    }

                    pcb(null, result);
                });
            };

            var getUnearnedRevenue = function (pcb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.CURRENT_LIABILITIES)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        credit: {$sum: '$credit'},
                        debit : {$sum: '$debit'}
                    }
                }, {
                    $project: {
                        _id   : 1,
                        credit: 1,
                        debit : 1,
                        name  : {$arrayElemAt: ['$name', 0]},
                        group : {$concat: ['liabilities']}
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    var sum;

                    if (err) {
                        return pcb(err);
                    }

                    sum = result && result.length ? result[0].debit - result[0].credit : 0;

                    if (sum > 0) {
                        replaceToAssets = true;
                        result[0].group = '';
                    }

                    pcb(null, result);
                });
            };

            var getOther = function (pcb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: {$in: liabilities}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        debit  : 1,
                        credit : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        credit: {$sum: '$credit'},
                        debit : {$sum: '$debit'}
                    }
                }, {
                    $project: {
                        _id   : 1,
                        credit: 1,
                        debit : 1,
                        name  : {$arrayElemAt: ['$name', 0]},
                        group : {$concat: ['liabilities']}
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pcb(err);
                    }

                    pcb(null, result);
                });
            };

            parallelTasks = [getAccountPayable, getUnearnedRevenue, getOther];

            async.parallel(parallelTasks, function (err, result) {
                var newResult;

                if (err) {
                    return cb(err);
                }

                newResult = _.union(result[0], result[2]);

                if (!replaceToAssets) {
                    newResult = _.union(newResult, result[1]);
                } else {
                    resultLiabilities = result[1];
                }

                cb(null, newResult);
            });
        };

        getEquities = function (cb) {
            Model.aggregate([{
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },

                    account: {$in: equity}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $project: {
                    date   : 1,
                    debit  : 1,
                    credit : 1,
                    account: {$arrayElemAt: ['$account', 0]}
                }
            }, {
                $group: {
                    _id   : '$account._id',
                    name  : {$addToSet: '$account.name'},
                    credit: {$sum: '$credit'},
                    debit : {$sum: '$debit'}
                }
            }, {
                $sort: {
                    name: 1
                }
            }], function (err, result) {
                var debit;
                var credit;
                var balance;
                var name;
                var id;

                if (err) {
                    return cb(err);
                }

                debit = result[0] ? result[0].debit : 0;
                credit = result[0] ? result[0].credit : 0;

                balance = debit - credit;
                name = result[0] ? result[0].name : '300200 Retained Earnings';
                id = result[0] ? result[0]._id : '56f538c39c85020807b40024';

                if (balance < 0) {
                    debit = debit * (-1);
                    credit = credit * (-1);
                } else {
                    debit = 0;
                    credit = balance;
                }

                cb(null, [{_id: id, name: name, credit: credit, debit: debit, group: 'assets'}]);
            });
        };

        async.parallel([getAssets, getLiabilities, getEquities], function (err, result) {
            if (err) {
                return next(err);
            }

            var assetsArray = result[0];

            if (resultLiabilities) {
                assetsArray = _.union(assetsArray, resultLiabilities);
            }

            res.status(200).send({assets: assetsArray, liabilities: result[1], equity: result[2]});
        });
    };

    this.getBalanceForAccount = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var account = query.account;
        var date = query.date;

        date = moment(new Date(date)).endOf('day');

        Model.aggregate([{
            $match: {
                account: objectId(account),
                date   : {
                    $lte: new Date(date)
                }
            }
        }, {
            $project: {
                date   : 1,
                debit  : {$divide: ['$debit', '$currency.rate']},
                credit : {$divide: ['$credit', '$currency.rate']},
                account: 1
            }
        }, {
            $group: {
                _id   : '$account',
                debit : {$sum: '$debit'},
                credit: {$sum: '$credit'}
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({maxAmount: result && result.length ? result[0].debit - result[0].credit : 0})
        });

    };

    this.getExpenses = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var query = req.query;
        var month = parseInt(query.month, 10);
        var year = parseInt(query.year, 10);
        var startDate = moment().year(year).month(month - 1).startOf('month');
        var endDate = moment(startDate).endOf('month');
        var parallelTasks;

        var adminExpenses = function (cb) {
            Model.aggregate([{
                $match: {
                    date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                    'sourceDocument.model': 'expensesInvoice',
                    debit                 : {$gt: 0}
                }
            }, {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$debit'
                    }
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result && result.length ? result[0].sum : 0);
            });
        };

        var vacationExpenses = function (cb) {
            Model.aggregate([{
                $match: {
                    date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                    'sourceDocument.model': 'Employees',
                    journal               : objectId(CONSTANTS.VACATION_PAYABLE),
                    credit                : {$gt: 0}
                }
            }, {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$credit'
                    }
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result && result.length ? result[0].sum : 0);
            });
        };

        var idleExpenses = function (cb) {
            Model.aggregate([{
                $match: {
                    date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                    'sourceDocument.model': 'Employees',
                    journal               : objectId(CONSTANTS.IDLE_PAYABLE),
                    credit                : {$gt: 0}
                }
            }, {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$credit'
                    }
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result && result.length ? result[0].sum : 0);
            });
        };

        var adminSalary = function (cb) {
            Model.aggregate([{
                $match: {
                    date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                    'sourceDocument.model': 'Employees',
                    journal               : objectId(CONSTANTS.ADMIN_SALARY_JOURNAL),
                    credit                : {$gt: 0}
                }
            }, {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$credit'
                    }
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result && result.length ? result[0].sum : 0);
            });
        };

        var actualHours = function (cb) {
            wTrack.aggregate([{
                $match: {
                    month: month,
                    year : year
                }
            }, {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$worked'
                    }
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result && result.length ? result[0].sum : 0);
            });
        };

        var marketingExpenses = function (cb) {
            Model.aggregate([{
                $match: {
                    date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                    'sourceDocument.model': 'writeOff',
                    journal               : objectId(CONSTANTS.WRITE_OFF),
                    credit                : {$gt: 0}
                }
            }, {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$credit'
                    }
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result && result.length ? result[0].sum : 0);
            });
        };

        parallelTasks = {
            adminExpenses   : adminExpenses,
            vacationExpenses: vacationExpenses,
            idleExpenses    : idleExpenses,
            adminSalary     : adminSalary,
            actualHours     : actualHours,
            marketingBudget : marketingExpenses
        };

        async.parallel(parallelTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });

    };

    this.getInventoryReport = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var query = req.query;
        /*var startDate = query.startDate || query.filter.startDate.value;
         var endDate = query.endDate || query.filter.endDate.value;*/
        var findJobs;
        var composeReport;
        var waterfallTasks;
        var sort = {name: 1};
        var paginationObject = pageHelper(query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var filter = query.filter || {};
        var filterObject = {};
        var key;
        var sortKey;
        var i;
        var filterMapper = new FilterMapper();
        var matchObject = {};
        var startDate;
        var endDate;

        if (query.sort) {
            sort = {};
            sortKey = Object.keys(query.sort);

            for (i = sortKey.length - 1; i >= 0; i--) {
                key = sortKey[i];
                sort[key] = parseInt(query.sort[key], 10);
            }
        }

        findJobs = function (wfCb) {
            JobsModel.find({}, function (err, result) {
                var jobs = [];

                if (err) {
                    return wfCb(err);
                }

                result.forEach(function (el) {
                    jobs.push(el._id);
                });

                wfCb(null, jobs);
            });
        };

        /* i f (filter) {
         filterArray = caseFilter(filter);

         if (filterArray.length) {*/

        filterObject = filterMapper.mapFilter(filter, 'inventoryReport'); // filterArray;

        if (filterObject.date) {
            matchObject = filterObject.date;

            delete filterObject.date;
        }

        startDate = matchObject.$gte;
        endDate = matchObject.$lte;

        composeReport = function (jobs, wfCb) {
            var parallelTasks;

            var getOpening = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                  : {$lte: matchObject.$gte},
                        debit                 : {$gt: 0},
                        'sourceDocument._id'  : {$in: jobs},
                        'sourceDocument.model': 'wTrack'
                    }
                }, {
                    $project: {
                        sourceDocument: 1,
                        debit         : 1
                    }
                }, {
                    $group: {
                        _id  : '$sourceDocument._id',
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $lookup: {
                        from        : 'jobs',
                        localField  : '_id',
                        foreignField: '_id',
                        as          : '_id'
                    }
                }, {
                    $project: {
                        _id  : {$arrayElemAt: ['$_id', 0]},
                        debit: 1
                    }
                }, {
                    $lookup: {
                        from        : 'projectMembers',
                        localField  : '_id.project',
                        foreignField: 'projectId',
                        as          : 'projectMembers'
                    }
                }, {
                    $lookup: {
                        from        : 'Project',
                        localField  : '_id.project',
                        foreignField: '_id',
                        as          : 'project'
                    }
                }, {
                    $project: {
                        _id    : '$_id._id',
                        name   : '$_id.name',
                        project: {$arrayElemAt: ['$project', 0]},
                        debit  : 1,

                        salesManagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : {
                                    $and: [{
                                        $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                    }, {
                                        $eq: ['$$projectMember.endDate', null]
                                    }]
                                }
                            }
                        }
                    }
                }, {
                    $project: {
                        salesManager: {$arrayElemAt: ['$salesManagers', 0]},
                        _id         : 1,
                        name        : 1,
                        project     : 1,
                        debit       : 1
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
                        _id         : 1,
                        name        : 1,
                        project     : 1,
                        debit       : 1,
                        salesmanager: {$arrayElemAt: ['$salesManager', 0]}
                    }
                }, {
                    $match: filterObject
                }, {
                    $project: {
                        _id         : 1,
                        name        : 1,
                        project     : 1,
                        debit       : 1,
                        salesmanager: {$concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']}
                    }
                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result || []);
                });
            };

            var getInwards = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                  : matchObject,
                        debit                 : {$gt: 0},
                        'sourceDocument._id'  : {$in: jobs},
                        'sourceDocument.model': 'wTrack'
                    }
                }, {
                    $project: {
                        sourceDocument: 1,
                        debit         : 1
                    }
                }, {
                    $group: {
                        _id  : '$sourceDocument._id',
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $lookup: {
                        from        : 'jobs',
                        localField  : '_id',
                        foreignField: '_id',
                        as          : '_id'
                    }
                }, {
                    $project: {
                        _id  : {$arrayElemAt: ['$_id', 0]},
                        debit: 1
                    }
                }, {
                    $lookup: {
                        from        : 'Project',
                        localField  : '_id.project',
                        foreignField: '_id',
                        as          : 'project'
                    }
                }, {
                    $project: {
                        _id    : '$_id._id',
                        name   : '$_id.name',
                        project: {$arrayElemAt: ['$project', 0]},
                        debit  : 1
                    }
                }, {
                    $lookup: {
                        from        : 'projectMembers',
                        localField  : 'project._id',
                        foreignField: 'projectId',
                        as          : 'projectMembers'
                    }
                }, {
                    $project: {
                        _id    : 1,
                        name   : 1,
                        project: 1,
                        debit  : 1,

                        salesManagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : {
                                    $and: [{
                                        $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                    }, {
                                        $eq: ['$$projectMember.endDate', null]
                                    }]
                                }
                            }
                        }

                    }
                }, {
                    $project: {
                        _id         : 1,
                        name        : 1,
                        project     : 1,
                        debit       : 1,
                        salesManager: {$arrayElemAt: ['$salesManagers', 0]}
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
                        _id         : 1,
                        name        : 1,
                        project     : 1,
                        debit       : 1,
                        salesmanager: {$arrayElemAt: ['$salesManager', 0]}
                    }
                }, {
                    $match: filterObject
                }, {
                    $project: {
                        _id         : 1,
                        name        : 1,
                        project     : 1,
                        debit       : 1,
                        salesmanager: {$concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']}
                    }

                }
                ], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result || []);
                });
            };

            var getOutwards = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                : {$lte: matchObject.$lte/* , $gte: startDate*/},
                        debit               : {$gt: 0},
                        'sourceDocument._id': {$in: jobs},
                        journal             : objectId(CONSTANTS.CLOSED_JOB)/* objectId(CONSTANTS.FINISHED_JOB_JOURNAL)*/
                    }
                }, {
                    $lookup: {
                        from        : 'jobs',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument'
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
                        sourceDocument: {$arrayElemAt: ['$sourceDocument', 0]},
                        project       : {$arrayElemAt: ['$project', 0]},
                        debit         : 1,
                        date          : 1
                    }
                }, {
                    $lookup: {
                        from        : 'projectMembers',
                        localField  : 'project._id',
                        foreignField: 'projectId',
                        as          : 'projectMembers'
                    }
                }, {
                    $project: {
                        _id    : '$sourceDocument._id',
                        name   : '$sourceDocument.name',
                        project: 1,
                        debit  : 1,
                        date   : 1,

                        salesManagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : {
                                    $and: [{
                                        $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                    }, {
                                        $eq: ['$$projectMember.endDate', null]
                                    }]
                                }
                            }
                        }
                    }
                }, {
                    $project: {
                        _id         : 1,
                        name        : 1,
                        project     : 1,
                        debit       : 1,
                        date        : 1,
                        salesmanager: {$arrayElemAt: ['$salesManager', 0]}
                    }
                }, {
                    $match: filterObject
                }, {
                    $project: {
                        _id         : 1,
                        name        : 1,
                        project     : 1,
                        debit       : 1,
                        date        : 1,
                        salesmanager: {$concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']}
                    }

                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result || []);
                });
            };

            parallelTasks = [getOpening, getInwards, getOutwards];

            async.parallel(parallelTasks, function (err, result) {
                var resultArray = [];
                var sortField;
                var total;

                if (err) {
                    return wfCb(err);
                }

                resultArray = [];
                sortField = Object.keys(sort)[0];

                jobs.forEach(function (job) { // need refactor on aggregate function
                    var newElement = {};
                    var project;

                    var opening = _.find(result[0], function (el) {
                        return el._id.toString() === job.toString();
                    });
                    var inwards = _.find(result[1], function (el) {
                        return el._id.toString() === job.toString();
                    });
                    var outwards = _.find(result[2], function (el) {
                        return el._id.toString() === job.toString();
                    });

                    newElement._id = job;
                    newElement.name = opening ? opening.name : (inwards ? inwards.name : outwards ? outwards.name : '');

                    project = opening ? opening.project : (inwards ? inwards.project : outwards ? outwards.name : {});
                    newElement.salesmanager = opening ? opening.salesmanager : (inwards ? inwards.salesmanager : outwards ? outwards.salesmanager : '');

                    newElement.project = project ? project._id : null;
                    newElement.projectName = project ? project.name : '-----';
                    newElement.projecttype = project ? project.projecttype : '-----';

                    newElement.openingBalance = opening ? opening.debit / 100 : 0;
                    newElement.inwards = inwards ? inwards.debit / 100 : 0;
                    newElement.outwards = outwards ? outwards.debit / 100 : 0;
                    newElement.closingBalance = newElement.openingBalance + newElement.inwards - newElement.outwards;

                    if (newElement.name && !(outwards && outwards.date < startDate)) {
                        resultArray.push(newElement);
                    } else {
                        console.log(outwards ? outwards.date : newElement.name, startDate);
                    }

                });

                if (sortField) { // need refactor on aggregate function
                    resultArray = resultArray.sort(function (a, b) {
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

                total = resultArray.length;
                resultArray = resultArray.slice(skip, skip + limit); // need refactor on aggregate function

                wfCb(null, {total: total, data: resultArray});
            });
        };

        waterfallTasks = [findJobs, composeReport];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });

    };

    this.getCashFlow = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var getOperating;
        var getInvesting;
        var getFinancing;
        var query = req.query;
        var startDate = query.startDate;
        var endDate = query.endDate;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        getOperating = function (cb) {

            var getEBIT = function (cb) {
                var getGrossFit = function (pcb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            },

                            account: objectId(CONSTANTS.PRODUCT_SALES)
                        }
                    }, {
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : 'account',
                            foreignField: '_id',
                            as          : 'account'
                        }
                    }, {
                        $project: {
                            date   : 1,
                            debit  : 1,
                            credit : 1,
                            account: {$arrayElemAt: ['$account', 0]}
                        }
                    }, {
                        $group: {
                            _id   : '$account._id',
                            name  : {$addToSet: '$account.name'},
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        if (err) {
                            return pcb(err);
                        }

                        pcb(null, result);
                    });
                };

                var getExpenses = function (pcb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            },

                            account: objectId(CONSTANTS.COGS)
                        }
                    }, {
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : 'account',
                            foreignField: '_id',
                            as          : 'account'
                        }
                    }, {
                        $project: {
                            date   : 1,
                            debit  : 1,
                            credit : 1,
                            account: {$arrayElemAt: ['$account', 0]}
                        }
                    }, {
                        $group: {
                            _id   : '$account._id',
                            name  : {$addToSet: '$account.name'},
                            credit: {$sum: '$credit'},
                            debit : {$sum: '$debit'}
                        }
                    }], function (err, result) {
                        if (err) {
                            return pcb(err);
                        }

                        pcb(null, result);
                    });
                };

                async.parallel([getGrossFit, getExpenses], function (err, result) {
                    var grossProfit;
                    var expenses;
                    var EBIT;

                    if (err) {
                        return cb(err);
                    }

                    grossProfit = result[0] && result[0][0] ? result[0][0].credit : 0;
                    expenses = result[1] && result[1][0] ? result[1][0].debit : 0;

                    EBIT = grossProfit - expenses;

                    cb(null, [{name: 'Operating Income (EBIT)', debit: EBIT}]);
                });
            };

            var getAR = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.ACCOUNT_RECEIVABLE)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        debit  : 1,
                        credit : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var sum;
                    var fieldName;

                    if (err) {
                        return cb(err);
                    }

                    sum = result[0] ? result[0].debit - result[0].credit : 0;

                    sum = sum * (-1);

                    fieldName = result[0] ? result[0].name[0] : 'Account receivable';

                    cb(null, [{name: fieldName, debit: sum}]);
                });
            };

            var getCurrentLiabilities = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.CURRENT_LIABILITIES)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $group: {
                        _id   : null,
                        name  : {$addToSet: '$name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var sum;
                    var fieldName;

                    if (err) {
                        return cb(err);
                    }

                    sum = result[0] ? result[0].debit - result[0].credit : 0;

                    fieldName = result[0] ? result[0].name[0] : 'Current Liabilities';

                    cb(null, [{name: fieldName, debit: sum * (-1)}]);
                });
            };

            var getSalaryPayable = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.SALARY_PAYABLE_ACCOUNT)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $group: {
                        _id   : null,
                        name  : {$addToSet: '$name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var sum;
                    var sp;
                    var fieldName;

                    if (err) {
                        return cb(err);
                    }

                    sum = result[0] ? result[0].debit - result[0].credit : 0;

                    sp = 0 - sum;

                    if (sp < 0) {
                        sp = sp * (-1);
                    }

                    fieldName = result[0] ? result[0].name[0] : 'Salary Payable';

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            var getSalaryOvertimePayable = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.SALARY_OVERTIME_ACCOUNT)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $group: {
                        _id   : null,
                        name  : {$addToSet: '$name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var sum;
                    var sp;
                    var fieldName;

                    if (err) {
                        return cb(err);
                    }

                    sum = result[0] ? result[0].debit - result[0].credit : 0;

                    sp = 0 - sum;

                    if (sp < 0) {
                        sp = sp * (-1);
                    }

                    fieldName = result[0] ? result[0].name[0] : 'Salary Overtime Payable';

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            var getWIP = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.WORK_IN_PROCESS)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'},
                        name  : {$addToSet: '$name'}
                    }
                }], function (err, result) {
                    var sum;
                    var fieldName;

                    if (err) {
                        return cb(err);
                    }

                    sum = result[0] ? result[0].debit - result[0].credit : 0;

                    sum = sum * (-1);

                    fieldName = result[0] ? result[0].name[0] : 'Work in process';

                    cb(null, [{name: fieldName, debit: sum}]);
                });
            };

            var getCOGS = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.FINISHED_GOODS)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'},
                        name  : {$addToSet: '$name'}
                    }
                }], function (err, result) {
                    var sum;
                    var sp;
                    var fieldName;

                    if (err) {
                        return cb(err);
                    }

                    sum = result[0] ? result[0].debit - result[0].credit : 0;

                    sp = Math.abs(0 - sum);

                    fieldName = result[0] ? result[0].name[0] : 'Finished goods';

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            var getAccountPayable = function (cb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },

                        account: objectId(CONSTANTS.ACCOUNT_PAYABLE)
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'},
                        name  : {$addToSet: '$name'}
                    }
                }], function (err, result) {
                    var sum;
                    var sp;
                    var fieldName;

                    if (err) {
                        return cb(err);
                    }

                    sum = result[0] ? result[0].debit - result[0].credit : 0;

                    sp = 0 - sum;

                    if (sp < 0) {
                        sp = sp * (-1);
                    }

                    fieldName = result[0] ? result[0].name[0] : 'Account Payable';

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            async.parallel([getEBIT, getAR, getCOGS, getWIP, getSalaryPayable, getSalaryOvertimePayable, getCurrentLiabilities, getAccountPayable], function (err, result) {
                var response;

                if (err) {
                    return cb(err);
                }

                response = _.union(result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7]);

                cb(null, response);
            });
        };

        getInvesting = function (cb) {
            Model.aggregate([{
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },

                    account: {$in: CONSTANTS.INVESTING.objectID()}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $project: {
                    date   : 1,
                    credit : 1,
                    debit  : 1,
                    account: {$arrayElemAt: ['$account', 0]}
                }
            }, {
                $group: {
                    _id   : '$account._id',
                    name  : {$addToSet: '$account.name'},
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'}
                }
            }, {
                $group: {
                    _id   : null,
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'},
                    name  : {$addToSet: '$name'}
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        getFinancing = function (cb) {
            Model.aggregate([{
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },

                    account: {$in: CONSTANTS.FINANCING.objectID()}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $project: {
                    date   : 1,
                    credit : 1,
                    debit  : 1,
                    account: {$arrayElemAt: ['$account', 0]}
                }
            }, {
                $group: {
                    _id   : '$account._id',
                    name  : {$addToSet: '$account.name'},
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'}
                }
            }, {
                $group: {
                    _id   : null,
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'},
                    name  : {$addToSet: '$name'}
                }
            }], function (err, result) {
                var sum;
                var sp;
                var fieldName;

                if (err) {
                    return cb(err);
                }

                sum = result[0] ? result[0].credit : 0;

                sp = 0 - sum;

                fieldName = result[0] ? result[0].name[0] : '777777 Dividends Payable';

                cb(null, [{name: fieldName, debit: sp}]);
            });
        };

        async.parallel([getOperating, getInvesting, getFinancing], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({operating: result[0], investing: result[1], financing: result[2]});
        });
    };

    this.getProfitAndLoss = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var getGrossFit;
        var getExpenses;
        var getDividends;
        var query = req.query;
        var startDate = query.startDate;
        var endDate = query.endDate;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        getGrossFit = function (cb) {
            Model.aggregate([{
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },

                    account: objectId(CONSTANTS.PRODUCT_SALES),
                    credit : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $project: {
                    date   : 1,
                    credit : 1,
                    account: {$arrayElemAt: ['$account', 0]}
                }
            }, {
                $group: {
                    _id  : '$account._id',
                    name : {$addToSet: '$account.name'},
                    debit: {$sum: '$credit'}
                }
            }, {
                $project: {
                    _id  : 1,
                    debit: 1,
                    name : {$arrayElemAt: ['$name', 0]}
                }
            }, {
                $sort: {
                    name: 1
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        getExpenses = function (cb) {
            Model.aggregate([{
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },

                    account: objectId(CONSTANTS.COGS),
                    debit  : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $project: {
                    date   : 1,
                    debit  : 1,
                    account: {$arrayElemAt: ['$account', 0]}
                }
            }, {
                $group: {
                    _id  : '$account._id',
                    name : {$addToSet: '$account.name'},
                    debit: {$sum: '$debit'}
                }
            }, {
                $project: {
                    _id  : 1,
                    debit: 1,
                    name : {$arrayElemAt: ['$name', 0]}
                }
            }, {
                $sort: {
                    name: 1
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        getDividends = function (cb) {
            Model.aggregate([{
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },

                    journal: objectId(CONSTANTS.DIVIDEND_INVOICE_JOURNAL),
                    debit  : {$gt: 0}
                }
            }, {
                $group: {
                    _id  : null,
                    debit: {$sum: '$debit'}
                }
            }], function (err, result) {
                var dividends;

                if (err) {
                    return cb(err);
                }

                dividends = result && result.length ? result[0].debit : 0;

                cb(null, dividends);
            });
        };

        async.parallel([getGrossFit, getExpenses, getDividends], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({grossFit: result[0], expenses: result[1], dividends: result[2]});
        });
    };

    this.getCashBook = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);
        var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var query = req.query;
        var startDate = query.startDate;
        var endDate = query.endDate;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        PaymentMethod.aggregate([{
            $group: {
                _id: '$chartAccount'
            }
        }], function (err, result) {
            var accounts;

            if (err) {
                return next(err);
            }

            accounts = _.pluck(result, '_id');

            Model.aggregate([{
                $match: {
                    account: {$in: accounts},
                    date   : {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $project: {
                    date          : 1,
                    sourceDocument: 1,
                    account       : {$arrayElemAt: ['$account', 0]},
                    currency      : 1,
                    debit         : 1,
                    credit        : 1
                }
            }, {
                $project: {
                    date          : 1,
                    sourceDocument: 1,
                    'account.name': '$account.name',
                    'account._id' : '$account._id',
                    currency      : 1,
                    debit         : 1,
                    credit        : 1
                }
            }, {
                $sort: {
                    date: 1
                }
            }, {
                $group: {
                    _id     : '$sourceDocument.model',
                    accounts: {$addToSet: '$account'},
                    root    : {$push: '$$ROOT'}
                }
            }], function (err, result) {
                var paymentResult;
                var cashTransfer;
                var populateCashTransfer;
                var populateSalaryPayment;
                var populatePayment;
                var getOpeningBalance;
                var salaryPayment;

                if (err) {
                    return next(err);
                }

                paymentResult = _.find(result, function (el) {
                    return el._id === 'Payment';
                });

                cashTransfer = _.find(result, function (el) {
                    return el._id === 'cashTransfer';
                });

                salaryPayment = _.find(result, function (el) {
                    return el._id === 'salaryPayment';
                });

                cashTransfer = cashTransfer || {};
                paymentResult = paymentResult || {};
                salaryPayment = salaryPayment || {};

                populatePayment = function (cb) {
                    Payment.populate(paymentResult.root, {
                        path  : 'sourceDocument._id',
                        select: 'name',
                        lean  : true
                    }, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    })
                };

                populateSalaryPayment = function (cb) {
                    Employee.populate(salaryPayment.root, {
                        path  : 'sourceDocument._id',
                        select: 'name',
                        lean  : true
                    }, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    })
                };

                getOpeningBalance = function (cb) {
                    Model.aggregate([{
                        $match: {
                            account: {$in: accounts},
                            date   : {
                                $lt: new Date(startDate)
                            }
                        }
                    }, {
                        $project: {
                            debit  : {$divide: ['$debit', '$currency.rate']},
                            credit : {$divide: ['$credit', '$currency.rate']},
                            account: 1
                        }
                    }, {
                        $group: {
                            _id   : '$account',
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }, {
                        $project: {
                            balance: {$subtract: ['$debit', '$credit']}
                        }
                    }], function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, result);
                    });
                };

                populateCashTransfer = function (cb) {
                    cashTransferModel.populate(cashTransfer.root, {
                        path  : 'sourceDocument._id',
                        select: 'name',
                        lean  : true
                    }, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    })
                };

                async.parallel([populatePayment, populateCashTransfer, populateSalaryPayment, getOpeningBalance], function (err, result) {
                    var accounts;
                    var newAccounts = [];
                    var keys = {};

                    if (err) {
                        return next(err);
                    }

                    accounts = _.union(paymentResult.accounts || [], cashTransfer.accounts || [], salaryPayment.accounts || []);

                    accounts.forEach(function (el) {
                        if (!keys[el._id.toString()]) {
                            newAccounts.push(el);
                            keys[el._id.toString()] = true;
                        }
                    });

                    newAccounts.forEach(function (acc) {
                        var balance = _.find(result[3], function (el) {
                            return el && el._id ? el._id.toString() === acc._id.toString() : null;
                        });

                        balance = balance || {};

                        acc.balance = balance.balance || 0;
                    });

                    res.status(200).send({
                        data    : _.union(paymentResult.root || [], cashTransfer.root || [], salaryPayment.root || []),
                        accounts: newAccounts
                    });
                });
            });
        })

    };

    this.getForGL = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var startDate = query.startDate;
        var endDate = query.endDate;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        // var filter = query.filter;

        Model.aggregate([{
            $match: {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'account',
                foreignField: '_id',
                as          : 'account'
            }
        }, {
            $project: {
                date   : 1,
                debit  : 1,
                credit : 1,
                account: {$arrayElemAt: ['$account', 0]}
            }
        }, {
            $group: {
                _id   : '$account._id',
                name  : {$addToSet: '$account.name'},
                debit : {$sum: '$debit'},
                credit: {$sum: '$credit'}
            }
        }, {
            $project: {
                _id   : 1,
                debit : 1,
                credit: 1,
                name  : {$arrayElemAt: ['$name', 0]}
            }
        }, {
            $sort: {
                name: 1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });

    };

    this.getPayrollForReport = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var sourceDocument = query._id;
        var journalArray = [objectId(CONSTANTS.SALARY_PAYABLE), objectId(CONSTANTS.OVERTIME_PAYABLE)];
        var dataKey = query.dataKey;
        var year = parseInt(dataKey.slice(0, 4), 10);
        var month = parseInt(dataKey.slice(4), 10);
        var date = moment().year(year).month(month - 1).startOf('month');
        var endDate = moment(date).endOf('month');

        function matchEmployee(pcb) {
            Model.aggregate([{
                $match: {
                    'sourceDocument.model': 'Employees',
                    'sourceDocument._id'  : objectId(sourceDocument),
                    date                  : {
                        $gte: new Date(date),
                        $lte: new Date(endDate)
                    },

                    debit: {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'sourceDocument._id',
                    foreignField: '_id',
                    as          : 'employee'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    date          : 1,
                    currency      : 1,
                    debit         : 1,
                    credit        : 1,
                    sourceDocument: {$arrayElemAt: ['$employee', 0]},
                    journal       : {$arrayElemAt: ['$journal', 0]}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.debitAccount',
                    foreignField: '_id',
                    as          : 'journal.debitAccount'
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.creditAccount',
                    foreignField: '_id',
                    as          : 'journal.creditAccount'
                }
            }, {
                $project: {
                    date                   : 1,
                    debit                  : {$divide: ['$debit', 100]},
                    credit                 : {$divide: ['$credit', 100]},
                    'journal.creditAccount': {$arrayElemAt: ['$journal.creditAccount', 0]},
                    'journal.debitAccount' : {$arrayElemAt: ['$journal.debitAccount', 0]},
                    employee               : {$concat: ['$sourceDocument.name.first', ' ', '$sourceDocument.name.last']},
                    journalName            : '$journal.name'
                }
            }, {
                $sort: {date: 1}
            }], function (err, result) {
                if (err) {
                    return pcb(err);
                }

                pcb(null, result);
            });
        }

        function matchByWTrack(pcb) {
            Model.aggregate([{
                $match: {
                    'sourceDocument.model': 'wTrack',
                    journal               : {$in: journalArray},
                    date                  : {
                        $gte: new Date(date),
                        $lte: new Date(endDate)
                    },

                    credit: {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    date          : 1,
                    currency      : 1,
                    debit         : 1,
                    credit        : 1,
                    sourceDocument: 1,
                    journal       : {$arrayElemAt: ['$journal', 0]}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.debitAccount',
                    foreignField: '_id',
                    as          : 'journal.debitAccount'
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'journal.creditAccount',
                    foreignField: '_id',
                    as          : 'journal.creditAccount'
                }
            }, {
                $project: {
                    debit                  : {$divide: ['$debit', 100]},
                    credit                 : {$divide: ['$credit', 100]},
                    'journal.creditAccount': {$arrayElemAt: ['$journal.creditAccount', 0]},
                    'journal.debitAccount' : {$arrayElemAt: ['$journal.debitAccount', 0]},
                    journalName            : '$journal.name',
                    sourceDocument         : 1,
                    date                   : 1
                }
            }, {
                $project: {
                    debit      : '$debit',
                    credit     : '$credit',
                    journal    : 1,
                    journalName: 1,
                    employee   : '$sourceDocument.employee',
                    date       : 1
                }
            }, {
                $match: {
                    employee: objectId(sourceDocument)
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'employee',
                    foreignField: '_id',
                    as          : 'employee'
                }
            }, {
                $project: {
                    date                   : 1,
                    debit                  : 1,
                    credit                 : 1,
                    'journal.creditAccount': 1,
                    'journal.debitAccount' : 1,
                    employee               : {$arrayElemAt: ['$employee', 0]},
                    journalName            : 1
                }
            }, {
                $project: {
                    date                   : 1,
                    debit                  : 1,
                    credit                 : 1,
                    'journal.creditAccount': 1,
                    'journal.debitAccount' : 1,
                    employee               : {$concat: ['$employee.name.first', ' ', '$employee.name.last']},
                    journalName            : 1
                }
            }, {
                $sort: {date: 1}
            }], function (err, result) {
                if (err) {
                    return pcb(err);
                }

                pcb(null, result);
            });
        }

        async.parallel([matchByWTrack, matchEmployee], function (err, result) {

            var empIds;
            var empIdsSecond;

            if (err) {
                return next(err);
            }

            empIds = result[0];
            empIdsSecond = result[1];

            res.status(200).send({data: _.union(empIds, empIdsSecond)});
        });
    };

    this.getForReport = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var Journal = models.get(req.session.lastDb, 'journal', journalSchema);
        var query = req.query;
        var sourceDocument = query._id;

        Model
            .aggregate([{
                $match: {
                    'sourceDocument.model': 'wTrack',
                    'sourceDocument._id'  : objectId(sourceDocument),
                    debit                 : {$gt: 0}
                }
            }, {
                $project: {
                    date : 1,
                    debit: 1
                }
            }, {
                $group: {
                    _id     : '$date',
                    totalSum: {$sum: '$debit'}
                }
            }, {
                $sort: {
                    _id: 1
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                Journal.populate(result, {
                    path: 'journal'
                }, function (err, result) {
                    res.status(200).send({data: {wagesPayable: result}});
                });
            });

    };

    function getForView(req, mainCallback) {
        var dbIndex = req.session.lastDb;
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var data = req.query;
        var sort = data.sort;
        var findInvoice;
        var findSalary;
        var findByEmployee;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var filter = data.filter || {};
        var filterObj = {};
        var key;
        // var startDate = data.startDate || filter.startDate.value;
        // var endDate = data.endDate || filter.endDate.value;
        var findJobsFinished;
        var findPayments;
        var findSalaryPayments;
        var findCashTransfer;
        var matchObject = {};
        // var filterArray;
        var parallelTasks;
        var filterMapper = new FilterMapper();

        // startDate = moment(new Date(startDate)).startOf('day');
        // endDate = moment(new Date(endDate)).endOf('day');

        /*matchObject = {
         date: {
         $gte: new Date(startDate),
         $lte: new Date(endDate)
         }
         };*/

        if (sort) {
            key = Object.keys(data.sort)[0].toString();
            data.sort[key] = parseInt(data.sort[key], 10);
            sort = data.sort;
        } else {
            sort = {date: 1, 'journal.name': 1};
        }

        /*if (filter) {
         filterArray = caseFilter(filter);

         if (filterArray.length) {
         filterObj.$and = filterArray;
         }
         }*/

        filterObj = filterMapper.mapFilter(filter, 'journalEntry');

        if (filterObj.date) {
            matchObject.date = filterObj.date;

            delete filterObj.date;
        }

        findInvoice = function (cb) {
            Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': {$in: ['Invoice', 'Proforma', 'dividendInvoice', 'writeOff']},
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'Invoice',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit                 : 1,
                        currency              : 1,
                        journal               : {$arrayElemAt: ['$journal', 0]},
                        account               : {$arrayElemAt: ['$account', 0]},
                        'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                        'sourceDocument.model': 1,
                        date                  : 1
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.debitAccount',
                        foreignField: '_id',
                        as          : 'journal.debitAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.creditAccount',
                        foreignField: '_id',
                        as          : 'journal.creditAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'Customers',
                        localField  : 'sourceDocument._id.supplier',
                        foreignField: '_id',
                        as          : 'sourceDocument.subject'
                    }
                }, {
                    $project: {
                        debit                   : 1,
                        currency                : 1,
                        'journal.debitAccount'  : {$arrayElemAt: ['$journal.debitAccount', 0]},
                        'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                        'journal.name'          : 1,
                        date                    : 1,
                        'sourceDocument._id'    : 1,
                        'sourceDocument.name'   : '$sourceDocument._id.name',
                        'sourceDocument.model'  : 1,
                        'sourceDocument.subject': {$arrayElemAt: ['$sourceDocument.subject', 0]},
                        account                 : 1
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        debit                        : 1,
                        currency                     : 1,
                        journal                      : 1,
                        date                         : 1,
                        'sourceDocument.model'       : 1,
                        'sourceDocument._id'         : 1,
                        'sourceDocument.name'        : 1,
                        'sourceDocument.subject.name': '$sourceDocument.subject.name'
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        findCashTransfer = function (cb) {
            Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': 'cashTransfer',
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'cashTransfer',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit                 : 1,
                        currency              : 1,
                        journal               : {$arrayElemAt: ['$journal', 0]},
                        account               : {$arrayElemAt: ['$account', 0]},
                        'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                        'sourceDocument.model': 1,
                        date                  : 1
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.debitAccount',
                        foreignField: '_id',
                        as          : 'journal.debitAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.creditAccount',
                        foreignField: '_id',
                        as          : 'journal.creditAccount'
                    }
                }, {
                    $project: {
                        debit                  : 1,
                        currency               : 1,
                        'journal.debitAccount' : {$arrayElemAt: ['$journal.debitAccount', 0]},
                        'journal.creditAccount': {$arrayElemAt: ['$journal.creditAccount', 0]},
                        'journal.name'         : 1,
                        date                   : 1,
                        'sourceDocument._id'   : 1,
                        'sourceDocument.name'  : '$sourceDocument._id.name',
                        'sourceDocument.model' : 1,
                        account                : 1
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        debit                              : 1,
                        currency                           : 1,
                        journal                            : 1,
                        date                               : 1,
                        'sourceDocument.model'             : 1,
                        'sourceDocument._id'               : 1,
                        'sourceDocument.name'              : 1,
                        'sourceDocument.subject.name.first': '$sourceDocument.model'
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        findSalary = function (cb) {
            var query = Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': 'wTrack',
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit                    : 1,
                        currency                 : 1,
                        journal                  : {$arrayElemAt: ['$journal', 0]},
                        account                  : {$arrayElemAt: ['$account', 0]},
                        'sourceDocument._id'     : 1,
                        'sourceDocument.model'   : 1,
                        'sourceDocument.employee': 1,
                        date                     : 1
                    }
                }, {
                    $lookup: {
                        from        : 'jobs',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.debitAccount',
                        foreignField: '_id',
                        as          : 'journal.debitAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.creditAccount',
                        foreignField: '_id',
                        as          : 'journal.creditAccount'
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
                        debit                   : 1,
                        currency                : 1,
                        'journal.debitAccount'  : {$arrayElemAt: ['$journal.debitAccount', 0]},
                        'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                        'journal.name'          : 1,
                        date                    : 1,
                        'sourceDocument._id'    : 1,
                        'sourceDocument.model'  : 1,
                        'sourceDocument.jobs'   : {$arrayElemAt: ['$sourceDocument._id', 0]},
                        'sourceDocument.subject': {$arrayElemAt: ['$employee', 0]},
                        'sourceDocument.name'   : 1,
                        account                 : 1
                    }
                }, {
                    $project: {
                        debit                   : 1,
                        currency                : 1,
                        'journal.debitAccount'  : 1,
                        'journal.creditAccount' : 1,
                        'journal.name'          : 1,
                        date                    : 1,
                        'sourceDocument._id'    : 1,
                        'sourceDocument.model'  : 1,
                        'sourceDocument.subject': 1,
                        'sourceDocument.name'   : '$sourceDocument._id.name',
                        account                 : 1
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        debit                        : 1,
                        currency                     : 1,
                        journal                      : 1,
                        date                         : 1,
                        'sourceDocument.model'       : 1,
                        'sourceDocument._id'         : 1,
                        'sourceDocument.name'        : 1,
                        'sourceDocument.subject.name': '$sourceDocument.subject.name'
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }]);

            query.options = {allowDiskUse: true};

            query.exec(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        findByEmployee = function (cb) {
            var query = Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': 'Employees',
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit                 : 1,
                        currency              : 1,
                        journal               : {$arrayElemAt: ['$journal', 0]},
                        account               : {$arrayElemAt: ['$account', 0]},
                        'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                        'sourceDocument.model': 1,
                        date                  : 1
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.debitAccount',
                        foreignField: '_id',
                        as          : 'journal.debitAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.creditAccount',
                        foreignField: '_id',
                        as          : 'journal.creditAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'Department',
                        localField  : 'sourceDocument._id.department',
                        foreignField: '_id',
                        as          : 'sourceDocument._id.department'
                    }
                }, {
                    $project: {
                        debit                          : 1,
                        currency                       : 1,
                        'journal.debitAccount'         : {$arrayElemAt: ['$journal.debitAccount', 0]},
                        'journal.creditAccount'        : {$arrayElemAt: ['$journal.creditAccount', 0]},
                        'sourceDocument._id.department': {$arrayElemAt: ['$sourceDocument._id.department', 0]},
                        'journal.name'                 : 1,
                        date                           : 1,
                        'sourceDocument.model'         : 1,
                        'sourceDocument.subject'       : '$sourceDocument._id',
                        account                        : 1
                    }
                }, {
                    $project: {
                        debit                          : 1,
                        currency                       : 1,
                        'journal.debitAccount'         : 1,
                        'journal.creditAccount'        : 1,
                        'sourceDocument._id.department': 1,
                        'journal.name'                 : 1,
                        date                           : 1,
                        'sourceDocument.model'         : 1,
                        'sourceDocument.subject'       : 1,
                        'sourceDocument.name'          : '$sourceDocument._id.department.name',
                        account                        : 1
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        debit                        : 1,
                        currency                     : 1,
                        journal                      : 1,
                        date                         : 1,
                        'sourceDocument.model'       : 1,
                        'sourceDocument._id'         : 1,
                        'sourceDocument.name'        : 1,
                        'sourceDocument.subject.name': '$sourceDocument.subject.name'
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }
                ]);

            query.options = {allowDiskUse: true};

            query.exec(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        findJobsFinished = function (cb) {
            var query = Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': 'jobs',
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'jobs',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit                 : 1,
                        currency              : 1,
                        journal               : {$arrayElemAt: ['$journal', 0]},
                        account               : {$arrayElemAt: ['$account', 0]},
                        'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                        'sourceDocument.model': 1,
                        date                  : 1
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.debitAccount',
                        foreignField: '_id',
                        as          : 'journal.debitAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.creditAccount',
                        foreignField: '_id',
                        as          : 'journal.creditAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'Invoice',
                        localField  : 'sourceDocument._id.invoice',
                        foreignField: '_id',
                        as          : 'sourceDocument._id.invoice'
                    }
                }, {
                    $project: {
                        debit                       : 1,
                        currency                    : 1,
                        'journal.debitAccount'      : {$arrayElemAt: ['$journal.debitAccount', 0]},
                        'journal.creditAccount'     : {$arrayElemAt: ['$journal.creditAccount', 0]},
                        'sourceDocument._id.invoice': {$arrayElemAt: ['$sourceDocument._id.invoice', 0]},
                        'journal.name'              : 1,
                        date                        : 1,
                        'sourceDocument.model'      : 1,
                        'sourceDocument.subject'    : '$sourceDocument._id',
                        account                     : 1
                    }
                }, {
                    $project: {
                        debit                              : 1,
                        currency                           : 1,
                        'journal.debitAccount'             : 1,
                        'journal.creditAccount'            : 1,
                        'sourceDocument._id.department'    : 1,
                        'journal.name'                     : 1,
                        date                               : 1,
                        'sourceDocument.model'             : 1,
                        'sourceDocument.subject._id'       : 1,
                        'sourceDocument.subject.name.first': '$sourceDocument.subject.name',
                        'sourceDocument.name'              : '$sourceDocument._id.invoice.name',
                        account                            : 1
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        debit                        : 1,
                        currency                     : 1,
                        journal                      : 1,
                        date                         : 1,
                        'sourceDocument.model'       : 1,
                        'sourceDocument._id'         : 1,
                        'sourceDocument.name'        : 1,
                        'sourceDocument.subject.name': '$sourceDocument.subject.name'
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }]);

            query.options = {allowDiskUse: true};

            query.exec(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        findPayments = function (cb) {
            var query = Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': 'Payment',
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'Payment',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit                 : 1,
                        currency              : 1,
                        journal               : {$arrayElemAt: ['$journal', 0]},
                        account               : {$arrayElemAt: ['$account', 0]},
                        'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                        'sourceDocument.model': 1,
                        date                  : 1
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.debitAccount',
                        foreignField: '_id',
                        as          : 'journal.debitAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.creditAccount',
                        foreignField: '_id',
                        as          : 'journal.creditAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'Customers',
                        localField  : 'sourceDocument._id.supplier',
                        foreignField: '_id',
                        as          : 'sourceDocument._id.supplier'
                    }
                }, {
                    $project: {
                        debit                        : 1,
                        currency                     : 1,
                        'journal.debitAccount'       : {$arrayElemAt: ['$journal.debitAccount', 0]},
                        'journal.creditAccount'      : {$arrayElemAt: ['$journal.creditAccount', 0]},
                        'sourceDocument._id.supplier': {$arrayElemAt: ['$sourceDocument._id.supplier', 0]},
                        'journal.name'               : 1,
                        date                         : 1,
                        'sourceDocument.model'       : 1,
                        'sourceDocument.subject'     : '$sourceDocument._id',
                        'sourceDocument.name'        : '$sourceDocument._id.name',
                        account                      : 1
                    }
                }, {
                    $project: {
                        debit                   : 1,
                        currency                : 1,
                        'journal.debitAccount'  : 1,
                        'journal.creditAccount' : 1,
                        'journal.name'          : 1,
                        date                    : 1,
                        'sourceDocument.model'  : 1,
                        'sourceDocument.subject': '$sourceDocument._id.supplier',
                        'sourceDocument.name'   : 1,
                        account                 : 1
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        debit                        : 1,
                        currency                     : 1,
                        journal                      : 1,
                        date                         : 1,
                        'sourceDocument.model'       : 1,
                        'sourceDocument._id'         : 1,
                        'sourceDocument.name'        : 1,
                        'sourceDocument.subject.name': '$sourceDocument.subject.name'
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }]);

            query.options = {allowDiskUse: true};

            query.exec(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        findSalaryPayments = function (cb) {
            var query = Model
                .aggregate([{
                    $match: matchObject
                }, {
                    $match: {
                        'sourceDocument.model': 'salaryPayment',
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'sourceDocument._id',
                        foreignField: '_id',
                        as          : 'sourceDocument._id'
                    }
                }, {
                    $lookup: {
                        from        : 'journals',
                        localField  : 'journal',
                        foreignField: '_id',
                        as          : 'journal'
                    }
                }, {
                    $project: {
                        debit                 : 1,
                        currency              : 1,
                        journal               : {$arrayElemAt: ['$journal', 0]},
                        account               : {$arrayElemAt: ['$account', 0]},
                        'sourceDocument._id'  : {$arrayElemAt: ['$sourceDocument._id', 0]},
                        'sourceDocument.model': 1,
                        date                  : 1
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.debitAccount',
                        foreignField: '_id',
                        as          : 'journal.debitAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'journal.creditAccount',
                        foreignField: '_id',
                        as          : 'journal.creditAccount'
                    }
                }, {
                    $lookup: {
                        from        : 'Department',
                        localField  : 'sourceDocument._id.department',
                        foreignField: '_id',
                        as          : 'sourceDocument._id.department'
                    }
                }, {
                    $project: {
                        debit                   : 1,
                        currency                : 1,
                        'journal.debitAccount'  : {$arrayElemAt: ['$journal.debitAccount', 0]},
                        'journal.creditAccount' : {$arrayElemAt: ['$journal.creditAccount', 0]},
                        'journal.name'          : 1,
                        date                    : 1,
                        'sourceDocument.model'  : 1,
                        'sourceDocument.subject': '$sourceDocument._id',
                        'sourceDocument.name'   : {$arrayElemAt: ['$sourceDocument._id.department', 0]},
                        account                 : 1
                    }
                }, {
                    $project: {
                        debit                   : 1,
                        currency                : 1,
                        'journal.debitAccount'  : 1,
                        'journal.creditAccount' : 1,
                        'journal.name'          : 1,
                        date                    : 1,
                        'sourceDocument.model'  : 1,
                        'sourceDocument.subject': 1,
                        'sourceDocument.name'   : '$sourceDocument.name.name',
                        account                 : 1
                    }
                }, {
                    $match: filterObj
                }, {
                    $project: {
                        debit                        : 1,
                        currency                     : 1,
                        journal                      : 1,
                        date                         : 1,
                        'sourceDocument.model'       : 1,
                        'sourceDocument._id'         : 1,
                        'sourceDocument.name'        : 1,
                        'sourceDocument.subject.name': '$sourceDocument.subject.name'
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }]);

            query.options = {allowDiskUse: true};

            query.exec(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        parallelTasks = [findInvoice, findSalary, findByEmployee, findJobsFinished, findPayments, findSalaryPayments, findCashTransfer];

        async.parallel(parallelTasks, function (err, result) {
            var invoices;
            var salary;
            var salaryEmployee;
            var jobsResult;
            var paymentsResult;
            var salaryPaymentResult;
            var models;
            var cashTransfer;

            if (err) {
                return mainCallback(err);
            }
            invoices = result[0];
            salary = result[1];
            salaryEmployee = result[2];
            jobsResult = result[3];
            paymentsResult = result[4];
            salaryPaymentResult = result[5];
            cashTransfer = result[6];
            models = _.union(invoices, salary, salaryEmployee, jobsResult, paymentsResult, salaryPaymentResult, cashTransfer);

            mainCallback(null, models);
        });
    }

    this.getForView = function (req, res, next) {
        var getData;
        var getTotal;

        getTotal = function (mainCallback) {
            totalCollectionLength(req, mainCallback);
        };

        getData = function (mainCallback) {
            getForView(req, mainCallback);
        };

        async.parallel([getTotal, getData], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({total: result[0].total || 0, data: result[1], totalValue: result[0].totalValue});
        });

    };

    this.removeByDocId = function (docId, dbIndex, callback) {
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var id = docId;
        var query;

        if (id.length >= 24) {
            query = {'sourceDocument._id': id};
        } else {
            query = id;
        }

        Model
            .remove(query, function (err, result) {
                callback(err, result);
            });
    };

    this.changeDate = function (query, date, dbIndex, callback) {
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);

        Model
            .update(query, {$set: {date: new Date(date)}}, {multi: true}, callback);
    };
};

module.exports = Module;
