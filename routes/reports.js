'use strict';
var express = require('express');
var router = express.Router();
var Handler = require('../handlers/reports');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var redisClient = require('../helpers/redisClient');

module.exports = function (models, event) {
    var handler = new Handler(models, event);
    var moduleId = MODULES.REPORTS;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleWare);
    
    router.get('/products', handler.getInfoBySalesProducts);
    router.get('/incomingStock', handler.getIncomingStockReport);
    router.get('/scarceProducts', handler.getScarceProducts);
    router.get('/getProductListingReport', handler.getProductListingReport);
    router.get('/getInfoSalesByMonth', handler.getInfoSalesByMonth);
    router.get('/getInfoSalesByChannel', handler.getInfoSalesByChannel);

    return router;
};
