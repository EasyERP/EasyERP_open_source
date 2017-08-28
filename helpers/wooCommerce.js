var mongoose = require('mongoose');
var request = require('request');
var _ = require('lodash');
var async = require('async');
var path = require('path');
var ObjectId = mongoose.Types.ObjectId;
var redisClient = require('../helpers/redisClient');
var CONSTANTS = require('../constants/mainConstants');
var ratesRetriever = require('../helpers/ratesRetriever')();
var RefundsHelper = require('../helpers/refunds');
var Uploader = require('../services/fileStorage/index');
var SyncLogsHelper = require('../helpers/syncLogs');
var WooCommerceApi = require('./wooCommerceAPI');
var woo;
var WorkflowHandler = require('../handlers/workflow');

module.exports = function (models, event) {
    var customerService = require('../services/customer')(models);
    var currencyService = require('../services/currency')(models);
    var productService = require('../services/products')(models);
    var paymentMethodService = require('../services/paymentMethod')(models);
    var AvailabilityService = require('../services/productAvailability')(models);
    var ConflictService = require('../services/conflict')(models);
    var WorkflowService = require('../services/workflow')(models);
    var IntegrationService = require('../services/integration')(models);
    var OrderService = require('../services/order')(models);
    var OrderRowsService = require('../services/orderRows')(models);
    var productTypeService = require('../services/productType')(models);
    var productPriceService = require('../services/productPrice')(models);
    var ratesService = require('../services/rates')(models);
    var taxesService = require('../services/taxes')(models);
    var paymentService = require('../services/payments')(models);
    var ProductOptionService = require('../services/productOption')(models);
    var ProductOptionValueService = require('../services/productOptionValue')(models);
    var imagesService = require('../services/images')(models);
    var channelLinksService = require('../services/channelLinks')(models);
    var organizationService = require('../services/organizationSetting')(models);
    var warehouseService = require('../services/warehouse')(models);
    var productCategoryService = require('../services/category')(models);
    var invoiceService = require('../services/invoices')(models);
    var journalEntryService = require('../services/journalEntry')(models);
    var syncLogsHelper = new SyncLogsHelper(models);

    var logs;

    var workflowHandler = new WorkflowHandler(models);

    var refundsHelper = new RefundsHelper(models);

    function getVersionApi(wooVersion) {
        var version = 'v1';

        if (wooVersion >= '2.7') {
            version = 'v2';
        }

        return version;
    }

    function statusBuilder(status, workflowObj) {
        switch (status) {
            case 'cancelled':
                return workflowObj.Canceled;
            default :
                return workflowObj['In Progress'];
        }
    }

    function updateWooVariantsV1(options, callback) {
        var wooVariationId;
        var wooProductId;
        var variations;
        var updateUrl;
        var index;
        var model;
        var error;

        if (!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        wooProductId = options.wooProductId;
        wooVariationId = options.wooVariationId;
        model = options.model;

        if (!wooVariationId || !wooProductId || !model) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        updateUrl = 'products/';

        woo.get(updateUrl + wooProductId, function (err, data, res) {
            if (err) {
                return callback(err);
            }

            if (!res) {
                error = new Error('Product not found');
                error.status = 400;

                return callback(error);
            }

            res = JSON.parse(res);

            variations = res.variations;
            index = _.findIndex(variations, {id: parseInt(wooVariationId, 10)});

            if (index) {
                variations[index] = _.assign(variations[index], model);
            }

            variations.map(function (variation) {
                delete variation.sku;

                return variation;
            });

            woo.put(updateUrl + wooProductId, {variations: variations}, function (err, data, res) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        });
    }

    function getCategories(opts, allCallback) {
        var db = opts.dbName;
        var user = opts.userId || opts.user;
        var baseUrl = opts.baseUrl;
        var consumerKey = opts.username;
        var consumerSecret = opts.password;
        var urlSettings = opts.settings;
        var channel = opts._id || opts.channel;
        var categoriesUrl;
        var versionApi = 'v1';
        var logsOptions;
        var err;

        // TODO: set logs options
        logsOptions = {
            action  : 'imports',
            category: 'categories'
        };

        if (!baseUrl || !consumerKey || !consumerSecret || !urlSettings || !opts.version) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            // TODO: write critical error
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                message: err.message
            });

            return allCallback(err);
        }

        categoriesUrl = (urlSettings[versionApi] && urlSettings[versionApi].categories && urlSettings[versionApi].categories.create) || 'products/categories';

        if (!woo) {
            woo = new WooCommerceApi({
                url            : baseUrl,
                consumerKey    : consumerKey,
                consumerSecret : consumerSecret,
                wpAPI          : true,
                version        : 'wc/v1',
                queryStringAuth: true
            });
        }

        function getParrentCategory(newCategoryObj, callback) {
            var query = {
                integrationId: newCategoryObj.parent && newCategoryObj.parent.toString()
            };
            var options = {
                dbName: db
            };

            productCategoryService.findOne(query, options, function (err, parentCategory) {
                if (err) {
                    return callback(err);
                }

                if (parentCategory) {
                    return callback(null, parentCategory, newCategoryObj);
                }

                productCategoryService.findOne({_id: ObjectId(CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID)}, {dbName: db}, function (err, parentCategory) {
                    var error;

                    if (err) {
                        return callback(err);
                    }

                    if (!parentCategory) {
                        error = new Error('Default category not found. Please set up settings');
                        error.status = 404;

                        return callback(error);
                    }

                    callback(null, parentCategory, newCategoryObj);
                });

            });
        }

        function saveCurrentCategory(parentCategory, newCategory, callback) {
            var saveObj = {
                name     : newCategory.name,
                fullName : parentCategory ? parentCategory.fullName + '/' + newCategory.name : newCategory.name,
                parent   : parentCategory._id,
                createdBy: {
                    user: user,
                    date: new Date()
                },

                editedBy: {
                    user: user,
                    date: new Date()
                },

                integrationId: newCategory.id.toString(),
                channel      : channel,
                dbName       : db
            };

            productCategoryService.create(saveObj, function (err) {
                if (err) {
                    // TODO: write error logs
                    logs = syncLogsHelper.addError(logs, logsOptions, {
                        entityId         : saveObj.integrationId,
                        entityDescription: saveObj.name,
                        message          : 'Error on import' + saveObj.integrationId + ' category'
                    });

                    return callback(err);
                }

                // TODO: write success logs
                logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                    entityId         : saveObj.integrationId,
                    entityDescription: saveObj.name,
                    type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE,
                    message          : 'Import ' + saveObj.integrationId + ' category is success'
                });

                callback();
            });
        }

        woo.get(categoriesUrl, function (err, data, res) {
            var resultCategory;
            var waterfallTasks;
            var error;

            if (err) {
                // TODO: write critical error logs
                logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                    message: err.message
                });

                return allCallback(err);
            }

            resultCategory = JSON.parse(res);

            if (resultCategory.code && resultCategory.data && resultCategory.data.status && resultCategory.data.status !== 200) {
                error = new Error(resultCategory.message);
                error.status = resultCategory.data.status;

                logs = syncLogsHelper.addError(logs, logsOptions, {
                    message: error.message
                });


                return allCallback(error);
            }

            if (!res) {
                error = new Error('Categories not found');
                error.status = 400;

                // TODO: write error logs
                logs = syncLogsHelper.addError(logs, logsOptions, {
                    message: error.message
                });


                return allCallback(error);
            }

            resultCategory = JSON.parse(res);
            resultCategory = _.sortByOrder(resultCategory, 'parent');

            async.eachLimit(resultCategory, 1, function (category, eCb) {
                if (!category.id) {
                    return eCb();
                }

                productCategoryService.findOne({
                    integrationId: category.id && category.id,
                    channel      : channel
                }, {dbName: db}, function (err, resultCategory) {
                    if (err) {
                        return allCallback(err);
                    }

                    if (resultCategory) {
                        return allCallback();
                    }

                    waterfallTasks = [
                        async.apply(getParrentCategory, category),
                        saveCurrentCategory
                    ];

                    async.waterfall(waterfallTasks, eCb);
                });

            }, function (err, result) {
                if (err) {
                    return allCallback(err);
                }

                allCallback();
            });
        });
    }

    function exportCategories(opts, allCallback) {
        var channel = opts._id || opts.channel;
        var db = opts.dbName;
        var query = {$and: [{channel: {$ne: ObjectId(channel)}}, {integrationId: {$ne: '2'}}]};
        var baseUrl = opts.baseUrl;
        var urlSettings = opts.settings;
        var consumerKey = opts.username;
        var consumerSecret = opts.password;
        var categoriesUrl;
        var versionApi = 'v1';
        var err;

        if (!baseUrl || !consumerKey || !consumerSecret || !urlSettings || !opts.version) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            return allCallback(err);
        }

        categoriesUrl = (urlSettings[versionApi] && urlSettings[versionApi].categories && urlSettings[versionApi].categories.create) || 'products/categories';

        if (!woo) {
            woo = new WooCommerceApi({
                url            : baseUrl,
                consumerKey    : consumerKey,
                consumerSecret : consumerSecret,
                wpAPI          : true,
                version        : 'wc/v1',
                queryStringAuth: true
            });
        }

        productCategoryService.find(query, {dbName: db})
            .lean()
            .exec(function (err, resultCategories) {
                if (err) {
                    return allCallback(err);
                }

                if (!resultCategories || !resultCategories.length) {
                    return allCallback();
                }

                async.eachLimit(resultCategories, 1, function (category, eCb) {
                    if (!category.parent) {
                        return eCb();
                    }

                    productCategoryService.findOne({_id: category.parent}, {dbName: db}, function (err, parentCategory) {
                        var parent;
                        var model;

                        if (err) {
                            return eCb(err);
                        }

                        parent = parentCategory.toJSON();

                        model = {
                            parent: parent.integrationId || parent.externalId || 0,
                            name  : category.name
                        };

                        woo.post(categoriesUrl, model, function (err, data, res) {
                            var integrationId;

                            if (err) {
                                return eCb(err);
                            }

                            if (!res.id) {
                                return eCb();
                            }

                            integrationId = res.id;

                            productCategoryService.findByIdAndUpdate(category._id, {
                                $set: {
                                    integrationId: integrationId,
                                    channel      : channel
                                }
                            }, function (err) {
                                if (err) {
                                    return eCb(err);
                                }

                                eCb();
                            });
                        });

                    });
                }, function (err) {
                    if (err) {
                        return allCallback(err);
                    }

                    allCallback();
                });
            });
    }

    function createPriceList(priceList, productId, wooPrice, db, cb) {
        var newPriceList = {
            product: productId,

            prices: [{
                count: 1,
                price: wooPrice
            }, {
                count: 0,
                price: 0
            }, {
                count: 0,
                price: 0
            }, {
                count: 0,
                price: 0
            }, {
                count: 0,
                price: 0
            }],

            priceLists: priceList,
            dbName    : db
        };

        productPriceService.create(
            newPriceList,
            function (err) {
                if (err) {
                    return cb(err);
                }

                cb();
            });
    }

    function imageCreator(imagesArray, options, callback) {
        var channel;
        var groupId;
        var dbName;
        var error;

        if (!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        channel = options.channel;
        groupId = options.groupId;
        dbName = options.dbName;

        if (!imagesArray.length) {
            return imagesService.create({
                imageSrc: CONSTANTS.DEFAULT_IMAGE_URL,
                product : groupId,
                dbName  : dbName
            }, callback);
        }

        if (!channel || !groupId || !dbName) {
            error = new Error('Not enough parameters');
            error.status = 400;

            return callback(error);
        }

        async.each(imagesArray, function (image, eCb) {
            if (!image.integrationId && image.integrationId !== 0) {
                return eCb();
            }

            imagesService.create({
                imageSrc     : image.imageSrc,
                product      : groupId,
                channel      : channel,
                integrationId: image.integrationId,
                dbName       : dbName
            }, eCb);
        }, function (err) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    }

    function createProduct(createOptions, wooProductId, productObjArray, internalProds, imageArray, eachCb) {
        var options = createOptions.options;
        var channel = createOptions.channel;
        var priceList = createOptions.priceList;
        var dbName = createOptions.dbName;
        var groupId = productObjArray[0].groupId;
        var checkIdentitySKU;
        var logsOptions;

        // TODO: set logs options
        logsOptions = {
            action  : 'imports',
            category: 'products'
        };

        var imageOpts = {
            dbName : dbName,
            channel: channel,
            groupId: groupId
        };

        if (!eachCb && typeof imageArray === 'function') {
            eachCb = imageArray;
            imageArray = [];
        }

        imageCreator(imageArray, imageOpts, function (err) {
            if (err) {
                return eachCb(err);
            }

            async.eachLimit(productObjArray, 1, function (productObj, secondEachCb) {
                checkIdentitySKU = false;
                options.body = _.extend({}, productObj);

                delete options.body.wooId;
                delete options.body.wooVariantId;

                if (options.body.info.SKU.toString() && internalProds.length) {
                    checkIdentitySKU = _.find(internalProds, function (el) {
                        return el.sku === productObj.info.SKU.toString();
                    });
                }

                channelLinksService.findOne({
                    linkId : wooProductId + '|' + productObj.wooVariantId,
                    channel: channel
                }, {
                    dbName: dbName
                }, function (err, channelLinks) {
                    if (err) {
                        return secondEachCb(err);
                    }

                    if (channelLinks) {
                        return secondEachCb();
                    }

                    if (!productObj.info.SKU || !productObj.name) {

                        return ConflictService.findOne({
                            'fields.id'     : productObj.wooVariantId,
                            entity          : 'Product',
                            type            : 'unlinked',
                            'fields.channel': ObjectId(channel)
                        }, {
                            dbName: dbName
                        }, function (err, result) {
                            var unlinkedBody;

                            if (err) {
                                return secondEachCb(err);
                            }

                            if (result) {
                                return secondEachCb();
                            }

                            unlinkedBody = {
                                id     : productObj.wooVariantId,
                                mainId : wooProductId,
                                channel: ObjectId(channel),
                                name   : productObj.name,
                                sku    : productObj.info.SKU,
                                price  : productObj.price,
                                isValid: false,
                                groupId: productObj.groupId
                            };

                            ConflictService.create({
                                entity: 'Product',
                                type  : 'unlinked',
                                fields: unlinkedBody,
                                dbName: options.dbName
                            }, function (err) {
                                if (err) {
                                    // TODO: write error logs
                                    logs = syncLogsHelper.addError(logs, logsOptions, {
                                        entityId         : unlinkedBody.id,
                                        entityDescription: unlinkedBody.name,
                                        message          : err.message
                                    });

                                    return secondEachCb(err);
                                }

                                // TODO: write unlinked logs
                                logs = syncLogsHelper.addUnlink(logs, logsOptions, {
                                    entityId         : unlinkedBody.id,
                                    entityDescription: unlinkedBody.name,
                                    message          : 'Import ' + unlinkedBody.id + ' product is unlinked'
                                });

                                secondEachCb();
                            });
                        });
                    }

                    if (checkIdentitySKU) {
                        ConflictService.findAndUpdate({
                            'fields.wooVariantId': productObj.wooVariantId,
                            'fields.channel'     : ObjectId(channel)
                        }, {
                            entity: 'Product',
                            fields: productObj
                        }, {
                            upsert: true,
                            dbName: options.dbName
                        }, function (err, result) {
                            if (err) {
                                return secondEachCb(err);
                            }

                            if (result && result._id) {
                                logs = syncLogsHelper.addConflict(logs, logsOptions, {
                                    entityId: productObj.wooVariantId,
                                    type    : CONSTANTS.SYNC_LOGS.TYPE.UPDATE,
                                    message : 'Import ' + productObj.wooVariantId + ' product is updated'
                                });

                            }

                            event.emit('showResolveConflict', {uId: createOptions.uId});

                            secondEachCb();
                        });
                    } else {
                        async.waterfall([
                            function (wCb) {
                                var wooImageId = options.body && options.body.wooImageId && options.body.wooImageId.toString();

                                if (!wooImageId && (wooImageId !== 0)) {
                                    delete options.wooImageId;
                                    return wCb();
                                }

                                imagesService.findOne({integrationId: wooImageId}, {
                                    dbName: dbName
                                }, function (err, resultImage) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    delete options.wooImageId;

                                    if (!resultImage) {
                                        return wCb();
                                    }

                                    options.body.imageSrc = resultImage._id;

                                    wCb();
                                });
                            },

                            function (wCb) {
                                var wooProductCategories = productObj.wooCategories;
                                var wooCategoriesIds = [];
                                var nativeCategories;

                                wooProductCategories.forEach(function (cat) {
                                    wooCategoriesIds.push(cat.id.toString());
                                });

                                productCategoryService.find({integrationId: {$in: wooCategoriesIds}}, {
                                    dbName: dbName,
                                    _id   : 1
                                })
                                    .lean()
                                    .exec(function (err, resultCategories) {
                                        if (err) {
                                            return wCb();
                                        }

                                        if (!resultCategories || !resultCategories.length) {
                                            nativeCategories = [CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID];
                                            return wCb();
                                        }

                                        nativeCategories = _.pluck(resultCategories, '_id');

                                        options.body.info ? options.body.info.categories = nativeCategories : options.body.info = {
                                            categories: nativeCategories
                                        };

                                        wCb();
                                    });
                            },

                            function (wCb) {
                                productService.createProduct(options, function (err, product) {
                                    if (err) {
                                        // TODO: write error logs
                                        logs = syncLogsHelper.addError(logs, logsOptions, {
                                            entityId         : wooProductId,
                                            entityDescription: options.body.name,
                                            message          : err.message
                                        });

                                        return wCb(err);
                                    }

                                    // TODO: write success logs
                                    logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                        entityId         : wooProductId,
                                        entityDescription: options.body.name,
                                        type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE,
                                        message          : 'Import ' + wooProductId + ' product is success'
                                    });

                                    wCb(null, product);
                                });
                            },

                            function (product, wCb) {
                                createPriceList(priceList, product, productObj.price, options.dbName, function (err) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb(null, product);
                                });
                            },

                            function (product, wCb) {
                                var linkId = wooProductId + '|' + (productObj.wooVariantId || 0);
                                var channelLinksObj = {
                                    product  : product,
                                    linkId   : linkId,
                                    channel  : channel,
                                    priceList: priceList,
                                    dbName   : dbName
                                };

                                channelLinksService.create(channelLinksObj, function (err) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb();
                                });
                            }
                        ], function (err) {
                            if (err) {
                                return secondEachCb(err);
                            }

                            secondEachCb();
                        });
                    }
                });
            }, function (err) {
                if (err) {
                    return eachCb(err);
                }

                eachCb();
            });
        });
    }

    function getProducts(opts, allCallback) {
        var db = opts.dbName;
        var uId = opts.userId || opts.user;
        var baseUrl = opts.baseUrl;
        var settings = opts.settings;
        var priceList = opts.priceList;
        var consumerKey = opts.username;
        var consumerSecret = opts.password;
        var channel = opts._id || opts.channel;
        var internalProds = [];
        var urlSettings = opts.settings;
        var productsUrl;
        var versionApi = 'v1';
        var fullRoute;
        var products = [];
        var logsOptions;
        var err;

        // TODO: set logs options
        logsOptions = {
            action  : 'imports',
            category: 'products'
        };

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        if (!baseUrl || !consumerKey || !consumerSecret || !urlSettings || !opts.version) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            // TODO: write critical error
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                message: err.message
            });

            return allCallback(err);
        }

        productsUrl = (urlSettings[versionApi] && urlSettings[versionApi].products && urlSettings[versionApi].products.get) || 'products';

        if (!woo) {
            woo = new WooCommerceApi({
                url           : baseUrl,
                consumerKey   : consumerKey,
                consumerSecret: consumerSecret,
                wpAPI         : true,
                version       : 'wc/v1'
            });
        }

        async.waterfall([
            function (wCb) {
                var helperForWhile = true;
                var pageNumber = 1;

                if (opts.product) {
                    return wCb();
                }

                async.whilst(function () {
                    return helperForWhile;
                }, function (whCb) {
                    woo.get(productsUrl + '?page=' + pageNumber + '&per_page=100', function (err, data, res) {
                        var result;

                        if (err) {
                            // TODO: write critical error
                            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                message: err.message
                            });

                            helperForWhile = false;
                            return whCb(err);
                        }

                        result = JSON.parse(res);

                        if (result.code && result.message && result.data && result.data.status !== 200) {
                            helperForWhile = false;

                            err = new Error(result.message);
                            err.status = result.data.status;

                            // TODO: write error logs
                            logs = syncLogsHelper.addError(logs, logsOptions, {
                                message: err.message
                            });

                        }

                        if (result && result.length < 100) {
                            helperForWhile = false;
                        }

                        products = products.concat(result);
                        pageNumber++;

                        whCb();
                    });
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, products);
                });
            },

            function (products, wCb) {

                if (products && typeof wCb === 'function') {
                    return wCb(null, products);
                }

                wCb = products;

                woo.get(productsUrl + opts.product.id, function (err, data, res) {
                    if (err) {
                        // TODO: write critical error
                        logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                            message: err.message
                        });

                        return wCb(err);
                    }

                    products = JSON.parse(res);

                    wCb(null, [products]);
                });
            }
        ], function (err, products) {
            if (err) {
                return allCallback(err);
            }

            productService.find({}, {
                'info.SKU': 1,
                dbName    : db
            }, function (err, result) {
                if (err) {
                    return allCallback(err);
                }

                if (result.length) {
                    internalProds = _.map(result, function (elem) {
                        return {
                            sku: elem.info.SKU
                        };
                    });
                }

                async.eachLimit(products, 1, function (wooProduct, eachCb) {
                    var options = {
                        dbName: db
                    };
                    var imageSrcArray = [];
                    var productObjArray = [];
                    var createOptions = {
                        channel  : channel,
                        uId      : uId,
                        options  : options,
                        priceList: priceList,
                        dbName   : db
                    };
                    var variantsLength = wooProduct.variations && wooProduct.variations.length;
                    var productTypeOptions = [];
                    var productOptionValues = [];
                    var variantOptionValues;
                    var productObj;
                    var newGroupId;
                    var i;

                    if (err) {
                        return eachCb(err);
                    }

                    function creatingOptions(wCb) {
                        if (!wooProduct.attributes || !wooProduct.attributes.length) {
                            return wCb();
                        }

                        async.each(wooProduct.attributes, function (option, eCb) {

                            ProductOptionService.findOneAndUpdate({
                                name: option.name
                            }, {}, {
                                upsert: true,
                                new   : true,
                                dbName: db
                            }, function (err, productOption) {
                                var productOptionId;

                                if (err) {
                                    return eCb(err);
                                }

                                productOptionId = productOption._id || productOption.upserted[0]._id;

                                productTypeOptions.push(productOptionId);

                                async.each(option.options, function (value, eCb2) {
                                    ProductOptionValueService.findOneAndUpdate({
                                        optionId: productOptionId,
                                        value   : value
                                    }, {}, {
                                        upsert: true,
                                        new   : true,
                                        dbName: db
                                    }, function (err, productOptionValue) {
                                        if (err) {
                                            return eCb2(err);
                                        }

                                        productOptionValues.push({
                                            our   : productOptionValue._id || productOptionValue.upserted[0]._id,
                                            theirs: value
                                        });

                                        eCb2();
                                    });
                                }, function (err) {
                                    if (err) {
                                        return eCb(err);
                                    }

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

                    function updateProductTypeOptions(wCb) {
                        var updateObj = {
                            $addToSet: {
                                options: {$each: productTypeOptions}
                            }
                        };

                        productTypeService.findOneAndUpdate({
                            _id: ObjectId(CONSTANTS.DEFAULT_PRODUCT_TYPE_ID)
                        }, updateObj, {
                            dbName: db
                        }, wCb);
                    }

                    function createImages(productTypeOptions, wCb) {
                        var wooImages;

                        if (!wooProduct.images || !wooProduct.images.length) {
                            return wCb(null);
                        }

                        wooImages = wooProduct.images;

                        wooImages.forEach(function (image) {
                            imageSrcArray.push({
                                imageSrc     : image.src,
                                integrationId: image.id
                            });
                        });

                        wCb(null, productTypeOptions);
                    }

                    async.waterfall([creatingOptions, updateProductTypeOptions, createImages], function (err) {
                        var imageId;
                        var image;

                        newGroupId = new ObjectId().toString();

                        if (err) {
                            return eachCb(err);
                        }

                        if (!variantsLength) {
                            productObj = {
                                channel     : ObjectId(channel),
                                wooId       : wooProduct.id,
                                wooVariantId: 0,
                                name        : wooProduct.name || wooProduct.title,

                                info: {
                                    productType: CONSTANTS.DEFAULT_PRODUCT_TYPE_ID,
                                    categories : [CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID], // set default category to product
                                    SKU        : wooProduct.sku || '',
                                    description: wooProduct.description || ''
                                },

                                price        : wooProduct.price,
                                groupId      : newGroupId,
                                isVariant    : false,
                                wooCategories: wooProduct.categories
                            };

                            imageId = (wooProduct.images && wooProduct.images.length && wooProduct.images[0].id) || 0;

                            productObj.wooImageId = imageId;

                            createProduct(createOptions, wooProduct.id, [productObj], internalProds, imageSrcArray, eachCb);
                        } else {
                            for (i = variantsLength - 1; i >= 0; i--) {
                                variantOptionValues = productOptionValues.filter(function (el) {
                                    if (wooProduct.variations[i].attributes[3]) {
                                        return el.theirs === wooProduct.variations[i].attributes[0].option || el.theirs === wooProduct.variations[i].attributes[1].option || el.theirs === wooProduct.variations[i].attributes[2].option || el.theirs === wooProduct.variations[i].attributes[3].option;
                                    }
                                    if (wooProduct.variations[i].attributes[2]) {
                                        return el.theirs === wooProduct.variations[i].attributes[0].option || el.theirs === wooProduct.variations[i].attributes[1].option || el.theirs === wooProduct.variations[i].attributes[2].option;
                                    }

                                    if (wooProduct.variations[i].attributes[1]) {
                                        return el.theirs === wooProduct.variations[i].attributes[0].option || el.theirs === wooProduct.variations[i].attributes[1].option; //|| el.theirs === wooProduct.variations[i].attributes[2].option;
                                    }

                                    if (wooProduct.variations[i].attributes[0]) {
                                        return el.theirs === wooProduct.variations[i].attributes[0].option;
                                    }
                                });

                                productObj = {
                                    channel     : ObjectId(channel),
                                    wooId       : wooProduct.id,
                                    wooVariantId: wooProduct.variations[i].id,
                                    name        : wooProduct.name || wooProduct.title,

                                    info: {
                                        productType: CONSTANTS.DEFAULT_PRODUCT_TYPE_ID,
                                        categories : [CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID], // set default category to product
                                        SKU        : wooProduct.variations[i].sku || '',
                                        description: wooProduct.description || ''
                                    },

                                    price        : wooProduct.variations[i].sale_price,
                                    groupId      : newGroupId,
                                    isVariant    : true,
                                    variants     : _.pluck(variantOptionValues, 'our'),
                                    wooCategories: wooProduct.categories
                                };

                                image = (wooProduct.variations[i].image && wooProduct.variations[i].image.length && wooProduct.variations[i].image[0]);
                                imageId = image.id;

                                productObj.wooImageId = imageId;
                                productObjArray.push(productObj);

                                imageSrcArray.push({
                                    imageSrc     : image.src,
                                    integrationId: imageId
                                });
                            }

                            createProduct(createOptions, wooProduct.id, productObjArray, internalProds, imageSrcArray, eachCb);
                        }
                    });
                }, function (err, result) {
                    if (err) {
                        return allCallback(err);
                    }

                    allCallback();
                });
            });
        });
    }

    function exportProducts(opts, allCallback) {
        var productObjectIds;
        var consumerSecret;
        var productPrices;
        var channelLinks;
        var consumerKey;
        var urlSettings;
        var productsUrl;
        var versionApi = 'v1';
        var channel;
        var baseUrl;
        var wooId;
        var logsOptions;
        var error;
        var db;

        // TODO: set logs options
        logsOptions = {
            action  : 'exports',
            category: 'products'
        };

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        db = opts.dbName;
        baseUrl = opts.baseUrl;
        channel = opts._id || opts.channel;
        consumerKey = opts.username;
        consumerSecret = opts.password;
        urlSettings = opts.settings;

        if (!baseUrl || !consumerKey || !consumerSecret || !urlSettings || !opts.version) {
            error = new Error('Invalid integration settings');
            error.status = 400;

            // TODO: write critical error
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                message: err.message
            });

            return allCallback(error);
        }

        productsUrl = (urlSettings[versionApi] && urlSettings[versionApi].products && urlSettings[versionApi].products.put) || 'products'

        if (!woo) {
            woo = new WooCommerceApi({
                url            : baseUrl,
                consumerKey    : consumerKey,
                consumerSecret : consumerSecret,
                wpAPI          : true,
                version        : 'wc/v1',
                queryStringAuth: true
            });
        }

        async.waterfall([
            function (wCb) {
                // get changed or created product id from Redis to export
                redisClient.sMembers(CONSTANTS.REDIS.CHANGED_PRODUCTS, function (err, values) {
                    if (err) {
                        return wCb(err);
                    }

                    redisClient.sMove(CONSTANTS.REDIS.CHANGED_PRODUCTS, values, function (err) {
                        if (err) {
                            console.error(err);
                        }

                        console.log('Red is_ChangedProducts cleared!');
                    });

                    if (!values || !values.length) {
                        return allCallback();
                    }

                    wCb(null, values);
                });
            },

            function (productIds, wCb) {
                productObjectIds = productIds.objectID();

                channelLinksService.find({channel: channel, product: {$in: productObjectIds}}, {dbName: db})
                    .lean()
                    .exec(function (err, links) {
                        if (err) {
                            return wCb(err);
                        }

                        channelLinks = links;

                        wCb();
                    });
            },

            function (wCb) {
                var priceLists = _.pluck(channelLinks, 'priceList');

                productPriceService.find({priceLists: {$in: priceLists}}, {dbName: db})
                    .lean()
                    .exec(function (err, prices) {
                        if (err) {
                            return wCb(err);
                        }

                        productPrices = prices;

                        wCb();
                    });
            },

            function (wCb) {
                productService.getProductsForChannelWithVariants({
                    dbName : db,
                    channel: channel,
                    query  : {_id: {$in: productObjectIds}}
                }, function (err, products) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, products);
                });
            }
        ], function (err, products) {
            if (err) {
                return allCallback(err);
            }

            if (!products.length) {
                return allCallback();
            }

            async.eachLimit(products, 10, function (product, eCb) {
                var channelLink = channelLinks.find(function (link) {
                    return link.product.toString() === product._id.toString() && link.channel.toString() === channel;
                });
                var linkId = channelLink && channelLink.linkId;
                var wooVariationId = linkId && linkId.split('|')[1];
                var productImages = product.productImages;
                var httpRegExp = /http/gi;
                var imagesArray = [];
                var variantImage;
                var priceList;
                var endWeight;
                var imageSrc;
                var endPrice;
                var images;
                var model;
                var price;

                wooId = linkId && linkId.split('|')[0];
                priceList = channelLink.priceList;

                price = productPrices.find(function (el) {
                    return priceList && el.priceLists && el.priceLists.toString() === priceList.toString() && el.product.toString() === product._id.toString();
                });

                model = {
                    sku : product.info.SKU,
                    name: product.name
                };

                endPrice = price && price.prices.length && price.prices[0].price || 0;
                endWeight = product.inventory.weight;

                if (endPrice) {
                    model.price = endPrice.toString();
                }

                if (endWeight) {
                    model.weight = endWeight.toString();
                }

                if (wooVariationId === '0') {
                    productsUrl += wooId;

                    if (product.productImages && product.productImages.length) {
                        images = product.productImages;

                        images.forEach(function (image, index) {
                            if (httpRegExp.test(image.imageSrc)) {
                                imagesArray.push({
                                    src     : image.imageSrc,
                                    position: index
                                });
                            } else {
                                imagesArray.push({
                                    src     : CONSTANTS.INTEGRATION.WOO_IMAGES_REMOTE_URI + '/' + image.imageSrc,
                                    position: index
                                });
                            }
                        });

                        model.images = imagesArray;
                    }

                    return woo.put(productsUrl, model, function (err, data, result) {
                        if (err) {
                            // TODO: write critical error
                            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                entityId         : product.id,
                                entityDescription: model.name,
                                message          : err.message
                            });

                            return eCb(err);
                        }

                        // TODO: write success logs
                        logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                            entityId         : product.id,
                            entityDescription: model.name,
                            type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE,
                            message          : 'Export ' + product.id + ' is success'
                        });

                        eCb();
                    });
                }

                if (product.productImages && product.productImages.length) {
                    variantImage = _.findWhere(product.productImages, {_id: product.imageSrc});
                    imageSrc = httpRegExp.test(variantImage.imageSrc) ? variantImage.imageSrc : CONSTANTS.INTEGRATION.WOO_IMAGES_REMOTE_URI + variantImage.imageSrc;

                    model.image = [{
                        src     : imageSrc,
                        position: 0
                    }];
                }

                updateWooVariantsV1({
                    wooProductId  : wooId,
                    wooVariationId: wooVariationId,
                    model         : model
                }, eCb);

            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback();
            });
        });
    }

    function exportInventory(opts, allCallback) {
        var consumerSecret;
        var consumerKey;
        var urlSettings;
        var productsUrl;
        var versionApi = 'v1';
        var channel;
        var baseUrl;
        var logsOptions;
        var err;
        var db;

        // TODO: set logs options
        logsOptions = {
            action  : 'exports',
            category: 'inventory'
        };

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        db = opts.dbName;
        baseUrl = opts.baseUrl;
        channel = opts._id || opts.channel;
        consumerKey = opts.username;
        consumerSecret = opts.password;
        urlSettings = opts.settings;

        if (!db || !baseUrl || !consumerKey || !consumerSecret || !urlSettings || !opts.version) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            // TODO: write critical error
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                message: err.message
            });

            return allCallback(err);
        }

        productsUrl = (urlSettings[versionApi] && urlSettings[versionApi].products && urlSettings[versionApi].products.put) || 'products';

        if (!woo) {
            woo = new WooCommerceApi({
                url            : baseUrl,
                consumerKey    : consumerKey,
                consumerSecret : consumerSecret,
                wpAPI          : true,
                version        : 'wc/v1',
                queryStringAuth: true
            });
        }

        channelLinksService.find({channel: channel}, {
            dbName: db
        }, function (err, channelLinks) {
            if (!channelLinks || !channelLinks.length) {
                return allCallback();
            }

            async.eachLimit(channelLinks, 10, function (channelLink, eachCb) {
                AvailabilityService.find({
                    query : {product: channelLink.product},
                    dbName: db
                }, function (err, availabilityProduct) {
                    var splittedLinkId = channelLink.linkId.split('|');
                    var productId = splittedLinkId[0];
                    var variationId = splittedLinkId[1];
                    var updateUrl = 'products/';
                    var model;

                    if (err) {
                        return eachCb(err);
                    }

                    if (!availabilityProduct || !availabilityProduct.length) {
                        return eachCb();
                    }

                    availabilityProduct = availabilityProduct[0];

                    model = {
                        price: availabilityProduct.cost
                    };

                    if (availabilityProduct.onHand !== undefined && availabilityProduct.onHand !== null) {
                        model.manage_stock = true;
                        model.stock_quantity = availabilityProduct.onHand;
                        model.in_stock = true;
                    }

                    if (variationId === '0') {
                        productsUrl += productId;

                        return woo.put(productsUrl, model, function (err, data, res) {
                            if (err) {

                                // TODO: write critical error logs
                                logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                    entityId: productId,
                                    message : err.message
                                });

                                return eachCb(err);
                            }

                            // TODO: write success logs
                            logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                entityId: productId,
                                type    : CONSTANTS.SYNC_LOGS.TYPE.UPDATE,
                                message : 'Import ' + productId + ' category is success'
                            });

                            eachCb();
                        });
                    }

                    updateWooVariantsV1({
                        wooProductId  : productId,
                        wooVariationId: variationId,
                        model         : model
                    }, eachCb);
                });
            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback();
            });
        });
    }

    function publishImagesForProduct(imagesArray, callback) {
        var resultArray = [];

        imagesArray.forEach(function (image, index) {
            resultArray.push({
                position: index,
                src     : (CONSTANTS.INTEGRATION.WOO_IMAGES_REMOTE_URI + image.imageSrc).replace(/\\/g, '/')
            });
        });

        callback(null, resultArray);
    }

    function createVariantInWooV1(productId, wooVariant, cb) {
        var productsUrl = 'products/';

        woo.get(productsUrl + productId, function (err, data, result) {
            var resultVariations;
            var variantId;
            var wooId;

            if (err) {
                return cb(err);
            }

            result = JSON.parse(result);

            if (!result || !result.id) {
                wooId = productId + '|' + 0;

                return cb(null, wooId);
            }

            woo.put(productsUrl + productId, {variations: [wooVariant]}, function (err, data, result) {
                if (err) {
                    return cb(err);
                }

                result = JSON.parse(result);

                resultVariations = result && result.variations && _.pluck(result.variations, 'id').sort();
                variantId = resultVariations && resultVariations.length && resultVariations[resultVariations.length - 1];
                wooId = productId + '|' + variantId;

                cb(null, wooId);
            });
        });
    }

    function createProductInWooV1(fullCreateRoute, nativeOptions, nativeValues, isVariant, wooProduct, cb) {
        if (isVariant) {
            wooProduct.type = 'variable';
        }

        woo.post(fullCreateRoute, wooProduct, function (err, data, result) {
            var newAttributesArray = [];
            var variantImage;
            var productId;
            var i;

            if (err) {
                return cb(err);
            }

            result = JSON.parse(result);
            productId = result && result.id;

            if (!isVariant) {
                return cb(null, productId + '|' + 0);
            }

            for (i = 0; i < nativeOptions.length; i++) {
                newAttributesArray.push({
                    name  : nativeOptions[i],
                    option: nativeValues[i]
                });
            }

            variantImage = _.findWhere(wooProduct.productImages, {_id: wooProduct.imageSrc});

            delete wooProduct.productImages;
            delete wooProduct.imageSrc;

            createVariantInWooV1(productId, {
                attributes: newAttributesArray,
                image     : [{
                    position: 0,
                    src     : CONSTANTS.INTEGRATION.WOO_IMAGES_REMOTE_URI + ((variantImage && variantImage.imageSrc) || '').replace(/\\/g, '/')
                }]
            }, cb);
        });
    }

    function publishProduct(opts, callback) {
        var nativeProduct = opts.product;
        var urlSettings = opts.settings;
        var productPrices = nativeProduct.productPrices;
        var price = (productPrices && productPrices.prices && productPrices.prices.length && productPrices.prices[0].price) || 0;
        var baseUrl = opts.baseUrl;
        var productsUrl;
        var dbName = opts.dbName;
        var channel = opts._id || opts.channel;
        var fullCreateRoute;
        var putRoute;
        var optionsArray = nativeProduct.options.map(function (el) {
            return {
                name: el
            };
        });
        var weight = (nativeProduct.inventory && nativeProduct.inventory.weight) || 0;
        var consumerKey = opts.username;
        var consumerSecret = opts.password;
        var wooAttributesArray = [];
        var versionApi = 'v1';
        var error;
        var productType;

        var wooProduct = {
            name         : nativeProduct.name,
            variations   : [],
            images       : [],
            description  : nativeProduct.info.description,
            regular_price: price.toString(),
            sku          : nativeProduct.info.SKU,
            weight       : weight.toString()
        };

        if (!opts.version || !urlSettings) {
            error = new Error('Invalid parameters');
            error.status = 400;

            return callback(error);
        }

        versionApi = getVersionApi(opts.version);
        fullCreateRoute = putRoute = urlSettings.products && urlSettings.products.create;
        productsUrl = urlSettings.products && urlSettings.products.get;

        if (!woo) {
            woo = new WooCommerceApi({
                url           : baseUrl,
                consumerKey   : consumerKey,
                consumerSecret: consumerSecret,
                wpAPI         : true,
                version       : 'wc/v1'
            });
        }

        async.waterfall([
            function (wCb) {
                if (!nativeProduct.productImages || !nativeProduct.productImages.length) {
                    return wCb();
                }

                publishImagesForProduct(nativeProduct.productImages, function (err, imagesArray) {
                    if (err) {
                        return wCb(err);
                    }

                    wooProduct.images = imagesArray;

                    wCb();
                });
            },

            function (wCb) {
                woo.get(productsUrl + 'attributes', function (err, data, res) {
                    var namesAttributes = [];
                    var comparedOptions;

                    res = JSON.parse(res);

                    if (res && res.length) {
                        namesAttributes = _.pluck(res, 'name');
                    }

                    async.forEachOfLimit(_.pluck(optionsArray, 'name'), 10, function (option, i, eCb) {
                        var nameValue = nativeProduct.values[i];

                        if (namesAttributes.indexOf(option) >= 0) {
                            comparedOptions = _.find(res, function (oneResult) {
                                return oneResult.name === option;
                            });

                            wooAttributesArray.push({
                                id       : comparedOptions.id,
                                name     : comparedOptions.name,
                                options  : [nameValue],
                                position : 0,
                                visible  : true,
                                variation: true
                            });

                            return eCb();
                        }

                        woo.post(productsUrl + 'attributes', {
                            name: option,
                            type: 'select'
                        }, function (err, data, res) {
                            if (err) {
                                return eCb(err);
                            }

                            if (res) {
                                wooAttributesArray.push({
                                    id       : res.id,
                                    name     : res.name,
                                    options  : [nameValue],
                                    position : 0,
                                    visible  : true,
                                    variation: true
                                });
                            }

                            eCb();
                        });
                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb();
                    });
                });
            },

            function (wCb) {
                productService.find({
                    groupId: nativeProduct.groupId
                }, {
                    dbName: dbName,
                    _id   : 1
                }, function (err, products) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, products);
                });
            },

            function (products, wCb) {
                var ids = _.pluck(products, '_id');

                channelLinksService.find({
                    product: {$in: ids},
                    channel: channel
                }, {
                    dbName: dbName,
                    linkId: 1
                }, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, result);
                });
            }
        ], function (err, result) {
            var prodId;
            var productCategoriesArray;
            var wooCategoriesIds;
            var categoriesForWoo;

            if (err) {
                return callback(err);
            }

            if (result && result.length) {
                prodId = result[0].linkId && result[0].linkId.split('|')[0];

                return async.waterfall([
                    function (wCb) {
                        if (opts.counter !== 0 || result.length > 1) {
                            return wCb();
                        }
                        channelLinksService.findOne({
                            linkId: {
                                $regex: new RegExp(prodId)
                            }
                        }, {
                            dbName: dbName
                        }, function (err, resultChannelLinks) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb(null, resultChannelLinks);
                        });
                    }, function (channelLinks, wCb) {
                        if (!wCb && typeof channelLinks === 'function') {
                            wCb = channelLinks;

                            return wCb();
                        }

                        productService.getProductsWithVariants({
                            query: {
                                _id: channelLinks.product
                            },

                            dbName: dbName
                        }, function (err, resultProduct) {
                            var firstVariant;

                            if (err) {
                                return wCb(err);
                            }

                            if (!resultProduct || !resultProduct.length) {
                                return wCb();
                            }

                            firstVariant = resultProduct[0];
                            wCb(null, firstVariant);
                        });
                    },

                    function (firstVariant, wCb) {
                        if (!wCb && typeof firstVariant === 'function') {
                            wCb = firstVariant;
                            return wCb();
                        }

                        woo.put(putRoute + prodId, {}, function (err) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb();
                        });
                    },

                    function (wCb) {
                        var newAttributesArray = [];
                        var variantImage;
                        var i;

                        for (i = 0; i < wooAttributesArray.length; i++) {
                            newAttributesArray.push({
                                name  : wooAttributesArray[i].name,
                                option: wooAttributesArray[i].options[0]
                            });
                        }

                        variantImage = _.findWhere(nativeProduct.productImages, {_id: nativeProduct.imageSrc});

                        if (!prodId || (prodId === 'undefined')) {
                            return wCb();
                        }

                        createVariantInWooV1(prodId, {
                            attributes: newAttributesArray,
                            image     : [{
                                position: 0,
                                src     : (CONSTANTS.INTEGRATION.WOO_IMAGES_REMOTE_URI + ((variantImage && variantImage.imageSrc) || '')).replace(/\\/g, '/')
                            }]
                        }, wCb);
                    }
                ], function (err, wooId) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, wooId);
                });
            }

            categoriesForWoo = [];
            productType = nativeProduct.info.productType;
            optionsArray = [];

            async.waterfall([
                function (wCb) {
                    woo.get('products/categories', function (err, data, res) {
                        res = JSON.parse(res);

                        wooCategoriesIds = _.pluck(res, 'id');
                        productCategoriesArray = nativeProduct.info.categories;

                        productCategoryService.find({_id: {$in: productCategoriesArray}}, {dbName: dbName}, function (err, categories) {
                            var i;

                            if (err) {
                                return wCb(err);
                            }

                            function createCategory(category, createSelf, cb) {
                                woo.post('products/categories', {
                                    name: category.name
                                }, function (err, date, res) {
                                    res = JSON.parse(res);

                                    if (!res.id) {
                                        return cb();
                                    }

                                    categoriesForWoo.push({id: res.id});

                                    if (!createSelf) {
                                        return cb();
                                    }

                                    productCategoryService.findAndUpdate({
                                        _id: category._id
                                    }, {
                                        integrationId: res.id
                                    }, {
                                        dbName: dbName
                                    }, function (err, res) {
                                        if (err) {
                                            return cb(err);
                                        }

                                        cb();
                                    });
                                });
                            }

                            async.each(categories, function (category, eCb) {
                                if (!category.integrationId) {
                                    return createCategory(category, true, eCb);
                                } else if ((wooCategoriesIds.indexOf(parseInt(category.integrationId, 10)) >= 0) && (category.channel && (category.channel.toString() === channel.toString()))) {
                                    categoriesForWoo.push({id: category.integrationId});
                                    return eCb();
                                }

                                createCategory(category, false, eCb);

                            }, function (err) {
                                if (err) {
                                    return wCb(err);
                                }

                                wooProduct.categories = categoriesForWoo;

                                wCb();
                            });
                        });
                    });
                },

                function (wCb) {
                    productTypeService.findOne({_id: productType}, {dbName: dbName}, function (err, productType) {
                        if (err) {
                            return wCb(err);
                        }

                        if (!productType) {
                            wCb();
                        }

                        async.each(productType.options, function (optionId, eCb) {
                            ProductOptionService.findOne({_id: optionId}, {dbName: dbName}, function (err, productOption) {
                                if (err) {
                                    return eCb(err);
                                }

                                ProductOptionValueService.find({optionId: productOption._id}, {dbName: dbName}, function (err, optionValues) {
                                    var optValuesArray = [];
                                    var objectForCreateOption;
                                    var i;

                                    if (err) {
                                        return eCb(err);
                                    }

                                    for (i = 0; i < optionValues.length; i++) {
                                        optValuesArray.push(optionValues[i].value);
                                    }

                                    objectForCreateOption = {
                                        name   : productOption.name,
                                        type   : 'select',
                                        options: optValuesArray
                                    };

                                    if (nativeProduct.options.indexOf(productOption.name) >= 0) {
                                        optionsArray.push({
                                            name     : productOption.name,
                                            options  : optValuesArray,
                                            position : 0,
                                            visible  : true,
                                            variation: true
                                        });
                                    }

                                    woo.post('products/attributes', objectForCreateOption, function (err, data, res) {
                                        if (err) {
                                            return eCb(err);
                                        }

                                        eCb();
                                    });
                                });
                            });
                        }, function (err) {
                            if (err) {
                                return wCb(err);
                            }

                            wooProduct.attributes = optionsArray;

                            wCb();
                        });
                    });
                }
            ], function (err) {
                if (err) {
                    return callback(err);
                }

                wooProduct.productImages = nativeProduct.productImages;
                wooProduct.imageSrc = nativeProduct.imageSrc;

                createProductInWooV1(fullCreateRoute, nativeProduct.options, nativeProduct.values, nativeProduct.isVariant, wooProduct, callback);
            });
        });
    }

    function getCustomers(opts, allCallback) {
        var channel = opts._id || opts.channel;
        var consumerSecret;
        var customersUrl;
        var urlSettings;
        var consumerKey;
        var versionApi = 'v1';
        var customers;
        var baseUrl;
        var error;
        var route;
        var logsOptions;
        var user;
        var db;

        // TODO: set logs options
        logsOptions = {
            action  : 'imports',
            category: 'customers'
        };

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        db = opts.dbName;
        baseUrl = opts.baseUrl;
        urlSettings = opts.settings;
        consumerKey = opts.username;
        consumerSecret = opts.password;
        user = opts.userId || opts.user;

        if (!baseUrl || !urlSettings || !consumerSecret || !consumerKey || !opts.version) {
            error = new Error('Bad Request');
            error.status = 400;

            // TODO: write critical error
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                message: error.message
            });

            return allCallback(error);
        }

        customersUrl = (urlSettings[versionApi] && urlSettings[versionApi].customers && urlSettings[versionApi].get) || 'customers/';

        if (!woo) {
            woo = new WooCommerceApi({
                url            : baseUrl,
                consumerKey    : consumerKey,
                consumerSecret : consumerSecret,
                wpAPI          : true,
                version        : 'wc/v1',
                queryStringAuth: true
            });
        }

        async.waterfall([
            function (wCb) {
                if (opts.customer) {
                    return wCb();
                }

                woo.get(customersUrl, function (err, data, res) {
                    if (err) {

                        logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                            message: err.message
                        });

                        return wCb(err);
                    }

                    customers = JSON.parse(res);

                    wCb(null, customers);
                });
            },

            function (customers, wCb) {
                if (customers && typeof wCb === 'function') {
                    return wCb(null, customers);
                }

                wCb = customers;

                woo.get(customersUrl + opts.customer.id, function (err, data, res) {
                    if (err) {

                        logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                            entityId: opts.customer.id,
                            message : err.message
                        });

                        return wCb(err);
                    }

                    customers = JSON.parse(res);

                    wCb(null, [customers]);
                });
            }], function (err, customers) {
            var newCustomer = {};

            if (err) {
                return allCallback(err);
            }

            if (!customers || !customers.length) {
                return allCallback();
            }

            customerService.find({channel: channel}, {
                integrationId: 1,
                channel      : 1,
                dbName       : db
            }, function (err, internalCustomers) {
                if (err) {
                    return allCallback(err);
                }

                async.eachLimit(customers, 10, function (customer, eachCb) {
                    var findResult;

                    var billingAddr = customer.billing || {};
                    var address = {
                        city   : billingAddr.city,
                        country: billingAddr.country || '',
                        state  : billingAddr.state,
                        zip    : billingAddr.postcode || '',
                        street : billingAddr.address_1 + billingAddr.address_2
                    };
                    var shippingAddr = customer.shipping || {};
                    var shippingAddress = {
                        city   : shippingAddr.city,
                        country: shippingAddr.country || '',
                        state  : shippingAddr.state,
                        zip    : shippingAddr.postcode || '',
                        street : shippingAddr.address_1 + ' ' + shippingAddr.address_2,
                        name   : shippingAddr.first_name + ' ' + shippingAddr.last_name
                    };

                    newCustomer = {
                        dbName         : db,
                        integrationId  : '' + customer.id,
                        address        : address,
                        shippingAddress: shippingAddress,
                        email          : customer.email || '',
                        name           : {
                            first: customer.first_name || '',
                            last : customer.last_name || ''
                        },

                        type   : 'Person',
                        channel: channel,

                        editedBy: {
                            user: user,
                            date: new Date()
                        },

                        createBy: {
                            user: user,
                            date: new Date()
                        }
                    };

                    findResult = _.find(internalCustomers, {
                        integrationId: customer.id.toString()
                    });

                    if (findResult) {
                        delete newCustomer.dbName;

                        customerService.findAndUpdate({
                            integrationId: customer.id,
                            channel      : channel
                        }, newCustomer, {dbName: db}, function (err) {
                            if (err) {

                                // TODO: write error logs
                                logs = syncLogsHelper.addError(logs, logsOptions, {
                                    entityId         : customer.id,
                                    entityDescription: customer.first_name + ' ' + customer.last_name,
                                    message          : 'Error on import' + customer.id + ' customer'
                                });

                                return eachCb(err);
                            }

                            // TODO: write success logs
                            logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                entityId         : customer.id,
                                entityDescription: customer.first_name + ' ' + customer.last_name,
                                type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE,
                                message          : 'Import ' + customer.id + ' customer is success'
                            });

                            eachCb();
                        });
                    } else {
                        customerService.create(newCustomer, function (err) {
                            if (err) {

                                // TODO: write error logs
                                logs = syncLogsHelper.addError(logs, logsOptions, {
                                    entityId         : customer.id,
                                    entityDescription: customer.first_name + ' ' + customer.last_name,
                                    message          : 'Error on import' + customer.id + ' customer'
                                });

                                return eachCb(err);
                            }

                            // TODO: write success logs
                            logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                entityId         : customer.id,
                                entityDescription: customer.first_name + ' ' + customer.last_name,
                                type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE,
                                message          : 'Import ' + customer.id + ' customer is success'
                            });

                            eachCb();
                        });
                    }

                }, function (err) {
                    if (err) {
                        return allCallback(err);
                    }

                    allCallback();
                });
            });
        });
    }

    function getSalesOrders(opts, allCallback) {
        var channel = opts._id || opts.channel;
        var workflowObj = {};
        var consumerSecret;
        var dateOrderFrom;
        var nativeOrders;
        var urlSettings;
        var versionApi = 'v1';
        var ordersUrl;
        var consumerKey;
        var wooOrders;
        var workflows;
        var orderIds;
        var unlinked;
        var baseUrl;
        var error;
        var uId;
        var logsOptions;
        var db;

        // TODO: set logs options
        logsOptions = {
            action  : 'imports',
            category: 'orders'
        };

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        uId = opts.user || opts.userId;
        db = opts.dbName;
        baseUrl = opts.baseUrl;
        consumerKey = opts.username;
        consumerSecret = opts.password;
        urlSettings = opts.settings;
        dateOrderFrom = opts.ordersDate || new Date(0);

        if (!baseUrl || !urlSettings || !consumerSecret || !consumerKey || !opts.version) {
            error = new Error('Bad Request');
            error.status = 400;

            // TODO: write critical error
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                message: error.message
            });

            return allCallback(error);
        }

        ordersUrl = (urlSettings[versionApi] && urlSettings[versionApi].orders && urlSettings[versionApi].orders.get) || 'orders/';

        if (!woo) {
            woo = new WooCommerceApi({
                url            : baseUrl,
                consumerKey    : consumerKey,
                consumerSecret : consumerSecret,
                wpAPI          : true,
                version        : 'wc/v1',
                queryStringAuth: true
            });
        }

        function createOrUpdateOrder(orderBody, wooOrder, warehouse, eCb) {
            var wooIds = _.pluck(wooOrder.line_items, 'variation_id');
            var linkIds = wooOrder.line_items.map(function (el) {
                return el.product_id + '|' + el.variation_id;
            });
            var workflow = statusBuilder(wooOrder.status || '', workflowObj);
            var needPayments = false;
            var needShipping = false;
            var hasUnlinkedProducts;
            var unlinkedOrderId;
            var shippingMethods;
            var paymentMethod;
            var products;
            var newOrder;

            function orderRowsBuilder(_order, products, callback) {

                warehouseService.findOne({_id: ObjectId(warehouse)}, {dbName: db}, function (err, resultWarehouse) {
                    var arrayRows;

                    if (err) {
                        return callback(err);
                    }

                    if (!resultWarehouse) {
                        err = new Error('Warehouse not found');
                        err.status = 400;

                        return callback(err);
                    }

                    arrayRows = products.map(function (elem) {
                        var wooVariantId = elem.channelLinks.linkId.split('|')[1];
                        var object = wooOrder.line_items.find(function (el) {
                            return el.variation_id.toString() === wooVariantId;
                        });
                        var orderRow = {
                            product      : elem._id,
                            warehouse    : warehouse,
                            order        : _order._id,
                            subTotal     : object.quantity * object.price * 100,
                            quantity     : object.quantity,
                            unitPrice    : object.price * 100,
                            taxes        : object.tax_lines,
                            channel      : ObjectId(channel),
                            integrationId: object.id.toString(),
                            creditAccount: resultWarehouse.account
                        };

                        if (elem.orderRowId) {
                            orderRow._id = elem.orderRowId;
                        }

                        return orderRow;
                    });

                    if (!arrayRows.length) {
                        return callback();
                    }

                    async.each(arrayRows, function (productRow, eCb) {
                        var taxes = productRow.taxes;

                        createTaxes(taxes, function (err, resultTaxes) {
                            if (err) {
                                return eCb(err);
                            }

                            productRow.taxes = resultTaxes;

                            eCb();
                        });
                    }, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        OrderRowsService.createMulti({dbName: db, arrayRows: arrayRows}, function (err) {
                            if (err) {
                                return callback(err);
                            }

                            callback();
                        });
                    });
                });
            }

            async.series([
                function (sCb) {
                    productService
                        .getProductsForOrder({
                            dbName : db,
                            channel: channel,
                            linkIds: linkIds
                        }, function (err, ourProducts) {
                            products = ourProducts;

                            if (err) {
                                return sCb(err);
                            }

                            if (wooOrder.line_items.length !== ourProducts.length) {
                                orderBody.workflow = ObjectId(CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID);
                                orderBody.tempWorkflow = workflow;
                                hasUnlinkedProducts = true;

                                if (orderBody.conflictTypes && orderBody.conflictTypes.length) {
                                    orderBody.conflictTypes.push({
                                        type: 'product'
                                    });
                                } else {
                                    orderBody.conflictTypes = [{
                                        type: 'product'
                                    }];
                                }
                            }

                            sCb();
                        });
                },

                function (sCb) {
                    var paymentMathod = wooOrder.payment_method_title;
                    var financialStatus = wooOrder.status;
                    var newPaymentMethod;

                    if (financialStatus === 'pending') {
                        return sCb();
                    }

                    paymentMethodService.findOne({name: paymentMathod}, {dbName: db}, function (err, result) {
                        if (err) {
                            return sCb(err);
                        }

                        if (orderBody) {
                            orderBody.paymentMethod = result && result._id;

                            paymentMethod = result;
                            needPayments = true;

                            return sCb();
                        }

                        organizationService.getBankAccount({dbName: db}, function (err, bankAccount) {
                            if (err) {
                                return sCb(err);
                            }

                            if (!bankAccount || !bankAccount.chartAccount || !bankAccount.currency) {
                                err = new Error('Bank Account doesn`t exist');
                                err.status = 400;

                                return sCb(err);
                            }

                            newPaymentMethod = {
                                name        : paymentMathod,
                                account     : paymentMathod,
                                chartAccount: bankAccount.chartAccount,
                                currency    : bankAccount.currency
                            };

                            paymentMethodService.create({
                                dbName: db,
                                body  : newPaymentMethod
                            }, function (err, createdPM) {
                                if (err) {
                                    return sCb(err);
                                }

                                if (!createdPM) {
                                    err = new Error('Default payment method doesn`t created');
                                    err.status = 400;

                                    return sCb(err);
                                }

                                orderBody.paymentMethod = createdPM._id;
                                paymentMethod = createdPM;

                                sCb();
                            });
                        });
                    });
                },

                function (sCb) {
                    if (orderIds.indexOf(wooOrder.id.toString()) > -1) {

                        OrderService.findOneAndUpdate({
                            integrationId: wooOrder.id.toString(),
                            channel      : channel
                        }, {$set: orderBody}, {
                            dbName: db,
                            new   : true
                        }, function (err, newObject) {
                            if (err) {

                                // TODO: write error logs
                                logs = syncLogsHelper.addError(logs, logsOptions, {
                                    entityId: wooOrder.id,
                                    message : err.message
                                });

                                return sCb(err);
                            }

                            if (orderBody.conflictTypes && orderBody.conflictTypes.length) {
                                logs = syncLogsHelper.addUnlink(logs, logsOptions, {
                                    entityId         : wooOrder.id,
                                    entityDescription: wooOrder.order_key,
                                    type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE,
                                    message          : 'Import ' + wooOrder.id + ' order is success'
                                });
                            } else {
                                logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                    entityId         : wooOrder.id,
                                    entityDescription: wooOrder.order_key,
                                    type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE,
                                    message          : 'Import ' + wooOrder.id + ' order is success'
                                });
                            }

                            unlinkedOrderId = newObject._id;
                            newOrder = newObject;

                            OrderRowsService.find({$and: [{order: newObject._id}, {product: {$ne: null}}]}, {dbName: db}, function (err, resultRows) {
                                var error;

                                if (err) {
                                    return sCb(err);
                                }

                                OrderRowsService.remove({
                                    order : newObject._id,
                                    dbName: db
                                }, function (err) {
                                    if (err) {
                                        return sCb(err);
                                    }
                                });

                                if (!resultRows.length) {
                                    return sCb();
                                }

                                products = products.map(function (product) {
                                    var currentRow = _.findWhere(resultRows, {product: product._id});

                                    if (currentRow) {
                                        product.orderRowId = currentRow._id;
                                        return product;
                                    }
                                });

                                orderRowsBuilder(newObject, _.compact(products), sCb);
                            });
                        });
                    } else {
                        orderBody.dbName = db;
                        orderBody.createdBy.user = uId;

                        if (!orderBody.workflow) {
                            orderBody.workflow = workflow;
                            orderBody.tempWorkflow = workflow;
                        }

                        OrderService.create(orderBody, function (err, _order) {
                            if (err) {

                                // TODO: write error logs
                                logs = syncLogsHelper.addError(logs, logsOptions, {
                                    message: err.message
                                });

                                return sCb(err);
                            }

                            if (orderBody.conflictTypes && orderBody.conflictTypes.length) {
                                logs = syncLogsHelper.addUnlink(logs, logsOptions, {
                                    entityId         : wooOrder.id,
                                    entityDescription: wooOrder.order_key,
                                    type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE,
                                    message          : 'Import ' + wooOrder.id + ' order is success'
                                });
                            } else {
                                logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                    entityId         : wooOrder.id,
                                    entityDescription: wooOrder.order_key,
                                    type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE,
                                    message          : 'Import ' + wooOrder.id + ' order is success'
                                });

                            }

                            unlinkedOrderId = _order._id;

                            newOrder = _order;

                            orderRowsBuilder(_order, products, sCb);
                        });
                    }
                },

                function (sCb) {
                    var differenceProductIds;
                    var nativeIds;
                    var unlinkedIds = _.pluck(unlinked, 'fields.id');
                    var logsOptions = {
                        action  : 'imports',
                        category: 'products'
                    };

                    if (!hasUnlinkedProducts) {
                        return sCb();
                    }

                    nativeIds = _.pluck(products, 'channelLinks.linkId');
                    nativeIds = nativeIds.map(function (el) {
                        return el && parseInt(el.split('|')[1], 10);
                    });

                    differenceProductIds = _.difference(wooIds, nativeIds);

                    async.each(differenceProductIds, function (product, intCb) {
                        var unlinkedOrderRow;
                        var fields = wooOrder.line_items.find(function (theirProduct) {
                            return theirProduct.variation_id === product;
                        });
                        var data = {
                            price   : fields.price * 100,
                            sku     : fields.sku,
                            name    : fields.name,
                            mainId  : fields.product_id,
                            id      : fields.variation_id,
                            channel : ObjectId(channel),
                            hasOrder: true
                        };
                        var orderRowData = {
                            quantity: fields.quantity,
                            order   : unlinkedOrderId
                        };

                        if (unlinkedIds.indexOf(fields.variation_id) > -1) {
                            return intCb();
                        }

                        if (data.name && data.sku) {
                            data.isValid = true;
                            data.nativeIsValid = true;
                        } else {
                            data.isValid = false;
                            data.nativeIsValid = false;
                            data.nativeName = data.name;
                            data.nativeSKU = data.sku;
                        }

                        unlinkedOrderRow = {
                            entity: 'OrderRow',
                            type  : 'unlinked',
                            fields: orderRowData,
                            dbName: db
                        };

                        async.waterfall([
                            function (wCb) {
                                ConflictService.findOne({
                                    entity     : 'Product',
                                    type       : 'unlinked',
                                    'fields.id': fields.variant_id
                                }, {dbName: db}, function (err, result) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb(null, result);
                                });
                            },

                            function (result, wCb) {
                                if (!wCb && typeof result) {
                                    wCb = result;
                                    result = null;
                                }

                                if (!result) {
                                    return ConflictService.create({
                                        fields: data,
                                        entity: 'Product',
                                        type  : 'unlinked',
                                        dbName: db
                                    }, function (err, createdProdConflict) {
                                        if (err) {
                                            return wCb(err);
                                        }

                                        wCb(null, createdProdConflict, true);
                                    });
                                }

                                ConflictService.findOneAndUpdate({
                                    entity     : 'Product',
                                    type       : 'unlinked',
                                    'fields.id': fields.variant_id
                                }, {
                                    $set: {
                                        fields: data
                                    }
                                }, {
                                    dbName: db,
                                    new   : true
                                }, function (err, updateProdConflict) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb(null, updateProdConflict, false);
                                });
                            },

                            function (prodConflictModel, isCreated, wCb) {
                                orderRowData.product = prodConflictModel._id;

                                ConflictService.create(unlinkedOrderRow, function (err) {
                                    if (err) {
                                        logs = syncLogsHelper.addError(logs, logsOptions, {
                                            message          : err.message,
                                            entityId         : fields.variant_id,
                                            entityDescription: fields.name
                                        });

                                        return wCb(err);
                                    }

                                    if (isCreated) {
                                        logs = syncLogsHelper.addUnlink(logs, logsOptions, {
                                            entityId         : fields.variant_id,
                                            entityDescription: fields.name
                                        });
                                    }

                                    wCb();
                                });
                            }
                        ], function (err) {
                            if (err) {
                                return intCb(err);
                            }

                            intCb();
                        });
                    }, function (err) {
                        if (err) {
                            return sCb(err);
                        }

                        sCb();
                    });

                }
            ], function (err) {
                var resultOpts = {
                    order        : newOrder,
                    paymentMethod: paymentMethod
                };

                if (err) {
                    return eCb(err);
                }

                eCb(null, resultOpts);
            });
        }

        function createTaxes(lineTaxes, callback) {
            var outTaxes = [];

            async.each(lineTaxes, function (tax, eCb) {
                var outTaxObj;

                async.waterfall([
                    function (wCb) {
                        woo.get('taxes', function (err, data, res) {
                            if (err) {
                                return wCb(err);
                            }

                            if (!res) {
                                return callback();
                            }

                            return wCb(null, JSON.parse(res));
                        });
                    },

                    function (taxes, wCb) {
                        var currentTax = _.findWhere(taxes, {id: tax.rate_id});
                        var query = {
                            name: currentTax.name,
                            rate: currentTax.rate
                        };

                        taxesService.findOne(query, {dbName: db}, function (err, resultTax) {
                            var taxFullName;
                            var newTaxObj;
                            var taxCode;

                            if (err) {
                                return eCb(err);
                            }

                            if (resultTax) {
                                outTaxObj = {
                                    taxCode: resultTax._id,
                                    tax    : parseFloat(tax.price) * 100
                                };

                                outTaxes.push(outTaxObj);

                                return wCb();
                            }

                            taxCode = tax.name[0].toUpperCase();
                            taxFullName = taxCode + ' ' + tax.name + ' ' + tax.rate * 100 + '%';
                            newTaxObj = {
                                name    : tax.name,
                                rate    : tax.rate,
                                code    : taxCode,
                                fullName: taxFullName,
                                dbName  : db
                            };

                            wCb(null, newTaxObj);
                        });
                    },

                    function (newTaxObj, wCb) {
                        if (!wCb && typeof newTaxObj === 'function') {
                            return wCb();
                        }

                        taxesService.create(newTaxObj, function (err, result) {
                            if (err) {
                                return wCb(err);
                            }

                            outTaxObj = {
                                taxCode: result._id,
                                tax    : parseFloat(tax.price) * 100
                            };

                            outTaxes.push(outTaxObj);

                            wCb();
                        });
                    }
                ], function (err) {
                    if (err) {
                        return eCb();
                    }

                    eCb();
                });
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, outTaxes);
            });
        }

        function createShippingLine(wooOrder, resultOpts, callback) {
            var order = resultOpts.order;
            var shippingRowData;
            var wooShippings;
            var price;

            if (!wooOrder.shipping_lines || !wooOrder.shipping_lines.length) {
                return callback();
            }

            wooShippings = wooOrder.shipping_lines[0];

            price = parseFloat(wooShippings.total) * 100;
            shippingRowData = {
                order      : order._id,
                quantity   : 1,
                description: wooShippings.method_title,
                unitPrice  : price,
                costPrice  : price,
                subTotal   : price,
                dbName     : db
            };

            async.waterfall([
                function (wCb) {
                    organizationService.getDefaultShippingAccount({dbName: db}, function (err, defaultShipAccount) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, defaultShipAccount);
                    });
                },

                function (defaultShipAccount, wCb) {
                    var shippingExpensesObj;
                    var error;

                    if (!wCb && typeof defaultShipAccount === 'function') {
                        wCb = defaultShipAccount;

                        error = new Error('Default shipping account not found');
                        error.status = 404;

                        return wCb(error);
                    }

                    shippingExpensesObj = {
                        amount : price,
                        account: defaultShipAccount
                    };

                    shippingRowData.creditAccount = defaultShipAccount;

                    OrderService.findByIdAndUpdate(order._id, {
                        $set: {
                            shippingExpenses: shippingExpensesObj
                        }
                    }, {dbName: db}, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb();
                    });
                },

                function (wCb) {
                    if (!wooShippings.taxes || !wooShippings.taxes.length) {
                        return wCb();
                    }

                    createTaxes(wooShippings.taxes, function (err, resultTaxes) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, resultTaxes);
                    });
                },

                function (resultTaxes, wCb) {
                    if (!wCb && typeof resultTaxes === 'function') {
                        wCb = resultTaxes;
                        resultTaxes = null;
                    }

                    if (resultTaxes) {
                        shippingRowData.taxes = resultTaxes;
                    }

                    OrderRowsService.create(shippingRowData, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb();
                    });
                }
            ], function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        }

        function invoiceUpdater(invoice, payment, waterfallCallback) {
            var sourceInvoice = invoice;
            var sourceOrder = invoice.order;
            var totalToPay = sourceInvoice && sourceInvoice.paymentInfo ? sourceInvoice.paymentInfo.balance : 0;
            var paid = payment.paidAmount;
            var paymentCurrency = payment.currency._id;
            var invoiceCurrency = sourceInvoice.currency && sourceInvoice.currency._id;
            var isNotFullPaid;
            var wId;
            var paymentDate = new Date(payment.date);
            var invoiceType = sourceInvoice && sourceInvoice._type;
            var payments = [];
            var rate = payment.currency && payment.currency.rate;
            var request = {
                query: {
                    source      : 'purchase',
                    targetSource: 'invoice'
                },

                session: {
                    lastDb: db
                }
            };
            if (!paymentCurrency) {
                paymentCurrency = invoiceCurrency;
            }

            if (paymentDate > sourceInvoice.paymentDate) {
                sourceInvoice.paymentDate = paymentDate;
            }

            sourceInvoice.removable = false;

            sourceInvoice.payments = sourceInvoice.payments || [];

            paid = paid / rate;

            if (paymentDate === 'Invalid Date') {
                paymentDate = new Date();
            }

            if (invoiceType === 'wTrackInvoice' || invoiceType === 'expensesInvoice' || invoiceType === 'dividendInvoice') {
                wId = 'Sales Invoice';
            } else if (invoiceType === 'Proforma') {
                wId = 'Proforma';
                request.query = {};
            } else {
                wId = 'Purchase Invoice';
            }

            request.query.wId = wId;

            totalToPay = parseInt(totalToPay, 10);
            paid = parseInt(paid, 10);

            isNotFullPaid = paid < totalToPay;

            if (isNotFullPaid || sourceOrder) {
                request.query.status = 'In Progress';
                request.query.order = 1;
            } else {
                request.query.status = 'Done';
                request.query.order = 1;
            }

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                if (err) {
                    return waterfallCallback(err);
                }

                sourceInvoice.payments.push(payment._id);

                sourceInvoice.workflow = workflow._id;
                sourceInvoice.paymentInfo.balance = totalToPay - paid;

                sourceInvoice.paymentDate = new Date(paymentDate); // Because we have it in post.schema

                invoiceService.findByIdAndUpdate(invoice._id, sourceInvoice, {
                    new   : true,
                    dbName: db
                }, function (err, resultInvoice) {

                    if (err) {
                        return waterfallCallback(err);
                    }

                    ratesService.getPrevious({
                        id    : moment(paymentDate).format('YYYY-MM-DD'),
                        dbName: db
                    }, function (err, prevRates) {
                        if (err) {
                            return waterfallCallback(err);
                        }

                        resultInvoice = resultInvoice.toJSON();

                        resultInvoice.rates = prevRates && prevRates.rates ? prevRates.rates : {};
                        resultInvoice.base = prevRates && prevRates.base ? prevRates.base : 'USD';

                        waterfallCallback(null, resultInvoice, payment);
                    });
                });
            });
        }

        function createPaymentsForOrder(wooOrder, resultOpts, callback) {
            var orderBody = (resultOpts.order && resultOpts.order.toJSON()) || {};
            var paymentMethod = (resultOpts.paymentMethod && resultOpts.paymentMethod.toJSON()) || {};
            var query;
            var paymentDate;
            var paymentObj;

            if (!orderBody.paymentMethod || !wooOrder.transaction_id || !wooOrder.date_paid) {
                return callback();
            }

            query = {
                channel      : ObjectId(channel),
                integrationId: '' + wooOrder.transaction_id
            };

            invoiceService.findOne({sourceDocument: orderBody._id}, {dbName: db}, function (err, resultInvoice) {
                if (err) {
                    return callback(err);
                }

                paymentDate = new Date(wooOrder.date_paid);

                paymentObj = {
                    paidAmount   : wooOrder.total,
                    currency     : orderBody.currency,
                    date         : wooOrder.date_paid,
                    paymentMethod: paymentMethod,
                    supplier     : orderBody.supplier,
                    channel      : channel,
                    integrationId: '' + wooOrder.transaction_id,
                    bankAccount  : paymentMethod.chartAccount,
                    forSale      : true,
                    createdBy    : {
                        user: uId,
                        date: paymentDate
                    },

                    editedBy: {
                        user: uId,
                        date: paymentDate
                    }
                };

                if (resultInvoice) {
                    paymentObj.invoice = resultInvoice._id;
                } else {
                    paymentObj.order = orderBody._id;
                }

                paymentService.findOne(query, {dbName: db}, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result) {
                        paymentObj.paidAmount = paymentObj.paidAmount * 100;

                        paymentService.findByIdAndUpdate(result._id, paymentObj, {
                            new   : true,
                            dbName: db
                        }, function (err, payment) {
                            if (err) {
                                return callback(err);
                            }

                            journalEntryService.formBodyForPrepaymentEntries({
                                payment: payment,
                                dbName : db
                            }, function (err) {
                                if (err) {
                                    return callback();
                                }

                                callback();
                            });
                        });
                    } else {
                        paymentObj.dbName = db;

                        async.waterfall([
                            function (wCb) {

                                paymentService.create(paymentObj, function (err, resultPayment) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb(null, resultPayment);
                                });
                            },

                            function (resultPayment, wCb) {
                                if (!resultInvoice) {
                                    return wCb(null, resultPayment);
                                }

                                invoiceUpdater(resultInvoice.toJSON(), resultPayment && resultPayment.toJSON(), function (err) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb(null, resultPayment);
                                });
                            },

                            function (resultPayment, wCb) {
                                journalEntryService.formBodyForPrepaymentEntries({
                                    payment: resultPayment,
                                    dbName : db
                                }, function (err) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb();
                                });
                            }
                        ], function (err) {
                            if (err) {
                                return callback(err);
                            }

                            callback();
                        });
                    }
                });
            });
        }

        function getImportData(pCb) {
            var resultOrders = [];
            var helperForWhile = true;
            var pageNumber = 1;

            async.waterfall([
                function (wCb) {
                    if (opts.order) {
                        return wCb();
                    }

                    async.whilst(function () {
                        return helperForWhile;
                    }, function (whCb) {
                        woo.get(ordersUrl + '?per_page=100&page=' + pageNumber + '&after=' + dateOrderFrom, function (err, data, res) {
                            var result;

                            if (err) {
                                helperForWhile = false;
                                return whCb(err);
                            }

                            result = JSON.parse(res);

                            if (result && result.length < 100) {
                                helperForWhile = false;
                            }

                            resultOrders = resultOrders.concat(result);
                            pageNumber++;

                            whCb();
                        });
                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, resultOrders);
                    });

                },

                function (resultOrders, wCb) {
                    if (resultOrders && typeof(wCb) === 'function') {

                        return wCb(null, resultOrders);
                    }

                    wCb = resultOrders;

                    woo.get(ordersUrl + opts.order.id, function (err, data, res) {
                        if (err) {
                            return wCb(err);
                        }

                        resultOrders = JSON.parse(res);

                        wCb(null, [resultOrders]);
                    });
                }], function (err, resultOrders) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, resultOrders);
            });
        }

        function getOrders(pCb) {
            OrderService.find({
                integrationId: {$exists: true},
                channel      : channel
            }, {
                dbName       : db,
                integrationId: 1,
                channel      : 1,
                lean         : true
            }, function (err, orders) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, orders);
            });
        }

        function getUnlinkedProducts(pCb) {
            ConflictService.find({
                entity          : 'Product',
                type            : 'unlinked',
                'fields.channel': ObjectId(channel)
            }, {
                dbName: db,
                fields: 1
            })
                .lean()
                .exec(function (err, unlinked) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, unlinked);
                });
        }

        function getCustomers(pCb) {
            customerService.find({
                integrationId: {$exists: true},
                channel      : ObjectId(channel)
            }, {
                integrationId: 1,
                dbName       : db
            }, function (err, customers) {
                if (err) {
                    return pCb(err);
                }

                if (!customers || !customers.length) {
                    return pCb();
                }

                pCb(null, customers);
            });
        }

        function getCurrencies(pCb) {
            currencyService.find({}, {name: 1, dbName: db}, function (err, currencies) {
                if (err) {
                    return pCb(err);
                }

                if (!currencies || !currencies.length) {
                    return pCb();
                }

                pCb(null, currencies);
            });
        }

        function getWarehouse(pCb) {
            IntegrationService.findOne({_id: channel}, {dbName: db, warehouseSettings: 1}, function (err, result) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, result && result.warehouseSettings && result.warehouseSettings.warehouse);
            });
        }

        function getWorkflows(pCb) {
            WorkflowService.find({wId: 'Sales Order'}, {dbName: db}, function (err, workflows) {
                if (err) {
                    return pCb(err);
                }

                if (!workflows || !workflows.length) {
                    return pCb();
                }

                pCb(null, workflows);
            });
        }

        async.parallel({
            importData: getImportData,
            orders    : getOrders,
            customers : getCustomers,
            currencies: getCurrencies,
            warehouse : getWarehouse,
            workflows : getWorkflows,
            unlinked  : getUnlinkedProducts
        }, function (err, data) {
            var importData;
            var customers;
            var warehouse;

            if (err) {
                return allCallback(err);
            }

            if (data) {
                importData = data.importData;
                nativeOrders = data.orders;
                customers = data.customers || [];
                warehouse = data.warehouse;
                unlinked = data.unlinked;
                workflows = data.workflows;
            }

            orderIds = _.pluck(nativeOrders, 'integrationId');

            for (var i = 0; i < workflows.length; i++) {
                workflowObj[workflows[i].status] = workflows[i]._id;
            }

            wooOrders = importData;

            async.eachLimit(wooOrders, 1, function (wooOrder, eCb) {
                var orderDate = wooOrder.date_created || new Date();
                var wooCurrency;
                var newCustomer;
                var orderBody;
                var customer;
                var currency;
                var rates;
                var base;

                orderBody = {
                    warehouse    : warehouse,
                    integrationId: wooOrder.id,

                    paymentInfo: {
                        taxes   : wooOrder.total_tax * 100 || 0,
                        unTaxed : wooOrder.total * 100 || 0 - wooOrder.total_tax * 100 || 0,
                        total   : wooOrder.total * 100 || 0,
                        discount: wooOrder.discount_total * 100 || 0
                    },

                    editedBy: {
                        user: uId
                    },

                    channel  : channel,
                    createdBy: {
                        date: orderDate
                    },

                    orderDate   : orderDate,
                    creationDate: orderDate
                };

                if (wooOrder.customer_id) {
                    customer = customers.find(function (el) {
                        return el.integrationId === wooOrder.customer_id.toString();
                    });

                    newCustomer = customer && customer._id;

                    if (newCustomer) {
                        orderBody.supplier = newCustomer;
                    } else {
                        orderBody.supplier = CONSTANTS.DEFAULT_WOO_CUSTOMER;
                    }
                } else {
                    orderBody.supplier = CONSTANTS.DEFAULT_WOO_CUSTOMER;
                }

                ratesService.getById({dbName: db, id: orderDate}, function (err, ratesObject) {
                    rates = ratesObject ? ratesObject.rates : {};
                    base = ratesObject ? ratesObject.base : 'USD';
                    wooCurrency = wooOrder.currency || 'USD';

                    currency = {
                        _id : wooCurrency,
                        rate: ratesRetriever.getRate(rates, base, wooCurrency)
                    };

                    orderBody.currency = currency;

                    createOrUpdateOrder(orderBody, wooOrder, warehouse, function (err, orderOpts) {
                        if (err) {
                            return eCb(err);
                        }

                        async.series([
                            async.apply(createPaymentsForOrder, wooOrder, orderOpts),
                            async.apply(createShippingLine, wooOrder, orderOpts)
                        ], eCb);
                    });
                });

            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback();
            });
        });
    }

    function getAll(opts, callback) {
        var uId = opts.userId || opts.user;
        var dbName = opts.dbName;
        var channelName = opts.channelName;
        var channelId = opts._id || opts.channel;
        var error;

        logs = syncLogsHelper.initialize({
            dbName : opts.dbName,
            channel: opts.channel,
            user   : uId
        });

        if (!opts.baseUrl) {
            error = new Error('Invalid integration settings');
            error.status = 404;

            return callback(error);
        }
        // prevent timeout error
        // callback();

        async.series([
            function (sCb) {
                getCategories(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> categories is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            },

            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> products is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            },

            function (sCb) {
                getCustomers(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> Customers is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            },

            function (sCb) {
                getSalesOrders(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> Sales Orders is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            }
        ], function (err, result) {
            // TODO: log create / add channel date
            syncLogsHelper.create({
                logs  : logs,
                dbName: opts.dbName
            });

            if (err) {
                return callback(err);
            }

            callback(null, result);

            console.log('WOO -> All imported  for channel ', channelName, ' id = ', channelId);
            event.emit('getAllDone', {uId: uId, dbName: dbName});
        });
    }

    function syncChannel(opts, callback) {
        var uId = opts.userId || opts.user;

        logs = syncLogsHelper.initialize({
            dbName : opts.dbName,
            channel: opts.channel,
            user   : uId
        });

        async.series([
            function (sCb) {
                getCategories(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> categories is imported for channel');
                    sCb();
                });
            },

            function (sCb) {
                exportProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> Product is exported for channel');
                    sCb();
                });
            },

            function (sCb) {
                exportInventory(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> Inventory is exported for channel');
                    sCb();
                });
            },

            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> products is imported for channel');
                    sCb();
                });
            },

            function (sCb) {
                getCustomers(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> Customers is imported for channel');
                    sCb();
                });
            },

            function (sCb) {
                getSalesOrders(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> Sales Orders is imported for channel');
                    sCb();
                });
            }
        ], function (err) {
            // TODO: log create / add channel date
            syncLogsHelper.create({
                logs  : logs,
                dbName: opts.dbName
            });

            if (err) {
                return callback(err);
            }

            console.log('WOO -> synchronization is complete!');

            callback();
        });
    }

    function getOnlyProducts(opts, callback) {
        var dbName = opts.dbName;
        var channel = opts._id;
        var user = opts.user;

        logs = syncLogsHelper.initialize({
            dbName : dbName,
            channel: channel,
            user   : user
        });

        async.series([
            function (sCb) {
                getCategories(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> categories is imported for channel');
                    sCb();
                });
            },
            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('WOO -> products is imported for channel');
                    sCb();
                });
            }
        ], function (err) {
            if (err) {
                return callback(err);
            }

            syncLogsHelper.create({
                logs  : logs,
                dbName: opts.dbName
            });

            console.log('WOO -> import products is complete!');

            event.emit('getAllDone', {uId: user, dbName: dbName});

            callback();
        });
    }

    return {
        getCategories  : getCategories,
        getAll         : getAll,
        getProducts    : getProducts,
        getCustomers   : getCustomers,
        getOnlyProducts: getOnlyProducts,
        getSalesOrders : getSalesOrders,
        createProduct  : createProduct,
        publishProduct : publishProduct,
        syncChannel    : syncChannel
    };
};
