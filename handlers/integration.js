var mongoose = require('mongoose');
var async = require('async');
var CONSTANTS = require('../constants/mainConstants');
var ObjectId = mongoose.Types.ObjectId;
var _ = require('lodash');
var redisClient = require('../helpers/redisClient');

var Module = function (models, event) {
    var ConflictService = require('../services/conflict')(models);
    var IntegrationService = require('../services/integration')(models);
    var productService = require('../services/products')(models);
    var SettingsService = require('../services/settings')(models, event);
    var _getHelper = require('../helpers/integrationHelperRetriever')(models, event);
    var getHelper = _getHelper.getHelper;
    var getVersion = _getHelper.getVersion;
    var OrderService = require('../services/order')(models);
    var OrderRowsService = require('../services/orderRows')(models);
    var productPriceService = require('../services/productPrice')(models);
    var ChannelLinksService = require('../services/channelLinks')(models);

    var integrationStatsHelper = require('../helpers/integrationStatsComposer')(models);

    var FilterMapper = require('../helpers/filterMapper');

    function skipConflictProduct(channel, dbName, sku, callback) {
        ConflictService.findOneAndRemove({
            entity           : 'Product',
            'fields.info.SKU': sku,
            'fields.channel' : channel,
            'fields.type'    : {$exists: false}
        }, {dbName: dbName}, function (err) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    }

    function createConflictProduct(channel, dbName, sku, callback) {
        async.waterfall([
            function (wCb) {
                ConflictService.findOne({
                    entity           : 'Product',
                    'fields.info.SKU': sku,
                    'fields.channel' : channel,
                    'fields.type'    : {$exists: false}
                }, {
                    dbName: dbName
                }, function (err, product) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, product);
                });
            },

            function (product, wCb) {
                var groupId = (new ObjectId()).toString();
                var options = {
                    body  : product.fields,
                    dbName: dbName
                };
                var createdProductId;

                options.body.groupId = groupId;

                productService.createProduct(options, function (err, createdProduct) {
                    if (err) {
                        return wCb(err);
                    }

                    createdProductId = createdProduct._id;

                    wCb(null, createdProductId, product);
                });
            },

            function (createdProductId, product, wCb) {
                var channelType;
                var priceList;

                IntegrationService.findOne({
                    _id: channel
                }, {
                    dbName: dbName
                }, function (err, integration) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!integration) {
                        wCb(null, createdProductId, product);
                    }

                    channelType = integration.type;
                    priceList = integration.priceList;

                    wCb(null, createdProductId, product, channelType, priceList);
                });
            },

            function (createdProductId, product, channelType, priceList, wCb) {
                var conflictProductId = product._id;
                var channelLinksObj;
                var linkId;

                if (!channelType) {
                    return wCb(null, product._id);
                }

                switch (channelType) {
                    case 'etsy': {
                        linkId = product.fields.listing_id;
                        break;
                    }
                    case 'woo': {
                        linkId = product.fields.wooId + '|' + product.fields.wooVariantId;
                        break;
                    }
                    case 'shopify': {
                        linkId = product.fields.shopifyId + '|' + product.fields.shopifyVariantId;
                        break;
                    }
                    default: {
                        linkId = product.fields.magentoId + '|' + product.fields.info.SKU;
                    }
                }

                channelLinksObj = {
                    product  : createdProductId,
                    linkId   : linkId,
                    channel  : channel,
                    priceList: priceList,
                    dbName   : dbName
                };

                ChannelLinksService.create(channelLinksObj, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, conflictProductId);
                });
            },

            function (conflictProductId, wCb) {
                var query = {
                    _id: ObjectId(conflictProductId)
                };
                var options = {
                    dbName: dbName
                };

                ConflictService.findOneAndRemove(query, options, function (err) {
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

    function mergeConflictProduct(channel, dbName, sku, callback) {

        async.waterfall([
            function (wCb) {
                ConflictService.findOne({
                    entity           : 'Product',
                    'fields.info.SKU': sku,
                    'fields.channel' : channel,
                    'fields.type'    : {$exists: false}
                }, {
                    dbName: dbName
                }, function (err, magentoProduct) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, magentoProduct);
                });
            },

            function (magentoProduct, wCb) {
                var query = {
                    'info.SKU': sku
                };
                var updateObj = {
                    $set: magentoProduct && magentoProduct.fields
                };
                var options = {
                    dbName: dbName
                };

                productService.findOneAndUpdate(query, updateObj, options, function (err, oldProduct) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, oldProduct._id, magentoProduct);
                });
            },

            function (updatedProductId, product, wCb) {
                var channelType;
                var priceList;

                IntegrationService.findOne({
                    _id: channel
                }, {
                    dbName: dbName
                }, function (err, integration) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!integration) {
                        wCb(null, updatedProductId, product);
                    }

                    channelType = integration.type;
                    priceList = integration.priceList;

                    wCb(null, updatedProductId, product, channelType, priceList);
                });
            },

            function (createdProductId, product, channelType, priceList, wCb) {
                var conflictProductId = product._id;
                var channelLinksObj;
                var linkId;

                if (!channelType) {
                    return wCb();
                }

                switch (channelType) {
                    case 'etsy': {
                        linkId = conflictProductId;
                        break;
                    }
                    case 'woo': {
                        linkId = product.fields.wooId + '|' + product.fields.wooVariantId;
                        break;
                    }
                    case 'shopify': {
                        linkId = product.fields.shopifyId + '|' + product.fields.shopifyVariantId;
                        break;
                    }
                    default: {
                        linkId = product.fields.magentoId + '|' + product.fields.info.SKU;
                    }
                }

                channelLinksObj = {
                    product  : createdProductId,
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
            },

            function (wCb) {
                var query = {
                    entity           : 'Product',
                    'fields.info.SKU': sku
                };
                var options = {
                    dbName: dbName
                };

                ConflictService.findOneAndRemove(query, options, function (err) {
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

    function saveConflictedProduct(dbName, conflict, callback) {
        var action = conflict.action || 'duplicate';
        var sku = conflict.sku;
        var channel = ObjectId(conflict.channel.toString());

        if (action === 'skip') {
            skipConflictProduct(channel, dbName, sku, callback);
        } else if (action === 'import') {
            createConflictProduct(channel, dbName, sku, callback);
        } else {
            mergeConflictProduct(channel, dbName, sku, callback);
        }
    }

    function getDataForManageConflicts(opts, allCallback) {
        var db = opts.dbName;
        var conflictProducts = [];
        var sortObject = opts.sortObject;
        var channel = opts.channel;

        async.waterfall([
            function (wCb) {
                var skus;

                ConflictService.getConflicts({
                    'fields.channel': ObjectId(channel.channel)
                }, db, function (err, conflicts) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!conflicts && !conflicts.length) {
                        return wCb(null, null, null); // todo change it
                    }

                    conflictProducts = _.pluck(conflicts, 'fields');
                    skus = _.pluck(conflictProducts, 'info.SKU');

                    wCb(null, skus, conflictProducts);
                });

            },

            function (skus, conflictItems, wCb) {
                if (!skus || !skus.length || !conflictProducts) {
                    return wCb();
                }

                productService.find({'info.SKU': {$in: skus}}, {
                    dbName: db,
                    info  : 1,
                    name  : 1
                }, function (err, products) {
                    if (err) {
                        return wCb(err);
                    }

                    if (Object.keys(sortObject).length) {
                        conflictItems = _.sortByOrder(conflictItems, sortObject.field[0], sortObject.value[0]);
                    }

                    conflictProducts = conflictItems.concat(products);
                    conflictProducts = _.groupBy(conflictProducts, 'info.SKU');

                    wCb();
                });
            }
        ], function (err) {
            if (err) {
                return allCallback(err);
            }

            allCallback(null, conflictProducts);
        });
    }

    function saveConflictedProducts(opts, allCallback) {
        var conflicts = opts.conflicts;
        var dbName = opts.dbName;

        async.eachLimit(conflicts, 1, function (conflict, eachCb) {
            saveConflictedProduct(dbName, conflict, function (err) {
                if (err) {
                    return eachCb(err);
                }

                eachCb();
            });
        }, function (err) {
            if (err) {
                return allCallback(err);
            }

            allCallback();
        });
    }

    /* function getIntegrationSettings(userId, type, dbName, version, callback) {
     async.parallel({
     getIntegrationSettings: function (pCb) {
     var query = {
     user: userId,
     type: type
     };
     var options = {
     dbName: dbName
     };

     IntegrationService.findOne(query, options, function (err, result) {
     if (err) {
     return pCb(err);
     }

     pCb(null, result);
     });
     },

     getUrlSettings: function (pCb) {
     SettingsService.getSettingsUrlsForApp({
     app    : type,
     dbName : dbName,
     version: version
     }, function (err, result) {
     if (err) {
     return pCb(err);
     }

     pCb(null, result);
     });
     }
     }, function (err, settings) {
     if (err) {
     return callback(err);
     }

     callback(null, settings);
     });
     }*/

    function getSettingsForAllChannel(userId, dbName, callback) {
        var channelsSettings = [];

        async.parallel({
            getChannels: function (pCb) {
                IntegrationService.find({
                    dbName   : dbName,
                    connected: true
                }, {dbName: dbName}, function (err, channels) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, channels);
                });
            },

            getUrlSettings: function (pCb) {
                SettingsService.findOne({
                    name: 'integration',
                    apps: {$exists: true}
                }, {
                    dbName: dbName
                }, function (err, settings) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, settings);
                });
            }
        }, function (err, result) {
            var channels = result.getChannels;
            var urlSettings = result.getUrlSettings;
            var settings;
            var error;

            if (err) {
                return callback(err);
            }

            if (!channels || !channels.length) {
                error = new Error('There are no connected channels. Please, connect required channel(s) to start synchronization process');
                error.status = 404;

                return callback(error);
            }

            if (!urlSettings || !urlSettings.apps || !urlSettings.apps.magento || !urlSettings.apps.shopify || !urlSettings.apps.shopify.v1 || !urlSettings.apps.magento.v2) {
                error = new Error('Invalid integrations settings');
                error.status = 404;

                return callback(error);
            }

            channels.forEach(function (channel) {
                var version = getVersion(channel.type);

                settings = {
                    _id                 : channel._id,
                    version             : channel.version,
                    connected           : channel.connected,
                    warehouseSettings   : channel.warehouseSettings,
                    bankAccount         : channel.bankAccount,
                    priceList           : channel.priceList,
                    consumerSecret      : channel.consumerSecret,
                    consumerKey         : channel.consumerKey,
                    secret              : channel.secret,
                    token               : channel.token,
                    active              : channel.active,
                    updateShippingMethod: channel.updateShippingMethod,
                    updateShippingStatus: channel.updateShippingStatus,
                    shippingMethod      : channel.shippingMethod,
                    baseUrl             : channel.baseUrl,
                    password            : channel.password,
                    username            : channel.username,
                    user                : channel.user,
                    type                : channel.type,
                    dbName              : channel.dbName,
                    channelName         : channel.channelName,
                    ordersDate          : channel.ordersDate,
                    userId              : userId,
                    channel             : channel._id,
                    settings            : urlSettings.apps[channel.type][version]
                };

                channelsSettings.push(settings);
            });

            callback(null, channelsSettings);
        });
    }

    this.getConflictsData = function (req, res, next) {
        var type = req.params.type || CONSTANTS.INTEGRATION.MAGENTO;
        var query = req.query;
        var sortObject = query.sortObject || {};
        var filterObj = query.filter;
        var token = req.session[type] && req.session[type].token;
        var baseUrl = req.session[type] && req.session[type].baseUrl;
        var dbName = req.session.lastDb;
        var userId = req.session.uId;
        var channel = JSON.parse(filterObj);
        var opts = {
            token     : token,
            baseUrl   : baseUrl,
            dbName    : dbName,
            userId    : userId,
            sortObject: sortObject,
            channel   : channel
        };

        getDataForManageConflicts(opts, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.saveConflictData = function (req, res, next) {
        var body = req.body;
        var type = req.params.type || CONSTANTS.INTEGRATION.MAGENTO;
        var token = req.session[type] && req.session[type].token;
        var baseUrl = req.session[type] && req.session[type].baseUrl;
        var dbName = req.session.lastDb;
        var userId = req.session.uId;
        var opts = {
            token    : token,
            baseUrl  : baseUrl,
            dbName   : dbName,
            userId   : userId,
            conflicts: body.conflicts
        };

        saveConflictedProducts(opts, function (err, result) {
            if (err) {
                return next(err);
            }

            integrationStatsHelper(dbName, function (err, stats) {
                if (err) {
                    return next(err);
                }

                event.emit('recollectedStats', {dbName: dbName, stats: stats});
                redisClient.writeToStorage('syncStats', dbName, JSON.stringify(stats));

                res.status(200).send(result);
            });
        });
    };

    this.syncAll = function (req, res, next) {
        var userId = req.session.uId;
        var dbName = req.session.lastDb;
        var error;
        /*var consumers = require('../helpers/rmConsummers')(dbName, event, models);

         global.rm.loadSubscribers(consumers);*/

        getSettingsForAllChannel(userId, dbName, function (err, settings) {
            if (err) {
                return next(err);
            }

            if (!settings || !settings.length) {
                error = new Error('Nothing to sync');
                error.status = 404;

                return next(error);
            }

            async.each(settings, function (setting, eCb) {
                var redisKey = setting._id; // setting.type + '|' + setting.channelName;
                var redisValue = JSON.stringify(setting);

                redisClient.hSetNXToStorage('sync', redisKey, redisValue);
                redisClient.hSetNXToStorage('integration', redisKey, redisValue);

                eCb();
            }, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send('Sync request added to queue');
            });
        });
    };

    this.getUnlinkedProducts = function (req, res, next) {
        var query = req.query;
        var dbName = req.session.lastDb;
        var filter = query.filter;
        var error;
        var filterMapper = new FilterMapper();
        var filterObj;
        var contentType = query.contentType;
        var channel;

        if (!filter) {
            error = new Error('Bad request parameters');
            error.status = 400;

            return next(error);
        }

        filter = JSON.parse(filter);

        channel = filter.channel;

        if (channel) {

            return ConflictService.find({
                entity          : 'Product',
                type            : 'unlinked',
                'fields.channel': ObjectId(channel)
            }, {
                dbName: dbName
            }, function (err, unlinkedProducts) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(unlinkedProducts);
            });
        }

        filterObj = filterMapper.mapFilter(filter, contentType);
        filterObj.entity = 'OrderRow';
        filterObj.type = 'unlinked';

        ConflictService.getUnlinkedProdByOrder(dbName, filterObj, function (err, unlinkedProducts) {
            if (err) {
                return next(err);
            }

            res.status(200).send(unlinkedProducts);
        });
    };

    function createChannelLink(opts, callback) {
        var productId = opts.productId;
        var fields = opts.fields;
        var channel = opts.channel;
        var priceList = opts.priceList;
        var dbName = opts.dbName;
        var channelType = opts.channelType;

        var channelLinksObj = {
            product  : productId,
            channel  : channel,
            priceList: priceList,
            dbName   : dbName
        };

        switch (channelType) {
            case 'magento':
                channelLinksObj.linkId = fields.id + '|' + (fields.nativeSKU || fields.sku);
                break;
            case 'shopify' :
            case 'woo' :
                channelLinksObj.linkId = fields.mainId + '|' + fields.id;
                break;
            case 'etsy' :
                channelLinksObj.linkId = fields.id;
                break;
            // skip default
        }

        ChannelLinksService.create(channelLinksObj, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, productId);
        });
    }

    function createProduct(opts, callback) {
        var dbName = opts.dbName;
        var priceList = opts.priceList;
        var fields = opts.fields;
        var channel = opts.channel;
        var channelType = opts.channelType;

        async.waterfall([
            function (wCb) {
                var body = {
                    name: fields.name,
                    info: {
                        SKU        : fields.sku,
                        categories : fields.categories || [ObjectId(CONSTANTS.DEFAULT_PRODUCT_CATEGORY_ID)],
                        productType: [ObjectId(CONSTANTS.DEFAULT_PRODUCT_TYPE_ID)]
                    },

                    groupId: fields.groupId || new ObjectId().toString()
                };

                if (fields.imageSrc) {
                    body.imageSrc = fields.imageSrc;
                }

                productService.createProduct({
                    dbName: dbName,
                    body  : body
                }, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, result._id);
                });
            },

            function (productId, wCb) {
                var newProductPrice = {
                    product: productId,
                    prices : [{
                        count: 1,
                        price: fields.price
                    }],

                    priceLists: priceList,
                    dbName    : dbName
                };

                productPriceService.create(
                    newProductPrice,
                    function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, productId);
                    });
            },

            function (productId, wCb) {
                createChannelLink({
                    productId  : productId,
                    fields     : fields,
                    channel    : channel,
                    priceList  : priceList,
                    dbName     : dbName,
                    channelType: channelType
                }, wCb);
            }
        ], function (err, productId) {
            if (err) {
                return callback(err);
            }

            callback(null, productId);
        });
    }

    function createOrderRows(opts, callback) {
        var id = opts.id;
        var price = opts.price;
        var orderRows = opts.orderRows;
        var warehouseId = opts.warehouseId;
        var orderRowsArray = orderRows.map(function (el) {
            var fields = el.fields;
            var orderRow = {
                product  : id,
                warehouse: warehouseId,
                subTotal : fields.quantity * price,
                unitPrice: price,
                order    : fields.order,
                quantity : fields.quantity
            };

            return orderRow;
        });

        OrderRowsService.createMulti({dbName: opts.dbName, arrayRows: orderRowsArray}, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, _.pluck(orderRows, 'fields.order'));
        });
    }

    function checkForUpdateOrders(orderIds, dbName, wCb) {
        var criteria = {
            'fields.order': {$in: orderIds},
            entity        : 'OrderRow',
            type          : 'unlinked'
        };

        function updateOrderWorkflow(ids) {
            OrderService.find({_id: {$in: ids}}, {dbName: dbName}, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                async.each(result, function (order, eCb) {
                    OrderService.findByIdAndUpdate(order._id, {$set: {workflow: order.tempWorkflow}}, {dbName: dbName}, function (err) {
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
            });
        }

        ConflictService
            .find(criteria, {dbName: dbName})
            .lean()
            .exec(function (err, result) {
                var willUpdated;
                var afterFixArray;

                if (err) {
                    return wCb(err);
                }

                afterFixArray = _.unique(_.pluck(result, 'fields.order'));
                willUpdated = _.difference(orderIds, afterFixArray);

                updateOrderWorkflow(willUpdated);
            });
    }

    this.updateUnlinkedProduct = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var id = req.params.id;
        var data = {};
        var error;
        var action = body.action;
        var isValidAutoBuilt = body.isBuilt;
        var isValidBuilt = body.sku && body.name;
        var isValidLink = body.linkedProductId;
        var isValidCancelBuild = typeof body.isValid === 'boolean' && body.hasOwnProperty('sku') && body.hasOwnProperty('name');
        var isValidUnlink = body.action === 'unlink';
        var isValidSingleBuilt = body.action === 'singleBuilt';
        var warehouse;
        var priceList;
        var channelType;
        var channel;
        var waterfallTasks;
        var withoutOrder = body.withoutOrder;
        var price;

        function getConflict(wCb) {
            ConflictService.findOne({_id: id}, {dbName: dbName}, function (err, conflict) {
                if (err) {
                    return wCb(err);
                }

                channel = conflict.fields.channel;
                price = conflict.fields.price;

                wCb(null, conflict);
            });
        }

        function getChannelInfo(conflict, wCb) {
            IntegrationService.findOne({_id: channel}, {dbName: dbName}, function (err, channelObj) {
                if (err) {
                    return wCb(err);
                }

                warehouse = channelObj.warehouseSettings.warehouse;
                priceList = channelObj.priceList;
                channelType = channelObj.type;

                wCb(null, conflict);
            });
        }

        function creatingProduct(conflict, wCb) {
            var conflictObj = conflict.toJSON().fields;

            conflictObj.sku = body.sku || conflictObj.sku;
            conflictObj.name = body.name || conflictObj.name;

            createProduct({
                dbName     : dbName,
                priceList  : priceList,
                fields     : conflictObj,
                channel    : channel,
                channelType: channelType
            }, function (err, productId) {
                if (err) {
                    return wCb(err);
                }

                if (!conflictObj.hasOrder) {
                    return wCb(null, null);
                }

                wCb(null, productId);
            });
        }

        function creatingOrderRows(productId, wCb) {

            ConflictService
                .find({
                    entity          : 'OrderRow',
                    type            : 'unlinked',
                    'fields.product': ObjectId(id)
                }, {
                    dbName: dbName
                })
                .lean()
                .exec(function (err, orderRows) {
                    if (err) {
                        return wCb(err);
                    }

                    createOrderRows({
                        orderRows  : orderRows,
                        id         : productId,
                        price      : price,
                        warehouseId: warehouse,
                        dbName     : dbName
                    }, wCb);
                });
        }

        function removingOrderRows(orderIds, wCb) {

            ConflictService.remove({
                entity          : 'OrderRow',
                type            : 'unlinked',
                'fields.product': ObjectId(id)
            }, {
                dbName: dbName
            }, function (err) {
                if (err) {
                    return wCb(err);
                }

                wCb(null, orderIds, dbName);
            });
        }

        function removeConflict(orderIds, wCb) {
            ConflictService.findOneAndRemove({
                _id: id
            }, {dbName: dbName}, function (err) {
                if (err) {
                    return wCb(err);
                }

                wCb(null, orderIds);
            });
        }

        function creatingChannelLink(conflict, wCb) {
            var fields = conflict.fields;

            createChannelLink({
                productId  : body.linkedProductId,
                fields     : fields,
                channel    : channel,
                priceList  : priceList,
                dbName     : dbName,
                channelType: channelType
            }, wCb);
        }

        if (!isValidAutoBuilt && !isValidBuilt && !isValidLink && !isValidCancelBuild && !isValidUnlink && !isValidSingleBuilt) {
            error = new Error('Bad request parameters');
            error.status = 400;

            return next(error);
        }

        waterfallTasks = [getConflict, getChannelInfo];

        if (action === 'singleBuilt') {
            if (withoutOrder) {
                waterfallTasks.push(creatingProduct, removeConflict);
            } else {
                waterfallTasks.push(creatingProduct, creatingOrderRows, removeConflict, removingOrderRows, checkForUpdateOrders);
            }

            return async.waterfall(waterfallTasks, function (err) {
                if (err) {
                    return next(err);
                }

                integrationStatsHelper(dbName, function (err, stats) {
                    if (err) {
                        return next(err);
                    }

                    event.emit('recollectedStats', {dbName: dbName, stats: stats});
                    redisClient.writeToStorage('syncStats', dbName, JSON.stringify(stats));

                    res.status(200).send({status: 'success'});
                });
            });
        }

        if (action === 'singleLink') {
            if (withoutOrder) {
                waterfallTasks.push(creatingChannelLink, removeConflict);
            } else {
                waterfallTasks.push(creatingChannelLink, creatingOrderRows, removeConflict, removingOrderRows, checkForUpdateOrders);
            }

            return async.waterfall(waterfallTasks, function (err) {
                if (err) {
                    return next(err);
                }

                integrationStatsHelper(dbName, function (err, stats) {
                    if (err) {
                        return next(err);
                    }

                    event.emit('recollectedStats', {dbName: dbName, stats: stats});
                    redisClient.writeToStorage('syncStats', dbName, JSON.stringify(stats));

                    res.status(200).send({status: 'success'});
                });
            });
        }

        function updateByAction(typOfAction) {
            switch (typOfAction) {
                case 'autoBuilt':
                    data['fields.isBuilt'] = true;

                    break;
                case 'built':
                    data['fields.isValid'] = true;
                    data['fields.isBuilt'] = true;
                    data['fields.name'] = body.name;
                    data['fields.sku'] = body.sku;

                    break;
                case 'link':
                    data['fields.linkedProductId'] = body.linkedProductId;

                    break;
                case 'cancelBuilt':
                    data['fields.isValid'] = body.isValid;
                    data['fields.isBuilt'] = false;
                    data['fields.name'] = body.name;
                    data['fields.sku'] = body.sku;

                    break;
                case 'unlink':
                    data['fields.linkedProductId'] = null;

                    break;
                default:
                    error = new Error('Bad request action');
                    error.status = 400;

                    return next(error);
            }
        }

        updateByAction(action);

        ConflictService.findByIdAndUpdate(id, {$set: data}, {dbName: dbName}, function (err, updated) {
            if (err) {
                return next(err);
            }

            res.status(200).send(updated);
        });
    };

    this.linkOrder = function (req, res, next) {
        var id = req.params.id;
        var session = req.session;
        var dbName = session.lastDb;
        var warehouse;
        var priceList;
        var channel;
        var channelType;
        var productIds;
        var orderIds = [];

        function linkProduct(fields, orderRows, eCb) {

            async.waterfall([
                function (wCb) {
                    createChannelLink({
                        productId  : fields.linkedProductId,
                        fields     : fields,
                        channel    : channel,
                        priceList  : priceList,
                        dbName     : dbName,
                        channelType: channelType
                    }, wCb);
                },

                function (productId, wCb) {
                    createOrderRows({
                        orderRows  : orderRows,
                        id         : productId,
                        price      : fields.price,
                        warehouseId: warehouse,
                        dbName     : dbName
                    }, wCb);
                }
            ], function (err, ids) {
                if (err) {
                    return eCb(err);
                }

                orderIds = orderIds.concat(ids);

                eCb();
            });
        }

        function buildProduct(fields, orderRows, eCb) {

            async.waterfall([function (wCb) {
                createProduct({
                    dbName     : dbName,
                    priceList  : priceList,
                    fields     : fields,
                    channel    : channel,
                    channelType: channelType
                }, wCb);
            },
                function (productId, wCb) {

                    createOrderRows({
                        orderRows  : orderRows,
                        id         : productId,
                        price      : fields.price,
                        warehouseId: warehouse,
                        dbName     : dbName
                    }, wCb);
                }
            ], function (err, ids) {
                if (err) {
                    return eCb(err);
                }

                orderIds = orderIds.concat(ids);

                eCb();
            });
        }

        async.waterfall([
            function (wCb) {
                OrderService.findById(id, {dbName: dbName}, function (err, order) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!order) {
                        channel = id;
                    } else {
                        channel = order.channel;
                    }

                    wCb();
                });
            },

            function (wCb) {
                IntegrationService.findOne({_id: channel}, {dbName: dbName}, function (err, channelObj) {
                    if (err) {
                        return wCb(err);
                    }

                    warehouse = channelObj && channelObj.warehouseSettings ? channelObj.warehouseSettings.warehouse : null;
                    priceList = channelObj && channelObj.priceList || null;
                    channelType = channelObj && channelObj.type || null;

                    wCb();
                });
            },

            function (wCb) {

                ConflictService
                    .find({
                        entity        : 'OrderRow',
                        type          : 'unlinked',
                        'fields.order': ObjectId(id)
                    }, {dbName: dbName})
                    .lean()
                    .exec(function (err, orderRows) {
                        if (err) {
                            return wCb(err);
                        }

                        productIds = _.pluck(orderRows, 'fields.product');

                        ConflictService.find({_id: {$in: productIds}}, {dbName: dbName}, function (err, unlinkedProducts) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb(null, unlinkedProducts);
                        });
                    });
            },

            function (unlinkedProducts, wCb) {
                async.each(unlinkedProducts, function (unlinkedProduct, eCb) {
                    var fields = unlinkedProduct.fields;
                    var linkedProductId = fields.linkedProductId;

                    ConflictService
                        .find({
                            entity          : 'OrderRow',
                            type            : 'unlinked',
                            'fields.product': unlinkedProduct._id
                        }, {
                            dbName: dbName
                        })
                        .lean()
                        .exec(function (err, orderRows) {
                            if (err) {
                                return eCb(err);
                            }

                            if (linkedProductId) {
                                return linkProduct(fields, orderRows, eCb);
                            }

                            buildProduct(fields, orderRows, eCb);
                        });
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, _.pluck(unlinkedProducts, '_id'));
                });
            },

            function (unlinkedProdIds, wCb) {
                ConflictService.remove({
                    entity          : 'OrderRow',
                    type            : 'unlinked',
                    'fields.product': {$in: unlinkedProdIds}
                }, {
                    dbName: dbName
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, unlinkedProdIds);
                });
            },

            function (unlinkedProdIds, wCb) {
                ConflictService.remove({
                    _id: {$in: unlinkedProdIds}
                }, {
                    dbName: dbName
                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, orderIds, dbName);
                });
            },

            checkForUpdateOrders
        ], function (err) {
            if (err) {
                return next(err);
            }

            integrationStatsHelper(dbName, function (err, stats) {
                if (err) {
                    return next(err);
                }

                event.emit('recollectedStats', {dbName: dbName, stats: stats});
                redisClient.writeToStorage('syncStats', dbName, JSON.stringify(stats));

                res.status(200).send({status: 'success'});
            });
        });
    };

    this.countOfConflictsAndImported = function (req, res, next) {
        var db = req.session.lastDb;

        integrationStatsHelper(db, function (err, data) {
            if (err) {
                return next(err);
            }

            redisClient.writeToStorage('syncStats', db, JSON.stringify(data));
            res.status(200).send(data);
        });
    };

    this.updateShopifyOrder = function (req, res, next) {
        var body = req.body;

        res.status(200).send(body);
    };
};

module.exports = Module;
