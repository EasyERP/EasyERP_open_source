require('../../models/index.js');

var mongoose = require('mongoose');
var CONSTANTS = require('../../constants/mainConstants');
var async = require('async');
var OrderSchema = mongoose.Schemas.Order;
var QuotationSchema = mongoose.Schemas.Quotation;
var GoodsOutSchema = mongoose.Schemas.GoodsOutNote;
var OrderRowsSchema = mongoose.Schemas.OrderRow;
var JobsSchema = mongoose.Schemas.jobs;
var InvoiceSchema = mongoose.Schemas.Invoices;

var PrepaymentSchema = mongoose.Schemas.Prepayment;

var objectId = mongoose.Types.ObjectId;
var models;
var dbName = 'CRM';
var dbsObject = {};
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var _ = require('../../node_modules/underscore/underscore');

var dbObject = mongoose.createConnection('localhost', dbName);
dbsObject[dbName] = dbObject;
models = require('../../helpers/models')(dbsObject);

var Quotation = models.get(dbName, 'Quotation', QuotationSchema);
var Order = models.get(dbName, 'Order', OrderSchema);
var OrderRows = models.get(dbName, 'orderRows', OrderRowsSchema);
var JobsModel = models.get(dbName, 'jobs', JobsSchema);
var Invoice = models.get(dbName, 'Invoices', InvoiceSchema);
var Payments = models.get(dbName, 'prepayment', PrepaymentSchema);
var GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutSchema);
var AvailabilityService = require('../../helpers/availability')(models);

