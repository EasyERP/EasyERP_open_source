var mongoose = require('mongoose');
var request = require('request');
var _ = require('lodash');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;
var requestHelper = require('../helpers/tracker');
var redisClient = require('../helpers/redisClient');
var CONSTANTS = require('../constants/mainConstants');
var imageHelper = require('../helpers/imageHelper');
var ratesRetriever = require('../helpers/ratesRetriever')();
var RefundsHelper = require('../helpers/refunds');
var SyncLogsHelper = require('../helpers/syncLogs');
var Uploader = require('../services/fileStorage/index');
var uploader = new Uploader();

module.exports = function (models, event) {
    var customerService = require('../services/customer')(models);
    var currencyService = require('../services/currency')(models);
    var productService = require('../services/products')(models);
    var productPriceService = require('../services/productPrice')(models);
    var productCategoryService = require('../services/category')(models);
    var AvailabilityService = require('../services/productAvailability')(models);
    var ConflictService = require('../services/conflict')(models);
    var WorkflowService = require('../services/workflow')(models);
    var IntegrationService = require('../services/integration')(models);
    var OrderService = require('../services/order')(models);
    var OrderRowsService = require('../services/orderRows')(models);
    var InvoiceService = require('../services/invoices')(models);
    var ChannelLinksService = require('../services/channelLinks')(models);
    var ImagesService = require('../services/images')(models);
    var ratesService = require('../services/rates')(models);
    var taxesService = require('../services/taxes')(models);
    var paymentMethodService = require('../services/paymentMethod')(models);
    var shippingMethodService = require('../services/shippingMethod')(models);
    var paymentService = require('../services/payments')(models);
    var journalEntryService = require('../services/journalEntry')(models);
    var goodsOutNoteService = require('../services/goodsOutNotes')(models);
    var AvailabilityHelper = require('../helpers/availability')(models);
    var ProductAvailabilityService = require('../services/productAvailability')(models);
    var imagesService = require('../services/images')(models);
    var organizationService = require('../services/organizationSetting')(models);
    var InvoiceHandler = require('../handlers/invoices');
    var invoiceHandler = new InvoiceHandler(models, event);
    var refundsHelper = new RefundsHelper(models);
    var syncLogsHelper = new SyncLogsHelper(models);

    var logs;

    function statusBuilder(status, workflowObj) {
        switch (status) {
            case 'canceled':
                return workflowObj.Cancelled;
            default :
                return workflowObj['In Progress'];
        }
    }

    function publishImageForProduct(productName, imagesArray, magentoMedia, callback) {
        var resultArray = [];
        var i = 0;

        if (!callback && typeof magentoMedia === 'function') {
            callback = magentoMedia;

            magentoMedia = [];
        }

        async.eachLimit(imagesArray, 1, function (image, eachCb) {
            var imageData;
            var imageObj;
            var currentImage;
            var mimeType = image.imageSrc.substr(image.imageSrc.lastIndexOf('.') + 1);

            imagesArray.reverse();

            if (image.channel) {
                currentImage = _.findWhere(magentoMedia, {id: parseInt(image.integrationId, 10)});

                if (currentImage) {
                    currentImage.position = i;

                    resultArray.push(currentImage);

                    i++;
                }

                return eachCb();
            }

            uploader.readImage(image.imageSrc, function (err, base64Data) {
                if (err) {
                    return eachCb(err);
                }

                imageObj = {
                    position  : i,
                    media_type: 'image',
                    disabled  : false,
                    label     : 'images',
                    content   : {
                        type               : 'image/' + mimeType,
                        name               : productName + '_' + i + '.' + mimeType,
                        base64_encoded_data: base64Data
                    }
                };

                resultArray.push(imageObj);

                i++;

                eachCb();
            });
        }, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, resultArray);
        });
    }

    function exportStatusBuilder(status) {
        switch (status) {
            case 'Done':
                return 'complete';
            case 'Canceled':
                return 'canceled';
            case 'In Progress':
                return 'processing';
            default :
                return 'pending';
        }
    }

    function mapMagentoProductToNative(magentoProduct, db, callback) {
        var customAttrs = magentoProduct.custom_attributes;
        var categoryExtIdsObj = _.find(customAttrs, {attribute_code: 'category_ids'});
        var categoryExtIds = (categoryExtIdsObj && categoryExtIdsObj.value) || [];
        var categoryNativeIds = [];

        productCategoryService.find({integrationId: {$in: categoryExtIds}}, {
            _id   : 1,
            dbName: db
        }, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (result && result.length) {
                categoryNativeIds = _.pluck(result, '_id');
            }

            callback(null, {
                magentoId: magentoProduct.id,
                name     : magentoProduct.name,

                info: {
                    productType: ObjectId(CONSTANTS.DEFAULT_PRODUCT_TYPE_ID),
                    categories : categoryNativeIds,
                    SKU        : magentoProduct.sku
                },

                qty  : magentoProduct.extension_attributes && magentoProduct.extension_attributes.stock_item && magentoProduct.extension_attributes.stock_item.qty,
                price: magentoProduct.price * 100
            });
        });
    }

    function createMatchDataForProducts(product, createOpts, categoryExtIds, cb) {
        var db = createOpts.dbName;
        var channel = createOpts.channel;
        var sameProduct;

        productService.findOne({'info.SKU': product.sku}, {dbName: db}, function (err, result) {
            if (err) {
                return cb(err);
            }

            if (!result) {
                return cb(null, false);
            }

            sameProduct = result;

            ChannelLinksService.findOne({
                linkId : product.id + '|' + product.sku,
                channel: channel
            }, {dbName: db}, function (err, result) {
                var unlinkedBody;

                if (err) {
                    return cb(err);
                }

                if (result && sameProduct) {
                    return cb(null, true);
                }

                if (!product.sku || !product.name) {
                    return async.waterfall([
                        function (wCb) {
                            ConflictService.findOne({
                                'fields.id'     : product.id,
                                entity          : 'Product',
                                type            : 'unlinked',
                                'fields.channel': ObjectId(channel)
                            }, {dbName: db}, function (err, result) {
                                if (err) {
                                    return wCb(err);
                                }

                                if (result) {
                                    return cb(null, true);
                                }

                                wCb();
                            });
                        },

                        function (wCb) {
                            if (!product.media_gallery_entries || !product.media_gallery_entries.length) {
                                return wCb(null, null);
                            }

                            var imageUrl = createOpts.baseUrl + '/pub/media/catalog/product' + product.media_gallery_entries[0].file;

                            imageHelper.get(imageUrl, function (err, base64Data) {
                                if (err) {
                                    return wCb(err);
                                }

                                wCb(null, base64Data);
                            });
                        },

                        function (base64Data, wCb) {
                            var categoryNativeIds;

                            if (!categoryExtIds || !categoryExtIds.length) {
                                categoryExtIds = [];
                                categoryNativeIds = ['564591f9624e48551dfe3b23'];
                            }

                            productCategoryService.find({
                                integrationId: {$in: categoryExtIds}
                            }, {
                                dbName: db,
                                _id   : 1
                            }, function (err, result) {
                                if (err) {
                                    return wCb(err);
                                }

                                if (result.length) {
                                    categoryNativeIds = _.pluck(result, '_id');
                                }

                                wCb(null, categoryNativeIds, base64Data);
                            });
                        }
                    ], function (err, categoryNativeIds, base64Data) {
                        var opts = {
                            action  : 'imports',
                            category: 'products'
                        };

                        if (err) {
                            return cb(err);
                        }

                        unlinkedBody = {
                            id        : product.id,
                            channel   : ObjectId(channel),
                            name      : product.name,
                            sku       : product.sku,
                            nativeSKU : product.sku,
                            price     : product.price,
                            isValid   : false,
                            groupId   : product.groupId,
                            imgSrc    : base64Data,
                            categories: categoryNativeIds
                        };

                        ConflictService.create({
                            entity: 'Product',
                            type  : 'unlinked',
                            fields: unlinkedBody,
                            dbName: db
                        }, function (err) {
                            if (err) {
                                logs = syncLogsHelper.addError(logs, opts, {
                                    message : err.message,
                                    entityId: product.id
                                });

                                return cb(err);
                            }

                            logs = syncLogsHelper.addUnlink(logs, opts, {
                                entityDescription: product.name,
                                entityId         : product.id
                            });

                            cb(null, true);
                        });
                    });
                }

                mapMagentoProductToNative(product, db, function (err, resProduct) {
                    if (err) {
                        return cb(err);
                    }

                    resProduct.channel = ObjectId(channel);

                    ConflictService.findAndUpdate({
                        'fields.magentoId': resProduct.magentoId,
                        'fields.channel'  : ObjectId(channel)
                    }, {
                        entity: 'Product',
                        fields: resProduct
                    }, {
                        upsert: true,
                        dbName: db
                    }, function (err, result) {
                        if (err) {
                            logs = syncLogsHelper.addError(logs, {
                                action  : 'imports',
                                category: 'products'
                            }, {
                                entityId         : resProduct.magentoId,
                                entityDescription: resProduct.name,
                                message          : err.message
                            });

                            return cb(err);
                        }

                        if (result.__v && result.__v === 0) {
                            logs = syncLogsHelper.addConflict(logs, {
                                action  : 'imports',
                                category: 'products'
                            }, {
                                entityId         : resProduct.magentoId,
                                entityDescription: resProduct.name,
                                message          : 'Import ' + resProduct.magentoId + ' products is fail'
                            });
                        }

                        event.emit('showResolveConflict', {uId: createOpts.userId});

                        cb(null, true);
                    });
                });
            });
        });
    }

    function createProduct(createOpts, magentoProduct, callback) {
        var customAttrs = magentoProduct.custom_attributes;
        var categoryExtIdsObj = _.find(customAttrs, {attribute_code: 'category_ids'});
        var categoryExtIds = categoryExtIdsObj && categoryExtIdsObj.value;
        var descriptionObj = _.find(customAttrs, {attribute_code: 'description'});
        var description = (descriptionObj && descriptionObj.value && descriptionObj.value.replace(/<\/?[^>]+(>|$)/g, '')) || '';
        var dbName = createOpts.dbName;
        var channel = createOpts.channel;
        var priceList = createOpts.priceList;
        var baseUrl = createOpts.baseUrl;
        var logsOptions = {
            action  : 'imports',
            category: 'products'
        };

        async.waterfall([
            function (wCb) {
                createMatchDataForProducts(magentoProduct, createOpts, categoryExtIds, function (err, isProduct) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!isProduct) {
                        return wCb(null, true);
                    }

                    wCb(null, false);
                });
            },

            function (isCreate, wCb) {
                var query;
                var options = {
                    dbName: dbName,
                    _id   : 1
                };
                var categoryNativeIds;

                if (!isCreate) {
                    return wCb(null, null, false);
                }

                if (!categoryExtIds || !categoryExtIds.length) {
                    categoryNativeIds = [CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID];

                    return wCb(null, categoryNativeIds, true);
                }

                query = {integrationId: {$in: categoryExtIds}};
                productCategoryService.find(query, options, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    if (result.length) {
                        categoryNativeIds = _.pluck(result, '_id');
                    }

                    wCb(null, categoryNativeIds, true);
                });
            },

            function (categoryNativeIds, isCreate, wCb) {
                var imagesArray = [];
                var magentoImages;

                if (!isCreate || !magentoProduct.media_gallery_entries || !magentoProduct.media_gallery_entries.length) {
                    return wCb(null, null, categoryNativeIds, isCreate);
                }

                magentoImages = magentoProduct.media_gallery_entries;

                magentoImages.forEach(function (image) {
                    var magentoUrl;
                    var imageUrl;

                    if (image.media_type === 'image') {
                        magentoUrl = image.file;
                        imageUrl = baseUrl + '/pub/media/catalog/product' + magentoUrl;

                        imagesArray.push({
                            imageSrc     : imageUrl,
                            integrationId: image.id
                        });
                    }
                });

                wCb(null, imagesArray, categoryNativeIds, true);
            },

            function (imagesArray, categoryNativeIds, isCreate, wCb) {
                var productObj;
                var options = {
                    dbName: dbName
                };

                if (!isCreate) {
                    return wCb(null, null, null, null, false, false);
                }

                productObj = {
                    name: magentoProduct.name,
                    info: {
                        productType: ObjectId(CONSTANTS.DEFAULT_PRODUCT_TYPE_ID),
                        categories : categoryNativeIds,
                        SKU        : magentoProduct.sku,
                        description: description
                    },

                    inventory: {
                        weight: magentoProduct.weight
                    },

                    groupId: new ObjectId().toString()
                };

                options.body = productObj;

                productService.createProduct(options, function (err, product) {
                    if (err) {
                        logs = syncLogsHelper.addError(logs, logsOptions, {
                            message          : err.message,
                            entityDescription: magentoProduct.name,
                            entityId         : magentoProduct.id
                        });

                        return wCb(err);
                    }

                    logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                        entityId         : magentoProduct.id,
                        entityDescription: magentoProduct.name,
                        type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE
                    });

                    wCb(null, imagesArray, categoryNativeIds, product, false, true);
                });
            },

            function (imagesArray, categoryNativeIds, createdProduct, isUpdate, isCreate, wCb) {
                var counter = 0;
                var images;

                if (!isCreate) {
                    return wCb(null, null, null, null, null);
                }

                if (imagesArray && !Array.isArray(imagesArray)) {
                    imagesArray = [imagesArray];
                }

                images = imagesArray;

                if (!images || !images.length) {
                    return imagesService.create({
                        imageSrc: CONSTANTS.DEFAULT_IMAGE_URL,
                        product : createdProduct.groupId,
                        dbName  : dbName
                    }, function (err, createdImage) {
                        if (err) {
                            wCb(err);
                        }

                        productService.findOneAndUpdate({
                            _id: createdProduct._id
                        }, {
                            $set: {
                                imageSrc: createdImage._id
                            }
                        }, {
                            dbName: dbName
                        }, function (err) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb(null, categoryNativeIds, createdProduct, false, true);
                        });
                    });
                }

                async.eachLimit(images, 1, function (image, eCb) {
                    imagesService.create({
                        imageSrc     : image.imageSrc,
                        product      : createdProduct.groupId,
                        channel      : channel,
                        integrationId: image.integrationId,
                        dbName       : dbName
                    }, function (err, createdImage) {
                        if (err) {
                            return eCb(err);
                        }

                        if (counter !== images.length - 1) {
                            counter++;
                            return eCb();
                        }

                        productService.findOneAndUpdate({
                            _id: createdProduct._id
                        }, {
                            $set: {
                                imageSrc: createdImage._id
                            }
                        }, {
                            dbName: dbName
                        }, function (err) {
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

                    wCb(null, categoryNativeIds, createdProduct, false, true);
                });
            },

            function (categoryNativeIds, createdProduct, isUpdate, isCreate, wCb) {
                if (!isCreate) {
                    return wCb();
                }

                if (!categoryNativeIds || !categoryNativeIds.length) {
                    return wCb();
                }

                productCategoryService.findAndUpdate({_id: {$in: categoryNativeIds}}, {$inc: {productsCount: 1}}, {
                    multi : true,
                    dbName: dbName
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, isUpdate, createdProduct);
                });
            },

            function (isUpdate, createdProduct, wCb) {
                var channelLinksObj;

                if (typeof isUpdate === 'function') {
                    wCb = isUpdate;

                    return wCb();
                }

                channelLinksObj = {
                    product  : createdProduct,
                    linkId   : magentoProduct.id + '|' + magentoProduct.sku,
                    channel  : channel,
                    priceList: priceList,
                    dbName   : dbName
                };

                ChannelLinksService.create(channelLinksObj, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, isUpdate, createdProduct);
                });
            }
        ], function (err, isUpdate, createdProduct) {
            if (err) {
                return callback(err);
            }

            callback(null, isUpdate, createdProduct);
        });
    }

    function getSalesOrders(opts, allCallback) {
        var accessToken = 'Bearer ' + opts.token;
        var db = opts.dbName;
        var baseUrl = opts.baseUrl;
        var uId = opts.user;
        var dateOrderFrom = opts.ordersDate || new Date(0);
        var channel = opts._id || opts.channel;
        var settings = opts.settings;
        var route = settings.orders && settings.orders.get;
        var workflowObj = {};
        var magentoOrders;
        var fullRoute;
        var err;
        var unlinkedOrderId;
        var magentoIds;
        var unlinked;
        var paymentMethod;
        var warehouse;
        var location;
        var logsOptions;

        // set logs options for categories
        logsOptions = {
            action  : 'imports',
            category: 'orders'
        };

        if (!opts.token || !baseUrl || !route) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            // TODO: write critical error logs for categories
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: err.message});

            return allCallback(err);
        }

        warehouse = opts.warehouseSettings && opts.warehouseSettings.warehouse;
        location = opts.warehouseSettings && opts.warehouseSettings.location;

        fullRoute = baseUrl + route;

        console.log('fullRoute', fullRoute);
        console.log('accessToken', accessToken);
        //fullRoute = 'http://magento-test.easyerp.com/rest/V1/orders?searchCriteria[filter_groups][0][filters][0][field]=entity_id& searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq'

        function createOrUpdateOrder(orderBody, magentoOrder, warehouse, eCb) {
            var productMagentoIds = _.pluck(magentoOrder.items, 'product_id');
            var workflow = statusBuilder(magentoOrder.status || '', workflowObj);
            var linkIds = magentoOrder.items.map(function (el) {
                return el.product_id + '|' + el.sku;
            });
            var hasUnlinkedProducts;
            var products;
            var newOrder;

            productMagentoIds = productMagentoIds.map(function (id) {
                return id.toString();
            });

            function orderRowsBuilder(_order, products, callback) {
                var arrayRows = products.map(function (elem) {
                    var magentoId = elem.channelLinks.linkId.split('|')[0];
                    var object = magentoOrder.items.find(function (el) {
                        return el.product_id + '' === magentoId;
                    });
                    var orderRow;

                    orderRow = {
                        product      : elem._id,
                        warehouse    : warehouse,
                        order        : _order._id,
                        subTotal     : object.qty_ordered * object.price * 100,
                        quantity     : object.qty_ordered,
                        unitPrice    : object.price * 100,
                        channel      : ObjectId(channel),
                        SKU          : object.sku,
                        integrationId: object.item_id.toString(),
                        tax          : object.base_tax_amount * 100 || 0
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
                    var productSku = productRow.SKU;
                    var productUrl = '/rest/V1/products/' + productSku;
                    var taxClassIdObj;
                    var taxRulesUrl;
                    var taxClassId;

                    requestHelper.getData(baseUrl + productUrl, {
                        headers: {
                            Authorization: accessToken
                        }
                    }, function (err, resultProduct) {
                        var customAttributes;

                        if (err) {
                            return eCb(err);
                        }

                        customAttributes = resultProduct && resultProduct.body && resultProduct.body.custom_attributes;

                        taxClassIdObj = _.findWhere(customAttributes, {attribute_code: 'tax_class_id'});
                        if (!taxClassIdObj) {
                            return eCb();
                        }

                        taxClassId = taxClassIdObj.value;
                        taxRulesUrl = '/rest/V1/taxRules/search?searchCriteria[filter_groups][0][filters][0][field]=product_tax_class_ids& searchCriteria[filter_groups][0][filters][0][value]=' + taxClassId + '&searchCriteria[filter_groups][0][filters][0][condition_type]=eq';

                        requestHelper.getData(baseUrl + taxRulesUrl, {
                            headers: {
                                Authorization: accessToken
                            }
                        }, function (err, resultTaxRules) {
                            var taxRatesUrl;
                            var taxRates;
                            var items;

                            if (err) {
                                // TODO: write critical error logs
                                logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                    message: err.message
                                });

                                return eCb(err);
                            }

                            items = resultTaxRules && resultTaxRules.body && resultTaxRules.body.items;

                            if (!items || !items.length) {
                                return eCb();
                            }

                            taxRates = items[0].tax_rate_ids[0];

                            taxRatesUrl = baseUrl + '/rest/V1/taxRates/' + taxRates;

                            requestHelper.getData(taxRatesUrl, {
                                headers: {
                                    Authorization: accessToken
                                }
                            }, function (err, resultTaxRates) {
                                var taxes;

                                if (err) {
                                    // TODO: write critical error logs
                                    logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                        message: err.message
                                    });

                                    return eCb(err);
                                }

                                if (!resultTaxRates || !resultTaxRates.body) {
                                    return eCb();
                                }

                                taxes = {
                                    taxRate: [resultTaxRates.body],
                                    tax    : productRow.tax
                                };

                                createTaxes(taxes, function (err, resultTaxes) {
                                    if (err) {
                                        return eCb(err);
                                    }

                                    productRow.taxes = resultTaxes;

                                    eCb();
                                });
                            });
                        });
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

            }

            async.series([
                function (sCb) {
                    productService
                        .getProductsForOrder({
                            dbName : db,
                            channel: channel,
                            linkIds: linkIds || []
                        }, function (err, ourProducts) {
                            if (err) {
                                return sCb(err);
                            }

                            products = ourProducts;

                            if (magentoOrder.items.length !== products.length) {
                                orderBody.workflow = ObjectId(CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID);
                                orderBody.tempWorkflow = workflow;
                                hasUnlinkedProducts = true;

                                if (orderBody.conflictTypes && orderBody.conflictTypes.length) {
                                    orderBody.conflictTypes.push({type: 'product'});
                                } else {
                                    orderBody.conflictTypes = [{type: 'product'}];
                                }
                            }

                            sCb();
                        });
                },

                function (sCb) {
                    var payment = magentoOrder.payment;
                    var newPaymentMethod;
                    var method;

                    if (!payment.base_amount_paid) {
                        return sCb();
                    }

                    method = payment.method;

                    paymentMethodService.findOne({name: method}, {dbName: db}, function (err, result) {
                        if (err) {
                            return sCb(err);
                        }

                        if (result) {
                            orderBody.paymentMethod = result._id;
                            paymentMethod = result;

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
                                name        : method,
                                account     : method,
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
                    var findResult = magentoIds.indexOf(magentoOrder.entity_id.toString());
                    var magentoOrderId = magentoOrder.entity_id && magentoOrder.entity_id.toString();

                    if ((magentoIds && magentoIds.length) && findResult >= 0) {

                        OrderService.findOneAndUpdate({
                            integrationId: magentoOrderId,
                            channel      : channel
                        }, {$set: orderBody}, {
                            dbName: db,
                            new   : true
                        }, function (err, newObject) {
                            if (err) {
                                // TODO: write error logs
                                logs = syncLogsHelper.addError(logs, logsOptions, {
                                    message: err.message
                                });

                                return sCb(err);
                            }

                            if (!newObject) {
                                return sCb();
                            }

                            if (orderBody.conflictTypes && orderBody.conflictTypes.length) {
                                logs = syncLogsHelper.addUnlink(logs, logsOptions, {
                                    entityId: magentoOrderId,
                                    message : 'Order ' + magentoOrderId + ' is updated',
                                    type    : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                                });
                            } else {
                                // TODO: write success logs
                                logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                    entityId: magentoOrderId,
                                    message : 'Order ' + magentoOrderId + ' is updated',
                                    type    : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                                });
                            }

                            unlinkedOrderId = newObject._id;

                            newOrder = newObject;

                            OrderRowsService.find({$and: [{order: newObject._id}, {product: {$ne: null}}]}, {dbName: db}, function (err, resultRows) {
                                var error;

                                if (err) {
                                    return sCb(err);
                                }

                                OrderRowsService.remove({order: newObject._id, dbName: db}, function (err) {
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

                        if (uId) {
                            orderBody.createdBy = {};
                            orderBody.createdBy.user = uId;
                        }

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

                                return eCb(err);

                            }

                            if (orderBody.conflictTypes && orderBody.conflictTypes.length) {
                                logs = syncLogsHelper.addUnlink(logs, logsOptions, {
                                    entityId: magentoOrderId,
                                    message : 'Order ' + magentoOrderId + ' is created',
                                    type    : CONSTANTS.SYNC_LOGS.TYPE.CREATE
                                });
                            } else {
                                logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                    entityId: magentoOrderId,
                                    message : 'Order ' + magentoOrderId + ' is created',
                                    type    : CONSTANTS.SYNC_LOGS.TYPE.CREATE
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

                    if (!hasUnlinkedProducts || !unlinkedOrderId) {
                        return sCb();
                    }

                    nativeIds = _.pluck(products, 'channelLinks.linkId');
                    nativeIds = nativeIds.map(function (nativeId) {
                        if (nativeId) {
                            return parseInt(nativeId.split('|')[0], 10);
                        }
                    });

                    differenceProductIds = _.difference(productMagentoIds, _.compact(nativeIds));

                    async.each(differenceProductIds, function (product, intCb) {
                        var unlinkedOrderRow;
                        var fields = magentoOrder.items.find(function (theirProduct) {
                            return theirProduct.product_id + '' === product;
                        });
                        var data = {
                            id      : fields.product_id,
                            price   : fields.price * 100,
                            sku     : fields.sku,
                            name    : fields.name,
                            channel : ObjectId(channel),
                            hasOrder: true
                        };
                        var orderRowData = {
                            quantity: fields.qty_ordered,
                            order   : unlinkedOrderId
                        };

                        if (unlinkedIds.indexOf(fields.product_id) > -1) {
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
                                    'fields.id': fields.product_id
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
                                            entityId         : product.id,
                                            entityDescription: product.name
                                        });

                                        return wCb(err);
                                    }

                                    if (isCreated) {
                                        logs = syncLogsHelper.addUnlink(logs, logsOptions, {
                                            entityId         : product.id,
                                            entityDescription: product.name
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

        function createTaxes(taxes, callback) {
            var outTaxes = [];
            var taxAmount = taxes.tax;
            var lineTaxe = taxes.taxRate;

            async.each(lineTaxe, function (tax, eCb) {
                var query = {
                    name: tax.code,
                    rate: (tax.rate / 100).toFixed(4)
                };
                var outTaxObj;

                taxesService.findOne(query, {dbName: db}, function (err, resultTax) {
                    var newTaxObj;

                    if (err) {
                        return callback(err);
                    }

                    if (resultTax) {
                        outTaxObj = {
                            taxCode: resultTax._id,
                            tax    : taxAmount
                        };

                        outTaxes.push(outTaxObj);

                        return eCb();
                    }

                    newTaxObj = {
                        name    : tax.code,
                        rate    : (tax.rate / 100).toFixed(4),
                        code    : tax.code,
                        fullName: tax.code + tax.rate,
                        dbName  : db
                    };

                    taxesService.create(newTaxObj, function (err, result) {
                        if (err) {
                            return eCb(err);
                        }

                        outTaxObj = {
                            taxCode: result._id,
                            tax    : taxAmount
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

        function createPaymentsForOrder(baseUrl, magentoOrder, resultOpts, callback) {
            var url = baseUrl + '/rest/V1/invoices?searchCriteria[filter_groups][0][filters][0][field]=order_id& searchCriteria[filter_groups][0][filters][0][value]=' + magentoOrder.entity_id + '& searchCriteria[filter_groups][0][filters][0][condition_type]=eq';
            var orderBody = (resultOpts.order && resultOpts.order.toJSON()) || {};
            var magentoPayment = magentoOrder.payment;
            var paymentDate;
            var paymentObj;

            if (!orderBody.paymentMethod) {
                return callback();
            }

            if (!magentoPayment.amount_paid) {
                return callback();
            }

            requestHelper.getData(url, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, resultInvoices) {
                var currentInvoice;
                var query = {
                    channel      : ObjectId(channel),
                    integrationId: 'payment_' + magentoPayment.entity_id
                };

                if (err) {
                    return callback(err);
                }

                currentInvoice = resultInvoices.body && resultInvoices.body.items && resultInvoices.body.items.length && resultInvoices.body.items[0];

                if (!currentInvoice) {
                    return callback();
                }

                paymentDate = new Date(currentInvoice.created_at);

                paymentObj = {
                    paidAmount   : magentoPayment.amount_paid,
                    currency     : orderBody.currency,
                    date         : paymentDate,
                    paymentMethod: paymentMethod,
                    supplier     : orderBody.supplier,
                    order        : orderBody._id,
                    channel      : channel,
                    integrationId: 'payment_' + magentoPayment.entity_id,
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

                        paymentService.create(paymentObj, function (err, payment) {
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
                    }
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

        function createShippingLine(magentoOrder, resultOpts, callback) {
            var order = resultOpts.order;
            var shippingTotalInfo;
            var magentoShippings;
            var shippingRowData;

            if (!magentoOrder.extension_attributes || !magentoOrder.extension_attributes.shipping_assignments || !magentoOrder.extension_attributes.shipping_assignments.length) {
                return callback();
            }

            magentoShippings = magentoOrder.extension_attributes.shipping_assignments[0];
            shippingTotalInfo = magentoShippings.shipping && magentoShippings.shipping.total;

            if (!order) {
                return callback();
            }

            shippingRowData = {
                order      : order._id,
                quantity   : 1,
                description: (magentoShippings.shipping && magentoShippings.shipping.method) || 'Shipment',
                unitPrice  : parseFloat(shippingTotalInfo.base_shipping_amount) * 100,
                costPrice  : parseFloat(shippingTotalInfo.base_shipping_invoiced) * 100 || 0,
                subTotal   : (parseFloat(shippingTotalInfo.base_shipping_incl_tax) * 100 || 0) - (parseFloat(shippingTotalInfo.base_shipping_tax_amount) * 100 || 0),
                dbName     : db
            };
            organizationService.getDefaultShippingAccount({dbName: db}, function (err, defaultShipAccount) {
                var shippingExpensesObj;
                var error;

                if (err) {
                    return callback(err);
                }

                if (!defaultShipAccount) {
                    error = new Error('Default shipping account not found');
                    error.status = 404;

                    return callback(error);
                }

                shippingRowData.creditAccount = defaultShipAccount;

                shippingExpensesObj = {
                    amount: parseFloat(shippingTotalInfo.base_shipping_invoiced) * 100 || 0,
                    accoun: defaultShipAccount
                };

                OrderService.findByIdAndUpdate(order._id, {
                    $set: {
                        shippingExpenses: shippingExpensesObj
                    }
                }, {dbName: db}, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    OrderRowsService.create(shippingRowData, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        callback();
                    });
                });
            });
        }

        function createGoodsOutNotes(baseUrl, magentoOrder, resultOpts, callback) {
            var magentoOrderId = magentoOrder.entity_id;
            var createdOrder = resultOpts.order;
            var productIdsForAvailability = [];
            var needGoodsOutNote = true;
            var fulfillmentLines;
            var goodsOutNoteObj;
            var statusObj;
            var date;
            var fulfillments;
            var shipmentUrl = baseUrl + '/rest/V1/shipments?searchCriteria[filter_groups][0][filters][0][field]=order_id& searchCriteria[filter_groups][0][filters][0][value]=' + magentoOrderId + '& searchCriteria[filter_groups][0][filters][0][condition_type]=eq';
            var magentoShippings = magentoOrder.extension_attributes.shipping_assignments[0];
            var shipmentMethod = magentoShippings.shipping && magentoShippings.shipping.method;

            if (!createdOrder) {
                return callback();
            }

            requestHelper.getData(shipmentUrl, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, resultShipments) {
                if (err) {
                    return callback(err);
                }

                if (!resultShipments || !resultShipments.body) {
                    return callback();
                }

                fulfillments = resultShipments.body.items;

                goodsOutNoteService.find({channel: ObjectId(channel)}, {dbName: db})
                    .lean()
                    .exec(function (err, resultNotes) {
                        if (err) {
                            return callback(err);
                        }

                        async.eachLimit(fulfillments, 1, function (fulfillment, eCb) {
                            var currentFulFillment;

                            fulfillmentLines = fulfillment.items;
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

                            currentFulFillment = _.findWhere(resultNotes, {integrationId: fulfillment.entity_id.toString()});

                            if (currentFulFillment) {
                                return callback();
                            }

                            OrderRowsService.find({$and: [{order: createdOrder._id}, {product: {$ne: null}}]}, {dbName: db}, function (err, resultRows) {
                                if (err) {
                                    return callback(err);
                                }

                                if (!resultRows || !resultRows.length) {
                                    return callback();
                                }

                                findOrCreateShippingMethod(shipmentMethod, function (err, shippingMethod) {
                                    var goodsOutNotesLines = [];

                                    if (err) {
                                        return eCb(err);
                                    }

                                    OrderService.findByIdAndUpdate(createdOrder._id, {$set: {shippingMethod: shippingMethod}}, {dbName: db}, function (err) {
                                        if (err) {
                                            return eCb(err);
                                        }

                                        fulfillmentLines.forEach(function (lineItem) {
                                            var currentNativeRow;
                                            var rowObj;

                                            if (lineItem.order_item_id) {

                                                currentNativeRow = _.findWhere(resultRows, {integrationId: lineItem.order_item_id.toString()});

                                                if (currentNativeRow) {

                                                    rowObj = {
                                                        orderRowId: currentNativeRow._id,
                                                        product   : currentNativeRow.product,
                                                        cost      : 0,
                                                        quantity  : lineItem.qty
                                                    };

                                                    goodsOutNotesLines.push(rowObj);

                                                    productIdsForAvailability.push(currentNativeRow.product);
                                                }
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
                                                integrationId : fulfillment.entity_id.toString()
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
            });
        }

        function createRefunds(magentoOrder, resultOpts, callback) {
            var refundUrl = baseUrl + '/rest/V1/creditmemos?searchCriteria[filter_groups][0][filters][0][field]=order_id& searchCriteria[filter_groups][0][filters][0][value]=' + magentoOrder.entity_id + '&searchCriteria[filter_groups][0][filters][0][condition_type]=eq'
            var order = resultOpts.order;
            var parentPaymentId = magentoOrder.payment && magentoOrder.payment.entity_id;
            var magentoRefunds;

            if (!order) {
                return callback();
            }

            requestHelper.getData(refundUrl, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, resultRefunds) {
                if (err) {
                    return callback(err);
                }

                if (!resultRefunds || !resultRefunds.body || !resultRefunds.body.items || !resultRefunds.body.items.length) {
                    return callback();
                }

                function createProductsReturn(magentoRefundId, magentoRefundLineItems, callback) {
                    var orderRowArray = [];
                    var options;

                    OrderRowsService.find({order: order._id}, {dbName: db})
                        .lean()
                        .exec(function (err, resultOrderRows) {
                            if (err) {
                                return callback(err);
                            }

                            magentoRefundLineItems.forEach(function (lineItem) {
                                var currentLineItem = _.findWhere(resultOrderRows, {integrationId: lineItem.order_item_id.toString()});
                                var lineObj;

                                if (currentLineItem) {
                                    lineObj = {
                                        product : currentLineItem.product,
                                        quantity: lineItem.qty,
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

                                data.integrationId = magentoRefundId.toString();
                                data.channel = channel;

                                options = {
                                    data  : data,
                                    user  : uId,
                                    dbName: db
                                };

                                goodsOutNoteService.findOne({
                                    channel      : channel,
                                    integrationId: magentoRefundId.toString()
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

                function createPaymentsReturn(magentoRefund, callback) {
                    var magentoTransactionId = magentoRefund.entity_id;

                    paymentService.findOne({
                        integrationId: 'refund_' + magentoTransactionId.toString(),
                        channel      : channel
                    }, {dbName: db}, function (err, resultRefund) {
                        if (err) {
                            return callback(err);
                        }

                        if (resultRefund) {
                            return callback();
                        }

                        paymentService.findOne({
                            integrationId: 'payment_' + parentPaymentId.toString(),
                            channel      : channel
                        }, {dbName: db})
                            .lean()
                            .exec(function (err, resultPayment) {
                                var refundObj;
                                var error;

                                if (err) {
                                    return callback(err);
                                }

                                if (!resultPayment) {
                                    error = new Error('Not found parent payment');
                                    error.status = 400;

                                    return callback(err);
                                }

                                refundObj = {
                                    supplier     : resultPayment.supplier,
                                    bankExpenses : resultPayment.bankExpenses,
                                    paidAmount   : parseFloat(magentoRefund.base_grand_total),
                                    paymentMethod: resultPayment.paymentMethod,
                                    date         : new Date(magentoRefund.created_at),
                                    paymentRef   : resultPayment.paymentRef,
                                    invoice      : resultPayment.invoice,
                                    forSale      : true,
                                    currency     : resultPayment.currency,
                                    bankAccount  : resultPayment.bankAccount,
                                    order        : resultPayment.order,
                                    refund       : true,
                                    channel      : channel,
                                    integrationId: 'refund_' + magentoTransactionId
                                };

                                refundsHelper.createPaymentReturn({
                                    data  : refundObj,
                                    user  : uId,
                                    dbName: db
                                }, callback);
                            });
                    });
                }

                magentoRefunds = resultRefunds.body.items;

                async.eachLimit(magentoRefunds, 1, function (refund, eCb) {
                    var parallelTasks = [];

                    if (!refund.items || !refund.items.length) {
                        return eCb();
                    }

                    parallelTasks.push(async.apply(createProductsReturn, refund.entity_id, refund.items), async.apply(createPaymentsReturn, refund));

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
                    // TODO: write critical error logs for invoice
                    logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                        message: err.message
                    });

                    return pCb(err);
                }

                if (importData.body && importData.body.message) {
                    console.error(importData.body.message);
                    return pCb();
                }

                pCb(null, importData);
            });
        }

        function getOrders(pCb) {
            OrderService.find({integrationId: {$exists: true}, channel: channel}, {
                dbName       : db,
                integrationId: 1,
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
            customerService.find({integrationId: {$exists: true}, channel: channel}, {
                integrationId: 1,
                channel      : 1,
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
            warehouse : getWarehouse,
            workflows : getWorkflows,
            unlinked  : getUnlinkedProducts
        }, function (err, data) {
            var i = 0;
            var importData;
            var customers;
            var warehouse;
            var workflows;
            var nativeOrders;

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

            magentoIds = _.pluck(nativeOrders, 'integrationId');

            for (i; i < workflows.length; i++) {
                workflowObj[workflows[i].status] = workflows[i]._id;
            }

            magentoOrders = importData && importData.body && importData.body.items;

            if (!magentoOrders || !magentoOrders.length) {
                return allCallback();
            }

            async.eachLimit(magentoOrders, 1, function (magentoOrder, eCb) {
                var orderDate = magentoOrder.created_at || new Date();
                var magentoCurrency;
                var orderBody;
                var customer;
                var currency;
                var rates;
                var base;

                if ((new Date(magentoOrder.created_at) < new Date(dateOrderFrom))) {
                    return eCb();
                }

                orderBody = {
                    warehouse       : warehouse,
                    integrationId   : magentoOrder.entity_id,
                    shippingExpenses: {amount: magentoOrder.shipping_amount || 0},

                    paymentInfo: {
                        taxes   : magentoOrder.tax_amount * 100 || 0,
                        unTaxed : (magentoOrder.grand_total - magentoOrder.tax_amount) * 100 || 0,
                        total   : magentoOrder.grand_total * 100 || 0,
                        discount: magentoOrder.base_discount_amount * -100 || 0
                    },

                    editedBy: {user: uId || null},

                    channel  : channel,
                    createdBy: {
                        date: orderDate
                    },

                    orderDate   : orderDate,
                    creationDate: orderDate
                };

                if (magentoOrder.customer_id) {
                    customer = customers.find(function (el) {
                        return el.integrationId === magentoOrder.customer_id.toString();
                    });

                    orderBody.supplier = customer && customer._id;
                } else {
                    orderBody.supplier = CONSTANTS.DEFAULT_MAGENTO_CUSTOMER;
                }

                ratesService.getById({dbName: db, id: orderDate}, function (err, ratesObject) {
                    rates = ratesObject ? ratesObject.rates : {};
                    base = ratesObject ? ratesObject.base : 'USD';
                    magentoCurrency = magentoOrder.base_currency_code || 'USD';

                    currency = {
                        _id : magentoCurrency,
                        rate: ratesRetriever.getRate(rates, base, magentoCurrency)
                    };

                    orderBody.currency = currency;

                    createOrUpdateOrder(orderBody, magentoOrder, warehouse, function (err, orderOpts) {
                        if (err) {
                            return eCb(err);
                        }

                        async.series([
                            async.apply(createPaymentsForOrder, baseUrl, magentoOrder, orderOpts),
                            async.apply(createShippingLine, magentoOrder, orderOpts),
                            async.apply(createGoodsOutNotes, baseUrl, magentoOrder, orderOpts),
                            async.apply(createRefunds, magentoOrder, orderOpts)
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

    function getInvoices(opts, allCallback) {
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var channel = opts._id || opts.channel;
        var uId = opts.userId;
        var internalIds = [];
        var settings = opts.settings;
        var route = settings.invoices && settings.invoices.get;
        var fullRoute;
        var invoices;
        var err;
        var logsOptions;

        // TODO: set logs options for invoice
        logsOptions = {
            action  : 'imports',
            category: 'invoice'
        };

        if (!opts.token || !baseUrl || !route) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            // TODO: write critical error logs for invoice
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: err.message});

            return allCallback(err);
        }

        fullRoute = baseUrl + route;
        //fullRoute = 'http://magento-easyerp.test.thinkmobiles.com/rest/V1/invoices?searchCriteria[filter_groups][0][filters][0][field]=order_id& searchCriteria[filter_groups][0][filters][0][value]=145& searchCriteria[filter_groups][0][filters][0][condition_type]=eq';

        requestHelper.getData(fullRoute, {
            headers: {
                Authorization: accessToken
            }
        }, function (err, result) {
            var newInvoice = {};

            if (err) {
                // TODO: write critical error logs for invoice
                logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                    message: err.message
                });

                return allCallback(err);
            }

            if (result.body && result.body.message) {
                // TODO: write error logs for invoice
                logs = syncLogsHelper.addError(logs, logsOptions, {
                    message: result.body.message
                });

                return allCallback(null);
            }

            invoices = result.body && result.body.items;

            if (!invoices || !invoices.length) {
                return allCallback();
            }

            InvoiceService.find({channel: channel}, {dbName: db}, function (err, result) {
                internalIds = result && _.pluck(result, 'integrationId');

                async.eachLimit(invoices, 1, function (invoice, eachCb) {
                    async.parallel({

                        order: function (pCb) {

                            OrderService.findOne({integrationId: invoice.order_id}, {
                                _id     : 1,
                                supplier: 1,
                                workflow: 1,
                                dbName  : db,
                                new     : true
                            }, function (err, result) {
                                if (err) {
                                    return pCb(err);
                                }
                                if (result) {
                                    return pCb(null, result);
                                }

                                pCb();
                            });
                        },

                        currency: function (pCb) {
                            currencyService.findOne({name: invoice.global_currency_code}, {
                                _id   : 1,
                                dbName: db
                            }, function (err, result) {
                                if (err) {
                                    return pCb(err);
                                }
                                if (result) {
                                    return pCb(null, result);
                                }

                                pCb();
                            });
                        }
                    }, function (err, result) {
                        var order = result.order;
                        var currency = result.currency;
                        var invoiceDate = new Date(invoice.created_at);
                        var updateOrderObj = {
                            workflow: '55647b962e4aa3804a765ec6'
                        };

                        if (!result || !order || !currency) {
                            return eachCb();
                        }

                        if (err) {
                            return eachCb(err);
                        }

                        newInvoice = {
                            integrationId : invoice.entity_id,
                            supplier      : order.supplier,
                            sourceDocument: order._id,
                            currency      : {
                                _id: currency._id
                            },

                            paymentInfo: {
                                total   : invoice.base_grand_total * 100,
                                discount: invoice.discount_amount * 100,
                                taxes   : invoice.tax_amount * 100,
                                unTaxed : (invoice.base_grand_total - invoice.tax_amount) * 100

                            },

                            dbName   : db,
                            approved : true,
                            channel  : ObjectId(channel),
                            createdBy: {
                                user: uId,
                                date: invoiceDate
                            },

                            editedBy: {
                                user: uId,
                                date: invoiceDate
                            },

                            journal: '565ef6ba270f53d02ee71d65'
                        };

                        paymentService.find({order: order._id}, {dbName: db}, function (err, payments) {
                            var invoicePaidSum = 0;
                            var total = newInvoice.paymentInfo.total;
                            var balance;

                            if (err) {
                                return eachCb(err);
                            }

                            payments.forEach(function (paym) {
                                if (paym.refund) {
                                    invoicePaidSum -= paym.paidAmount;
                                } else {
                                    invoicePaidSum += paym.paidAmount;
                                }
                            });

                            balance = total - invoicePaidSum;

                            if (!balance) {
                                newInvoice.workflow = ObjectId('55647d982e4aa3804a765ecb');
                                newInvoice.paymentInfo.balance = 0;
                                newInvoice.paymentDate = invoiceDate;
                            } else {
                                newInvoice.workflow = balance === newInvoice.paymentInfo.total ? ObjectId('55647d932e4aa3804a765ec9') : ObjectId("55647d952e4aa3804a765eca");
                                newInvoice.paymentInfo.balance = balance;
                            }

                            if (internalIds.indexOf(invoice.entity_id.toString()) >= 0) {
                                delete newInvoice.dbName;

                                InvoiceService.findAndUpdate({integrationId: invoice.entity_id}, newInvoice, {dbName: db}, function (err) {
                                    if (err) {
                                        // TODO: write error logs for invoice
                                        logs = syncLogsHelper.addError(logs, logsOptions, {
                                            entityId: invoice.entity_id,
                                            message : err.message
                                        });

                                        return eachCb(err);
                                    }

                                    // TODO: write success logs for invoice
                                    logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                        entityId: invoice.entity_id,
                                        message : 'Invoice ' + invoice.entity_id + ' update',
                                        type    : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                                    });

                                    if (order.workflow.toString() === '55647b932e4aa3804a765ec9') {
                                        updateOrderObj = {
                                            tempWorkflow: '55647b962e4aa3804a765ec6'
                                        };

                                        delete updateOrderObj.workflow;
                                    }

                                    OrderService.findByIdAndUpdate(order._id, {$set: updateOrderObj}, {
                                        dbName: db,
                                        new   : true
                                    }, function (err) {
                                        if (err) {
                                            return eachCb(err);
                                        }

                                        paymentService.findAndUpdate({order: order._id}, {$set: {invoice: newInvoice._id}}, {
                                            dbName: db,
                                            multi : true
                                        }, eachCb);
                                    });
                                });
                            } else {
                                InvoiceService.create(newInvoice, function (err, newInvoice) {
                                    if (err) {
                                        // TODO: write error logs for invoice
                                        logs = syncLogsHelper.addError(logs, logsOptions, {
                                            entityId: invoice.entity_id,
                                            message : err.message
                                        });

                                        return eachCb(err);
                                    }

                                    // TODO: write success logs for invoice
                                    logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                        entityId: invoice.integrationId,
                                        message : 'Invoice ' + invoice.entity_id + ' create',
                                        type    : CONSTANTS.SYNC_LOGS.TYPE.CREATE
                                    });

                                    if (!newInvoice.approved) {
                                        if (order.workflow.toString() === '55647b932e4aa3804a765ec9') {
                                            updateOrderObj = {
                                                tempWorkflow: '55647b962e4aa3804a765ec6'
                                            };

                                            delete updateOrderObj.workflow;
                                        }

                                        return OrderService.findByIdAndUpdate(order._id, {$set: updateOrderObj}, {
                                            dbName: db,
                                            new   : true
                                        }, function (err) {
                                            if (err) {
                                                return eachCb(err);
                                            }

                                            paymentService.findAndUpdate({order: order._id}, {$set: {invoice: newInvoice._id}}, {
                                                dbName: db,
                                                multi : true
                                            }, eachCb);
                                        });
                                    }

                                    invoiceHandler.approveSyncedInvoice({
                                        dbName     : db,
                                        invoiceId  : newInvoice._id,
                                        invoiceDate: newInvoice.invoiceDate
                                    }, function (err, result) {
                                        if (err) {
                                            return eachCb(err);
                                        }

                                        if (order.workflow.toString() === '55647b932e4aa3804a765ec9') {
                                            updateOrderObj = {
                                                tempWorkflow: '55647b962e4aa3804a765ec6'
                                            };

                                            delete updateOrderObj.workflow;
                                        }

                                        OrderService.findByIdAndUpdate(order._id, {$set: updateOrderObj}, {
                                            dbName: db,
                                            new   : true
                                        }, function (err) {
                                            if (err) {
                                                return eachCb(err);
                                            }

                                            paymentService.findAndUpdate({order: order._id}, {$set: {invoice: newInvoice._id}}, {
                                                dbName: db,
                                                multi : true
                                            }, eachCb);
                                        });
                                    });
                                });
                            }

                        });
                    });
                }, function (err) {
                    if (err) {
                        return allCallback(err);
                    }

                    allCallback(null);
                });
            });

        });
    }

    function getCustomers(opts, allCallback) {
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var channel = opts._id || opts.channel;
        var settings = opts.settings;
        var route = settings.customers && settings.customers.get;
        var customers;
        var err;
        var fullRoute;
        var logsOptions;

        // TODO: set logs options for categories
        logsOptions = {
            action  : 'imports',
            category: 'customers'
        };

        if (!opts.token || !baseUrl || !route) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            // TODO: write critical error logs for categories
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: err.message});

            return allCallback(err);
        }

        fullRoute = baseUrl + route;

        requestHelper.getData(
            fullRoute,
            {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, result) {
                var newCustomer = {};

                if (err) {
                    // TODO: write critical error logs for categories
                    logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                        message: err.message
                    });

                    return allCallback(err);
                }

                if (result.body && result.body.message) {
                    console.error(result.body.message);
                    // TODO: write error logs for categories
                    logs = syncLogsHelper.addError(logs, logsOptions, {
                        message: result.body.message
                    });

                    return allCallback();
                }

                customers = result.body && result.body.items;

                if (!customers || !customers.length) {
                    return allCallback();
                }

                customerService.find({channel: channel}, {
                    integrationId: 1,
                    channel      : 1,
                    dbName       : db
                }, function (err, internalCustomers) {
                    var findResult;

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

                        if (customer.addresses || customer.addresses.length) {
                            customerAddr = customer.addresses[0] || {};
                            address = {
                                city   : customerAddr.city,
                                country: '',
                                state  : customerAddr.region && customerAddr.region.region,
                                zip    : customerAddr.postcode || '',
                                street : customerAddr.street && customerAddr.street.length && customerAddr.street[0] || ''
                            };
                        }

                        newCustomer = {
                            dbName       : db,
                            integrationId: customer.id,
                            address      : address,
                            dateBirth    : customer.dob && new Date(customer.dob),
                            email        : customer.email || '',
                            name         : {
                                first: customer.firstname || '',
                                last : customer.lastname || ''
                            },

                            phones: {
                                phone: customerAddr.telephone || ''
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
                                    // TODO: write error logs for categories
                                    logs = syncLogsHelper.addError(logs, logsOptions, {
                                        entityId         : customer.id,
                                        entityDescription: customer.name,
                                        message          : err.message
                                    });

                                    return eachCb(err);
                                }

                                // TODO: write success logs for categories
                                logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                    entityId         : customer.id,
                                    entityDescription: newCustomer.name.first + ' ' + newCustomer.name.last,
                                    message          : 'Customer ' + customer.id + ' updated',
                                    type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                                });

                                eachCb();
                            });
                        } else {
                            customerService.create(newCustomer, function (err) {
                                if (err) {
                                    // TODO: write error logs for categories
                                    logs = syncLogsHelper.addError(logs, logsOptions, {
                                        entityId         : newCustomer.id,
                                        entityDescription: newCustomer.name,
                                        message          : err.message
                                    });

                                    return eachCb(err);
                                }

                                // TODO: write success logs for categories
                                logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                    entityId         : newCustomer.id,
                                    entityDescription: newCustomer.name.first + ' ' + newCustomer.name.last,
                                    message          : 'Customer ' + newCustomer.id + ' created',
                                    type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE
                                });

                                eachCb();
                            });
                        }

                    }, function (err) {
                        if (err) {
                            return allCallback(err);
                        }

                        allCallback(null, customers);
                    });
                });

            });
    }

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

    function createPriceList(priceList, productId, magentoPrice, db, cb) {
        var newPriceList = {
            product: productId,

            prices    : [{
                count: 1,
                price: magentoPrice
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

    function getProducts(opts, allCallback) {
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var uId = opts.userId;
        var settings = opts.settings;
        var createOpts = {
            dbName   : db,
            userId   : uId,
            channel  : opts._id || opts.channel,
            priceList: opts.priceList,
            baseUrl  : opts.baseUrl
        };
        var priceList = opts.priceList;
        var getBySKURoute;
        var products;
        var skusArray;
        var err;
        var getRoute;
        var fullGetBySKURoute;
        var fullGetRoute;
        var logsOptions = {
            action  : 'imports',
            category: 'products'
        };

        if (settings.products) {
            getRoute = settings.products.get || null;
            getBySKURoute = settings.products.getBySKU || null;
        }

        if (!opts.token || !baseUrl || !getRoute || !getBySKURoute) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: err.message});

            return allCallback(err);
        }

        fullGetBySKURoute = baseUrl + getBySKURoute;
        fullGetRoute = baseUrl + getRoute;

        requestHelper.getData(fullGetRoute, {
            headers: {
                Authorization: accessToken
            }
        }, function (err, result) {
            if (err) {
                return allCallback(err);
            }

            if (result.body && result.body.message) {
                console.error(result.body.message);

                logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: result.body.message});

                return allCallback();
            }

            products = result.body && result.body.items;
            skusArray = _.pluck(products, 'sku');
            async.eachLimit(skusArray, 50, function (sku, eachCb) {
                requestHelper.getData(fullGetBySKURoute + sku,
                    {
                        headers: {
                            Authorization: accessToken
                        }
                    }, function (err, result) {
                        var magentoProduct;

                        if (err) {
                            logs = syncLogsHelper.addError(logs, logsOptions, {message: err.message});

                            return eachCb(err);
                        }

                        magentoProduct = result.body;

                        createProduct(createOpts, magentoProduct, function (err, isUpdate, createdProduct) {
                            if (err) {
                                logs = syncLogsHelper.addError(logs, logsOptions, {
                                    message : err.message,
                                    entityId: magentoProduct.id
                                });

                                return eachCb(err);
                            }

                            if (isUpdate || !createdProduct) {
                                return eachCb();
                            }

                            createPriceList(priceList, createdProduct, magentoProduct.price, db, eachCb);
                        });
                    });
            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback(null, products);
            });
        });
    }

    function getCategories(opts, allCallback) {
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var channel = opts._id || opts.channel;
        var settings = opts.settings;
        var route = settings.categories && settings.categories.get;
        var logsOptions;
        var fullRoute;
        var err;

        // set logs options for categories
        logsOptions = {
            action  : 'imports',
            category: 'categories'
        };

        if (!opts.token || !baseUrl || !route) {
            err = new Error('Invalid integration settings');
            err.status = 400;

            // write critical error logs for products
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: err.message});

            return allCallback(err);
        }

        fullRoute = baseUrl + route;

        function parseCategories(categoriesArray, result) {
            var categoriesObj = {
                integrationId: result.id,
                level        : result.level,
                parent       : result.parent_id,
                name         : result.name,
                is_active    : result.is_active,
                position     : result.position,
                product_count: result.product_count
            };

            categoriesArray.push(categoriesObj);

            if (result.children_data && result.children_data.length) {
                result.children_data.forEach(function (item) {
                    parseCategories(categoriesArray, item);
                });
            }

            return categoriesArray;
        }

        requestHelper.getData(fullRoute, {
            headers: {
                Authorization: accessToken
            }
        }, function (err, result) {
            var newItem = {};
            var categoriesArray = [];

            if (err) {
                // write critical error logs for categories
                logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                    message: err.message
                });

                return allCallback(err);
            }

            result = result.body;

            if (result && result.message) {
                console.error(result.message);

                // write error logs for categories
                logs = syncLogsHelper.addError(logs, logsOptions, {
                    message: result.message
                });

                return allCallback();
            }

            async.waterfall([
                function (wCb) {
                    productCategoryService.find({}, {dbName: db, integrationId: 1}, function (err, result) {
                        var categoryIds = [];

                        if (err) {
                            // write critical error logs for categories
                            logs = syncLogsHelper.addError(logs, logsOptions, {
                                message: err.message
                            });
                            return wCb(err);
                        }

                        if (result.length) {
                            categoryIds = _.pluck(result, 'integrationId');
                        }

                        wCb(null, categoryIds);
                    });
                },

                function (categoryIds, wCb) {
                    parseCategories(categoriesArray, result);

                    categoriesArray = _.sortBy(categoriesArray, 'level');

                    async.eachLimit(categoriesArray, 1, function (item, eCb) {

                        if (item.parent > 1) {
                            productCategoryService.findOne({integrationId: item.parent}, {
                                _id     : 1,
                                fullName: 1,
                                dbName  : db
                            }, function (err, result) {
                                if (err) {
                                    return eCb(err);
                                }

                                if (!result) {
                                    newItem = {
                                        bankExpensesAccount: null,
                                        creditAccount      : null,
                                        debitAccount       : null,
                                        fullName           : 'Default Category/' + item.name,
                                        name               : item.name,
                                        nestingLevel       : item.level,
                                        otherIncome        : null,
                                        otherLoss          : null,
                                        parent             : CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID,
                                        sequence           : 0,
                                        taxesAccount       : null,
                                        integrationId      : item.integrationId,
                                        dbName             : db
                                    };

                                } else {
                                    newItem = {
                                        bankExpensesAccount: null,
                                        creditAccount      : null,
                                        debitAccount       : null,
                                        fullName           : result.fullName + '/' + item.name,
                                        name               : item.name,
                                        nestingLevel       : item.level,
                                        otherIncome        : null,
                                        otherLoss          : null,
                                        parent             : result._id,
                                        sequence           : 0,
                                        taxesAccount       : null,
                                        integrationId      : item.integrationId,
                                        dbName             : db
                                    };
                                }

                                if (categoryIds.indexOf(item.integrationId.toString()) === -1) {
                                    productCategoryService.create(newItem, function (err) {
                                        if (err) {
                                            // write error logs for categories
                                            logs = syncLogsHelper.addError(logs, logsOptions, {
                                                entityId         : item.integrationId,
                                                entityDescription: newItem.name,
                                                message          : result.body.message
                                            });

                                            return eCb(err);
                                        }

                                        // write success logs for categories
                                        logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                            entityId         : item.integrationId,
                                            entityDescription: newItem.name,
                                            type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE
                                        });

                                        eCb();
                                    });
                                } else {
                                    productCategoryService.findAndUpdate({integrationId: item.integrationId}, newItem, {dbName: db}, function (err) {
                                        if (err) {
                                            // write error logs for categories
                                            logs = syncLogsHelper.addError(logs, logsOptions, {
                                                entityId         : item.integrationId,
                                                entityDescription: newItem.name,
                                                message          : result.body.message
                                            });

                                            return eCb(err);
                                        }

                                        // write success logs for categories
                                        logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                            entityId         : item.integrationId,
                                            entityDescription: newItem.name,
                                            type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                                        });

                                        eCb();
                                    });
                                }
                            });
                        } else {
                            newItem = {
                                bankExpensesAccount: null,
                                creditAccount      : null,
                                debitAccount       : null,
                                fullName           : item.name,
                                name               : item.name,
                                nestingLevel       : 0,
                                otherIncome        : null,
                                otherLoss          : null,
                                parent             : null,
                                sequence           : 0,
                                taxesAccount       : null,
                                integrationId      : item.integrationId,
                                dbName             : db
                            };

                            if (item && item.integrationId && categoryIds.indexOf(item.integrationId.toString()) === -1) {
                                productCategoryService.create(newItem, function (err) {
                                    if (err) {
                                        // write error logs for categories
                                        logs = syncLogsHelper.addError(logs, logsOptions, {
                                            entityId         : item.integrationId,
                                            entityDescription: newItem.name,
                                            message          : err.message
                                        });

                                        return eCb(err);
                                    }

                                    // write success logs for categories
                                    logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                        entityId         : item.integrationId,
                                        entityDescription: newItem.name,
                                        type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE
                                    });

                                    eCb();
                                });
                            } else {
                                productCategoryService.findAndUpdate({integrationId: item.integrationId}, newItem, {dbName: db}, function (err) {
                                    if (err) {
                                        // write error logs for categories
                                        logs = syncLogsHelper.addError(logs, logsOptions, {
                                            entityId         : item.integrationId,
                                            entityDescription: newItem.name,
                                            message          : err.message
                                        });

                                        return eCb(err);
                                    }

                                    // write success logs for categories
                                    logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                        entityId         : item.integrationId,
                                        entityDescription: newItem.name,
                                        type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                                    });

                                    eCb();
                                });
                            }
                        }

                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb();
                    });
                }
            ], function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback();
            });
        });
    }

    function exportCustomers(opts, allCallback) {
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var customers = opts.customers;
        var model = {};
        var settings = opts.settings;
        var route = settings.customers && settings.customers.put;
        var integrationId;
        var fullRoute;
        var error;

        if (!customers || !customers.length || !route) {
            error = new Error('Bad Request');
            error.status = 400;

            return allCallback(error);
        }

        fullRoute = baseUrl + route;

        customerService.find({_id: {$in: customers}}, {dbName: db}, function (err, customers) {
            if (!customers.length) {
                error = new Error('Customer is not found');
                error.status = 404;

                return allCallback(error);
            }

            async.eachLimit(customers, 1, function (customer, eCb) {
                model = {
                    customer: {
                        email    : customer.email || '',
                        firstname: customer.name.first || '',
                        lastname : customer.name.last || '',
                        addresses: [{
                            countryId: 'UA',
                            street   : [
                                customer.address.street || 'unknown'
                            ],
                            telephone: customer.phones.phone || 'unknown',
                            postcode : customer.address.zip || 'unknown',
                            city     : customer.address.city || 'unknown',
                            firstname: customer.name.first || '',
                            lastname : customer.name.last || ''
                        }]
                    }
                };

                if (customer.integrationId) {
                    model.customer.id = customer.integrationId;
                    model.customer.website_id = '0';
                    integrationId = customer.integrationId;
                }

                requestHelper.putData(
                    fullRoute + magentoId,
                    model,
                    {
                        headers: {
                            Authorization: accessToken
                        }
                    }, function (err, result) {
                        if (result && result.body && result.body.message) {
                            console.error(result.body.message);
                        }

                        eCb();
                    });
            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback();
            });
        });
    }

    function exportInventory(opts, allCallback) {
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var message = '';
        var settings = opts.settings;
        var route = settings.products && settings.products.create;
        var channel = opts._id || opts.channel;
        var logsOptions;
        var fullRoute;
        var error;

        // set logs options for categories
        logsOptions = {
            action  : 'exports',
            category: 'inventory'
        };

        if (!baseUrl || !accessToken || !route) {
            error = new Error('Bad Request');
            error.status = 400;

            // write critical error logs for products
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: error.message});

            return allCallback(error);
        }

        fullRoute = baseUrl + route;

        ChannelLinksService.find({channel: channel}, {dbName: db}, function (err, channelLinks) {
            if (!channelLinks || !channelLinks.length) {
                return allCallback();
            }

            async.each(channelLinks, function (channelLink, eachCb) {
                AvailabilityService.find({
                    query : {product: channelLink.product},
                    dbName: db
                }, function (err, availabilityProduct) {
                    var splittedLinkId = channelLink.linkId.split('|');
                    var sku = splittedLinkId[1];
                    var model;

                    if (err) {
                        return eachCb(err);
                    }

                    if (!availabilityProduct || !availabilityProduct.length) {
                        return eachCb();
                    }

                    availabilityProduct = availabilityProduct[0];

                    model = {
                        product: {
                            sku: sku
                        }
                    };

                    if (availabilityProduct.onHand !== undefined && availabilityProduct.onHand !== null) {
                        model.product.extension_attributes = {
                            stock_item: {
                                qty: availabilityProduct.onHand
                            }
                        };
                    }

                    requestHelper.postData(fullRoute, model, {
                        headers: {
                            Authorization: accessToken
                        }
                    }, function (err, result) {
                        if (err) {
                            // write critical error logs for categories
                            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                entityId: availabilityProduct._id,
                                message : err.message
                            });

                            return eachCb(err);
                        }

                        if (result && result.body && result.body.message) {
                            console.error(result.body.message);
                            message += result.body.message + '\n';

                            logs = syncLogsHelper.addError(logs, logsOptions, {
                                entityId: availabilityProduct._id,
                                message : result.body.message
                            });
                        }

                        if (result && result.body && result.body.product && result.body.product.id) {
                            message += result.body.product.id + ' ID is updated\n';

                            logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                entityId: availabilityProduct._id,
                                message : message,
                                type    : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                            });
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

    function exportProducts(opts, allCallback) {
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var productsIds = opts.products;
        var query = {};
        var settings = opts.settings;
        var route = settings.products && settings.products.create;
        var fullRoute;
        var error;
        var channel = opts._id || opts.channel;
        var channelLinks;
        var productPrices;
        var productObjectIds;
        var logsOptions;

        // set logs options for categories
        logsOptions = {
            action  : 'exports',
            category: 'products'
        };

        if (!baseUrl || !accessToken || !route) {
            error = new Error('Bad Request');
            error.status = 400;

            // write critical error logs for products
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: error.message});

            return allCallback(error);
        }

        fullRoute = baseUrl + route;

        if (productsIds && productsIds.length) {
            query._id = {
                $in: productsIds
            };
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
                productService.getProductsForSyncToChannel({
                    query             : {_id: {$in: productObjectIds}},
                    dbName            : db,
                    channel           : channel,
                    populateCategories: true
                }, function (err, products) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, products);
                });
            }
        ], function (err, products) {
            if (err) {
                // write critical error logs for categories
                logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: error.message});

                return allCallback(err);
            }

            if (!products.length) {
                return allCallback();
            }

            async.eachLimit(products, 1, function (product, eCb) {
                var channelLink = channelLinks.find(function (link) {
                    return link.product.toString() === product._id.toString() && link.channel.toString() === channel;
                });
                var model;
                var priceList;
                var price;
                var imageOpts;
                var magentoMediaUrl;

                priceList = channelLink.priceList;

                price = productPrices.find(function (el) {
                    return priceList && el.priceLists && el.priceLists.toString() === priceList.toString()
                        && el.product.toString() === product._id.toString();
                });

                model = {
                    product: {
                        sku              : product.info.SKU,
                        name             : product.name,
                        price            : price && price.prices.length && price.prices[0].price || 0,
                        attribute_set_id : 15,
                        custom_attributes: [{
                            attribute_code: 'category_ids',
                            value         : product.productCategories
                        }, {
                            attribute_code: 'description',
                            value         : product.info.description
                        }],

                        weight: product.inventory.weight || 0
                    }
                };

                if (!product.productImages || !product.productImages.length) {
                    requestHelper.postData(fullRoute, model, {
                        headers: {
                            Authorization: accessToken
                        }
                    }, function (err, result) {
                        if (err) {
                            // write critical error logs for categories
                            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                entityDescription: model.product.name,
                                message          : err.message
                            });

                            return eCb(err);
                        }

                        if (result && result.body && result.body.message) {
                            // write error logs for categories
                            logs = syncLogsHelper.addError(logs, logsOptions, {
                                entityDescription: model.product.name,
                                message          : result.body.message
                            });
                            console.error(result.body.message);

                            return eCb();
                        }

                        // write success logs for categories
                        logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                            entityDescription: model.product.name,
                            type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                        });

                        eCb();
                    });
                } else {

                    magentoMediaUrl = baseUrl + '/rest/V1/products/' + product.info.SKU + '/media';

                    requestHelper.getData(magentoMediaUrl, {
                        headers: {
                            Authorization: accessToken
                        }
                    }, function (err, resultMedia) {
                        var magentoMedia;

                        if (err) {
                            // write critical error logs for categories
                            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                entityDescription: model.product.name,
                                message          : err.message
                            });

                            return eCb(err);
                        }

                        magentoMedia = (resultMedia && resultMedia.body) || [];

                        publishImageForProduct(product.name, product.productImages, magentoMedia, function (err, resultData) {
                            if (err) {
                                return eCb(err);
                            }

                            model.product.media_gallery_entries = resultData;

                            requestHelper.postData(fullRoute, model, {
                                headers: {
                                    Authorization: accessToken
                                }
                            }, function (err, result) {
                                if (err) {
                                    // write critical error logs for categories
                                    logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                        entityDescription: model.product.name,
                                        message          : err.message
                                    });

                                    return eCb(err);
                                }

                                if (result && result.body && result.body.message) {
                                    // write error logs for categories
                                    logs = syncLogsHelper.addError(logs, logsOptions, {
                                        entityDescription: model.product.name,
                                        message          : result.body.message
                                    });
                                    console.error(result.body.message);
                                }

                                // write success logs for categories
                                logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                    entityDescription: model.product.name,
                                    message          : 'Export ' + model.product.name + ' product is success.',
                                    type             : CONSTANTS.SYNC_LOGS.TYPE.UPDATE
                                });

                                eCb();
                            });
                        });
                    });
                }
            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback();
            });

        });
    }

    function exportInvoices(opts, allCallback) {
        var invoices = opts.invoices;
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var channel = opts._id || opts.channel;
        var model = {};
        var settings = opts.settings;
        var route = settings.invoices && settings.invoices.create;
        var fullRoute;
        var error;

        if (!baseUrl || !accessToken || !route) {
            error = new Error('Bad Request');
            error.status = 400;

            return allCallback(error);
        }

        fullRoute = baseUrl + route;

        if (!invoices || !invoices.length) {
            return allCallback();
        }

        InvoiceService.find({_id: {$in: invoices}}, {dbName: db}, function (err, invoices) {

            if (!invoices) {
                return allCallback();
            }

            async.each(invoices, function (invoice, eCb) {
                if (invoice.sourceDocument) {
                    async.waterfall([
                        function (wCb) {
                            OrderService.findOne({_id: invoice.sourceDocument}, {
                                dbName       : db,
                                integrationId: 1
                            }, function (err, order) {
                                if (err) {
                                    return wCb(err);
                                }

                                if (!order) {
                                    return wCb();
                                }

                                wCb(null, {
                                    order: order
                                });
                            });
                        }, function (result, wCb) {
                            if (!result || !result.order) {
                                return wCb();
                            }

                            OrderRowsService.findOne({
                                order : invoice.sourceDocument,
                                dbName: db
                            }, function (err, orderRow) {
                                if (err) {
                                    return wCb(err);
                                }

                                if (!orderRow) {
                                    return wCb();
                                }

                                wCb(null, {
                                    order   : result.order,
                                    orderRow: orderRow
                                });
                            });
                        }, function (result, wCb) {
                            if (!result || !result.orderRow || !result.orderRow.product) {
                                return wCb();
                            }

                            /*productService.findOne({_id: result.orderRow.product}, {dbName: db}, function (err, product) {
                             if (err) {
                             return wCb(err, {});
                             }

                             if (!result.orderRow) {
                             return wCb();
                             }

                             wCb(null, {
                             order   : result.order,
                             orderRow: result.orderRow,
                             product : product
                             });
                             });*/

                            ChannelLinksService.findOne({
                                channel: channel,
                                product: result.orderRow.product
                            }, {dbName: db})
                                .lean()
                                .exec(function (err, links) {
                                    if (err) {
                                        return wCb(err);
                                    }

                                    if (!result.orderRow) {
                                        return wCb();
                                    }

                                    wCb(null, {
                                        order   : result.order,
                                        orderRow: result.orderRow,
                                        product : links && links.linkId || null
                                    });

                                    //wCb();
                                });
                        }
                    ], function (err, result) {
                        if (!result || !Object.keys(result)) {
                            result = {};
                        }

                        var product = result.product;
                        var order = result.order;
                        var orderRow = result.orderRow;

                        if (err) {
                            return eCb(err);
                        }

                        if (!order || !orderRow) {
                            return eCb();
                        }

                        model = {
                            entity: {
                                entity_id       : 0,
                                order_id        : order.integrationId,
                                increment_id    : invoice.name,
                                base_grand_total: invoice.paymentInfo.total,
                                base_subtotal   : orderRow.subTotal,
                                discount_amount : invoice.paymentInfo.discount,
                                grand_total     : invoice.paymentInfo.total,
                                subtotal        : orderRow.subTotal,
                                tax_amount      : invoice.paymentInfo.taxes
                            }
                        };

                        if (product) {
                            model.entity.items = [{
                                description  : product.description,
                                name         : product.name,
                                order_item_id: order.integrationId || 0,
                                parent_id    : 2,
                                price        : 1000,
                                product_id   : product || 0,
                                sku          : product.info.SKU,
                                tax_amount   : orderRow.taxes
                            }];
                        }

                        requestHelper.postData(
                            fullRoute,
                            model,
                            {
                                headers: {
                                    Authorization: accessToken
                                }
                            }, function (err, result) {
                                if (err) {
                                    return eCb(err);
                                }

                                eCb();
                            });
                    });

                } else {
                    eCb();
                }
            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback();
            });
        });
    }

    function exportCategories(opts, allCallback) {
        var categories = opts.categories;
        var db = opts.dbName;
        var accessToken = 'Bearer ' + opts.token;
        var baseUrl = opts.baseUrl;
        var query = {};
        var settings = opts.settings;
        var route = settings && settings.categories && settings.categories.create;
        var fullRoute;
        var logsOptions;
        var error;

        // set logs options for categories
        logsOptions = {
            action  : 'exports',
            category: 'categories'
        };

        if (!baseUrl || !accessToken || !route) {
            error = new Error('Bad Request');
            error.status = 400;

            // write critical error logs for categories
            logs = syncLogsHelper.addCriticalError(logs, logsOptions, {message: error.message});

            return allCallback(error);
        }

        fullRoute = baseUrl + route;

        if (categories && categories.length) {
            query._id = {
                $in: categories
            };
        }

        productCategoryService.find(query, {dbName: db}, function (err, categories) {
            if (!categories) {
                return allCallback();
            }

            async.each(categories, function (category, eCb) {

                if (!category || !category.parent) {
                    return eCb();
                }

                productCategoryService.find({_id: category.parent}, {dbName: db}, function (err, parent) {
                    var model;

                    if (!category.integrationId && !category.externalId) {
                        // write error logs for categories
                        logs = syncLogsHelper.addError(logs, logsOptions, {
                            message : 'Export ' + category.name + ' category is failed.',
                            entityId: category.id
                        });

                        return eCb();
                    }

                    model = {
                        category: {
                            id             : category.integrationId || category.externalId || 0,
                            parent_id      : parent.integrationId || parent.externalId || 0,
                            level          : category.nestingLevel,
                            position       : category.sequence,
                            name           : category.name,
                            is_active      : true,
                            include_in_menu: true
                        }
                    };

                    requestHelper.postData(
                        fullRoute,
                        model,
                        {
                            headers: {
                                Authorization: accessToken
                            }
                        }, function (err) {
                            if (err) {
                                // write error logs for categories
                                logs = syncLogsHelper.addCriticalError(logs, logsOptions, {
                                    message : err.message || 'Export ' + model.category.name + ' category is failed.',
                                    entityId: model.category.id
                                });

                                return eCb(err);
                            }

                            // write success logs for categories
                            logs = syncLogsHelper.addSuccess(logs, logsOptions, {
                                entityId         : model.category.id,
                                entityDescription: model.category.name,
                                message          : 'Export ' + model.category.name + ' category is success.',
                                type             : CONSTANTS.SYNC_LOGS.TYPE.CREATE
                            });

                            eCb();
                        });
                });
            }, function (err) {
                if (err) {
                    return allCallback(err);
                }

                allCallback(null);
            });
        });
    }

    function syncChannel(opts, callback) {
        var uId = opts.userId;

        logs = syncLogsHelper.initialize({
            dbName : opts.dbName,
            channel: opts._id,
            user   : uId
        });

        async.series([
            function (sCb) {
                exportCategories(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> Categories exported');
                    sCb();
                });
            },

            function (sCb) {
                exportProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> Products exported');
                    sCb();
                });
            },

            function (sCb) {
                exportInventory(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> Inventory exported');
                    sCb();
                });
            },

            function (sCb) {
                getCategories(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> Categories synced');
                    sCb();
                });
            },

            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> Products synced');
                    sCb();
                });
            },

            function (sCb) {
                getCustomers(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> Customers synced');
                    sCb();
                });
            },

            function (sCb) {
                getSalesOrders(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> SalesOrders synced');
                    sCb();
                });
            },

            function (sCb) {
                getInvoices(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> Invoices synced');
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

            console.log('Magento -> synchronization is complete!');

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

                    console.log('Magento -> Categories synced');
                    sCb();
                });
            },

            function (sCb) {
                getProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Magento -> Products synced');
                    sCb();
                });
            }], function (err) {
            if (err) {
                return callback(err);
            }

            syncLogsHelper.create({
                logs  : logs,
                dbName: opts.dbName
            });

            console.log('Magento -> import products is complete!');

            event.emit('getAllDone', {uId: user, dbName: dbName});

            callback();
        });
    }

    function getAll(opts, callback) {
        var uId = opts.user;
        var dbName = opts.dbName;
        var channelName = opts.channelName;
        var channelId = opts._id || opts.channel;
        var error;

        logs = syncLogsHelper.initialize({
            dbName : opts.dbName,
            channel: channelId,
            user   : uId
        });

        if (!opts.baseUrl || !opts.token) {
            error = new Error('Invalid integration settings');
            error.status = 404;

            return callback(error);
        }
        // prevent timeout error
        // callback();

        async.series([
            function (sCb) {
                getCategories(opts, function (err, categories) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('categories is imported for channel ', channelName, ' id = ', channelId);
                    sCb(null, categories);
                });
            },

            function (sCb) {
                getProducts(opts, function (err, products) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Products is imported  for channel ', channelName, ' id = ', channelId);
                    sCb(null, products);
                });
            },

            function (sCb) {
                getCustomers(opts, function (err, customers) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('customers is imported for channel ', channelName, ' id = ', channelId);
                    sCb(null, customers);
                });
            },

            function (sCb) {
                getSalesOrders(opts, function (err, orders) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('salesOrders is imported  for channel ', channelName, ' id = ', channelId);
                    sCb(null, orders);
                });
            },

            function (sCb) {
                getInvoices(opts, function (err, invoices) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('invoices is imported  for channel ', channelName, ' id = ', channelId);
                    sCb(null, invoices);
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

            console.log('All imported  for channel ', channelName, ' id = ', channelId);
            event.emit('getAllDone', {uId: uId, dbName: dbName});
        });
    }

    function publishFulfillments(opts, callback) {
        var fulfillment = opts.fulfillment;
        var baseUrl = opts.baseUrl;
        var accessToken = 'Bearer ' + opts.token;
        var orderId = parseInt(opts.orderId, 10);
        var fullCreateRoute = baseUrl + '/rest/V1/shipment';
        var orderRoute = baseUrl + '/rest/V1/orders/' + orderId;
        var updateOrderRoute = baseUrl + '/rest/V1/orders/create';

        async.waterfall([
            function (wCb) {
                requestHelper.getData(orderRoute, {
                    headers: {
                        Authorization: accessToken
                    }
                }, function (err, resultOrder) {
                    var error;

                    if (err) {
                        return wCb(err);
                    }

                    if (!resultOrder || !resultOrder.body) {
                        error = new Error('Such order not found');
                        error.status = 404;

                        return wCb(error);
                    }

                    wCb(null, resultOrder.body);
                });
            },

            function (magentoOrder, wCb) {
                var orderItemsToUpdate = [];
                var fulfillmentItems = [];
                var items = magentoOrder.items;
                var fulfillmentObj;

                fulfillment.line_items.forEach(function (item) {
                    var currentOrderItem = _.findWhere(items, {product_id: item.productId});

                    fulfillmentItems.push({
                        qty          : item.quantity,
                        order_item_id: currentOrderItem.item_id
                    });

                    orderItemsToUpdate.push({
                        item_id    : currentOrderItem.item_id,
                        qty_shipped: item.quantity
                    });
                });

                fulfillmentObj = {
                    order_id: orderId,
                    items   : fulfillmentItems,
                    tracks  : [],
                    comments: []
                };

                requestHelper.postData(fullCreateRoute, {entity: fulfillmentObj}, {
                    headers: {
                        Authorization: accessToken
                    }
                }, function (err, resultShipment) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, orderItemsToUpdate, resultShipment.entity_id);
                });
            },

            function (orderItemsToUpdate, shipmentId, wCb) {
                var updateOrderObj = {
                    order_id: orderId,
                    items   : orderItemsToUpdate
                };

                requestHelper.putData(updateOrderRoute, {
                    entity: updateOrderObj
                }, {
                    headers: {
                        Authorization: accessToken
                    }
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, shipmentId);
                });
            }
        ], function (err, shipmentId) {
            if (err) {
                return callback(err);
            }

            callback(null, shipmentId);
        });
    }

    function publishProduct(opts, callback) {
        var nativeProduct = opts.product;
        var settings = opts.settings;
        var productPrices = nativeProduct.productPrices;
        var price = (productPrices && productPrices.prices && productPrices.prices.length && productPrices.prices[0].price) || 0;
        var baseUrl = opts.baseUrl;
        var fullCreateRoute = baseUrl + settings.products.create;
        var accessToken = 'Bearer ' + opts.token;
        var model = {
            product: {
                sku              : nativeProduct.info.SKU,
                name             : nativeProduct.name,
                price            : price,
                attribute_set_id : 15,
                custom_attributes: [{
                    attribute_code: 'category_ids',
                    value         : nativeProduct.productCategories
                }, {
                    attribute_code: 'description',
                    value         : nativeProduct.info.description
                }]
            }
        };
        var imageOpts;
        var error;

        if (nativeProduct.weight) {
            model.product.weight = nativeProduct.weight;
        }

        if (!nativeProduct.info.SKU) {
            error = new Error('SKU is required field');
            error.status = 400;

            return callback(error);
        }

        if (!nativeProduct.productImages || !nativeProduct.productImages.length) {
            requestHelper.postData(fullCreateRoute, model, {
                headers: {
                    Authorization: accessToken
                }
            }, function (err, result) {
                var magentoId;
                var linkId;
                var skuId;

                if (err) {
                    return callback(err);
                }

                if (result.body && result.body.message) {
                    error = new Error(result.body.message);
                    error.status = 400;

                    return callback(error);
                }

                magentoId = result.body && result.body.id;
                skuId = result.body && result.body.sku;

                linkId = magentoId + '|' + skuId;

                callback(null, linkId);
            });
        } else {
            publishImageForProduct(nativeProduct.name, nativeProduct.productImages, function (err, resultData) {
                if (err) {
                    return callback(err);
                }

                model.product.media_gallery_entries = resultData;

                requestHelper.postData(fullCreateRoute, model, {
                    headers: {
                        Authorization: accessToken
                    }
                }, function (err, result) {
                    var magentoId;
                    var linkId;
                    var skuId;

                    if (err) {
                        return callback(err);
                    }

                    if (result.body && result.body.message) {
                        error = new Error(result.body.message);
                        error.status = 400;

                        return callback(error);
                    }

                    magentoId = result.body && result.body.id;
                    skuId = result.body && result.body.sku;

                    linkId = magentoId + '|' + skuId;

                    callback(null, linkId);
                });
            });
        }
    }

    function unpublishProduct(opts, callback) {
        var linkId = opts.productId;
        var splittedLinkId = linkId.split('|');
        var sku = splittedLinkId[1];
        var settings = opts.settings;
        var baseUrl = opts.baseUrl;
        var fullCreateRoute = baseUrl + settings.products.delete + sku;
        var accessToken = 'Bearer ' + opts.token;

        requestHelper.removeData(fullCreateRoute, {}, {
            headers: {
                Authorization: accessToken
            }
        }, function (err) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    }

    return {
        getSalesOrders     : getSalesOrders,
        getInvoices        : getInvoices,
        getCustomers       : getCustomers,
        getProducts        : getProducts,
        getOnlyProducts    : getOnlyProducts,
        getCategories      : getCategories,
        exportCustomers    : exportCustomers,
        exportProducts     : exportProducts,
        exportInvoices     : exportInvoices,
        exportCategories   : exportCategories,
        exportInventory    : exportInventory,
        syncChannel        : syncChannel,
        getAll             : getAll,
        publishProduct     : publishProduct,
        unpublishProduct   : unpublishProduct,
        publishFulfillments: publishFulfillments
    };
};

