var mongoose = require('mongoose');
var request = require('request');
var _ = require('lodash');
var async = require('async');
var requestHelper = require('../helpers/tracker');
var ObjectId = mongoose.Types.ObjectId;
var redisClient = require('../helpers/redisClient');
var CONSTANTS = require('../constants/mainConstants');
var imageHelper = require('../helpers/imageHelper');
var ratesRetriever = require('../helpers/ratesRetriever')();
var RefundsHelper = require('../helpers/refunds');
var Uploader = require('../services/fileStorage/index');
var uploader = new Uploader();

module.exports = function (models, event) {
    var customerService = require('../services/customer')(models);
    var currencyService = require('../services/currency')(models);
    var productService = require('../services/products')(models);
    var paymentMethodService = require('../services/paymentMethod')(models);
    var shippingMethodService = require('../services/shippingMethod')(models);
    var AvailabilityService = require('../services/productAvailability')(models);
    var ConflictService = require('../services/conflict')(models);
    var WorkflowService = require('../services/workflow')(models);
    var IntegrationService = require('../services/integration')(models);
    var OrderService = require('../services/order')(models);
    var OrderRowsService = require('../services/orderRows')(models);
    var productTypeService = require('../services/productType')(models);
    var productPriceService = require('../services/productPrice')(models);
    var ChannelLinksService = require('../services/channelLinks')(models);
    var ImagesService = require('../services/images')(models);
    var ratesService = require('../services/rates')(models);
    var taxesService = require('../services/taxes')(models);
    var paymentService = require('../services/payments')(models);
    var journalEntryService = require('../services/journalEntry')(models);
    var goodsOutNoteService = require('../services/goodsOutNotes')(models);
    var AvailabilityHelper = require('../helpers/availability')(models);
    var ProductAvailabilityService = require('../services/productAvailability')(models);
    var ProductOptionService = require('../services/productOption')(models);
    var ProductOptionValueService = require('../services/productOptionValue')(models);
    var imagesService = require('../services/images')(models);
    var channelLinksService = require('../services/channelLinks')(models);
    var organizationService = require('../services/organizationSetting')(models);
    var warehouseService = require('../services/warehouse')(models);

    var refundsHelper = new RefundsHelper(models);

    function parseBase64Image(image) {
        if (typeof image !== 'string') {
            return image;
        }

        if (image.indexOf('data:image/jpeg;base64') >= 0) {
            return image.slice(23);
        }
        if (image.indexOf('data:image/png;base64') >= 0) {
            return image.slice(22);
        }

        return image;
    }

    function statusBuilder(status, workflowObj) {
        switch (status) {
            case 'canceled':
                return workflowObj.Canceled;
            default :
                return workflowObj['In Progress'];
        }
    }

    function createPriceList(priceList, productId, shopifyPrice, db, cb) {
        var newPriceList = {
            product: productId,

            prices: [{
                count: 1,
                price: shopifyPrice
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

    function publishImagesForProduct(imagesArray, callback) {
        var resultArray = [];

        async.eachLimit(imagesArray, 1, function (image, eCb) {
            if (!image.channel) {
                uploader.readImage(image.imageSrc, function (err, base64Data) {
                    if (err) {
                        return eCb(err);
                    }

                    if (base64Data) {
                        resultArray.push({attachment: base64Data});
                    }

                    eCb();
                });
            }
        }, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, resultArray);
        });
    }

    function createProduct(createOptions, shopifyProductId, productObjArray, internalProds, imageArray, eachCb) {
        var options = createOptions.options;
        var channel = createOptions.channel;
        var priceList = createOptions.priceList;
        var checkIdentitySKU;
        var dbName = createOptions.dbName;
        var groupId = productObjArray[0].groupId;

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
            async.eachLimit(productObjArray, 1, function (productObjEach, secondEachCb) {
                checkIdentitySKU = false;
                options.body = _.extend({}, productObjEach);

                delete options.body.shopifyId;
                delete options.body.shopifyVariantId;

                if (options.body.info.SKU.toString() && internalProds.length) {
                    checkIdentitySKU = _.find(internalProds, {
                        sku: productObjEach.info.SKU.toString()
                    });
                }

                ChannelLinksService.findOne({
                    linkId : shopifyProductId + '|' + productObjEach.shopifyVariantId,
                    channel: channel
                }, {dbName: dbName}, function (err, channelLinks) {
                    var unlinkedBody;

                    if (err) {
                        return secondEachCb(err);
                    }

                    if (channelLinks) {
                        return secondEachCb();
                    }

                    if (!productObjEach.info.SKU || !productObjEach.name) {

                        return ConflictService.findOne({
                            'fields.id'     : productObjEach.shopifyVariantId,
                            entity          : 'Product',
                            type            : 'unlinked',
                            'fields.channel': ObjectId(channel)
                        }, {dbName: dbName}, function (err, result) {
                            if (err) {
                                return secondEachCb(err);
                            }

                            if (result) {
                                return secondEachCb();
                            }

                            unlinkedBody = {
                                id     : productObjEach.shopifyVariantId,
                                mainId : shopifyProductId,
                                channel: ObjectId(channel),
                                name   : productObjEach.name,
                                sku    : productObjEach.info.SKU,
                                price  : productObjEach.price,
                                isValid: false,
                                groupId: productObjEach.groupId
                            };

                            ConflictService.create({
                                entity: 'Product',
                                type  : 'unlinked',
                                fields: unlinkedBody,
                                dbName: options.dbName
                            }, function (err) {
                                if (err) {
                                    return secondEachCb(err);
                                }

                                secondEachCb();
                            });
                        });
                    }

                    if (checkIdentitySKU) {
                        ConflictService.findAndUpdate({
                            'fields.shopifyVariantId': productObjEach.shopifyVariantId,
                            'fields.channel'         : ObjectId(channel)
                        }, {
                            entity: 'Product',
                            fields: productObjEach
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
                                var shopifyImageId = options.body && options.body.shopifyImageId && options.body.shopifyImageId.toString();

                                if (!shopifyImageId) {
                                    delete options.shopifyImageId;
                                    return wCb();
                                }

                                imagesService.findOne({integrationId: shopifyImageId}, {
                                    dbName: dbName
                                }, function (err, resultImage) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    delete options.shopifyImageId;

                                    if (!resultImage) {
                                        return wCb();
                                    }

                                    options.body.imageSrc = resultImage._id;

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
                                createPriceList(priceList, product, productObjEach.price, options.dbName, function (err) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb(null, product);
                                });
                            },

                            function (product, wCb) {
                                var linkId = shopifyProductId + '|' + productObjEach.shopifyVariantId;
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
        var productLength = 0;
        var internalProds = [];
        var products = [];
        var helperForWhile = true;
        var pageNumber = 1;
        var err;
        var db;
        var accessToken;
        var baseUrl;
        var uId;
        var settings;
        var route;
        var fullRoute;
        var channel;
        var priceList;

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        channel = opts._id;
        db = opts.dbName;
        accessToken = opts.token;
        baseUrl = opts.baseUrl;
        uId = opts.userId;
        settings = opts.settings;
        priceList = opts.priceList;

        route = settings.products && settings.products.get;

        if (!accessToken || !baseUrl || !route) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            return allCallback(err);
        }

        fullRoute = baseUrl + route;

        async.whilst(function () {
            return helperForWhile;
        }, function (whCb) {
            requestHelper.getData(fullRoute + '?limit=250&page=' + pageNumber, {
                //requestHelper.getData(fullRoute + '?ids=9780678148', {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, result) {
                if (err) {
                    return whCb(err);
                }

                if (!result || !result.body || result.body.errors) {
                    console.error(result.body.errors);
                    helperForWhile = false;
                    return whCb();
                }

                products = result.body && result.body.products;

                if (result.body && result.body.products && (result.body.products.length < 250)) {
                    helperForWhile = false;
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

                    async.eachLimit(products, 1, function (shopifyProduct, eachCb) {
                        var productObjArray = [];
                        var options = {
                            dbName: db
                        };
                        var productObj;
                        var imageSrc;
                        var productTypeObj = {};
                        var productTypeOptions = [];
                        var productOptionValues = [];
                        var imageSrcArray = [];

                        async.waterfall([
                            function (wCb) {
                                if (!shopifyProduct.options && !shopifyProduct.options.length) {
                                    return wCb();
                                }

                                async.each(shopifyProduct.options, function (option, eCb) {
                                    if (option.name === 'Title') {
                                        return eCb();
                                    }

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

                                        async.each(option.values, function (value, eCb2) {
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
                            },

                            function (wCb) {

                                if (productTypeOptions.length) {
                                    productTypeObj.$addToSet = {options: {$each: productTypeOptions}};
                                }

                                if (!shopifyProduct.product_type) {
                                    productTypeObj._id = CONSTANTS.DEFAULT_PRODUCT_TYPE_ID;
                                }

                                productTypeService.findOneAndUpdate({
                                    name: shopifyProduct.product_type || 'Default'
                                }, productTypeObj, {
                                    upsert: true,
                                    new   : true,
                                    dbName: db
                                }, function (err, productType) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    wCb(null, productType._id || productType.upserted[0]._id);
                                });
                            },

                            function (productTypeId, wCb) {
                                var shopifyImages;

                                if (!shopifyProduct.images || !shopifyProduct.images.length) {
                                    return wCb(null, productTypeId);
                                }

                                shopifyImages = shopifyProduct.images;

                                shopifyImages.forEach(function (image) {
                                    imageSrcArray.push({
                                        imageSrc     : image.src,
                                        integrationId: image.id
                                    });
                                });

                                wCb(null, productTypeId);
                            }
                        ], function (err, productTypeId) {
                            var createOptions = {
                                channel  : channel,
                                uId      : uId,
                                options  : options,
                                priceList: priceList,
                                dbName   : db
                            };
                            var newGroupId;
                            var variantsLength;
                            var i;
                            var variantOptionValues;
                            var imageId;

                            if (err) {
                                return eachCb(err);
                            }

                            if (!shopifyProduct.variants || !shopifyProduct.variants.length) {
                                return eachCb();
                            }

                            newGroupId = new ObjectId().toString();
                            variantsLength = shopifyProduct.variants.length;
                            productLength += variantsLength;

                            for (i = variantsLength - 1; i >= 0; i--) {
                                variantOptionValues = productOptionValues.filter(function (el) {
                                    return el.theirs === shopifyProduct.variants[i].option1 || el.theirs === shopifyProduct.variants[i].option2 || el.theirs === shopifyProduct.variants[i].option3;
                                });

                                productObj = {
                                    channel         : ObjectId(channel),
                                    shopifyId       : shopifyProduct.id,
                                    shopifyVariantId: shopifyProduct.variants[i].id,
                                    name            : shopifyProduct.title,
                                    info            : {
                                        productType: productTypeId,
                                        categories : [CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID], // set default category to product
                                        SKU        : shopifyProduct.variants[i].sku || '',
                                        description: shopifyProduct.body_html ? shopifyProduct.body_html.replace(/<\/?[^>]+(>|$)/g, '') : ''
                                    },

                                    variants   : _.pluck(variantOptionValues, 'our'),
                                    price      : parseInt(shopifyProduct.variants[i].price, 10),
                                    groupId    : newGroupId,
                                    shopifyType: shopifyProduct.product_type,
                                    isVariant  : true
                                };

                                imageId = shopifyProduct.variants[i].image_id || (shopifyProduct.image && shopifyProduct.image.id)

                                productObj.shopifyImageId = imageId;
                                productObjArray.push(productObj);
                            }

                            createProduct(createOptions, shopifyProduct.id, productObjArray, internalProds, imageSrcArray, eachCb);
                        });
                    }, function (err) {
                        if (err) {
                            return whCb(err);
                        }

                        pageNumber++;

                        whCb();
                    });
                });
            });
        }, function (err) {
            if (err) {
                return allCallback(err);
            }

            allCallback();
        });
    }

    function exportInventory(opts, allCallback) {
        var count = 0;
        var message = '';
        var db;
        var accessToken;
        var channel;
        var settings;
        var baseUrl;
        var uId;
        var route;
        var fullRoute;
        var err;

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        db = opts.dbName;
        accessToken = opts.token;
        baseUrl = opts.baseUrl;
        settings = opts.settings;
        channel = opts._id;

        route = settings.products && settings.products.put;

        if (!accessToken || !baseUrl || !route) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            return allCallback(err);
        }

        fullRoute = baseUrl + route;

        ChannelLinksService.find({channel: channel}, {
            dbName: db
        }, function (err, channelLinks) {
            if (!channelLinks || !channelLinks.length) {
                return allCallback();
            }

            async.each(channelLinks, function (channelLink, eachCb) {
                AvailabilityService.find({
                    query : {product: channelLink.product},
                    dbName: db
                }, function (err, availabilityProduct) {
                    var model;
                    var splittedLinkId = channelLink.linkId.split('|');
                    var productId = splittedLinkId[0];
                    var variantId = splittedLinkId[1];

                    if (err) {
                        return eachCb(err);
                    }

                    if (!availabilityProduct || !availabilityProduct.length) {
                        return eachCb();
                    }

                    availabilityProduct = availabilityProduct[0];

                    model = {
                        product: {
                            id      : productId,
                            variants: [{
                                id   : variantId,
                                price: availabilityProduct.cost
                            }]
                        }
                    };

                    if (availabilityProduct.onHand) {
                        model.product.variants[0].inventory_quantity = availabilityProduct.onHand;
                        model.product.variants[0].inventory_management = 'shopify';
                    }

                    requestHelper.putData(fullRoute + productId + '.json', model, {
                        headers: {
                            Authorization: accessToken
                        }
                    }, function (err, result) {
                        if (err) {
                            return eachCb(err);
                        }

                        count++;

                        if (!result || !result.body || result.body.errors) {
                            console.error(result.body.errors);
                            return eachCb();
                        }

                        eachCb();
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

    function exportsProducts(opts, allCallback) {
        var shopifyId = 0;
        var message = '';
        var fullPutRoute;
        var fullPutVariantRoute;
        var putRoute;
        var putVariantRoute;
        var accessToken;
        var settings;
        var channel;
        var baseUrl;
        var error;
        var db;
        var channelLinks;
        var productPrices;
        var productObjectIds;

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        db = opts.dbName;
        accessToken = opts.token;
        baseUrl = opts.baseUrl;
        channel = opts._id;
        settings = opts.settings;

        if (settings.products) {
            putRoute = settings.products.put;
            putVariantRoute = settings.products.putVariant;
        }

        if (!accessToken || !baseUrl || !putRoute || !putVariantRoute) {
            error = new Error('Invalid integration settings');
            error.status = 400;

            return allCallback(error);
        }

        fullPutRoute = baseUrl + putRoute;
        fullPutVariantRoute = baseUrl + putVariantRoute;

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

                        console.log('Redis_ChangedProducts cleared!');
                    });

                    wCb(null, values);
                });
            },

            function (productIds, wCb) {
                productObjectIds = productIds.objectID();

                ChannelLinksService.find({channel: channel, product: {$in: productObjectIds}}, {dbName: db})
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
                var model;
                var priceList;
                var price;
                var channelLink = channelLinks.find(function (link) {
                    return link.product.toString() === product._id.toString() && link.channel.toString() === channel;
                });
                var linkId = channelLink && channelLink.linkId;
                var shopifyVariantId = linkId && linkId.split('|')[1];
                var productImages = product.productImages;
                var imagesArray = [];

                shopifyId = linkId && linkId.split('|')[0];
                priceList = channelLink.priceList;

                price = productPrices.find(function (el) {
                    return priceList && el.priceLists && el.priceLists.toString() === priceList.toString() && el.product.toString() === product._id.toString();
                });

                productImages = _.sortBy(productImages, {main: false});

                productImages.forEach(function (image) {
                    imagesArray.push({
                        attachment: parseBase64Image(image.imageSrc)
                    });
                });

                model = {
                    variant: {
                        id    : shopifyVariantId,
                        sku   : product.info.SKU,
                        price : price && price.prices.length && price.prices[0].price || 0,
                        weight: product.inventory.weight
                    }
                };

                requestHelper.putData(fullPutVariantRoute + shopifyVariantId + '.json', model, {
                    headers: {
                        Authorization: accessToken
                    }
                }, function (err, result) {
                    if (err) {
                        return eCb(err);
                    }

                    if (!result || !result.body || result.body.errors) {
                        console.error(result.body.errors);
                        return eCb();
                    }

                    eCb();
                });
            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback(null, message);
            });

        });
    }

    function getCustomers(opts, allCallback) {
        var channel = opts._id;
        var countForSocket = 0;
        var accessToken;
        var fullRoute;
        var customers;
        var settings;
        var baseUrl;
        var error;
        var route;
        var db;

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        db = opts.dbName;
        accessToken = opts.token;
        baseUrl = opts.baseUrl;
        settings = opts.settings;

        route = settings.customers && settings.customers.get;

        if (!accessToken || !baseUrl || !route) {
            error = new Error('Bad Request');
            error.status = 400;

            return allCallback(error);
        }

        fullRoute = baseUrl + route;

        requestHelper.getData(
            fullRoute,
            {
                headers: {
                    Authorization: accessToken
                }
            },
            function (err, result) {
                var newCustomer = {};

                if (err) {
                    return allCallback(err);
                }

                if (!result || !result.body || result.body.errors) {
                    console.error(result.body.errors);
                    return allCallback();
                }

                customers = result.body && result.body.customers;

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

                    async.eachLimit(customers, 1, function (customer, eachCb) {
                        var customerAddr;
                        var address = {
                            city   : '',
                            country: '',
                            state  : '',
                            street : '',
                            zip    : ''
                        };
                        var findResult;

                        countForSocket++;

                        if (customer.addresses || customer.addresses.length) {
                            customerAddr = customer.addresses[0] || {};
                            address = {
                                city   : customerAddr.city,
                                country: customerAddr.country || '',
                                state  : '',
                                zip    : customerAddr.zip || '',
                                street : customerAddr.address1
                            };
                        }

                        newCustomer = {
                            dbName       : db,
                            integrationId: customer.id,
                            address      : address,
                            email        : customer.email || '',
                            name         : {
                                first: customer.first_name || '',
                                last : customer.last_name || ''
                            },

                            phones: {
                                phone: customerAddr.phone || ''
                            },

                            type   : 'Person',
                            channel: channel
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
                                    return eachCb(err);
                                }

                                eachCb();
                            });
                        } else {
                            customerService.create(newCustomer, function (err) {
                                if (err) {
                                    return eachCb(err);
                                }

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
        var channel = opts._id;
        var workflowObj = {};
        var shopifyOrders;
        var accessToken;
        var nativeOrders;
        var fullRoute;
        var warehouse;

        var location;
        var unlinked;
        var orderIds;
        var settings;
        var baseUrl;
        var route;
        var err;
        var uId;
        var db;

        if (typeof opts === 'function') {
            allCallback = opts;
            opts = {};
        }

        db = opts.dbName;
        accessToken = opts.token;
        baseUrl = opts.baseUrl;
        uId = opts.user;
        settings = opts.settings;
        warehouse = opts.warehouseSettings && opts.warehouseSettings.warehouse;
        location = opts.warehouseSettings && opts.warehouseSettings.location;

        route = settings.orders && settings.orders.get;

        if (!accessToken || !baseUrl || !route) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            return allCallback(err);
        }

        fullRoute = baseUrl + route;

        function createOrUpdateOrder(orderBody, shopifyOrder, warehouse, eCb) {
            var shopifyIds = _.pluck(shopifyOrder.line_items, 'variant_id');
            var linkIds = shopifyOrder.line_items.map(function (el) {
                return el.product_id + '|' + el.variant_id;
            });
            var workflow = statusBuilder(shopifyOrder.financial_status || '', workflowObj);
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

                    arrayRows = products.map(function (elem) {
                        var shopifyVariantId = elem.channelLinks.linkId.split('|')[1];
                        var object = shopifyOrder.line_items.find(function (el) {
                            return el.variant_id.toString() === shopifyVariantId;
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

                            if (shopifyOrder.line_items.length !== ourProducts.length) {
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
                    var gateway = shopifyOrder.gateway;
                    var financialStatus = shopifyOrder.financial_status;

                    if (financialStatus === 'pending') {
                        return sCb();
                    }

                    paymentMethodService.findOne({name: gateway}, {dbName: db}, function (err, result) {
                        if (err) {
                            return sCb(err);
                        }

                        if (!result && orderIds.indexOf(shopifyOrder.id) < 0) {
                            orderBody.workflow = ObjectId(CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID);
                            orderBody.tempWorkflow = workflow;

                            if (orderBody.conflictTypes && orderBody.conflictTypes.length) {
                                orderBody.conflictTypes.push({
                                    type : 'paymentMethod',
                                    value: {
                                        name: shopifyOrder.gateway
                                    }
                                });
                            } else {
                                orderBody.conflictTypes = [{
                                    type : 'paymentMethod',
                                    value: {
                                        name: shopifyOrder.gateway
                                    }
                                }];
                            }

                            return sCb();
                        }

                        orderBody.paymentMethod = result._id;

                        paymentMethod = result;
                        needPayments = true;

                        sCb();
                    });
                },

                function (sCb) {
                    if (!shopifyOrder.customer && orderIds.indexOf(shopifyOrder.id.toString()) < 0) {

                        orderBody.workflow = ObjectId(CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID);
                        orderBody.tempWorkflow = workflow;

                        if (orderBody.conflictTypes && orderBody.conflictTypes.length) {
                            orderBody.conflictTypes.push({
                                type: 'customer'
                            });
                        } else {
                            orderBody.conflictTypes = [{
                                type: 'customer'
                            }];
                        }
                    }

                    sCb();
                },

                function (sCb) {
                    if (orderIds.indexOf(shopifyOrder.id.toString()) > -1) {

                        OrderService.findOneAndUpdate({
                            integrationId: shopifyOrder.id.toString(),
                            channel      : channel
                        }, {$set: orderBody}, {
                            dbName: db,
                            new   : true
                        }, function (err, newObject) {
                            if (err) {
                                return sCb(err);
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

                                    product.orderRowId = currentRow._id;

                                    return product;
                                });

                                orderRowsBuilder(newObject, products, sCb);
                            });
                        });
                    } else {
                        orderBody.dbName = db;
                        orderBody.createdBy.user = uId;

                        if (!orderBody.workflow) {
                            orderBody.workflow = workflow;
                            orderBody.tempWorkflow = null;
                        }

                        OrderService.create(orderBody, function (err, _order) {
                            if (err) {
                                return sCb(err);
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

                    if (!hasUnlinkedProducts) {
                        return sCb();
                    }

                    nativeIds = _.pluck(products, 'channelLinks.linkId');
                    nativeIds = nativeIds.map(function (el) {
                        return parseInt(el.split('|')[1], 10);
                    });

                    differenceProductIds = _.difference(shopifyIds, nativeIds);

                    async.each(differenceProductIds, function (product, intCb) {
                        var unlinkedOrderRow;
                        var fields = shopifyOrder.line_items.find(function (theirProduct) {
                            return theirProduct.variant_id === product;
                        });
                        var data = {
                            price   : fields.price * 100,
                            sku     : fields.sku,
                            name    : fields.name,
                            mainId  : fields.product_id,
                            id      : fields.variant_id,
                            channel : ObjectId(channel),
                            hasOrder: true
                        };
                        var orderRowData = {
                            quantity: fields.quantity,
                            order   : unlinkedOrderId
                        };

                        if (unlinkedIds.indexOf(fields.variant_id) > -1) {
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
                            upsert: true,
                            new   : true
                        }, function (err, result) {
                            if (err) {
                                return intCb(err);
                            }

                            orderRowData.product = result._id || result.upserted[0]._id;

                            ConflictService.create(unlinkedOrderRow, function (err) {
                                if (err) {
                                    return intCb(err);
                                }

                                intCb();
                            });
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
                var query = {
                    name: tax.title,
                    rate: tax.rate
                };
                var outTaxObj;

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

                        return eCb();
                    }

                    taxCode = tax.title[0].toUpperCase();
                    taxFullName = taxCode + ' ' + tax.title + ' ' + tax.rate * 100 + '%';
                    newTaxObj = {
                        name    : tax.title,
                        rate    : tax.rate,
                        code    : taxCode,
                        fullName: taxFullName,
                        dbName  : db
                    };

                    taxesService.create(newTaxObj, function (err, result) {
                        if (err) {
                            return eCb(err);
                        }

                        outTaxObj = {
                            taxCode: result._id,
                            tax    : parseFloat(tax.price) * 100
                        };

                        outTaxes.push(outTaxObj);

                        eCb();
                    });
                });
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, outTaxes);
            });
        }

        function createPaymentsForOrder(baseUrl, shopifyOrder, resultOpts, callback) {
            var url = baseUrl + '/admin/orders/' + shopifyOrder.id + '/transactions.json';
            var orderBody = (resultOpts.order && resultOpts.order.toJSON()) || {};
            var paymentMethod = (resultOpts.paymentMethod && resultOpts.paymentMethod.toJSON()) || {};

            if (!orderBody.paymentMethod) {
                return callback();
            }

            requestHelper.getData(url, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, result) {
                var paymentData;

                if (err) {
                    return callback(err);
                }

                paymentData = result.body && result.body.transactions;

                if (!paymentData || !paymentData.length) {
                    return callback();
                }

                async.eachLimit(paymentData, 1, function (payment, eCb) {
                    var query = {
                        channel      : ObjectId(channel),
                        integrationId: '' + payment.id
                    };
                    var paymentDate;
                    var paymentObj;

                    if (payment.kind === 'authorization' || payment.kind === 'void' || payment.kind === 'refund' || payment.status === 'failure') {
                        return eCb();
                    }

                    paymentDate = new Date(payment.created_at);

                    paymentObj = {
                        paidAmount   : payment.amount,
                        currency     : orderBody.currency,
                        date         : paymentDate,
                        paymentMethod: paymentMethod,
                        supplier     : orderBody.supplier,
                        order        : orderBody._id,
                        channel      : channel,
                        integrationId: '' + payment.id,
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

                    paymentService.findOne(query, {dbName: db}, function (err, result) {
                        if (err) {
                            return eCb(err);
                        }

                        if (result) {
                            paymentObj.paidAmount = paymentObj.paidAmount * 100;

                            paymentService.findByIdAndUpdate(result._id, paymentObj, {
                                new   : true,
                                dbName: db
                            }, function (err, payment) {
                                if (err) {
                                    return eCb(err);
                                }

                                journalEntryService.formBodyForPrepaymentEntries({
                                    payment: payment,
                                    dbName : db
                                }, function (err) {
                                    if (err) {
                                        return eCb();
                                    }

                                    eCb();
                                });
                            });
                        } else {
                            paymentObj.dbName = db;

                            paymentService.create(paymentObj, function (err, payment) {
                                if (err) {
                                    return eCb(err);
                                }

                                journalEntryService.formBodyForPrepaymentEntries({
                                    payment: payment,
                                    dbName : db
                                }, function (err) {
                                    if (err) {
                                        return eCb(err);
                                    }

                                    eCb();
                                });
                            });
                        }
                    });
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback();
                });
            });
        }

        function findOrCreateShippingMethod(shippingName, callback) {
            var shippingMethodObj;

            shippingMethodService.findOne({name: shippingName}, {dbName: db}, function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result) {
                    return callback(null, result._id);
                }

                organizationService.getDefaultShippingAccount({dbName: db}, function (err, defaultShippingMethod) {
                    if (err) {
                        return callback(err);
                    }

                    shippingMethodObj = {
                        body: {
                            name   : shippingName,
                            account: defaultShippingMethod
                        },

                        dbName: db
                    };

                    shippingMethodService.create(shippingMethodObj, function (err, createdSM) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, createdSM._id);
                    });
                });
            });
        }

        function createGoodsOutNotes(shopifyOrder, resultOpts, callback) {
            var fulfillments = shopifyOrder.fulfillments;
            var createdOrder = resultOpts.order;
            var productIdsForAvailability = [];
            var goodsOutNotesLines = [];
            var needGoodsOutNote = true;
            var fulfillmentLines;
            var goodsOutNoteObj;
            var statusObj;
            var date;

            if (!fulfillments || !fulfillments.length) {
                return callback();
            }

            goodsOutNoteService.find({channel: ObjectId(channel)}, {dbName: db})
                .lean()
                .exec(function (err, resultNotes) {
                    if (err) {
                        return callback(err);
                    }

                    async.eachLimit(fulfillments, 1, function (fulfillment, eCb) {
                        var currentFulFillment;

                        fulfillmentLines = fulfillment.line_items;
                        date = new Date(fulfillment.created_at);
                        statusObj = {
                            shipped    : true,
                            picked     : true,
                            packed     : true,
                            printed    : true,
                            shippedOn  : date,
                            pickedOn   : date,
                            packedOn   : date,
                            printedOn  : date,
                            pickedById : uId,
                            packedById : uId,
                            shippedById: uId,
                            printedById: uId
                        };

                        currentFulFillment = _.findWhere(resultNotes, {integrationId: fulfillment.id.toString()});

                        if (currentFulFillment) {
                            return callback(); // return global callback because we not need create goodsOutNote
                        }

                        OrderRowsService.find({$and: [{order: createdOrder._id}, {product: {$ne: null}}]}, {dbName: db}, function (err, resultRows) {
                            if (err) {
                                return callback(err);
                            }

                            if (!resultRows || !resultRows.length) {
                                return callback();
                            }

                            findOrCreateShippingMethod(fulfillment.tracking_company, function (err, shippingMethod) {
                                if (err) {
                                    return eCb(err);
                                }

                                OrderService.findByIdAndUpdate(createdOrder._id, {$set: {shippingMethod: shippingMethod._id}}, {dbName: db}, function (err) {
                                    if (err) {
                                        return callback(err);
                                    }

                                    fulfillmentLines.forEach(function (lineItem) {
                                        var currentNativeRow = _.findWhere(resultRows, {integrationId: lineItem.id.toString()});
                                        var rowObj;

                                        if (currentNativeRow) {
                                            rowObj = {
                                                orderRowId: currentNativeRow._id,
                                                product   : currentNativeRow.product,
                                                cost      : 0,
                                                quantity  : lineItem.quantity
                                            };

                                            goodsOutNotesLines.push(rowObj);

                                            productIdsForAvailability.push(currentNativeRow.product);
                                        }
                                    });

                                    ProductAvailabilityService.getAvailabilityForProducts({
                                        product  : {$in: productIdsForAvailability},
                                        warehouse: ObjectId(warehouse)
                                    }, {dbName: db}, function (err, productsAvailability) {
                                        if (err) {
                                            return eCb(err);
                                        }

                                        if (!productsAvailability || !productsAvailability.length) {
                                            return callback();
                                        }

                                        goodsOutNotesLines.forEach(function (item) {
                                            var currentAvailability = _.findWhere(productsAvailability, {_id: item.product});

                                            if (!currentAvailability || currentAvailability.onHand < item.quantity) {
                                                needGoodsOutNote = false;
                                            }
                                        });

                                        if (!needGoodsOutNote) {
                                            return callback();
                                        }

                                        goodsOutNoteObj = {
                                            order    : createdOrder._id,
                                            createdBy: {
                                                user: uId,
                                                date: date
                                            },
                                            updatedBy: {
                                                user: uId,
                                                date: date
                                            },

                                            orderRows     : goodsOutNotesLines,
                                            warehouse     : warehouse,
                                            location      : location,
                                            dbName        : db,
                                            status        : statusObj,
                                            shippingMethod: shippingMethod,
                                            name          : createdOrder.name,
                                            channel       : channel,
                                            integrationId : fulfillment.id.toString()
                                        };

                                        goodsOutNoteService.create(goodsOutNoteObj, function (err, result) {
                                            if (err) {
                                                return eCb(err);
                                            }

                                            if (!result) {
                                                return eCb();
                                            }

                                            AvailabilityHelper.updateAvailableProducts({
                                                dbName: db,
                                                doc   : result.toJSON()
                                            }, function (err, rows) {
                                                if (err) {
                                                    return eCb(err);
                                                }

                                                goodsOutNoteService.findByIdAndUpdate({orderRows: rows}, {
                                                    new   : true,
                                                    dbName: db,
                                                    id    : result._id
                                                }, function (err, result) {
                                                    if (err) {
                                                        return eCb(err);
                                                    }

                                                    if (!statusObj.shipped) {
                                                        return eCb();
                                                    }

                                                    AvailabilityHelper.deliverProducts({
                                                        dbName      : db,
                                                        uId         : uId,
                                                        goodsOutNote: result.toJSON()
                                                    }, function (err) {

                                                        if (err) {
                                                            return eCb(err);
                                                        }

                                                        event.emit('recalculateStatus', db, createdOrder._id, eCb);

                                                        eCb();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        callback();
                    });
                });
        }

        function createShippingLine(shopifyOrder, resultOpts, callback) {
            var order = resultOpts.order;
            var shippingRowData;
            var shopifyShippings;
            var price;

            if (!shopifyOrder.shipping_lines || !shopifyOrder.shipping_lines.length) {
                return callback();
            }

            shopifyShippings = shopifyOrder.shipping_lines[0];

            price = parseFloat(shopifyShippings.price) * 100;
            shippingRowData = {
                order      : order._id,
                quantity   : 1,
                description: shopifyShippings.title,
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
                    if (!shopifyShippings.tax_lines || !shopifyShippings.tax_lines.length) {
                        return wCb();
                    }

                    createTaxes(shopifyShippings.tax_lines, function (err, resultTaxes) {
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

        function createRefunds(shopifyOrder, resultOpts, callback) {
            var refundsUrl = baseUrl + '/admin/orders/' + shopifyOrder.id + '/refunds.json';
            var order = resultOpts.order;
            var shopifyRefunds;

            requestHelper.getData(refundsUrl, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, resultRefunds) {
                if (err) {
                    return callback(err);
                }

                if (!resultRefunds || !resultRefunds.body || !resultRefunds.body.refunds || !resultRefunds.body.refunds.length) {
                    return callback();
                }

                function createProductsReturn(shopifyRefundId, shopifyRefundLineItems, callback) {
                    var orderRowArray = [];
                    var options;

                    OrderRowsService.find({order: order._id}, {dbName: db})
                        .lean()
                        .exec(function (err, resultOrderRows) {
                            if (err) {
                                return callback(err);
                            }

                            shopifyRefundLineItems.forEach(function (lineItem) {
                                var currentLineItem = _.findWhere(resultOrderRows, {integrationId: lineItem.line_item.id.toString()});
                                var lineObj;

                                if (currentLineItem) {
                                    lineObj = {
                                        product : currentLineItem.product,
                                        quantity: lineItem.quantity,
                                        _id     : currentLineItem._id
                                    };

                                    orderRowArray.push(lineObj);
                                }
                            });

                            options = {
                                orderId      : order._id,
                                orderRowArray: orderRowArray,
                                warehouse    : warehouse,
                                db           : db
                            };

                            refundsHelper.getOldestGoodsOutNotes(options, function (err, data) {
                                var options;

                                if (err) {
                                    return callback(err);
                                }

                                if (!data) {
                                    return callback();
                                }

                                data.integrationId = shopifyRefundId.toString();
                                data.channel = channel;

                                options = {
                                    data  : data,
                                    user  : uId,
                                    dbName: db
                                };

                                goodsOutNoteService.findOne({
                                    channel      : channel,
                                    integrationId: shopifyRefundId.toString()
                                }, {dbName: db}, function (err, resultRefund) {
                                    if (err) {
                                        return callback(err);
                                    }

                                    if (resultRefund) {
                                        return callback();
                                    }

                                    refundsHelper.createProductReturn(options, function (err) {
                                        if (err) {
                                            return callback(err);
                                        }

                                        event.emit('recalculateStatus', db, order._id, callback);

                                        callback();
                                    });
                                });
                            });
                        });
                }

                function createPaymentsReturn(shopifyTransactions, callback) {
                    async.eachLimit(shopifyTransactions, 1, function (transaction, eCb) {
                        var parentPayment = transaction.parent_id;
                        var shopifyTransactionId = transaction.id;

                        paymentService.findOne({
                            integrationId: shopifyTransactionId.toString(),
                            channel      : channel
                        }, {dbName: db}, function (err, resultRefund) {
                            if (err) {
                                return callback(err);
                            }

                            if (resultRefund) {
                                return callback();
                            }

                            paymentService.findOne({
                                integrationId: parentPayment.toString(),
                                channel      : channel
                            }, {dbName: db})
                                .lean()
                                .exec(function (err, resultPayment) {
                                    var refundObj;
                                    var error;

                                    if (err) {
                                        return eCb(err);
                                    }

                                    if (!resultPayment) {
                                        error = new Error('Not found parent payment');
                                        error.status = 400;

                                        return eCb(err);
                                    }

                                    refundObj = {
                                        supplier     : resultPayment.supplier,
                                        bankExpenses : resultPayment.bankExpenses,
                                        paidAmount   : parseFloat(transaction.amount),
                                        paymentMethod: resultPayment.paymentMethod,
                                        date         : new Date(transaction.created_at),
                                        paymentRef   : resultPayment.paymentRef,
                                        invoice      : resultPayment.invoice,
                                        forSale      : true,
                                        currency     : resultPayment.currency,
                                        bankAccount  : resultPayment.bankAccount,
                                        order        : resultPayment.order,
                                        refund       : true,
                                        channel      : channel,
                                        integrationId: shopifyTransactionId.toString()
                                    };

                                    refundsHelper.createPaymentReturn({
                                        data  : refundObj,
                                        user  : uId,
                                        dbName: db
                                    }, eCb);
                                });
                        });
                    }, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        callback();
                    });
                }

                shopifyRefunds = resultRefunds.body.refunds;

                async.eachLimit(shopifyRefunds, 1, function (refund, eCb) {
                    var parallelTasks = [];

                    if (refund.refund_line_items && refund.refund_line_items.length) {
                        parallelTasks.push(async.apply(createProductsReturn, refund.id, refund.refund_line_items))
                    }

                    if (refund.transactions && refund.transactions.length) {
                        parallelTasks.push(async.apply(createPaymentsReturn, refund.transactions));
                    }

                    async.parallel(parallelTasks, eCb);
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(err);
                });
            });
        }

        function getImportData(pCb) {
            requestHelper.getData(fullRoute, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, importData) {
                if (err) {
                    return pCb(err);
                }

                if (!importData || !importData.body || importData.body.errors) {
                    console.error(importData.body.errors);
                    return pCb();
                }

                pCb(null, importData);
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
            IntegrationService.findOne({user: uId}, {dbName: db, warehouseSettings: 1}, function (err, result) {
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
            var workflows;

            if (err) {
                return allCallback(err);
            }

            if (data) {
                importData = data.importData;
                nativeOrders = data.orders;
                customers = data.customers || [];
                warehouse = data.warehouse;
                workflows = data.workflows;
                unlinked = data.unlinked;
            }

            orderIds = _.pluck(nativeOrders, 'integrationId');

            for (var i = 0; i < workflows.length; i++) {
                workflowObj[workflows[i].status] = workflows[i]._id;
            }

            shopifyOrders = importData && importData.body && importData.body.orders;

            async.eachLimit(shopifyOrders, 1, function (shopifyOrder, eCb) {
                var orderDate = shopifyOrder.created_at || new Date();
                var shopifyCurrency;
                var orderBody;
                var customer;
                var currency;
                var rates;
                var base;

                orderBody = {
                    warehouse    : warehouse,
                    integrationId: shopifyOrder.id,

                    paymentInfo: {
                        taxes   : shopifyOrder.total_tax * 100 || 0,
                        unTaxed : shopifyOrder.subtotal_price * 100 || 0,
                        total   : shopifyOrder.total_price * 100 || 0,
                        discount: shopifyOrder.total_discounts * 100 || 0
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

                if (shopifyOrder.customer && shopifyOrder.customer.id) {
                    customer = customers.find(function (el) {
                        return el.integrationId === shopifyOrder.customer.id.toString();
                    });

                    orderBody.supplier = customer && customer._id;
                }

                ratesService.getById({dbName: db, id: orderDate}, function (err, ratesObject) {
                    rates = ratesObject ? ratesObject.rates : {};
                    base = ratesObject ? ratesObject.base : 'USD';
                    shopifyCurrency = shopifyOrder.currency || 'USD';

                    currency = {
                        _id : shopifyCurrency,
                        rate: ratesRetriever.getRate(rates, base, shopifyCurrency)
                    };

                    orderBody.currency = currency;

                    createOrUpdateOrder(orderBody, shopifyOrder, warehouse, function (err, orderOpts) {
                        if (err) {
                            return eCb(err);
                        }

                        async.series([
                            async.apply(createPaymentsForOrder, baseUrl, shopifyOrder, orderOpts),
                            async.apply(createShippingLine, shopifyOrder, orderOpts),
                            async.apply(createGoodsOutNotes, shopifyOrder, orderOpts),
                            async.apply(createRefunds, shopifyOrder, orderOpts)
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
        var dbName = opts.dbName;
        var uId = opts.userId;
        var channelName = opts.channelName;
        var channelId = opts._id;
        var error;

        if (!opts.baseUrl || !opts.token) {
            error = new Error('Invalid integration settings');
            error.status = 404;

            return callback(error);
        }

        // callback();

        async.series([
            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Shopify -> products is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            },

            function (sCb) {
                getCustomers(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Shopify -> customers is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            },

            function (sCb) {
                getSalesOrders(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Shopify -> salesOrders is imported for channel ', channelName, ' id = ', channelId);
                    sCb();
                });
            }
        ], function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);

            event.emit('getAllDone', {uId: uId, dbName: dbName});
            console.log('All imported for channel ', channelName, ' id = ', channelId);
        });
    }

    function syncChannel(opts, callback) {
        async.series([
            function (sCb) {
                exportsProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Shopify -> Product exported');
                    sCb();
                });
            },

            function (sCb) {
                exportInventory(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Shopify -> Inventory exported');
                    sCb();
                });
            },

            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Shopify -> Products imported');
                    sCb();
                });
            },

            function (sCb) {
                getCustomers(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Shopify -> Customers imported');
                    sCb();
                });
            },

            function (sCb) {
                getSalesOrders(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Shopify -> SalesOrders imported');
                    sCb();
                });
            }
        ], function (err) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    }

    function publishFulfillments(opts, callback) {
        var fulfillment = opts.fulfillment;
        var baseUrl = opts.baseUrl;
        var accessToken = opts.token;
        var orderId = opts.orderId;
        var fullCreateRoute = baseUrl + '/admin/orders/' + orderId + '/fulfillments.json';
        var orderRoute = baseUrl + '/admin/orders/' + orderId + '.json';
        var lineItems;
        var fulfillLineItems = [];
        var error;

        requestHelper.getData(orderRoute, {
            headers: {
                Authorization: accessToken
            }
        }, function (err, result) {
            var shopifyOrder;

            if (err) {
                return callback(err);
            }

            if (result.body && result.body.message) {
                error = new Error(result.body.message);
                error.status = 400;

                return callback(error);
            }

            shopifyOrder = result.body.order;

            lineItems = shopifyOrder.line_items;

            fulfillment.line_items.forEach(function (item) {
                var shopifyLineItemId = (_.findWhere(lineItems, {variant_id: item.variantId})).id;

                fulfillLineItems.push({
                    quantity: item.quantity,
                    id      : shopifyLineItemId
                });
            });

            fulfillment.line_items = fulfillLineItems;

            requestHelper.postData(fullCreateRoute, {fulfillment: fulfillment}, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, result) {
                var fullfilmentId;

                if (err) {
                    return callback(err);
                }

                fullfilmentId = result.id;

                callback(null, fullfilmentId);
            });
        });
    }

    function publishProduct(opts, callback) {
        var nativeProduct = opts.product;
        var settings = opts.settings;
        var productPrices = nativeProduct.productPrices;
        var price = (productPrices && productPrices.prices && productPrices.prices.length && productPrices.prices[0].price) || 0;
        var baseUrl = opts.baseUrl;
        var fullCreateRoute = baseUrl + settings.products.create;
        var putRoute = baseUrl + (settings.products && settings.products.put);
        var fullCreateVariantRoute = baseUrl + settings.products.createVariant;
        var accessToken = opts.token;
        var dbName = opts.dbName;
        var channel = opts._id;
        var optionsArray = nativeProduct.options.map(function (el) {
            return {name: el};
        });

        var shopifyProduct = {
            product: {
                title   : nativeProduct.name,
                variants: [{
                    sku    : nativeProduct.info.SKU,
                    price  : price,
                    weight : nativeProduct.inventory.weight,
                    option1: nativeProduct.values[0] || null,
                    option2: nativeProduct.values[1] || null,
                    option3: nativeProduct.values[2] || null
                }],

                options: optionsArray,

                body_html: nativeProduct.info.description
            }
        };

        var shopifyVariant = {
            variant: {
                option1: nativeProduct.values[0] || null,
                option2: nativeProduct.values[1] || null,
                option3: nativeProduct.values[2] || null,
                sku    : nativeProduct.info.SKU,
                price  : price
            }
        };

        async.waterfall([
            function (wCb) {
                if (!nativeProduct.productImages || !nativeProduct.productImages.length) {
                    return wCb();
                }

                publishImagesForProduct(nativeProduct.productImages, function (err, imagesArray) {
                    if (err) {
                        return wCb(err);
                    }

                    shopifyProduct.product.images = imagesArray;

                    wCb();
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

                ChannelLinksService.find({
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

                        channelLinksService.findOne({linkId: {$regex: new RegExp(prodId)}}, {dbName: dbName}, function (err, resultChannelLinks) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb(null, resultChannelLinks);
                        });
                    },

                    function (channelLinks, wCb) {
                        if (!wCb && typeof channelLinks === 'function') {
                            wCb = channelLinks;

                            return wCb();
                        }

                        productService.getProductsWithVariants({
                            query : {_id: channelLinks.product},
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

                        requestHelper.putData(putRoute + prodId + '.json', {
                            product: {
                                options : optionsArray,
                                variants: [{
                                    sku    : firstVariant.info.SKU,
                                    price  : price,
                                    weight : firstVariant.inventory.weight,
                                    option1: firstVariant.values[0] || null,
                                    option2: firstVariant.values[1] || null,
                                    option3: firstVariant.values[2] || null
                                }]
                            }
                        }, {
                            headers: {
                                Authorization: accessToken
                            }
                        }, function (err) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb();
                        });
                    },

                    function (wCb) {
                        requestHelper.postData(fullCreateVariantRoute + prodId + '/variants.json', shopifyVariant, {
                            headers: {
                                Authorization: accessToken
                            }
                        }, function (err, result) {
                            var shopifyId;
                            var variantId;
                            var productId;

                            if (err) {
                                return wCb(err);
                            }

                            productId = result && result.body && result.body.variant && result.body.variant.product_id;
                            variantId = result && result.body && result.body.variant && result.body.variant.id;
                            shopifyId = productId + '|' + variantId;

                            wCb(null, shopifyId);
                        });
                    }
                ], function (err, shopifyId) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, shopifyId);
                });
            }

            requestHelper.postData(fullCreateRoute, shopifyProduct, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, result) {
                var shopifyId;
                var variantId;
                var productId;

                if (err) {
                    return callback(err);
                }

                productId = result && result.body && result.body.product && result.body.product.id;
                variantId = result && result.body && result.body.product && result.body.product.variants[0].id;
                shopifyId = productId + '|' + variantId;

                callback(null, shopifyId);
            });
        });
    }

    function unpublishProduct(opts, callback) {
        var shopifyId = opts.productId;
        var settings = opts.settings;
        var baseUrl = opts.baseUrl;
        var accessToken = opts.token;
        var fullRemoveVariantRoute;
        var fullRemoveRoute;
        var splittedStr;
        var productId;
        var variantId;

        splittedStr = shopifyId.split('|');
        productId = splittedStr[0];
        variantId = splittedStr[1];

        fullRemoveRoute = baseUrl + settings.products.delete + productId + '.json';
        fullRemoveVariantRoute = baseUrl + settings.products.delete + productId + '/variants/' + variantId + '.json';

        requestHelper.removeData(fullRemoveVariantRoute, {}, {
            headers: {
                Authorization: accessToken
            }
        }, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (result && result.body && result.body.errors && result.body.errors === 'You cannot delete the last variant of a product.') {
                requestHelper.removeData(fullRemoveRoute, {}, {
                    headers: {
                        Authorization: accessToken
                    }
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback();
                });
            } else {
                callback();
            }
        });
    }

    return {
        getProducts        : getProducts,
        exportInventory    : exportInventory,
        exportsProducts    : exportsProducts,
        getCustomers       : getCustomers,
        getSalesOrders     : getSalesOrders,
        getAll             : getAll,
        syncChannel        : syncChannel,
        publishProduct     : publishProduct,
        unpublishProduct   : unpublishProduct,
        publishFulfillments: publishFulfillments
    };
}
