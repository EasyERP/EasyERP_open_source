var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var OrderRowsSchema = mongoose.Schemas.OrderRow;
var historyMapper = require('../constants/historyMapper');
var async = require('async');
var _ = require('../public/js/libs/underscore/underscore');
var CONSTANTS = require('../constants/mainConstants.js');

module.exports = function (models) {
    'use strict';
    return new function () {
        var AvailabilityService = require('../services/productAvailability')(models);
        var PaymentMethodService = require('../services/paymentMethod')(models);
        var OrgService = require('../services/organizationSetting')(models);
        var JournalEntryHandler = require('../handlers/journalEntry');
        var journalEntry = new JournalEntryHandler(models);

        this.updateAvailableProducts = function (options, mainCb) {
            var doc = options.doc;
            var error = new Error('Not enough available products');

            error.status = 404;

            delete options.doc;

            if (doc && doc.orderRows.length) {
                async.each(doc.orderRows, function (orderRow, eachCb) {
                    var lastSum;
                    var isFilled;

                    lastSum = orderRow.quantity;

                    AvailabilityService.find(_.extend({
                        query: {
                            warehouse: doc.warehouse,
                            product  : orderRow.product
                        }
                    }, options), function (err, avalabilities) {
                        if (err) {
                            return eachCb(err);
                        }

                        if (avalabilities.length) {
                            async.each(avalabilities, function (avalability, cb) {
                                var resultOnHand;
                                var existedRow = {
                                    quantity: 0
                                };
                                var onHand;
                                var quantityDeliver;

                                if (orderRow.orderRowId) {
                                    avalability.orderRows.forEach(function (orderRowEl) {
                                        if (orderRowEl.orderRowId && (orderRowEl.orderRowId.toJSON() === orderRow.orderRowId.toJSON())) {
                                            existedRow = orderRow;
                                        }
                                    });
                                }

                                if (isFilled) {
                                    return cb();
                                }

                                onHand = avalability.onHand + existedRow.quantity;

                                if (!onHand || onHand < 0) {
                                    return cb();
                                }

                                resultOnHand = onHand - lastSum;

                                if (resultOnHand < 0) {
                                    lastSum = Math.abs(resultOnHand);
                                    resultOnHand = 0;
                                } else {
                                    isFilled = true;
                                }

                                quantityDeliver = resultOnHand ? lastSum : onHand;

                                function callback() {
                                    var locationsDeliverIds;
                                    var existedBatch;

                                    if (err) {
                                        return cb(err);
                                    }

                                    if (orderRow.locationsDeliver && avalability.location) {
                                        locationsDeliverIds = orderRow.locationsDeliver.map(function (elem) {
                                            return elem.toString();
                                        });
                                        if (!locationsDeliverIds.length || locationsDeliverIds.indexOf(avalability.location._id.toString()) === -1) {
                                            orderRow.locationsDeliver.push(avalability.location._id);
                                        }
                                    }

                                    if (orderRow.batchesDeliver) {
                                        existedBatch = _.find(orderRow.batchesDeliver, function (el) {
                                            return (el.goodsNote.toString() === avalability.goodsInNote.toString());
                                        });
                                        if (existedBatch) {
                                            existedBatch.quantity += quantityDeliver;
                                        } else {
                                            orderRow.batchesDeliver.push({
                                                goodsNote: avalability.goodsInNote,
                                                quantity : quantityDeliver,
                                                cost     : avalability.cost
                                            });
                                        }
                                    }

                                    orderRow.cost += avalability.cost * quantityDeliver;
                                    cb();
                                }

                                if (existedRow.orderRowId) {
                                    if (existedRow.quantity > quantityDeliver) {
                                        AvailabilityService.updateByQuery(_.extend({
                                            query: {
                                                _id                   : avalability._id,
                                                'orderRows.orderRowId': existedRow.orderRowId
                                            },

                                            body: {
                                                $inc: {
                                                    'orderRows.$.quantity': -quantityDeliver
                                                },

                                                $addToSet: {
                                                    goodsOutNotes: {
                                                        goodsNoteId: doc._id,
                                                        quantity   : quantityDeliver
                                                    }
                                                }
                                            }
                                        }, options), callback);
                                    } else {
                                        AvailabilityService.updateByQuery(_.extend({
                                            query: {
                                                _id                   : avalability._id,
                                                'orderRows.orderRowId': existedRow.orderRowId
                                            },

                                            body: {
                                                $addToSet: {
                                                    goodsOutNotes: {
                                                        goodsNoteId: doc._id,
                                                        quantity   : quantityDeliver
                                                    }
                                                },

                                                $pull: {
                                                    orderRows: {orderRowId: existedRow.orderRowId}
                                                },

                                                onHand: resultOnHand
                                            }
                                        }, options), callback);
                                    }
                                } else {
                                    AvailabilityService.updateByQuery(_.extend({
                                        query: {
                                            _id: avalability._id
                                        },

                                        body: {
                                            $addToSet: {
                                                goodsOutNotes: {
                                                    goodsNoteId: doc._id,
                                                    quantity   : quantityDeliver
                                                }
                                            },

                                            onHand: resultOnHand
                                        }
                                    }, options), callback);
                                }
                            }, function (err) {
                                if (err) {
                                    return eachCb(err);
                                }
                                if (!orderRow.quantity) {
                                    return eachCb(error);
                                }

                                eachCb();

                            });
                        } else {
                            eachCb(error);
                        }
                    });

                }, function (err) {
                    if (err) {
                        return mainCb(err);
                    }

                    mainCb(null, doc.orderRows);
                });
            } else {
                mainCb(error);
            }
        };

        this.deliverProducts = function (options, mainCb) {
            var OrderRows = models.get(options.dbName, 'orderRows', OrderRowsSchema);
            var goodsOutNote = options.goodsOutNote;
            var body;
            var dbName = options.dbName;
            var uId = options.uId;

            delete options.goodsOutNote;

            /*AvailabilityService.updateByQuery(_.extend({
             query: {
             'goodsOutNotes.goodsNoteId': goodsOutNote._id
             },

             body: {
             $pull: {
             goodsOutNotes: {goodsNoteId: goodsOutNote._id}
             }
             },

             settings: {multi: true}
             }, options), function (err) {
             if (err) {
             mainCb(err);
             }*/

            AvailabilityService.updateByQuery(_.extend({
                query: {
                    goodsOutNotes: {$size: 0},
                    orderRows    : {$size: 0},
                    onHand       : 0,
                    isJob        : false
                },

                body: {$set: {archived: true}}
            }, options), function (err) {
                if (err) {
                    mainCb(err);
                }

                async.each(goodsOutNote.orderRows, function (orderRow, cb) {
                    var accountsItems = [];

                    body = {
                        journal : null,
                        currency: {
                            _id: CONSTANTS.CURRENCY_USD
                        },

                        date          : goodsOutNote.status.shippedOn,
                        sourceDocument: {
                            model: 'goodsOutNote',
                            _id  : goodsOutNote._id,
                            name : goodsOutNote.name
                        },

                        accountsItems: accountsItems,
                        amount       : orderRow.cost
                    };

                    OrderRows.populate(orderRow, {
                        path  : 'orderRowId',
                        select: 'debitAccount creditAccount'
                    }, function (err) {

                        var debitAccount = orderRow.orderRowId ? orderRow.orderRowId.debitAccount : null;
                        var creditAccount = orderRow.orderRowId ? orderRow.orderRowId.creditAccount : (goodsOutNote.warehouse ? goodsOutNote.warehouse.account : null);

                        if (err) {
                            return cb(err);
                        }

                        accountsItems.push({
                            debit  : 0,
                            credit : body.amount,
                            account: creditAccount
                        });

                        if (debitAccount) {
                            accountsItems.push({
                                debit  : body.amount,
                                credit : 0,
                                account: debitAccount
                            });
                        }

                        journalEntry.createMultiRows(body, {
                            dbName: options.dbName,
                            uId   : options.uId,
                            cb    : cb
                        });
                    });

                }, function (err) {
                    if (err) {
                        return mainCb(err);
                    }

                    if (goodsOutNote.shippingCost) {
                        body = {
                            journal : null,
                            currency: {
                                _id: CONSTANTS.CURRENCY_USD
                            },

                            date          : goodsOutNote.status.shippedOn,
                            sourceDocument: {
                                model: 'goodsOutNote',
                                _id  : goodsOutNote._id,
                                name : goodsOutNote.name
                            },

                            accountsItems: [],
                            amount       : goodsOutNote.shippingCost
                        };

                        PaymentMethodService.populatePaymentMethod({
                            dbName: dbName,
                            path  : 'order.paymentMethod',
                            query : goodsOutNote
                        }, function (err, goodsOutNote) {
                            if (!err) {

                                OrgService.getDefaultShippingAccount({dbName: dbName}, function (err, shipping) {
                                    if (!err) {
                                        body.accountsItems.push({
                                            credit : 0,
                                            debit  : goodsOutNote.shippingCost,
                                            account: shipping
                                        }, {
                                            credit : goodsOutNote.shippingCost,
                                            debit  : 0,
                                            account: goodsOutNote.order.paymentMethod.chartAccount
                                        });

                                        journalEntry.createMultiRows(body, {
                                            dbName: dbName,
                                            uId   : uId
                                        });
                                    }
                                });

                            }
                        });

                    }

                    mainCb();

                });
            });
            /*
             });*/
        };

        this.receiveProducts = function (options, mainCb) {
            var OrderRows = models.get(options.dbName, 'orderRows', OrderRowsSchema);
            var goodsInNote = options.goodsInNote;
            var dbName = options.dbName;
            var warehouseTo = goodsInNote.warehouseTo ? goodsInNote.warehouseTo._id : goodsInNote.warehouse;
            var uId = options.uId;
            var body;

            delete options.goodsInNote;

            async.each(goodsInNote.orderRows, function (elem, eachCb) {
                var locations = elem.locationsReceived || elem.locationsDeliver;
                var batches = elem.batchesDeliver;
                var cost = elem.cost * elem.quantity;

                options.availabilities = [];
                if (locations.length) {

                    if (batches && batches.length) {
                        cost = 0;

                        locations.forEach(function (el) {
                            if (!el.quantity) {
                                return false;
                            }

                            batches.forEach(function (batch) {
                                var batchQuantity = batch.quantity;

                                if (!batch.quantity || !el.quantity) {
                                    return false;
                                }

                                if (batch.quantity >= el.quantity) {
                                    batchQuantity = el.quantity;
                                    batch.quantity -= el.quantity;
                                    el.quantity = 0;
                                } else if (el.quantity > batch.quantity) {
                                    el.quantity -= batch.quantity;
                                    batch.quantity = 0;
                                }

                                cost += batch.cost * batchQuantity;

                                options.availabilities.push({
                                    location     : el.location,
                                    onHand       : batchQuantity,
                                    goodsInNote  : batch.goodsNote,
                                    warehouse    : warehouseTo,
                                    product      : elem.product,
                                    goodsOutNotes: [],
                                    orderRows    : [],
                                    isJob        : false,
                                    cost         : batch.cost
                                });
                            });
                        });

                    } else {
                        locations.forEach(function (el) {
                            options.availabilities.push({
                                location     : el.location || el,
                                onHand       : el.quantity || elem.quantity,
                                goodsInNote  : goodsInNote._id,
                                warehouse    : warehouseTo,
                                goodsOutNotes: [],
                                orderRows    : [],
                                product      : elem.product,
                                isJob        : false,
                                cost         : elem.cost
                            });
                        });
                    }

                }

                function createEntries(parallelCb) {
                    var accountsItems = [];

                    body = {
                        journal : null,
                        currency: {
                            _id: CONSTANTS.CURRENCY_USD
                        },

                        date          : goodsInNote.status.receivedOn,
                        sourceDocument: {
                            model: 'goodsInNote',
                            _id  : goodsInNote._id,
                            name : goodsInNote.name
                        },

                        accountsItems: accountsItems,
                        amount       : cost
                    };

                    OrderRows.populate(elem, {
                        path  : 'orderRowId',
                        select: 'debitAccount creditAccount'
                    }, function (err) {
                        var debitAccount = elem.orderRowId ? elem.orderRowId.debitAccount : (goodsInNote.warehouseTo ? goodsInNote.warehouseTo.account : '');
                        var creditAccount = elem.orderRowId ? elem.orderRowId.creditAccount : null;

                        if (err) {
                            return parallelCb(err);
                        }

                        accountsItems.push({
                            debit  : body.amount,
                            credit : 0,
                            account: debitAccount
                        });

                        if (creditAccount) {
                            accountsItems.push({
                                debit  : 0,
                                credit : body.amount,
                                account: creditAccount
                            });
                        }

                        journalEntry.createMultiRows(body, {
                            dbName: dbName,
                            uId   : uId,
                            cb    : parallelCb
                        });
                    });

                }

                function createAvailabilities(parallelCb) {
                    AvailabilityService.createMulti(_.clone(options), function (err) {
                        if (err) {
                            return parallelCb(err);
                        }
                        parallelCb();
                    });
                }

                async.parallel([createAvailabilities, createEntries], function (err) {
                    if (err) {
                        return eachCb(err);
                    }
                    eachCb();
                });

            }, function (err) {
                if (err) {
                    return mainCb(err);
                }

                if (goodsInNote.shippingCost) {
                    body = {
                        journal : null,
                        currency: {
                            _id: CONSTANTS.CURRENCY_USD
                        },

                        date          : goodsInNote.status.receivedOn,
                        sourceDocument: {
                            model: 'goodsInNote',
                            _id  : goodsInNote._id,
                            name : goodsInNote.name
                        },

                        accountsItems: [],
                        amount       : goodsInNote.shippingCost
                    };

                    PaymentMethodService.populatePaymentMethod({
                        dbName: dbName,
                        path  : 'order.paymentMethod',
                        query : goodsInNote
                    }, function (err, goodsInNote) {
                        if (!err) {

                            OrgService.getDefaultShippingAccount({dbName: dbName}, function (err, shipping) {
                                if (!err) {
                                    body.accountsItems.push({
                                        credit : 0,
                                        debit  : goodsInNote.shippingCost,
                                        account: shipping
                                    }, {
                                        credit : goodsInNote.shippingCost,
                                        debit  : 0,
                                        account: goodsInNote.order.paymentMethod.chartAccount
                                    });

                                    journalEntry.createMultiRows(body, {
                                        dbName: dbName,
                                        uId   : uId
                                    });
                                }
                            });

                        }
                    });

                }

                mainCb(null, goodsInNote);
            });
        };
    };
};
