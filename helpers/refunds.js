var async = require('async');
var moment = require('../public/js/libs/moment/moment');
var MAIN_CONSTANTS = require('../constants/mainConstants');
var _ = require('lodash');
var GoodsInNotes = function (models) {

    'use strict';

    var AvailabilityService = require('../services/productAvailability')(models);
    var JournalEntryService = require('../services/journalEntry')(models);
    var goodsNoteService = require('../services/goodsOutNotes')(models);
    var orderRowsService = require('../services/orderRows')(models);
    var stockReturnsService = require('../services/stockReturns')(models);
    var ratesService = require('../services/rates')(models);
    var paymentService = require('../services/payments')(models);
    var invoiceService = require('../services/invoices')(models);
    var ratesRetriever = require('../helpers/ratesRetriever')();
    var WorkflowHandler = require('../handlers/workflow');

    this.createProductReturn = function (options, callback) {
        var goodsNoteIdsToPull;
        var pullGoodsOutNotes;
        var dbName;
        var error;
        var user;
        var data;

        if (!callback && typeof options === 'function') {
            error = new Error('Invalid data');
            error.status = 400;

            return callback(error);
        }

        dbName = options.dbName;
        data = options.data;
        pullGoodsOutNotes = data.pullGoodsOutNotes || {};
        goodsNoteIdsToPull = Object.keys(pullGoodsOutNotes);

        if (!data || !dbName) {
            error = new Error('Invalid data');
            error.status = 400;

            return callback(error);
        }

        data.dbName = dbName;

        stockReturnsService.create(data, function (err, result) {
            if (err) {
                return callback(err);
            }

            stockReturnsService.findById(result._id, {dbName: dbName})
                .populate('order')
                .exec(function (err, goodsNote) {
                    if (err) {
                        return callback(err);
                    }

                    if (goodsNote && goodsNote.order) {
                        async.each(goodsNote.orderRows, function (goodsOrderRow, eCb) {
                            var updateBody;
                            var updateObject;

                            var query = goodsNote.order.project ? {
                                product  : goodsOrderRow.product,
                                warehouse: goodsOrderRow.warehouse
                            } : {
                                'goodsOutNotes.goodsNoteId': goodsOrderRow.goodsOutNote,
                                product                    : goodsOrderRow.product,
                                warehouse                  : goodsOrderRow.warehouse
                            };

                            if (goodsOrderRow.goodsInNote) {
                                query = {
                                    goodsInNote: goodsOrderRow.goodsInNote
                                };
                            }

                            updateBody = {
                                $inc: {
                                    onHand: goodsOrderRow.quantity
                                },

                                $pull: {
                                    goodsOutNotes: {goodsNoteId: goodsOrderRow.goodsOutNote}
                                }
                            };

                            if (!goodsOrderRow.goodsInNote) {
                                if (goodsNoteIdsToPull.indexOf(goodsOrderRow.goodsOutNote.toString()) !== -1) {
                                    updateBody = {
                                        $inc: {
                                            onHand: goodsOrderRow.quantity
                                        },

                                        $pull: {
                                            goodsOutNotes: {goodsNoteId: goodsOrderRow.goodsOutNote}
                                        }
                                    };

                                    updateObject = {
                                        $pull: {
                                            orderRows: {product: goodsOrderRow.product}
                                        }
                                    };
                                } else {
                                    updateBody = {
                                        $inc: {
                                            onHand                    : goodsOrderRow.quantity,
                                            'goodsOutNotes.$.quantity': goodsOrderRow.quantity * (-1)
                                        }
                                    };

                                    updateObject = {
                                        $inc: {
                                            'orderRows.$.quantity': goodsOrderRow.quantity * (-1)
                                        }
                                    };
                                }
                            } else {
                                if (goodsNoteIdsToPull.indexOf(goodsOrderRow.goodsInNote.toString()) !== -1) {
                                    updateBody = {
                                        $inc: {
                                            onHand: goodsOrderRow.quantity * (-1)
                                        }
                                    };
                                    updateObject = {
                                        $pull: {
                                            orderRows: {product: goodsOrderRow.product}
                                        }
                                    };
                                } else {
                                    updateBody = {
                                        $inc: {
                                            onHand: goodsOrderRow.quantity * (-1)
                                        }
                                    };
                                    updateObject = {
                                        $inc: {
                                            'orderRows.$.quantity': goodsOrderRow.quantity * (-1)
                                        }
                                    };
                                }
                            }

                            AvailabilityService.updateByQuery({
                                dbName: dbName,
                                query : query,

                                body: updateBody
                            }, function (err) {
                                var queryObj;
                                if (err) {
                                    return callback(err);
                                }

                                queryObj = {
                                    _id                : goodsOrderRow.goodsOutNote || goodsOrderRow.goodsInNote,
                                    'orderRows.product': goodsOrderRow.product
                                };

                                goodsNoteService.update(updateObject, {
                                    query    : queryObj,
                                    dbName   : dbName,
                                    updateQty: goodsOrderRow.quantity,
                                    purchase : goodsOrderRow.goodsInNote
                                }, function (err, result) {
                                    var cost;
                                    var orderRowId;
                                    var journalEntryBody = {};

                                    if (err) {
                                        return eCb(err);
                                    }

                                    cost = result.cost * goodsOrderRow.quantity;
                                    orderRowId = result.orderRowId;

                                    orderRowsService.findOne({dbName: dbName, _id: orderRowId}, function (err, result) {
                                        if (err) {
                                            return eCb(err);
                                        }

                                        journalEntryBody.date = goodsNote.releaseDate;
                                        journalEntryBody.journal = null;
                                        journalEntryBody.currency = {};
                                        journalEntryBody.currency._id = 'USD';
                                        journalEntryBody.currency.rate = 1;
                                        journalEntryBody.amount = cost;
                                        journalEntryBody.sourceDocument = {};
                                        journalEntryBody.sourceDocument._id = goodsNote._id;
                                        journalEntryBody.sourceDocument.model = 'stockReturns';
                                        journalEntryBody.sourceDocument.name = goodsNote.name;
                                        journalEntryBody.uId = user;
                                        journalEntryBody.dbName = dbName;

                                        journalEntryBody.accountsItems = [{
                                            debit  : cost,
                                            credit : 0,
                                            account: result.creditAccount
                                        }, {
                                            debit  : 0,
                                            credit : cost,
                                            account: result.debitAccount
                                        }];

                                        JournalEntryService.createMultiRows(journalEntryBody, eCb);

                                    });

                                });
                            });
                        }, function (err) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, goodsNote.order);
                        });

                    } else {
                        callback();
                    }
                });
        });
    };

    this.createPaymentReturn = function (options, callback) {
        var now = new Date();
        var workflowHandler = new WorkflowHandler(models);
        var fx = {};
        var waterfallTasks;
        var dbName;
        var error;
        var data;
        var date;
        var user;

        if (!callback && typeof options === 'function') {
            error = new Error('Invalid data');
            error.status = 400;

            return callback(error);
        }

        data = options.data;
        dbName = options.dbName;
        user = options.user;

        if (!data || !dbName) {
            error = new Error('Invalid data');
            error.status = 400;

            return callback(error);
        }

        date = data.date ? moment(new Date(data.date)) : now;

        function getRates(waterfallCallback) {
            ratesService.getById({id: date, dbName: dbName}, function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }
                fx.rates = result && result.rates ? result.rates : {};
                fx.base = result && result.base ? result.base : 'USD';

                waterfallCallback();
            });
        }

        function savePayment(waterfallCallback) {
            data.createdBy = {
                user: user
            };
            data.editedBy = {
                user: user
            };
            data.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, data.currency.name);

            data.dbName = dbName;

            delete data.name;

            paymentService.create(data, function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }

                paymentService.findById(payment._id, {dbName: dbName})
                    .populate('paymentMethod')
                    .populate('invoice')
                    .exec(function (err, resultPayment) {

                        if (err) {
                            return waterfallCallback(err);
                        }

                        waterfallCallback(null, resultPayment);
                    });
            });
        }

        function createJournalEntry(payment, waterfallCallback) {
            var bankAccount = payment.bankAccount;
            var debitAccount;
            var amount = payment.paidAmount;
            var rate = ratesRetriever.getRate(fx.rates, fx.base, payment.currency._id);
            var ratedAmount = amount / rate;
            var paymentBody;
            var accountsItems = [];

            if (payment.forSale) {
                if (payment.order) {
                    debitAccount = MAIN_CONSTANTS.USR;
                } else if (payment.invoice) {
                    debitAccount = MAIN_CONSTANTS.ACCOUNT_RECEIVABLE;
                }
            } else {
                debitAccount = bankAccount;
                bankAccount = MAIN_CONSTANTS.ACCOUNT_PAYABLE;
            }

            paymentBody = {
                journal : null,
                currency: {
                    _id : payment.currency._id,
                    rate: payment.currency.rate
                },

                date          : payment.date,
                sourceDocument: {
                    model: 'Payment',
                    _id  : payment._id,
                    name : payment.name
                },

                accountsItems: accountsItems,
                amount       : ratedAmount
            };

            accountsItems.push({
                debit  : 0,
                credit : ratedAmount,
                account: bankAccount
            }, {
                debit  : ratedAmount,
                credit : 0,
                account: debitAccount
            });

            paymentBody.dbName = dbName;
            paymentBody.uId = user;
            paymentBody.notDivideRate = true;

            JournalEntryService.createMultiRows(paymentBody);

            waterfallCallback(null, payment);
        }

        function getWorkflows(payment, waterfallCallback) {
            var request;
            var paym = payment.toJSON();

            request = {
                query: {
                    source      : 'purchase',
                    targetSource: 'invoice',
                    wId         : 'Purchase Invoice'
                },

                session: {lastDb: dbName}
            };

            if (payment.forSale) {
                request.query.wId = 'Sales Invoice';
            }

            if (paym.invoice.paymentInfo.balance + payment.paidAmount < paym.invoice.paymentInfo.total) {
                request.query.status = 'In Progress';
                request.query.order = 1;
            } else {
                request.query.status = 'New';
                request.query.order = 1;
            }

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                if (err) {
                    return waterfallCallback(err);
                }

                waterfallCallback(null, payment, workflow._id);
            });

        }

        function updateInvoice(payment, workflow, waterfallCallback) {
            invoiceService.findAndUpdate({_id: payment.invoice._id}, {
                $inc: {'paymentInfo.balance': payment.paidAmount},
                $set: {workflow: workflow}
            }, {
                dbName: dbName,
                new   : true
            }, function (err) {
                if (err) {
                    return waterfallCallback(err);
                }

                waterfallCallback(null, payment);
            });
        }

        if (data.checkSource) {
            invoiceService.getSourceForRefund({dbName: dbName, sourceDocument: data.order}, function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result.order) {
                    data.order = result.id;
                } else if (result.invoice) {
                    data.invoice = result.id;

                    delete data.order;
                }

                waterfallTasks = [getRates, savePayment, createJournalEntry];

                if (data.invoice) {
                    waterfallTasks.push(getWorkflows, updateInvoice);
                }

                async.waterfall(waterfallTasks, function (err, payment) {
                    if (err) {

                        return callback(err);
                    }

                    callback(null, payment);
                });
            });
        } else {
            waterfallTasks = [getRates, savePayment, createJournalEntry];

            if (data.invoice) {
                waterfallTasks.push(getWorkflows, updateInvoice);
            }

            async.waterfall(waterfallTasks, function (err, payment) {
                if (err) {

                    return callback(err);
                }

                callback(null, payment);
            });
        }
    };

    this.getOldestGoodsOutNotes = function (options, callback) {
        var needMoreGoods = true;
        var i = 0;
        var goodsOutNotesToPull = {};
        var goodsOutNotesArray = [];
        var goodsOrderRow;
        var currentGoods;
        var needToPull;
        var refundData;
        var orderId;
        var orderRowArray;
        var warehouse;
        var error;
        var db;

        if (!callback && typeof options === 'function') {
            error = new Error('Invalid data');
            error.status = 400;

            return callback(error);
        }

        orderId = options.orderId;
        orderRowArray = options.orderRowArray;
        warehouse = options.warehouse;
        db = options.db;

        console.log('orderId', orderId);
        console.log('orderRowArray', orderRowArray);
        console.log('warehouse', warehouse);
        console.log('db', db);

        if (!orderId || !orderRowArray || !warehouse || !db) {
            error = new Error('Invalid data');
            error.status = 400;

            return callback(error);
        }

        goodsNoteService.find({order: orderId}, {dbName: db})
            .sort({'createdBy.date': 1})
            .lean()
            .exec(function (err, resultGoods) {
                if (err) {
                    return callback(err);
                }

                if (!resultGoods.length) {
                    return callback();
                }

                while (needMoreGoods) {
                    needMoreGoods = false;
                    needToPull = true;
                    currentGoods = resultGoods[i];
                    goodsOrderRow = currentGoods.orderRows;

                    orderRowArray = orderRowArray.map(function (orderRow) {
                        var product = _.findWhere(goodsOrderRow, {product: orderRow.product});
                        var refundObj;

                        if (!product) {
                            return;
                        }

                        if (product.quantity > orderRow.quantity) {
                            refundObj = {
                                goodsOutNote: currentGoods._id,
                                orderRowId  : orderRow._id,
                                product     : product.product,
                                quantity    : orderRow.quantity,
                                warehouse   : warehouse
                            };

                            needToPull = false;
                        } else if (product.quantity === orderRow.quantity) {
                            refundObj = {
                                goodsOutNote: currentGoods._id,
                                orderRowId  : orderRow._id,
                                product     : product.product,
                                quantity    : orderRow.quantity,
                                warehouse   : warehouse
                            };
                        } else {
                            refundObj = {
                                goodsOutNote: currentGoods._id,
                                orderRowId  : orderRow._id,
                                product     : product.product,
                                quantity    : product.quantity,
                                warehouse   : warehouse
                            };

                            orderRow.quantity = orderRow.quantity - product.quantity;
                            needMoreGoods = true;
                        }

                        if (needToPull) {
                            goodsOutNotesToPull[currentGoods._id.toString()] = true;
                        }

                        goodsOutNotesArray.push(refundObj);

                        return orderRow;
                    });

                    i++;
                }

                refundData = {
                    order            : orderId,
                    orderRows        : _.compact(goodsOutNotesArray),
                    pullGoodsOutNotes: goodsOutNotesToPull
                };

                callback(null, refundData);
            });
    };
};

module.exports = GoodsInNotes;

