var mongoose = require('mongoose');
var async = require('async');
var moment = require('../public/js/libs/moment/moment');
var _ = require('lodash');

var ProductSchema = mongoose.Schemas.Products;
var InvoiceSchema = mongoose.Schemas.Invoice;
var OrderSchema = mongoose.Schemas.Order;
var AvailabilitySchema = mongoose.Schemas.productsAvailability;

var Module = function (models) {
        function dateParser(data) {
            return new Date(data.slice(0, 4) + '/1/' + data.slice(4));
        }

        this.getInfoBySalesProducts = function (req, res, next) {
            var dbName = req.session.lastDb;
            var Product = models.get(dbName, 'Product', ProductSchema);
            var Invoice = models.get(dbName, 'Invoices', InvoiceSchema);
            var Order = models.get(dbName, 'Order', OrderSchema);
            var data = req.query;
            var startDate = data.startDate;
            var endDate = data.endDate;
            var isVariant = false;
            var dateRange = {};
            var aggregation;
            var pipeLine;
            if (data.isVariant) {
                isVariant = true;
            }

            if (startDate && endDate) {
                dateRange = {
                    invoiceDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                };
            }

            pipeLine = [{
                $match: dateRange
            }, {
                $lookup: {
                    from        : 'orderRows',
                    localField  : 'sourceDocument',
                    foreignField: 'order',
                    as          : 'orderRows'
                }
            }, {
                $project: {
                    rate     : {$ifNull: ['$currency.rate', 1]},
                    orderRows: 1
                }
            }, {
                $unwind: {
                    path: '$orderRows'
                }
            }, {
                $project: {
                    rate     : 1,
                    product  : '$orderRows.product',
                    orderRows: 1,
                    taxes    : {
                        $divide: [{
                            $sum: '$orderRows.taxes.tax'
                        }, '$rate']
                    },

                    total: {
                        $divide: [{
                            $add: [{
                                $sum: '$orderRows.taxes.tax'
                            }, '$orderRows.subTotal']
                        }, '$rate']
                    }
                }
            }, {
                $group: {
                    _id  : '$product',
                    taxes: {$sum: '$taxes'},
                    total: {$sum: '$total'},
                    units: {$sum: '$orderRows.quantity'}
                }
            }, {
                $group: {
                    _id       : null,
                    root      : {$push: '$$ROOT'},
                    totalSold : {$sum: '$total'},
                    totalUnits: {$sum: '$units'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    _id       : '$root._id',
                    taxes     : '$root.taxes',
                    total     : '$root.total',
                    units     : '$root.units',
                    totalSold : {$cond: {if: {$eq: ['$totalSold', 0]}, then: 1, else: '$totalSold'}},
                    totalUnits: {$cond: {if: {$eq: ['$totalUnits', 0]}, then: 1, else: '$totalUnits'}}
                }
            }, {
                $project: {
                    _id                : '$_id',
                    taxes              : '$taxes',
                    total              : '$total',
                    units              : '$units',
                    totalSold          : 1,
                    totalUnits         : 1,
                    productPercentSales: {$multiply: [{$divide: ['$total', '$totalSold']}, 100]},
                    productPercentUnits: {$multiply: [{$divide: ['$units', '$totalUnits']}, 100]}
                }
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : '_id',
                    foreignField: '_id',
                    as          : 'product'
                }
            }, {
                $project: {
                    _id                : 1,
                    taxes              : 1,
                    total              : 1,
                    units              : 1,
                    totalSold          : 1,
                    totalUnits         : 1,
                    productPercentSales: 1,
                    productPercentUnits: 1,
                    product            : {$arrayElemAt: ['$product', 0]}
                }
            }, {
                $project: {
                    _id                : 1,
                    taxes              : 1,
                    total              : 1,
                    units              : 1,
                    totalSold          : 1,
                    totalUnits         : 1,
                    productPercentSales: 1,
                    productPercentUnits: 1,
                    product            : '$product.name',
                    sku                : '$product.info.SKU'
                }
            }];

            aggregation = Invoice.aggregate(pipeLine);

            aggregation.options = {
                allowDiskUse: true
            };

            aggregation.exec(function (err, result) {
                var reportData = {};
                var topProductPercentSales;
                var topProductSales;
                var topProductPercentUnits;
                var topProductUnits;

                if (err) {
                    return next(err);
                }

                topProductPercentSales = _.max(result, 'productPercentSales');
                topProductSales = _.max(result, 'total');
                topProductPercentUnits = _.max(result, 'productPercentUnits');
                topProductUnits = _.max(result, 'units');

                if (!result.length) {
                    reportData.products = result;
                    reportData.topProductPercentSales = {};
                    reportData.topProductSales = {};
                    reportData.topProductPercentUnits = {};
                    reportData.topProductUnits = {};

                    return res.status(200).send({data: reportData});
                }

                reportData.topProductPercentSales = {
                    _id  : topProductPercentSales._id,
                    name : topProductPercentSales.product,
                    value: topProductPercentSales.productPercentSales
                };

                reportData.topProductSales = {
                    _id  : topProductSales._id,
                    name : topProductSales.product,
                    value: topProductSales.total
                };

                reportData.topProductPercentUnits = {
                    _id  : topProductPercentUnits._id,
                    name : topProductPercentUnits.product,
                    value: topProductPercentUnits.productPercentUnits
                };

                reportData.topProductUnits = {
                    _id  : topProductUnits._id,
                    name : topProductUnits.product,
                    value: topProductUnits.units
                };

                reportData.products = result;

                res.status(200).send({data: reportData});
            });
        };

        this.getIncomingStockReport = function (req, res, next) {
            var dbName = req.session.lastDb;
            var Order = models.get(dbName, 'Order', OrderSchema);
            var data = req.query;
            var startDate = data.startDate;
            var endDate = data.endDate;
            var dateRange = {};
            var aggregation;
            var pipeLine;
            var sort = {
                products: 1
            };
            var sortKey;

            if (data.sort) {
                sort = {};
                sortKey = Object.keys(data.sort)[0];
                sort[sortKey] = parseInt(data.sort[sortKey], 10);
            }

            if (startDate && endDate) {
                dateRange = {
                    orderDate: {
                        $ne : null,
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                };
            }

            function add(a, b) {
                return parseInt(a) + parseInt(b);
            }

            pipeLine = [{
                $match: {
                    $and: [
                        dateRange,
                        {
                            _type: 'purchaseOrders'
                        }, {
                            'status.fulfillStatus': 'NOT'
                        }
                    ]
                }
            }, {
                $lookup: {
                    from        : 'warehouse',
                    localField  : 'warehouse',
                    foreignField: '_id',
                    as          : 'warehouse'
                }
            }, {
                $unwind: {
                    path: '$warehouse'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'supplier',
                    foreignField: '_id',
                    as          : 'customer'
                }
            }, {
                $unwind: {
                    path: '$customer'
                }
            }, {
                $lookup: {
                    from        : 'orderRows',
                    localField  : '_id',
                    foreignField: 'order',
                    as          : 'orderRows'
                }
            }, {
                $unwind: {
                    path: '$orderRows'
                }
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : 'orderRows.product',
                    foreignField: '_id',
                    as          : 'products'
                }
            }, {
                $unwind: {
                    path: '$products'
                }
            }, {
                $lookup: {
                    from        : 'productsAvailability',
                    localField  : 'products._id',
                    foreignField: 'product',
                    as          : 'productsAvailability'
                }
            }, {
                $project: {
                    _id          : '$products._id',
                    products     : '$products.name',
                    variants     : '$products.variants',
                    sku          : '$products.info.SKU',
                    supplier     : '$customer.name',
                    purchaseOrder: '$name',
                    onHand       : {$sum: '$productsAvailability.onHand'},
                    incomingStock: '$orderRows.quantity',
                    total        : {$divide: [{$add: ['$orderRows.unitPrice', {$sum: '$orderRows.taxes.tax'}]}, '$currency.rate']}
                }
            }, {
                $group: {
                    _id          : '$_id',
                    product      : {$first: '$products'},
                    variants     : {$first: '$variants'},
                    sku          : {$first: '$sku'},
                    supplier     : {$first: '$supplier'},
                    purchaseOrder: {$first: '$purchaseOrder'},
                    onHand       : {$push: '$onHand'},
                    incomingStock: {$push: '$incomingStock'},
                    total        : {$push: '$total'}
                }
            }, {
                $project: {
                    products     : '$product',
                    variants     : 1,
                    sku          : '$sku',
                    supplier     : '$supplier',
                    purchaseOrder: '$purchaseOrder',
                    onHand       : {$sum: '$onHand'},
                    incomingStock: '$incomingStock',
                    total        : {$sum: '$total'}
                }
            }, {
                $unwind: {
                    path                      : '$variants',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'ProductOptionsValues',
                    localField  : 'variants',
                    foreignField: '_id',
                    as          : 'variants'
                }
            }, {
                $project: {
                    products     : 1,
                    variants     : {$arrayElemAt: ['$variants', 0]},
                    sku          : 1,
                    supplier     : 1,
                    purchaseOrder: 1,
                    onHand       : 1,
                    incomingStock: 1,
                    total        : 1
                }
            }, {
                $group: {
                    _id          : '$_id',
                    products     : {$first: '$products'},
                    variants     : {$push: {name: '$variants.value'}},
                    sku          : {$first: '$sku'},
                    supplier     : {$first: '$supplier'},
                    purchaseOrder: {$first: '$purchaseOrder'},
                    onHand       : {$first: '$onHand'},
                    incomingStock: {$first: '$incomingStock'},
                    total        : {$first: '$total'},
                }
            }, {
                $sort: sort
            }];

            aggregation = Order.aggregate(pipeLine);

            aggregation.options = {
                allowDiskUse: true
            };

            aggregation.exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                result = _.map(result, function (elem) {
                    elem.incomingStock = elem.incomingStock.reduce(add, 0);
                    return elem;
                });

                res.status(200).send({data: result});
            });
        }
        ;

        this.getScarceProducts = function (req, res, next) {
            var query = req.query;
            var dbName = req.session.lastDb;
            var Product = models.get(dbName, 'Product', ProductSchema);
            var sort = {
                name: 1
            };
            var sortKey;

            if (query.sort) {
                sort = {};
                sortKey = Object.keys(query.sort)[0];
                sort[sortKey] = parseInt(query.sort[sortKey], 10);
            }

            Product.aggregate([{
                $match: {
                    job: null
                }
            }, {
                $lookup: {
                    from        : 'productsAvailability',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'productsAvailabilities'
                }
            }, {
                $unwind: {
                    path                      : '$productsAvailabilities',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    onHand       : {$ifNull: ['$productsAvailabilities.onHand', 0]},
                    sku          : '$info.SKU',
                    name         : '$name',
                    minStockLevel: '$inventory.minStockLevel'
                }
            }, {
                $group: {
                    _id    : '$_id',
                    onHand : {$sum: '$onHand'},
                    product: {
                        $first: '$$ROOT'
                    }
                }
            }, {
                $lookup: {
                    from        : 'orderRows',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'orderRows'
                }
            }, {
                $unwind: {
                    path                      : '$orderRows',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'Order',
                    localField  : 'orderRows.order',
                    foreignField: '_id',
                    as          : 'orders'
                }
            }, {
                $unwind: {
                    path                      : '$orders',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    _id    : '$_id',
                    product: {$first: '$product'},
                    onHand : {$first: '$onHand'},
                    orders : {$push: '$orders'}
                }
            }, {
                $project: {
                    _id    : 1,
                    product: 1,
                    onHand : 1,
                    orders : {
                        $filter: {
                            input: '$orders',
                            as   : 'order',
                            cond : {
                                $and: [
                                    {$eq: ['$$order._type', 'purchaseOrders']},
                                    {$eq: ['$$order.status.shippingStatus', 'NOR']},
                                    {$eq: ['$$order.status.fulfillStatus', 'NOT']},
                                    {$eq: ['$$order.status.allocateStatus', 'NOR']}
                                ]
                            }
                        }
                    }
                }
            }, {
                $unwind: {
                    path                      : '$orders',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'orderRows',
                    localField  : 'orders._id',
                    foreignField: 'order',
                    as          : 'orderRows'
                }
            }, {
                $unwind: {
                    path                      : '$orderRows',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    _id          : '$_id',
                    sku          : {$first: '$product.sku'},
                    name         : {$first: '$product.name'},
                    onHand       : {$first: '$onHand'},
                    minStockLevel: {$first: '$product.minStockLevel'},
                    awaiting     : {$sum: '$orderRows.quantity'}
                }
            }, {
                $project: {
                    _id          : 1,
                    sku          : 1,
                    name         : 1,
                    onHand       : 1,
                    minStockLevel: 1,
                    awaiting     : 1,
                    amtLow       : {$subtract: ['$minStockLevel', '$onHand']}
                }
            }, {
                $match: {
                    amtLow: {
                        $gte: 0
                    }
                }
            }, {
                $sort: sort
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
        };

        this.getProductListingReport = function (req, res, next) {
            var query = req.query;
            var dbName = req.session.lastDb;
            var Product = models.get(dbName, 'Product', ProductSchema);
            var sort = {
                name: 1
            };
            var sortKey;

            if (query.sort) {
                sort = {};
                sortKey = Object.keys(query.sort)[0];
                sort[sortKey] = parseInt(query.sort[sortKey], 10);
            }

            Product.aggregate([{
                $lookup: {
                    from        : 'orderRows',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'orderRows'
                }
            }, {
                $lookup: {
                    from        : 'ProductPrices',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'productPrices'
                }
            }, {
                $lookup: {
                    from        : 'channelLinks',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'channelLinks'
                }
            }, {
                $match: {
                    channelLinks: {$ne: []}
                }
            }, {
                $unwind: {
                    path                      : '$channelLinks',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    dateLinked   : '$channelLinks.creationDate',
                    orderRows    : 1,
                    productPrices: 1,
                    channelLinks : 1,
                    sku          : '$info.SKU',
                    name         : 1
                }
            }, {
                $lookup: {
                    from        : 'integrations',
                    localField  : 'channelLinks.channel',
                    foreignField: '_id',
                    as          : 'channelLinks'
                }
            }, {
                $unwind: {
                    path                      : '$channelLinks',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unwind: {
                    path                      : '$orderRows',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'Order',
                    localField  : 'orderRows.order',
                    foreignField: '_id',
                    as          : 'orders'
                }
            }, {
                $project: {
                    sku          : 1,
                    name         : 1,
                    dateLinked   : 1,
                    channelLinks : 1,
                    productPrices: {
                        $filter: {
                            input: '$productPrices',
                            as   : 'productPrice',
                            cond : {$eq: ['$$productPrice.priceLists', '$channelLinks.priceList']}
                        }
                    },

                    orders: {
                        $filter: {
                            input: '$orders',
                            as   : 'order',
                            cond : {$eq: ['$$order.channel', '$channelLinks._id']}
                        }
                    }
                }
            }, {
                $unwind: '$productPrices'
            }, {
                $project: {
                    sku          : 1,
                    name         : 1,
                    channelLinks : 1,
                    productPrices: {$arrayElemAt: ['$productPrices.prices', 0]},
                    unitsSold    : {$size: '$orders'},
                    dateLinked   : 1
                }
            }, {
                $project: {
                    sku        : 1,
                    name       : 1,
                    price      : '$productPrices.price',
                    channelLink: {
                        name: '$channelLinks.channelName',
                        type: '$channelLinks.type'
                    },

                    unitsSold : 1,
                    dateLinked: 1
                }
            }, {
                $sort: sort
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
        };

        this.getInfoSalesByMonth = function (req, res, next) {
            var dbName = req.session.lastDb;
            var Order = models.get(dbName, 'Order', OrderSchema);
            var data = req.query;
            var startDate = moment(new Date(data.startDate)).add(5, 'hours').startOf('day');
            var endDate = moment(new Date(data.endDate)).endOf('day');
            var dateRange = {};

            if (startDate && endDate) {
                dateRange = {
                    $and: [{
                        orderDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }]
                };
            }

            Order.aggregate([{
                $match: dateRange
            }, {
                $lookup: {
                    from        : 'orderRows',
                    localField  : '_id',
                    foreignField: 'order',
                    as          : 'orderRow'
                }
            }, {
                $match: {
                    orderDate: {
                        $ne: null
                    }
                }
            }, {
                $project: {
                    year         : {$year: '$orderDate'},
                    month        : {$month: '$orderDate'},
                    taxes        : '$paymentInfo.taxes',
                    discount     : '$paymentInfo.discount',
                    currency_rate: '$currency.rate',
                    data         : {
                        order   : '$_id',
                        orderRow: '$orderRow',
                        shipping: {
                            $filter: {
                                input: '$orderRow',
                                as   : 'oRow',
                                cond : {
                                    $eq: ['$$oRow.product', null]
                                }
                            }
                        },

                        gross_sales: {$multiply: [{$sum: '$orderRow.quantity'}, {$sum: '$orderRow.unitPrice'}]}
                    }
                }
            }, {
                $unwind: {
                    path: '$data.orderRow'
                }
            }, {
                $group: {
                    _id          : '$data.order',
                    data         : {$push: '$data'},
                    count        : {$sum: 1},
                    year         : {$first: '$year'},
                    month        : {$first: '$month'},
                    taxes        : {$first: '$taxes'},
                    discount     : {$first: '$discount'},
                    currency_rate: {$first: '$currency_rate'}
                }
            }, {
                $sort: {
                    month: 1
                }
            }, {
                $unwind: {
                    path: '$data'
                }
            }, {
                $project: {
                    _id         : '$_id',
                    discount    : {$divide: [{$sum: '$discount'}, '$currency_rate']},
                    uniqueString: {$sum: [{$multiply: ['$year', 100]}, '$month']},
                    shipping    : {$divide: [{$sum: '$data.shipping.unitPrice'}, 1]},
                    taxes       : {$divide: [{$sum: '$taxes'}, '$currency_rate']},
                    gross_sales : {$divide: [{$sum: '$data.gross_sales'}, '$currency_rate']},
                    data        : '$data'
                }
            }, {
                $project: {
                    _id         : '$_id',
                    discount    : '$discount',
                    uniqueString: '$uniqueString',
                    shipping    : '$shipping',
                    taxes       : '$taxes',
                    gross_sales : '$gross_sales',
                    total_sales : {$subtract: [{$add: ['$shipping', '$taxes', '$gross_sales']}, '$discount']},
                    data        : '$data'
                }
            }, {
                $group: {
                    _id        : '$uniqueString',
                    discount   : {$push: '$discount'},
                    shipping   : {$push: '$shipping'},
                    taxes      : {$push: '$taxes'},
                    gross_sales: {$push: '$gross_sales'},
                    total_sales: {$push: '$total_sales'},
                    data       : {$push: '$data'}
                }
            }, {
                $project: {
                    _id        : '$_id',
                    discount   : {$sum: '$discount'},
                    shipping   : {$sum: '$shipping'},
                    taxes      : {$sum: '$taxes'},
                    gross_sales: {$sum: '$gross_sales'},
                    total_sales: {$sum: '$total_sales'},
                    data       : {$size: '$data'}
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                _.forEach(result, function (item) {
                    if (item && item._id) {
                        item.creationDate = dateParser((item._id).toString());
                    }
                });

                res.status(200).send({data: result});
            });
        };

        this.getInfoSalesByChannel = function (req, res, next) {
            var dbName = req.session.lastDb;
            var Order = models.get(dbName, 'Order', OrderSchema);
            var data = req.query;
            var startDate = data.startDate;
            var endDate = data.endDate;
            var dateRange = {};

            if (startDate && endDate) {
                dateRange = {
                    $and: [{
                        creationDate: {
                            $gte: new Date(startDate)
                        }
                    }, {
                        creationDate: {
                            $lte: new Date(endDate)
                        }
                    }]
                };
            }

            Order.aggregate([{
                $match: dateRange
            }, {
                $lookup: {
                    from        : 'orderRows',
                    localField  : '_id',
                    foreignField: 'order',
                    as          : 'orderRow'
                }
            }, {
                $lookup: {
                    from        : 'integrations',
                    localField  : 'channel',
                    foreignField: '_id',
                    as          : 'channel'
                }
            }, {
                $unwind: {
                    path: '$channel'
                }
            }, {
                $project: {
                    year         : {$year: '$creationDate'},
                    month        : {$month: '$creationDate'},
                    taxes        : '$paymentInfo.taxes',
                    channel      : '$channel.channelName',
                    discount     : '$paymentInfo.discount',
                    currency_rate: '$currency.rate',
                    data         : {
                        quantity     : {$sum: '$orderRow.quantity'},
                        order        : '$_id',
                        orderRow     : '$orderRow',
                        creation_date: '$creationDate',
                        shipping     : {
                            $filter: {
                                input: '$orderRow',
                                as   : 'oRow',
                                cond : {
                                    $eq: ['$$oRow.product', null]
                                }
                            }
                        },
                        gross_sales  : {$multiply: [{$sum: '$orderRow.quantity'}, {$sum: '$orderRow.unitPrice'}]}
                    }
                }
            }, {
                $unwind: {
                    path: '$data.orderRow'
                }
            }, {
                $group: {
                    _id          : '$data.order',
                    data         : {$push: '$data'},
                    count        : {$sum: 1},
                    year         : {$first: '$year'},
                    month        : {$first: '$month'},
                    channel      : {$first: '$channel'},
                    taxes        : {$first: '$taxes'},
                    discount     : {$first: '$discount'},
                    quantity     : {$push: '$data.quantity'},
                    currency_rate: {$first: '$currency_rate'},
                    creation_date: {$first: '$creation_date'}
                }
            }, {
                $sort: {
                    month: 1
                }
            }, {
                $unwind: {
                    path: '$data'
                }
            }, {
                $project: {
                    _id         : '$_id',
                    discount    : {$divide: [{$sum: '$discount'}, '$currency_rate']},
                    uniqueString: {$divide: [{$sum: [{$multiply: ['$year', 100]}, '$month']}, '$currency_rate']},
                    shipping    : {$divide: [{$sum: '$data.shipping.unitPrice'}, 1]},
                    taxes       : {$divide: [{$sum: '$taxes'}, '$currency_rate']},
                    gross_sales : {$divide: [{$sum: '$data.gross_sales'}, '$currency_rate']},
                    channel     : '$channel',
                    data        : '$data',
                    quantity    : {$sum: '$quantity'}
                }
            }, {
                $project: {
                    _id         : '$_id',
                    discount    : '$discount',
                    uniqueString: '$uniqueString',
                    shipping    : '$shipping',
                    taxes       : '$taxes',
                    channel     : '$channel',
                    gross_sales : '$gross_sales',
                    total_sales : {$subtract: [{$add: ['$shipping', '$taxes', '$gross_sales']}, '$discount']},
                    data        : '$data',
                    quantity    : '$quantity'
                }
            }, {
                $group: {
                    _id        : '$channel',
                    data       : {$push: '$data'},
                    discount   : {$push: '$discount'},
                    shipping   : {$push: '$shipping'},
                    taxes      : {$push: '$taxes'},
                    gross_sales: {$push: '$gross_sales'},
                    total_sales: {$push: '$total_sales'},
                    quantity   : {$push: '$quantity'}
                }
            }, {
                $project: {
                    _id        : '$_id',
                    orders     : {$size: '$data'},
                    discount   : {$sum: '$discount'},
                    shipping   : {$sum: '$shipping'},
                    taxes      : {$sum: '$taxes'},
                    gross_sales: {$sum: '$gross_sales'},
                    total_sales: {$sum: '$total_sales'},
                    quantity   : {$sum: '$quantity'}
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                /*_.forEach(result, function (item) {
                 if (item && item._id) {
                 item.creationDate = dateParser((item._id).toString());
                 }
                 })*/

                res.status(200).send({data: result});
            });
        };
    }
    ;

module.exports = Module;