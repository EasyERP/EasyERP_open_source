var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');
var CONSTANTS = require('../constants/mainConstants');
var fx = require('money');
var moment = require('../public/js/libs/moment/moment');

var Proforma = function (models) {
    'use strict';

    var async = require('async');

    var ExpensesInvoiceSchema = mongoose.Schemas.expensesInvoice;

    var workflowHandler = new WorkflowHandler(models);
    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models);
    var ratesService = require('../services/rates')(models);
    var ratesRetriever = require('../helpers/ratesRetriever')();

    this.create = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var ExpensesInvoice = models.get(dbIndex, 'expensesInvoice', ExpensesInvoiceSchema);
        var request;
        var date = moment().format('YYYY-MM-DD');
        var data = req.body;
        var parallelTasks;
        var waterFallTasks;

        function getRates(callback) {
            ratesService.getById({id: date, dbName: req.session.lastDb}, function (err, result) {

                fx.rates = result && result.rates ? result.rates : {};
                fx.base = result && result.base ? result.base : 'USD';

                callback(null, callback);
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

        function createExpensesInvoice(parallelResponse, callback) {
            var workflow;
            var err;
            var expensesInvoice;
            var saveObject = data;

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
            saveObject.journal = CONSTANTS.EXPENSES_INVOICE_JOURNAL;

            saveObject.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, data.currency._id);

            delete saveObject.salesPerson;
            delete saveObject.sourceDocument;

            expensesInvoice = new ExpensesInvoice(saveObject);

            expensesInvoice.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        }

        function createJournalEntry(expensesInvoice, callback) {
            var body = {
                currency      : expensesInvoice.currency,
                journal       : CONSTANTS.EXPENSES_INVOICE_JOURNAL,
                sourceDocument: {
                    model: 'expensesInvoice',
                    _id  : expensesInvoice._id,
                    name : expensesInvoice.name
                },

                amount: 0,
                date  : expensesInvoice.invoiceDate
            };

            var amount = expensesInvoice.paymentInfo.total;

            body.amount = amount;

            _journalEntryHandler.createReconciled(body, {dbName: req.session.lastDb, uId: req.session.uId});

            callback(null, expensesInvoice);
        }

        parallelTasks = [fetchFirstWorkflow, getRates];
        waterFallTasks = [parallel, createExpensesInvoice/*, createJournalEntry*/];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(201).send(result);
        });
    };
};

module.exports = Proforma;

