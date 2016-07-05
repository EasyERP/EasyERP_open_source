var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');
var CONSTANTS = require('../constants/mainConstants');
var oxr = require('open-exchange-rates');
var fx = require('money');
var moment = require('../public/js/libs/moment/moment');
var fs = require('fs');

var WriteOffObj = function (models, event) {
    'use strict';

    var async = require('async');

    var WriteOffSchema = mongoose.Schemas.writeOff;
    var JobsSchema = mongoose.Schemas.jobs;

    var workflowHandler = new WorkflowHandler(models);
    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models, event);

    oxr.set({app_id: process.env.OXR_APP_ID});

    this.create = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var WriteOff = models.get(dbIndex, 'writeOff', WriteOffSchema);
        var JobsModel = models.get(dbIndex, 'jobs', JobsSchema);
        var request;
        var date = moment().format('YYYY-MM-DD');
        var data = req.body;
        var parallelTasks;
        var waterFallTasks;

        function getRates(callback) {
            oxr.historical(date, function () {
                fx.rates = oxr.rates;
                fx.base = oxr.base;
                callback();
            });
        }

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

        function createWriteOff(parallelResponse, callback) {
            var workflow;
            var err;
            var writeOff;
            var products;
            var saveObject = {
                currency   : data.currency,
                dueDate    : data.dueDate,
                forSales   : data.forSales,
                groups     : data.groups,
                invoiceDate: data.invoiceDate,
                project    : data.project,
                paymentInfo: data.paymentInfo,
                products   : data.products,
                supplier   : data.supplier,
                name       : data.supplierInvoiceNumber,
                whoCanRW   : data.whoCanRW,
                journal    : data.journal
            };

            if (parallelResponse && parallelResponse.length) {
                workflow = parallelResponse[0];
            } else {
                err = new Error(RESPONSES.BAD_REQUEST);
                err.status = 400;

                return callback(err);
            }

            if (req.session.uId) {

                saveObject.createdBy = {
                    user: req.session.uId
                };

                saveObject.editedBy = {
                    user: req.session.uId
                };
            }

            saveObject.workflow = workflow._id;
            saveObject.paymentInfo.balance = data.paymentInfo.total;

            saveObject.currency.rate = oxr.rates[data.currency.name];

            writeOff = new WriteOff(saveObject);

            writeOff.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                products = result.products;

                callback(null, result);
            });
        }

        function createJournalEntry(writeOff, callback) {
            var body = {
                currency      : CONSTANTS.CURRENCY_USD,
                journal       : data.journal,
                sourceDocument: {
                    model: 'writeOff',
                    _id  : writeOff._id
                },

                amount: 0,
                date  : writeOff.invoiceDate
            };

            var amount = writeOff.currency.rate * writeOff.paymentInfo.total;

            body.amount = amount;

            _journalEntryHandler.create(body, req.session.lastDb, function () {
            }, req.session.uId);

            callback(null, writeOff);
        }

        function updateJobs(writeOff, callback) {
            var products = writeOff.products;
            var project;

            if (products) {
                async.each(products, function (result, cb) {
                    var jobs = result.jobs;
                    var editedBy = {
                        user: req.session.uId,
                        date: new Date()
                    };
                    JobsModel.findByIdAndUpdate(jobs, {
                        $set: {
                            invoice : writeOff._id,
                            type    : 'Cancelled',
                            workflow: CONSTANTS.JOBSFINISHED,
                            editedBy: editedBy
                        }
                    }, {new: true}, function (err, job) {
                        if (err) {
                            return cb(err);
                        }
                        project = job.project || null;

                        _journalEntryHandler.createCostsForJob({
                            req     : req,
                            jobId   : jobs,
                            workflow: CONSTANTS.JOBSFINISHED
                        });

                        cb();
                    });

                }, function () {
                    if (project) {
                        event.emit('fetchJobsCollection', {project: project, dbName: dbIndex});
                    }
                    callback();
                });
            }
        };

        parallelTasks = [fetchFirstWorkflow, getRates];
        waterFallTasks = [parallel, createWriteOff, createJournalEntry, updateJobs];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(201).send(result);
        });
    };
};

module.exports = WriteOffObj;

