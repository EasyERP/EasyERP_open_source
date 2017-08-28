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
var ebay = require('ebay-api');

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
    var ChannelLinksService = require('../services/channelLinks')(models);
    var ratesService = require('../services/rates')(models);
    var taxesService = require('../services/taxes')(models);
    var paymentService = require('../services/payments')(models);
    var ProductOptionService = require('../services/productOption')(models);
    var ProductOptionValueService = require('../services/productOptionValue')(models);
    var imagesService = require('../services/images')(models);
    var organizationService = require('../services/organizationSetting')(models);
    var warehouseService = require('../services/warehouse')(models);
    var productCategoryService = require('../services/category')(models);

    var refundsHelper = new RefundsHelper(models);

    function getCategories(opts, allCallback) {
        var db = opts.dbName;
        var user = opts.userId || opts.user;
        var appId = opts.appId;
        var devId = opts.devId;
        var certId = opts.certId;
        var userToken = opts.token;
        var channel = opts._id || opts.channel;
        var err;

        if (!appId || !devId || !certId || !userToken) {
            err = new Error('Invalid integration settings');
            err.status = 400;
            return allCallback(err);
        }

        function getParentCategory(newCategoryObj, callback) {
            var query = {
                integrationId: newCategoryObj.CategoryParentID && newCategoryObj.CategoryParentID.toString()
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
                name     : newCategory.CategoryName,
                fullName : parentCategory ? parentCategory.fullName + '/' + newCategory.CategoryName : newCategory.CategoryName,
                parent   : parentCategory._id,
                createdBy: {
                    user: user,
                    date: new Date()
                },

                editedBy: {
                    user: user,
                    date: new Date()
                },

                integrationId: newCategory.CategoryParentID.toString(),
                channel      : channel,
                dbName       : db,
                nestingLevel : newCategory.CategoryLevel
            };

            productCategoryService.create(saveObj, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        }

        ebay.xmlRequest({
            serviceName: 'Trading',
            opType     : 'GetCategories',
            devId      : devId,
            certId     : certId,
            appId      : appId,
            sandbox    : true, //todo: change for live
            params     : {
                DetailLevel : 'ReturnAll',
                ViewAllNodes: false
            },

            reqOptions: {
                headers: {
                    'X-EBAY-API-IAF-TOKEN': userToken
                }
            }
        }, function (error, res) {
            var resultCategory;
            var waterfallTasks;

            if (error) {
                console.error(error);
            }

            resultCategory = res && res.Categorys;
            resultCategory = _.sortByOrder(resultCategory, 'CategoryID');

            if (!resultCategory || !resultCategory.length) {
                return allCallback();
            }

            async.eachLimit(resultCategory, 50, function (category, eCb) {
                productCategoryService.findOne({
                    integrationId: category.CategoryID.toString(),
                    channel      : channel
                }, {dbName: db}, function (err, resCategory) {
                    if (err) {
                        return allCallback(err);
                    }

                    if (resCategory) {
                        return eCb();
                    }

                    waterfallTasks = [
                        async.apply(getParentCategory, category),
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

    function createPriceList(priceList, productId, ebayPrice, db, cb) {
        var newPriceList = {
            product: productId,

            prices: [{
                count: 1,
                price: ebayPrice
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

    function createProduct(createOptions, ebayProductId, productObjArray, internalProds, imageArray, eachCb) {
        var options = createOptions.options;
        var channel = createOptions.channel;
        var priceList = createOptions.priceList;
        var dbName = createOptions.dbName;
        var groupId = productObjArray[0].groupId;
        var checkIdentitySKU;

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

                delete options.body.ebayId;

                if (options.body.info.SKU.toString() && internalProds.length) {
                    checkIdentitySKU = _.find(internalProds, {
                        sku: productObj.info.SKU.toString()
                    });
                }

                ChannelLinksService.findOne({
                    linkId : ebayProductId,
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

                    if (checkIdentitySKU) {
                        ConflictService.findAndUpdate({
                            'fields.ebayId' : productObj.ebayId,
                            'fields.channel': ObjectId(channel)
                        }, {
                            entity: 'Product',
                            fields: productObj
                        }, {
                            upsert: true,
                            dbName: options.dbName
                        }, function (err) {
                            if (err) {
                                return secondEachCb(err);
                            }

                            event.emit('showResolveConflict', {uId: createOptions.uId});

                            secondEachCb();
                        });
                    } else {
                        async.waterfall([
                            function (wCb) {
                                var ebayImageId = options.body && options.body.ebayImageId && options.body.ebayImageId.toString();

                                if (!ebayImageId && (ebayImageId !== 0)) {
                                    delete options.ebayImageId;
                                    return wCb();
                                }

                                imagesService.findOne({integrationId: ebayImageId}, {
                                    dbName: dbName
                                }, function (err, resultImage) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    delete options.ebayImageId;

                                    if (!resultImage) {
                                        return wCb();
                                    }

                                    options.body.imageSrc = resultImage._id;

                                    wCb();
                                });
                            },

                            function (wCb) {
                                var ebayProductCategories = productObj.ebayCategories;
                                var ebayCategoriesIds = [];
                                var nativeCategories;

                                ebayProductCategories.forEach(function (cat) {
                                    ebayCategoriesIds.push(cat.toString());
                                });

                                productCategoryService.find({integrationId: {$in: ebayCategoriesIds}}, {
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
                                        return wCb(err);
                                    }

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
                                var linkId = ebayProductId;
                                var channelLinksObj = {
                                    product  : product,
                                    linkId   : linkId,
                                    channel  : channel,
                                    priceList: priceList,
                                    dbName   : dbName
                                };

                                ChannelLinksService.create(channelLinksObj, function (err) {
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
        var appId = opts.appId;
        var devId = opts.devId;
        var certId = opts.certId;
        var baseUrl = opts.baseUrl;
        var priceList = opts.priceList;
        var channel = opts._id || opts.channel;
        var userToken = opts.token;
        var internalProds = [];
        var products;
        var err;

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        if (!appId || !devId || !certId || !userToken) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            return allCallback(err);
        }

        ebay.xmlRequest({
            serviceName: 'Trading',
            opType     : 'GetSellerList',
            devId      : devId,
            certId     : certId,
            appId      : appId,
            sandbox    : true,
            params     : {
                GranularityLevel: 'Coarse',
                StartTimeFrom   : new Date(Date.now() - 10281600000).toISOString(),
                StartTimeTo     : new Date().toISOString(),
                Pagination      : {
                    EntriesPerPage: 2
                }
            },

            reqOptions: {
                headers: {
                    'X-EBAY-API-IAF-TOKEN': userToken
                }
            }
        }, function (error, results) {
            if (error) {
                allCallback(error);
            }

            products = results && results.Items;

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

                async.eachLimit(products, 1, function (ebayProduct, eachCb) {
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
                    var productObj;
                    var newGroupId;

                    if (err) {
                        return eachCb(err);
                    }

                    function createImages(wCb) {
                        var ebayImage;

                        if (!ebayProduct.PictureDetails || (!ebayProduct.PictureDetails.PictureURL)) {
                            return wCb(null);
                        }

                        ebayImage = ebayProduct.PictureDetails.PictureURL;

                        if (!ebayImage.length) {
                            imageSrcArray = [{
                                imageSrc     : ebayImage,
                                integrationId: ebayImage.split('/')[7]
                            }];

                            return wCb();
                        }

                        ebayImage.forEach(function (image) {
                            imageSrcArray.push({
                                imageSrc     : image,
                                integrationId: image.split('/')[7]
                            });
                        });

                        return wCb();
                    }

                    async.waterfall([createImages], function (err) { //todo Methods has been add to this waterfall
                        var imageId;

                        newGroupId = new ObjectId().toString();

                        if (err) {
                            return eachCb(err);
                        }

                        productObj = {
                            channel: ObjectId(channel),
                            ebayId : ebayProduct.ItemID,
                            name   : ebayProduct.Title,

                            info: {
                                categories : [CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID], // set default category to product
                                SKU        : ebayProduct.ItemID || '',
                                description: ebayProduct.Title || ''
                            },

                            price         : ebayProduct.SellingStatus && ebayProduct.SellingStatus.CurrentPrice && ebayProduct.SellingStatus.CurrentPrice.amount,
                            groupId       : newGroupId,
                            isVariant     : false,
                            ebayCategories: [ebayProduct.PrimaryCategory && ebayProduct.PrimaryCategory.CategoryID]
                        };

                        imageId = (ebayProduct.PictureDetails && ebayProduct.PictureDetails.PictureURL && ebayProduct.PictureDetails.PictureURL.length && ebayProduct.PictureDetails.PictureURL[0].split('/')[7]) || (ebayProduct.PictureDetails && ebayProduct.PictureDetails.PictureURL && ebayProduct.PictureDetails.PictureURL.split('/')[7]) || 0;

                        productObj.ebayImageId = imageId;

                        createProduct(createOptions, ebayProduct.ItemID, [productObj], internalProds, imageSrcArray, eachCb);
                    });
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
        var db = opts.dbName;
        var user = opts.userId || opts.user;
        var baseUrl = opts.baseUrl;
        var appId = opts.appId;
        var devId = opts.devId;
        var certId = opts.certId;
        var userToken = opts.token;
        var channel = opts._id || opts.channel;
        var err;
        var ebayOrders;

        if (!appId || !devId || !certId || !userToken) {
            err = new Error('Invalid integration settings');
            err.status = 400;
            return allCallback(err);
        }

        ebay.xmlRequest({
            serviceName: 'Trading',
            opType     : 'GetOrders',
            devId      : devId,
            certId     : certId,
            appId      : appId,
            sandbox    : true,
            params     : {
                OrderIDArray: {
                    OrderID: '0-5'
                }
            },

            reqOptions: {
                headers: {
                    'X-EBAY-API-IAF-TOKEN': userToken
                }
            }
        }, function (error, result) {

            if (error) {
                console.error(error);
            }

            ebayOrders = result && result.Orders;

        });
    }

    function getAll(opts, callback) {
        var uId = opts.userId || opts.user;
        var dbName = opts.dbName;
        var channelName = opts.channelName;
        var channelId = opts._id || opts.channel;
        var type = opts.type;
        var error;

        if (!opts.baseUrl && type !== 'ebay') {
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

                    console.log('Ebay -> categories is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            },

            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Ebay -> Products is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            }
        ], function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);

            console.log('Ebay -> All imported  for channel ', channelName, ' id = ', channelId);
            event.emit('getAllDone', {uId: uId, dbName: dbName});
        });
    }

    function syncChannel(opts, callback) {
        async.series([
            function (sCb) {
                getCategories(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Ebay -> categories is imported for channel');
                    sCb();
                });
            },

            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Ebay -> Products is imported for channel');
                    sCb();
                });
            }
        ], function (err) {
            if (err) {
                return callback(err);
            }

            console.log('Ebay -> synchronization is complete!');

            callback();
        });
    }

    return {
        getCategories : getCategories,
        getAll        : getAll,
        getProducts   : getProducts,
        //getCustomers  : getCustomers,
        getSalesOrders: getSalesOrders,
        //createProduct : createProduct,
        //publishProduct: publishProduct,
        syncChannel   : syncChannel

    };
};
