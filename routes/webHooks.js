var express = require('express');
var router = express.Router();
var MODULES = require('../constants/modules');
var Handler = require('../handlers/webhooks');

module.exports = function (models, events) {
    'use strict';
    var handler = new Handler(models);

    router.post('/shopify', handler.retriveShopifyWebHook);
    router.post('/:channelId?/:dbName?', handler.retriveWebHook);

    return router;
};