Quotation.aggregate([{
    $match: {
        forSales: true
    }
}, {
    $unwind: {
        path                      : '$products',
        preserveNullAndEmptyArrays: true
    }
}, {
    $lookup: {
        from        : 'Products',
        localField  : 'products.jobs',
        foreignField: 'job',
        as          : 'products.product'
    }
}, {
    $project: {
        'products.product'    : {$arrayElemAt: ['$products.product', 0]},
        'products.quantity'   : 1,
        'products.description': 1,
        'products.unitPrice'  : 1,
        'products.subTotal'   : 1,
        'products.taxes'      : 1,
        currency              : 1,
        paymentInfo           : 1,
        forSales              : 1,
        type                  : 1,
        isOrder               : 1,
        supplier              : 1,
        project               : 1,
        deliverTo             : 1,
        expectedDate          : 1,
        name                  : 1,
        destination           : 1,
        incoterm              : 1,
        invoiceControl        : 1,
        invoiceRecived        : 1,
        paymentTerm           : 1,
        workflow              : 1,
        whoCanRW              : 1,
        attachments           : 1,
        notes                 : 1,
        groups                : 1,
        creationDate          : 1,
        createdBy             : 1,
        editedBy              : 1
    }
}, {
    $lookup: {
        from        : 'productsAvailability',
        localField  : 'products.product._id',
        foreignField: 'product',
        as          : 'products.avail'
    }
}, {
    $project: {
        'products.avail'      : {$arrayElemAt: ['$products.avail', 0]},
        'products.quantity'   : 1,
        'products.product'    : 1,
        'products.description': 1,
        'products.unitPrice'  : 1,
        'products.subTotal'   : 1,
        'products.taxes'      : 1,
        currency              : 1,
        paymentInfo           : 1,
        forSales              : 1,
        type                  : 1,
        isOrder               : 1,
        supplier              : 1,
        project               : 1,
        deliverTo             : 1,
        expectedDate          : 1,
        name                  : 1,
        destination           : 1,
        incoterm              : 1,
        invoiceControl        : 1,
        invoiceRecived        : 1,
        paymentTerm           : 1,
        workflow              : 1,
        whoCanRW              : 1,
        attachments           : 1,
        notes                 : 1,
        groups                : 1,
        creationDate          : 1,
        createdBy             : 1,
        editedBy              : 1
    }
}, {
    $project: {
        'products.cost'       : '$products.avail.cost',
        'products.warehouse'  : '$products.avail.warehouse',
        'products.quantity'   : 1,
        'products.product'    : 1,
        'products.description': 1,
        'products.unitPrice'  : 1,
        'products.subTotal'   : 1,
        'products.taxes'      : 1,
        currency              : 1,
        paymentInfo           : 1,
        forSales              : 1,
        type                  : 1,
        isOrder               : 1,
        supplier              : 1,
        project               : 1,
        deliverTo             : 1,
        expectedDate          : 1,
        name                  : 1,
        destination           : 1,
        incoterm              : 1,
        invoiceControl        : 1,
        invoiceRecived        : 1,
        paymentTerm           : 1,
        workflow              : 1,
        whoCanRW              : 1,
        attachments           : 1,
        notes                 : 1,
        groups                : 1,
        creationDate          : 1,
        createdBy             : 1,
        editedBy              : 1
    }
}, {
    $group: {
        _id           : '$_id',
        products      : {$push: '$products'},
        currency      : {$first: '$currency'},
        forSales      : {$first: '$forSales'},
        type          : {$first: '$type'},
        isOrder       : {$first: '$isOrder'},
        supplier      : {$first: '$supplier'},
        project       : {$first: '$project'},
        deliverTo     : {$first: '$deliverTo'},
        expectedDate  : {$first: '$expectedDate'},
        paymentInfo   : {$first: '$paymentInfo'},
        name          : {$first: '$name'},
        destination   : {$first: '$destination'},
        incoterm      : {$first: '$incoterm'},
        invoiceControl: {$first: '$invoiceControl'},
        invoiceRecived: {$first: '$invoiceRecived'},
        paymentTerm   : {$first: '$paymentTerm'},
        workflow      : {$first: '$workflow'},
        whoCanRW      : {$first: '$whoCanRW'},
        attachments   : {$first: '$attachments'},
        notes         : {$first: '$notes'},
        groups        : {$first: '$groups'},
        creationDate  : {$first: '$creationDate'},
        createdBy     : {$first: '$createdBy'},
        editedBy      : {$first: '$editedBy'}
    }
}, {
    $lookup: {
        from        : 'Invoice',
        localField  : '_id',
        foreignField: 'sourceDocument',
        as          : 'invoice'
    }
}, {
    $project: {
        invoice       : 1,
        invoiceDate   : {$min: '$invoice.invoiceDate'},
        products      : 1,
        currency      : 1,
        paymentInfo   : 1,
        forSales      : 1,
        type          : 1,
        isOrder       : 1,
        supplier      : 1,
        project       : 1,
        deliverTo     : 1,
        expectedDate  : 1,
        name          : 1,
        destination   : 1,
        incoterm      : 1,
        invoiceControl: 1,
        invoiceRecived: 1,
        paymentTerm   : 1,
        workflow      : 1,
        whoCanRW      : 1,
        attachments   : 1,
        notes         : 1,
        groups        : 1,
        creationDate  : 1,
        createdBy     : 1,
        editedBy      : 1
    }
}], function (err, result) {
    if (err) {
        return console.log(err);
    }

    async.each(result, function (quot, cb) {
        var arr;
        var arrayRows = quot.products;
        var order;
        var invoice;
        var updateInvoice = false;
        var invoiceId;
        var obj = {};

        if (quot.creationDate > quot.invoiceDate) {
            quot.orderDate = quot.invoiceDate;
            quot.date = quot.invoiceDate;
            quot.creationDate = quot.invoiceDate;
            quot.createdBy.date = quot.invoiceDate;
        }

        invoice = _.find(quot.invoice, function (el) {
            return el._type !== 'Proforma';
        });

        var proformas = _.find(quot.invoice, function (el) {
            return el._type === 'Proforma';
        });

        if (!proformas || !proformas.length) {
            proformas = proformas ? [proformas] : [];
        }

        arr = arrayRows.map(function (elem) {
            elem._id = objectId();
            elem.product = elem.product ? objectId(elem.product._id) : null;
            elem.warehouse = objectId(elem.warehouse);
            elem.debitAccount = '565eb53a6aa50532e5df0be2';
            elem.creditAccount = '565eb53a6aa50532e5df0bc8';
            elem.order = quot._id;
            elem.quantity = 1;
            elem.cost = quot.cost || 0;

            return elem;
        });

        if (!quot.isOrder) {
            quot.status = {
                allocateStatus: 'NOT',
                fulfillStatus : 'NOT',
                shippingStatus: 'NOT'
            };

            quot.workflow = '55647b932e4aa3804a765ec5';
        } else if (invoice) {
            quot.workflow = '55647b962e4aa3804a765ec6';
            invoiceId = invoice._id;
            updateInvoice = true;

            quot.status = {
                allocateStatus: 'ALL',
                fulfillStatus : 'ALL',
                shippingStatus: 'ALL'
            };
        }

        order = new Order(quot);

        order.warehouse = '57dfc6ea6066337b771e99e2';

        order.save(function (err, _order) {

            OrderRows.collection.insertMany(arr, function (err, docs) {
                var insertedIds;

                var goodsOutNote;

                var orderRows = arr.map(function (element, index) {

                    element.orderRowId = docs.insertedIds[index];
                    delete element._id;

                    return element;
                });

                if (err) {
                    return console.log(err);
                }

                insertedIds = docs.insertedIds;

                goodsOutNote = new GoodsOutNote({
                    order    : order._id,
                    name     : order.name,
                    warehouse: order.warehouse,
                    orderRows: orderRows,
                    status   : {
                        "shipped"  : true,
                        "picked"   : true,
                        "packed"   : true,
                        "printed"  : true,
                        "shippedOn": quot.invoiceDate ? new Date(quot.invoiceDate) : new Date(),
                        "pickedOn" : quot.invoiceDate ? new Date(quot.invoiceDate) : new Date(),
                        "packedOn" : quot.invoiceDate ? new Date(quot.invoiceDate) : new Date(),
                        "printedOn": quot.invoiceDate ? new Date(quot.invoiceDate) : new Date()
                    }
                });

                if (invoice && invoiceId) {
                    goodsOutNote.save(function (err, doc) {
                        if (err) {
                            return console.log(err);
                        }

                        var options = {
                            dbName: dbName,
                            doc   : doc.toJSON()
                        };
                        AvailabilityService.updateAvailableProducts(options, function (err, docs) {
                            if (err) {
                                return console.log(err);
                            }
                            GoodsOutNote.findByIdAndUpdate(doc._id, {orderRows: docs}, {new: true}, function (err, result) {
                                if (err) {
                                    return console.log(err);
                                }
                                AvailabilityService.deliverProducts({
                                    dbName      : dbName,
                                    uId         : null,
                                    goodsOutNote: result.toJSON()
                                }, function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    OrderRows.aggregate([{
                                        $match: {_id: {$in: insertedIds}}
                                    }, {
                                        $lookup: {
                                            from        : 'Products',
                                            localField  : 'product',
                                            foreignField: '_id',
                                            as          : 'product'
                                        }
                                    }, {
                                        $project: {
                                            product: {$arrayElemAt: ['$product', 0]}
                                        }
                                    }, {
                                        $group: {
                                            _id : null,
                                            jobs: {$addToSet: '$product.job'}
                                        }
                                    }], function (err, result) {
                                        var jobIds;
                                        var body;

                                        if (err) {
                                            return console.log(err);
                                        }

                                        if (updateInvoice) {
                                            body = {
                                                order: order._id,
                                                type : 'Invoiced'
                                            };
                                        } else {
                                            body = {
                                                order: order._id,
                                                type : 'Ordered'
                                            };
                                        }

                                        jobIds = result && result.length ? result[0].jobs : [];

                                        JobsModel.update({_id: {$in: jobIds}}, {$set: body}, {multi: true}, function (err, result) {
                                            if (err) {
                                                return console.log(err);
                                            }

                                            var doubleCb = _.after(2, cb);

                                            if (updateInvoice) {
                                                obj.sourceDocument = order._id;
                                                obj._type = 'Invoices';
                                                obj.$unset = {products: ''};
                                                Invoice.findByIdAndUpdate(invoiceId, {$set: obj}, {new: true}, function (err, result) {
                                                    if (err) {
                                                        return doubleCb(err);
                                                    }

                                                    Payments.update({
                                                        invoice: invoiceId,
                                                        _type  : {$ne: 'ProformaPayment'}
                                                    }, {
                                                        $set: {
                                                            bankExpenses  : {
                                                                amount : 0,
                                                                account: null
                                                            }, overPayment: {
                                                                amount : 0,
                                                                account: null
                                                            }
                                                        }
                                                    }, {multi: true}, function (err, res) {
                                                        doubleCb();
                                                    });
                                                });
                                            } else {
                                                doubleCb();
                                            }

                                            if (proformas && proformas.length) {
                                                async.each(proformas, function (pro, callback) {
                                                    Payments.update({_id: {$in: pro.payments}}, {
                                                        $set: {
                                                            order         : _order._id,
                                                            _type         : 'prepayment',
                                                            bankExpenses  : {
                                                                amount : 0,
                                                                account: null
                                                            }, overPayment: {
                                                                amount : 0,
                                                                account: null
                                                            }
                                                        }
                                                    }, {multi: true}, function (err, result) {
                                                        Payments.update({_id: {$in: pro.payments}}, {
                                                            $unset: {invoice: ''}
                                                        }, {multi: true}, function (err, result) {
                                                            callback();
                                                        });
                                                    });
                                                }, doubleCb);

                                            } else {
                                                doubleCb();
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                } else {
                    OrderRows.aggregate([{
                        $match: {_id: {$in: insertedIds}}
                    }, {
                        $lookup: {
                            from        : 'Products',
                            localField  : 'product',
                            foreignField: '_id',
                            as          : 'product'
                        }
                    }, {
                        $project: {
                            product: {$arrayElemAt: ['$product', 0]}
                        }
                    }, {
                        $group: {
                            _id : null,
                            jobs: {$addToSet: '$product.job'}
                        }
                    }], function (err, result) {
                        var jobIds;
                        var body;

                        if (err) {
                            return console.log(err);
                        }

                        body = {
                            order: order._id,
                            type : 'Ordered'
                        };

                        jobIds = result && result.length ? result[0].jobs : [];

                        JobsModel.update({_id: {$in: jobIds}}, {$set: body}, {multi: true}, function (err, result) {
                            if (err) {
                                return console.log(err);
                            }

                            var doubleCb = _.after(2, cb);

                            if (updateInvoice) {
                                obj.sourceDocument = order._id;
                                obj._type = 'Invoices';
                                obj.$unset = {products: ''};
                                Invoice.findByIdAndUpdate(invoiceId, {$set: obj}, {new: true}, function (err, result) {
                                    if (err) {
                                        return doubleCb(err);
                                    }

                                    Payments.update({invoice: invoiceId, _type: {$ne: 'ProformaPayment'}}, {
                                        $set: {
                                            bankExpenses  : {
                                                amount : 0,
                                                account: null
                                            }, overPayment: {
                                                amount : 0,
                                                account: null
                                            }
                                        }
                                    }, {multi: true}, function (err, res) {
                                        doubleCb();
                                    });
                                });
                            } else {
                                doubleCb();
                            }

                            if (proformas && proformas.length) {
                                async.each(proformas, function (pro, callback) {
                                    Payments.update({_id: {$in: pro.payments}}, {
                                        $set: {
                                            order         : _order._id,
                                            _type         : 'prepayment',
                                            bankExpenses  : {
                                                amount : 0,
                                                account: null
                                            }, overPayment: {
                                                amount : 0,
                                                account: null
                                            }
                                        }
                                    }, {multi: true}, function (err, result) {
                                        Payments.update({_id: {$in: pro.payments}}, {
                                            $unset: {invoice: ''}
                                        }, {multi: true}, function (err, result) {
                                            callback();
                                        });
                                    });
                                }, doubleCb);

                            } else {
                                doubleCb();
                            }
                        });
                    });
                }

            });
        });

    }, function () {
        console.log('good');
    });
});