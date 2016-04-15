/**
 * Created by liliy on 18.03.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var JobsSchema = mongoose.Schemas.jobs;
var journalEntrySchema = mongoose.Schemas.journalEntry;
var journalSchema = mongoose.Schemas.journal;

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Job = dbObject.model("jobs", JobsSchema);
    var JE = dbObject.model("journalEntry", journalEntrySchema);

    var query = Job.find({invoice: {$ne: null}}).populate('invoice').lean();
    var count = 0;

    function createReconciled(body, dbIndex, cb, uId) {
        var Journal =dbObject.model('journal', journalSchema);
        var Model = dbObject.model('journalEntry', journalEntrySchema);
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
        }

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

        JE.remove({ journal       : {$in: [CONSTANTS.FINISHED_JOB_JOURNAL, CONSTANTS.CLOSED_JOB]}}, function (err, removed) {
            async.each(result, function (model, cb) {
                var date = moment(new Date(model.invoice.invoiceDate)).subtract(1, 'seconds');
                var wTracks = model.wTracks;

                var bodyFinishedJob = {
                    currency      : CONSTANTS.CURRENCY_USD,
                    journal       : CONSTANTS.FINISHED_JOB_JOURNAL,
                    date          : new Date(date),
                    sourceDocument: {
                        model: 'jobs',
                        _id  : model._id
                    },
                    amount        : 0
                };

                var bodyClosedJob = {
                    currency      : CONSTANTS.CURRENCY_USD,
                    journal       : CONSTANTS.CLOSED_JOB,
                    date          : new Date(moment(date).subtract(1, 'seconds')),
                    sourceDocument: {
                        model: 'jobs',
                        _id  : model._id
                    },
                    amount        : 0
                };

                var callback = _.after(2, cb);

                JE.aggregate([{
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

                    ++count;

                    bodyFinishedJob.amount = result && result[0] ? result[0].amount : 0;
                    bodyClosedJob.amount = result && result[0] ? result[0].amount : 0;

                    createReconciled(bodyFinishedJob, 'production', callback, '52203e707d4dba8813000003');
                    createReconciled(bodyClosedJob, 'production', callback, '52203e707d4dba8813000003');
                });
            }, function () {
                console.log(count++);
            });
        });

    });


});