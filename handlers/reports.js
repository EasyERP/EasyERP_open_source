var mongoose = require('mongoose');
var async = require('async');
var moment = require('../public/js/libs/moment/moment');
var _ = require('lodash');
var reportConst = require('../public/js/constants/customReports');
var REPORT_CONSTANTS = reportConst.reports;
var TOTAL_CONSTANTS = reportConst.total;
var ProductSchema = mongoose.Schemas.Products;

var InvoiceSchema = mongoose.Schemas.Invoice;
var OrderSchema = mongoose.Schemas.Order;
var AvailabilitySchema = mongoose.Schemas.productsAvailability;
var exporter = require('../helpers/exporter/exportDecorator');

var Module = function (models) {
    var FilterMapper = require('../helpers/filterMapper');
    var customReportsService = require('../services/customReports')(models);
    var employeeService = require('../services/employee')(models);
    var customerService = require('../services/customer')(models);
    var AvailabilityService = require('../services/productAvailability')(models);
    var usersService = require('../services/user')(models);
    var GoodsOutNoteService = require('../services/goodsOutNotes')(models);
    var GoodsInNoteService = require('../services/goodsInNotes')(models);
    var opportunitiesService = require('../services/opportunitie')(models);

    var reportsMapper;

    function dateParser(data) {
        return new Date(data.slice(0, 4) + '/' + data.slice(4) + '/1');
    }

    function getSalesByProduct(options, callback) {
        var startDate = options.dateRange && options.dateRange.from;
        var endDate = options.dateRange && options.dateRange.to;
        var dbName = options.dbName;
        var isVariant = false;
        var rowsMapper = {
            product          : '$product',
            sku              : '$sku',
            taxes            : '$taxes',
            grossSales       : '$total',
            grossSalesPercent: '$productPercentSales',
            unitsSold        : '$units',
            unitsPercent     : '$productPercentUnits'
        };
        var projectRows = options.rows;
        var dateRange = {};
        var sort = {
            sku: 1
        };
        var aggregation;
        var pipeLine;
        var Product;
        var sortKey;
        var Invoice;
        var Order;
        var error;

        if (!dbName) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        Product = models.get(dbName, 'Product', ProductSchema);
        Invoice = models.get(dbName, 'Invoices', InvoiceSchema);
        Order = models.get(dbName, 'Order', OrderSchema);

        if (startDate && endDate) {
            dateRange = {
                invoiceDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        if (options.sort) {
            sort = {};
            sortKey = Object.keys(options.sort)[0];
            sort[sortKey] = parseInt(options.sort[sortKey], 10);
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

        Object.keys(rowsMapper).forEach(function (rowName) {
            if (projectRows.indexOf(rowName) === -1) {
                delete rowsMapper[rowName];
            }
        });

        pipeLine.push({
            $project: rowsMapper
        }, {
            $sort: sort
        });

        if (!callback || typeof callback !== 'function') {
            return pipeLine;
        }

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
                return callback(err);
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

                return callback(null, {data: reportData.products});
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

            callback(null, {
                data: reportData.products
            });
        });
    }

    function getOpportunitiesByParam(options, callback) {
        opportunitiesService.getByParam(options, function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
    }

    function getSalesByMonth(options, callback) {
        var dbName = options.dbName;
        var startDate = options.dateRange && options.dateRange.from && moment(new Date(options.dateRange.from)).add(5, 'hours').startOf('day');
        var endDate = options.dateRange && options.dateRange.to && moment(new Date(options.dateRange.to)).endOf('day');
        var projectRows = options.rows;
        var sort = {
            month: 1
        };
        var dateRange = {};
        var rowsMapper = {};
        var aggregatePipeline;
        var sortKey;
        var Order;

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

        if (options.sort) {
            sort = {};
            sortKey = Object.keys(options.sort)[0];
            sort[sortKey] = parseInt(options.sort[sortKey], 10);
        }

        Order = models.get(dbName, 'Order', OrderSchema);

        aggregatePipeline = [{
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
        }, {
            $sort: sort
        }];

        projectRows.forEach(function (row) {
            rowsMapper[row] = 1;
        });

        aggregatePipeline.push({
            $project: rowsMapper
        });

        Order.aggregate(aggregatePipeline, function (err, result) {
            if (err) {
                return callback(err);
            }

            _.forEach(result, function (item) {
                if (item && item._id) {
                    item.month = moment(dateParser((item._id).toString())).format('MMMM-YYYY');
                }
            });

            callback(null, {data: result});
        });
    }

    function getSalesByChannel(options, callback) {
        var startDate = options.dateRange && options.dateRange.from;
        var endDate = options.dateRange && options.dateRange.to;
        var dbName = options.dbName;
        var dateRange = {};
        var rowsMapper = {
            channelName    : '$_id',
            order          : '$orders',
            orderedQuantity: '$quantity',
            grossSales     : '$gross_sales',
            totalSales     : '$total_sales',
            tax            : '$taxes',
            discount       : '$discount',
            shipping       : '$shipping'
        };
        var sort = {
            channelName: 1
        };
        var projectRows = options.rows;
        var aggregationPipeline;
        var sortKey;
        var Order;
        var error;

        if (!dbName) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        Order = models.get(dbName, 'Order', OrderSchema);

        if (startDate && endDate) {
            dateRange = {
                $and: [{
                    orderDate: {
                        $gte: new Date(startDate)
                    }
                }, {
                    orderDate: {
                        $lte: new Date(endDate)
                    }
                }]
            };
        }

        if (options.sort) {
            sort = {};
            sortKey = Object.keys(options.sort)[0];
            sort[sortKey] = parseInt(options.sort[sortKey], 10);
        }

        aggregationPipeline = [{
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
                orderRow     : 1,
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

                    gross_sales: {$multiply: [{$sum: '$orderRow.quantity'}, {$sum: '$orderRow.unitPrice'}]}
                }
            }
        }, {
            $unwind: {
                path                      : '$data.orderRow',
                preserveNullAndEmptyArrays: true
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
                path                      : '$data',
                preserveNullAndEmptyArrays: true
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
                gross_sales: {$sum: '$gross_sales'},
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
                gross_sales: 1,
                total_sales: {$sum: '$total_sales'},
                quantity   : {$sum: '$quantity'}
            }
        }];

        Object.keys(rowsMapper).forEach(function (row) {
            if (projectRows.indexOf(row) === -1) {
                delete rowsMapper[row];
            }
        });

        aggregationPipeline.push({
            $project: rowsMapper
        }, {
            $sort: sort
        });

        Order.aggregate(aggregationPipeline, function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, {data: result});
        });
    }

    function getIncomingStockReport(options, callback) {
        var startDate = options.dateRange && options.dateRange.from;
        var endDate = options.dateRange && options.dateRange.to;
        var dbName = options.dbName;
        var sort = {
            product: 1
        };
        var projectedRows = options.rows;
        var rowsMapper = {};
        var dateRange = {};
        var aggregation;
        var groupStage;
        var sortStage;
        var pipeLine;
        var sortKey;
        var Order;

        Order = models.get(dbName, 'Order', OrderSchema);

        if (startDate && endDate) {
            dateRange = {
                orderDate: {
                    $ne : null,
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        if (options.sort) {
            sort = {};
            sortKey = Object.keys(options.sort)[0];
            sort[sortKey] = parseInt(options.sort[sortKey], 10);
        }

        function add(a, b) {
            return parseInt(a, 10) + parseInt(b, 10);
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
        }];
        groupStage = {
            $group: {
                _id: '$_id'
            }
        };
        sortStage = {
            $sort: sort
        };

        projectedRows.forEach(function (row) {
            rowsMapper[row] = 1;

            if (row === 'variants') {
                groupStage.$group[row] = {$push: {name: '$variants.value'}};
            } else {
                groupStage.$group[row] = {
                    $first: '$' + row
                };
            }
        });

        pipeLine.push({
            $project: rowsMapper
        }, groupStage, sortStage);

        aggregation = Order.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return callback(err);
            }

            if (projectedRows.indexOf('incomingStock') >= 0) {
                result = _.map(result, function (elem) {
                    elem.incomingStock = elem.incomingStock.reduce(add, 0);
                    return elem;
                });
            }

            callback(null, {data: result});
        });
    }

    function getLowStockReport(options, callback) {
        var dbName = options.dbName;
        var Product;
        var sort = {
            name: 1
        };
        var aggregationPipeline;
        var rowsMapper = {
            product      : '$name',
            sku          : 1,
            avalStock    : '$onHand',
            lowAlertLevel: '$minStockLevel',
            atmLow       : '$amtLow',
            awaiting     : 1
        };
        var matchStage;
        var sortStage;
        var projectRows = options.rows;
        var sortKey;
        var error;

        if (options.sort) {
            sort = {};
            sortKey = Object.keys(options.sort)[0];
            sort[sortKey] = parseInt(options.sort[sortKey], 10);
        }

        if (!dbName) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        Product = models.get(dbName, 'Product', ProductSchema);

        aggregationPipeline = [{
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
        }];

        matchStage = {
            $match: {
                atmLow: {
                    $gte: 0
                }
            }
        };
        sortStage = {
            $sort: sort
        };

        Object.keys(rowsMapper).forEach(function (row) {
            if (projectRows.indexOf(row) === -1) {
                delete rowsMapper[row];
            }
        });

        rowsMapper._id = 1;

        aggregationPipeline.push({$project: rowsMapper}, matchStage, sortStage);

        Product.aggregate(aggregationPipeline, function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, {data: result});
        });
    }

    function getProductListingReport(options, callback) {
        var dbName = options.dbName;
        var Product = models.get(dbName, 'Product', ProductSchema);
        var sort = {
            name: 1
        };
        var rowsMapper = {
            variant     : '$name',
            sku         : 1,
            salesChannel: '$channelLink',
            listingPrice: '$price',
            unitSold    : '$unitsSold',
            dateLinked  : 1
        };
        var projectRows = options.rows;
        var aggregationPipeline;
        var sortStage;
        var sortKey;
        var error;

        if (!dbName) {
            error = new Error('Invalid parameters');
            error.status = 400;
            return callback(error);

        }

        if (options.sort) {
            sort = {};
            sortKey = Object.keys(options.sort)[0];
            sort[sortKey] = parseInt(options.sort[sortKey], 10);
        }

        aggregationPipeline = [{
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
        }];

        sortStage = {
            $sort: sort
        };

        Object.keys(rowsMapper).forEach(function (row) {
            if (projectRows.indexOf(row) === -1) {
                delete rowsMapper[row];
            }
        });

        aggregationPipeline.push({
            $project: rowsMapper
        }, sortStage);

        Product = models.get(dbName, 'Product', ProductSchema);
        Product.aggregate(aggregationPipeline, function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, {data: result});
        });
    }

    function getStockDetailsReport(options, callback) {
        var limit = parseInt(options.count, 10);
        var skip = (parseInt(options.page || 1, 10) - 1) * limit;
        var obj = {};
        var filterMapper = new FilterMapper();
        var rowsMapper = {
            sku         : '$product.info.SKU',
            productName : '$product.name',
            options     : '$variants',
            warehouse   : '$warehouse.name',
            receivedDate: '$product.createdBy.date',
            po          : '$order.name',
            aisle       : '$location.groupingA',
            bay         : '$location.groupingB',
            shelf       : '$location.groupingC',
            bin         : '$location.groupingD',
            inStock     : '$inStock',
            lowStock    : '$product.inventory.minStockLevel',
            allocated   : '$allocated',
            onHand      : '$onHand',
            unitCost    : '$cost',
            totalCost   : '$value',
            total       : 1
        };
        var projectRows = options.rows;
        var serviceOptions;
        var keys;
        var sort;

        if (options.filter) {
            obj.$and = [];
            obj.$and.push(filterMapper.mapFilter(options.filter, 'DealTasks'));
        }

        if (options.sort) {
            keys = Object.keys(options.sort)[0];
            options.sort[keys] = parseInt(options.sort[keys], 10);
            sort = options.sort;
        } else {
            sort = {'dueDate': -1};
        }

        serviceOptions = {
            sort  : sort,
            dbName: options.dbName,
            skip  : skip,
            limit : limit,
            match : obj
        };

        Object.keys(rowsMapper).forEach(function (row) {
            if (projectRows.indexOf(row) === -1) {
                delete rowsMapper[row];
            }
        });

        serviceOptions.finalProject = rowsMapper;

        AvailabilityService.getList(serviceOptions, function (err, result) {
            var count;
            var response = {};

            if (err) {
                return callback(err);
            }

            count = result[0] && result[0].total ? result[0].total : 0;

            response.total = count;
            response.data = result;

            callback(null, response);
        });
    }

    function getDataById(options, callback) {
        var reportId = options.reportId;
        var sort = options.sort;
        var dbName = options.dbName;
        var forExport = options.forExport || false;
        var error;

        if (!reportId || !dbName) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        customReportsService.findOne({_id: reportId}, {dbName: dbName}, function (err, resultModel) {
            var currentReportHeaders;
            var reportCategory;
            var reportOptions;
            var headerFields;
            var reportType;
            var error;
            var rows;

            if (err) {
                return callback(err);
            }

            if (!resultModel) {
                error = new Error('Reports not found');
                error.status = 404;

                return callback(error);
            }

            reportOptions = resultModel.toJSON();
            reportOptions.dbName = dbName;
            reportOptions.sort = sort;
            reportOptions.sort = sort;
            reportOptions.forExport = forExport;

            rows = reportOptions.rows;
            reportType = reportOptions.reportType;
            reportCategory = reportOptions.reportCategory;
            reportOptions.groupBy = REPORT_CONSTANTS[reportCategory][reportType][0].groupBy;

            reportsMapper[reportType](reportOptions, function (err, result) {
                var reportsHeader = {};
                var totalObj = {};
                var totalKeysArray;

                if (err) {
                    return callback(err);
                }

                if (!result) {
                    error = new Error('Report not found');
                    error.status = 400;

                    return callback(error);
                }

                currentReportHeaders = REPORT_CONSTANTS[reportCategory][reportType][0];
                headerFields = Object.keys(currentReportHeaders);

                if (reportCategory === 'salesReports' || reportCategory === 'stockDetails') {
                    totalKeysArray = TOTAL_CONSTANTS[reportCategory][reportType];

                    result.data.forEach(function (report) {
                        Object.keys(report).forEach(function (key) {
                            if (totalKeysArray.indexOf(key) !== -1) {
                                if (!totalObj[key]) {
                                    totalObj[key] = 0;
                                }

                                totalObj[key] += report[key];
                            }
                        });
                    });
                }

                rows.forEach(function (row) {
                    reportsHeader[row] = currentReportHeaders[row];
                });

                result.type = reportType;
                result.category = reportCategory;
                result.headerMapper = reportsHeader;
                result.total = totalObj;
                //result.forExport = forExport;

                callback(null, result, rows);
            });
        });
    }

    function sortByEmployees(options, callback) {
        var dbName = options.dbName;
        var sortKeys;
        var sort;
        var error;
        var indexOfHired;
        var indexOfFired;
        var startDate;
        var endDate;
        var dateRange;
        var filedSort = {};
        var checkHired;
        var groupBy = options.groupBy;

        if (options.reportType === 'employeesByHiredPeriod' || options.reportType === 'employeesByFiredPeriod') {
            startDate = options.dateRange && options.dateRange.from && moment(new Date(options.dateRange.from)).add(5, 'hours').startOf('day');
            endDate = options.dateRange && options.dateRange.to && moment(new Date(options.dateRange.to)).endOf('day');
            dateRange = {};
            checkHired = options.reportType === 'employeesByHiredPeriod' ? true : false;
        }

        if (startDate && endDate) {
            dateRange = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        filedSort[groupBy] = 1;

        if (options.sort) {
            filedSort = _.extend(filedSort, options.sort);
        }

        if (filedSort) {
            sort = {};
            sortKeys = Object.keys(filedSort);
            indexOfFired = sortKeys.indexOf('fired');
            indexOfHired = sortKeys.indexOf('hired');
            sortKeys.forEach(function (key) {
                if (indexOfHired > -1) {
                    sort['hired'] = parseInt(filedSort['hired'], 10);
                    return;
                }
                if (indexOfFired > -1) {
                    sort['fired'] = parseInt(filedSort['fired'], 10);
                }
                if (key !== 'name') {
                    sort[key] = parseInt(filedSort[key], 10);
                } else {
                    sort['name.last'] = parseInt(filedSort['name'], 10);
                    sort['name.first'] = parseInt(filedSort['name'], 10);
                }
            });
        }

        sort = {
            $sort: sort
        };

        if (!dbName) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        employeeService.sortByFiled({
            dbName   : dbName,
            sort     : sort,
            dateRange: dateRange,
            hired    : checkHired
        }, function (err, resultModel) {
            var error;

            if (err) {
                return callback(err);
            }

            if (!resultModel) {
                error = new Error('Employees not found');
                error.status = 404;

                return callback(error);
            }
            callback(null, {
                data: resultModel
            });
        });
    }

    this.warehouseMovements = function (req, res, next) {
        var dateRange = req.query.dateRange || req.query.filter.date.value;

        console.log(dateRange);
        getProductsAvailability({
            dbName   : req.session.lastDb,
            dateRange: dateRange,
            sort     : req.query.sort
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result.data);
        });
    };

    function getProductsAvailability(options, callback) {
        var dbName = options.dbName;
        var startDate = options.dateRange && options.dateRange.from ? moment(new Date(options.dateRange.from)).startOf('day') : moment(new Date(options.dateRange[0])).startOf('day');
        var endDate = options.dateRange && options.dateRange.to ? moment(new Date(options.dateRange.to)).endOf('day') : moment(new Date(options.dateRange[1])).endOf('day');
        var sort;

        if (!dbName) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        var optionsParam = {
            startDate: startDate,
            endDate  : endDate,
            dbName   : dbName
        };

        if (options.sort) {
            sort = options.sort;
        }

        async.parallel(
            {
                openingBalanceIn : function (cb) {
                    GoodsInNoteService.getBeforeStartDate(optionsParam, cb);
                },
                openingBalanceOut: function (cb) {
                    GoodsOutNoteService.getBeforeStartDate(optionsParam, cb);
                },
                inwards          : function (cb) {
                    GoodsInNoteService.getBetwenDates(optionsParam, cb);
                },
                outwards         : function (cb) {
                    GoodsOutNoteService.getBetwenDates(optionsParam, cb);
                }
            },
            function (err, result) {
                if (err) {
                    return callback(err);
                }

                getDifference(result, sort, function (newResult) {
                    callback(null, {data: newResult});
                });
            }
        );
    }

    function getDifference(result, sort, callback) {
        var openingBalance = [];
        var wards = result.inwards.concat(result.outwards).concat(result.openingBalanceIn).concat(result.openingBalanceOut);
        var ids = {};
        var warehouses = {};

        wards.forEach(function (item) {
            if (item._id) {
                item._id = item._id.toString();
                if (!ids[item._id]) {
                    ids[item._id] = true;
                }
            }

            if (item.warehouseId) {
                item.warehouseId = item.warehouseId.toString();
                if (!warehouses[item.warehouseId]) {
                    warehouses[item.warehouseId] = true;
                }
            }
        });

        ids = Object.keys(ids);
        warehouses = Object.keys(warehouses);

        ids.forEach(function (id) {
            var buff = _.where(wards, {
                '_id': id
            });

            warehouses.forEach(function (warehouse) {
                var buffWarehouses = _.where(buff, {
                    'warehouseId': warehouse
                });

                var obj = {
                    openingBalanceIn : 0,
                    openingBalanceOut: 0,
                    inwards          : 0,
                    outwards         : 0
                };
                buffWarehouses.forEach(function (itm) {

                    obj.name = itm.name;
                    obj.sku = itm.sku;
                    obj._id = id;

                    if (itm.warehouse) {
                        obj.warehouse = itm.warehouse;
                    }

                    if (itm.openingQuantityOut) {
                        obj.openingBalanceOut += itm.openingQuantityOut;
                    }
                    if (itm.openingQuantityIn) {
                        obj.openingBalanceIn += itm.openingQuantityIn;
                    }
                    if (itm.inwardsQuantity) {
                        obj.inwards += itm.inwardsQuantity;
                    }
                    if (itm.outwardsQuantity) {
                        obj.outwards += itm.outwardsQuantity;
                    }
                });

                obj.openingBalance = obj.openingBalanceIn - obj.openingBalanceOut;
                obj.closingBalance = (obj.openingBalance + obj.inwards) - obj.outwards;

                if (obj._id){
                    openingBalance.push(obj);
                }
            });

        });

        if (sort) {
            openingBalance.sort(dynamicSortMultiple(sort));
        }

        callback(openingBalance);
    }

    function dynamicSort(property, param) {
        var sortOrder = 1;
        if (param === '-1') {
            sortOrder = -1;
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    function dynamicSortMultiple(sort) {
        var props = Object.keys(sort);
        var values = props.map(function (key) {
            return sort[key];
        });

        return function (obj1, obj2) {
            var i = 0;
            var result = 0;
            var numberOfProperties = props.length;

            while (result === 0 && i < numberOfProperties) {
                result = dynamicSort(props[i], values[i])(obj1, obj2);
                i++;
            }
            return result;
        }
    }

    function sortByPersonCompany(options, callback) {
        var dbName = options.dbName;
        var sortKeys;
        var sort;
        var error;
        var filedSort = {};
        var groupBy = options.groupBy;
        var type = 'Company';

        if (options.reportCategory === 'personReports') {
            type = 'Person'
        }
        type = {
            $match: {type: type}
        };

        filedSort[groupBy] = 1;

        if (options.sort) {
            filedSort = _.extend(filedSort, options.sort);
        }

        if (filedSort) {
            sort = {};
            sortKeys = Object.keys(filedSort);

            sortKeys.forEach(function (key) {
                sort[key] = parseInt(filedSort[key], 10);
            });
        }

        sort = {
            $sort: sort
        };

        if (!dbName) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        customerService.sortByFiled({dbName: dbName, sort: sort, type: type}, function (err, resultModel) {
            var error;

            if (err) {
                return callback(err);
            }

            if (!resultModel) {
                error = new Error('Employees not found');
                error.status = 404;

                return callback(error);
            }
            callback(null, {
                data: resultModel
            });
        });
    }

    reportsMapper = {
        leadsByStage                : getOpportunitiesByParam,
        leadsByPriority             : getOpportunitiesByParam,
        leadsByAssignee             : getOpportunitiesByParam,
        leadsBySource               : getOpportunitiesByParam,
        leadsByCountry              : getOpportunitiesByParam,
        leadsWithContactInfo        : getOpportunitiesByParam,
        leadsExtended               : getOpportunitiesByParam,
        opportunitiesReports        : getOpportunitiesByParam,
        opportunitiesByRevenue      : getOpportunitiesByParam,
        opportunitiesByStage        : getOpportunitiesByParam,
        opportunitiesByExpires      : getOpportunitiesByParam,
        opportunitiesByCountry      : getOpportunitiesByParam,
        opportunitiesByConvertedDate: getOpportunitiesByParam,
        opportunitiesByCreationDate : getOpportunitiesByParam,
        opportunitiesBySalesPerson  : getOpportunitiesByParam,
        opportunitiesWithContactInfo: getOpportunitiesByParam,
        opportunitiesExtendedFields : getOpportunitiesByParam,
        salesByProductReport        : getSalesByProduct,
        salesByMonthReport          : getSalesByMonth,
        salesByChannelReport        : getSalesByChannel,
        lowStockReport              : getLowStockReport,
        incomingStockReport         : getIncomingStockReport,
        warehouseMovementReport     : getProductsAvailability,
        productListingReport        : getProductListingReport,
        stockDetailsReport          : getStockDetailsReport,
        employeesByDepartment       : sortByEmployees,
        employeesByJobPosition      : sortByEmployees,
        employeesByGender           : sortByEmployees,
        employeesByMaritalStatus    : sortByEmployees,
        employeesByEmploymentType   : sortByEmployees,
        employeesByJobType          : sortByEmployees,
        employeesByManager          : sortByEmployees,
        employeesBySource           : sortByEmployees,
        employeesByAny              : sortByEmployees,
        employeesByHiredPeriod      : sortByEmployees,
        employeesByFiredPeriod      : sortByEmployees,
        personByCountry             : sortByPersonCompany,
        personBySalesTeam           : sortByPersonCompany,
        personByRevenueSold         : sortByPersonCompany,
        personByRevenuePaid         : sortByPersonCompany,
        personByRevenuePrepaid      : sortByPersonCompany,
        personByRevenueExpenses     : sortByPersonCompany,
        personByAnyFiled            : sortByPersonCompany,
        companyByCountry            : sortByPersonCompany,
        companyBySalesTeam          : sortByPersonCompany,
        companyByRevenueSold        : sortByPersonCompany,
        companyByRevenuePaid        : sortByPersonCompany,
        companyByRevenuePrepaid     : sortByPersonCompany,
        companyByRevenueExpenses    : sortByPersonCompany,
        companyByAnyFiled           : sortByPersonCompany
    };

    this.create = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var user = req.session.uId;
        var error;

        if (!body.name) {
            error = new Error('Not enough parameters');
            error.status = 400;

            return next(error);
        }

        body.dbName = dbName;
        body.createdBy = {
            user: user
        };

        body.editedBy = {
            user: user
        };

        customReportsService.create(body, function (err, createdReport) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Custom report created success'});
        });

    };

    this.get = function (req, res, next) {
        var dbName = req.session.lastDb;
        var user = req.session.uId;
        var typeFilter = req.query.reportCategory;
        var parallelTasks;
        var getCreatedByMe;
        var getFavorite;
        var getPrivate;
        var getPublic;
        var getRecent;
        var getAll;
        var _query = {};
        var categoryName = req.query.categoryName;
        var mapObject;

        if (typeFilter) {
            _query.reportCategory = {$in: typeFilter};
        }

        getCreatedByMe = function (pCb) {
            var query = {
                'createdBy.user': user
            };

            _.assign(query, _query);

            customReportsService.get({dbName: dbName, query: query})
                .populate('editedBy.user', 'login')
                .exec(pCb);
        };

        getPrivate = function (pCb) {
            var query = {
                publicAccess: false
            };

            _.assign(query, _query);

            customReportsService.get({dbName: dbName, query: query})
                .populate('editedBy.user', 'login')
                .exec(pCb);
        };

        getPublic = function (pCb) {
            var query = {
                publicAccess: true
            };

            _.assign(query, _query);

            customReportsService.get({dbName: dbName, query: query})
                .populate('editedBy.user', 'login')
                .exec(pCb);
        };

        getAll = function (pCb) {
            var query = {};

            _.assign(query, _query);

            customReportsService.get({dbName: dbName, query: query})
                .populate('editedBy.user', 'login')
                .exec(pCb);
        };

        getRecent = function (pCb) {
            var query = {};

            _.assign(query, _query);

            customReportsService.get({dbName: dbName, query: query})
                .populate('editedBy.user', 'login')
                .sort({recentDate: -1})
                .limit(5)
                .exec(pCb);
        };

        getFavorite = function (pCb) {
            usersService.findById({dbName: dbName, id: user}, function (err, user) {
                var favoriteReports;
                var query = {};
                var error;

                if (err) {
                    return pCb(err);
                }

                if (!user) {
                    error = new Error('User not found');
                    error.status = 404;

                    return pCb(error);
                }

                user = user.toJSON();
                favoriteReports = user && user.favorite && user.favorite.reports;

                if (!favoriteReports || !favoriteReports.length) {
                    return pCb(null, []);
                }

                query = {
                    _id: {
                        $in: favoriteReports
                    }
                };

                _.assign(query, _query);

                customReportsService.get({dbName: dbName, query: query})
                    .populate('editedBy.user', 'login')
                    .exec(pCb);
            });
        };

        mapObject = {
            favorite   : getFavorite,
            createdByMe: getCreatedByMe,
            private    : getPrivate,
            public     : getPublic,
            all        : getAll,
            recent     : getRecent
        };

        if (categoryName) {
            parallelTasks = [mapObject[categoryName]];
        } else {
            parallelTasks = [getCreatedByMe, getPrivate, getPublic, getAll, getRecent, getFavorite];
        }

        async.parallel(parallelTasks, function (err, result) {
            var mapedData;

            if (err) {
                return next(err);
            }

            mapedData = _.map(result[0], function (el) {
                el.reportType = reportConst.typesReports[el.reportType];

                return el;
            });

            if (categoryName) {
                res.status(200).send({
                    total: result[0].length,
                    data : mapedData || []
                });
            } else {
                res.status(200).send([{
                    _id        : null,
                    createdByMe: result[0] || [],
                    private    : result[1] || [],
                    public     : result[2] || [],
                    all        : result[3] || [],
                    recent     : result[4] || [],
                    favorite   : result[5] || []
                }]);
            }

        });
    };

    this.addToFavorite = function (req, res, next) {
        var reportId = req.params.id;
        var user = req.session.uId;
        var dbName = req.session.lastDb;

        usersService.findByIdAndUpdate(user, {$addToSet: {'favorite.reports': reportId}}, {
            new   : true,
            dbName: dbName
        }, function (err) {
            if (err) {
                return next(err);
            }

            customReportsService.findByIdAndUpdate({
                $set: {
                    'editedBy.user': user,
                    'editedBy.date': new Date()
                }
            }, {id: reportId, dbName: dbName}, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Report added to favorites'});
            });

        });
    };

    this.removeFromFavorite = function (req, res, next) {
        var reportId = req.params.id;
        var user = req.session.uId;
        var dbName = req.session.lastDb;

        usersService.findByIdAndUpdate(user, {$pull: {'favorite.reports': reportId}}, {
            new   : true,
            dbName: dbName
        }, function (err) {
            if (err) {
                return next(err);
            }

            customReportsService.findByIdAndUpdate({
                $set: {
                    'editedBy.user': user,
                    'editedBy.date': new Date()
                }
            }, {id: reportId, dbName: dbName}, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Report removed from favorites'});
            });

        });
    };

    this.remove = function (req, res, next) {
        var ids = req.body.ids || [req.params.ids];
        var dbName = req.session.lastDb;
        var deleteOptions = {
            dbName: dbName,
            _id   : {$in: ids}
        };

        customReportsService.remove(deleteOptions, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Reports deleted success'});
        });
    };

    this.getById = function (req, res, next) {
        var query = req.query;
        var dbName = req.session.lastDb;
        var reportId = query.modelId;
        var sort = query.sort;

        getDataById({
            reportId: reportId,
            dbName  : dbName,
            sort    : sort
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.patch = function (req, res, next) {
        var dbName = req.session.lastDb;
        var modelId = req.params.id;
        var body = req.body;
        var options = {
            dbName: dbName,
            id    : modelId,
            new   : true
        };
        var updateObj;

        body.editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        updateObj = {
            $set: body
        };

        customReportsService.findByIdAndUpdate(updateObj, options, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Report updated succeess'});
        });
    };

    this.exportToXlsx = function (req, res, next) {
        var query = req.query;
        var dbName = req.session.lastDb;
        var reportId = req.params.id;
        var sort = query.sort && JSON.parse(query.sort);
        var headers = [];
        var headerMapper;
        var exportOptions;
        var error;

        getDataById({
            reportId : reportId,
            dbName   : dbName,
            sort     : sort,
            forExport: true
        }, function (err, resultReport) {
            if (err) {
                return next(err);
            }

            if (!resultReport) {
                error = new Error('Report data not found');
                error.status = 400;

                return next(error);
            }

            headerMapper = resultReport.headerMapper;

            Object.keys(headerMapper).forEach(function (headerKey) {
                headers.push(headerMapper[headerKey]);
            });

            exportOptions = {
                res        : res,
                next       : next,
                map        : headers,
                fileName   : resultReport.type,
                resultArray: resultReport.data,
                attributes : Object.keys(headerMapper)
            };

            exporter.reportToXlsx(exportOptions);
        });
    };

    this.exportToCsv = function (req, res, next) {
        var query = req.query;
        var dbName = req.session.lastDb;
        var reportId = req.params.id;
        var sort = query.sort && JSON.parse(query.sort);
        var headers = [];
        var headerMapper;
        var exportOptions;
        var error;

        getDataById({
            reportId : reportId,
            dbName   : dbName,
            sort     : sort,
            forExport: true

        }, function (err, resultReport, rows) {
            var orderedReportData = [];
            var reportData;

            if (err) {
                return next(err);
            }

            if (!resultReport) {
                error = new Error('Report data not found');
                error.status = 400;

                return next(error);
            }

            headerMapper = resultReport.headerMapper;

            Object.keys(headerMapper).forEach(function (headerKey) {
                headers.push(headerMapper[headerKey]);
            });

            reportData = resultReport.data;

            reportData.forEach(function (data) {
                var reportObject = {};

                rows.forEach(function (row) {
                    reportObject[headerMapper[row]] = data[row];
                });

                orderedReportData.push(reportObject);
            });

            exportOptions = {
                res        : res,
                next       : next,
                map        : headerMapper,
                fileName   : resultReport.type,
                resultArray: orderedReportData,
                attributes : headers
            };

            exporter.reportToCSV(exportOptions);
        });
    };
};

module.exports = Module;
