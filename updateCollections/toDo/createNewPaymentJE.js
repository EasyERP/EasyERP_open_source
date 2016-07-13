var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var PaymentSchema = mongoose.Schemas.wTrackPayOut;
var journalEntrySchema = mongoose.Schemas.journalEntry;
var journalSchema = mongoose.Schemas.journal;
var CurrencySchema = mongoose.Schemas.Currency;
var ObjectId = mongoose.Types.ObjectId;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('../../config/' + process.env.NODE_ENV);

var oxr = require('open-exchange-rates');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'alex', 28017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production'/*, 28017, connectOptions*/);
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Payment = dbObject.model("Payment", PaymentSchema);
    var JE = dbObject.model("journalEntry", journalEntrySchema);
    var Currency = dbObject.model('currency', CurrencySchema);

    var query = Payment.find({
        forSale: true,
        "_type": {$in: ["Payment", "InvoicePayment", "ProformaPayment"]}
    }).populate('invoice').populate('currency._id').lean();
    var count = 0;

    function createReconciled(body, dbIndex, cb, uId) {
        var Journal = dbObject.model('journal', journalSchema);
        var Model = dbObject.model('journalEntry', journalEntrySchema);
        var journalId = body.journal;
        var now = moment();
        var date = body.date ? moment(body.date) : now;
        var currency;
        var amount = body.amount;

        var waterfallTasks = [currencyNameFinder, journalFinder, journalEntrySave];

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
    }

    query.exec(function (err, result) {

        JE.remove({journal: {$in: [CONSTANTS.PAYMENT_JOURNAL, CONSTANTS.PROFORMA_JOURNAL, ObjectId('57848f8e7501f35c20bd0973'), ObjectId('57848fc57501f35c20bd0974')]}}, function (err, removed) {
            async.each(result, function (model, cb) {
                var date = moment(new Date(model.date));
                var journlal = model.journal || CONSTANTS.PAYMENT_JOURNAL;
                var rates;
                var currency = {};
                var asyncCb;

                date = date.format('YYYY-MM-DD');

                if (model.invoice) {
                    if (model.invoice._type === 'Proforma') {
                        journlal = CONSTANTS.PROFORMA_JOURNAL;
                    }

                    var invoiceRate = model.paidAmount / model.invoice.currency.rate;
                    var PaymRate = model.paidAmount / model.currency.rate;

                    var body = {
                        currency      : model.invoice.currency._id,
                        journal       : journlal,
                        date          : new Date(date),
                        sourceDocument: {
                            model: 'Payment',
                            _id  : model._id
                        },

                        amount: invoiceRate
                    };

                    var bodyOtherIncome = {
                        currency      : model.invoice.currency._id,
                        date          : new Date(date),
                        sourceDocument: {
                            model: 'Payment',
                            _id  : model._id
                        },
                        
                        amount: Math.abs(PaymRate - invoiceRate)
                    };

                    if (PaymRate > invoiceRate) {
                        bodyOtherIncome.journal = '57848f8e7501f35c20bd0973';
                    } else if (PaymRate < invoiceRate) {
                        bodyOtherIncome.journal = '57848fc57501f35c20bd0974';
                    } else if (PaymRate === invoiceRate && model.currency._id.name !== 'USD') {
                        console.log(model._id);
                    }

                    count++;

                    if (bodyOtherIncome.journal) {
                        asyncCb = _.after(2, cb);

                        createReconciled(bodyOtherIncome, 'production', asyncCb, '52203e707d4dba8813000003');
                        createReconciled(body, 'production', asyncCb, '52203e707d4dba8813000003');

                    } else {
                        createReconciled(body, 'production', cb, '52203e707d4dba8813000003');
                    }

                } else {
                    cb();
                }

            }, function () {
                console.log(count++);
            });
        });

    });

});
