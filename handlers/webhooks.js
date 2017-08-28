var mongoose = require('mongoose');
var async = require('async');
var crypto = require('crypto');
var _ = require('lodash');
var ObjectId = mongoose.Types.ObjectId;
var CONSTANTS = require('../constants/mainConstants');
var OrderHandler = require('./order');
var bodyParser = require('body-parser');

var Module = function (models, events) {
    var wooHelper = require('../helpers/wooCommerce')(models, events);
    var IntegrationsService = require('../services/integration')(models);
    var settingsService = require('../services/settings')(models, events);
    var orderService = require('../services/order')(models);

    var orderHandler = new OrderHandler(models, events);

    var createProduct = wooHelper.createProduct;
    var createOrder = wooHelper.getSalesOrders;
    var createCustomer = wooHelper.getCustomers;
    var methodsMapper = {
        product: {
            created: createProduct
        },

        customer: {
            created: createCustomer
        },

        order: {
            created: createOrder
        }
    };

    this.retriveWebHook = function (req, res, next) {
        var channelId = req.params.channelId;
        var dbName = req.params.dbName;
        var body = req.body;
        var headers = req.headers;
        var topic = headers['x-wc-webhook-topic'];
        var type = headers['x-wc-webhook-resource'];
        var event = headers['x-wc-webhook-event'];
        var options = {};
        var error;

        if (!topic || !type || !event || !channelId || !dbName) {
            return res.status(200).send({});
        }

        IntegrationsService.findOne({
            _id: channelId
        }, {
            dbName: dbName
        }, function (err, resultChannel) {
            var channelType;
            var channelJSON;

            if (err) {
                return next(err);
            }

            if (!resultChannel) {
                error = new Error('Channel not found');
                error.status = 404;

                return next(error);
            }

            channelJSON = resultChannel.toJSON();
            channelType = channelJSON.type;

            _.assign(options, resultChannel.toJSON());

            settingsService.findOne({name: 'integration'}, {dbName: dbName}, function (err, resultSettings) {
                var currentSettings;

                if (err) {
                    return next(err);
                }

                if (!resultSettings) {
                    error = new Error('Channel not found');
                    error.status = 404;

                    return next(error);
                }

                currentSettings = resultSettings.apps && resultSettings.apps[channelType];

                options.settings = currentSettings;
                options.dbName = dbName;

                options[type] = body[type];

                methodsMapper[type][event](options, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: type + 'created success'});
                });
            });
        });
    };

    this.retriveShopifyWebHook = function (req, res, next) {
        var query = req.query;
        var db = query.dbName;
        var channelId = query.channelId;
        var body = req.body;
        var buf = req.buf;
        var sharedSecret;
        var digest;
        var newReq;
        var error;

        IntegrationsService.findOne({_id: channelId}, {dbName: db}, function (err, resultChannel) {
            if (err) {
                return next(err);
            }

            if (!resultChannel) {
                err = new Error('Channel not found');
                err.status = 400;

                return next(err);
            }

            resultChannel = resultChannel.toJSON();

            sharedSecret = resultChannel.sharedSecret;
            digest = crypto.createHmac('SHA256', sharedSecret).update(buf).digest('base64');

            if (digest !== req.get('x-shopify-hmac-sha256')) {
                error = new Error('Forbidden');
                error.status = 403;

                return next(error);
            }


            if (resultChannel.connected === false) {
                return res.status(200).send({});
            }

            orderService.findOne({
                channel      : ObjectId(channelId),
                integrationId: body.id
            }, {dbName: db}, function (err, resultOrder) {
                if (err) {
                    return next(err);
                }

                if (!resultOrder) {
                    err = new Error('Order not found');
                    err.status = 400;

                    return next(err);
                }

                resultOrder = resultOrder.toJSON();

                newReq = {
                    session: {
                        lastDb: db
                    },

                    params: {
                        id: resultOrder._id && resultOrder._id.toString()
                    },

                    body: {
                        cancel  : true,
                        forSales: true,
                        workflow: '57f4bd1f48c62c5c68690dbe'
                    },

                    query: {}
                };

                orderHandler.putchModel(newReq, res, next);
            });
        });
    };
};

module.exports = Module;
