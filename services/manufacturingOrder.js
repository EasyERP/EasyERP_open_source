'use strict';

var mongoose = require('mongoose');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');

var ManufacturingOrderSchema = mongoose.Schemas.manufacturingOrder;
var AvailabilitySchema = mongoose.Schemas.productsAvailability;
var GoodsOutSchema = mongoose.Schemas.GoodsOutNote;
var GoodsInSchema = mongoose.Schemas.GoodsInNote;
var PrepaymentSchema = mongoose.Schemas.Prepayment;
var OrderRowsSchema = mongoose.Schemas.OrderRow;
var InvoiceSchema = mongoose.Schemas.Invoices;

var objectId = mongoose.Types.ObjectId;

module.exports = function (models) {
    var goodsOutNotesService = require('./goodsOutNotes')(models);
    var HistoryService = require('./history')(models);
    var StockReturnsService = require('./stockReturns.js')(models);

    var GoodsOutNote = require('../handlers/goodsOutNote');
    var goodsOutNote = new GoodsOutNote(models);

    return new function () {
        var self = this;

        function getHistory(req, order, cb) {
            var Order = models.get(req.session.lastDb, 'manufacturingOrder', ManufacturingOrderSchema);

            var historyOptions = {
                forNote: true,
                dbName : req.session.lastDb,
                id     : order._id
            };

            HistoryService.getHistoryForTrackedObject(historyOptions, function (err, history) {
                var notes;

                if (err) {
                    return cb(err);
                }

                notes = history.map(function (elem) {
                    return {
                        date   : elem.date,
                        history: elem,
                        user   : elem.editedBy
                    };
                });

                if (!order.notes) {
                    order.notes = [];
                }
                order.notes = order.notes.concat(notes);
                order.notes = _.map(order.notes, function (el) {
                    el.date = new Date(el.date);

                    return el;
                });
                order.notes = _.sortBy(order.notes, 'date');
                cb(null, order);

            }, true);

        }

        function getAvailableForRows(req, docs, forSales, cb) {
            var Availability = models.get(req.session.lastDb, 'productsAvailability', AvailabilitySchema);
            var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);
            var GoodsInNote = models.get(req.session.lastDb, 'GoodsInNote', GoodsInSchema);
            var populateDocs = [];
            var allGoodsNotes = [];

            if (docs && docs.length) {
                async.each(docs, function (elem, eachCb) {
                        var product;
                        var warehouseId;

                        var parallelTasks;

                        elem = elem.toJSON();

                        product = elem.product ? elem.product._id : null;
                        warehouseId = elem.warehouse ? objectId(elem.warehouse._id) : null;

                        function getAvailabilities(parallelCb) {
                            Availability.aggregate([{
                                    $match: {
                                        product  : objectId(product),
                                        warehouse: warehouseId
                                    }
                                }, {
                                    $project: {
                                        product      : 1,
                                        warehouse    : 1,
                                        onHand       : 1,
                                        filterRows   : {
                                            $filter: {
                                                input: '$orderRows',
                                                as   : 'elem',
                                                cond : {$eq: ['$$elem.orderRowId', objectId(elem._id)]}
                                            }
                                        },
                                        orderRows    : 1,
                                        goodsOutNotes: 1
                                    }
                                }, {
                                    $unwind: {
                                        path                      : '$goodsOutNotes',
                                        preserveNullAndEmptyArrays: true
                                    }
                                }, {
                                    $lookup: {
                                        from        : 'GoodsNote',
                                        localField  : 'goodsOutNotes.goodsNoteId',
                                        foreignField: '_id',
                                        as          : 'goodsOutNotes.goodsNoteId'
                                    }
                                }, {
                                    $project: {
                                        product    : 1,
                                        warehouse  : 1,
                                        onHand     : 1,
                                        filterRows : 1,
                                        orderRows  : 1,
                                        goodsNoteId: {$arrayElemAt: ['$goodsOutNotes.goodsNoteId', 0]},
                                        quantity   : '$goodsOutNotes.quantity'
                                    }
                                }, {
                                    $project: {
                                        product    : 1,
                                        warehouse  : 1,
                                        onHand     : 1,
                                        filterRows : 1,
                                        quantity   : 1,
                                        goodsNoteId: 1,
                                        allocated  : {
                                            $sum: '$filterRows.quantity'
                                        },

                                        allocatedAll: {
                                            $sum: '$orderRows.quantity'
                                        }
                                    }
                                }, {
                                    $group: {
                                        _id         : '$goodsNoteId.status.shipped',
                                        product     : {$first: '$product'},
                                        warehouse   : {$first: '$warehouse'},
                                        onHand      : {$sum: '$onHand'},
                                        filterRows  : {$first: '$filterRows'},
                                        allocatedAll: {$first: '$allocatedAll'},
                                        allocated   : {$first: '$allocated'},
                                        quantity    : {$sum: '$quantity'}
                                    }
                                }],
                                function (err, availability) {
                                    var availObj = {
                                        inStock: 0
                                    };

                                    if (err) {
                                        return parallelCb(err);
                                    }

                                    availability.forEach(function (el) {
                                        availObj.product = el.product;
                                        availObj.warehouse = el.warehouse;
                                        availObj.onHand = el.onHand;
                                        availObj.filterRows = el.filterRows;
                                        availObj.allocatedAll = el.allocatedAll;
                                        availObj.allocated = el.allocated;

                                        if (!el._id) {
                                            availObj.inStock += el.quantity;
                                        }
                                    });

                                    availObj.inStock += availObj.onHand;

                                    parallelCb(null, [availObj]);
                                }
                            );
                        }

                        function getNotes(parallelCb) {
                            var Model = forSales ? GoodsOutNote : GoodsInNote;

                            Model.aggregate([{
                                $match: {
                                    'orderRows.orderRowId': elem._id,
                                    _type                 : forSales ? 'GoodsOutNote' : 'GoodsInNote',
                                    archived              : {$ne: true}
                                }
                            }, {
                                $lookup: {
                                    from        : 'warehouse',
                                    localField  : 'warehouse',
                                    foreignField: '_id',
                                    as          : 'warehouse'
                                }
                            }, {
                                $lookup: {
                                    from        : 'productsAvailability',
                                    localField  : '_id',
                                    foreignField: 'goodsInNote',
                                    as          : 'goodsInNote'
                                }
                            }, {
                                $lookup: {
                                    from        : 'Users',
                                    localField  : 'status.printedById',
                                    foreignField: '_id',
                                    as          : 'status.printedById'
                                }
                            }, {
                                $lookup: {
                                    from        : 'Users',
                                    localField  : 'status.pickedById',
                                    foreignField: '_id',
                                    as          : 'status.pickedById'
                                }
                            }, {
                                $lookup: {
                                    from        : 'Users',
                                    localField  : 'status.packedById',
                                    foreignField: '_id',
                                    as          : 'status.packedById'
                                }
                            }, {
                                $lookup: {
                                    from        : 'Users',
                                    localField  : 'status.shippedById',
                                    foreignField: '_id',
                                    as          : 'status.shippedById'
                                }
                            }, {
                                $lookup: {
                                    from        : 'Order',
                                    localField  : 'order',
                                    foreignField: '_id',
                                    as          : 'order'
                                }
                            }, {
                                $project: {
                                    name    : '$name',
                                    orderRow: {
                                        $filter: {
                                            input: '$orderRows',
                                            as   : 'elem',
                                            cond : {$eq: ['$$elem.orderRowId', objectId(elem._id)]}
                                        }
                                    },

                                    goodsInNote         : {$arrayElemAt: ['$goodsInNote', 0]},
                                    warehouse           : {$arrayElemAt: ['$warehouse', 0]},
                                    order               : {$arrayElemAt: ['$order', 0]},
                                    'status.printedById': {$arrayElemAt: ['$status.printedById', 0]},
                                    'status.pickedById' : {$arrayElemAt: ['$status.pickedById', 0]},
                                    'status.packedById' : {$arrayElemAt: ['$status.packedById', 0]},
                                    'status.shippedById': {$arrayElemAt: ['$status.shippedById', 0]},
                                    'status.printedOn'  : 1,
                                    'status.pickedOn'   : 1,
                                    'status.packedOn'   : 1,
                                    'status.shippedOn'  : 1,
                                    'status.receivedOn' : 1,
                                    'status.shipped'    : 1,
                                    'status.picked'     : 1,
                                    'status.packed'     : 1,
                                    'status.printed'    : 1
                                }
                            }, {
                                $project: {
                                    name                : '$name',
                                    orderRow            : {$arrayElemAt: ['$orderRow', 0]},
                                    status              : 1,
                                    warehouse           : 1,
                                    'goodsInNote._id'   : 1,
                                    'goodsInNote.onHand': 1,
                                    'order.name'        : 1
                                }
                            }, {
                                $project: {
                                    name        : '$name',
                                    orderRow    : '$orderRow.orderRowId',
                                    quantity    : '$orderRow.quantity',
                                    status      : 1,
                                    warehouse   : 1,
                                    goodsInNote : 1,
                                    'order.name': 1
                                }
                            }], function (err, docs) {
                                if (err) {
                                    return parallelCb(err);
                                }
                                if (docs && docs.length) {
                                    docs = docs.map(function (el) {
                                        el._id = el._id.toJSON();
                                        return el;
                                    });
                                }

                                parallelCb(null, docs);
                            });
                        }

                        parallelTasks = [getNotes, getAvailabilities];

                        async.parallel(parallelTasks, function (err, response) {
                            var availability;
                            var goodsNotes;

                            if (err) {
                                return eachCb(err);
                            }

                            availability = response[1];
                            goodsNotes = response[0];
                            allGoodsNotes = allGoodsNotes.concat(goodsNotes);

                            availability = availability && availability.length ? availability[0] : null;

                            if (availability) {
                                elem.inStock = availability.inStock;
                                elem.onHand = availability.onHand;
                                elem.allocated = availability.allocated;
                            }
                            elem.goodsNotes = goodsNotes;
                            elem.fulfilled = 0;

                            if (goodsNotes && goodsNotes.length) {
                                goodsNotes.forEach(function (el) {
                                    elem.fulfilled += el.quantity;
                                });
                            }
                            populateDocs.push(elem);
                            eachCb();
                        });

                    },
                    function (err) {
                        if (err) {
                            return cb(err);
                        }

                        allGoodsNotes = _.uniq(allGoodsNotes, '_id');

                        cb(null, populateDocs, allGoodsNotes);

                    }
                );
            } else {
                cb();
            }

        }

        function getById(req, res, next) {
            self.getById2(req, res, next, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
        }

        function updateOnlySelectedFields(req, res, next, id, data) {
            var dbName = req.session.lastDb;
            var Order = models.get(dbName, 'manufacturingOrder', ManufacturingOrderSchema);
            var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);
            var deletedOrderRows;
            var newDirname;
            var orderRows;
            var fileName;
            var osType;
            var path;
            var dir;
            var _id;
            var obj;
            var os;

            if (data.orderRows) {
                orderRows = data.orderRows;
                delete data.orderRows;
            }

            if (data.deletedProducts) {
                deletedOrderRows = data.deletedProducts;
                delete data.deletedProducts;
            }

            if (data.notes && data.notes.length !== 0) {
                obj = data.notes[data.notes.length - 1];

                if (!obj._id) {
                    obj._id = mongoose.Types.ObjectId();
                }

                if (!obj.user) {
                    obj.user = {};
                    obj.user._id = req.session.uId;
                    obj.user.login = req.session.uName;
                }

                data.notes[data.notes.length - 1] = obj;
            }

            if (deletedOrderRows) {

                async.each(deletedOrderRows, function (orderRowId, cb) {
                    OrderRows.findByIdAndRemove(orderRowId, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    });
                }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    updateOrderRows();
                });
            } else {
                updateOrderRows();
            }

            function updateOrderRows() {
                if (data.fileName) {

                    fileName = data.fileName;
                    os = require('os');
                    osType = (os.type().split('_')[0]);

                    _id = id;

                    switch (osType) {
                        case 'Windows':
                            newDirname = __dirname.replace('handlers', 'routes');

                            while (newDirname.indexOf('\\') !== -1) {
                                newDirname = newDirname.replace('\\', '\/');
                            }
                            path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                            dir = newDirname + '\/uploads\/' + _id;
                            break;
                        case 'Linux':
                            newDirname = __dirname.replace('handlers', 'routes');

                            while (newDirname.indexOf('\\') !== -1) {
                                newDirname = newDirname.replace('\\', '\/');
                            }
                            path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                            dir = newDirname + '\/uploads\/' + _id;
                            break;
                        //skip default;
                    }

                    fs.unlink(path, function (err) {
                        fs.readdir(dir, function () {
                            if (data.attachments && data.attachments.length === 0) {
                                fs.rmdir(dir, function () {
                                });
                            }
                        });
                    });

                    delete data.fileName;

                    Order.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, order) {
                        if (err) {
                            return next(err);
                        }

                        getById(req, res, next);
                    });

                } else {
                    Order.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, order) {
                        var historyOptions;

                        if (err) {
                            return next(err);
                        }

                        historyOptions = {
                            contentType: 'manufacturingOrder',
                            data       : data,
                            dbName     : dbName,
                            contentId  : id
                        };

                        HistoryService.addEntry(historyOptions, function () {
                            if (orderRows) {
                                async.each(orderRows, function (orderRow, cb) {
                                    var id = orderRow.id;
                                    var row;

                                    if (!id) {
                                        orderRow.order = order._id;
                                        row = new OrderRows(orderRow);
                                        row.save(function (err, elem) {
                                            if (err) {
                                                return cb(err);
                                            }
                                            cb();
                                        });
                                    } else {
                                        delete orderRow.id;
                                        OrderRows.findByIdAndUpdate(id, orderRow, {new: true}, function (err, doc) {
                                            if (err) {
                                                return cb(err);
                                            }
                                            cb();
                                        });
                                    }

                                }, function (err) {
                                    if (err) {
                                        return next(err);
                                    }

                                    //event.emit('recalculateStatus', req, order._id, next);

                                    getById(req, res, next);
                                });

                            } else {
                                getById(req, res, next);
                            }
                        });
                    });
                }
            }
        }

        this.get = function (options, callback) {
            var dbName;
            var mOrder;
            var error;
            var skip = options.skip;
            var sort = options.sort;
            var limit = options.limit;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                error = new Error('Invalid input parameters');
                error.status = 400;

                return callback(error);
            }
            mOrder = models.get(dbName, 'manufacturingOrder', ManufacturingOrderSchema);

            mOrder.aggregate([{
                $lookup: {
                    from        : 'routing',
                    localField  : 'routing',
                    foreignField: '_id',
                    as          : 'routing'
                }
            }, {
                $lookup: {
                    from        : 'manufacturingOrder',
                    localField  : 'source',
                    foreignField: '_id',
                    as          : 'source'
                }
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : 'product',
                    foreignField: '_id',
                    as          : 'product'
                }
            }, {
                $lookup: {
                    from        : 'warehouse',
                    localField  : 'warehouse',
                    foreignField: '_id',
                    as          : 'warehouse'
                }
            }, {
                $lookup: {
                    from        : 'warehouse',
                    localField  : 'warehouseTo',
                    foreignField: '_id',
                    as          : 'warehouseTo'
                }
            }, {
                $lookup: {
                    from        : 'billsOfMaterials',
                    localField  : 'billOfMaterial',
                    foreignField: '_id',
                    as          : 'billOfMaterial'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
                $project: {
                    routing       : {$arrayElemAt: ['$routing', 0]},
                    source        : {$arrayElemAt: ['$source', 0]},
                    product       : {$arrayElemAt: ['$product', 0]},
                    warehouse     : {$arrayElemAt: ['$warehouse', 0]},
                    warehouseTo   : {$arrayElemAt: ['$warehouseTo', 0]},
                    billOfMaterial: {$arrayElemAt: ['$billOfMaterial', 0]},
                    workflow      : {$arrayElemAt: ['$workflow', 0]},
                    status        : 1,
                    name          : 1,
                    deadlineStart : 1,
                    quantity      : 1,
                    createdBy     : 1
                }
            }, {
                $project: {
                    status       : 1,
                    name         : 1,
                    deadlineStart: 1,
                    quantity     : 1,
                    warehouseTo  : 1,
                    createdBy    : 1,
                    removable    : {
                        $cond: {
                            if  : {$or: [{$eq: ['$workflow.status', 'Done']}, {$and: [{$ne: ['$status.fulfillStatus', 'NOR']}, {$ne: ['$status.fulfillStatus', 'NOT']}]}]},
                            then: false,
                            else: true
                        }
                    },

                    routing: {
                        name: 1,
                        _id : 1
                    },

                    source: {
                        _id : 1,
                        name: 1
                    },

                    product: {
                        _id : 1,
                        name: 1
                    },

                    warehouse: {
                        _id : 1,
                        name: 1
                    },

                    billOfMaterial: {
                        _id : 1,
                        name: 1
                    },

                    workflow: {
                        _id : 1,
                        name: 1
                    }
                }
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: {
                    path                      : '$root',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    total         : 1,
                    routing       : '$root.routing',
                    source        : '$root.source',
                    product       : '$root.product',
                    warehouse     : '$root.warehouse',
                    billOfMaterial: '$root.billOfMaterial',
                    workflow      : '$root.workflow',
                    status        : '$root.status',
                    name          : '$root.name',
                    deadlineStart : '$root.deadlineStart',
                    createdBy     : '$root.createdBy',
                    quantity      : '$root.quantity',
                    removable     : '$root.removable',
                    warehouseTo   : '$root.warehouseTo',
                    _id           : '$root._id'
                }
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getById2 = function (req, res, next, cb) {
            var id = req.query.id || req.params.id;
            var Order = models.get(req.session.lastDb, 'manufacturingOrder', ManufacturingOrderSchema);
            var Prepayments = models.get(req.session.lastDb, 'prepayment', PrepaymentSchema);
            var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);
            var Invoice = models.get(req.session.lastDb, 'Invoices', InvoiceSchema);
            var orderRowsSearcher;
            var contentSearcher;
            var prepaymentsSearcher;
            var invoiceSearcher;
            var stockReturnsSearcher;
            var waterfallTasks;
            var goodsId = req.query.goodsId;
            var type = req.query.type;

            if (goodsId) {
                id = goodsId;
            }

            if (id.length < 24) {
                return res.status(400).send();
            }

            contentSearcher = function (waterfallCallback) {
                var query;

                if (goodsId) {
                    goodsOutNotesService.findOne({_id: goodsId}, {dbName: req.session.lastDb}, function (err, goodsNote) {
                        if (err) {
                            return waterfallCallback(err);
                        }

                        id = goodsNote.order;

                        query = Order.findById(id);

                        query
                            .populate('supplier', '_id name fullName address')
                            .populate('destination')
                            .populate('currency._id')
                            .populate('incoterm')
                            .populate('priceList', 'name')
                            .populate('costList', 'name')
                            .populate('warehouse', 'name')
                            .populate('routing')
                            .populate('source')
                            .populate('product')
                            .populate('billOfMaterial')
                            .populate('salesPerson', 'name')
                            .populate('invoiceControl')
                            .populate('paymentTerm')
                            .populate('paymentMethod', '_id name account bank address swiftCode owner')
                            .populate('editedBy.user', '_id login')
                            .populate('deliverTo', '_id, name')
                            .populate('project', '_id name')
                            .populate('shippingMethod', '_id name')
                            .populate('workflow', '_id name status');

                        query.exec(waterfallCallback);
                    });
                } else {
                    query = Order.findById(id);

                    query
                        .populate('supplier', '_id name fullName address')
                        .populate('destination')
                        .populate('currency._id')
                        .populate('incoterm')
                        .populate('priceList', 'name')
                        .populate('costList', 'name')
                        .populate('warehouse', 'name')
                        .populate('warehouseTo', 'name')
                        .populate('salesPerson', 'name')
                        .populate('invoiceControl')
                        .populate('paymentTerm')
                        .populate('paymentMethod', '_id name account bank address swiftCode owner')
                        .populate('editedBy.user', '_id login')
                        .populate('deliverTo', '_id, name')
                        .populate('project', '_id name')
                        .populate('shippingMethod', '_id name')
                        .populate('routing')
                        .populate('source')
                        .populate('product')
                        .populate('billOfMaterial')
                        .populate('workflow', '_id name status');

                    query.exec(waterfallCallback);
                }
            };

            orderRowsSearcher = function (order, waterfallCallback) {

                OrderRows.find({order: order._id})
                    .populate('product', 'cost name sku info')
                    .populate('debitAccount', 'name')
                    .populate('creditAccount', 'name')
                    .populate('taxes.taxCode', 'fullName rate')
                    .populate('warehouse', 'name')
                    .sort('products')
                    .exec(function (err, docs) {
                        if (err) {
                            return waterfallCallback(err);
                        }

                        order = order.toJSON();

                        getAvailableForRows(req, docs, order.forSales, function (err, docs, goodsNotes) {
                            if (err) {
                                return waterfallCallback(err);
                            }

                            order.products = docs;
                            order.account = docs && docs.length ? docs[0].debitAccount : {};

                            if (!order.forSales) {
                                order.account = docs && docs.length ? docs[0].creditAccount : {};
                            }

                            order.goodsNotes = goodsNotes;

                            waterfallCallback(null, order);
                        });

                    });
            };

            prepaymentsSearcher = function (order, waterfallCallback) {
                Prepayments.aggregate([{
                    $match: {
                        order: objectId(id)
                    }
                }, {
                    $project: {
                        paidAmount: 1,
                        currency  : 1,
                        date      : 1,
                        name      : 1,
                        refund    : 1
                    }
                }, {
                    $project: {
                        paidAmount: {$divide: ['$paidAmount', '$currency.rate']},
                        date      : 1,
                        name      : 1,
                        refund    : 1
                    }
                }, {
                    $project: {
                        paidAmount: {$cond: [{$eq: ['$refund', true]}, {$multiply: ['$paidAmount', -1]}, '$paidAmount']},
                        date      : 1,
                        name      : 1,
                        refund    : 1
                    }
                }, {
                    $group: {
                        _id  : null,
                        sum  : {$sum: '$paidAmount'},
                        names: {$push: '$name'},
                        date : {$min: '$date'}
                    }
                }], function (err, result) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    order.prepayment = result && result.length ? result[0] : {};

                    waterfallCallback(null, order);
                });
            };

            invoiceSearcher = function (order, waterfallCallback) {
                Invoice.aggregate([{
                    $match: {
                        sourceDocument: objectId(id)
                    }
                }, {
                    $project: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    order.invoice = result && result.length ? result[0] : {};
                    waterfallCallback(null, order);
                });
            };

            stockReturnsSearcher = function (order, waterfallCallback) {
                StockReturnsService.findForOrder({
                    query : {order: objectId(order._id)},
                    dbName: req.session.lastDb
                }, function (err, docs) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    order.stockReturns = docs || [];

                    waterfallCallback(null, order);
                })
            };

            waterfallTasks = [contentSearcher, orderRowsSearcher, prepaymentsSearcher, invoiceSearcher, stockReturnsSearcher];

            async.waterfall(waterfallTasks, function (err, result) {

                if (err) {
                    return cb(err);
                }

                getHistory(req, result, function (err, order) {
                    if (err) {
                        return cb(err);
                    }

                    return cb(null, order);
                });
            });
        };

        /*   this.getById = function (options, callback) {
         var goodsId = req.query.goodsId;
         var manufacturingOrder;
         var dbName;
         var error;
         var id;

         if (typeof options === 'function') {
         callback = options;
         options = {};
         }

         if (!callback || typeof callback !== 'function') {
         callback = function () {
         };
         }

         dbName = options.dbName;
         id = options.id;
         delete options.dbName;

         if (!dbName) {
         error = new Error('Invalid input parameters');
         error.status = 400;

         return callback(error);
         }

         if (goodsId) {
         id = goodsId;
         }

         manufacturingOrder = models.get(dbName, 'manufacturingOrder', ManufacturingOrderSchema);
         manufacturingOrder.aggregate([{
         $match: {
         _id: objectId(id)
         }
         }, {
         $lookup: {
         from        : 'billsOfMaterials',
         localField  : 'billOfMaterial',
         foreignField: '_id',
         as          : 'billOfMaterial'
         }
         }, {
         $lookup: {
         from        : 'warehouse',
         localField  : 'warehouse',
         foreignField: '_id',
         as          : 'warehouse'
         }
         }, {
         $lookup: {
         from        : 'routing',
         localField  : 'routing',
         foreignField: '_id',
         as          : 'routing'
         }
         }, {
         $lookup: {
         from        : 'Products',
         localField  : 'product',
         foreignField: '_id',
         as          : 'product'
         }
         }, {
         $lookup: {
         from        : 'manufacturingOrder',
         localField  : 'source',
         foreignField: '_id',
         as          : 'source'
         }
         }, {
         $lookup: {
         from        : 'Employees',
         localField  : 'responsible',
         foreignField: '_id',
         as          : 'responsible'
         }
         }, /!*{
         $lookup: {
         from        : 'workflows',
         localField  : 'workflow',
         foreignField: '_id',
         as          : 'workflow'
         }
         }, *!/{
         $project: {
         _id              : 1,
         editedBy         : 1,
         createdBy        : 1,
         workflow         : 1/!*{$arrayElemAt: ['$workflow', 0]}*!/,
         warehouse        : {$arrayElemAt: ['$warehouse', 0]},
         name             : 1,
         deadlineStart    : 1,
         status           : 1,
         quantityToProduce: 1,
         routing          : {$arrayElemAt: ['$routing', 0]},
         product          : {$arrayElemAt: ['$product', 0]},
         responsible      : {$arrayElemAt: ['$responsible', 0]},
         availability     : 1,
         billOfMaterial   : {$arrayElemAt: ['$billOfMaterial', 0]},
         source           : {$arrayElemAt: ['$source', 0]}
         }
         }, {
         $unwind: {
         path                      : '$billOfMaterial.components',
         preserveNullAndEmptyArrays: true
         }
         }, {
         $lookup: {
         from        : 'productsAvailability',
         localField  : 'billOfMaterial.components.component',
         foreignField: 'product',
         as          : 'billOfMaterial.components.availability'
         }
         }, {
         $project: {
         _id              : 1,
         editedBy         : 1,
         createdBy        : 1,
         workflow         : 1,
         warehouse        : 1,
         name             : 1,
         deadlineStart    : 1,
         quantityToProduce: 1,
         routing          : 1,
         status           : 1,
         product          : 1,
         responsible      : 1,
         availability     : 1,
         billOfMaterial   : {
         _id         : 1,
         name        : 1,
         creationDate: 1,
         description : 1,
         quantity    : 1,
         isComponent : 1,
         routing     : 1,
         product     : 1,
         components  : {
         component   : 1,
         quantity    : 1,
         info        : 1,
         availability: {
         $filter: {
         input: '$billOfMaterial.components.availability',
         as   : 'item',
         cond : {$eq: ['$$item.warehouse', '$$ROOT.warehouse._id']}
         }
         }
         }
         },
         source           : 1
         }
         },
         {
         $lookup: {
         from        : 'Products',
         localField  : 'billOfMaterial.components.component',
         foreignField: '_id',
         as          : 'component'
         }
         },
         {
         $project: {
         _id                 : 1,
         editedBy            : 1,
         createdBy           : 1,
         workflow            : 1,
         warehouse           : 1,
         name                : 1,
         deadlineStart       : 1,
         quantityToProduce   : 1,
         routing             : 1,
         product             : 1,
         status              : 1,
         responsible         : 1,
         availability        : 1,
         billOfMaterial      : 1,
         availabilityQuantity: {$arrayElemAt: ['$billOfMaterial.components.availability.goodsOutNotes.quantity', 0]},
         quantityComponent   : '$billOfMaterial.components.quantity',
         infoComponent       : '$billOfMaterial.components.info',
         source              : 1
         }
         }, {
         $group: {
         _id              : '$_id',
         components       : {
         $push: {
         component           : '$component',
         quantity            : '$quantityComponent',
         info                : '$infoComponent',
         availabilityQuantity: {
         $cond: {
         if  : {$gt: ['$availabilityQuantity', 0]},
         then: {$arrayElemAt: ['$availabilityQuantity', 0]},
         else: 0
         }
         }
         }
         },
         editedBy         : {$first: '$editedBy'},
         createdBy        : {$first: '$createdBy'},
         workflow         : {$first: '$workflow'},
         warehouse        : {$first: '$warehouse'},
         name             : {$first: '$name'},
         status           : {$first: '$status'},
         deadlineStart    : {$first: '$deadlineStart'},
         quantityToProduce: {$first: '$quantityToProduce'},
         routing          : {$first: '$routing'},
         product          : {$first: '$product'},
         responsible      : {$first: '$responsible'},
         availability     : {$first: '$availability'},
         billOfMaterial   : {$first: '$billOfMaterial'},
         source           : {$first: '$source'}
         }
         }
         ], function (err, response) {
         if (err) {
         return callback(err);
         }

         callback(null, response);
         }
         );
         };*/

        this.create = function (options, callback) {
            var dbName;
            var Model;
            var model;
            var error;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                error = new Error('Invalid input parameters');
                error.status = 400;

                return callback(error);
            }

            options._id = objectId();
            Model = models.get(dbName, 'manufacturingOrder', ManufacturingOrderSchema);
            model = new Model(options);
            model.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var req = options.req;
            var res = options.res;
            var next = options.next;
            var isCancel = updateObject.cancel || false;
            var isForSale = updateObject.forSales || false;
            var getGoodsOutNotes;
            var removeGoods;
            var updateFields;
            var waterfallTasks;
            var dbName;
            var Model;
            var err;

            delete updateObject.cancel;
            delete updateObject.forSale;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!_id || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            updateObject.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            };
            updateObject.currency = updateObject.currency || {};

            if (isCancel && isForSale) {
                getGoodsOutNotes = function (wCb) {
                    goodsOutNotesService.getByOrder({dbName: dbName, order: objectId(_id)}, wCb);
                };

                removeGoods = function (ids, wCb) {
                    var options = {
                        ids            : ids,
                        dbName         : dbName,
                        req            : req,
                        isManufacturing: true
                    };
                    goodsOutNote.removeByOrder(options, wCb);
                };

                updateFields = function (wCb) {
                    wCb();
                    updateOnlySelectedFields(req, res, next, _id, updateObject);
                };

                waterfallTasks = [getGoodsOutNotes, removeGoods, updateFields];
                async.waterfall(waterfallTasks, function () {

                });

                return false;
            }

            updateOnlySelectedFields(req, res, next, _id, updateObject);
        };

        this.findByIdAndRemove = function (options, callback) {
            var _id = options._id;
            var dbName;
            var Model;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'manufacturingOrder', ManufacturingOrderSchema);
            Model.findByIdAndRemove(_id, function (err, res) {
                if (err) {
                    return callback(err);
                }

                callback(null, res);
            });
        };

        this.update = function (id, body, options, callback) {
            var dbName;
            var Model;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'manufacturingOrder', ManufacturingOrderSchema);

            Model.findByIdAndUpdate(id, {$set: body}, callback)
        };
    };
};
