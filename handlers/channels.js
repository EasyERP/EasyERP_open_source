'use strict';

var crypto = require('crypto');
var request = require('request');
var async = require('async');
var requestHelper = require('../helpers/tracker');
var Errors = require('../helpers/errors');
var redisStore = require('../helpers/redisClient');
var MAINCONSTANTS = require('../constants/mainConstants');
var logger = require('../helpers/logger');
var WooCommerceApi = require('../helpers/wooCommerceAPI');
var _ = require('lodash');
var redisClient = require('../helpers/redisClient');

var Module = function (models, event) {
        var settingsService = require('../services/settings')(models, event);
        var IntegrationsService = require('../services/integration')(models);
        var SyncLogsService = require('../services/syncLogs')(models);
        var etsyHelper = require('../helpers/etsy')(models);
        var oauthService = require('../helpers/oauthTracker')(models);
        var organizationSetting = require('../services/organizationSetting')(models);
        var priceListService = require('../services/priceList')(models);
        var integrationStatsHelper = require('../helpers/integrationStatsComposer')(models);
        var _getHelper = require('../helpers/integrationHelperRetriever')(models, event);
        var getHelper = _getHelper.getHelper;
        var getVersion = _getHelper.getVersion;
        var webHooksArray = [
            'product.created',
            'customer.created',
            'order.created'
        ];

        function validateShopify(password, shopifyResult) {
            return password && (!shopifyResult || !shopifyResult.request || !shopifyResult.request.headers || !shopifyResult.request.headers.authorization /*|| !shopifyResult.body.errors*/);
        }

        function getVersionApi(wooVersion) {
            var version = 'v1';

            if (wooVersion >= '2.7') {
                version = 'v2';
            }

            return version;
        }

        function encryptPassword(password) {
            var cipher;
            var encryptedPass;

            cipher = crypto.createCipher('aes192', 'easyErp');
            encryptedPass = cipher.update(password, 'utf8', 'hex');
            encryptedPass += cipher.final('hex');

            return encryptedPass;
        }

        function urlParser(url) {
            var newUrl = url;

            if (typeof url === 'string') {
                if (url.slice(-1) === '/') {
                    newUrl = url.slice(0, url.length - 1);
                }

                if (url.indexOf('http') < 0) {
                    newUrl = 'http://' + newUrl;
                }
            }

            return newUrl;
        }

        function saveIntegrationWoo(req, res, next) {
            var db = req.session.lastDb;
            var body = req.body;
            var baseUrl = urlParser(body.baseUrl);
            var username = body.username;
            var type = req.params.type;
            var id = req.params.id;
            var password = body.password;
            var warehouse = body.warehouse || null;
            var location = body.location || null;
            var priceList = body.priceList || null;
            var channelName = body.channelName;
            var ordersDate = body.ordersDate;
            var connected = body.connected;
            var version = body.version || '2.6.14';
            var uId = req.session.uId;
            var autoGet = body.automatingGetProduct;
            var waterfallTasks;
            var model;
            var token;
            var errorMsg;
            var redisKey;
            var woo;
            var err;

            body.baseUrl = baseUrl;

            function saveOrUpdateIntegration(waterfallCb) {
                var _query = id ? {_id: id} : {channelName: channelName, baseUrl: baseUrl};

                waterfallCb = waterfallCb || arguments[arguments.length - 1];

                model = {
                    username         : username,
                    password         : password,
                    dbName           : db,
                    baseUrl          : baseUrl,
                    user             : uId,
                    priceList        : priceList,
                    version          : version,
                    ordersDate       : ordersDate,
                    connected        : connected,
                    warehouseSettings: {
                        warehouse: warehouse,
                        location : location
                    },

                    channelName: channelName
                };

                if (!id) {
                    model.connected = false;
                }

                if (typeof(token) === 'object') {
                    errorMsg = 'Bad authorization data';
                    err = new Errors.UnAuthorized(errorMsg);

                    return waterfallCb(err);
                }

                if (type) {
                    model.type = type;
                }

                IntegrationsService.findOneAndUpdate(_query, model, {
                    upsert: true,
                    dbName: db,
                    new   : true
                }, function (err, result) {
                    var error;

                    if (err) {
                        return waterfallCb(err);
                    }

                    if (!result) {
                        error = new Error('Channel not found');
                        error.status = 400;

                        return waterfallCb(error);
                    }

                    redisKey = result._id.toString();
                    /*redisStore.hSetNXToStorage('integration', redisKey, JSON.stringify(result), function () {
                     });

                     if (!id) {
                     redisStore.hSetNXToStorage('syncGetAll', redisKey, JSON.stringify(result));
                     redisStore.sAdd('syncInProgress', db + '_' + redisKey);
                     }*/

                    waterfallCb(null, result);
                });
            }

            function checkAuth(waterfallCb) {
                var error;

                if (!username || !password || !baseUrl) {
                    error = new Error('Invalid input parameters');
                    error.status = 400;

                    return waterfallCb(error);
                }

                woo = new WooCommerceApi({
                    url            : baseUrl,
                    consumerKey    : username,
                    consumerSecret : password,
                    wpAPI          : true,
                    version        : 'wc/' + getVersionApi(version),
                    queryStringAuth: true
                });

                woo.get('', function (err, data, res) {
                    var resJSON;
                    var error;

                    if (err) {
                        return waterfallCb(err);
                    }

                    resJSON = JSON.parse(res);

                    if ((resJSON.data && resJSON.data.status === 401 && resJSON.code === 'woocommerce_rest_authentication_error') || resJSON.hasOwnProperty('error')) {
                        error = new Error('Invalid signature data provided');
                        error.status = 400;

                        return waterfallCb(error);
                    }

                    waterfallCb();
                });
            }

            waterfallTasks = [checkAuth, saveOrUpdateIntegration];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (!autoGet) {
                    res.status(200).send(result);
                } else {
                    req.query.channel = result._id;
                    getOnlyProducts(req, res, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });
                }

                integrationStatsHelper(db, function (err, data) {
                    if (err) {
                        return logger.error(err);
                    }

                    redisStore.writeToStorage('syncStats', db, JSON.stringify(data));
                });

                woo.get('webhooks', function (err, data, res) {
                    var existingWebHooks;

                    if (err) {
                        return console.log(err);
                    }

                    existingWebHooks = res ? JSON.parse(res) : [];
                    async.each(webHooksArray, function (webHook, eCb) {
                        var splitted;
                        var webHookObj;

                        if (_.findWhere(existingWebHooks, {name: 'EASYERP', topic: webHook})) {
                            return eCb();
                        }

                        splitted = webHook.split('.');
                        webHookObj = {
                            name        : 'EASYERP',
                            topic       : webHook,
                            resource    : splitted[0],
                            event       : splitted[1],
                            delivery_url: MAINCONSTANTS.INTEGRATION.WOO_WEBHOOK_REMOTE_URI + redisKey.toString() + '/' + db,
                            secret      : 'EasyERP'
                        };

                        woo.post('webhooks', webHookObj, function (err) {
                            if (err) {
                                return eCb(err);
                            }

                            eCb();
                        });
                    }, function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log('Hooks for WOO channel successfully added');
                    });
                });
            });
        }

        function createIntegrationsEtsy(req, res, next) {
            var db = req.session.lastDb;
            var body = req.body;
            var type = req.params.type;
            var oauth = oauthService._oauth();
            var uId = req.session.uId;
            var id = req.params.id;
            var ordersDate = body.ordersDate;
            var autoGet = body.automatingGetProduct;
            var waterFallTasks;
            var redisKey;

            function updateChannel(result, waterFallCb) {
                var _query = id ? {_id: id} : {user: uId, type: type};
                var oauthSettings;

                if (typeof result === 'function') {
                    waterFallCb = result;
                    result = null;
                    delete body.token;
                    delete body.secret;
                } else {
                    oauthSettings = result;
                }

                if (!id) {
                    body.dbName = db;

                    IntegrationsService.create(body, function (err, result) {
                        if (err) {
                            return waterFallCb(err);
                        }

                        waterFallCb(null, result, oauthSettings);
                    });
                } else {
                    IntegrationsService.findOneAndUpdate(_query, body, {
                        upsert: true,
                        dbName: db,
                        new   : true
                    }, function (err, result) {
                        if (err) {
                            return waterFallCb(err);
                        }

                        waterFallCb(null, result, oauthSettings);
                    });
                }
            }

            waterFallTasks = [updateChannel];

            if (!id) {
                waterFallTasks.unshift(function (wCb) {
                    var consumerKey = body.username;
                    var consumerSecret = body.password;
                    var shopName = body.shopname;

                    delete body.username;
                    delete body.password;

                    oauth.getOAuthRequestToken(function (err, oauth_token, oauth_token_secret, results) {
                        if (err) {
                            return wCb(err);
                        }

                        body.consumerKey = consumerKey;
                        body.consumerSecret = consumerSecret;
                        body.token = oauth_token;
                        body.secret = oauth_token_secret;
                        body.dbName = db;
                        body.user = uId;
                        body.ordersDate = ordersDate;
                        body.baseUrl = MAINCONSTANTS.INTEGRATION.ETSY_BASE_URL;
                        body.username = shopName;
                        body.warehouseSettings = {
                            warehouse: body.warehouse,
                            location : body.location
                        };
                        body.type = type;

                        wCb(null, results);
                    });
                });
            }

            async.waterfall(waterFallTasks, function (err, result, oauthSettings) {
                if (err) {
                    return next(err);
                }

                if (oauthSettings) {
                    result = result.toJSON();
                    result.login_url = oauthSettings.login_url;
                }

                if (!autoGet) {
                    res.status(200).send(result);
                } else {
                    req.query.channel = result._id;
                    getOnlyProducts(req, res, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });
                }

                integrationStatsHelper(db, function (err, data) {
                    if (err) {
                        return logger.error(err);
                    }

                    redisStore.writeToStorage('syncStats', db, JSON.stringify(data));
                });
            });
        }

        function getOnlyProducts(req, res, cb) {
            var dbName = req.session.lastDb;
            var query = req.query;
            var channelId = query.channel;
            var type = query.type;
            var helper = getHelper(type);

            async.parallel({
                getChannels: function (pCb) {
                    IntegrationsService.findOne({
                        _id: channelId
                    }, {dbName: dbName}, function (err, channel) {
                        if (err) {
                            return pCb(err);
                        }

                        if (!channel) {
                            err = new Error('Channel not found');
                            err.status = 404;

                            return pCb(err);
                        }

                        pCb(null, channel.toJSON());
                    });
                },

                getUrlSettings: function (pCb) {
                    settingsService.findOne({
                        name: 'integration',
                        apps: {$exists: true}
                    }, {
                        dbName: dbName
                    }, function (err, settings) {
                        if (err) {
                            return pCb(err);
                        }

                        if (!settings) {
                            err = new Error('Settings not found');
                            err.status = 404;

                            return pCb(err);
                        }

                        pCb(null, settings);
                    });
                }
            }, function (err, result) {
                var channel;
                var setting;
                var version;

                if (err) {
                    return cb(err);
                }

                channel = result.getChannels;
                setting = result.getUrlSettings;
                version = getVersion(channel.type);

                helper.getOnlyProducts({
                    _id              : channel._id,
                    channelName      : channel.channelName,
                    dbName           : dbName,
                    username         : channel.username,
                    password         : channel.password,
                    baseUrl          : channel.baseUrl,
                    user             : channel.user,
                    priceList        : channel.priceList,
                    token            : channel.token,
                    secret           : channel.secret,
                    version          : version,
                    settings         : setting.apps[channel.type][version],
                    warehouseSettings: {
                        warehouse: channel.warehouseSettings && channel.warehouseSettings.warehouse,
                        location : channel.warehouseSettings && channel.warehouseSettings.location
                    }
                }, function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    integrationStatsHelper(dbName, function (err, stats) {
                        if (err) {
                            return cb(err);
                        }

                        event.emit('recollectedStats', {dbName: dbName, stats: stats});
                        event.emit('sendMessage', {dbName: dbName, message: 'Get products done', view: ''});
                        redisClient.writeToStorage('syncStats', dbName, JSON.stringify(stats));

                        cb(null, channel);
                    });

                });
            });
        }

        this.getOnlyProducts = function (req, res, next) {
            var dbName = req.session.lastDb;

            return getOnlyProducts(req, res, function (err, resultChannel) {
                if (err) {
                    return next(err);
                }

                integrationStatsHelper(dbName, function (err, stats) {
                    if (err) {
                        return next(err);
                    }

                    event.emit('recollectedStats', {dbName: dbName, stats: stats});
                    event.emit('sendMessage', {dbName: dbName, message: 'Get products done', view: ''});
                    redisClient.writeToStorage('syncStats', dbName, JSON.stringify(stats));

                    res.status(200).send(resultChannel);
                });
            });
        };

        this.approveIntegrationEtsy = function (req, res, next) {
            var db = req.session.lastDb;
            var uId = req.session.uId;
            var query = req.query;
            var verify = query.oauth_verifier;
            var token = query.oauth_token;
            var oauth = oauthService._oauth();
            var redisKey;
            var error;

            IntegrationsService.findOne({
                token: token
            }, {
                dbName: db
            }, function (err, doc) {

                if (err) {
                    return next(err);
                }

                redisKey = doc._id;

                oauth.getOAuthAccessToken(doc.token, doc.secret, verify, function (err, oauthAccessToken, oauthAccessTokenSecret) {

                    if (err) {
                        return next(err);
                    }

                    oauthService.get({
                        uri : '/',
                        shop: true
                    }, {
                        baseUrl : doc.baseUrl,
                        username: doc.username,
                        token   : oauthAccessToken,
                        secret  : oauthAccessTokenSecret
                    }, function (err, result) {
                        if (err) {
                            return res.status(400).send('<script>window.close();</script>');
                        }

                        if (result.hasOwnProperty('error')) {
                            error = new Error(result.error);
                            error.status = 400;

                            return res.status(400).send('<script>window.close();</script>');
                        }

                        IntegrationsService.findOneAndUpdate({
                            _id: doc._id
                        }, {
                            token    : oauthAccessToken,
                            secret   : oauthAccessTokenSecret,
                            connected: false
                        }, {
                            dbName: db,
                            upsert: true,
                            new   : true
                        }, function (err, doc) {
                            if (err) {
                                return next(err);
                            }

                            /* redisStore.sAdd('syncInProgress', db + '_' + redisKey);
                             redisStore.hSetNXToStorage('syncGetAll', redisKey, JSON.stringify(doc));
                             redisStore.hSetNXToStorage('integration', redisKey, JSON.stringify(doc));*/

                            res.status(200).send('<script>window.close();</script>');
                        });
                    });
                });
            });
        };

        this.getTestConnection = function (req, res, next) {
            var db = req.session.lastDb;
            var query = req.query;
            var channel = req.query.channel;

            IntegrationsService.findOne({channelName: channel}, {dbName: db}, function (err, doc) {
                if (err) {
                    return (err);
                }
                oauthService.get(query, doc, function (err, doc) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(doc);
                });
            });

        };

        this.getImportConnection = function (req, res, next) {
            var db = req.session.lastDb;
            var query = req.query;
            var channel = query.channel;
            var date = new Date();

            IntegrationsService.findOne({channelName: channel}, {dbName: db}, function (err, doc) {
                if (err) {
                    return (err);
                }
                if (doc) {
                    doc = doc.toJSON();
                    doc.dbName = db;
                }

                etsyHelper.importOrders(doc, function (err, doc) {
                    if (err) {
                        return next(err);
                    }

                    if (doc) {
                        doc = doc.toJSON();
                        doc.dbName = db;
                        doc.uId = req.session.uId;
                    }

                    etsyHelper.importProducts(query, doc, function (err) {
                        var newDate = new Date();
                        if (err) {
                            next(err);
                        }
                        console.log((newDate - date) / 1000);
                        res.status(200).send('Success');
                    });
                });
            });
        };

        this.getSettingsUrlsForApp = function (req, res, next) {
            var db = req.session.lastDb;

            settingsService.getSettingsUrlsForApp({dbName: db, app: app}, function (err, urls) {
                if (err) {
                    return next(err);
                }

                if (urls) {
                    return res.status(200).send(urls);
                }

                err = new Error('You haven\'t any settinsUrls');
                err.status = 404;

                next(err);
            });
        };

        function decryptPassword(password) {
            var decryptedPass;
            var decipher;

            decipher = crypto.createDecipher('aes192', 'easyErp');
            decryptedPass = decipher.update(password, 'hex', 'utf8');
            decryptedPass += decipher.final('utf8');

            return decryptedPass;
        }

        function createOwnPriceList(dbName, body, callback) {

            organizationSetting.getFromMail({
                dbName: dbName
            }, function (err, settings) {
                var saveObject;

                if (err) {
                    callback(err);
                }

                saveObject = {
                    priceListCode: body.channelName,
                    name         : body.channelName,
                    cost         : false,
                    currency     : settings.currency,
                    dbName       : dbName
                };

                priceListService.create(saveObject, function (err, doc) {
                    if (err) {
                        callback(err);
                    }

                    body.priceList = doc._id;
                    callback();

                });
            });
        }

        function saveIntegrationsShopify(req, res, next) {
            var db = req.session.lastDb;
            var body = req.body;
            var baseUrl = urlParser(body.baseUrl);
            var username = body.username;
            var type = req.params.type;
            var id = req.params.id;
            var password = body.password;
            var warehouse = body.warehouse || null;
            var location = body.location || null;
            var priceList = body.priceList || null;
            var ordersDate = body.ordersDate;
            var channelName = body.channelName;
            var connected = body.connected;
            var sharedSecret = body.sharedSecret;
            var uId = req.session.uId;
            var autoGet = body.automatingGetProduct;
            var waterfallTasks;
            var model;
            var token;
            var errorMsg;
            var redisKey;

            body.baseUrl = baseUrl;

            function shopifyTokenRetriver(waterfallCb) {
                requestHelper.getData(baseUrl + '/admin/shop.json', {
                    auth: {
                        username: username,
                        password: password
                    },

                    body: {}
                }, function (err, result) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    waterfallCb(null, result);
                });
            }

            function saveOrUpdateIntegration(shopifyResult, waterfallCb) {
                var _query = id ? {_id: id} : {channelName: channelName, baseUrl: baseUrl};
                var notValid = validateShopify(password, shopifyResult);
                var err;

                waterfallCb = waterfallCb || arguments[arguments.length - 1];

                if (notValid) {
                    errorMsg = 'Bad authorization data';
                    err = new Errors.UnAuthorized(errorMsg);

                    return waterfallCb(err);
                }

                token = shopifyResult && shopifyResult.request.headers.authorization;

                model = {
                    username         : username,
                    dbName           : db,
                    baseUrl          : baseUrl,
                    user             : uId,
                    priceList        : priceList,
                    ordersDate       : ordersDate,
                    connected        : connected,
                    warehouseSettings: {
                        warehouse: warehouse,
                        location : location
                    },

                    channelName: channelName
                };

                if (!id) {
                    model.connected = false;
                }

                if (token) {
                    model.token = token;
                }

                if (password) {
                    model.password = encryptPassword(password);
                }

                if (sharedSecret) {
                    model.sharedSecret = sharedSecret;
                }

                if (typeof(token) === 'object') {
                    errorMsg = 'Bad authorization data';
                    err = new Errors.UnAuthorized(errorMsg);

                    return waterfallCb(err);
                }

                if (type) {
                    model.type = type;
                }

                IntegrationsService.findOneAndUpdate(_query, model, {
                    upsert: true,
                    dbName: db,
                    new   : true
                }, function (err, result) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    redisKey = result._id;
                    /* redisStore.hSetNXToStorage('integration', redisKey, JSON.stringify(result));

                     if (!id) {
                     redisStore.hSetNXToStorage('syncGetAll', redisKey, JSON.stringify(result));
                     redisStore.sAdd('syncInProgress', db + '_' + redisKey);
                     }*/

                    waterfallCb(null, result);
                });
            }

            function createHooks(resultChannel, wCb) {
                requestHelper.postData(baseUrl + '/admin/webhooks.json', {
                    webhook: {
                        topic  : 'orders/cancelled',
                        address: MAINCONSTANTS.INTEGRATION.SHOPIFY_WEBHOOKS_REMOTE_URI + '?channelId=' + resultChannel._id.toString() + '&dbName=' + db,
                        format : 'json'
                    }
                }, {
                    headers: {
                        Authorization: resultChannel.token
                    }
                }, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, resultChannel, result);
                });
            }

            function updateChannel(resultChannel, resultWebhook, wCb) {
                if (!resultWebhook || !resultWebhook.body || !resultWebhook.body.webhook) {
                    return wCb(null, resultChannel);

                }

                IntegrationsService.findOneAndUpdate({_id: resultChannel._id}, {$addToSet: {webhooks: resultWebhook.body.webhook.id}}, {dbName: db}, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, resultChannel);
                });
            }

            waterfallTasks = [saveOrUpdateIntegration, createHooks, updateChannel];

            if (password) {
                waterfallTasks.unshift(shopifyTokenRetriver);
            }

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (!autoGet) {
                    res.status(200).send(result);
                } else {
                    req.query.channel = result._id;
                    getOnlyProducts(req, res, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });
                }

                integrationStatsHelper(db, function (err, data) {
                    if (err) {
                        return logger.error(err);
                    }

                    redisStore.writeToStorage('syncStats', db, JSON.stringify(data));
                });
            });
        }

        function saveIntegrations(req, res, next) {
            var body = req.body;
            var baseUrl = urlParser(body.baseUrl);
            var username = body.username;
            var password = body.password;
            var channelName = body.channelName;
            var type = req.params.type || body.type;
            var id = req.params.id;
            var warehouse = body.warehouse || null;
            var location = body.location || null;
            var priceList = body.priceList;
            var ordersDate = body.ordersDate;
            var connected = body.connected;
            var sharedSecret = body.sharedSecret;
            var uId = req.session.uId;
            var dbName = req.session.lastDb;
            var autoGet = body.automatingGetProduct;
            var waterfallTasks;
            var errorMsg;
            var model;

            body.baseUrl = baseUrl;

            req.query.type = type;

            if (type === 'shopify') {
                return saveIntegrationsShopify(req, res, next);
            }

            if (type === 'etsy') {
                return createIntegrationsEtsy(req, res, next);
            }

            if (type === 'woo') {
                return saveIntegrationWoo(req, res, next);
            }

            function magentoTokenRetriver(waterfallCb) {
                requestHelper.postData(baseUrl + '/rest/V1/integration/admin/token', {
                    username: username,
                    password: password
                }, function (err, result) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    waterfallCb(null, result);
                });
            }

            function saveOrUpdateIntegration(magentoResult, waterfallCb) {
                var token = magentoResult && magentoResult.body;
                var _query = id ? {_id: id} : {channelName: channelName, baseUrl: baseUrl};
                var argumentsLength = arguments.length;
                var redisKey;
                var err;

                function saveCb(err, _integrationModel) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    redisKey = _integrationModel._id;
                    /*redisStore.hSetNXToStorage('integration', redisKey, JSON.stringify(_integrationModel));

                     if (!id) {
                     redisStore.hSetNXToStorage('syncGetAll', redisKey, JSON.stringify(_integrationModel));
                     redisStore.sAdd('syncInProgress', dbName + '_' + redisKey);
                     }*/

                    waterfallCb(null, _integrationModel);
                }

                waterfallCb = waterfallCb || arguments[argumentsLength - 1];

                if (argumentsLength > 1 && magentoResult && magentoResult.statusCode !== 200) {
                    err = magentoResult && magentoResult.statusMessage || 'Bad request';
                    err = new Error(err);
                    err.status = magentoResult.statusCode || 400;

                    return waterfallCb(err);
                }

                model = {
                    channelName      : channelName,
                    dbName           : dbName,
                    username         : username,
                    baseUrl          : baseUrl,
                    user             : uId,
                    priceList        : priceList,
                    connected        : connected,
                    ordersDate       : new Date(ordersDate),
                    warehouseSettings: {
                        warehouse: warehouse,
                        location : location
                    }
                };

                if (password) {
                    model.password = encryptPassword(password);
                }
                if (token) {
                    model.token = token;
                }
                if (type) {
                    model.type = type;
                }

                if (sharedSecret) {
                    model.sharedSecret = sharedSecret;
                }

                if (typeof token === 'object') {
                    errorMsg = token.message || 'Bad authorization data';
                    err = new Errors.UnAuthorized(errorMsg);

                    return waterfallCb(err);
                }

                if (!id) {
                    return IntegrationsService.create(model, saveCb);

                }

                IntegrationsService.findOneAndUpdate(_query, model, {
                    new   : true,
                    upsert: true,
                    dbName: dbName
                }, saveCb);
            }

            waterfallTasks = [saveOrUpdateIntegration];

            if (password) {
                waterfallTasks.unshift(magentoTokenRetriver);
            }

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    if (err.code === 11000) {
                        err = new Errors.BadRequest({
                            duplicate: 'Base Url & Channel Name'
                        });
                    }
                    return next(err);
                }

                if (!autoGet) {
                    res.status(200).send(result);
                } else {
                    req.query.channel = result._id;
                    getOnlyProducts(req, res, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });
                }

                integrationStatsHelper(dbName, function (err, data) {
                    if (err) {
                        return logger.error(err);
                    }

                    redisStore.writeToStorage('syncStats', dbName, JSON.stringify(data));
                });
            });
        }

        this.getSettingsUrlsForApp = function (req, res, next) {
            var db = req.session.lastDb;

            settingsService.getSettingsUrlsForApp({dbName: db, app: app}, function (err, urls) {
                if (err) {
                    return next(err);
                }

                if (urls) {
                    return res.status(200).send(urls);
                }

                err = new Error('You haven\'t any settingsUrls');
                err.status = 404;

                next(err);
            });
        };

        this.updateChannel = function (req, res, next) {
            updateChannel(req, res, next);
        };

        function updateChannel(req, res, next) {
            var body = req.body;
            var dbName = req.session.lastDb;
            var id = req.params.id;
            var baseUrl;
            var type = body.type;

            var _query = {_id: id};
            var model = {$set: body};
            var currentWebhooks;

            if (type === 'shopify') {
                return saveIntegrationsShopify(req, res, next);
            }

            if (body.hasOwnProperty('connected') && body.connected === false) {
                redisStore.removeFromStorage('integration', id);
                redisStore.removeFromStorage('sync', id);
                redisStore.removeFromStorage('synced', id);
            }

            IntegrationsService.findOne(_query, {dbName: dbName}, function (err, resultChannel) {
                if (err) {
                    return next(err);
                }

                if (!resultChannel) {
                    err = new Error('Channel not found');
                    err.status = 400;

                    return next(err);
                }

                resultChannel = resultChannel.toJSON();
                type = resultChannel.type;
                currentWebhooks = resultChannel.webhooks || [];

                if (type !== 'shopify') {
                    return IntegrationsService.findOneAndUpdate(_query, model, {
                        new   : true,
                        dbName: dbName
                    }, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        if (body.connected) {
                            redisStore.hSetNXToStorage('integration', id, JSON.stringify(result));
                        }

                        res.status(200).send(result);
                    });
                }

                baseUrl = resultChannel.baseUrl;
                requestHelper.postData(baseUrl + '/admin/webhooks.json', {
                    webhook: {
                        topic  : 'orders/cancelled',
                        address: MAINCONSTANTS.INTEGRATION.SHOPIFY_WEBHOOKS_REMOTE_URI + '?channelId=' + resultChannel._id.toString() + '&dbName=' + dbName,
                        format : 'json'
                    }
                }, {
                    headers: {
                        Authorization: resultChannel.token
                    }
                }, function (err, resultWebhook) {
                    if (err) {
                        return next(err);
                    }

                    if (resultWebhook && resultWebhook.body && resultWebhook.body.webhook) {
                        currentWebhooks.push(resultWebhook.body.webhook.id.toString());
                        model.$set.webhooks = currentWebhooks;
                    }

                    IntegrationsService.findOneAndUpdate({_id: resultChannel._id}, model, {
                        dbName: dbName,
                        new   : true
                    }, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        if (body.connected) {
                            redisStore.hSetNXToStorage('integration', id, JSON.stringify(result));
                            //redisStore.hSetNXToStorage('syncGetAll', id, JSON.stringify(result));
                        }

                        res.status(200).send(result);
                    });
                });
            });
        };

        this.saveIntegrations = function (req, res, next) {
            var body = req.body;
            var dbName = req.session.lastDb;
            var baseUrl = urlParser(body.baseUrl);

            if (body.changeConnect) {
                return updateChannel(req, res, next);
            }

            if (req.method !== 'POST') {
                return saveIntegrations(req, res, next);
            }

            IntegrationsService.findOne({baseUrl: baseUrl}, {dbName: dbName}, function (err, result) {
                var error;

                if (err) {
                    return next(err);
                }

                if (result) {
                    error = new Error('Integration with this base URL already exists.');
                    error.status = 400;

                    return next(error);
                }

                saveIntegrations(req, res, next);
            });
        };

        this.testConnection = function (req, res, next) {
            var uId = req.session.uId;
            var dbName = req.session.lastDb;
            var token;

            IntegrationsService.findOne({user: uId}, {dbName: dbName}, function (err, result) {
                var password;

                if (err) {
                    return next(err);
                }

                if (!result) {
                    return next(new Errors.BadRequest());
                }

                password = decryptPassword(result.password);
                requestHelper.postData(
                    result.baseUrl + '/rest/V1/integration/admin/token', {
                        username: result.username,
                        password: password
                    }, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        token = result.body;

                        if (typeof(token) === 'object') {
                            return res.status(200).send({error: token.message});
                        }

                        req.session.magento.token = token;

                        res.status(200).send({success: 'Connection established'});
                    });
            });
        };

        this.getCredentials = function (req, res, next) {
            var db = req.session.lastDb;
            var type = req.params && req.params.type;
            var query = {/* user: uId */};
            var response = {};

            if (type) {
                query.type = type;
            }
            IntegrationsService.findAggregate([{$match: query}, {
                $lookup: {
                    from        : 'warehouse',
                    localField  : 'warehouseSettings.warehouse',
                    foreignField: '_id',
                    as          : 'warehouseSettings.warehouse'
                }
            }, {
                $lookup: {
                    from        : 'locations',
                    localField  : 'warehouseSettings.location',
                    foreignField: '_id',
                    as          : 'warehouseSettings.location'
                }
            }, {
                $lookup: {
                    from        : 'PriceLists',
                    localField  : 'priceList',
                    foreignField: '_id',
                    as          : 'priceList'
                }
            }, {
                $lookup: {
                    from        : 'PaymentMathod',
                    localField  : 'bankAccount',
                    foreignField: '_id',
                    as          : 'bankAccount'
                }
            }, {
                $group: {
                    _id              : '$_id',
                    baseUrl          : {$first: '$baseUrl'},
                    channelName      : {$first: '$channelName'},
                    type             : {$first: '$type'},
                    sharedSecret     : {$first: '$sharedSecret'},
                    connected        : {$first: '$connected'},
                    warehouseSettings: {$first: '$warehouseSettings'},
                    priceList        : {$first: '$priceList'},
                    dbName           : {$first: '$dbName'},
                    user             : {$first: '$user'},
                    username         : {$first: '$username'},
                    bankAccount      : {$first: '$bankAccount'},
                    ordersDate       : {$first: '$ordersDate'},
                    lastSync         : {$first: '$lastSync'}
                }
            }, {
                $project: {
                    _id              : 1,
                    baseUrl          : 1,
                    channelName      : 1,
                    type             : 1,
                    sharedSecret     : 1,
                    connected        : 1,
                    ordersDate       : 1,
                    warehouseSettings: {
                        location : {$arrayElemAt: ['$warehouseSettings.location', 0]},
                        warehouse: {$arrayElemAt: ['$warehouseSettings.warehouse', 0]}
                    },
                    priceList        : {$arrayElemAt: ['$priceList', 0]},
                    dbName           : 1,
                    user             : 1,
                    username         : 1,
                    bankAccount      : {$arrayElemAt: ['$bankAccount', 0]},
                    lastSync         : 1
                }
            }, {
                $project: {
                    _id              : 1,
                    baseUrl          : 1,
                    channelName      : 1,
                    type             : 1,
                    sharedSecret     : 1,
                    ordersDate       : 1,
                    connected        : 1,
                    warehouseSettings: 1,
                    priceList        : 1,
                    dbName           : 1,
                    user             : 1,
                    username         : 1,
                    bankAccount      : 1,
                    lastSync         : 1
                }
            }], {dbName: db}, function (err, result) {

                if (err) {
                    return next(err);
                }

                redisStore.readFromStorage('syncStats', db, function (err, data) {
                    if (err) {
                        logger.error(err);
                    }
                    if (data) {
                        response.stats = JSON.parse(data);
                    }

                    async.each(result, function (el, cb) {
                        SyncLogsService.getLastById({dbName: db, id: el._id.toString()}, function (err, resp) {
                            if (err) {
                                return cb(err);
                            }
                            el.sync = resp.length && resp[0];
                            cb();
                        });
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                        response.result = result;

                        res.status(200).send(response);
                    });
                });

            });

            /*IntegrationsService
             .find(query, {dbName: db})
             .populate('warehouseSettings.warehouse')
             .populate('warehouseSettings.location')
             .populate('priceList')
             .populate('bankAccount')
             .exec(function (err, result) {
             if (err) {
             return next(err);
             }
             if (result) {
             _.each(result, function (r) {
             SyncLogsService.getLastById({dbName: db, id: r._id}, function (err, resp) {
             if (err) {
             return next(err);
             }
             r.lastLog = resp.length && resp[0];
             });
             console.log(r);
             });
             }

             redisStore.readFromStorage('syncStats', db, function (err, data) {
             if (err) {
             logger.error(err);
             }
             if (data) {
             response.stats = JSON.parse(data);
             }

             response.result = result;
             response.lastSyncs = [];

             res.status(200).send(response);
             });
             });*/
        }
        ;

        this.deleteIntegration = function (req, res, next) {
            var dbName = req.session.lastDb;
            var channelId = req.params.id;
            var uId = req.session.uId;
            var redisKey;

            IntegrationsService.findByIdAndRemove({dbName: dbName, id: channelId}, function (err, integration) {
                var webhooks;

                if (err) {
                    return next(err);
                }

                //clearStorage moved to service

                /* if (integration) {
                 integration = integration.toJSON();
                 webhooks = integration.webhooks;

                 redisStore.removeFromStorage('integration', channelId);
                 redisStore.removeFromStorage('sync', channelId);
                 redisStore.removeFromStorage('synced', channelId);
                 }*/

                res.status(200).send({success: 'Removed'});

                /* if (integration.type === 'shopify') {
                 async.each(webhooks, function (hook, eCb) {
                 requestHelper.removeData(integration.baseUrl + '/admin/webhooks/' + hook + '.json', {}, {
                 headers: {
                 Authorization: integration.token
                 }
                 }, function (err) {
                 if (err) {
                 return eCb(err);
                 }

                 eCb();
                 });
                 }, function (err) {
                 if (err) {
                 console.log(err);
                 }

                 console.log('Webhooks deleted success');
                 });
                 }*/
            });
        };

        this.getForDd = function (req, res, next) {
            var query = req.query || {};
            var dbName = req.session.lastDb;
            var options = {
                dbName: dbName
            };

            IntegrationsService.find(query, options, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
        };
    }
;

module.exports = Module;
