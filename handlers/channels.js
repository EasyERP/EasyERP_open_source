'use strict';

var crypto = require('crypto');
var request = require('request');
var async = require('async');
var settingsService = require('../services/settings');
var requestHelper = require('../helpers/tracker');
var Errors = require('../helpers/errors');
var redisStore = require('../helpers/redisClient');
var MAINCONSTANTS = require('../constants/mainConstants');
var logger = require('../helpers/logger');

var Module = function (models, event) {
    var IntegrationsService = require('../services/integration')(models);
    var etsyHelper = require('../helpers/etsy')(models);
    var oauthService = require('../helpers/oauthTracker')(models);
    var organizationSetting = require('../services/organizationSetting')(models);
    var priceListService = require('../services/priceList')(models);
    var integrationStatsHelper = require('../helpers/integrationStatsComposer')(models);

    function validateShopify(password, shopifyResult) {
        return password && (!shopifyResult || !shopifyResult.request || !shopifyResult.request.headers || !shopifyResult.request.headers.authorization);
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

    function createIntegrationsEtsy(req, res, next) {
        var db = req.session.lastDb;
        var body = req.body;
        var type = req.params.type;
        var oauth = oauthService._oauth();
        var uId = req.session.uId;
        var id = req.params.id;
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

                    waterFallCb(null, result || doc, oauthSettings);
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

                    waterFallCb(null, result || doc, oauthSettings);
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

            res.status(200).send(result);

            integrationStatsHelper(db, function (err, data) {
                if (err) {
                    return logger.error(err);
                }

                redisStore.writeToStorage('syncStats', db, JSON.stringify(data));
            });
        });
    }

    this.approveIntegrationEtsy = function (req, res, next) {
        var db = req.session.lastDb;
        var uId = req.session.uId;
        var query = req.query;
        var verify = query.oauth_verifier;
        var token = query.oauth_token;
        var oauth = oauthService._oauth();
        var redisKey;

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

                IntegrationsService.findOneAndUpdate({
                    _id: doc._id
                }, {
                    token : oauthAccessToken,
                    secret: oauthAccessTokenSecret
                }, {
                    dbName: db,
                    upsert: true,
                    new   : true
                }, function (err, doc) {
                    if (err) {
                        return next(err);
                    }

                    redisStore.sAdd('syncInProgress', db + '_' + redisKey);
                    redisStore.hSetNXToStorage('syncGetAll', redisKey, JSON.stringify(doc));
                    redisStore.hSetNXToStorage('integration', redisKey, JSON.stringify(doc));

                    res.status(200).send('<script>window.close();</script>');
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
        var channelName = body.channelName;
        var uId = req.session.uId;
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
                warehouseSettings: {
                    warehouse: warehouse,
                    location : location
                },

                channelName: channelName
            };

            if (token) {
                model.token = token;
            }

            if (password) {
                model.password = encryptPassword(password);
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
                redisStore.hSetNXToStorage('integration', redisKey, JSON.stringify(result));

                if (!id) {
                    redisStore.hSetNXToStorage('syncGetAll', redisKey, JSON.stringify(result));
                    redisStore.sAdd('syncInProgress', db + '_' + redisKey);
                }

                waterfallCb(null, {success: 'Connection is OK!'});
            });
        }

        waterfallTasks = [saveOrUpdateIntegration];

        if (password) {
            waterfallTasks.unshift(shopifyTokenRetriver);
        }

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
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
        var uId = req.session.uId;
        var dbName = req.session.lastDb;
        var waterfallTasks;
        var errorMsg;
        var model;

        body.baseUrl = baseUrl;

        if (type === 'shopify') {
            return saveIntegrationsShopify(req, res, next);
        }

        if (type === 'etsy') {
            return createIntegrationsEtsy(req, res, next);
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
                redisStore.hSetNXToStorage('integration', redisKey, JSON.stringify(_integrationModel));

                if (!id) {
                    redisStore.hSetNXToStorage('syncGetAll', redisKey, JSON.stringify(_integrationModel));
                    redisStore.sAdd('syncInProgress', dbName + '_' + redisKey);
                }

                waterfallCb(null, {success: 'Connection is OK!'});
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

            res.status(200).send(result);
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
        var body = req.body;
        var dbName = req.session.lastDb;
        var id = req.params.id;

        var _query = {_id: id};
        var model = {$set: body};

        if (body.hasOwnProperty('connected') && body.connected === false) {
            redisStore.removeFromStorage('integration', id);
        }

        IntegrationsService.findOneAndUpdate(_query, model, {
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
    };

    this.saveIntegrations = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var baseUrl = urlParser(body.baseUrl);

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
        var response = {};

        IntegrationsService
            .find({/* user: uId */}, {dbName: db})
            .populate('warehouseSettings.warehouse')
            .populate('warehouseSettings.location')
            .populate('priceList')
            .populate('bankAccount')
            .exec(function (err, result) {
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

                    response.result = result;

                    res.status(200).send(response);
                });
            });
    };

    this.deleteIntegration = function (req, res, next) {
        var dbName = req.session.lastDb;
        var channelId = req.params.id;
        var uId = req.session.uId;
        var redisKey;

        IntegrationsService.findByIdAndRemove({dbName: dbName, id: channelId}, function (err, integration) {
            var channelName;
            var baseUrl;
            var type;

            if (err) {
                return next(err);
            }

            if (integration) {
                redisKey = channelId;

                redisStore.removeFromStorage('integration', redisKey);
                redisStore.removeFromStorage('sync', redisKey);
                redisStore.removeFromStorage('synced', redisKey);
            }

            res.status(200).send({success: 'Removed'});
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
};

module.exports = Module;
