var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');
var CONSTANTS = require('../constants/mainConstants');
var oxr = require('open-exchange-rates');
var fx = require('money');
var moment = require('../public/js/libs/moment/moment');
var objectId = mongoose.Types.ObjectId;
var fs = require('fs');

var WriteOffObj = function (models, event) {
    'use strict';

    var async = require('async');

    var WriteOffSchema = mongoose.Schemas.writeOff;
    var ProformaSchema = mongoose.Schemas.Proforma;
    var OrderSchema = mongoose.Schemas.Quotation;
    var InvoiceSchema = mongoose.Schemas.wTrackInvoice;
    var JobsSchema = mongoose.Schemas.jobs;

    var workflowHandler = new WorkflowHandler(models);
    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models, event);
    var _ = require('../node_modules/underscore');
    var ratesService = require('../services/rates')(models);
    var ratesRetriever = require('../helpers/ratesRetriever')();

    this.create = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var WriteOff = models.get(dbIndex, 'writeOff', WriteOffSchema);
        var JobsModel = models.get(dbIndex, 'jobs', JobsSchema);
        var request;
        var date = moment().format('YYYY-MM-DD');
        var data = req.body;
        var products = data.products;
        var parallelTasks;
        var waterFallTasks;
        var jobs = products.map(function (elem) {
            return elem.jobs;
        });
        jobs = jobs.objectID();

        function getRates(callback) {
            ratesService.getById({id: date, dbName: req.session.lastDb}, function (err, result) {

                fx.rates = result && result.rates ? result.rates : {};
                fx.base = result && result.base ? result.base : 'USD';

                callback();
            });
        }

        function getJobCosts(parallelTasks, callback) {

            JobsModel
                .aggregate([{
                    $match: {
                        _id: {$in: jobs}
                    }
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
                                    $and: [{$eq: ['$$je.credit', 0]}, {
                                        $or: [{
                                            $eq: ['$$je.journal', objectId('56cc727e541812c07197356c')]
                                        }, {
                                            $eq: ['$$je.journal', objectId('56cc734b541812c071973572')]
                                        }, {
                                            $eq: ['$$je.journal', objectId('56cc7383541812c071973574')]
                                        }]
                                    }]

                                }
                            }
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$journalentries',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id      : null,
                        costTotal: {$sum: '$journalentries.debit'},
                        jobs     : {
                            $addToSet: {
                                _id : '$_id',
                                cost: {$sum: '$journalentries.debit'}
                            }
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    callback(null, result[0]);
                });
        };

        function fetchFirstWorkflow(callback) {
            request = {
                query: {
                    wId: 'Sales Invoice'
                },

                session: req.session
            };
            workflowHandler.getFirstForConvert(request, callback);
        }

        function parallel(callback) {
            async.parallel(parallelTasks, callback);
        }

        function createWriteOff(jobCosts, callback) {
            var writeOff;
            var saveObject;

            data.products.forEach(function (elem) {
                jobCosts.jobs.forEach(function (job) {
                    if (elem.jobs === job._id.toJSON()) {
                        elem.unitPrice = job.cost;
                        elem.subTotal = job.cost;
                    }
                });

            });

            saveObject = {
                currency: {
                    _id: CONSTANTS.CURRENCY_USD
                },

                dueDate    : data.dueDate,
                forSales   : data.forSales,
                groups     : data.groups,
                invoiceDate: data.invoiceDate,
                project    : data.project,
                paymentInfo: {
                    total  : jobCosts.costTotal,
                    balance: 0,
                    unTaxed: jobCosts.costTotal
                },

                products: data.products,
                whoCanRW: data.whoCanRW,
                journal : data.journal
            };

            if (req.session.uId) {

                saveObject.createdBy = {
                    user: req.session.uId
                };

                saveObject.editedBy = {
                    user: req.session.uId
                };
            }

            saveObject.paymentInfo.balance = 0;

            saveObject.currency.rate = 1;

            writeOff = new WriteOff(saveObject);

            writeOff.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                JobsModel.update({_id: {$in: jobs}}, {
                    $set: {invoice: result._id}

                }, {multi: true}, function (err) {
                    if (err) {
                        callback(err);
                    }
                    callback(null, result);
                });

            });
        }

        function createJournalEntry(writeOff, callback) {
            var body = {
                currency      : writeOff.currency,
                journal       : data.journal,
                sourceDocument: {
                    model: 'writeOff',
                    _id  : writeOff._id,
                    name : writeOff.name
                },

                amount: 0,
                date  : writeOff.invoiceDate
            };

            var amount = writeOff.paymentInfo.total;

            body.amount = amount;

            _journalEntryHandler.createReconciled(body, {dbName: req.session.lastDb, uId: req.session.uId});

            callback(null, writeOff);
        }

        function updateJobs(writeOff, callback) {
            var products = data.products;
            var project;

            if (products) {
                async.each(products, function (result, cb) {
                    var jobs = objectId(result.jobs);
                    var editedBy = {
                        user: req.session.uId,
                        date: new Date()
                    };
                    JobsModel.findByIdAndUpdate(jobs, {
                        type    : 'WriteOff',
                        workflow: CONSTANTS.JOBSFINISHED,
                        editedBy: editedBy
                    }, {new: true}, function (err, job) {
                        if (err) {
                            return cb(err);
                        }
                        project = job.project || null;

                        _journalEntryHandler.createCostsForJob({
                            req     : req,
                            jobId   : jobs,
                            workflow: CONSTANTS.JOBSFINISHED,
                            callback: cb
                        });

                    });

                }, function () {

                    callback(null, writeOff);
                });
            }
        }

        /* function removeDocsByJob(writeOff, callback) {
         var products = writeOff.products;
         var project;
         var jobsForUpdate = [];
         var Invoice = models.get(dbIndex, 'wTrackInvoice', InvoiceSchema);
         var Order = models.get(dbIndex, 'Quotation', OrderSchema);
         var Proforma = models.get(dbIndex, 'Proforma', ProformaSchema);

         if (products) {
         async.each(products, function (result, cb) {
         var jobs = result.jobs;
         var parallelTasks;

         var editedBy = {
         user: req.session.uId,
         date: new Date()
         };

         function removeInvoices(parallelCb) {
         Invoice.find({'products.jobs': jobs, _type : {$ne : 'writeOff'}}, function (err, results) {
         if (err) {
         parallelCb(err);
         }
         async.each(results, function (file, eachCb) {
         if (file.products) {
         file.products.forEach(function (elem) {
         if (elem.jobs.toString() !== jobs.toString()) {
         jobsForUpdate.push(elem.jobs);
         }
         });
         Invoice.findByIdAndRemove(file._id, function (err, res) {
         if (err) {
         eachCb(err);
         }
         eachCb();
         });
         }
         }, parallelCb);

         });
         }

         function removeOrders(parallelCb) {
         Order.find({'products.jobs': jobs}, function (err, results) {
         if (err) {
         parallelCb(err);
         }
         async.each(results, function (file, eachCb) {
         if (file.products) {
         file.products.forEach(function (elem) {
         if (elem.jobs.toString() !== jobs.toString()) {
         jobsForUpdate.push(elem.jobs);
         }
         });
         Order.findByIdAndRemove(file._id, function (err, res) {
         if (err) {
         eachCb(err);
         }
         eachCb();
         });
         }
         }, parallelCb);

         });
         }

         parallelTasks = [removeInvoices, removeOrders];

         async.parallel(parallelTasks, function () {

         if (jobsForUpdate.length) {
         jobsForUpdate = _.uniq(jobsForUpdate);
         async.each(jobsForUpdate, function (elem, eachCb) {
         JobsModel.findByIdAndUpdate(elem, {
         $set: {
         invoice : null,
         type    : 'Not Quoted',
         workflow: CONSTANTS.JOBSINPROGRESS,
         editedBy: editedBy
         }
         }, {new: true}, function (err, job) {
         if (err) {
         return eachCb(err);
         }

         _journalEntryHandler.removeByDocId(elem, dbIndex, function () {

         });
         eachCb();
         });
         }, cb);
         } else {
         cb();
         }
         });

         }, function () {

         callback(null, writeOff);
         });
         }
         }*/

        parallelTasks = [fetchFirstWorkflow/*, getRates*/];
        waterFallTasks = [parallel, updateJobs, getJobCosts, createWriteOff, createJournalEntry/*,  removeDocsByJob*/];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(201).send(result);
        });
    };
};

module.exports = WriteOffObj;

