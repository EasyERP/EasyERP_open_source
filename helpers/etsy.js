var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;
var CONSTANTS = require('../constants/mainConstants');
var redisClient = require('../helpers/redisClient');
var _ = require('lodash');
var ratesRetriever = require('../helpers/ratesRetriever')();
var RefundHelper = require('../helpers/refunds');
var Uploader = require('../services/fileStorage/index');
var uploader = new Uploader();
var SyncLogsHelper = require('../helpers/syncLogs');

module.exports = function (models, event) {
    'use strict';

    var productService = require('../services/products')(models);
    var productAvailability = require('../services/productAvailability')(models);
    var orderService = require('../services/order')(models);
    var orderRowsService = require('../services/orderRows')(models);
    var productCategoryService = require('../services/category')(models);
    var ConflictService = require('../services/conflict')(models);
    var oauthService = require('../helpers/oauthTracker')(models);
    var imageHelper = require('../helpers/imageHelper');
    var productsPriceService = require('../services/productPrice')(models);
    var customerService = require('../services/customer')(models);
    var ChannelLinksService = require('../services/channelLinks')(models);
    var WorkflowService = require('../services/workflow')(models);
    var warehouseService = require('../services/warehouse')(models);
    var paymentService = require('../services/payments')(models);
    var goodsOutService = require('../services/goodsOutNotes')(models);
    var paymentMethodService = require('../services/paymentMethod')(models);
    var ImagesService = require('../services/images')(models);
    var ratesService = require('../services/rates')(models);
    var journalEntryService = require('../services/journalEntry')(models);
    var imagesService = require('../services/images')(models);
    var syncLogsHelper = new SyncLogsHelper(models);
    var logs;

    var refundHelper = new RefundHelper(models);

    function createMatchDataForProducts(product, opts, cb) {
        var db = opts.dbName;
        var uId = opts.uId;
        var channel = opts._id || opts.channel;

        productService.find({}, {
            'info.SKU': 1,
            dbName    : db
        }, function (err, nativeProducts) {
            if (err) {
                return cb(err);
            }

            ChannelLinksService.find({
                linkId: product.listing_id.toString()
            }, {
                dbName: db
            })
                .lean()
                .exec(function (err, result) {
                    var checkIdentitySKU;
                    var checkIdentityChannel;

                    if (err) {
                        return cb(err);
                    }

                    checkIdentitySKU = _.find(nativeProducts, function (el) {
                        return el.info.SKU === product.listing_id.toString();
                    });

                    checkIdentityChannel = _.find(result, function (el) {
                        return el.channel.toString() === channel;
                    });

                    if (checkIdentityChannel) {
                        return cb(null, true);
                    }

                    if (!checkIdentitySKU) {
                        return cb();
                    }

                    ConflictService.findAndUpdate({
                        'fields.listing_id': product.listing_id,
                        'fields.channel'   : ObjectId(channel)
                    }, {
                        entity: 'Product',

                        fields: {
                            linkId: product.listing_id,
                            name  : product.title,

                            info: {
                                SKU: product.listing_id.toString()
                            },

                            listing_id: product.listing_id,
                            channel   : ObjectId(channel)
                        }
                    }, {
                        upsert: true,
                        dbName: db
                    }, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        if (!result._id) {
                            logs = syncLogsHelper.addConflict(logs, {
                                action  : 'imports',
                                category: 'products'
                            }, {
                                entityId         : product.listing_id,
                                entityDescription: product.title
                            });
                        }

                        event.emit('showResolveConflict', {uId: uId});

                        cb(null, true);
                    });

                });
        });
    }

    function imageCreator(image, db, id, main, channel, cb) {
        ImagesService.create({
            main         : main,
            imageSrc     : image.base64,
            integrationId: image.integrationId,
            channel      : channel,
            product      : id,
            dbName       : db
        }, function (err, result) {
            if (err) {
                return cb(err);
            }

            cb(null, result);
        });
    }

    function importProducts(opts, allCallback) {
        var settings = opts.settings;
        var productUri = opts.settings && opts.settings.products ? opts.settings.products.get : '/listings';
        var productStatusArray = ['active', 'draft', 'expired', 'inactive'];
        var allProducts = [];
        var groupId;

        async.eachLimit(productStatusArray, 1, function (status, eachCallback) {

            var query = {
                shop: true,
                uri : productUri + '/' + status
            };

            oauthService.get(query, opts, function (err, docs) {
                var products;

                products = docs ? docs.results : [];

                if (err) {
                    syncLogsHelper.addC

                    return eachCallback(err);
                }

                allProducts = allProducts.concat(products);

                eachCallback();
            });
        }, function (err) {
            if (err) {
                return allCallback(err);
            }

            async.eachLimit(allProducts, 1, function (product, eachCb) {
                createMatchDataForProducts(product, opts, function (err, existProduct) {
                    var waterFallTasks;
                    var categoryIds = [];

                    if (err) {
                        return eachCb(err);
                    }

                    if (existProduct) {
                        return eachCb();
                    }

                    waterFallTasks = [createCategories, getImages, createProducts, createImages, createPrice, createLink];

                    function createCategories(waterFallCb) {
                        if (!product.category_path || !product.category_path.length || !product.category_path_ids) {
                            return waterFallCb(null, [ObjectId(CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID)]);
                        }

                        function updateCategoryNesting(index, parentCategory, mainCb) {
                            var nameArray = product.category_path.slice(0, index).join('/');
                            var uri = settings && settings.categories ? settings.categories.get : '/categories';
                            var queryObj = {
                                uri: uri + '/' + nameArray
                            };
                            var categoryId = product.category_path_ids[index - 1];

                            productCategoryService.findOne({
                                integrationId: categoryId
                            }, {dbName: opts.dbName}, function (err, doc) {
                                if (err) {
                                    return mainCb(err);
                                }

                                if (doc) {
                                    categoryIds.push(doc._id);

                                    productCategoryService.findByIdAndUpdate(doc._id, {
                                        $inc: {
                                            productsCount: 1
                                        }
                                    }, {
                                        dbName: opts.dbName
                                    }, function (err) {
                                        if (err) {
                                            return mainCb(err);
                                        }

                                        if (index !== product.category_path.length) {
                                            index++;
                                            updateCategoryNesting(index, doc._id, mainCb);
                                        } else {
                                            mainCb(null, categoryIds);
                                        }
                                    });

                                } else {
                                    oauthService.get(queryObj, opts, function (err, category) {
                                        var saveObject;

                                        if (err) {
                                            return mainCb(err);
                                        }

                                        category = category.results ? category.results[0] : {};

                                        saveObject = {
                                            parent       : parentCategory || null,
                                            dbName       : opts.dbName,
                                            name         : category.short_name,
                                            fullName     : category.short_name,
                                            integrationId: category.category_id,
                                            productsCount: 1
                                        };

                                        productCategoryService.create(saveObject, function (err, doc) {
                                            var docId = doc._id;

                                            if (err) {
                                                return mainCb(err);
                                            }

                                            categoryIds.push(docId);

                                            if (index !== product.category_path.length) {
                                                index++;
                                                updateCategoryNesting(index, docId, mainCb);
                                            } else {
                                                mainCb(null, categoryIds);
                                            }
                                        });
                                    });
                                }
                            });
                        }

                        updateCategoryNesting(1, '', waterFallCb);
                    }

                    function getImages(categoryIds, waterFallCb) {
                        var uri = settings && settings.products ? settings.products.get : '/listings';
                        var queryObj = {
                            uri: uri + '/' + product.listing_id + '/images'
                        };
                        var imagesArray = [];

                        oauthService.get(queryObj, opts, function (err, resImages) {

                            if (err) {
                                return waterFallCb(err);
                            }

                            if (resImages && resImages.results && resImages.results.length) {

                                resImages.results.forEach(function (image) {
                                    imagesArray.push({
                                        imageSrc     : image.url_170x135,
                                        integrationId: image.listing_image_id
                                    });
                                });

                                waterFallCb(null, categoryIds, imagesArray);

                            } else {
                                waterFallCb(null, categoryIds);
                            }
                        });
                    }

                    function createProducts(categoryIds, image, waterFallCb) {
                        var saveObject;
                        var productPrice = parseFloat(product.price);

                        if (typeof image === 'function') {
                            waterFallCb = image;
                            image = '';
                        }

                        groupId = new ObjectId().toString();

                        saveObject = {
                            body: {
                                creationDate: new Date(product.creation_tsz * 1000),
                                inventory   : {
                                    weight: product.item_weight,
                                    size  : {
                                        length   : product.item_length,
                                        width    : product.item_width,
                                        height   : product.item_height,
                                        dimension: product.item_dimensions_unit
                                    }
                                },

                                name: product.title,
                                info: {
                                    productType: ObjectId(CONSTANTS.DEFAULT_PRODUCT_TYPE_ID),
                                    SKU        : product.listing_id,
                                    isActive   : true,
                                    description: product.description,
                                    categories : categoryIds
                                },

                                groupId: groupId,
                                etsyId : product.listing_id
                            },

                            dbName: opts.dbName,
                            uId   : opts.uId
                        };

                        productService.createProduct(saveObject, function (err, data) {
                            if (err) {
                                waterFallCb(err);
                            }

                            waterFallCb(null, data._id, image, productPrice);
                        });
                    }

                    function createImages(productId, images, productPrice, waterFallCb) {
                        var counter = 0;

                        if (!images) {
                            return waterFallCb(null, productId, productPrice);
                        }

                        if (!Array.isArray(images)) {
                            images = [images];
                        }

                        if (!images.length) {
                            return imagesService.create({
                                imageSrc: CONSTANTS.DEFAULT_IMAGE_URL,
                                product : groupId,
                                dbName  : opts.dbName
                            }, function (err, createdImage) {
                                if (err) {
                                    waterFallCb(err);
                                }

                                productService.findOneAndUpdate({
                                    _id: productId
                                }, {
                                    $set: {
                                        imageSrc: createdImage._id
                                    }
                                }, {
                                    dbName: opts.dbName
                                }, function (err) {
                                    if (err) {
                                        return waterFallCb(err);
                                    }

                                    return waterFallCb(null, productId, productPrice);
                                });
                            });
                        }

                        async.eachLimit(images, 1, function (image, eCb) {
                            imagesService.create({
                                imageSrc     : image.imageSrc,
                                product      : groupId,
                                channel      : opts._id || opts.channel,
                                integrationId: image.integrationId,
                                dbName       : opts.dbName
                            }, function (err, createdImage) {
                                if (err) {
                                    return eCb(err);
                                }

                                if (counter !== images.length - 1) {
                                    counter++;
                                    return eCb();
                                }

                                productService.findOneAndUpdate({
                                    _id: productId
                                }, {
                                    $set: {
                                        imageSrc: createdImage._id
                                    }
                                }, {
                                    dbName: opts.dbName
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
                                return waterFallCb(err);
                            }

                            waterFallCb(null, productId, productPrice);
                        });
                    }

                    function createPrice(productId, productPrice, waterFallCb) {
                        var saveObject = {
                            priceLists: opts.priceList,
                            product   : productId,
                            prices    : [
                                {
                                    count: 1,
                                    price: productPrice
                                }, {
                                    count: 0,
                                    price: 0
                                },
                                {
                                    count: 0,
                                    price: 0
                                },
                                {
                                    count: 0,
                                    price: 0
                                },
                                {
                                    count: 0,
                                    price: 0
                                }],

                            dbName: opts.dbName
                        };
                        productsPriceService.create(saveObject, function (err) {
                            if (err) {
                                return waterFallCb(err);
                            }
                            waterFallCb(null, productId);
                        });
                    }

                    function createLink(productId, waterFallCb) {
                        var channelLinksObj = {
                            product  : productId,
                            linkId   : product.listing_id,
                            channel  : opts._id || opts.channel,
                            priceList: opts.priceList,
                            dbName   : opts.dbName
                        };

                        ChannelLinksService.create(channelLinksObj, function (err) {
                            if (err) {
                                return waterFallCb(err);
                            }
                            waterFallCb();
                        });
                    }

                    async.waterfall(waterFallTasks, eachCb);
                });
            }, allCallback);
        });

    }

    function importOrders(opts, allCallback) {
        var orderUri = (opts.settings && opts.settings.orders && opts.settings.orders.get) || '/receipts';
        var warehouse = opts.warehouseSettings && opts.warehouseSettings.warehouse;
        var dbName = opts.dbName;
        var channel = opts._id || opts.channel;
        var dateOrderFrom = opts.ordersDate || new Date(0);
        var uId = opts.uId;
        var priceList = opts.priceList;
        var nativeUnlinked;
        var workflowId;

        function getUnlinkedProducts(waterFallCb) {
            ConflictService.find({
                entity          : 'Product',
                type            : 'unlinked',
                'fields.channel': ObjectId(channel)
            }, {
                dbName: dbName,
                fields: 1
            })
                .lean()
                .exec(function (err, unlinked) {
                    if (err) {
                        return waterFallCb(err);
                    }

                    nativeUnlinked = unlinked;

                    waterFallCb();
                });
        }

        function getWorkflow(waterFallCb) {
            WorkflowService.findOne({wId: 'Sales Order', name: 'Processing'}, {
                dbName: dbName,
                _id   : 1
            }, function (err, workflow) {
                if (err) {
                    return waterFallCb(err);
                }

                workflowId = workflow._id;

                waterFallCb();
            });
        }

        function getChartOfAccount(waterFallCb) {
            paymentMethodService.getById({
                id    : opts.bankAccount,
                dbName: dbName
            }, function (err, bankAccount) {
                if (err) {
                    return waterFallCb(err);
                }

                bankAccount = bankAccount && bankAccount.toJSON();
                waterFallCb(null, bankAccount);
            });
        }

        function getCreditAccount(bankAccount, waterFallCb) {
            warehouseService.findOne({_id: warehouse}, {dbName: dbName}, function (err, warehouseObject) {
                var creditAccount = warehouseObject && warehouseObject.account;
                if (err) {
                    return waterFallCb(err);
                }

                waterFallCb(null, bankAccount, creditAccount);
            });
        }

        function getOrders(bankAccount, creditAccount, mainWaterFallCb) {
            var query = {
                shop: true,
                uri : orderUri
            };

            oauthService.get(query, opts, function (err, docs) {
                var orders;

                orders = docs ? docs.results : [];

                if (err) {
                    return mainWaterFallCb(err);
                }

                if (!orders) {
                    return mainWaterFallCb();
                }

                async.eachLimit(orders, 1, function (order, eachCb) {
                    var waterFallTasks;
                    var etsyIds;
                    var nativeProducts;
                    var products;
                    var hasUnlinkedProducts;
                    var unlinkedOrderId;
                    var tempWorkflow;
                    var workflow;
                    var existOrder;
                    var paymentId;
                    var conflictTypes;

                    function getProductsByOrder(waterFallCb) {
                        var queryObj = {
                            uri: orderUri + '/' + order.receipt_id + '/transactions'
                        };

                        oauthService.get(queryObj, opts, function (err, response) {
                            products = response && response.results;

                            if (err) {
                                return waterFallCb(err);
                            }

                            etsyIds = _.pluck(products, 'listing_id');

                            waterFallCb();
                        });
                    }

                    function getNativeProductsForOrder(waterFallCb) {
                        var etsyIdsToString = etsyIds.map(function (el) {
                            return el.toString();
                        });

                        productService
                            .getProductsForOrder({
                                dbName : dbName,
                                channel: channel,
                                linkIds: etsyIdsToString
                            }, function (err, ourProducts) {
                                nativeProducts = ourProducts;

                                if (err) {
                                    return waterFallCb(err);
                                }

                                if (etsyIds.length !== nativeProducts.length) {
                                    workflow = ObjectId(CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID);
                                    tempWorkflow = workflowId;
                                    hasUnlinkedProducts = true;

                                    if (conflictTypes && conflictTypes.length) {
                                        conflictTypes.push({
                                            type: 'product'
                                        });
                                    } else {
                                        conflictTypes = [{
                                            type: 'product'
                                        }];
                                    }
                                } else {
                                    workflow = workflowId;
                                    tempWorkflow = workflow;
                                }

                                waterFallCb();
                            });
                    }

                    function getCountry(waterFallCb) {
                        var queryObj = {
                            uri: '/countries/' + order.country_id
                        };

                        oauthService.get(queryObj, opts, function (err, response) {
                            var country = response && response.results && response.results.length && response.results[0].name;

                            if (err) {
                                return waterFallCb(err);
                            }

                            waterFallCb(null, country);

                        });
                    }

                    function createCustomer(country, waterFallCb) {
                        customerService.findOne({
                            integrationId: order.buyer_user_id,
                            channel      : channel
                        }, {dbName: dbName}, function (err, doc) {
                            var saveObject;
                            var nameArray = order.name.split(' ');

                            if (err) {
                                return waterFallCb(err);
                            }

                            if (doc) {
                                waterFallCb(null, doc._id);
                            } else {
                                saveObject = {
                                    name: {
                                        first: nameArray[0],
                                        last : nameArray[1]
                                    },

                                    address: {
                                        street : order.first_line,
                                        city   : order.city,
                                        state  : order.state,
                                        zip    : order.zip,
                                        country: country
                                    },

                                    type          : 'Etsy Customer',
                                    email         : order.buyer_email,
                                    salesPurchases: {
                                        isCustomer: true
                                    },

                                    integrationId: order.buyer_user_id,
                                    channel      : channel,
                                    dbName       : dbName
                                };

                                customerService.create(saveObject, function (err, doc) {
                                    var docId = doc && doc._id;

                                    if (err) {
                                        return waterFallCb(err);
                                    }

                                    waterFallCb(null, docId);

                                });
                            }
                        });
                    }

                    function getCurrency(customerId, waterFallCb) {
                        var orderDate = new Date(order.creation_tsz * 1000);
                        var etsyCurrency;
                        var currency;
                        var rates;
                        var base;

                        ratesService.getById({dbName: dbName, id: orderDate}, function (err, ratesObject) {
                            rates = ratesObject ? ratesObject.rates : {};
                            base = ratesObject ? ratesObject.base : 'USD';
                            etsyCurrency = order.currency_code || 'USD';

                            currency = {
                                _id : etsyCurrency,
                                rate: ratesRetriever.getRate(rates, base, etsyCurrency)
                            };

                            waterFallCb(null, customerId, currency);
                        });
                    }

                    function createOrder(customerId, currency, waterFallCb) {
                        var saveObject = {
                            supplier: customerId,

                            status: {
                                allocateStatus: 'NOT',
                                fulfillStatus : 'NOT',
                                shippingStatus: 'NOT'
                            },

                            warehouse    : warehouse,
                            creationDate : new Date(order.creation_tsz * 1000),
                            orderDate    : new Date(order.creation_tsz * 1000),
                            priceList    : priceList,
                            integrationId: order.receipt_id,
                            channel      : channel,
                            workflow     : workflow,
                            tempWorkflow : tempWorkflow,
                            editedBy     : {
                                user: uId,
                                date: new Date(order.last_modified_tsz * 1000)
                            },

                            paymentInfo: {
                                total  : parseFloat(order.grandtotal) * 100,
                                unTaxed: parseFloat(order.total_price) * 100,
                                taxes  : (parseFloat(order.total_vat_cost) + parseFloat(order.total_tax_cost)) * 100
                            },

                            currency: currency
                        };

                        if ((new Date(order.creation_tsz.createdAt) < new Date(dateOrderFrom))) {
                            return waterFallCb(null);
                        }

                        if (conflictTypes) {
                            saveObject.conflictTypes = conflictTypes;
                        }

                        if (order.ending_tsz) {
                            saveObject.expectedDate = new Date(order.ending_tsz * 1000);
                        }

                        orderService.findOne({
                            channel      : channel,
                            integrationId: order.receipt_id
                        }, {dbName: dbName}, function (err, result) {
                            if (err) {
                                return waterFallCb(err);
                            }

                            if (!result) {
                                saveObject.dbName = dbName;

                                return orderService.create(saveObject, function (err, createdOrder) {
                                    if (err) {
                                        return waterFallCb(err);
                                    }

                                    unlinkedOrderId = createdOrder._id;

                                    waterFallCb(null, createdOrder);
                                });
                            }

                            orderService.findOneAndUpdate({
                                integrationId: order.receipt_id,
                                channel      : channel
                            }, {$set: saveObject}, {
                                dbName: dbName,
                                new   : true
                            }, function (err, newObject) {
                                if (err) {
                                    return waterFallCb(err);
                                }

                                existOrder = newObject;
                                unlinkedOrderId = newObject._id;

                                orderRowsService.remove({
                                    order : unlinkedOrderId,
                                    dbName: dbName
                                }, function (err) {
                                    if (err) {
                                        return waterFallCb(err);
                                    }

                                    waterFallCb(null, newObject);
                                });
                            });

                        });
                    }

                    function createOrderRows(createdOrder, waterFallCb) {

                        if (products) {
                            async.each(products, function (el, eachCb) {
                                ChannelLinksService.findOne({
                                    linkId : el.listing_id,
                                    channel: channel
                                }, {dbName: dbName}, function (err, link) {
                                    var saveObject;
                                    var linkProduct = (link && link.product) || null;
                                    var unitPrice = parseFloat(el.price) * 100;

                                    if (err || !link) {
                                        return eachCb();
                                    }

                                    saveObject = {
                                        product      : linkProduct,
                                        order        : createdOrder._id,
                                        warehouse    : warehouse,
                                        quantity     : el.quantity,
                                        description  : el.description,
                                        unitPrice    : unitPrice,
                                        subTotal     : el.quantity * unitPrice,
                                        creationDate : createdOrder.creationDate,
                                        debitAccount : null,
                                        creditAccount: creditAccount,
                                        dbName       : dbName
                                    };

                                    orderRowsService.create(saveObject, eachCb);
                                });

                            }, function (err) {
                                if (err) {
                                    return waterFallCb(err);
                                }
                                waterFallCb(null, createdOrder);
                            });
                        } else {
                            waterFallCb(null, createdOrder);
                        }

                    }

                    function createUnlinkedProducts(createdOrder, waterFallCb) {
                        var differenceProductIds;
                        var nativeIds;
                        var unlinkedIds = _.pluck(nativeUnlinked, 'fields.id');

                        if (!hasUnlinkedProducts) {
                            return waterFallCb(null, createdOrder);
                        }

                        nativeIds = _.pluck(nativeProducts, 'channelLinks.linkId');
                        nativeIds = nativeIds.map(function (el) {
                            return parseInt(el, 10);
                        });

                        differenceProductIds = _.difference(etsyIds, nativeIds);

                        async.each(differenceProductIds, function (product, intCb) {
                            var unlinkedOrderRow;
                            var fields = products.find(function (theirProduct) {
                                return theirProduct.listing_id === product;
                            });
                            var unitPrice = parseFloat(fields.price) * 100;
                            var data = {
                                price   : unitPrice,
                                sku     : fields.listing_id,
                                name    : fields.title,
                                id      : fields.listing_id,
                                channel : ObjectId(channel),
                                hasOrder: true
                            };
                            var orderRowData = {
                                quantity: fields.quantity,
                                order   : unlinkedOrderId
                            };

                            if (unlinkedIds.indexOf(fields.listing_id) > -1) {
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
                                dbName: dbName
                            };

                            ConflictService.findOneAndUpdate({
                                entity     : 'Product',
                                type       : 'unlinked',
                                'fields.id': fields.listing_id
                            }, {
                                $set: {
                                    fields: data
                                }
                            }, {
                                dbName: dbName,
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
                                return waterFallCb(err);
                            }

                            waterFallCb(null, createdOrder);
                        });
                    }

                    function createPayments(createdOrder, callback) {

                        paymentService.findOne({order: createdOrder._id}, {dbName: dbName}, function (err, existedPayment) {
                            var queryObj = {
                                shop: true,
                                uri : orderUri + '/' + order.receipt_id + '/payments'
                            };

                            if (err) {
                                return callback(err);
                            }

                            if (existedPayment) {
                                return callback(null, createdOrder, null);
                            }

                            oauthService.get(queryObj, opts, function (err, response) {
                                var payment = response && response.results && response.results.length && response.results[0];
                                var saveObject;
                                var sum = payment.amount_gross && (payment.amount_gross / 100);

                                if (err) {
                                    return callback(err);
                                }

                                if (!payment) {
                                    return callback(null, createdOrder, null);
                                }

                                saveObject = {
                                    paidAmount      : sum,
                                    order           : createdOrder._id,
                                    date            : new Date(payment.update_date * 1000),
                                    differenceAmount: 0,
                                    currency        : {
                                        _id : createdOrder.currency && createdOrder.currency._id,
                                        rate: createdOrder.currency && createdOrder.currency.rate
                                    },

                                    createdBy: {
                                        user: uId,
                                        date: new Date(payment.create_date * 1000)
                                    },

                                    supplier: createdOrder.supplier,
                                    editedBy: {
                                        user: uId,
                                        date: new Date(payment.update_date * 1000)
                                    },

                                    integrationId: payment.payment_id,
                                    paymentMethod: bankAccount._id,
                                    bankAccount  : bankAccount.chartAccount,
                                    dbName       : dbName,
                                    channel      : channel
                                };

                                paymentService.create(saveObject, function (err, resultPayment) {
                                    if (err) {
                                        return callback(err);
                                    }

                                    journalEntryService.formBodyForPrepaymentEntries({
                                        payment: resultPayment,
                                        dbName : dbName
                                    }, function (err) {
                                        if (err) {
                                            return callback(err);
                                        }

                                        callback(null, createdOrder, payment.payment_id);
                                    });
                                });
                            });
                        });
                    }

                    function createRefund(createdOrder, paymentId, callback) {
                        var queryObj;

                        if (!paymentId) {
                            return callback(null, createdOrder);
                        }

                        queryObj = {
                            uri: '/payments/' + paymentId + '/adjustments'
                        };

                        oauthService.get(queryObj, opts, function (err, response) {
                            var refunds;

                            if (!response || !response.results || !response.results.length) {
                                return callback(null, createdOrder);
                            }

                            refunds = response.results;

                            async.eachLimit(refunds, 1, function (refund, eCb) {
                                var saveObject;
                                var sum;

                                sum = refund.total_adjustment_amount && (refund.total_adjustment_amount / 100);

                                if (err) {
                                    return eCb(err);
                                }

                                paymentService.findOne({
                                    integrationId: refund.payment_adjustment_id.toString(),
                                    channel      : channel
                                }, {dbName: dbName}, function (err, resultRefund) {
                                    if (err) {
                                        return eCb(err);
                                    }

                                    if (resultRefund) {
                                        return eCb();
                                    }

                                    saveObject = {
                                        paidAmount      : sum,
                                        order           : createdOrder._id,
                                        date            : new Date(refund.update_date * 1000),
                                        differenceAmount: 0,
                                        currency        : {
                                            _id : createdOrder.currency && createdOrder.currency._id,
                                            rate: createdOrder.currency && createdOrder.currency.rate
                                        },

                                        createdBy: {
                                            user: uId,
                                            date: new Date(refund.create_date * 1000)
                                        },

                                        supplier: createdOrder.supplier,
                                        editedBy: {
                                            user: uId,
                                            date: new Date(refund.update_date * 1000)
                                        },

                                        integrationId: refund.payment_id,
                                        paymentMethod: bankAccount._id,
                                        bankAccount  : bankAccount.chartAccount,
                                        dbName       : dbName,
                                        channel      : channel,
                                        refund       : true
                                    };

                                    refundHelper.createPaymentReturn({
                                        data  : saveObject,
                                        dbName: dbName,
                                        user  : uId
                                    }, eCb);
                                });
                            }, function (err) {
                                if (err) {
                                    return callback(err);
                                }

                                callback(null, createdOrder);
                            });
                        });
                    }

                    function updateShippingStatus(createdOrder, waterFallCallback) {
                        var queryObj;

                        if (err) {
                            return waterFallCallback(err);
                        }

                        queryObj = {
                            uri: orderUri + '/' + order.receipt_id
                        };

                        oauthService.put(queryObj, {
                            was_shipped: true
                        }, opts, function (err) {
                            if (err) {
                                return waterFallCallback(err);
                            }

                            waterFallCallback(null, createdOrder);
                        });
                    }

                    function updateShippingMethod(existedOrder, callback) {

                        goodsOutService.findOne({order: existedOrder._id}, {dbName: dbName}, function (err, goodsOutNote) {
                            var queryObj;
                            var body;

                            if (err) {
                                return callback(err);
                            }

                            if (!goodsOutNote || !goodsOutNote.shippingMethod) {
                                return callback();
                            }

                            // todo shippingMethodService get shippingMethodName

                            queryObj = {
                                uri: orderUri + '/' + order.receipt_id
                            };

                            body = {
                                tracking_code: goodsOutNote.reference
                                //   carrier_name  : shippingMethodName
                            };

                            oauthService.post(queryObj, body, opts, callback);
                        });
                    }

                    if (existOrder) {
                        waterFallTasks = [async.apply(createPayments, existOrder), createRefund];

                    } else {
                        waterFallTasks = [getProductsByOrder, getNativeProductsForOrder, getCountry, createCustomer, getCurrency, createOrder, createOrderRows, createUnlinkedProducts, createPayments, createRefund];
                    }

                    async.waterfall(waterFallTasks, eachCb);
                }, mainWaterFallCb);
            });
        }

        async.waterfall([getUnlinkedProducts, getWorkflow, getChartOfAccount, getCreditAccount, getOrders], function (err) {
            if (err) {
                return allCallback(err);
            }

            allCallback();
        });

    }

    function updateProductImages(nativeImages, etsyImages, options, callback) {
        var uri = '/listings';
        var listingId = options.listingId;
        var opts = options.opts;
        var oauth = {
            consumer_key   : opts.consumerKey,
            consumer_secret: opts.consumerSecret,
            token          : opts.token,
            token_secret   : opts.secret
        };
        var query = {
            uri  : uri + '/' + listingId + '/images',
            oauth: oauth
        };

        async.waterfall([
            function (wCb) {
                var etsyListingsIds = _.pluck(etsyImages, 'listing_image_id');
                var nativeListingsIds = _.pluck(nativeImages, 'integrationId');

                async.each(etsyListingsIds, function (listingImageId, eCb) {
                    var deleteUri = uri + '/' + listingId + '/images/';

                    if (nativeListingsIds.indexOf(listingImageId.toString()) !== -1) {
                        return eCb();
                    }

                    oauthService.delete({id: listingId}, {
                        baseUrl: opts.baseUrl,
                        uri    : deleteUri
                    }, eCb);

                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb();
                });
            },

            function (wCb) {
                async.eachLimit(nativeImages, 1, function (image, eCb) {
                    var formData;

                    if (image.channel) {
                        return eCb();
                    }

                    uploader.readImage(image.imageSrc, function (err, base64Data) {
                        if (err) {
                            return eCb(err);
                        }

                        formData = {
                            listing_id: parseInt(listingId, 10),
                            image     : {
                                value  : new Buffer(base64Data, 'base64'),
                                options: {
                                    filename   : listingId + '.jpg',
                                    contentType: 'image/jpg'
                                }
                            }
                        };

                        imageHelper.upload(query, formData, opts, function (err, result) {
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
        ], callback);
    }

    function exportProducts(opts, allCallback) {
        var db = opts.dbName;
        var settings = opts.settings;
        var query = {
            job: null
        };

        var warehouse = opts.warehouseSettings ? opts.warehouseSettings.warehouse : null;
        var shippingTemplate = opts && opts.shippingMethod ? opts.shippingMethod._id : null;
        var nativeImages;

        async.waterfall([
            function (wCb) {
                // get only changed or created product for export
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
                var productObjectIds = productIds.objectID();

                if (!productIds || !productIds.length) {
                    return allCallback();
                }

                query = {
                    _id: {$in: productObjectIds}
                };

                productService.getProductsForSyncToChannel({dbName: db, query: query}, function (err, products) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!products || !products.length) {
                        return allCallback();
                    }

                    wCb(null, products);
                });
            }
        ], function (err, products) {
            if (err) {
                return allCallback(err);
            }

            if (!products || !products.length) {
                return allCallback();
            }

            async.eachLimit(products, 10, function (product, eCb) {

                var channelLinksObj = {
                    product: product._id,
                    channel: opts._id || opts.channel
                };

                ChannelLinksService.findOne(channelLinksObj, {dbName: opts.dbName}, function (err, link) {

                    if (err) {
                        return eCb(err);
                    }

                    if (!link) {
                        return eCb();
                    }

                    function findPrice(waterFallCb) {
                        productsPriceService.findOne({
                            priceLists: link.priceList,
                            product   : product._id
                        }, {
                            dbName: db
                        }, function (err, productPrice) {
                            var productPriceValue;

                            if (err) {
                                waterFallCb(err);
                            }

                            productPriceValue = productPrice && productPrice.prices && productPrice.prices.length ? productPrice.prices[0].price : 0;
                            waterFallCb(null, productPriceValue);
                        });
                    }

                    function findQuantity(productPriceValue, waterFallCb) {
                        productAvailability.getProductAvailability({
                            product  : product._id,
                            warehouse: warehouse
                        }, {
                            dbName: db
                        }, function (err, result) {
                            var quantity;

                            if (err) {
                                waterFallCb(err);
                            }

                            quantity = result && result.onHand && (result.onHand > 0) ? result.onHand : 1;
                            waterFallCb(null, productPriceValue, quantity);
                        });
                    }

                    function exportProduct(productPrice, quantity, waterFallCb) {
                        var model;
                        var uri;

                        if (err) {
                            return waterFallCb(err);
                        }

                        if (link.linkId) {
                            uri = settings.products ? settings.products.put : '/listing';

                            model = {
                                title   : product.name,
                                quantity: quantity
                            };

                            if (product.inventory.weight) {
                                model.item_weight = product.inventory.weight;
                            }

                            if (productPrice) {
                                model.price = productPrice;
                            }

                            if (product.info && product.info.description) {
                                model.description = product.info.description;
                            }

                            oauthService.put({
                                uri: uri + '/' + link.linkId
                            }, model, opts, function (err) {
                                if (err) {
                                    return waterFallCb(err);
                                }
                                waterFallCb();
                            });
                        }
                    }

                    function exportProductImages(waterFallCb) {
                        var listingImageUri = settings.products ? settings.products.create + '/' + link.linkId + '/images' : '/listing/' + link.linkId + '/images';
                        var etsyImage = [];

                        oauthService.get({
                            uri: listingImageUri
                        }, opts, function (err, etsyImages) {
                            if (err) {
                                return waterFallCb(err);
                            }

                            if (etsyImages.results && etsyImages.results.length) {
                                etsyImage = etsyImages.results;
                            }

                            updateProductImages(product.productImages, etsyImage, {
                                listingId: link.linkId,
                                opts     : opts
                            }, waterFallCb);
                        });
                    }

                    async.waterfall([findPrice, findQuantity, exportProduct, exportProductImages], eCb);
                });
            }, allCallback);
        });
    }

    function getAll(opts, callback) {
        var uId = opts.userId;
        var dbName = opts.dbName;
        var error;

        if (!opts.baseUrl || !opts.token) {
            error = new Error('Invalid integration settings');
            error.status = 404;

            return callback(error);
        }
        // prevent timeout error
        callback();

        async.series([
            function (sCb) {
                importProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Etsy -> Products is imported');
                    sCb();
                });
            },
            function (sCb) {
                importOrders(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Etsy -> Orders imported');
                    sCb();
                });
            }
        ], function (err) {
            if (err) {
                return console.log(err);
            }

            console.log('all imported');

            event.emit('getAllDone', {uId: uId, dbName: dbName});
        });
    }

    function unpublishProduct(opts, callback) {
        var productId = opts.productId;
        var settings = opts.settings;
        var productUri = settings && settings.products ? settings.products.delete + '/' : '/listings/';
        var baseUrl = CONSTANTS.INTEGRATION.ETSY_BASE_URL;
        var secret = opts.secret;
        var token = opts.token;

        oauthService.delete({
            id: productId
        }, {
            token  : token,
            secret : secret,
            uri    : productUri,
            baseUrl: baseUrl
        }, function (err, docs) {
            var products;

            if (err) {
                return callback(err);
            }

            products = docs ? docs.results : [];

            callback();
        });
    }

    function syncChannel(opts, callback) {
        logs = syncLogsHelper.initialize({
            dbName : opts.dbName,
            channel: opts.channel
        });

        async.series([
            function (sCb) {
                exportProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Etsy -> Product exported');
                    sCb();
                });
            },
            function (sCb) {
                importProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Etsy -> Products imported');
                    sCb();
                });
            },
            function (sCb) {
                importOrders(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Etsy -> Orders imported');
                    sCb();
                });
            }
        ], function (err) {
            syncLogsHelper.create({
                logs  : logs,
                dbName: opts.dbName
            });

            if (err) {
                return callback(err);
            }

            console.log('Etsy -> synchronization is complete!');

            callback();
        });
    }

    function getOnlyProducts(opts, callback) {
        var uId = opts.userId;
        var dbName = opts.dbName;

        async.series([
            function (sCb) {
                importProducts(opts, function (err) {
                    if (err) {
                        return sCb(err);
                    }

                    console.log('Etsy -> Products imported');
                    sCb();
                });
            }], function (err) {
            if (err) {
                return callback(err);
            }

            console.log('Etsy -> import products is complete!');

            event.emit('getAllDone', {uId: uId, dbName: dbName});

            callback();
        });
    }

    function publishFulfillments(opts, callback) {
        var orderId = opts.orderId;
        var orderUri = (opts.settings && opts.settings.orders && opts.settings.orders.get) || '/receipts';
        var queryObj = {
            uri: orderUri + '/' + orderId
        };
        var updateObj = {
            was_shipped: true
        };
        var shipmentInfo = opts.shipmentInfo;

        oauthService.put(queryObj, updateObj, opts, function (err, result) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    }

    function publishProduct(opts, callback) {
        var nativeProduct = opts.product;
        var settings = opts.settings;
        var productPrices = nativeProduct.productPrices;
        var price = (productPrices && productPrices.prices && productPrices.prices.length && productPrices.prices[0].price) || 0;
        var shippingTemplate = opts.shippingTemplate || 34645856098;
        var waterfallFunctions = [];
        var listingId;
        var publishResults;

        opts.baseUrl = CONSTANTS.INTEGRATION.ETSY_BASE_URL;

        function createProductOnEtsy(wCb) {
            var product = {
                who_made            : 'i_did',
                when_made           : 'made_to_order',
                title               : nativeProduct.name,
                description         : nativeProduct.info.description.trim() || nativeProduct.name,
                shipping_template_id: shippingTemplate,
                price               : price || 0.2,
                is_supply           : 'false',
                quantity            : 1,
                state               : 'draft'
            };
            var uri = settings.products ? settings.products.create : '/listing';

            oauthService.post({
                uri: uri
            }, product, opts, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                publishResults = result.results;
                listingId = publishResults && publishResults.length && publishResults[0] && publishResults[0].listing_id;

                wCb(null, listingId);
            });
        }

        function getImageForProduct(listingId, wCb) {
            var uri = settings.products ? settings.products.create : '/listing';
            var formData;
            var images;
            var query;
            var oauth;

            if (!nativeProduct.productImages || !nativeProduct.productImages.length) {
                return wCb(null, listingId);
            }

            images = nativeProduct.productImages;

            oauth = {
                consumer_key   : opts.consumerKey,
                consumer_secret: opts.consumerSecret,
                token          : opts.token,
                token_secret   : opts.secret
            };

            query = {
                uri  : uri + '/' + listingId + '/images',
                oauth: oauth
            };

            async.each(images, function (image, eCb) {
                uploader.readImage(image.imageSrc, function (err, base64Data) {
                    if (err) {
                        return eCb(err);
                    }

                    formData = {
                        listing_id: listingId,
                        image     : {
                            value  : new Buffer(base64Data, 'base64'),
                            options: {
                                filename   : listingId + '.jpg',
                                contentType: 'image/jpg'
                            }
                        }
                    };

                    imageHelper.upload(query, formData, opts, function (err) {
                        if (err) {
                            return eCb(err);
                        }

                        eCb();
                    });
                });
            }, function (err) {
                if (err) {
                    return wCb();
                }

                wCb(null, listingId);
            });
        }

        waterfallFunctions.push(createProductOnEtsy, getImageForProduct);

        async.waterfall(waterfallFunctions, function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });

    }

    return {
        importProducts     : importProducts,
        syncChannel        : syncChannel,
        exportProducts     : exportProducts,
        getOnlyProducts    : getOnlyProducts,
        importOrders       : importOrders,
        getAll             : getAll,
        publishProduct     : publishProduct,
        unpublishProduct   : unpublishProduct,
        publishFulfillments: publishFulfillments
    };
};

