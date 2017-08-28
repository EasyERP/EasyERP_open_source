'use strict';
var express = require('express');
var router = express.Router();
var Handler = require('../handlers/integration');
var EtsyHandler = require('../handlers/integrationEtsy');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var CONSTANTS = require('../constants/mainConstants');
var redisClient = require('../helpers/redisClient');

module.exports = function (models, event) {
    var handler = new Handler(models, event);
    var etsyHandler = new EtsyHandler(models, event);
    var moduleId = MODULES.INTEGRATION;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    // router.use(authStackMiddleware);
    // router.use(accessStackMiddleWare);

    // manage conflicts
    router.get('/conflicts', handler.getConflictsData);
    router.get('/etsy/shippingTemplate', etsyHandler.getShippingMethodsForDd);
    router.get('/countOfConflictsAndImported', handler.countOfConflictsAndImported);
    router.get('/unlinkedProducts', handler.getUnlinkedProducts);
    router.get('/sync', handler.syncAll);

    // router.get('/all/:type', handler.getAll);

    router.post('/conflicts', handler.saveConflictData);

    router.post('/testWebHook', handler.updateShopifyOrder);

    router.patch('/unlinkedProducts/:id', handler.updateUnlinkedProduct);

    router.patch('/linkOrder/:id', handler.linkOrder);

    return router;
};

