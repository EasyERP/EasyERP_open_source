'use strict';
var mongoose = require('mongoose');
var ProductSchema = mongoose.Schemas.Products;
var objectId = mongoose.Types.ObjectId;
var populateWrapper = require('../helpers/callbackWrapper').populate;

module.exports = function (models) {
    return new function () {
        this.find = function (query, options, callback) {
            var Product;
            var dbName;
            var _query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            Product = models.get(dbName, 'Product', ProductSchema);

            _query = Product.find(query, options);

            if (typeof callback !== 'function') {
                return _query;
            }

            _query.exec(function (err, products) {
                if (err) {
                    return callback(err);
                }

                callback(null, products);
            });
        };

        this.findOne = function (query, options, callback) {
            var Product;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
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

            Product = models.get(dbName, 'Product', ProductSchema);

            Product.findOne(query, options, function (err, product) {
                if (err) {
                    return callback(err);
                }

                callback(null, product);
            });
        };

        this.createProduct = function (options, callback) {
            var Product;
            var dbName;
            var err;
            var body = options.body;
            var product;
            var uId;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            uId = options.uId;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Product = models.get(dbName, 'Product', ProductSchema);

            product = new Product(body);

            product.createdBy.user = uId;
            product.editedBy.user = uId;

            product.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var ProductModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            ProductModel = models.get(dbName, 'Product', ProductSchema);
            ProductModel.findOneAndUpdate(query, updateObject, options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.findAndUpdate = function (query, updateObject, options, callback) {
            var ProductModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            ProductModel = models.get(dbName, 'Product', ProductSchema);
            ProductModel.update(query, updateObject, options, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        this.getAvailabilityByJob = function (options, callback) {
            var Product;
            var dbName;
            var err;
            var body = options.body;
            var product;
            var uId;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            uId = options.uId;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Product = models.get(dbName, 'Product', ProductSchema);

            Product.aggregate([{
                $match: {
                    job: objectId(options.job)
                }
            }, {
                $lookup: {
                    from        : 'productsAvailability',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'availability'
                }
            }, {
                $project: {
                    availability: {$arrayElemAt: ['$availability', 0]}
                }
            }, {
                $lookup: {
                    from        : 'warehouse',
                    localField  : 'availability.warehouse',
                    foreignField: '_id',
                    as          : 'warehouse'
                }
            }, {
                $project: {
                    warehouse: {$arrayElemAt: ['$warehouse', 0]},
                    _id      : '$availability._id'
                }
            }], function (err, docs) {
                var _id;
                var account;

                if (err) {
                    return callback(err);
                }

                _id = docs && docs.length ? docs[0]._id : null;
                account = docs && docs.length && docs[0].warehouse ? docs[0].warehouse.account : null;

                callback(null, {_id: _id, account: account});
            });
        };

        this.findOneAndRemove = function (options, callback) {
            var Product;
            var dbName;
            var err;
            var query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
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

            query = options.query;

            Product = models.get(dbName, 'Product', ProductSchema);

            Product.findOneAndRemove(query, function (err, product) {
                var categoriesIds;

                if (err) {
                    return callback(err);
                }

                product = product.toJSON();
                categoriesIds = product.info.categories;

                callback(null, product);
            });
        };

        this.count = function (options, callback) {
            var Model;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
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

            Model = models.get(dbName, 'Product', ProductSchema);
            Model.count(options, function (err, count) {
                if (err) {
                    return callback(err);
                }

                callback(null, count);
            });
        };

        this.getProductsForSyncToChannel = function (options, callback) {
            var populateCategories = options.populateCategories;
            var channel = options.channel;
            var dbName = options.dbName;
            var query = options.query;
            var aggregationQuery = [];
            var populationCatQuery;
            var projection;
            var Model;
            var error;

            if (!dbName) {
                error = new Error('invalid parameters');
                error.status = 400;

                return callback(error);
            }

            delete options.dbName;
            delete options.query;
            delete options.channel;
            delete options.populateCategories;

            populationCatQuery = [{
                $unwind: {
                    path                      : '$info.categories',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'ProductCategories',
                    localField  : 'info.categories',
                    foreignField: '_id',
                    as          : 'productCategories'
                }
            }, {
                $unwind: {
                    path                      : '$productCategories',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    _id              : '$_id',
                    productCategories: {$push: '$productCategories.magentoId'},
                    product          : {$first: '$$ROOT'}
                }
            }, {
                $project: {
                    productCategories: 1,
                    info             : '$product.info',
                    name             : '$product.name',
                    imageSrc         : '$product.imageSrc',
                    channelLinks     : '$product.channelLinks',
                    inventory        : '$product.inventory',
                    productImages    : '$product.productImages',
                    isVariant        : '$product.isVariant'
                }
            }];

            if (channel) {
                aggregationQuery = [{
                    $lookup: {
                        from        : 'channelLinks',
                        localField  : '_id',
                        foreignField: 'product',
                        as          : 'channelLinks'
                    }
                }, {
                    $match: {
                        'channelLinks.channel': {$in: [objectId(channel)]}
                    }
                }];
            }

            aggregationQuery.push({
                $lookup: {
                    from        : 'Images',
                    localField  : 'groupId',
                    foreignField: 'product',
                    as          : 'productImages'
                }
            });

            if (populateCategories) {
                aggregationQuery = aggregationQuery.concat(populationCatQuery);
            }

            if (Object.keys(options).length) {
                projection = {
                    $project: options
                };
                options.productCategories = 1;

                aggregationQuery.push(projection);
            }

            if (query) {
                aggregationQuery.unshift({
                    $match: query
                });
            }

            Model = models.get(dbName, 'Product', ProductSchema);
            Model.aggregate(aggregationQuery, function (err, products) {
                if (err) {
                    return callback(err);
                }

                callback(null, products);
            });
        };

        this.getProductsForOrder = function (options, callback) {
            var channel = options.channel;
            var linkIds = options.linkIds;
            var dbName = options.dbName;
            var query = options.query;
            var aggregationQuery;
            var projection;
            var Model;
            var error;

            if (!dbName || !channel || !linkIds) {
                error = new Error('invalid parameters');
                error.status = 400;

                return callback(error);
            }

            delete options.dbName;
            delete options.query;
            delete options.channel;
            delete options.linkIds;

            aggregationQuery = [{
                $lookup: {
                    from        : 'channelLinks',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'channelLinks'
                }
            }, {
                $unwind: {
                    path                      : '$channelLinks',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $match: {
                    'channelLinks.channel': {$in: [objectId(channel)]},
                    'channelLinks.linkId' : {$in: linkIds}
                }
            }];

            if (Object.keys(options).length) {
                projection = {
                    $project: options
                };

                aggregationQuery.push(projection);
            }

            if (query) {
                aggregationQuery.unshift({
                    $match: query
                });
            }

            Model = models.get(dbName, 'Product', ProductSchema);
            Model.aggregate(aggregationQuery, function (err, products) {
                if (err) {
                    return callback(err);
                }

                callback(null, products);
            });
        };

        this.getInventoryForProduct = function (options, callback) {
            var Model;
            var dbName;
            var err;
            var id;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            id = options.id;
            delete options.dbName;
            delete options.id;

            if (!dbName || !id || typeof options !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'Product', ProductSchema);
            Model.aggregate([
                {
                    $match: {
                        // job: null,
                        _id: objectId(id)
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
                    $lookup: {
                        from        : 'warehouse',
                        localField  : 'productsAvailabilities.warehouse',
                        foreignField: '_id',
                        as          : 'warehouse'
                    }
                },
                {
                    $lookup: {
                        from        : 'locations',
                        localField  : 'productsAvailabilities.location',
                        foreignField: '_id',
                        as          : 'location'
                    }
                },
                {
                    $project: {
                        location : {$arrayElemAt: ['$location', 0]},
                        warehouse: {$arrayElemAt: ['$warehouse', 0]},
                        available: '$productsAvailabilities.onHand',
                        allocated: {
                            $add: [{
                                $sum: '$productsAvailabilities.orderRows.quantity'
                            }, {
                                $sum: '$productsAvailabilities.goodsOutNotes.quantity'
                            }]
                        },

                        onHand: {
                            $add: ['$productsAvailabilities.onHand', {
                                $sum: '$productsAvailabilities.orderRows.quantity'
                            }, {
                                $sum: '$productsAvailabilities.goodsOutNotes.quantity'
                            }]
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
                    $project: {
                        location: {
                            _id : '$location._id',
                            name: '$location.name'
                        },

                        warehouse: {
                            _id : '$warehouse._id',
                            name: '$warehouse.name'
                        },

                        available: 1,
                        allocated: 1,
                        onHand   : 1,
                        orderRows: 1,
                        orders   : {
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
                    $group: {
                        _id      : '$orderRows._id',
                        location : {$first: '$location'},
                        warehouse: {$first: '$warehouse'},
                        available: {$sum: '$available'},
                        allocated: {$sum: '$allocated'},
                        onHand   : {$sum: '$onHand'},
                        orders   : {$first: '$orders'}
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
                    $lookup: {
                        from        : 'warehouse',
                        localField  : 'orderRows.warehouse',
                        foreignField: '_id',
                        as          : 'purchaseWarehouse'
                    }
                }, {
                    $project: {
                        purchaseWarehouseLength: {$size: '$purchaseWarehouse'},
                        orderRows              : 1,
                        location               : 1,
                        purchaseWarehouseEl    : {$arrayElemAt: ['$purchaseWarehouse', 0]},
                        warehouse              : 1,
                        available              : 1,
                        allocated              : 1,
                        onHand                 : 1
                    }
                }, {
                    $project: {
                        orderRows: 1,
                        location : {
                            _id: {
                                $cond: {
                                    if: {
                                        $eq: ['$purchaseWarehouseLength', 0]
                                    },

                                    then: '$location._id',
                                    else: null
                                }
                            },

                            name: {
                                $cond: {
                                    if: {
                                        $eq: ['$purchaseWarehouseLength', 0]
                                    },

                                    then: '$location.name',
                                    else: ''
                                }
                            }
                        },

                        warehouse: {
                            _id: {
                                $cond: {
                                    if: {
                                        $eq: ['$purchaseWarehouseLength', 0]
                                    },

                                    then: '$warehouse._id',
                                    else: '$purchaseWarehouseEl._id'
                                }
                            },

                            name: {
                                $cond: {
                                    if: {
                                        $eq: ['$purchaseWarehouseLength', 0]
                                    },

                                    then: '$warehouse.name',
                                    else: '$purchaseWarehouseEl.name'
                                }
                            }
                        },

                        available: {
                            $cond: {
                                if: {
                                    $eq: ['$purchaseWarehouseLength', 0]
                                },

                                then: '$available',
                                else: 0
                            }
                        },

                        allocated: {
                            $cond: {
                                if: {
                                    $eq: ['$purchaseWarehouseLength', 0]
                                },

                                then: '$allocated',
                                else: 0
                            }
                        },

                        onHand: {
                            $cond: {
                                if: {
                                    $eq: ['$purchaseWarehouseLength', 0]
                                },

                                then: '$onHand',
                                else: 0
                            }
                        }
                    }
                }, {
                    $group: {
                        _id: {
                            location : '$location._id',
                            warehouse: '$warehouse._id'
                        },

                        location : {$first: '$location.name'},
                        warehouse: {$first: '$warehouse.name'},
                        available: {$max: '$available'},
                        allocated: {$max: '$allocated'},
                        onHand   : {$max: '$onHand'},
                        incoming : {$sum: '$orderRows.quantity'}
                    }
                }, {
                    $match: {
                        warehouse: {
                            $ne: null
                        }
                    }
                }, {
                    $sort: {
                        warehouse: 1,
                        incoming : 1
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                console.log(result);

                callback(null, result);
            });

        };

        this.getProductsWithVariants = function (options, callback) {
            var dbName = options.dbName;
            var query = options.query;
            var aggregationQuery;
            var Model;
            var error;

            if (!dbName) {
                error = new Error('invalid parameters');
                error.status = 400;

                return callback(error);
            }

            aggregationQuery = [{
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
                    name     : 1,
                    imageSrc : 1,
                    info     : 1,
                    inventory: 1,
                    variants : {$arrayElemAt: ['$variants', 0]},
                    groupId  : 1,
                    isVariant: 1
                }
            }, {
                $lookup: {
                    from        : 'ProductOptions',
                    localField  : 'variants.optionId',
                    foreignField: '_id',
                    as          : 'productOptions'
                }
            }, {
                $lookup: {
                    from        : 'Images',
                    localField  : 'groupId',
                    foreignField: 'product',
                    as          : 'productImages'
                }
            }, {
                $project: {
                    name          : 1,
                    imageSrc      : 1,
                    info          : 1,
                    inventory     : 1,
                    variants      : 1,
                    groupId       : 1,
                    productImages : 1,
                    isVariant     : 1,
                    productOptions: {$arrayElemAt: ['$productOptions', 0]}
                }
            }, {
                $group: {
                    _id          : '$_id',
                    name         : {$first: '$$ROOT.name'},
                    imageSrc     : {$first: '$$ROOT.imageSrc'},
                    info         : {$first: '$$ROOT.info'},
                    inventory    : {$first: '$$ROOT.inventory'},
                    values       : {$addToSet: '$$ROOT.variants.value'},
                    options      : {$addToSet: '$$ROOT.productOptions.name'},
                    groupId      : {$first: '$$ROOT.groupId'},
                    isVariant    : {$first: '$$ROOT.isVariant'},
                    productImages: {$first: '$$ROOT.productImages'}
                }
            }];

            if (query) {
                aggregationQuery.unshift({
                    $match: query
                });
            }

            Model = models.get(dbName, 'Product', ProductSchema);
            Model.aggregate(aggregationQuery, function (err, products) {
                if (err) {
                    return callback(err);
                }

                callback(null, products);
            });
        };

        this.getProductsForChannelWithVariants = function (options, callback) {
            var channel = options.channel;
            var dbName = options.dbName;
            var query = options.query;
            var aggregationQuery;
            var Model;
            var error;

            console.log('dbName line 932', dbName);
            console.log('_id line 933', channel);

            if (!dbName || !channel) {
                error = new Error('invalid parameters');
                error.status = 400;

                return callback(error);
            }

            aggregationQuery = [{
                $lookup: {
                    from        : 'channelLinks',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'channelLinks'
                }
            }, {
                $match: {
                    'channelLinks.channel': {$in: [objectId(channel)]}
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
                    name     : 1,
                    imageSrc : 1,
                    info     : 1,
                    inventory: 1,
                    variants : {$arrayElemAt: ['$variants', 0]},
                    groupId  : 1
                }
            }, {
                $lookup: {
                    from        : 'ProductOptions',
                    localField  : 'variants.optionId',
                    foreignField: '_id',
                    as          : 'productOptions'
                }
            }, {
                $lookup: {
                    from        : 'Images',
                    localField  : 'groupId',
                    foreignField: 'product',
                    as          : 'productImages'
                }
            }, {
                $project: {
                    name          : 1,
                    imageSrc      : 1,
                    info          : 1,
                    inventory     : 1,
                    variants      : 1,
                    groupId       : 1,
                    productImages : 1,
                    productOptions: {$arrayElemAt: ['$productOptions', 0]}
                }
            }, {
                $group: {
                    _id          : '$_id',
                    name         : {$first: '$$ROOT.name'},
                    imageSrc     : {$first: '$$ROOT.imageSrc'},
                    info         : {$first: '$$ROOT.info'},
                    inventory    : {$first: '$$ROOT.inventory'},
                    values       : {$addToSet: '$$ROOT.variants.value'},
                    options      : {$addToSet: '$$ROOT.productOptions.name'},
                    groupId      : {$first: '$$ROOT.groupId'},
                    productImages: {$first: '$$ROOT.productImages'}
                }
            }];

            if (query) {
                aggregationQuery.unshift({
                    $match: query
                });
            }

            Model = models.get(dbName, 'Product', ProductSchema);
            Model.aggregate(aggregationQuery, function (err, products) {
                if (err) {
                    return callback(err);
                }

                callback(null, products);
            });
        };

        this.getProductForSyncFulfillments = function (query, options, callback) {
            var Product;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
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

            Product = models.get(dbName, 'Product', ProductSchema);
            Product.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from        : 'GoodsNote',
                    localField  : '_id',
                    foreignField: 'order',
                    as          : 'goodsOutNotes'
                }
            }, {
                $project: {
                    goodsOutNotes: {
                        $filter: {
                            input: '$goodsOutNotes',
                            as   : 'gN',
                            cond : {
                                $and: [
                                    {$eq: ['$$gN._type', 'GoodsOutNote']},
                                    {$ne: ['$$gN.channel', null]}
                                ]
                            }
                        }
                    },
                    channel      : 1,
                    integrationId: 1
                }
            }], function (err, resultOrders) {
                if (err) {
                    return callback(err);
                }

                callback(null, resultOrders);
            });
        };
    };
};
