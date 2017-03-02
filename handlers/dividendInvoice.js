var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');
var CONSTANTS = require('../constants/mainConstants');
var oxr = require('open-exchange-rates');
var fx = require('money');
var moment = require('../public/js/libs/moment/moment');

var Proforma = function (models) {
    'use strict';

    var async = require('async');

    var DividendInvoiceSchema = mongoose.Schemas.dividendInvoice;

    var workflowHandler = new WorkflowHandler(models);
    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models);
    var ratesService = require('../services/rates')(models);
    var ratesRetriever = require('../helpers/ratesRetriever')();
    // oxr.set({app_id: process.env.OXR_APP_ID});

    this.create = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var DividendInvoice = models.get(dbIndex, 'dividendInvoice', DividendInvoiceSchema);
        var request;
        var date = moment().format('YYYY-MM-DD');
        var data = req.body;
        var parallelTasks;
        var waterFallTasks;

        function getRates(callback) {
            ratesService.getById({id: date, dbName: req.session.lastDb}, function (err, result) {

                fx.rates = result && result.rates ? result.rates : {};
                fx.base = result && result.base ? result.base : 'USD';

                callback(null, fx);
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

        function createDividendInvoice(parallelResponse, callback) {
            var workflow;
            var err;
            var dividendInvoice;
            var saveObject = {
                currency   : data.currency,
                dueDate    : data.dueDate,
                forSales   : data.forSales,
                groups     : data.groups,
                invoiceDate: data.invoiceDate,
                paymentInfo: data.paymentInfo,
                products   : data.products,
                whoCanRW   : data.whoCanRW
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
            saveObject.journal = CONSTANTS.DIVIDEND_INVOICE_JOURNAL;

            saveObject.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, data.currency._id);

            dividendInvoice = new DividendInvoice(saveObject);

            dividendInvoice.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        }

        function createJournalEntry(dividendInvoice, callback) {
            var body = {
                currency      : dividendInvoice.currency,
                journal       : CONSTANTS.DIVIDEND_INVOICE_JOURNAL,
                sourceDocument: {
                    model: 'dividendInvoice',
                    _id  : dividendInvoice._id,
                    name : dividendInvoice.name
                },

                amount: 0,
                date  : dividendInvoice.invoiceDate
            };

            var amount = dividendInvoice.paymentInfo.total;

            body.amount = amount;

            _journalEntryHandler.createReconciled(body, {dbName: req.session.lastDb, uId: req.session.uId});

            callback(null, dividendInvoice);
        }

        parallelTasks = [fetchFirstWorkflow, getRates];
        waterFallTasks = [parallel, createDividendInvoice, createJournalEntry];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(201).send(result);
        });
    };
};

module.exports = Proforma;
