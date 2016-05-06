var mongoose = require('mongoose');
var journalSchema = mongoose.Schemas.journal;
var journalEntrySchema = mongoose.Schemas.journalEntry;
var CurrencySchema = mongoose.Schemas.Currency;
var MonthHoursSchema = mongoose.Schemas.monthHours;
var wTrackSchema = mongoose.Schemas.wTrack;
var employeeSchema = mongoose.Schemas.Employee;
var jobsSchema = mongoose.Schemas.jobs;
var invoiceSchema = mongoose.Schemas.Invoice;
var holidaysSchema = mongoose.Schemas.Holiday;
var vacationSchema = mongoose.Schemas.Vacation;
var objectId = mongoose.Types.ObjectId;
var redisStore = require('../helpers/redisClient');
var HOURSCONSTANT = 8;

var oxr = require('open-exchange-rates');
var fx = require('money');
var _ = require('underscore');
var async = require('async');
var moment = require('../public/js/libs/moment/moment');

var Module = function (models, event) {
    "use strict";
    //ToDo set it to process.env
    oxr.set({app_id: process.env.OXR_APP_ID});

    var access = require("../Modules/additions/access.js")(models);
    var CONSTANTS = require("../constants/mainConstants.js");

    var notDevArray = CONSTANTS.NOT_DEV_ARRAY;

    var lookupWTrackArray = [
        {
            $match: {
                "sourceDocument.model": "wTrack",
                debit                 : {$gt: 0}
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "account",
                foreignField: "_id",
                as          : "account"
            }
        }, {
            $lookup: {
                from        : "wTrack",
                localField  : "sourceDocument._id",
                foreignField: "_id",
                as          : "sourceDocument._id"
            }
        }, {
            $lookup: {
                from        : "journals",
                localField  : "journal",
                foreignField: "_id",
                as          : "journal"
            }
        }, {
            $project: {
                debit               : {$divide: ['$debit', '$currency.rate']},
                journal             : {$arrayElemAt: ["$journal", 0]},
                account             : {$arrayElemAt: ["$account", 0]},
                'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]},
                date                : 1
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "journal.debitAccount",
                foreignField: "_id",
                as          : "journal.debitAccount"
            }
        }, {
            $lookup: {
                from        : "jobs",
                localField  : "sourceDocument._id.jobs",
                foreignField: "_id",
                as          : "sourceDocument._id.jobs"
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "journal.creditAccount",
                foreignField: "_id",
                as          : "journal.creditAccount"
            }
        }, {
            $lookup: {
                from        : "Employees",
                localField  : "sourceDocument._id.employee",
                foreignField: "_id",
                as          : "sourceDocument._id.employee"
            }
        }, {
            $project: {
                debit                   : {$divide: ['$debit', 100]},
                'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                'journal.name'          : 1,
                date                    : 1,
                'sourceDocument._id'    : 1,
                'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument._id.employee", 0]},
                'sourceDocument.name'   : '$sourceDocument._id.jobs.name'
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
            "sourceDocument.model": "Employees",
            debit                 : {$gt: 0}
        }
    }, {
        $lookup: {
            from        : "chartOfAccount",
            localField  : "account",
            foreignField: "_id",
            as          : "account"
        }
    }, {
        $lookup: {
            from        : "Employees",
            localField  : "sourceDocument._id",
            foreignField: "_id",
            as          : "sourceDocument._id"
        }
    }, {
        $lookup: {
            from        : "journals",
            localField  : "journal",
            foreignField: "_id",
            as          : "journal"
        }
    }, {
        $project: {
            debit               : {$divide: ['$debit', '$currency.rate']},
            journal             : {$arrayElemAt: ["$journal", 0]},
            account             : {$arrayElemAt: ["$account", 0]},
            'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]},
            date                : 1
        }
    }, {
        $lookup: {
            from        : "chartOfAccount",
            localField  : "journal.debitAccount",
            foreignField: "_id",
            as          : "journal.debitAccount"
        }
    }, {
        $lookup: {
            from        : "chartOfAccount",
            localField  : "journal.creditAccount",
            foreignField: "_id",
            as          : "journal.creditAccount"
        }
    }, {
        $lookup: {
            from        : "Department",
            localField  : "sourceDocument._id.department",
            foreignField: "_id",
            as          : "sourceDocument._id.department"
        }
    }, {
        $project: {
            debit                          : 1,
            'journal.debitAccount'         : {$arrayElemAt: ["$journal.debitAccount", 0]},
            'journal.creditAccount'        : {$arrayElemAt: ["$journal.creditAccount", 0]},
            'sourceDocument._id.department': {$arrayElemAt: ["$sourceDocument._id.department", 0]},
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
            'sourceDocument.name'        : '$sourceDocument._id.department.departmentName',
            'sourceDocument.subject._id' : 1
        }
    }];

    var lookupInvoiceArray = [{
        $match: {
            "sourceDocument.model": {$in: ["Invoice", "proforma", "dividendInvoice"]},
            debit                 : {$gt: 0}
        }
    }, {
        $lookup: {
            from        : "chartOfAccount",
            localField  : "account",
            foreignField: "_id",
            as          : "account"
        }
    }, {
        $lookup: {
            from        : "Invoice",
            localField  : "sourceDocument._id",
            foreignField: "_id",
            as          : "sourceDocument._id"
        }
    }, {
        $lookup: {
            from        : "journals",
            localField  : "journal",
            foreignField: "_id",
            as          : "journal"
        }
    }, {
        $project: {
            debit                 : {$divide: ['$debit', '$currency.rate']},
            currency              : 1,
            journal               : {$arrayElemAt: ["$journal", 0]},
            account               : {$arrayElemAt: ["$account", 0]},
            'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
            'sourceDocument.model': 1,
            date                  : 1
        }
    }, {
        $lookup: {
            from        : "chartOfAccount",
            localField  : "journal.debitAccount",
            foreignField: "_id",
            as          : "journal.debitAccount"
        }
    }, {
        $lookup: {
            from        : "chartOfAccount",
            localField  : "journal.creditAccount",
            foreignField: "_id",
            as          : "journal.creditAccount"
        }
    }, {
        $lookup: {
            from        : "Customers",
            localField  : "sourceDocument._id.supplier",
            foreignField: "_id",
            as          : "sourceDocument.subject"
        }
    }, {
        $project: {
            debit                   : {$divide: ['$debit', 100]},
            'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
            'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
            'journal.name'          : 1,
            date                    : 1,
            'sourceDocument._id'    : 1,
            'sourceDocument.name'   : '$sourceDocument._id.name',
            'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument.subject", 0]}
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
                "sourceDocument.model": "jobs",
                debit                 : {$gt: 0}
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "account",
                foreignField: "_id",
                as          : "account"
            }
        }, {
            $lookup: {
                from        : "jobs",
                localField  : "sourceDocument._id",
                foreignField: "_id",
                as          : "sourceDocument._id"
            }
        }, {
            $lookup: {
                from        : "journals",
                localField  : "journal",
                foreignField: "_id",
                as          : "journal"
            }
        }, {
            $project: {
                debit                 : {$divide: ['$debit', '$currency.rate']},
                currency              : 1,
                journal               : {$arrayElemAt: ["$journal", 0]},
                account               : {$arrayElemAt: ["$account", 0]},
                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                'sourceDocument.model': 1,
                date                  : 1
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "journal.debitAccount",
                foreignField: "_id",
                as          : "journal.debitAccount"
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "journal.creditAccount",
                foreignField: "_id",
                as          : "journal.creditAccount"
            }
        }, {
            $project: {
                debit                   : {$divide: ['$debit', 100]},
                currency                : 1,
                'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
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
                "sourceDocument.model": "Payment",
                debit                 : {$gt: 0}
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "account",
                foreignField: "_id",
                as          : "account"
            }
        }, {
            $lookup: {
                from        : "Payment",
                localField  : "sourceDocument._id",
                foreignField: "_id",
                as          : "sourceDocument._id"
            }
        }, {
            $lookup: {
                from        : "journals",
                localField  : "journal",
                foreignField: "_id",
                as          : "journal"
            }
        }, {
            $project: {
                debit                 : {$divide: ['$debit', '$currency.rate']},
                currency              : 1,
                journal               : {$arrayElemAt: ["$journal", 0]},
                account               : {$arrayElemAt: ["$account", 0]},
                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                'sourceDocument.model': 1,
                date                  : 1
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "journal.debitAccount",
                foreignField: "_id",
                as          : "journal.debitAccount"
            }
        }, {
            $lookup: {
                from        : "chartOfAccount",
                localField  : "journal.creditAccount",
                foreignField: "_id",
                as          : "journal.creditAccount"
            }
        }, {
            $lookup: {
                from        : "Customers",
                localField  : "sourceDocument._id.supplier",
                foreignField: "_id",
                as          : "sourceDocument.subject"
            }
        }, {
            $project: {
                debit                   : {$divide: ['$debit', 100]},
                'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                'journal.name'          : 1,
                date                    : 1,
                'sourceDocument._id'    : 1,
                'sourceDocument.name'   : '$sourceDocument._id.name',
                'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument.subject", 0]}
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

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var filterName;

        for (filterName in filter) {
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
            }
        }

        return resArray;
    }

    this.exportToXlsx = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var filter = req.params.filter;
        var filterObj = {};
        var type = req.query.type;
        var options;
        filter = JSON.parse(filter);
        var startDate = filter.startDate.value;
        var endDate = filter.endDate.value;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day').add(3, 'hours');

        var matchObject = {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (filter) {
            filterObj.$and = caseFilter(filter);
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

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

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

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        function lookupForInvoice(cb) {
            var query = [{$match: type ? {type: type} : {}}];

            query.push({$match: matchObject});

            for (var i = 0; i < lookupInvoiceArray.length; i++) {
                query.push(lookupInvoiceArray[i]);
            }

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        function lookupForJobs(cb) {
            var query = [{$match: type ? {type: type} : {}}];

            query.push({$match: matchObject});

            for (var i = 0; i < lookupJobsArray.length; i++) {
                query.push(lookupJobsArray[i]);
            }

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        function lookupForPayments(cb) {
            var query = [{$match: type ? {type: type} : {}}];

            query.push({$match: matchObject});

            for (var i = 0; i < lookupPaymentsArray.length; i++) {
                query.push(lookupPaymentsArray[i]);
            }

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

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
        var filter = req.params.filter;
        var filterObj = {};
        var type = req.query.type;
        var options;
        var query = [];
        filter = JSON.parse(filter);
        var startDate = filter.startDate.value;
        var endDate = filter.endDate.value;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day').add(3, 'hours');

        var matchObject = {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (filter) {
            filterObj.$and = caseFilter(filter);
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

            query.push({$match: matchObject});

            for (var i = 0; i < lookupWTrackArray.length; i++) {
                query.push(lookupWTrackArray[i]);
            }

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        function lookupForEmployees(cb) {
            var query = [{$match: type ? {type: type} : {}}];

            query.push({$match: matchObject});

            for (var i = 0; i < lookupEmployeesArray.length; i++) {
                query.push(lookupEmployeesArray[i]);
            }

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        function lookupForInvoice(cb) {
            var query = [{$match: type ? {type: type} : {}}];

            query.push({$match: matchObject});

            for (var i = 0; i < lookupInvoiceArray.length; i++) {
                query.push(lookupInvoiceArray[i]);
            }

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        function lookupForJobs(cb) {
            var query = [{$match: type ? {type: type} : {}}];

            query.push({$match: matchObject});

            for (var i = 0; i < lookupJobsArray.length; i++) {
                query.push(lookupJobsArray[i]);
            }

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        function lookupForPayments(cb) {
            var query = [{$match: type ? {type: type} : {}}];

            query.push({$match: matchObject});

            for (var i = 0; i < lookupPaymentsArray.length; i++) {
                query.push(lookupPaymentsArray[i]);
            }

            if (filterObj && filterObj.$and && filterObj.$and.length) {
                query.push({$match: filterObj});
            }

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

    this.removeBySourceDocument = function (req, sourceId) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);

        Model.find({"sourceDocument._id": sourceId}, function (err, result) {
            if (err) {
                return console.log(err);
            }

            var ids = [];

            result.forEach(function (el) {
                setReconcileDate(req, el.date);
                ids.push(el._id);
            });

            Model.remove({_id: {$in: ids}}, function (err, result) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    };

    this.setReconcileDate = function (req, date) {
        setReconcileDate(req, date);
    };

    function setReconcileDate(req, date) {
        var db = models.connection(req.session.lastDb);
        db.collection('settings').findOne({name: 'reconcileDate'}, function (err, result) {
            if (err) {
                return console.log(err);
            }
            var dateResult = result ? result.date : new Date();
            var newDae = moment(date);
            var newReconcileDate = moment(dateResult);
            var lessDate = newDae.isBefore(newReconcileDate) ? true : false;

            if (lessDate) {
                db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: {date: new Date(newDae)}}, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                });
            }
        });
    }

    this.checkAndCreateForJob = function (options) {
        var req = options.req;
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var jobId = options.jobId;
        var workflow = options.workflow;
        var remove = false;
        var wTracks = options.wTracks;
        var date = moment(options.date).subtract(1, 'seconds');
        var bodyFinishedJob = {
            currency      : CONSTANTS.CURRENCY_USD,
            journal       : CONSTANTS.FINISHED_JOB_JOURNAL,
            date          : new Date(date),
            sourceDocument: {
                model: 'jobs',
                _id  : jobId
            },
            amount        : 0
        };

        var bodyClosedJob = {
            currency      : CONSTANTS.CURRENCY_USD,
            journal       : CONSTANTS.CLOSED_JOB,
            date          : new Date(moment(date).subtract(1, 'seconds')),
            sourceDocument: {
                model: 'jobs',
                _id  : jobId
            },
            amount        : 0
        };

        var jobFinshedCb = function () {
            return false;
        };

        if (workflow !== CONSTANTS.JOB_FINISHED) {
            remove = true;
        }

        if (remove) {
            Model.remove({
                journal             : {$in: [CONSTANTS.FINISHED_JOB_JOURNAL, CONSTANTS.CLOSED_JOB]},
                "sourceDocument._id": jobId
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
            })
        } else {
            Model.aggregate([{
                $match: {
                    'sourceDocument._id': {$in: wTracks},
                    debit               : {$gt: 0}
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

                createReconciled(bodyFinishedJob, req.session.lastDb, jobFinshedCb, req.session.uId);
                createReconciled(bodyClosedJob, req.session.lastDb, jobFinshedCb, req.session.uId);
            });
        }

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
        var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var startDate = moment(new Date()).isoWeekYear(year).month(month - 1).startOf('month');
        var endDate = moment(new Date()).isoWeekYear(year).month(month - 1).endOf('month');
        var dateArrayInMonth = [];
        var parallelFuncs;
        var waterfallFuncs;
        var monthKey = year * 100 + month;
        var monthHoursObject = {};
        var holidaysObject = {};
        var employeesObject = {};

        function parallelFuncFind(wfCb) {

            function formDateArray(pCb) {
                var endOfMonth = endDate.date();
                var date = startDate;
                var i;

                for (i = endOfMonth; i >= 1; i--) {
                    var dateEl = date.date(i).set({hour: 15, minute: 1, second: 0});

                    if ((dateEl.day() !== 0) && (dateEl.day() !== 6)) {
                        dateArrayInMonth.push(new Date(dateEl));
                    }
                }
                pCb(null, dateArrayInMonth);
            }

            function findMonthHours(pCb) {
                redisStore.readFromStorage('monthHours', monthKey, function (err, result) {

                    result = JSON.parse(result);
                    monthHoursObject = result && result[0] ? result[0] : {};
                    pCb(null, monthHoursObject);
                });
            }

            function findHolidays(pCb) {
                var query = Holidays.find().lean();

                query.exec(function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    result.forEach(function (holiday) {
                        var holidayDate = moment(holiday.date);
                        var key = (holidayDate.isoWeekYear() * 100 + holidayDate.month() + 1) * 100 + holidayDate.date();
                        holidaysObject[key] = true;
                    });

                    pCb(null, holidaysObject);
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
                        'department': {$nin: notDevArray},
                        hire        : {$ne: []}
                    }
                }, {
                    $project: {
                        isEmployee: 1,
                        department: 1,
                        fire      : 1,
                        hire      : 1,
                        lastFire  : 1,
                        lastHire  : {
                            $let: {
                                vars: {
                                    lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                                },
                                in  : {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                            }
                        }
                    }
                }, {
                    $match: query
                }, {
                    $project: {
                        _id       : 1,
                        department: 1
                    }
                }], function (err, employees) {
                    if (err) {
                        return pCb(err);
                    }

                    employees.forEach(function (emp) {
                        employeesObject[emp._id.toString()] = emp.department.toString();
                    });

                    pCb(null, employeesObject);
                });

            }

            parallelFuncs = [formDateArray, findMonthHours, findHolidays, findAllDevs];

            async.parallel(parallelFuncs, function (err, result) {
                if (err) {
                    return wfCb(err);
                }

                wfCb(null, result);
            });
        }

        function forEachEmployee(result, wfCb) {
            var waterfallTasks;
            var parallelPart;
            var createJE;
            var employees = Object.keys(employeesObject);
            var mainCallback = _.after(employees.length, wfCb);

            employees.forEach(function (employeeId) {
                parallelPart = function (cb) {
                    var parallelTasks;
                    var findJE;
                    var findVacation;
                    var findSalary;
                    var salary = 0;

                    findJE = function (pcb) {

                        function findByWTrack(parallelCb) {
                            Model.aggregate([{
                                $match: {
                                    date                  : {
                                        $gte: new Date(startDate),
                                        $lte: new Date(endDate)
                                    },
                                    "sourceDocument.model": "wTrack",
                                    debit                 : {$gt: 0}
                                }
                            }, {
                                $lookup: {
                                    from        : "wTrack",
                                    localField  : "sourceDocument._id",
                                    foreignField: "_id",
                                    as          : "sourceDocument._id"
                                }
                            }, {
                                $project: {
                                    debit               : {$divide: ['$debit', '$currency.rate']},
                                    'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]},
                                    date                : 1
                                }
                            }, {
                                $match: {
                                    'sourceDocument._id.employee': objectId(employeeId)
                                }
                            }, {
                                $group: {
                                    _id: '$date'
                                }
                            }], function (err, result) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                var dates = _.pluck(result, '_id');

                                parallelCb(null, dates);
                            });
                        }

                        function findByEmployee(parallelCb) {
                            Model.aggregate([{
                                $match: {
                                    date                : {
                                        $gte: new Date(startDate),
                                        $lte: new Date(endDate)
                                    },
                                    "sourceDocument._id": objectId(employeeId),
                                    debit               : {$gt: 0}
                                }
                            }, {
                                $group: {
                                    _id: '$date'
                                }
                            }], function (err, result) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                var dates = _.pluck(result, '_id');

                                parallelCb(null, dates);
                            });
                        }

                        function removeIdleJE(parallelCb) {
                            Model.aggregate([{
                                $match: {
                                    date                  : {
                                        $gte: new Date(startDate),
                                        $lte: new Date(endDate)
                                    },
                                    "sourceDocument.model": 'Employees',
                                    debit                 : {$gt: 0},
                                    journal               : objectId(CONSTANTS.IDLE_PAYABLE)
                                }
                            }, {
                                $project: {
                                    _id: 1
                                }
                            }], function (err, result) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                var ids = _.pluck(result, '_id');

                                Model.remove({_id: {$in: ids}}, function (err, result) {
                                    if (err) {
                                        return parallelCb(err);
                                    }
                                });

                                parallelCb();
                            });
                        }

                        async.parallel([findByWTrack, findByEmployee, removeIdleJE], function (err, result) {
                            if (err) {
                                return pcb(err);
                            }

                            var firstResult = result[0];
                            var secondResult = result[1];
                            var dateArrayForEmployee = _.union(firstResult, secondResult);

                            pcb(null, dateArrayForEmployee);
                        });

                    };

                    findVacation = function (pcb) {
                        Vacation.find({
                            employee: employeeId,
                            month   : month,
                            year    : year
                        }, {vacArray: 1, month: 1, year: 1}, function (err, result) {
                            if (err) {
                                return pcb(err);
                            }

                            var vacation = result && result.length ? result[0].toJSON() : {};

                            if (Object.keys(vacation).length) {
                                var vacArray = vacation.vacArray;
                                var newDate = moment(new Date()).isoWeekYear(vacation.year).month(vacation.month - 1).date(1);
                                var i;
                                var resultObject = {};

                                for (i = vacArray.length - 1; i >= 0; i--) {
                                    if ((vacArray[i] === "V") || (vacArray[i] === "S")) {
                                        var key = (newDate.date(i + 1).year() * 100 + newDate.date(i + 1).month() + 1) * 100 + i + 1;
                                        resultObject[key] = vacArray[i];
                                    }
                                }

                                pcb(null, resultObject);
                            } else {
                                pcb(null, {});
                            }

                        });
                    };

                    findSalary = function (pcb) {
                        Employee.findById(employeeId, {transfer: 1}, function (err, result) {
                            if (err) {
                                return pcb(err);
                            }

                            var hire = result.transfer;
                            var length = hire.length;
                            var i;

                            for (i = length - 1; i >= 0; i--) {
                                if (startDate >= hire[i].date) {
                                    salary = hire[i].salary;
                                    break;
                                }
                            }

                            pcb(null, salary);
                        });
                    };

                    parallelTasks = [findJE, findVacation, findSalary];
                    async.parallel(parallelTasks, function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, {journalDates: result[0], vacation: result[1], salary: result[2]});
                    });
                };

                createJE = function (result, cb) {
                    var journalDates = result.journalDates;
                    var vacation = result.vacation;
                    var salary = result.salary;
                    var hourCost = isFinite(salary / monthHoursObject.hours) ? salary / monthHoursObject.hours : 0;

                    var diffDates;
                    var datemonth = [];
                    var daterendered = [];

                    dateArrayInMonth.forEach(function (date) {
                        datemonth.push(date.valueOf());
                    });

                    journalDates.forEach(function (date) {
                        daterendered.push(date.valueOf());
                    });

                    diffDates = _.difference(datemonth, daterendered);

                    async.each(diffDates, function (date, asyncCb) {
                        var dateKey = (moment(new Date(date)).isoWeekYear() * 100 + moment(date).month() + 1) * 100 + moment(date).date();
                        var callB = _.after(2, asyncCb);

                        var vacationBody = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.VACATION_PAYABLE,
                            date          : new Date(date),
                            sourceDocument: {
                                model: 'Employees',
                                _id  : employeeId
                            },
                            amount        : 0
                        };

                        var salaryIdleBody = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.IDLE_PAYABLE,
                            date          : new Date(date),
                            sourceDocument: {
                                model: 'Employees',
                                _id  : employeeId
                            }
                        };

                        if (vacation && vacation[dateKey]) {
                            vacationBody.amount = hourCost * HOURSCONSTANT * 100;
                            salaryIdleBody.amount = 0;
                        } else {
                            salaryIdleBody.amount = hourCost * HOURSCONSTANT * 100;
                            vacationBody.amount = 0;
                        }

                        createReconciled(salaryIdleBody, req.session.lastDb, callB, req.session.uId);
                        createReconciled(vacationBody, req.session.lastDb, callB, req.session.uId);
                    }, function () {
                        cb();
                    });

                };

                waterfallTasks = [parallelPart, createJE];
                async.waterfall(waterfallTasks, function (err, result) {
                    if (err) {
                        return mainCallback(err);
                    }

                    mainCallback();
                });
            });

        }

        waterfallFuncs = [parallelFuncFind, forEachEmployee];

        async.waterfall(waterfallFuncs, function (err, result) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    };

    this.recloseMonth = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var body = req.body;

        async.each(body, function (date, cb) {
            Model.remove({
                journal: {$in: CONSTANTS.CLOSE_MONTH_JOURNALS},
                date   : new Date(date)
            }, function (err, result) {
                var month = moment(date).month() + 1;
                var year = moment(date).year();
                closeMonth(req, res, next, {month: month, year: year}, cb);
            });
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send();
        });
    };

    this.closeMonth = function (req, res, next) {
        closeMonth(req, res, next);
    };

    function closeMonth(req, res, next, dateObject, cb) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = dateObject || req.body;
        var month = parseInt(query.month, 10);
        var year = parseInt(query.year, 10);
        var startDate = moment().isoWeekYear(year).month(month - 1).startOf('month');
        var localDate = moment().isoWeekYear(year).month(month - 1).endOf('month');
        var endDate = moment(localDate);
        var waterlallTasks;
        var productSales;
        var COGS;

        var parallelCreate = function (wfCb) {
            var parallelTasks;

            var createIncomeSummary = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
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
                    if (err) {
                        return cb(err);
                    }

                    var debit = result[0] ? result[0].debit : 0;
                    var credit = result[0] ? result[0].credit : 0;
                    var balance = Math.abs(debit - credit);

                    productSales = balance;

                    var body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CREDIT_IS,
                        date          : new Date(moment(localDate).subtract(3, 'hours')),
                        sourceDocument: {
                            model: 'closeMonth',
                            _id  : null
                        },
                        amount        : balance
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                })
            };

            var createCloseCOGS = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
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
                    if (err) {
                        return cb(err);
                    }

                    var debit = result[0] ? result[0].debit : 0;
                    var credit = result[0] ? result[0].credit : 0;
                    var balance = debit - credit;

                    COGS = balance;

                    var body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_COGS,
                        date          : new Date(moment(localDate).subtract(3, 'hours')),
                        sourceDocument: {
                            model: 'closeMonth',
                            _id  : null
                        },
                        amount        : balance
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                })
            };

            var cretaeCloseVacation = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
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
                    if (err) {
                        return cb(err);
                    }

                    var debit = result[0] ? result[0].debit : 0;
                    var credit = result[0] ? result[0].credit : 0;
                    var balance = debit - credit;

                    var body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_VAC_EXP,
                        date          : new Date(moment(localDate).subtract(3, 'hours')),
                        sourceDocument: {
                            model: 'closeMonth'
                        },
                        amount        : balance,
                        _id           : null
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                })
            };

            var createCloseIdle = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.IDLE_EXPENSES)
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    var debit = result[0] ? result[0].debit : 0;
                    var credit = result[0] ? result[0].credit : 0;
                    var balance = debit - credit;

                    var body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_IDLE_EXP,
                        date          : new Date(moment(localDate).subtract(3, 'hours')),
                        sourceDocument: {
                            model: 'closeMonth'
                        },
                        amount        : balance
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                })
            };

            var createCloseAdminSalary = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
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
                    if (err) {
                        return cb(err);
                    }

                    var debit = result[0] ? result[0].debit : 0;
                    var credit = result[0] ? result[0].credit : 0;
                    var balance = debit - credit;

                    var body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_ADMIN_EXP,
                        date          : new Date(moment(localDate).subtract(3, 'hours')),
                        sourceDocument: {
                            model: 'closeMonth'
                        },
                        amount        : balance
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);
                })
            };

            parallelTasks = [createIncomeSummary, createCloseCOGS, cretaeCloseVacation, createCloseIdle, createCloseAdminSalary];
            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return wfCb(err);
                }

                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
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
                    if (err) {
                        return wfCb(err);
                    }

                    var debit = je[0] ? je[0].debit : 0;
                    var credit = je[0] ? je[0].credit : 0;
                    var balance = Math.abs(debit - credit);

                    var body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.CLOSE_ADMIN_BUD,
                        date          : new Date(moment(localDate).subtract(3, 'hours')),
                        sourceDocument: {
                            model: 'closeMonth'
                        },
                        amount        : balance
                    };

                    var cb = function () {
                        wfCb(null, result);
                    };

                    createReconciled(body, req.session.lastDb, cb, req.session.uId);

                });
            });
        };

        var createRE = function (result, wfCb) {
            Model.aggregate([{
                $match: {
                    date   : {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
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
                if (err) {
                    return wfCb(err);
                }

                var debit = result[0] ? result[0].debit : 0;
                var credit = result[0] ? result[0].credit : 0;
                var balance = Math.abs(debit - credit);

                if (productSales - COGS < 0) {
                    balance = balance * (-1);
                }

                var body = {
                    currency      : CONSTANTS.CURRENCY_USD,
                    journal       : CONSTANTS.RETAINED_EARNINGS,
                    date          : new Date(moment(localDate).subtract(3, 'hours')),
                    sourceDocument: {
                        model: 'closeMonth'
                    },
                    amount        : balance
                };

                createReconciled(body, req.session.lastDb, wfCb, req.session.uId);
            })
        };

        waterlallTasks = [parallelCreate, createRE];

        async.waterfall(waterlallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            if (cb) {
                cb(null, result);
            } else {
                res.status(200).send({'success': true});
            }
        })
    }

    this.reconcile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var Invoice = models.get(req.session.lastDb, 'Invoice', invoiceSchema);
        var Holidays = models.get(req.session.lastDb, 'Holiday', holidaysSchema);
        var Vacation = models.get(req.session.lastDb, 'Vacation', vacationSchema);
        var body = req.body;
        var date = new Date(body.date);
        var reconcileSalaryEntries;
        var reconcileInvoiceEntries;
        var timeToSet = {hour: 15, minute: 1, second: 0};
        var createdDateObject = {};
        var createDirect;
        var parallelTasks;
        var waterfallForSalary;
        var wTrackFinder;
        var parallelFunctionRemoveCreate;
        var removeBySource;
        var create;
        var createIdle;
        var parallelRemoveCreate;
        var waterfallCreateEntries;
        var wTracks;

        reconcileInvoiceEntries = function (mainCallback) {
            Invoice.find({reconcile: true, _type: {$ne: "Proforma"}}, function (err, result) {
                if (err) {
                    return mainCallback(err);
                }

                var resultArray = [];

                result.forEach(function (el) {
                    resultArray.push(el._id);
                });

                var parallelRemove = function (cb) {
                    Model.remove({
                        "sourceDocument._id": {$in: resultArray}
                    }, function (err, result) {
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
                            payments   : 1,
                            paymentDate: 1,
                            dueDate    : 1,
                            _id        : 0
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
                            payment    : {$arrayElemAt: ['$payment', 0]},
                            paymentDate: 1,
                            dueDate    : 1
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
                            payment    : 1,
                            invoice    : {$arrayElemAt: ['$invoice', 0]},
                            paymentDate: 1,
                            dueDate    : 1
                        }
                    }, {
                        $match: {
                            'invoice._type': 'Proforma'
                        }
                    }, {
                        $group: {
                            _id         : '$invoice._id',
                            paymentsInfo: {$push: '$payment'},
                            payments    : {$push: '$payment._id'},
                            paymentDate : {$first: '$paymentDate'},
                            dueDate     : {$max: '$dueDate'}
                        }
                    }], function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, result);
                    });
                }

                var parallelCreate = function (result, cb) {
                    async.each(resultArray, function (element, asyncCb) {
                        Invoice.findById(element, function (err, invoice) {
                            if (err) {
                                return asyncCb(err);
                            }

                            var cb = asyncCb;

                            var proforma = _.find(result, function (el) {
                                if (element && element._id) {
                                    return el._id.toString() === element._id.toString()
                                }
                            });

                            var paidAmount = 0;
                            var beforeInvoiceBody = {};
                            var journalEntryBody = {};

                            if (proforma) {
                                proforma.paymentsInfo.forEach(function (payment) {
                                    var paid = payment.paidAmount;
                                    var paidInUSD = paid / payment.currency.rate;

                                    paidAmount += paidInUSD;
                                });

                                if (invoice.paymentInfo.total - paidAmount > 0) {
                                    cb = _.after(2, asyncCb);

                                    beforeInvoiceBody.date = invoice.invoiceDate;
                                    beforeInvoiceBody.journal = invoice.journal;
                                    beforeInvoiceBody.currency = invoice.currency ? invoice.currency._id : 'USD';
                                    beforeInvoiceBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total - invoice.paymentInfo.balance : 0;
                                    beforeInvoiceBody.sourceDocument = {};
                                    beforeInvoiceBody.sourceDocument._id = invoice._id;
                                    beforeInvoiceBody.sourceDocument.model = 'Proforma';

                                    createReconciled(beforeInvoiceBody, req.session.lastDb, cb, req.session.uId);
                                }
                            }

                            journalEntryBody.date = invoice.invoiceDate;
                            journalEntryBody.journal = invoice.journal || CONSTANTS.INVOICE_JOURNAL;
                            journalEntryBody.currency = invoice.currency ? invoice.currency._id : 'USD';
                            journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
                            journalEntryBody.sourceDocument = {};
                            journalEntryBody.sourceDocument._id = invoice._id;
                            journalEntryBody.sourceDocument.model = 'Invoice';

                            createReconciled(journalEntryBody, req.session.lastDb, cb, req.session.uId);
                        });
                    }, function () {
                        cb();
                    });

                };

                var waterfallTasks = [parallelRemove, findProformaPayments, parallelCreate];

                async.waterfall(waterfallTasks, function (err) {
                    if (err) {
                        return mainCallback(err);
                    }

                    Invoice.update({_id: {$in: resultArray}}, {$set: {reconcile: false}}, {multi: true}, function () {
                        mainCallback();
                        res.status(200).send({success: true});
                    });
                });
            });
        };

        reconcileSalaryEntries = function (mainCallback) {

            wTrackFinder = function (wfcallback) {
                WTrack.find({reconcile: true}, function (err, result) {
                    if (err) {
                        return wfcallback(err);
                    }
                    var resultArray = [];
                    var employeesObj = {};
                    var monthKeysObj = {};
                    var weekKeysObj = {};
                    var employees;
                    var monthKeys;
                    var weekKeys;

                    result.forEach(function (el) {
                        resultArray.push(el._id);
                        employeesObj[el.employee] = true;
                        monthKeysObj[el.dateByMonth] = true;
                        weekKeysObj[el.dateByWeek] = true;
                    });

                    wTracks = resultArray;

                    employees = Object.keys(employeesObj);
                    monthKeys = Object.keys(monthKeysObj);
                    weekKeys = Object.keys(weekKeysObj);

                    wfcallback(null, {
                        wTrackIds   : resultArray,
                        wTracks     : result,
                        employeesIds: employees,
                        monthKeys   : monthKeys,
                        weekKeys    : weekKeys
                    });
                });
            };

            parallelFunctionRemoveCreate = function (wTrackResultObject, wfcallback) {
                var wTrackIds = wTrackResultObject.wTrackIds;
                var wTracks = wTrackResultObject.wTracks;
                var employeesArray = wTrackResultObject.employeesIds;
                var dateByMonthArray = wTrackResultObject.monthKeys;
                var salaryObject = {};
                var monthHoursObject = {};
                var holidaysObject = {};
                var vacationObject = {};

                if (!wTrackIds.length) {
                    return wfcallback();
                }

                removeBySource = function (pbc) {
                    Model.remove({
                        "sourceDocument._id": {$in: wTrackIds}
                    }, pbc);
                };

                create = function (pcb) {

                    createDirect = function (createWaterfallCb) {
                        var salaryFinder = function (parallelCb) {
                            var query = Employee.find({_id: {$in: employeesArray}}, {transfer: 1}).lean();

                            query.exec(function (err, employees) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                employees.forEach(function (employee) {
                                    var transferArray = employee.transfer;

                                    if (!salaryObject[employee._id]) {
                                        salaryObject[employee._id] = {};
                                    }

                                    transferArray.forEach(function (transferObj) {
                                        if (transferObj.status !== 'fired') {
                                            salaryObject[employee._id][transferObj.date] = transferObj.salary || 0;
                                        }
                                    });
                                });

                                parallelCb(null, salaryObject);
                            });
                        };

                        var monthHoursFinder = function (parallelCb) {
                            async.each(dateByMonthArray, function (key, cb) {
                                redisStore.readFromStorage('monthHours', key, function (err, result) {

                                    if (!monthHoursObject[key]) {
                                        monthHoursObject[key] = {};
                                    }

                                    result = JSON.parse(result);

                                    if (result && result[0]) {
                                        monthHoursObject[key] = result && result[0] ? result[0] : {};
                                        cb();
                                    } else {
                                        //TODO
                                    }

                                });
                            }, function () {
                                parallelCb(null, monthHoursObject);
                            });
                        };

                        var holidaysFinder = function (parallelCb) {
                            var query = Holidays.find().lean();

                            query.exec(function (err, result) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                result.forEach(function (holiday) {
                                    var holidayDate = moment(holiday.date);
                                    var key = (holidayDate.isoWeekYear() * 100 + holidayDate.month() + 1) * 100 + holidayDate.date();
                                    holidaysObject[key] = true;
                                });

                                parallelCb(null, holidaysObject);
                            });
                        };

                        var vacationFinder = function (parallelCb) {
                            var query = Vacation.find({
                                employee: {$in: employeesArray}
                            }).lean();

                            query.exec(function (err, result) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                result.forEach(function (vacation) {
                                    if (!vacationObject[vacation.employee]) {
                                        vacationObject[vacation.employee] = {};
                                    }
                                    var newDate = moment(new Date()).year(vacation.year).month(vacation.month - 1).date(1);
                                    var vacArray = vacation.vacArray;
                                    var length = vacArray.length;
                                    var i;

                                    for (i = length - 1; i >= 0; i--) {
                                        if (vacArray[i]) {
                                            var key = (newDate.date(i + 1).year() * 100 + newDate.date(i + 1).month() + 1) * 100 + i + 1;
                                            vacationObject[vacation.employee][key] = vacArray[i];
                                        }
                                    }

                                });

                                parallelCb(null, vacationObject);
                            });
                        };

                        async.parallel([salaryFinder, monthHoursFinder, holidaysFinder, vacationFinder], function (err, result) {
                            async.each(wTracks, function (wTrackModel, asyncCb) {
                                var j;
                                var dataObject = {};
                                var keys;
                                var employeeSubject = wTrackModel.employee;
                                var sourceDocumentId = wTrackModel._id;
                                var methodCb;
                                var year = wTrackModel.year;

                                if (wTrackModel.isoYear && wTrackModel.isoYear !== year) {
                                    year = wTrackModel.isoYear;
                                }

                                var date = moment().isoWeekYear(year).month(wTrackModel.month - 1).isoWeek(wTrackModel.week).startOf('isoWeek');

                                for (j = 5; j >= 1; j--) {
                                    date = moment(date).day(j);
                                    dataObject[j] = date;
                                }

                                date = moment(date).day(6);
                                dataObject[6] = date;

                                date = moment(date).day(0);
                                dataObject[7] = date;

                                keys = Object.keys(dataObject);
                                methodCb = _.after(keys.length * 4, asyncCb);

                                keys.forEach(function (i) {
                                    var hours = wTrackModel[i];
                                    var date = dataObject[i];
                                    var day = i;
                                    var dateByMonth = wTrackModel.dateByMonth;
                                    var monthHours = monthHoursObject[dateByMonth];
                                    var overheadRate = monthHours ? monthHours.overheadRate : 0;
                                    var employeeSalary = salaryObject[employeeSubject];
                                    var salary = 0;
                                    var salaryChangeDates = Object.keys(employeeSalary);
                                    var costHour;
                                    var hoursInMonth = monthHours ? monthHours.hours : 0;
                                    var dateKey = (date.year() * 100 + date.month() + 1) * 100 + date.date();
                                    var holidayDate = holidaysObject[dateKey];
                                    var sameDayHoliday = holidayDate;
                                    var vacationForEmployee = vacationObject[employeeSubject] || {};
                                    var vacationSameDate = vacationForEmployee[dateKey];

                                    var overtime = (wTrackModel._type === 'overtime') || false;

                                    Model.remove({
                                        "sourceDocument.model": 'Employees',
                                        date                  : date.set(timeToSet)
                                    }, function (err, result) {

                                        for (var i = salaryChangeDates.length - 1; i >= 0; i--) {
                                            var currentSalary = employeeSalary[salaryChangeDates[i]];
                                            var salaryDate = moment(new Date(salaryChangeDates[i]));

                                            if (salaryDate.isBefore(date)) {
                                                salary = currentSalary;
                                                break;
                                            }
                                        }

                                        costHour = isFinite(salary / hoursInMonth) ? salary / hoursInMonth : 0;

                                        if (!createdDateObject[dateKey]) {
                                            createdDateObject[dateKey] = {};
                                            createdDateObject[dateKey].employees = {};
                                        }

                                        if (!createdDateObject[dateKey].employees[employeeSubject]) {
                                            createdDateObject[dateKey].employees[employeeSubject] = {
                                                vacation: 0,
                                                hours   : 0,
                                                wTracks : {}
                                            }
                                        }

                                        var bodySalary = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.SALARY_PAYABLE,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id  : sourceDocumentId
                                            }
                                        };

                                        var bodyVacation = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.VACATION_PAYABLE,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'Employees',
                                                _id  : employeeSubject
                                            }
                                        };

                                        var bodyOvertime = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.OVERTIME_PAYABLE,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id  : sourceDocumentId
                                            }
                                        };

                                        var bodyOverhead = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.OVERHEAD,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id  : sourceDocumentId
                                            }
                                        };

                                        if (day <= 5 && !sameDayHoliday) {
                                            if (hours - HOURSCONSTANT >= 0) {
                                                bodySalary.amount = costHour * HOURSCONSTANT * 100;
                                                bodyOvertime.amount = costHour * (hours - HOURSCONSTANT) * 100;
                                                bodyOverhead.amount = overheadRate * HOURSCONSTANT * 100;
                                            } else {
                                                bodySalary.amount = costHour * hours * 100;
                                                bodyOvertime.amount = 0;
                                                bodyOverhead.amount = overheadRate * hours * 100;
                                            }

                                            if (vacationSameDate) {
                                                if ((vacationForEmployee[dateKey] === "V") || (vacationForEmployee[dateKey] === "S")) {
                                                    bodyOvertime.amount = costHour * hours * 100;
                                                    bodyOverhead.amount = overheadRate * hours * 100;
                                                    bodySalary.amount = 0;

                                                    if (!createdDateObject[dateKey].employees[employeeSubject].vacation) {
                                                        createdDateObject[dateKey].employees[employeeSubject].vacation = HOURSCONSTANT;
                                                        bodyVacation.amount = costHour * HOURSCONSTANT * 100;
                                                    }
                                                }
                                            }

                                            if (!createdDateObject[dateKey].employees[employeeSubject].wTracks[sourceDocumentId]) {
                                                createdDateObject[dateKey].employees[employeeSubject].wTracks[sourceDocumentId] = 0;
                                            }

                                            createdDateObject[dateKey].employees[employeeSubject].costHour = costHour;
                                            createdDateObject[dateKey].employees[employeeSubject].hours += hours;
                                            createdDateObject[dateKey].employees[employeeSubject].wTracks[sourceDocumentId] += hours;
                                        } else {
                                            bodyOvertime.amount = costHour * hours * 100;
                                            bodyOverhead.amount = overheadRate * hours * 100;

                                            if (sameDayHoliday) {
                                                bodyOvertime.amount = costHour * hours * 100;
                                            }
                                        }

                                        //if (overtime) {
                                        //    bodyOvertime.amount = costHour * hours * 100;
                                        //    bodyOverhead.amount = overheadRate * hours * 100;
                                        //}

                                        createReconciled(bodySalary, req.session.lastDb, methodCb, req.session.uId);
                                        createReconciled(bodyOvertime, req.session.lastDb, methodCb, req.session.uId);
                                        createReconciled(bodyOverhead, req.session.lastDb, methodCb, req.session.uId);
                                        createReconciled(bodyVacation, req.session.lastDb, methodCb, req.session.uId);

                                    });

                                });
                            }, function () {
                                createWaterfallCb(null, createdDateObject);
                            });
                        });
                    };

                    createIdle = function (totalObject, createWaterfallCb) {
                        var dates = Object.keys(totalObject);
                        var totalIdleObject = {};
                        var findAllDevs;
                        var createIdleTime;
                        var matchObj;
                        var findMonthHours;
                        var monthHours = {};

                        if (!dates.length) {
                            return createWaterfallCb();
                        }

                        var minDate = _.min(dates);
                        var maxDate = _.max(dates);
                        var startYear = parseInt(minDate.slice(0, 4), 10);
                        var startMonth = parseInt(minDate.slice(4, 6), 10);
                        var dateOfMonth = parseInt(minDate.slice(6), 10);
                        var date = moment().year(startYear).month(startMonth - 1).date(dateOfMonth);
                        var endYear = parseInt(maxDate.slice(0, 4), 10);
                        var endMonth = parseInt(maxDate.slice(4, 6), 10);
                        var endDateOfMonth = parseInt(maxDate.slice(6), 10);
                        var endDate = moment().year(endYear).month(endMonth - 1).date(endDateOfMonth);
                        var j;

                        var startDateKey = startYear * 100 + moment(date).isoWeek();
                        var endDateKey = endYear * 100 + moment(endDate).isoWeek();

                        //var startOfMonth = moment(date).startOf('month');
                        //var startK = (moment(startOfMonth).isoWeekYear() * 100 + moment(startOfMonth).month() + 1) * 100 + moment(startOfMonth).date();
                        //var endOfMonth = moment(endDate).endOf('month');
                        //var endK = (moment(endOfMonth).isoWeekYear() * 100 + moment(endOfMonth).month() + 1) * 100 + moment(endOfMonth).date();
                        //var length = endK - startK;
                        //
                        //for (j = length - 1; j >= 0; j--){
                        //    newDateArrayWithIdle.push((startK + j).toString());
                        //}

                        matchObj = {
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
                                                $gte: startDateKey
                                            }
                                        }, {
                                            lastHire: {
                                                $ne : null,
                                                $lte: endDateKey
                                            }
                                        }]
                                    }]
                                }, {
                                    $and: [{
                                        isEmployee: false
                                    }, {
                                        lastFire: {
                                            $ne : null,
                                            $gte: startDateKey
                                        }
                                    }]
                                }
                                ]
                            }]
                        };

                        findAllDevs = function (callback) {
                            Employee
                                .aggregate([{
                                    $match: {
                                        //  'department': {$nin: notDevArray.objectID()},
                                        hire: {$ne: []}
                                    }
                                }, {
                                    $project: {
                                        isEmployee: 1,
                                        hire      : 1,
                                        transfer  : 1,
                                        name      : 1,
                                        lastFire  : 1,
                                        lastHire  : {
                                            $let: {
                                                vars: {
                                                    lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                                                },
                                                in  : {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                                            }
                                        }
                                    }
                                }, {
                                    $match: matchObj
                                }, {
                                    $project: {
                                        _id     : 1,
                                        hire    : 1,
                                        transfer: 1
                                    }
                                }], function (err, result) {
                                    if (err) {
                                        callback(err);
                                    }

                                    var emps = _.pluck(result, '_id');

                                    callback(null, {emps: emps, salary: result});
                                });
                        };

                        findMonthHours = function (empResult, callback) {
                            async.each(dates, function (dateKey, asyncCb) {
                                var year = parseInt(dateKey.slice(0, 4), 10);
                                var month = parseInt(dateKey.slice(4, 6), 10);
                                var key = year * 100 + month;

                                if (!monthHoursObject[key]) {
                                    redisStore.readFromStorage('monthHours', key, function (err, result) {

                                        if (!monthHoursObject[key]) {
                                            monthHoursObject[key] = {};
                                        }

                                        result = JSON.parse(result);
                                        monthHoursObject[key] = result && result[0] ? result[0] : {};
                                        asyncCb();
                                    });
                                } else {
                                    asyncCb();
                                }

                            }, function (err, result) {
                                callback(null, {
                                    monthHours: monthHoursObject,
                                    emps      : empResult.emps,
                                    salary    : empResult.salary
                                });
                            });
                        };

                        createIdleTime = function (empResult, callback) {
                            async.each(dates, function (dateKey, asyncCb) {
                                var year = parseInt(dateKey.slice(0, 4), 10);
                                var month = parseInt(dateKey.slice(4, 6), 10);
                                var dateOfMonth = parseInt(dateKey.slice(6), 10);
                                var date = moment().year(year).month(month - 1).date(dateOfMonth);
                                var objectForDay = totalObject[dateKey] || {};
                                var employeesObjects = objectForDay.employees || [];
                                var employeesIds = Object.keys(employeesObjects);

                                var stringIds = [];

                                empResult.emps.forEach(function (el) {
                                    stringIds.push(el.toString());
                                });

                                var allEmployees = _.union(employeesIds, stringIds);
                                var employeesCount = allEmployees.length;
                                var i;
                                var employeesWithSalary = empResult.salary;
                                var monthHours = empResult.monthHours[year * 100 + month] || {};
                                var dayOfWeek = moment(date).day();
                                var cb = _.after(employeesCount, asyncCb);
                                var holidayDate = holidaysObject[dateKey];
                                var sameDayHoliday = holidayDate;

                                if ((dayOfWeek === 0) || (dayOfWeek === 6)) {
                                    return asyncCb();
                                }

                                if (!totalIdleObject[dateKey]) {
                                    totalIdleObject[dateKey] = 0;
                                }
                                Model.remove({
                                    "sourceDocument.model": 'Employees',
                                    date                  : date.set(timeToSet),
                                    journal               : CONSTANTS.IDLE_PAYABLE
                                }, function (err, result) {
                                    for (i = employeesCount - 1; i >= 0; i--) {
                                        var employee = allEmployees[i];
                                        var empObject = employeesObjects[employee] || {};
                                        var vacation = empObject.vacation;
                                        var totalWorkedForDay = empObject.hours || 0;
                                        var salary = 0;
                                        var employeeNotTracked = _.find(employeesWithSalary, function (elem) {
                                            return elem._id.toString() === employee.toString();
                                        });
                                        var hireArray = employeeNotTracked ? employeeNotTracked.transfer : [];
                                        var length = hireArray.length;
                                        var j;
                                        var costHour = 0;
                                        var hours = monthHours.hours || 0;
                                        var createVacation = false;
                                        var department;

                                        for (j = length - 1; j >= 0; j--) {
                                            if (date >= hireArray[j].date) {
                                                salary = hireArray[j].salary;
                                                department = hireArray[j].department;
                                                break;
                                            }
                                        }

                                        if (!vacation) {
                                            vacation = vacationObject[employee] ? vacationObject[employee][dateKey] : null;

                                            if ((vacation === 'P') || (vacation === 'E')) {
                                                vacation = null;
                                            }

                                            if (vacation) {
                                                createVacation = true;
                                            }
                                        }

                                        costHour = isFinite(salary / hours) ? (salary / hours) : 0;

                                        var bodySalaryIdle = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.IDLE_PAYABLE,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'Employees'
                                            }
                                        };

                                        var idleTime = HOURSCONSTANT - totalWorkedForDay;

                                        bodySalaryIdle.sourceDocument._id = employee;

                                        if (totalWorkedForDay - HOURSCONSTANT < 0) {
                                            if (!vacation) {
                                                if (totalWorkedForDay - HOURSCONSTANT >= 0) {
                                                    bodySalaryIdle.amount = 0;
                                                } else {
                                                    bodySalaryIdle.amount = costHour * idleTime * 100;
                                                    totalIdleObject[dateKey] += costHour * idleTime * 100;
                                                }

                                            } else {
                                                bodySalaryIdle.amount = 0;
                                            }
                                        } else {
                                            bodySalaryIdle.amount = 0;
                                        }

                                        if (createVacation) {
                                            bodySalaryIdle.amount = costHour * HOURSCONSTANT * 100;
                                            bodySalaryIdle.journal = CONSTANTS.VACATION_PAYABLE;
                                        }

                                        if (department && notDevArray.indexOf(department.toString()) !== -1) {
                                            bodySalaryIdle.amount = 0;
                                            cb();
                                            continue;
                                        }

                                        if (sameDayHoliday) {
                                            bodySalaryIdle.amount = 0;
                                        }

                                        if ((bodySalaryIdle.amount > 0) && (bodySalaryIdle.journal === CONSTANTS.VACATION_PAYABLE)) {
                                            if (!employeesObjects[employee]) {
                                                employeesObjects[employee] = {};
                                            }

                                            employeesObjects[employee].vacation = 'V';
                                        }

                                        if (bodySalaryIdle.amount > 0) {
                                            createReconciled(bodySalaryIdle, req.session.lastDb, cb, req.session.uId);
                                        } else {
                                            cb();
                                        }
                                    }
                                });
                            }, function (err, result) {
                                callback(err, {totalIdleObject: totalIdleObject, totalObject: totalObject});
                            });
                        };

                        var waterfall = [findAllDevs, findMonthHours, createIdleTime];

                        async.waterfall(waterfall, function (err, result) {
                            if (err) {
                                return createWaterfallCb(err);
                            }

                            createWaterfallCb(err, {totalIdleObject: totalIdleObject, totalObject: totalObject});
                        });

                    };

                    waterfallCreateEntries = [createDirect, createIdle];

                    async.waterfall(waterfallCreateEntries, function (err, result) {
                        if (err) {
                            return pcb(err);
                        }

                        pcb(null, result);
                    });
                };

                parallelRemoveCreate = [removeBySource, create];

                async.parallel(parallelRemoveCreate, function (err, result) {
                    if (err) {
                        return wfcallback(err);
                    }

                    wfcallback(null, result);
                });
            };

            waterfallForSalary = [wTrackFinder, parallelFunctionRemoveCreate];

            async.waterfall(waterfallForSalary, function (err, result) {
                if (err) {
                    return mainCallback(err);
                }

                mainCallback(null, result);
            });
        };

        parallelTasks = [reconcileInvoiceEntries, reconcileSalaryEntries];

        async.parallel(parallelTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            //res.status(200).send({success: true});

            event.emit('sendMessage', {view: 'journalEntry', message: 'Please, refresh browser, data was changed.'});

            var db = models.connection(req.session.lastDb);
            var setObj = {date: date};

            WTrack.update({_id: {$in: wTracks}}, {$set: {reconcile: false}}, {multi: true}, function (err, result) {

            });

            db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: setObj}, function (err, result) {
                if (err) {
                    return next(err);
                }

            });
        });

    };

    function createReconciled(body, dbIndex, cb, uId) {
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var journalId = body.journal;
        var now = moment();
        var date = body.date ? moment(body.date) : now;
        var currency;
        var amount = body.amount;

        var waterfallTasks = [journalFinder, journalEntrySave];

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

                    if (amount && moment(debitObject.date).isBefore(now)) {
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
        };

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return cb(err);
            }

            if (cb) {
                cb(null, response);
            }
        });
    };

    this.createReconciled = function (body, dbIndex, cb, uId) {
        createReconciled(body, dbIndex, cb, uId);
    };

    this.getReconcileDate = function (req, res, next) {
        var db = models.connection(req.session.lastDb);

        db.collection('settings').findOne({name: 'reconcileDate'}, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result && result.length) {
                res.status(200).send({date: result.date});
            } else {
                res.status(200).send({date: new Date("14 Jul 2014")});
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

        var waterfallTasks = [currencyNameFinder, journalFinder, journalEntrySave];

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
            oxr.historical(date, function () {
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
                            date: new Date()
                        };

                        debitObject.createdBy = {
                            user: uId,
                            date: new Date()
                        };

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
                            date: new Date()
                        };

                        creditObject.createdBy = {
                            user: uId,
                            date: new Date()
                        };

                        if (amount && moment(debitObject.date).isBefore(now)) {
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

                rates = oxr.rates;
                currency.rate = rates[currency.name];

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
            });
        };

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return cb(err);
            }

            if (cb) {
                cb(null, response);
            }
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);

        var data = req.query;
        var findInvoice;
        var findSalary;
        var findByEmployee;
        var filter = data.filter;
        var filterObj = {};
        var startDate = data.startDate || filter.startDate.value;
        var endDate = data.endDate || filter.endDate.value;
        var findJobsFinished;
        var findPayments;
        var findSalaryPayments;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        var matchObject = {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (filter) {
            var filterArray = caseFilterForTotalCount(filter);

            if (filterArray.length) {
                filterObj.$and = filterArray
            }
        }

        access.getReadAccess(req, req.session.uId, 86, function (access) {
            if (access) {
                findInvoice = function (cb) {
                    Model
                        .aggregate([{
                            $match: matchObject
                        }, {
                            $match: {
                                "sourceDocument.model": {$in: ["Invoice", "proforma", "dividendInvoice"]},
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "account",
                                foreignField: "_id",
                                as          : "account"
                            }
                        }, {
                            $lookup: {
                                from        : "Invoice",
                                localField  : "sourceDocument._id",
                                foreignField: "_id",
                                as          : "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from        : "journals",
                                localField  : "journal",
                                foreignField: "_id",
                                as          : "journal"
                            }
                        }, {
                            $project: {
                                debit               : {$divide: ['$debit', '$currency.rate']},
                                currency            : 1,
                                journal             : {$arrayElemAt: ["$journal", 0]},
                                'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                'journal.name'          : 1,
                                'journal.creditAccount' : 1,
                                'sourceDocument._id'    : 1,
                                'sourceDocument.subject': "$sourceDocument._id.supplier"
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
                                return next(err);
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
                            "sourceDocument.model": "wTrack",
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $lookup: {
                            from        : "wTrack",
                            localField  : "sourceDocument._id",
                            foreignField: "_id",
                            as          : "sourceDocument._id"
                        }
                    }, {
                        $lookup: {
                            from        : "journals",
                            localField  : "journal",
                            foreignField: "_id",
                            as          : "journal"
                        }
                    }, {
                        $project: {
                            debit               : {$divide: ['$debit', '$currency.rate']},
                            journal             : {$arrayElemAt: ["$journal", 0]},
                            'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                        }
                    }, {
                        $project: {
                            debit                   : 1,
                            'journal.creditAccount' : 1,
                            'journal.name'          : 1,
                            'sourceDocument.subject': "$sourceDocument._id.employee"
                        }
                    }];

                    if (filterObj.$and && filterObj.$and.length) {
                        query.push({$match: filterObj});
                    }

                    aggregate = Model.aggregate(query);

                    aggregate.options = {allowDiskUse: true};

                    aggregate.exec(function (err, result) {
                        if (err) {
                            return next(err);
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
                            "sourceDocument.model": "Employees",
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $lookup: {
                            from        : "Employees",
                            localField  : "sourceDocument._id",
                            foreignField: "_id",
                            as          : "sourceDocument._id"
                        }
                    }, {
                        $lookup: {
                            from        : "journals",
                            localField  : "journal",
                            foreignField: "_id",
                            as          : "journal"
                        }
                    }, {
                        $project: {
                            debit               : {$divide: ['$debit', '$currency.rate']},
                            journal             : {$arrayElemAt: ["$journal", 0]},
                            'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                        }
                    }, {
                        $lookup: {
                            from        : "chartOfAccount",
                            localField  : "journal.debitAccount",
                            foreignField: "_id",
                            as          : "journal.debitAccount"
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
                            return next(err);
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
                            "sourceDocument.model": "jobs",
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $lookup: {
                            from        : "jobs",
                            localField  : "sourceDocument._id",
                            foreignField: "_id",
                            as          : "sourceDocument._id"
                        }
                    }, {
                        $lookup: {
                            from        : "journals",
                            localField  : "journal",
                            foreignField: "_id",
                            as          : "journal"
                        }
                    }, {
                        $project: {
                            debit               : 1,
                            journal             : {$arrayElemAt: ["$journal", 0]},
                            'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                        }
                    }, {
                        $lookup: {
                            from        : "chartOfAccount",
                            localField  : "journal.creditAccount",
                            foreignField: "_id",
                            as          : "journal.creditAccount"
                        }
                    }, {
                        $project: {
                            debit                   : 1,
                            'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
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
                            "sourceDocument.model": "Payment",
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $lookup: {
                            from        : "Payment",
                            localField  : "sourceDocument._id",
                            foreignField: "_id",
                            as          : "sourceDocument._id"
                        }
                    }, {
                        $lookup: {
                            from        : "journals",
                            localField  : "journal",
                            foreignField: "_id",
                            as          : "journal"
                        }
                    }, {
                        $project: {
                            debit               : 1,
                            journal             : {$arrayElemAt: ["$journal", 0]},
                            'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                        }
                    }, {
                        $lookup: {
                            from        : "chartOfAccount",
                            localField  : "journal.creditAccount",
                            foreignField: "_id",
                            as          : "journal.creditAccount"
                        }
                    }, {
                        $project: {
                            debit                   : 1,
                            'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
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
                            "sourceDocument.model": "salaryPayment",
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $lookup: {
                            from        : "Employees",
                            localField  : "sourceDocument._id",
                            foreignField: "_id",
                            as          : "sourceDocument._id"
                        }
                    }, {
                        $lookup: {
                            from        : "journals",
                            localField  : "journal",
                            foreignField: "_id",
                            as          : "journal"
                        }
                    }, {
                        $project: {
                            debit               : 1,
                            journal             : {$arrayElemAt: ["$journal", 0]},
                            'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                        }
                    }, {
                        $lookup: {
                            from        : "chartOfAccount",
                            localField  : "journal.creditAccount",
                            foreignField: "_id",
                            as          : "journal.creditAccount"
                        }
                    }, {
                        $project: {
                            debit                   : 1,
                            'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
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

                var parallelTasks = [findInvoice, findSalary, findByEmployee, findJobsFinished, findPayments, findSalaryPayments];

                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    var invoices = result[0];
                    var salary = result[1];
                    var jobsFinished = result[3];
                    var salaryEmployee = result[2];
                    var paymentsResult = result[4];
                    var salaryPaymentsResult = result[5];
                    var totalValue = 0;
                    var models = _.union(invoices, salary, jobsFinished, salaryEmployee, paymentsResult, salaryPaymentsResult);

                    models.forEach(function (model) {
                        totalValue += model.debit;
                    });

                    res.status(200).send({count: models.length, totalValue: totalValue});
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.getAsyncCloseMonth = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var date = query._id;

        if (!date) {
            return res.status(200).send({journalEntries: []});
        }

        Model.aggregate([{
            $match: {
                date: new Date(date)
            }
        }, {
            $project: {
                date   : 1,
                debit  : {$divide: ['$debit', '$currency.rate']},
                credit : {$divide: ['$credit', '$currency.rate']},
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
                from        : "journals",
                localField  : "_id",
                foreignField: "_id",
                as          : "journal"
            }
        }, {
            $project: {
                _id    : 1,
                date   : {$arrayElemAt: ["$date", 0]},
                debit  : 1,
                credit : 1,
                journal: {$arrayElemAt: ["$journal", 0]}
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

    this.getAsyncDataForGL = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var account = query._id;
        var startDate = query.startDate;
        var endDate = query.endDate;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        if (!account) {
            return res.status(200).send({journalEntries: []});
        }

        Model.aggregate([{
            $match: {
                date   : {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                account: objectId(account)
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
                _id    : '$date',
                debit  : {$sum: '$debit'},
                credit : {$sum: '$credit'},
                account: {$addToSet: '$account'}
            }
        }, {
            $project: {
                _id    : 1,
                debit  : 1,
                credit : 1,
                account: {$arrayElemAt: ["$account", 0]}
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
        var wTrackModel = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var query = req.query;
        var sourceDocument = query._id;
        var date = query.date;
        var debit;
        var wTrackFinder;
        var resultFinder;

        wTrackFinder = function (waterfallCb) {
            wTrackModel.find({jobs: objectId(sourceDocument)}, {_id: 1}, function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                var newArray = [];

                result.forEach(function (el) {
                    newArray.push(el._id);
                });

                waterfallCb(null, newArray);
            });

        };

        resultFinder = function (sourceDocuments, waterfallCb) {
            debit = function (cb) {
                Model
                    .aggregate([{
                        $match: {
                            "sourceDocument.model": "wTrack",
                            "sourceDocument._id"  : {$in: sourceDocuments},
                            date                  : new Date(date),
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $lookup: {
                            from        : "wTrack",
                            localField  : "sourceDocument._id",
                            foreignField: "_id",
                            as          : "sourceDocument"
                        }
                    }, {
                        $lookup: {
                            from        : "journals",
                            localField  : "journal",
                            foreignField: "_id",
                            as          : "journal"
                        }
                    }, {
                        $project: {
                            date          : 1,
                            debit         : {$divide: ['$debit', '$currency.rate']},
                            sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]},
                            journal       : {$arrayElemAt: ["$journal", 0]}
                        }
                    }, {
                        $project: {
                            date          : 1,
                            debit         : 1,
                            sourceDocument: 1,
                            journal       : 1,
                            journalName   : "$journal.name"
                        }
                    }, {
                        $lookup: {
                            from        : "chartOfAccount",
                            localField  : "journal.debitAccount",
                            foreignField: "_id",
                            as          : "journal.debitAccount"
                        }
                    }, {
                        $lookup: {
                            from        : "chartOfAccount",
                            localField  : "journal.creditAccount",
                            foreignField: "_id",
                            as          : "journal.creditAccount"
                        }
                    }, {
                        $lookup: {
                            from        : "Employees",
                            localField  : "sourceDocument.employee",
                            foreignField: "_id",
                            as          : "employee"
                        }
                    }, {
                        $project: {
                            date                   : 1,
                            debit                  : 1,
                            'journal.creditAccount': {$arrayElemAt: ["$journal.creditAccount", 0]},
                            'journal.debitAccount' : {$arrayElemAt: ["$journal.debitAccount", 0]},
                            employee               : {$arrayElemAt: ["$employee", 0]},
                            journalName            : 1
                        }
                    }, {
                        $project: {
                            date                   : 1,
                            debit                  : 1,
                            'journal.creditAccount': "$journal.creditAccount.name",
                            'journal.debitAccount' : "$journal.debitAccount.name",
                            'journalName'          : 1,
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
                            cb(err);
                        }
                        cb(null, result);
                        //Journal.populate(result, {
                        //    path: 'journal'
                        //}, function (err, result) {
                        //    cb(null, result);
                        //
                        //});
                    });
            };

            /*credit = function (cb) {
             Model
             .aggregate([{
             $match: {
             "sourceDocument.model": "wTrack",
             "sourceDocument._id"  : {$in: sourceDocuments},
             date                  : new Date(date),
             credit                : {$gt: 0}
             }
             }, {
             $lookup: {
             from                   : "wTrack",
             localField             : "sourceDocument._id",
             foreignField: "_id", as: "sourceDocument"
             }
             }, {
             $project: {
             date          : 1,
             credit        : {$divide: ['$credit', '$currency.rate']},
             sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]},
             journal       : 1
             }
             }, {
             $lookup: {
             from                   : "Employees",
             localField             : "sourceDocument.employee",
             foreignField: "_id", as: "employee"
             }
             }, {
             $project: {
             date    : 1,
             credit  : 1,
             journal : 1,
             employee: {$arrayElemAt: ["$employee", 0]}
             }
             }, {
             $project: {
             date    : 1,
             credit  : 1,
             journal : 1,
             employee: {$concat: ['$employee.name.first', ' ', '$employee.name.last']}
             }
             }, {
             $sort: {
             date    : 1,
             employee: 1,
             journal : 1
             }
             }], function (err, result) {
             if (err) {
             cb(err);
             }

             Journal.populate(result, {
             path: 'journal'
             }, function (err, result) {
             cb(null, result);

             });
             });
             };*/

            async.parallel([debit/*, credit*/], function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, result[0]);
            });
        };

        async.waterfall([wTrackFinder, resultFinder], function (err, result) {
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

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        getAssets = function (cb) {
            Model.aggregate([{
                $match: {
                    date   : {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    account: {$in: allAssets.objectID()}
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "account",
                    foreignField: "_id",
                    as          : "account"
                }
            }, {
                $project: {
                    credit : {$divide: ['$credit', '$currency.rate']},
                    debit  : {$divide: ['$debit', '$currency.rate']},
                    account: {$arrayElemAt: ["$account", 0]}
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
                    name  : {$arrayElemAt: ["$name", 0]}
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
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.ACCOUNT_PAYABLE)
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id",
                        as          : "account"
                    }
                }, {
                    $project: {
                        credit : {$divide: ['$credit', '$currency.rate']},
                        debit  : {$divide: ['$debit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
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
                        name  : {$arrayElemAt: ["$name", 0]},
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
            }

            var getOther = function (pcb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: {$in: liabilities}
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id",
                        as          : "account"
                    }
                }, {
                    $project: {
                        credit : {$divide: ['$credit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $project: {
                        _id   : 1,
                        credit: 1,
                        name  : {$arrayElemAt: ["$name", 0]},
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
            }

            parallelTasks = [getAccountPayable, getOther];

            async.parallel(parallelTasks, function (err, result) {
                if (err){
                    return cb(err);
                }

                var newResult = _.union(result[0], result[1]);

                cb(null, newResult);
            });
        };

        getEquities = function (cb) {
            Model.aggregate([{
                $match: {
                    date   : {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    account: {$in: equity}
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "account",
                    foreignField: "_id",
                    as          : "account"
                }
            }, {
                $project: {
                    date   : 1,
                    debit  : {$divide: ['$debit', '$currency.rate']},
                    credit : {$divide: ['$credit', '$currency.rate']},
                    account: {$arrayElemAt: ["$account", 0]}
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
                if (err) {
                    return cb(err);
                }

                var debit = result[0] ? result[0].debit : 0;
                var credit = result[0] ? result[0].credit : 0;

                var balance = debit - credit;
                var name = result[0] ? result[0].name : '300200 Retained Earnings';
                var id = result[0] ? result[0]._id : '56f538c39c85020807b40024';

                if (balance < 0) {
                    debit = debit * (-1);
                    credit = credit * (-1);
                } else if (credit < 0) {
                    credit = credit * (-1);
                }

                cb(null, [{_id: id, name: name, credit: credit, debit: debit, group: 'assets'}]);
            });
        };

        async.parallel([getAssets, getLiabilities, getEquities], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({assets: result[0], liabilities: result[1], equity: result[2]});
        });
    };

    this.getAdminExpenses = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var query = req.query;
        var month = parseInt(query.month, 10);
        var year = parseInt(query.year, 10);
        var startDate = moment().year(year).month(month - 1).startOf('month');
        var endDate = moment(startDate).endOf('month');

        Model.aggregate([{
            $match: {
                date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                "sourceDocument.model": 'dividendInvoice',
                debit                 : {$gt: 0}
            }
        }, {
            $group: {
                _id: null,
                sum: {
                    $sum: {$divide: ['$debit', '$currency.rate']}
                }
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            var newResult = result && result.length ? result[0].sum : 0;

            res.status(200).send({sum: newResult});
        });
    };

    this.getInventoryReport = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var query = req.query;
        var startDate = query.startDate;
        var endDate = query.endDate;
        var findJobs;
        var composeReport;
        var waterfallTasks;
        var sort = {name: 1};
        var count = parseInt(query.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        var page = parseInt(query.page, 10);
        var skip;

        if (query.sort) {
            sort = {};

            for (var sortKey in query.sort) {
                sort[sortKey] = parseInt(query.sort[sortKey]);
            }
        }

        startDate = new Date(moment(new Date(startDate)).startOf('day'));
        endDate = new Date(moment(new Date(endDate)).endOf('day'));

        //count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count; // special case for getting all
        skip = (page - 1) > 0 ? (page - 1) * count : 0;

        findJobs = function (wfCb) {
            JobsModel.find({}, function (err, result) {
                if (err) {
                    return wfCb(err);
                }

                var jobs = [];
                var wTracks = [];

                result.forEach(function (el) {
                    jobs.push(el._id);
                    wTracks.push(el.wTracks);
                });

                wTracks = _.flatten(wTracks);

                wfCb(null, wTracks, jobs);
            });
        };

        composeReport = function (wTracks, jobs, wfCb) {
            var parallelTasks;

            var getOpening = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                : {$lt: startDate},
                        debit               : {$gt: 0},
                        "sourceDocument._id": {$in: wTracks}
                    }
                }, {
                    $lookup: {
                        from        : "wTrack",
                        localField  : "sourceDocument._id",
                        foreignField: "_id",
                        as          : "sourceDocument"
                    }
                }, {
                    $project: {
                        sourceDocument: {$arrayElemAt: ['$sourceDocument', 0]},
                        debit         : 1
                    }
                }, {
                    $group: {
                        _id  : '$sourceDocument.jobs',
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $lookup: {
                        from        : "jobs",
                        localField  : "_id",
                        foreignField: "_id",
                        as          : "_id"
                    }
                }, {
                    $project: {
                        _id  : {$arrayElemAt: ['$_id', 0]},
                        debit: 1
                    }
                }, {
                    $lookup: {
                        from        : "Project",
                        localField  : "_id.project",
                        foreignField: "_id",
                        as          : "project"
                    }
                }, {
                    $project: {
                        _id    : '$_id._id',
                        name   : '$_id.name',
                        project: {$arrayElemAt: ['$project', 0]},
                        debit  : 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            };

            var getInwards = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                : {$lte: endDate, $gte: startDate},
                        debit               : {$gt: 0},
                        "sourceDocument._id": {$in: wTracks}
                    }
                }, {
                    $lookup: {
                        from        : "wTrack",
                        localField  : "sourceDocument._id",
                        foreignField: "_id",
                        as          : "sourceDocument"
                    }
                }, {
                    $project: {
                        sourceDocument: {$arrayElemAt: ['$sourceDocument', 0]},
                        debit         : 1
                    }
                }, {
                    $group: {
                        _id  : '$sourceDocument.jobs',
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $lookup: {
                        from        : "jobs",
                        localField  : "_id",
                        foreignField: "_id", as: "_id"
                    }
                }, {
                    $project: {
                        _id  : {$arrayElemAt: ['$_id', 0]},
                        debit: 1
                    }
                }, {
                    $lookup: {
                        from        : "Project",
                        localField  : "_id.project",
                        foreignField: "_id",
                        as          : "project"
                    }
                }, {
                    $project: {
                        _id    : '$_id._id',
                        name   : '$_id.name',
                        project: {$arrayElemAt: ['$project', 0]},
                        debit  : 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            };

            var getOutwards = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                : {$lte: endDate/*, $gte: startDate*/},
                        debit               : {$gt: 0},
                        "sourceDocument._id": {$in: jobs},
                        journal             : objectId(CONSTANTS.CLOSED_JOB)/*objectId(CONSTANTS.FINISHED_JOB_JOURNAL)*/
                    }
                }, {
                    $lookup: {
                        from        : "jobs",
                        localField  : "sourceDocument._id",
                        foreignField: "_id",
                        as          : "sourceDocument"
                    }
                }, {
                    $project: {
                        sourceDocument: {$arrayElemAt: ['$sourceDocument', 0]},
                        debit         : 1,
                        date          : 1
                    }
                }, {
                    $project: {
                        _id  : '$sourceDocument._id',
                        name : '$sourceDocument.name',
                        debit: 1,
                        date : 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            };

            parallelTasks = [getOpening, getInwards, getOutwards];

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return wfCb(err);
                }

                var resultArray = [];
                var sortField = Object.keys(sort)[0];

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
                    newElement.name = opening ? opening.name : (inwards ? inwards.name : '');

                    project = opening ? opening.project : (inwards ? inwards.project : {});

                    newElement.project = project._id;
                    newElement.projectName = project.projectName;

                    newElement.openingBalance = opening ? opening.debit / 100 : 0;
                    newElement.inwards = inwards ? inwards.debit / 100 : 0;
                    newElement.outwards = outwards ? outwards.debit / 100 : 0;
                    newElement.closingBalance = newElement.openingBalance + newElement.inwards - newElement.outwards;

                    if (newElement.name && !(outwards && outwards.date < startDate)) {
                        resultArray.push(newElement);
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
                        } else {
                            return compareField(b, a);
                        }
                    });
                }

                resultArray = resultArray.slice(skip, skip + count); // need refactor on aggregate function

                wfCb(null, resultArray);
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

    this.totalCollectionInventory = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var query = req.query;
        var findJobs;
        var composeReport;
        var waterfallTasks;
        var sort = {name: 1};
        var startDate = query.filter.startDate.value;
        var endDate = query.filter.endDate.value;
        var count = parseInt(query.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        var page = parseInt(query.page, 10);
        var skip;

        startDate = new Date(moment(new Date(startDate)).startOf('day'));
        endDate = new Date(moment(new Date(endDate)).endOf('day'));

        findJobs = function (wfCb) {
            JobsModel.find({}, function (err, result) {
                if (err) {
                    return wfCb(err);
                }

                var jobs = [];
                var wTracks = [];

                result.forEach(function (el) {
                    jobs.push(el._id);
                    wTracks.push(el.wTracks);
                });

                wTracks = _.flatten(wTracks);

                wfCb(null, wTracks, jobs);
            });
        };

        composeReport = function (wTracks, jobs, wfCb) {
            var parallelTasks;

            var getOpening = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                : {$lt: startDate},
                        debit               : {$gt: 0},
                        "sourceDocument._id": {$in: wTracks}
                    }
                }, {
                    $lookup: {
                        from        : "wTrack",
                        localField  : "sourceDocument._id",
                        foreignField: "_id", as: "sourceDocument"
                    }
                }, {
                    $project: {
                        sourceDocument: {$arrayElemAt: ['$sourceDocument', 0]},
                        debit         : 1
                    }
                }, {
                    $group: {
                        _id  : '$sourceDocument.jobs',
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $lookup: {
                        from        : "jobs",
                        localField  : "_id",
                        foreignField: "_id", as: "_id"
                    }
                }, {
                    $project: {
                        _id  : {$arrayElemAt: ['$_id', 0]},
                        debit: 1
                    }
                }, {
                    $project: {
                        _id  : '$_id._id',
                        name : '$_id.name',
                        debit: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            };

            var getInwards = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                : {$lte: endDate, $gte: startDate},
                        debit               : {$gt: 0},
                        "sourceDocument._id": {$in: wTracks}
                    }
                }, {
                    $lookup: {
                        from        : "wTrack",
                        localField  : "sourceDocument._id",
                        foreignField: "_id", as: "sourceDocument"
                    }
                }, {
                    $project: {
                        sourceDocument: {$arrayElemAt: ['$sourceDocument', 0]},
                        debit         : 1
                    }
                }, {
                    $group: {
                        _id  : '$sourceDocument.jobs',
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $lookup: {
                        from        : "jobs",
                        localField  : "_id",
                        foreignField: "_id", as: "_id"
                    }
                }, {
                    $project: {
                        _id  : {$arrayElemAt: ['$_id', 0]},
                        debit: 1
                    }
                }, {
                    $project: {
                        _id  : '$_id._id',
                        name : '$_id.name',
                        debit: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            };

            var getOutwards = function (pCb) {
                Model.aggregate([{
                    $match: {
                        date                : {$lte: endDate/*, $gte: startDate*/},
                        debit               : {$gt: 0},
                        "sourceDocument._id": {$in: jobs},
                        journal             : objectId(CONSTANTS.FINISHED_JOB_JOURNAL)
                    }
                }, {
                    $lookup: {
                        from        : "jobs",
                        localField  : "sourceDocument._id",
                        foreignField: "_id", as: "sourceDocument"
                    }
                }, {
                    $project: {
                        sourceDocument: {$arrayElemAt: ['$sourceDocument', 0]},
                        debit         : 1,
                        date          : 1
                    }
                }, {
                    $project: {
                        _id  : '$sourceDocument._id',
                        name : '$sourceDocument.name',
                        debit: 1,
                        date : 1
                    }
                }], function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            };

            parallelTasks = [getOpening, getInwards, getOutwards];

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return wfCb(err);
                }

                var resultArray = [];

                jobs.forEach(function (job) {
                    var newElement = {};

                    var opening = _.find(result[0], function (el) {
                        return el._id.toString() === job.toString()
                    });
                    var inwards = _.find(result[1], function (el) {
                        return el._id.toString() === job.toString()
                    });
                    var outwards = _.find(result[2], function (el) {
                        return el._id.toString() === job.toString()
                    });

                    newElement._id = job;
                    newElement.name = opening ? opening.name : (inwards ? inwards.name : '');

                    newElement.openingBalance = opening ? opening.debit / 100 : 0;
                    newElement.inwards = inwards ? inwards.debit / 100 : 0;
                    newElement.outwards = outwards ? outwards.debit / 100 : 0;
                    newElement.closingBalance = newElement.openingBalance + newElement.inwards - newElement.outwards;

                    if (newElement.name && !(outwards && outwards.date < startDate)) {
                        resultArray.push(newElement);
                    }

                });

                wfCb(null, resultArray);
            });
        };

        waterfallTasks = [findJobs, composeReport];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result.length});
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
                            date   : {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            },
                            account: objectId(CONSTANTS.PRODUCT_SALES)
                        }
                    }, {
                        $lookup: {
                            from        : "chartOfAccount",
                            localField  : "account",
                            foreignField: "_id", as: "account"
                        }
                    }, {
                        $project: {
                            date   : 1,
                            debit  : {$divide: ['$debit', '$currency.rate']},
                            credit : {$divide: ['$credit', '$currency.rate']},
                            account: {$arrayElemAt: ["$account", 0]}
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
                            date   : {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            },
                            account: objectId(CONSTANTS.COGS)
                        }
                    }, {
                        $lookup: {
                            from        : "chartOfAccount",
                            localField  : "account",
                            foreignField: "_id", as: "account"
                        }
                    }, {
                        $project: {
                            date   : 1,
                            debit  : {$divide: ['$debit', '$currency.rate']},
                            credit : {$divide: ['$credit', '$currency.rate']},
                            account: {$arrayElemAt: ["$account", 0]}
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
                    if (err) {
                        return cb(err);
                    }

                    var grossProfit = result[0] && result[0][0] ? result[0][0].credit : 0;
                    var expenses = result[1] && result[1][0] ? result[1][0].debit : 0;

                    var EBIT = grossProfit - expenses;

                    cb(null, [{name: 'Operating Income (EBIT)', debit: EBIT}]);
                });
            };

            var getAR = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.ACCOUNT_RECEIVABLE)
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id", as: "account"
                    }
                }, {
                    $project: {
                        date   : 1,
                        debit  : {$divide: ['$debit', '$currency.rate']},
                        credit : {$divide: ['$credit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
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
                        return cb(err);
                    }

                    var sum = result[0] ? result[0].debit - result[0].credit : 0;

                    sum = sum * (-1);

                    var fieldName = result[0] ? result[0].name[0] : "Account receivable";

                    cb(null, [{name: fieldName, debit: sum}]);
                });
            };

            var getCurrentLiabilities = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.CURRENT_LIABILITIES)
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id", as: "account"
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : {$divide: ['$credit', '$currency.rate']},
                        debit  : {$divide: ['$debit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
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
                    if (err) {
                        return cb(err);
                    }

                    var sum = result[0] ? result[0].debit - result[0].credit : 0;

                    var sp = 0 - sum;

                    if (sp < 0) {
                        sp = sp * (-1);
                    }

                    var fieldName = result[0] ? result[0].name[0] : 'Current Liabilities';

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            var getSalaryPayable = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.SALARY_PAYABLE_ACCOUNT)
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id", as: "account"
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : {$divide: ['$credit', '$currency.rate']},
                        debit  : {$divide: ['$debit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
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
                    if (err) {
                        return cb(err);
                    }

                    var sum = result[0] ? result[0].debit - result[0].credit : 0;

                    var sp = 0 - sum;

                    if (sp < 0) {
                        sp = sp * (-1);
                    }

                    var fieldName = result[0] ? result[0].name[0] : 'Salary Payable';

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            var getSalaryOvertimePayable = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.SALARY_OVERTIME_ACCOUNT)
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id", as: "account"
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : {$divide: ['$credit', '$currency.rate']},
                        debit  : {$divide: ['$debit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
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
                    if (err) {
                        return cb(err);
                    }

                    var sum = result[0] ? result[0].debit - result[0].credit : 0;

                    var sp = 0 - sum;

                    if (sp < 0) {
                        sp = sp * (-1);
                    }

                    var fieldName = result[0] ? result[0].name[0] : 'Salary Overtime Payable';

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            var getWIP = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.WORK_IN_PROCESS)
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id", as: "account"
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : {$divide: ['$credit', '$currency.rate']},
                        debit  : {$divide: ['$debit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
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

                    var sum = result[0] ? result[0].debit - result[0].credit : 0;

                    sum = sum * (-1);

                    var fieldName = result[0] ? result[0].name[0] : 'Work in process';

                    cb(null, [{name: fieldName, debit: sum}]);
                });
            };

            var getCOGS = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.FINISHED_GOODS)
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id", as: "account"
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : {$divide: ['$credit', '$currency.rate']},
                        debit  : {$divide: ['$debit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
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

                    var sum = result[0] ? result[0].debit - result[0].credit : 0;

                    var sp = Math.abs(0 - sum);

                    var fieldName = result[0] ? result[0].name[0] : "Finished goods";

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            var getAccountPayable = function (cb) {
                Model.aggregate([{
                    $match: {
                        date   : {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                        account: objectId(CONSTANTS.ACCOUNT_PAYABLE)
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "account",
                        foreignField: "_id", as: "account"
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : {$divide: ['$credit', '$currency.rate']},
                        debit  : {$divide: ['$debit', '$currency.rate']},
                        account: {$arrayElemAt: ["$account", 0]}
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
                        return pcb(err);
                    }

                    var sum = result[0] ? result[0].debit - result[0].credit : 0;

                    var sp = 0 - sum;

                    if (sp < 0) {
                        sp = sp * (-1);
                    }

                    var fieldName = result[0] ? result[0].name[0] : 'Account Payable';

                    cb(null, [{name: fieldName, debit: sp}]);
                });
            };

            async.parallel([getEBIT, getAR, getCOGS, getWIP, getSalaryPayable, getSalaryOvertimePayable, getCurrentLiabilities, getAccountPayable], function (err, result) {
                if (err) {
                    return cb(err);
                }

                var result = _.union(result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7]);

                cb(null, result);
            });
        };

        getInvesting = function (cb) {
            Model.aggregate([{
                $match: {
                    date   : {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    account: {$in: CONSTANTS.INVESTING.objectID()}
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "account",
                    foreignField: "_id", as: "account"
                }
            }, {
                $project: {
                    date   : 1,
                    credit : {$divide: ['$credit', '$currency.rate']},
                    debit  : {$divide: ['$debit', '$currency.rate']},
                    account: {$arrayElemAt: ["$account", 0]}
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
                    date   : {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    account: {$in: CONSTANTS.FINANCING.objectID()}
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "account",
                    foreignField: "_id", as: "account"
                }
            }, {
                $project: {
                    date   : 1,
                    credit : {$divide: ['$credit', '$currency.rate']},
                    debit  : {$divide: ['$debit', '$currency.rate']},
                    account: {$arrayElemAt: ["$account", 0]}
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

                var sum = result[0] ? result[0].credit : 0;

                var sp = 0 - sum;

                var fieldName = result[0] ? result[0].name[0] : '777777 Dividends Payable';

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
                    date   : {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    account: objectId(CONSTANTS.PRODUCT_SALES),
                    credit : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "account",
                    foreignField: "_id", as: "account"
                }
            }, {
                $project: {
                    date   : 1,
                    credit : {$divide: ['$credit', '$currency.rate']},
                    account: {$arrayElemAt: ["$account", 0]}
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
                    name : {$arrayElemAt: ["$name", 0]}
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
                    date   : {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    account: objectId(CONSTANTS.COGS),
                    debit  : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "account",
                    foreignField: "_id", as: "account"
                }
            }, {
                $project: {
                    date   : 1,
                    debit  : {$divide: ['$debit', '$currency.rate']},
                    account: {$arrayElemAt: ["$account", 0]}
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
                    name : {$arrayElemAt: ["$name", 0]}
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
                    date   : {
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
                if (err) {
                    return cb(err);
                }

                var dividends = result && result.length ? result[0].debit : 0;

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
                from        : "chartOfAccount",
                localField  : "account",
                foreignField: "_id",
                as          : "account"
            }
        }, {
            $project: {
                date   : 1,
                debit  : {$divide: ['$debit', '$currency.rate']},
                credit : {$divide: ['$credit', '$currency.rate']},
                account: {$arrayElemAt: ["$account", 0]}
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
                name  : {$arrayElemAt: ["$name", 0]}
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
                    'sourceDocument.model': "Employees",
                    'sourceDocument._id'  : objectId(sourceDocument),
                    date                  : {
                        $gte: new Date(date),
                        $lte: new Date(endDate)
                    },
                    debit                 : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "sourceDocument._id",
                    foreignField: "_id",
                    as          : "employee"
                }
            }, {
                $lookup: {
                    from        : "journals",
                    localField  : "journal",
                    foreignField: "_id",
                    as          : "journal"
                }
            }, {
                $project: {
                    date          : 1,
                    currency      : 1,
                    debit         : {$divide: ['$debit', '$currency.rate']},
                    credit        : {$divide: ['$credit', '$currency.rate']},
                    sourceDocument: {$arrayElemAt: ["$employee", 0]},
                    journal       : {$arrayElemAt: ["$journal", 0]}
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "journal.debitAccount",
                    foreignField: "_id",
                    as          : "journal.debitAccount"
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "journal.creditAccount",
                    foreignField: "_id",
                    as          : "journal.creditAccount"
                }
            }, {
                $project: {
                    date                   : 1,
                    debit                  : {$divide: ['$debit', 100]},
                    credit                 : {$divide: ['$credit', 100]},
                    'journal.creditAccount': {$arrayElemAt: ["$journal.creditAccount", 0]},
                    'journal.debitAccount' : {$arrayElemAt: ["$journal.debitAccount", 0]},
                    employee               : {$concat: ['$sourceDocument.name.first', ' ', '$sourceDocument.name.last']},
                    journalName            : '$journal.name'
                }
            }, {
                $sort: {'date': 1}
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
                    'sourceDocument.model': "wTrack",
                    journal               : {$in: journalArray},
                    date                  : {
                        $gte: new Date(date),
                        $lte: new Date(endDate)
                    },
                    credit                : {$gt: 0}
                }
            }, {
                $lookup: {
                    from        : "wTrack",
                    localField  : "sourceDocument._id",
                    foreignField: "_id",
                    as          : "sourceDocument"
                }
            }, {
                $lookup: {
                    from        : "journals",
                    localField  : "journal",
                    foreignField: "_id",
                    as          : "journal"
                }
            }, {
                $project: {
                    date          : 1,
                    currency      : 1,
                    debit         : {$divide: ['$debit', '$currency.rate']},
                    credit        : {$divide: ['$credit', '$currency.rate']},
                    sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]},
                    journal       : {$arrayElemAt: ["$journal", 0]}
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "journal.debitAccount",
                    foreignField: "_id",
                    as          : "journal.debitAccount"
                }
            }, {
                $lookup: {
                    from        : "chartOfAccount",
                    localField  : "journal.creditAccount",
                    foreignField: "_id",
                    as          : "journal.creditAccount"
                }
            }, {
                $project: {
                    debit                  : {$divide: ['$debit', 100]},
                    credit                 : {$divide: ['$credit', 100]},
                    'journal.creditAccount': {$arrayElemAt: ["$journal.creditAccount", 0]},
                    'journal.debitAccount' : {$arrayElemAt: ["$journal.debitAccount", 0]},
                    journalName            : '$journal.name',
                    wTrack                 : "$sourceDocument",
                    date                   : 1
                }
            }, {
                $project: {
                    debit      : '$debit',
                    credit     : '$credit',
                    journal    : 1,
                    journalName: 1,
                    employee   : '$wTrack.employee',
                    date       : 1
                }
            }, {
                $match: {
                    employee: objectId(sourceDocument)
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "employee",
                    foreignField: "_id",
                    as          : "employee"
                }
            }, {
                $project: {
                    date                   : 1,
                    debit                  : 1,
                    credit                 : 1,
                    'journal.creditAccount': 1,
                    'journal.debitAccount' : 1,
                    employee               : {$arrayElemAt: ["$employee", 0]},
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
                $sort: {'date': 1}
            }], function (err, result) {
                if (err) {
                    return pcb(err);
                }

                pcb(null, result);
            });
        }

        async.parallel([matchByWTrack, matchEmployee], function (err, result) {
            if (err) {
                return next(err);
            }

            var empIds = result[0];
            var empIdsSecond = result[1];

            res.status(200).send({data: _.union(empIds, empIdsSecond)});
        });
    };

    this.getForReport = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var wTrackModel = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Journal = models.get(req.session.lastDb, 'journal', journalSchema);
        var query = req.query;
        var sourceDocument = query._id;
        var debit;
        var wTrackFinder;
        var resultFinder;

        wTrackFinder = function (waterfallCb) {
            wTrackModel.find({jobs: objectId(sourceDocument)}, {_id: 1}, function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                var newArray = [];

                result.forEach(function (el) {
                    newArray.push(el._id);
                });

                waterfallCb(null, newArray);
            });

        };

        resultFinder = function (sourceDocuments, waterfallCb) {
            debit = function (cb) {
                Model
                    .aggregate([{
                        $match: {
                            "sourceDocument.model": "wTrack",
                            "sourceDocument._id"  : {$in: sourceDocuments},
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $project: {
                            date : 1,
                            debit: {$divide: ['$debit', '$currency.rate']}
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
                            cb(err);
                        }

                        Journal.populate(result, {
                            path: 'journal'
                        }, function (err, result) {
                            cb(null, result);

                        });
                    });
            };

            /*credit = function (cb) {
             Model
             .aggregate([{
             $match: {
             "sourceDocument.model": "wTrack",
             "sourceDocument._id"  : {$in: sourceDocuments},
             credit                : {$gt: 0}
             }
             }, {
             $lookup: {
             from                   : "wTrack",
             localField             : "sourceDocument._id",
             foreignField: "_id", as: "sourceDocument"
             }
             }, {
             $project: {
             date          : 1,
             credit        : {$divide: ['$credit', '$currency.rate']},
             sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]},
             journal       : 1
             }
             }, {
             $lookup: {
             from                   : "Employees",
             localField             : "sourceDocument.employee",
             foreignField: "_id", as: "employee"
             }
             }, {
             $project: {
             date    : 1,
             credit  : 1,
             journal : 1,
             employee: {$arrayElemAt: ["$employee", 0]}
             }
             }, {
             $project: {
             date    : 1,
             credit  : 1,
             journal : 1,
             employee: {$concat: ['$employee.name.first', ' ', '$employee.name.last']}
             }
             }, {
             $sort: {
             date    : 1,
             employee: 1,
             journal : 1
             }
             }, {
             $group: {
             _id     : '$date',
             //entries: {$push: '$$ROOT'},
             totalSum: {$sum: '$credit'}
             }
             }], function (err, result) {
             if (err) {
             cb(err);
             }

             Journal.populate(result, {
             path: 'journal'
             }, function (err, result) {
             cb(null, result);

             });
             });
             };*/

            async.parallel([debit/*, credit*/], function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, {wagesPayable: result[0]/* || [], jobInProgress: result[1] || []*/});
            });
        };

        async.waterfall([wTrackFinder, resultFinder], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });

    };

    /*this.create = function (body, dbIndex, cb, uId) {
     var Journal = models.get(dbIndex, 'journal', journalSchema);
     var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
     var Currency = models.get(dbIndex, 'currency', CurrencySchema);
     var journalId = body.journal;
     var now = moment();
     var date = body.date ? moment(body.date) : now;
     //var currency = {
     //    name: body.currency
     //};
     var currency;
     var amount = body.amount;
     var rates;

     var waterfallTasks = [currencyNameFinder, journalFinder, journalEntrySave];

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

     };

     function journalEntrySave(journal, waterfallCb) {
     oxr.historical(date, function () {
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
     date: new Date()
     };

     debitObject.createdBy = {
     user: uId,
     date: new Date()
     };

     journalEntry = new Model(debitObject);
     journalEntry.save(parallelCb);
     },
     creditSaver: function (parallelCb) {
     var journalEntry;

     creditObject.credit = amount;
     creditObject.account = journal.creditAccount;

     creditObject.editedBy = {
     user: uId,
     date: new Date()
     };

     creditObject.createdBy = {
     user: uId,
     date: new Date()
     };

     journalEntry = new Model(creditObject);
     journalEntry.save(parallelCb);
     }
     };

     if (!journal || !journal._id) {
     err = new Error('Invalid Journal');
     err.status = 400;

     return waterfallCb(err);
     }

     rates = oxr.rates;
     currency.rate = rates[currency.name];

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
     });
     };

     async.waterfall(waterfallTasks, function (err, response) {
     if (err) {
     return cb(err);
     }

     cb(null, response);
     });
     };*/

    function caseFilterForTotalCount(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;
        var filterName;

        for (filterName in filter) {
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
    }

    this.getForView = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var data = req.query;
        var sort = data.sort;
        var findInvoice;
        var findSalary;
        var findByEmployee;
        var count = parseInt(data.count, 10) / 2 || 50;
        var page = parseInt(data.page, 10);
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;
        var filter = data.filter;
        var filterObj = {};
        var key;
        var startDate = data.startDate;
        var endDate = data.endDate;
        var findJobsFinished;
        var findPayments;
        var findSalaryPayments;

        startDate = moment(new Date(startDate)).startOf('day');
        endDate = moment(new Date(endDate)).endOf('day');

        var matchObject = {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (sort) {
            key = Object.keys(data.sort)[0].toString();
            data.sort[key] = parseInt(data.sort[key], 10);
            sort = data.sort;
        } else {
            sort = {date: 1, 'journal.name': 1};
        }

        if (filter) {
            var filterArray = caseFilter(filter);

            if (filterArray.length) {
                filterObj.$and = filterArray
            }
        }

        access.getReadAccess(req, req.session.uId, 86, function (access) {
            if (access) {
                findInvoice = function (cb) {
                    Model
                        .aggregate([{
                            $match: matchObject
                        }, {
                            $match: {
                                "sourceDocument.model": {$in: ["Invoice", "proforma", "dividendInvoice"]},
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "account",
                                foreignField: "_id",
                                as          : "account"
                            }
                        }, {
                            $lookup: {
                                from        : "Invoice",
                                localField  : "sourceDocument._id",
                                foreignField: "_id",
                                as          : "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from        : "journals",
                                localField  : "journal",
                                foreignField: "_id",
                                as          : "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.debitAccount",
                                foreignField: "_id",
                                as          : "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.creditAccount",
                                foreignField: "_id",
                                as          : "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "Customers",
                                localField  : "sourceDocument._id.supplier",
                                foreignField: "_id",
                                as          : "sourceDocument.subject"
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                currency                : 1,
                                'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'journal.name'          : 1,
                                date                    : 1,
                                'sourceDocument._id'    : 1,
                                'sourceDocument.name'   : '$sourceDocument._id.name',
                                'sourceDocument.model'  : 1,
                                'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument.subject", 0]},
                                account                 : 1
                            }
                        }, {
                            $match: filterObj
                        }, {
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
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
                                "sourceDocument.model": "wTrack",
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "account",
                                foreignField: "_id",
                                as          : "account"
                            }
                        }, {
                            $lookup: {
                                from        : "wTrack",
                                localField  : "sourceDocument._id",
                                foreignField: "_id",
                                as          : "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from        : "journals",
                                localField  : "journal",
                                foreignField: "_id",
                                as          : "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from        : "jobs",
                                localField  : "sourceDocument._id.jobs",
                                foreignField: "_id",
                                as          : "sourceDocument._id.jobs"
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.debitAccount",
                                foreignField: "_id",
                                as          : "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.creditAccount",
                                foreignField: "_id",
                                as          : "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "Employees",
                                localField  : "sourceDocument._id.employee",
                                foreignField: "_id",
                                as          : "sourceDocument._id.employee"
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                currency                : 1,
                                'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'journal.name'          : 1,
                                date                    : 1,
                                'sourceDocument._id'    : 1,
                                'sourceDocument.model'  : 1,
                                'sourceDocument.jobs'   : {$arrayElemAt: ["$sourceDocument._id.jobs", 0]},
                                'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument._id.employee", 0]},
                                'sourceDocument.name'   : '$sourceDocument._id.jobs.name',
                                account                 : 1
                            }
                        }, {
                            $match: filterObj
                        }, {
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
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
                                "sourceDocument.model": "Employees",
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "account",
                                foreignField: "_id",
                                as          : "account"
                            }
                        }, {
                            $lookup: {
                                from        : "Employees",
                                localField  : "sourceDocument._id",
                                foreignField: "_id",
                                as          : "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from        : "journals",
                                localField  : "journal",
                                foreignField: "_id",
                                as          : "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.debitAccount",
                                foreignField: "_id",
                                as          : "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.creditAccount",
                                foreignField: "_id",
                                as          : "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "Department",
                                localField  : "sourceDocument._id.department",
                                foreignField: "_id",
                                as          : "sourceDocument._id.department"
                            }
                        }, {
                            $project: {
                                debit                          : 1,
                                currency                       : 1,
                                'journal.debitAccount'         : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount'        : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'sourceDocument._id.department': {$arrayElemAt: ["$sourceDocument._id.department", 0]},
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
                                'sourceDocument.name'          : '$sourceDocument._id.department.departmentName',
                                account                        : 1
                            }
                        }, {
                            $match: filterObj
                        }, {
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
                        }]);

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
                                "sourceDocument.model": "jobs",
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "account",
                                foreignField: "_id",
                                as          : "account"
                            }
                        }, {
                            $lookup: {
                                from        : "jobs",
                                localField  : "sourceDocument._id",
                                foreignField: "_id",
                                as          : "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from        : "journals",
                                localField  : "journal",
                                foreignField: "_id",
                                as          : "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.debitAccount",
                                foreignField: "_id",
                                as          : "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.creditAccount",
                                foreignField: "_id",
                                as          : "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "Invoice",
                                localField  : "sourceDocument._id.invoice",
                                foreignField: "_id",
                                as          : "sourceDocument._id.invoice"
                            }
                        }, {
                            $project: {
                                debit                       : 1,
                                currency                    : 1,
                                'journal.debitAccount'      : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount'     : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'sourceDocument._id.invoice': {$arrayElemAt: ["$sourceDocument._id.invoice", 0]},
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
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
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
                                "sourceDocument.model": "Payment",
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "account",
                                foreignField: "_id",
                                as          : "account"
                            }
                        }, {
                            $lookup: {
                                from        : "Payment",
                                localField  : "sourceDocument._id",
                                foreignField: "_id",
                                as          : "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from        : "journals",
                                localField  : "journal",
                                foreignField: "_id",
                                as          : "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.debitAccount",
                                foreignField: "_id",
                                as          : "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.creditAccount",
                                foreignField: "_id",
                                as          : "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "Customers",
                                localField  : "sourceDocument._id.supplier",
                                foreignField: "_id",
                                as          : "sourceDocument._id.supplier"
                            }
                        }, {
                            $project: {
                                debit                        : 1,
                                currency                     : 1,
                                'journal.debitAccount'       : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount'      : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'sourceDocument._id.supplier': {$arrayElemAt: ["$sourceDocument._id.supplier", 0]},
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
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
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
                                "sourceDocument.model": "salaryPayment",
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "account",
                                foreignField: "_id",
                                as          : "account"
                            }
                        }, {
                            $lookup: {
                                from        : "Employees",
                                localField  : "sourceDocument._id",
                                foreignField: "_id",
                                as          : "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from        : "journals",
                                localField  : "journal",
                                foreignField: "_id",
                                as          : "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.debitAccount",
                                foreignField: "_id",
                                as          : "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "chartOfAccount",
                                localField  : "journal.creditAccount",
                                foreignField: "_id",
                                as          : "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from        : "Department",
                                localField  : "sourceDocument._id.department",
                                foreignField: "_id",
                                as          : "sourceDocument._id.department"
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                currency                : 1,
                                'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'journal.name'          : 1,
                                date                    : 1,
                                'sourceDocument.model'  : 1,
                                'sourceDocument.subject': '$sourceDocument._id',
                                'sourceDocument.name'   : {$arrayElemAt: ["$sourceDocument._id.department", 0]},
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
                                'sourceDocument.name'   : '$sourceDocument.name.departmentName',
                                account                 : 1
                            }
                        }, {
                            $match: filterObj
                        }, {
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
                        }]);

                    query.options = {allowDiskUse: true};

                    query.exec(function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, result);
                    });
                };

                var parallelTasks = [findInvoice, findSalary, findByEmployee, findJobsFinished, findPayments, findSalaryPayments];

                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    var invoices = result[0];
                    var salary = result[1];
                    var salaryEmployee = result[2];
                    var jobsResult = result[3];
                    var paymentsResult = result[4];
                    var salaryPaymentResult = result[5];
                    var models = _.union(invoices, salary, salaryEmployee, jobsResult, paymentsResult, salaryPaymentResult);

                    res.status(200).send(models);
                });
            } else {
                res.status(403).send();
            }
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
