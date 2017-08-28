var Products = function (models, event) {
    'use strict';

    var mongoose = require('mongoose');

    var ProductSchema = mongoose.Schemas.Products;
    var CategorySchema = mongoose.Schemas.ProductCategory;
    var ProductPricesSchema = mongoose.Schemas.ProductPrices;
    var DepartmentSchema = mongoose.Schemas.Department;
    var ProductTypesSchema = mongoose.Schemas.productTypes;
    var AvailabilitySchema = mongoose.Schemas.productsAvailability;
    // var GoodsInNoteSchema = mongoose.Schemas.GoodsInNote;
    // var GoodsOutNoteSchema = mongoose.Schemas.GoodsOutNote;

    var objectId = mongoose.Types.ObjectId;
    var rewriteAccess = require('../helpers/rewriteAccess');
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var async = require('async');
    var _ = require('lodash');
    var fs = require('fs');
    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Products;
    var pageHelper = require('../helpers/pageHelper');
    var Integration = require('../helpers/requestMagento.js')();
    var FilterMapper = require('../helpers/filterMapper');
    var integrationStatsHelper = require('../helpers/integrationStatsComposer')(models);

    var filterMapper = new FilterMapper();

    var RESPONSES = require('../constants/responses');

    var path = require('path');
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();
    var CONSTANTS = require('../constants/mainConstants');
    var redis = require('../helpers/redisClient');
    var _getHelper = require('../helpers/integrationHelperRetriever')(models, event);

    var ProductService = require('../services/products')(models);
    var ImagesService = require('../services/images')(models);
    var ProductCategoryService = require('../services/productCategory')(models);
    var ProductPriceService = require('../services/productPrice')(models);
    var ChannelLinksService = require('../services/channelLinks')(models);
    var SettingsService = require('../services/settings')(models, event);
    var IntegrationsService = require('../services/integration')(models);
    var OrderRowsService = require('../services/orderRows')(models);
    var AvailabilityService = require('../services/productAvailability')(models);
    var GoodsOutNoteService = require('../services/goodsOutNotes')(models);
    var GoodsInNoteService = require('../services/goodsInNotes')(models);
    var imageHelper = require('../helpers/imageHelper');

    var getHelper = _getHelper.getHelper;

    function updateOnlySelectedFields(req, res, next, id, data) {
        var db = req.session.lastDb;
        var Product = models.get(db, 'Product', ProductSchema);
        var ProductCategory = models.get(db, 'ProductCategory', CategorySchema);
        var ProductPriceModel = models.get(db, 'ProductPrice', ProductPricesSchema);
        var prices = data.prices;
        var priceModel;
        var groupId = req.headers && req.headers.groupid;

        async.waterfall([
            function (wCb) {
                var imageData;
                var image;
                var imageName = (new objectId()).toString();

                if (!data.imageSrc || !groupId) {
                    return wCb();
                }

                image = data.imageSrc;
                imageData = imageHelper.cutPrefixFromBase64(image);

                uploader.postImage(groupId, {
                    data: imageData.image,
                    name: imageName + '.' + imageData.mimeType
                }, function (err, imagePath) {
                    if (err) {
                        return wCb(err);
                    }

                    ImagesService.create({
                        imageSrc: imagePath,
                        product : groupId,
                        dbName  : db
                    }, function (err, result) {
                        if (err) {
                            return wCb(err);
                        }

                        data.imageSrc = result._id;

                        wCb();
                    });
                });

            },

            function (wCb) {
                if (!prices || !prices.length) {
                    return wCb(null);
                }

                async.each(prices, function (item, eachCb) {
                    var query = {
                        product   : objectId(item.product),
                        priceLists: objectId(item.priceLists)
                    };

                    ProductPriceModel.findOneAndUpdate(query, {$set: {prices: item.prices}}, {upsert: true}, function (err, result) {
                        if (err) {
                            return eachCb(err);
                        }

                        eachCb(null);
                    });
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null);
                });
            },

            function (wCb) {
                Product.findByIdAndUpdate(id, {$set: data}, function (err, product) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, product._id);
                });
            },

            function (productId, wCb) {
                redis.sAdd(CONSTANTS.REDIS.CHANGED_PRODUCTS, productId.toString(), wCb);
                wCb(null);
            }

        ], function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Updated success'});
        });
    }

    function getProductImages(req, res, next, data) {
        var query = models.get(req.session.lastDb, 'Products', ProductSchema).find({});
        query.where('_id').in(data.ids).select('_id imageSrc').exec(function (error, response) {
            if (error) {
                next(error);
            } else {
                res.status(200).send({data: response});
            }
        });
    }

    function remove(req, id, callback) {
        var dbName = req.session.lastDb;
        var removedProduct;

        async.parallel([
            function (pCb) {
                OrderRowsService.findOne({
                    product: id,
                    dbName : dbName
                }, function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            },

            function (pCb) {
                AvailabilityService.find({
                    query : {
                        product: id
                    },
                    dbName: dbName
                }, function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            }
        ], function (err, result) {
            if (err) {
                return callback(err);
            }

            if (result && (result[0] || result[1] && result[1].length)) {
                err = new Error('This product already exists in warehouse or order');
                return callback(err);
            }

            ProductService.findOne({_id: id}, {dbName: dbName}, function (err, product) {
                if (err) {
                    return callback(err);
                }

                if (product && product.job) {
                    return callback({error: 'You can not delete product with existing job.'});
                }

                async.waterfall([
                    function (wCb) {
                        var options = {
                            dbName: dbName,
                            query : {_id: id}
                        };

                        ProductService.findOneAndRemove(options, function (err, product) {
                            if (err) {
                                return wCb(err);
                            }

                            removedProduct = product;

                            wCb();
                        });
                    },

                    function (wCb) {
                        var options = {
                            dbName: dbName,
                            query : {product: id}
                        };

                        ProductPriceService.remove(options, wCb);
                    },

                    function (wCb) {
                        ChannelLinksService.remove({product: id}, {dbName: dbName}, function (err) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb();
                        });
                    },

                    function (wCb) {
                        redis.sMove(CONSTANTS.REDIS.CHANGED_PRODUCTS, id.toString(), function (err) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb();
                        });
                    },

                    function (wCb) {
                        var groupId = removedProduct.groupId;

                        ProductService.find({groupId: groupId}, {dbName: dbName})
                            .count()
                            .exec(function (err, count) {
                                if (err) {
                                    return wCb(err);
                                }

                                if (count) {
                                    return wCb();
                                }

                                uploader.removeDir(groupId);

                                wCb();
                            });
                    }
                ], function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null);
                });
            });
        });
    }

    function getAll(req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var queryObject = {};
        var query = req.query;
        var doNotGetImage = query.doNotGetImage || false;
        var projection = query.projection || {};

        if (query && query.canBeSold === 'true') {
            queryObject.canBeSold = true;

            // todo change it for category
            /* if (query.service === 'true') {
             key = 'info.productType';
             queryObject[key] = 'Service';
             }*/
        } else {
            queryObject.canBePurchased = true;
        }

        if (query && query.project) {
            Product.aggregate([{
                $lookup: {
                    from        : 'jobs',
                    localField  : 'job',
                    foreignField: '_id',
                    as          : 'job'
                }
            }, {
                $match: {
                    'job.project': objectId(query.project)
                }
            }, {
                $project: {
                    job : {$arrayElemAt: ['$job', 0]},
                    name: 1,
                    info: 1
                }
            }, {
                $lookup: {
                    from        : 'orderRows',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'orderRows'
                }
            }, {
                $match: {
                    orderRows: {$eq: []}
                }
            }, {
                $project: {
                    job : 1,
                    name: 1,
                    info: 1
                }
            }], function (err, products) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: products});
            });
        } else {
            // queryObject.job = null;
            Product.find(queryObject, projection)
                .populate('variants')
                .exec(function (err, products) {
                    var i = 0;

                    if (err) {
                        return next(err);
                    }

                    for (i; i < products.length; i++) {
                        if (doNotGetImage) {
                            products[i].imageSrc = '';
                        }
                    }

                    res.status(200).send({success: products});
                });
        }

    }

    function getProductsForBundles(req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var query = req.query;
        var searchValue = query.filter && query.filter.value;
        var searchRegExp = new RegExp(searchValue, 'ig');

        Product.aggregate([{
            $match: {
                $or: [
                    {name: {$regex: searchRegExp}},
                    {'info.SKU': {$regex: searchRegExp}}
                ]
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
            $unwind: {
                path                      : '$variants',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $group: {
                _id     : '$_id',
                variants: {$push: {name: '$variants.value'}},
                name    : {$first: '$name'},
                sku     : {$first: '$info.SKU'}
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    }

    function getProductsFilter(req, res, next) {
        var mid = req.query.contentType === 'salesProduct' ? 65 : 58;
        var Product;
        var query = req.query || {};
        var quickSearch = query.quickSearch;
        var matchObject = {};
        var regExp;
        var filter = query.filter;
        var contentType = query.contentType;
        var optionsObject = {$and: []};
        var doNotShowImage = query.doNotGetImage || false;
        var sort = {};
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var paginationObject = pageHelper(query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var channelLinksMatch = {};
        var channelObjectIds;
        var key;
        var resultData;
        var action;
        var toExpand;
        var groupId;

        if (filter) {
            toExpand = filter.toExpand;
            groupId = filter.groupId;

            delete filter.toExpand;
            delete filter.groupId;
            delete filter.productId;
        }

        Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        if (query && query.sort) {
            key = Object.keys(query.sort)[0].toString();
            query.sort[key] = parseInt(query.sort[key], 10);
            sort = query.sort;
        } else {
            sort = {'data.createdBy.date': -1};
        }

        if (filter && filter.channelLinks) {
            channelObjectIds = filter.channelLinks.value.objectID();
            action = filter.channelLinks.type;

            if (action === 'unpublish' || action === 'unlink') {
                channelLinksMatch[filter.channelLinks.key] = {$in: channelObjectIds};
            } else if (action === 'publish') {
                channelLinksMatch['channelLinks.channel'] = {$nin: channelObjectIds};
            }

            delete  filter.channelLinks;
        }
        // optionsObject.$and.push({job: null});

        if (query.filter && typeof query.filter === 'object') {
            optionsObject.$and.push(filterMapper.mapFilter(filter, {contentType: contentType}));
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Product, cb);
        };

        if (quickSearch) {
            regExp = new RegExp(quickSearch, 'ig');
            matchObject.name = {$regex: regExp};
        }

        contentSearcher = function (productsIds, waterfallCallback) {
            var aggregation;
            var matchAggregationArray = [];
            var aggregationArray;

            optionsObject.$and.push({_id: {$in: productsIds}});

            if (!toExpand) {
                aggregationArray = [{
                    $lookup: {
                        from        : 'productTypes',
                        localField  : 'products.info.productType',
                        foreignField: '_id',
                        as          : 'ProductTypes'
                    }
                }, {
                    $unwind: {
                        path                      : '$ProductTypes',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $unwind: {
                        path                      : '$products.info.categories',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'ProductCategories',
                        localField  : 'products.info.categories',
                        foreignField: '_id',
                        as          : 'productCategories'
                    }
                }, {
                    $unwind: {
                        path                      : '$productCategories',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'Images',
                        localField  : 'products.imageSrc',
                        foreignField: '_id',
                        as          : 'products.image'
                    }
                }, {
                    $unwind: {
                        path                      : '$products.image',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id              : '$products._id',
                        productCategories: {
                            $push: {
                                _id : '$productCategories._id',
                                name: '$productCategories.fullName'
                            }
                        },

                        variantsCount: {$first: '$variantsCount'},
                        ProductTypes : {$first: '$ProductTypes'},
                        products     : {$first: '$products'},
                        image        : {$first: '$image'},
                        count        : {$first: '$count'}
                    }
                }, {
                    $unwind: {
                        path                      : '$products.variants',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'ProductOptionsValues',
                        localField  : 'products.variants',
                        foreignField: '_id',
                        as          : 'variants'
                    }
                }, {
                    $unwind: {
                        path                      : '$variants',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'ProductOptions',
                        localField  : 'variants.optionId',
                        foreignField: '_id',
                        as          : 'variants.optionId'
                    }
                }, {
                    $unwind: {
                        path                      : '$variants.optionId',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id              : '$products._id',
                        variants         : {$push: '$variants'},
                        count            : {$first: '$count'},
                        ProductTypes     : {$first: '$ProductTypes'},
                        productCategories: {$first: '$productCategories'},
                        products         : {$first: '$products'},
                        variantsCount    : {$first: '$variantsCount'}
                    }
                }, {
                    $project: {
                        count: 1,
                        data : {
                            _id              : '$products._id',
                            info             : '$products.info',
                            bundles          : '$products.bundles',
                            inventory        : '$products.inventory',
                            name             : '$products.name',
                            imageSrc         : '$products.image.imageSrc',
                            isBundle         : '$products.isBundle',
                            ProductTypesId   : '$ProductTypes._id',
                            ProductTypesName : '$ProductTypes.name',
                            ProductCategories: '$productCategories',
                            variants         : '$variants',
                            createdBy        : '$products.createdBy',
                            groupId          : '$products.groupId',
                            variantsCount    : {
                                $filter: {
                                    input: '$variantsCount',
                                    as   : 'variant',
                                    cond : {$eq: ['$products.groupId', '$$variant.groupId']}
                                }
                            }
                        }
                    }
                }, {
                    $project: {
                        name : '$data.name',
                        sku  : '$data.info.SKU',
                        count: 1,
                        data : 1
                    }
                }, {
                    $sort: sort
                }, {
                    $project: {
                        count: 1,
                        data : {
                            _id              : '$data._id',
                            info             : '$data.info',
                            bundles          : '$data.bundles',
                            inventory        : '$data.inventory',
                            name             : '$data.name',
                            imageSrc         : '$data.imageSrc',
                            isBundle         : '$data.isBundle',
                            ProductTypesId   : '$data.ProductTypesId',
                            ProductTypesName : '$data.ProductTypesName',
                            ProductCategories: '$data.ProductCategories',
                            variants         : '$data.variants',
                            createdBy        : '$data.createdBy',
                            images           : '$data.images',
                            groupId          : '$data.groupId',
                            variantsCount    : {$arrayElemAt: ['$data.variantsCount', 0]}
                        }
                    }
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }, {
                    $group: {
                        _id  : '$count',
                        total: {$first: '$count'},
                        data : {$push: '$data'}
                    }
                }, {
                    $project: {
                        _id  : 0,
                        total: 1,
                        data : 1
                    }
                }];
                matchAggregationArray = [{
                    $match: matchObject
                }, {
                    $match: optionsObject
                }, {
                    $group: {
                        _id          : '$groupId',
                        variantsCount: {$sum: 1},
                        products     : {$first: '$$ROOT'}
                    }
                }, {
                    $group: {
                        _id          : null,
                        variantsCount: {
                            $addToSet: {
                                count  : '$variantsCount',
                                groupId: '$_id'
                            }
                        },

                        count   : {$sum: 1},
                        products: {$push: '$products'}
                    }
                }, {
                    $unwind: '$products'
                }];
            } else {
                aggregationArray = [{
                    $lookup: {
                        from        : 'productTypes',
                        localField  : 'products.info.productType',
                        foreignField: '_id',
                        as          : 'ProductTypes'
                    }
                }, {
                    $unwind: {
                        path                      : '$ProductTypes',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $unwind: {
                        path                      : '$products.info.categories',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'ProductCategories',
                        localField  : 'products.info.categories',
                        foreignField: '_id',
                        as          : 'productCategories'
                    }
                }, {
                    $unwind: {
                        path                      : '$productCategories',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'Images',
                        localField  : 'products.imageSrc',
                        foreignField: '_id',
                        as          : 'products.image'
                    }
                }, {
                    $unwind: {
                        path                      : '$products.image',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id              : '$products._id',
                        productCategories: {
                            $push: {
                                _id : '$productCategories._id',
                                name: '$productCategories.fullName'
                            }
                        },

                        variantsCount: {$first: '$variantsCount'},
                        ProductTypes : {$first: '$ProductTypes'},
                        products     : {$first: '$products'},
                        count        : {$first: '$count'}
                    }
                }, {
                    $unwind: {
                        path                      : '$products.variants',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'ProductOptionsValues',
                        localField  : 'products.variants',
                        foreignField: '_id',
                        as          : 'variants'
                    }
                }, {
                    $unwind: {
                        path                      : '$variants',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'ProductOptions',
                        localField  : 'variants.optionId',
                        foreignField: '_id',
                        as          : 'variants.optionId'
                    }
                }, {
                    $unwind: {
                        path                      : '$variants.optionId',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
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
                    $match: channelLinksMatch
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
                    $group: {
                        _id              : '$products._id',
                        variants         : {$push: '$variants'},
                        count            : {$first: '$count'},
                        ProductTypes     : {$first: '$ProductTypes'},
                        productCategories: {$first: '$productCategories'},
                        products         : {$first: '$products'},
                        variantsCount    : {$first: '$variantsCount'},
                        channelLinks     : {
                            $addToSet: {
                                name: '$channelLinks.channelName',
                                type: '$channelLinks.type'
                            }
                        }
                    }
                }, {
                    $project: {
                        count: 1,
                        data : {
                            _id              : '$products._id',
                            info             : '$products.info',
                            bundles          : '$products.bundles',
                            inventory        : '$products.inventory',
                            name             : '$products.name',
                            imageSrc         : '$products.image.imageSrc',
                            isBundle         : '$products.isBundle',
                            ProductTypesId   : '$ProductTypes._id',
                            ProductTypesName : '$ProductTypes.name',
                            ProductCategories: '$productCategories',
                            variants         : '$variants',
                            createdBy        : '$products.createdBy',
                            channelLinks     : '$channelLinks',
                            groupId          : '$products.groupId',
                            variantsCount    : {
                                $filter: {
                                    input: '$variantsCount',
                                    as   : 'variant',
                                    cond : {$eq: ['$products.groupId', '$$variant.groupId']}
                                }
                            }
                        }
                    }
                }, {
                    $project: {
                        name : '$data.name',
                        sku  : '$data.info.SKU',
                        count: 1,
                        data : 1
                    }
                }, {
                    $sort: sort
                }, {
                    $project: {
                        count: 1,
                        data : {
                            _id              : '$data._id',
                            info             : '$data.info',
                            bundles          : '$data.bundles',
                            inventory        : '$data.inventory',
                            name             : '$data.name',
                            imageSrc         : '$data.imageSrc',
                            isBundle         : '$data.isBundle',
                            ProductTypesId   : '$data.ProductTypesId',
                            ProductTypesName : '$data.ProductTypesName',
                            ProductCategories: '$data.ProductCategories',
                            variants         : '$data.variants',
                            createdBy        : '$data.createdBy',
                            groupId          : '$data.groupId',
                            channelLinks     : '$data.channelLinks',
                            variantsCount    : {$arrayElemAt: ['$data.variantsCount', 0]},
                        }
                    }
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }, {
                    $group: {
                        _id  : '$count',
                        total: {$first: '$count'},
                        data : {$push: '$data'}
                    }
                }, {
                    $project: {
                        _id  : 0,
                        total: 1,
                        data : 1
                    }
                }];

                if (groupId) {
                    matchAggregationArray = [{
                        $match: matchObject
                    }, {
                        $match: {
                            groupId: groupId
                        }
                    }, {
                        $group: {
                            _id     : null,
                            count   : {$sum: 1},
                            products: {$push: '$$ROOT'}
                        }
                    }, {
                        $unwind: '$products'
                    }];
                } else {
                    matchAggregationArray = [{
                        $match: optionsObject
                    }, {
                        $group: {
                            _id     : null,
                            count   : {$sum: 1},
                            products: {$push: '$$ROOT'}
                        }
                    }, {
                        $unwind: '$products'
                    }];
                }
            }

            matchAggregationArray = matchAggregationArray.concat(aggregationArray);

            aggregation = Product.aggregate(matchAggregationArray);

            aggregation.options = {
                allowDiskUse: true
            };

            aggregation.exec(function (err, res) {
                var i = 0;
                var mainImage;
                var oldImage;

                if (err) {
                    return waterfallCallback(err);
                }

                if (!res.length) {
                    resultData = {
                        total: 0
                    };
                } else {
                    resultData = res[0];

                    for (i; i < resultData.data.length; i++) {
                        /*console.log(doNotShowImage);

                         if (doNotShowImage) {
                         console.log(resultData.data[i]);
                         delete resultData.data[i].imageSrc;
                         return;
                         }*/

                        oldImage = resultData.data[i].imageSrc;

                        mainImage = _.find(resultData.data[i].images, function (item) {
                            return item.main === true;
                        });

                        resultData.data[i].imageSrc = mainImage && mainImage.imageSrc || oldImage;
                    }
                }

                waterfallCallback(null, resultData);
            });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, products) {
            if (err) {
                return next(err);
            }

            res.status(200).send(products);
        });
    }

    function getProductsById(req, res, next) {
        var db = req.session.lastDb;
        var id = req.query.id || req.params.id;
        var Product = models.get(db, 'Products', ProductSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var optionsValueSearcher;
        var optionsIdsSearcher;
        var waterfallTasks;
        var imagesGetter;

        if (!id && id.length < 24) {
            return res.status(400).send();
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                }, waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $or: whoCanRw
            };
            var Model = models.get(req.session.lastDb, 'Product', ProductSchema);

            Model.aggregate({
                $match: matchQuery
            }, {
                $project: {
                    _id: 1
                }
            }, waterfallCallback);
        };

        contentSearcher = function (productsIds, waterfallCallback) {
            Product.aggregate([{
                $match: {
                    _id: objectId(id)
                }
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : 'groupId',
                    foreignField: 'groupId',
                    as          : 'products'
                }
            }, {
                $unwind: '$products'
            }, {
                $unwind: {
                    path                      : '$products.bundles',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : 'products.bundles._id',
                    foreignField: '_id',
                    as          : 'BundlessProduct'
                }
            }, {
                $unwind: {
                    path                      : '$BundlessProduct',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'Images',
                    localField  : 'products.imageSrc',
                    foreignField: '_id',
                    as          : 'products.image'
                }
            }, {
                $unwind: {
                    path                      : '$products.image',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    _id      : '$products._id',
                    info     : '$products.info',
                    name     : '$products.name',
                    isBundle : '$products.isBundle',
                    isVariant: '$products.isVariant',
                    inventory: '$products.inventory',
                    imageSrc : '$products.image.imageSrc',
                    variants : '$products.variants',

                    bundles: {
                        _id     : '$BundlessProduct._id',
                        name    : '$BundlessProduct.name',
                        quantity: '$products.bundles.quantity'
                    },

                    workflow         : '$products.workflow',
                    whoCanRW         : '$products.whoCanRW',
                    groups           : '$products.groups',
                    creationDate     : '$products.creationDate',
                    createdBy        : '$products.createdBy',
                    editedBy         : '$products.editedBy',
                    attachments      : '$products.attachments',
                    canBeSold        : '$products.canBeSold',
                    canBeExpensed    : '$products.canBeExpensed',
                    eventSubscription: '$products.eventSubscription',
                    canBePurchased   : '$products.canBePurchased',
                    groupId          : '$products.groupId'
                }
            }, {
                $group: {
                    _id              : '$_id',
                    info             : {$first: '$info'},
                    name             : {$first: '$name'},
                    imageSrc         : {$first: '$imageSrc'},
                    isBundle         : {$first: '$isBundle'},
                    isVariant        : {$first: '$isVariant'},
                    inventory        : {$first: '$inventory'},
                    bundles          : {$push: '$bundles'},
                    workflow         : {$first: '$workflow'},
                    whoCanRW         : {$first: '$whoCanRW'},
                    groups           : {$first: '$groups'},
                    creationDate     : {$first: '$creationDate'},
                    createdBy        : {$first: '$createdBy'},
                    editedBy         : {$first: '$editedBy'},
                    attachments      : {$first: '$attachments'},
                    canBeSold        : {$first: '$canBeSold'},
                    canBeExpensed    : {$first: '$canBeExpensed'},
                    eventSubscription: {$first: '$eventSubscription'},
                    canBePurchased   : {$first: '$canBePurchased'},
                    variants         : {$first: '$variants'},
                    groupId          : {$first: '$groupId'}
                }
            }, {
                $lookup: {
                    from        : 'ProductPrices',
                    localField  : '_id',
                    foreignField: 'product',
                    as          : 'priceLists'
                }
            }, {
                $unwind: {
                    path                      : '$priceLists',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'PriceLists',
                    localField  : 'priceLists.priceLists',
                    foreignField: '_id',
                    as          : 'priceLists.priceLists'
                }
            }, {
                $unwind: {
                    path                      : '$priceLists.priceLists',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'currency',
                    localField  : 'priceLists.priceLists.currency',
                    foreignField: '_id',
                    as          : 'priceLists.priceLists.currency'
                }
            }, {
                $unwind: {
                    path                      : '$priceLists.priceLists.currency',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unwind: {
                    path                      : '$info.categories',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'ProductCategories',
                    localField  : 'info.categories',
                    foreignField: '_id',
                    as          : 'categories'
                }
            }, {
                $unwind: {
                    path                      : '$categories',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    _id              : '$_id',
                    info             : '$info',
                    name             : '$name',
                    isBundle         : '$isBundle',
                    isVariant        : '$isVariant',
                    inventory        : '$inventory',
                    imageSrc         : '$imageSrc',
                    bundles          : '$bundles',
                    workflow         : '$workflow',
                    whoCanRW         : '$whoCanRW',
                    groups           : '$groups',
                    creationDate     : '$creationDate',
                    createdBy        : '$createdBy',
                    editedBy         : '$editedBy',
                    attachments      : '$attachments',
                    canBeSold        : '$canBeSold',
                    canBeExpensed    : '$canBeExpensed',
                    eventSubscription: '$eventSubscription',
                    canBePurchased   : '$canBePurchased',
                    priceLists       : '$priceLists',
                    groupId          : '$groupId',
                    categories       : '$categories',
                    variants         : '$variants'
                }
            }, {
                $group: {
                    _id              : '$_id',
                    pL               : {$push: '$priceLists'},
                    info             : {$first: '$info'},
                    name             : {$first: '$name'},
                    imageSrc         : {$first: '$imageSrc'},
                    isBundle         : {$first: '$isBundle'},
                    isVariant        : {$first: '$isVariant'},
                    inventory        : {$first: '$inventory'},
                    bundles          : {$first: '$bundles'},
                    workflow         : {$first: '$workflow'},
                    whoCanRW         : {$first: '$whoCanRW'},
                    groups           : {$first: '$groups'},
                    creationDate     : {$first: '$creationDate'},
                    createdBy        : {$first: '$createdBy'},
                    editedBy         : {$first: '$editedBy'},
                    attachments      : {$first: '$attachments'},
                    canBeSold        : {$first: '$canBeSold'},
                    canBeExpensed    : {$first: '$canBeExpensed'},
                    eventSubscription: {$first: '$eventSubscription'},
                    canBePurchased   : {$first: '$canBePurchased'},
                    groupId          : {$first: '$groupId'},
                    variants         : {$first: '$variants'},
                    categories       : {
                        $addToSet: {
                            _id     : '$categories._id',
                            name    : '$categories.name',
                            fullName: '$categories.fullName'
                        }
                    }
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
                    _id              : 1,
                    variants         : {$arrayElemAt: ['$variants', 0]},
                    pL               : 1,
                    info             : 1,
                    name             : 1,
                    imageSrc         : 1,
                    isBundle         : 1,
                    isVariant        : 1,
                    inventory        : 1,
                    bundles          : 1,
                    workflow         : 1,
                    whoCanRW         : 1,
                    groups           : 1,
                    creationDate     : 1,
                    createdBy        : 1,
                    editedBy         : 1,
                    attachments      : 1,
                    canBeSold        : 1,
                    canBeExpensed    : 1,
                    eventSubscription: 1,
                    canBePurchased   : 1,
                    groupId          : 1,
                    categories       : 1
                }
            }, {
                $group: {
                    _id              : '$_id',
                    variants         : {$addToSet: '$variants'},
                    pL               : {$first: '$pL'},
                    info             : {$first: '$info'},
                    name             : {$first: '$name'},
                    imageSrc         : {$first: '$imageSrc'},
                    isBundle         : {$first: '$isBundle'},
                    isVariant        : {$first: '$isVariant'},
                    inventory        : {$first: '$inventory'},
                    bundles          : {$first: '$bundles'},
                    workflow         : {$first: '$workflow'},
                    whoCanRW         : {$first: '$whoCanRW'},
                    groups           : {$first: '$groups'},
                    creationDate     : {$first: '$creationDate'},
                    createdBy        : {$first: '$createdBy'},
                    editedBy         : {$first: '$editedBy'},
                    attachments      : {$first: '$attachments'},
                    canBeSold        : {$first: '$canBeSold'},
                    canBeExpensed    : {$first: '$canBeExpensed'},
                    eventSubscription: {$first: '$eventSubscription'},
                    canBePurchased   : {$first: '$canBePurchased'},
                    groupId          : {$first: '$groupId'},
                    categories       : {$first: '$categories'}
                }
            }, {
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
                $group: {
                    _id              : '$_id',
                    variants         : {$addToSet: '$variants'},
                    pL               : {$first: '$pL'},
                    info             : {$first: '$info'},
                    name             : {$first: '$name'},
                    imageSrc         : {$first: '$imageSrc'},
                    isBundle         : {$first: '$isBundle'},
                    isVariant        : {$first: '$isVariant'},
                    inventory        : {$first: '$inventory'},
                    bundles          : {$first: '$bundles'},
                    workflow         : {$first: '$workflow'},
                    whoCanRW         : {$first: '$whoCanRW'},
                    groups           : {$first: '$groups'},
                    creationDate     : {$first: '$creationDate'},
                    createdBy        : {$first: '$createdBy'},
                    editedBy         : {$first: '$editedBy'},
                    attachments      : {$first: '$attachments'},
                    canBeSold        : {$first: '$canBeSold'},
                    canBeExpensed    : {$first: '$canBeExpensed'},
                    eventSubscription: {$first: '$eventSubscription'},
                    canBePurchased   : {$first: '$canBePurchased'},
                    groupId          : {$first: '$groupId'},
                    categories       : {$first: '$categories'},
                    channels         : {
                        $addToSet: {
                            _id : '$channelLinks._id',
                            name: '$channelLinks.channelName',
                            type: '$channelLinks.type'
                        }
                    }
                }
            }, {
                $group: {
                    _id          : '$groupId',
                    id           : {$first: '$_id'},
                    groupId      : {$first: '$groupId'},
                    variantsArray: {$push: '$$ROOT'}
                }
            }, {
                $lookup: {
                    from        : 'Images',
                    localField  : 'groupId',
                    foreignField: 'product',
                    as          : 'images'
                }
            }, {
                $project: {
                    _id          : '$id',
                    groupId      : '$groupId',
                    variantsArray: '$variantsArray',
                    images       : '$images'
                }
            }], function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }

                if (result.length) {
                    waterfallCallback(null, result[0]);
                } else {
                    waterfallCallback(null, {});
                }
            });
        };

        optionsValueSearcher = function (product, waterfallCallback) {
            var groupId = product.groupId;

            Product.aggregate([{
                $match: {
                    groupId: groupId
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
                $unwind: {
                    path                      : '$variants',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    _id   : '$variants.optionId',
                    values: {$addToSet: '$variants._id'}
                }
            }], function (err, productOptions) {
                if (err) {
                    return waterfallCallback(err);
                }

                product.currentValues = productOptions;

                waterfallCallback(null, product);
            });
        };

        optionsIdsSearcher = function (product, waterfallCallback) {
            var groupId = product.groupId;

            Product.find({groupId: groupId}, {
                _id       : 1,
                isVariant : 1,
                variants  : 1,
                'info.SKU': 1
            }, function (err, values) {
                var valIdsArray = {};

                if (err) {
                    return waterfallCallback(err);
                }

                values.forEach(function (item) {
                    var itemJSON = item.toJSON();
                    var strVariants = itemJSON.variants ? itemJSON.variants.toStringObjectIds() : [];
                    var valId;

                    strVariants = strVariants.sort();
                    valId = strVariants.join('/');

                    valIdsArray[valId] = {
                        productId: item._id,
                        sku      : item.info && item.info.SKU
                    };
                });

                product.valuesIds = valIdsArray;

                waterfallCallback(null, product);
            });
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher, optionsValueSearcher, optionsIdsSearcher/*, imagesGetter*/];

        async.waterfall(waterfallTasks, function (err, product) {
            if (err) {
                return next(err);
            }

            res.status(200).send(product);
        });
    }

    function getProductsAvailable(req, res, next) {
        var query = req.query;
        var Availability = models.get(req.session.lastDb, 'productsAvailability', AvailabilitySchema);

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $or: whoCanRw
            };
            var Model = models.get(req.session.lastDb, 'Product', ProductSchema);

            Model.aggregate([{
                $match: matchQuery
            }, {
                $project: {
                    _id: 1
                }
            }], waterfallCallback);
        };

        contentSearcher = function (productsIds, waterfallCallback) {
            var product = query.product ? objectId(query.product) : null;
            var warehouse = query.warehouse ? objectId(query.warehouse) : null;

            query = Availability.aggregate([{
                $match: {
                    product  : product,
                    warehouse: warehouse
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
                    cost       : 1,
                    onHand     : 1,
                    goodsNoteId: {$arrayElemAt: ['$goodsOutNotes.goodsNoteId', 0]},
                    quantity   : '$goodsOutNotes.quantity'
                }
            }, {
                $group: {
                    _id     : '$goodsNoteId.status.shipped',
                    cost    : {$first: '$cost'},
                    onHand  : {$sum: '$onHand'},
                    quantity: {$sum: '$quantity'}
                }
            }], function (err, availability) {
                var availObj = {
                    inStock: 0
                };

                if (err) {
                    return waterfallCallback(err);
                }

                availability.forEach(function (el) {
                    availObj.cost = el.product;
                    availObj.onHand = el.onHand;
                    availObj.allocated = el.allocated;

                    if (!el._id) {
                        availObj.inStock += el.quantity;
                    }
                });

                availObj.inStock += availObj.onHand;

                waterfallCallback(null, [availObj]);
            });
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result[0]);
        });
    }

    function getForDd(req, response, next) {
        var query;
        var res = {};

        res.data = [];

        query = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema).find();

        query.select('_id name ');
        query.sort({name: 1});
        query.exec(function (err, result) {
            if (err) {
                next(err);
            } else {
                res.data = result;
                response.status(200).send(res);
            }
        });
    }

    function getProductsAlphabet(req, response, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var queryObject = {};
        var query;

        query = Product.aggregate([{$match: queryObject}, {$project: {later: {$substr: ['$name', 0, 1]}}}, {$group: {_id: '$later'}}]);

        query.exec(function (err, result) {
            var res = {};

            if (err) {
                return next(err);
            }

            res.data = result;
            response.status(200).send(res);
        });
    }

    /* this.createProductType = function (req, res, next) {
     var body = req.body;
     var ProductTypeModel = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema);
     var productType;
     var error;

     if (!body.name) {
     error = new Error('Name field are required');
     error.status = 404;

     return next(error);
     }

     productType = new ProductTypeModel(body);
     productType.save(function(err) {
     if (err) {
     return next(err);
     }

     res.status(200).send({success: 'Product type created success'});
     });
     };*/

    function imageCreator(image, db, id, main, cb) {
        ImagesService.create({
            main    : main,
            imageSrc: image,
            product : id,
            dbName  : db
        }, function (err, result) {
            if (err) {
                return cb(err);
            }

            cb(null, result);
        });
    }

    this.deleteImage = function (req, res, next) {
        var db = req.session.lastDb;
        //var Product = models.get(db, 'Product', ProductSchema);
        //var ProductCategory = models.get(db, 'ProductCategory', CategorySchema);
        //var ProductPriceModel = models.get(db, 'ProductPrice', ProductPricesSchema);
        var body = req.body;
        //var isBundle = body.isBundle;
        //var bundlesArray = [];
        //var prices;
        //var error;
        //var product;
    }

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var Product = models.get(db, 'Product', ProductSchema);
        var ProductCategory = models.get(db, 'ProductCategory', CategorySchema);
        var ProductPriceModel = models.get(db, 'ProductPrice', ProductPricesSchema);
        var body = req.body;
        var isBundle = body.isBundle;
        var bundlesArray = [];
        var prices;
        var error;
        var product;

        if (!body.info || !body.info.productType || !body.info.categories || !body.info.categories.length) {
            error = new Error('Product type and productCategories are required');
            error.status = 400;

            return next(error);
        }

        if (isBundle) {
            if (body.bundles && Object.keys(body.bundles).length) {
                _.each(body.bundles, function (quantity, id) {
                    bundlesArray.push({
                        _id     : id,
                        quantity: quantity
                    });
                });
            }
        }

        body.bundles = bundlesArray;

        if (body.prices) {
            prices = body.prices;

            delete body.prices;
        }

        if (!body.info) {
            body.info = {};
        }

        body.groupId = new objectId().toString();
        async.waterfall([

            function (wCb) {
                var image = body.imageSrc;
                var imageName = (new objectId()).toString();
                var imageData;

                delete body.imageSrc;

                if (!image) {
                    return wCb();
                }

                imageData = imageHelper.cutPrefixFromBase64(image);

                uploader.postImage(body.groupId, {
                    data: imageData.image,
                    name: imageName + '.' + imageData.mimeType
                }, function (err, imagePath) {
                    if (err) {
                        return wCb(err);
                    }

                    ImagesService.create({
                        imageSrc: imagePath,
                        product : body.groupId,
                        dbName  : db
                    }, function (err, result) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, result);
                    });
                });
            },

            function (result, wCb) {

                if (!wCb && typeof result === 'function') {
                    wCb = result;
                    result = null;
                }

                body.imageSrc = result;

                ProductService.createProduct({body: body, dbName: req.session.lastDb, uId: req.session.uId}, wCb);
            },

            function (product, wCb) {
                var id = product._id;
                // set changed and created product id to redis for integration sync
                redis.sAdd(CONSTANTS.REDIS.CHANGED_PRODUCTS, id.toString(), function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, id);
                });
            },

            function (id, wCb) {
                if (!prices.length) {
                    return wCb(null);
                }

                async.each(prices, function (item, eachCb) {
                    var model;

                    item.product = id;
                    model = new ProductPriceModel(item);
                    model.save(function (err) {
                        if (err) {
                            return eachCb(err);
                        }

                        eachCb(null);
                    });
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null);
                });
            }
        ], function (err) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: product});
        });
    };

    function createAllVariants(variants) {
        var variantsArray = [];
        var temp1;
        var temp2;
        var temp3;
        var temp4;
        var i;
        var j;
        var k;
        var p;

        if (variants.length === 1) {
            temp1 = variants[0].values;

            for (i = 0; i <= temp1.length - 1; i++) {
                variantsArray.push([objectId(temp1[i])]);
            }
        } else if (variants.length === 2) {
            temp1 = variants[0].values;
            temp2 = variants[1].values;

            for (i = 0; i <= temp1.length - 1; i++) {
                for (j = 0; j <= temp2.length - 1; j++) {
                    variantsArray.push([
                        objectId(temp1[i]), objectId(temp2[j])
                    ]);
                }
            }
        } else if (variants.length === 3) {
            temp1 = variants[0].values;
            temp2 = variants[1].values;
            temp3 = variants[2].values;

            for (i = 0; i <= temp1.length - 1; i++) {
                for (j = 0; j <= temp2.length - 1; j++) {
                    for (k = 0; k <= temp3.length - 1; k++) {
                        variantsArray.push([objectId(temp1[i]), objectId(temp2[j]), objectId(temp3[k])]);
                    }
                }
            }
        } else {
            temp1 = variants[0].values;
            temp2 = variants[1].values;
            temp3 = variants[2].values;
            temp4 = variants[3].values;

            for (i = 0; i <= temp1.length - 1; i++) {
                for (j = 0; j <= temp2.length - 1; j++) {
                    for (k = 0; k <= temp3.length - 1; k++) {
                        for (p = 0; p <= temp4.length - 1; p++) {
                            variantsArray.push([
                                objectId(temp1[i]),
                                objectId(temp2[j]),
                                objectId(temp3[k]),
                                objectId(temp4[p])
                            ]);
                        }
                    }
                }
            }
        }

        return variantsArray;
    }

    function createPricesForNewProduct(ProductPricesModel, prices, productId, callback) {
        async.each(prices, function (price, eachCb) {
            var model;

            price = price.toJSON();

            delete price._id;

            price.product = productId;
            model = ProductPricesModel(price);
            model.save(function (err) {
                if (err) {
                    return eachCb(err);
                }

                eachCb(null);
            });
        }, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
    }

    this.createProductVariants = function (req, res, next) {
        var body = req.body;
        var variants = body.variants;
        var isNew = body.isNew;
        var productId = req.params.id;
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var ProductPrices = models.get(req.session.lastDb, 'ProductPrices', ProductPricesSchema);
        var Category = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var modelJSON;
        var error;
        var variantsArray;
        var variantProductId;
        var groupId;
        var countProduct;
        var categoriesIds;
        var firstItem;

        if (isNew) {
            variantsArray = createAllVariants(variants);
            countProduct = variantsArray.length - 1;
            firstItem = variantsArray.shift();
        } else {
            variantsArray = variants;
            countProduct = variantsArray.length;
            firstItem = variantsArray[0];
        }

        function findingOriginalProduct(wCb) {
            if (isNew) {
                Product.findOneAndUpdate({_id: productId}, {
                    $set: {
                        variants : firstItem,
                        isVariant: true,
                    }
                }, function (err, model) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!model) {
                        error = new Error('Such product not found');
                        error.status = 404;
                        return next(err);
                    }

                    modelJSON = model.toJSON();
                    categoriesIds = modelJSON.info && modelJSON.info.categories;

                    groupId = modelJSON.groupId;

                    wCb(null, modelJSON);
                });
            } else {
                Product.findOne({_id: productId}, function (err, model) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!model) {
                        error = new Error('Such product not found');
                        error.status = 404;
                        return next(err);
                    }

                    modelJSON = model.toJSON();
                    categoriesIds = modelJSON.info && modelJSON.info.categories;

                    groupId = modelJSON.groupId;

                    wCb(null, modelJSON);
                });
            }
        }

        function createVariants(modelJSON, wCb) {
            var ids = [];

            async.eachLimit(variantsArray, 1, function (item, eachCb) {
                var model;

                modelJSON.variants = item;
                modelJSON.isVariant = true;

                if (isNew) {
                    modelJSON.groupId = groupId;
                }

                delete modelJSON._id;

                model = new Product(modelJSON);
                model.save(function (err) {
                    if (err) {
                        return eachCb(err);
                    }

                    ids.push(model.toJSON()._id);
                    variantProductId = model.toJSON()._id;

                    eachCb();
                });

            }, function (err) {
                if (err) {
                    return wCb(err);
                }

                wCb(null, ids);
            });
        }

        function createProductPrice(ids, wCb) {
            ProductPrices.find({product: productId}, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                if (!result.length) {
                    return wCb(null);
                }

                async.each(ids, function (id, eachCb) {
                    createPricesForNewProduct(ProductPrices, result, id, eachCb);
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, ids);
                });
            });
        }

        async.waterfall([
            findingOriginalProduct,
            createVariants,
            createProductPrice,
            function (ids, wCb) {
                redis.sAdd(CONSTANTS.REDIS.CHANGED_PRODUCTS, ids, wCb);
            }
        ], function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Variants created success', id: variantProductId});
        });

    };

    this.productsUpdateOnlySelectedFields = function (req, res, next) {
        var id = req.params._id;
        var data = req.body;
        var emptyArray = [];

        if (data.bundles && Object.keys(data.bundles).length) {
            _.each(data.bundles, function (quantity, id) {
                emptyArray.push({
                    _id     : id,
                    quantity: quantity
                });
            });
        }

        data.bundles = emptyArray;

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };

        updateOnlySelectedFields(req, res, next, id, data);
    };

    this.getProductsImages = function (req, res, next) {
        var data = {};
        data.ids = req.query.ids || [];

        getProductImages(req, res, next, data);
    };

    this.removeProduct = function (req, res, next) {
        var id = req.params._id;

        remove(req, id, function (err) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send({success: 'Deleted success'});
        });
    };

    this.bulkRemove = function (req, res, next) {
        var body = req.body || {ids: []};
        var db = req.session.lastDb;
        var ids = body.ids;

        async.each(ids, function (id, eachCb) {
            remove(req, id, function (err) {
                if (err) {
                    return eachCb(err);
                }

                eachCb(null);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            integrationStatsHelper(db, function (err, stats) {
                if (err) {
                    return next(err);
                }

                event.emit('recollectedStats', {dbName: db, stats: stats});
                redis.writeToStorage('syncStats', db, JSON.stringify(stats));

                res.status(200).send({success: 'Removed success'});
            });
        });
    };

    this.getAll = function (req, res, next) {
        getAll(req, res, next);
    };

    this.getForView = function (req, res, next) {
        var viewType = req.query.viewType;
        var id;

        if (req.query.id === 'undefined') {
            id = req.params.id;
        } else {
            id = req.query.id || req.params.id;
        }

        if (id && id.length >= 24) {
            return getProductsById(req, res, next);
        } else if (id && id.length < 24) {
            return res.status(400).send();
        }

        switch (viewType) {
            case 'list':
            case 'thumbnails':
                getProductsFilter(req, res, next);
                break;
            case 'form':
                getProductsById(req, res, next);
                break;
            case 'forBundle':
                getProductsForBundles(req, res, next);
                break;
            default:
                getAll(req, res, next);
                break;
        }
    };

    this.getProductsTypeForDd = function (req, res, next) {

        getForDd(req, res, next);
    };

    this.getProductsAlphabet = function (req, res, next) {

        getProductsAlphabet(req, res, next);
    };

    this.getProductsAvailable = function (req, res, next) {

        getProductsAvailable(req, res, next);
    };

    this.getProductsNames = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        Product.aggregate([
            {
                $match: {}
            },
            {
                $project: {
                    name: 1
                }
            }
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.getProductsDimension = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        Product.aggregate([
            {
                $match: {}
            },
            {
                $project: {
                    dimension: '$inventory.size.dimension'
                }
            }
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var data = req.query || {};
        var filter = data.filter;
        var contentType = data.contentType;
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var optionsObject = {};
        var result = {};

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        result.showMore = false;

        if (data.filter && typeof data.filter === 'object') {
            optionsObject.$and = filterMapper.mapFilter(filter, {contentType: contentType});
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    optionsObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };
            var Model = models.get(req.session.lastDb, 'Product', ProductSchema);

            Model.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (productsIds, waterfallCallback) {
            var query;
            optionsObject._id = {$in: productsIds};

            query = Product.find(optionsObject);
            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, products) {
            if (err) {
                return next(err);
            }

            result.count = products.length;
            res.status(200).send(result);

        });
    };

    this.uploadFile = function (req, res, next) {
        var db = req.session.lastDb;
        var headers = req.headers;
        var id = headers.modelid || 'empty';
        var contentType = headers.modelname || 'products';
        var files = req.files && req.files.attachfile ? req.files.attachfile : null;
        var dir;
        var err;

        contentType = contentType.toLowerCase();
        dir = path.join(contentType, id);

        if (!files) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        uploader.postFile(dir, files, {userId: req.session.uName}, function (err, file) {
            if (err) {
                return next(err);
            }

            imageCreator(file, db, id, false, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Product images is attach!', data: response});
            });
        });
    };

    this.updateSkuForGroup = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var body = req.body;
        var skus = body.skus;

        async.each(skus, function (item, eachCb) {
            Product.update({_id: item.productId}, {$set: {'info.SKU': item.sku}}, function (err) {
                if (err) {
                    return eachCb(err);
                }

                eachCb(null);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Updated success'});
        });
    };

    this.publishToChannel = function (req, res, next) {
        var body = req.body;
        var shippingTemplate = body.shippingTemplate;
        var productIds = body.products;
        var channel = body.channel;
        var priceList = body.priceList;
        var dbName = req.session.lastDb;
        var options = {
            dbName: dbName
        };
        var channelSettings;
        var waterfallTasks;
        var urlSettings;
        var error;
        var type;

        function getProductPrices(productPricesQuery, pCb) {
            ProductPriceService.find(productPricesQuery, {dbName: dbName})
                .lean()
                .exec(function (err, productPrices) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, productPrices);
                });
        }

        function getProducts(productQuery, pCb) {
            if (type === 'magento' || type === 'etsy') {

                return ProductService.getProductsForSyncToChannel({
                    query             : productQuery,
                    populateCategories: true,
                    dbName            : dbName
                }, function (err, products) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, products);
                });

            }

            ProductService.getProductsWithVariants({
                query : productQuery,
                dbName: dbName
            }, function (err, products) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, products);
            });
        }

        function getChannelSettings(wCb) {
            IntegrationsService.findOne({
                _id: channel
            }, options, function (err, channel) {
                if (err) {
                    return wCb(err);
                }

                channelSettings = channel && channel.toJSON();
                type = channelSettings.type;

                wCb();
            });
        }

        function getUrlSettings(wCb) {
            var options = {
                dbName: dbName,
                app   : (channelSettings && channelSettings.type) || CONSTANTS.INTEGRATION.MAGENTO
            };
            var error;

            SettingsService.getSettingsUrlsForApp(options, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                if (!result) {
                    error = new Error('Invalid url settings');
                    error.status = 400;

                    return wCb(err);
                }

                urlSettings = result;

                wCb();
            });
        }

        function getNativeProducts(wCb) {
            var productPricesQuery = {
                priceLists: objectId(priceList),
                product   : {$in: productIds.objectID()}
            };
            var productQuery = {
                _id: {$in: productIds.objectID()}
            };

            async.parallel({
                getProductPrices: async.apply(getProductPrices, productPricesQuery),
                getProducts     : async.apply(getProducts, productQuery)
            }, function (err, parallelRes) {
                var productPrices = parallelRes.getProductPrices;
                var products = parallelRes.getProducts;

                if (err) {
                    return wCb(err);
                }

                products = products.map(function (product) {
                    var needProductPrice = _.find(productPrices, {product: product._id});

                    product.productPrices = needProductPrice;

                    return product;
                });

                wCb(null, products);
            });
        }

        function createProductsOnChannel(products, wCb) {
            var integrationHelper = getHelper(type);
            var opts = {
                dbName: dbName
            };
            var counter = 0;

            opts = _.assign(opts, channelSettings);
            opts.settings = urlSettings;

            async.eachLimit(products, 1, function (product, eCb) {
                var channelLinksObj = {
                    product     : product._id,
                    channel     : objectId(channel),
                    priceList   : objectId(priceList),
                    creationDate: new Date(),
                    dbName      : dbName
                };

                opts.product = product;
                opts.counter = counter;

                if (shippingTemplate) {
                    opts.shippingTemplate = shippingTemplate;
                }

                integrationHelper.publishProduct(opts, function (err, internalId) {
                    if (err) {
                        return eCb(err);
                    }

                    if (!internalId) {
                        return eCb();
                    }

                    channelLinksObj.linkId = internalId.toString();

                    ChannelLinksService.create(channelLinksObj, function (err) {
                        if (err) {
                            return eCb(err);
                        }

                        counter++;

                        eCb();
                    });
                });
            }, function (err) {
                if (err) {
                    return wCb(err);
                }

                wCb();
            });
        }

        waterfallTasks = [
            getChannelSettings,
            getUrlSettings,
            getNativeProducts,
            createProductsOnChannel
        ];

        async.waterfall(waterfallTasks, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Product published success'});
        });
    };

    this.unlinkFromChannel = function (req, res, next) {
        var body = req.body;
        var channel = body.channel;
        var productIds = body.products;
        var criteria = {
            channel: objectId(channel),
            product: {$in: productIds.objectID()}
        };
        var dbName = req.session.lastDb;
        var opts = {
            dbName: dbName
        };

        ChannelLinksService.remove(criteria, opts, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Product is unlinked'});
        });
    };

    this.unpublishFromChannel = function (req, res, next) {
        var body = req.body;
        var channel = body.channel;
        var productIds = body.products;
        var dbName = req.session.lastDb;
        var channelSettings;
        var waterfallTasks;
        var urlSettings;

        function getChannelSettings(wCb) {
            IntegrationsService.findOne({
                _id: channel
            }, {dbName: dbName}, function (err, channel) {
                if (err) {
                    return wCb(err);
                }

                channelSettings = channel && channel.toJSON();

                wCb();
            });
        }

        function getUrlSettings(wCb) {
            var options = {
                dbName: dbName,
                app   : (channelSettings && channelSettings.type) || CONSTANTS.INTEGRATION.MAGENTO
            };
            var error;

            SettingsService.getSettingsUrlsForApp(options, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                if (!result) {
                    error = new Error('Invalid url settings');
                    error.status = 400;

                    return wCb(err);
                }

                urlSettings = result;

                wCb();
            });
        }

        function getChannelLinks(wCb) {
            var criteria = {
                product: {$in: productIds.objectID()},
                channel: channel
            };
            var options = {
                dbName: dbName,
                linkId: 1
            };

            ChannelLinksService.find(criteria, options)
                .lean()
                .exec(function (err, channelLinks) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, channelLinks);
                });
        }

        function deleteProductOnChannel(channelLinks, wCb) {
            var opts = {};
            var integrationHelper;
            var internalProductIds;
            var pluckType;
            var type;

            opts = _.assign(opts, channelSettings);
            opts.settings = urlSettings;

            integrationHelper = getHelper(channelSettings.type);

            async.each(channelLinks, function (channelLink, eCb) {
                opts.productId = channelLink.linkId;

                integrationHelper.unpublishProduct(opts, function (err) {
                    if (err) {
                        return eCb(err);
                    }

                    eCb();
                });
            }, function (err) {
                if (err) {
                    return wCb(err);
                }

                wCb();
            });
        }

        function deleteChannelLinks(wCb) {
            var criteria = {
                channel: objectId(channel),
                product: {$in: productIds.objectID()}
            };
            var options = {
                dbName: dbName
            };

            ChannelLinksService.remove(criteria, options, function (err) {
                if (err) {
                    return wCb(err);
                }

                wCb();
            });
        }

        waterfallTasks = [
            getChannelSettings,
            getUrlSettings,
            getChannelLinks,
            deleteProductOnChannel,
            deleteChannelLinks
        ];

        async.waterfall(waterfallTasks, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Products unpublished success'});
        });
    };

    this.getInventoryForProduct = function (req, res, next) {
        var options = {
            id    : req.params.id,
            dbName: req.session.lastDb
        };

        ProductService.getInventoryForProduct(options, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.getForManufacturing = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        Product.find({}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    // this.getProductsAvailability = function (req, res, next) {
    //     var body = req.body;
    //     var startDate = body.startDate ? new Date(body.startDate) : new Date();
    //     var endDate = body.endDate ? new Date(body.endDate) : new Date();
    //
    //     var options = {
    //         startDate: startDate,
    //         endDate  : endDate,
    //         dbName   : req.session.lastDb
    //     };
    //
    //     async.parallel({
    //             openingBalance: function (cb) {
    //                 GoodsInNoteService.getBeforeStartDate(options, cb);
    //             }
    //         }, {
    //             inwards: function (cb) {
    //                 GoodsInNoteService.getBetwenDates(options, cb);
    //             }
    //         }, {
    //             outwards: function (cb) {
    //                 GoodsOutNoteService.getBetwenDates(options, cb);
    //             }
    //         },
    //         function (err, result) {
    //             if (err) {
    //                 return next(err);
    //             }
    //
    //             getDifference(result, function (newResult) {
    //                 res.status(200).send(newResult);
    //             });
    //         }
    //     )
    // };
    //
    // function getDifference(result, callback) {
    //     var openingBalance = [];
    //     var wards = result.inwards.concat(result.outwards).concat(result.openingBalance);
    //     var ids = {};
    //
    //     wards.forEach(function (item) {
    //         if (!ids[item._id.toString()]) {
    //             ids[item._id.toString()] = true;
    //         }
    //     });
    //
    //     ids = Object.keys(ids);
    //
    //     ids.forEach(function (id) {
    //         var obj = {
    //             openingQuantity : 0,
    //             inwardsQuantity : 0,
    //             outwardsQuantity: 0
    //         };
    //         var buff = _.where(wards, function (el) {
    //             return el._id.toString() === id;
    //         });
    //
    //         buff.forEach(function (itm) {
    //             obj.name = itm.name;
    //             obj.info = item.info;
    //
    //             if (itm.openingQuantity) {
    //                 obj.openingQuantity += itm.openingQuantity;
    //             }
    //             if (itm.inwardsQuantity) {
    //                 obj.inwardsQuantity += itm.inwardsQuantity;
    //             }
    //             if (itm.outwardsQuantity) {
    //                 obj.outwardsQuantity += itm.outwardsQuantity;
    //             }
    //         });
    //
    //         obj.balance = (obj.openingQuantity + obj.inwardsQuantity) - obj.outwardsQuantity;
    //         openingBalance.push(obj);
    //     });
    //
    //     callback(openingBalance);
    // }
};

module.exports = Products;
