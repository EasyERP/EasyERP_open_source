'use strict';
var mongoose = require('mongoose');
var journalEntrySchema = mongoose.Schemas.journalEntry;
var manualEntrySchema = mongoose.Schemas.manualEntry;
var moment = require('../public/js/libs/moment/moment');
var _ = require('underscore');
var async = require('async');
var CONSTANTS = require('../constants/mainConstants');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function (models) {
    return new function () {
        this.journalEntrySaver = function (options, callback) {
            var JournalEntry;
            var dbName;
            var err;
            var now = moment().endOf('month');
            var date = options.date ? moment(new Date(options.date)) : now;
            var timeStamp = new Date();
            var timeStampDate = new Date(date);
            var amount = options.amount;
            var journal = options.journal;
            var reverse = options.reverse;
            var uId = options.uId;
            var debitObject;
            var creditObject;
            var parallelTasks;

            timeStamp = timeStamp.valueOf() + timeStampDate.valueOf() + new ObjectId();

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

            JournalEntry = models.get(dbName, 'journalEntry', journalEntrySchema);

            parallelTasks = {
                debitSaver : function (parallelCb) {
                    var journalEntry;

                    debitObject.debit = amount;
                    debitObject.account = journal.debitAccount;

                    if (reverse) {
                        debitObject.account = journal.creditAccount;
                    }

                    debitObject.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    debitObject.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    debitObject.debitFC = amount;

                    if (debitObject.currency && debitObject.currency.rate) {
                        debitObject.debit *= debitObject.currency.rate;
                    }

                    if (debitObject.debitFC === debitObject.debit) {
                        debitObject.debitFC = 0;
                    }

                    if (amount && moment(new Date(debitObject.date)).isBefore(now)) {
                        journalEntry = new JournalEntry(debitObject);
                        journalEntry.save(parallelCb);
                    } else {
                        parallelCb();
                    }

                },
                creditSaver: function (parallelCb) {
                    var journalEntry;

                    creditObject.credit = amount;
                    creditObject.account = journal.creditAccount;

                    if (reverse) {
                        debitObject.account = journal.debitAccount;
                    }

                    creditObject.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    creditObject.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    creditObject.creditFC = amount;

                    if (creditObject.currency && creditObject.currency.rate) {
                        creditObject.credit *= creditObject.currency.rate;
                    }

                    if (creditObject.creditFC === creditObject.credit) {
                        creditObject.creditFC = 0;
                    }

                    if (amount && moment(new Date(creditObject.date)).isBefore(now)) {
                        journalEntry = new JournalEntry(creditObject);
                        journalEntry.save(parallelCb);
                    } else {
                        parallelCb();
                    }
                }
            };

            options.journal = journal && journal._id ? journal._id : null;
            options.timestamp = timeStamp;

            debitObject = _.extend({}, options);
            creditObject = _.extend({}, options);

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.createMultiRows = function (options, callback) {
            var JournalEntry;
            var dbName;
            var err;
            var now = moment().endOf('month');
            var date = options.date ? moment(new Date(options.date)) : now;
            var timeStamp = new Date();
            var timeStampDate = new Date(date);
            var currency = options.currency;
            var journal = options.journal;
            var notDivideRate = options.notDivideRate;
            var accountsItems = options.accountsItems;
            var uId = options.uId;
            var object;

            timeStamp = timeStamp.valueOf() + timeStampDate.valueOf() + new ObjectId();

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

            JournalEntry = models.get(dbName, 'journalEntry', journalEntrySchema);

            options.currency = currency || {_id: CONSTANTS.CURRENCY_USD, rate: 1};
            options.journal = journal ? journal._id : null;
            options.timestamp = timeStamp;

            object = _.extend({}, options);

            async.each(accountsItems, function (el, cb) {
                var journalEntry;

                object.debit = el.debit;
                object.credit = el.credit;
                object.account = el.account;

                object.editedBy = {
                    user: uId,
                    date: new Date(date)
                };

                object.createdBy = {
                    user: uId,
                    date: new Date(date)
                };

                object.debitFC = el.debitFC;
                object.creditFC = el.creditFC;

                if (!notDivideRate && object.currency && object.currency.rate) {
                    object.debit /= object.currency.rate;
                    object.credit /= object.currency.rate;
                }

                if (object.debitFC === object.debit) {
                    object.debitFC = 0;
                }

                if (object.creditFC === object.credit) {
                    object.creditFC = 0;
                }

                if (el.debit || el.credit && moment(new Date(object.date)).isBefore(now)) {
                    journalEntry = new JournalEntry(object);
                    journalEntry.save(cb);
                } else {
                    cb();
                }
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, {success: true});
            });
        };

        this.remove = function (options, callback) {
            var dbName;
            var JournalEntry;
            var query = options.query;

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

            JournalEntry = models.get(dbName, 'journalEntry', journalEntrySchema);

            JournalEntry.remove(query, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.formBodyForPrepaymentEntries = function (options, callback) {
            var dbName;
            var uId;
            var payment = options.payment;
            var journal;
            var paymentBody;
            var differenceAmount;
            var accountsItems;
            var debitAccount;
            var creditAccount;
            var rate;
            var self = this;

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
            uId = options.uId;
            delete options.dbName;
            delete options.uId;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            journal = payment.journal;
            accountsItems = [];
            rate = payment.currency.rate;

            debitAccount = payment.bankAccount;
            creditAccount = CONSTANTS.USR;

            differenceAmount = payment.paidAmount / rate;

            paymentBody = {
                journal : journal && journal._id ? journal._id : null,
                currency: {
                    _id : payment.currency._id,
                    rate: payment.currency.rate
                },

                date          : payment.date,
                sourceDocument: {
                    model   : 'Payment',
                    _id     : payment._id,
                    name    : payment.name,
                    employee: null
                },

                accountsItems: accountsItems,
                amount       : differenceAmount
            };

            if (payment.bankExpenses && payment.bankExpenses.amount) {

                paymentBody.accountsItems.push({
                    credit : 0,
                    debit  : payment.bankExpenses.amount,
                    account: debitAccount
                });
            }

            if (payment.overPayment && payment.overPayment.amount) {
                paymentBody.accountsItems.push({
                    debit  : payment.overPayment.amount,
                    credit : 0,
                    account: debitAccount
                });
            }

            paymentBody.accountsItems.push({
                debit   : 0,
                credit  : differenceAmount,
                creditFC: payment.paidAmount,
                account : creditAccount
            }, {
                credit : 0,
                debit  : differenceAmount - (payment.bankExpenses && payment.bankExpenses.amount) || 0,
                debitFC: payment.paidAmount,
                account: debitAccount
            });

            paymentBody.dbName = dbName;
            paymentBody.uId = uId;
            paymentBody.notDivideRate = true;

            this.remove({
                dbName: dbName,
                query : {
                    'sourceDocument.name' : paymentBody.sourceDocument.name,
                    'sourceDocument.model': paymentBody.sourceDocument.model
                }
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                self.createMultiRows(paymentBody, callback);
            });

        };

        this.findAndReverse = function (options, callback) {
            var dbName;
            var JournalEntry;
            var id = options.id;
            var uId = options.uId;

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

            JournalEntry = models.get(dbName, 'journalEntry', journalEntrySchema);

            JournalEntry.aggregate([{
                $match: {
                    'sourceDocument._id'  : ObjectId(id),
                    'sourceDocument.model': 'Invoice',
                    reversed              : false
                }
            }, {
                $group: {
                    _id: {
                        timestamp: '$timestamp',
                        date     : '$createdBy.date'
                    },

                    root: {$push: '$$ROOT'},
                    date: {$max: '$createdBy.date'}
                }
            }], function (err, result) {
                var newArray = [];
                var root;
                var date;
                var timeStamp;
                var timeStampDate;
                var objId;

                if (err) {
                    return callback(err);
                }

                if (!result || !result.length) {
                    return callback(null, true);
                }

                date = result[0].date;

                root = _.find(result, function (el) {
                    return el._id.date.toString() === date.toString();
                });

                root = root ? root.root : [];

                timeStamp = new Date();
                timeStampDate = new Date(root[0].date);
                objId = new ObjectId();

                root.forEach(function (el) {
                    var debit = el.debit;
                    var credit = el.credit;
                    var debitFC = el.debitFC;
                    var creditFC = el.creditFC;
                    var body = el;

                    body.credit = debit;
                    body.debit = credit;
                    body.debitFC = creditFC;
                    body.creditFC = debitFC;

                    if (body.account.toString() === CONSTANTS.PRODUCT_SALES && credit){
                      body.account = ObjectId(CONSTANTS.SALES_RETURNS);
                    }

                    if (!body.createdBy) {
                        body.createdBy = {};
                    }

                    body.createdBy.date = new Date();
                    body.createdBy.user = uId;

                    if (!body.editeddBy) {
                        body.editeddBy = {};
                    }
                    body.editeddBy.user = uId;
                    body.editeddBy.date = new Date();

                    body.reversed = true;

                    delete body._id;

                    body.timestamp = timeStamp.valueOf() + timeStampDate.valueOf() + objId;

                    newArray.push(body);

                });

                JournalEntry.collection.insertMany(newArray, function (err) {

                    if (err) {
                        return callback(err);
                    }

                    callback(null, true);
                });

            });

        };
    };
};

