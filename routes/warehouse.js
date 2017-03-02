var express = require('express');
var router = express.Router();
var Handler = require('../handlers/warehouse');
var StockHandler = require('../handlers/stockCorrections');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, events) {
    'use strict';
    var handler = new Handler(models);
    var stockHandler = new StockHandler(models, events);
    var moduleId = MODULES.WAREHOUSE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', accessStackMiddleware, handler.get);
    router.get('/getHierarchyWarehouse', accessStackMiddleware, handler.getHierarchyWarehouse);
    router.get('/getForDD', accessStackMiddleware, handler.getForDd);
    router.get('/zone/getForDd', accessStackMiddleware, handler.getForDdZone);
    router.get('/location/getForDd', accessStackMiddleware, handler.getForDdLocation);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/stockCorrection', stockHandler.getCorrections);
    router.get('/stockCorrection/:id', stockHandler.getById);
    router.get('/getAvailability', stockHandler.getProductsAvailable);

    router.patch('/location/:id', handler.updateLocation);
    router.patch('/zone/:id', handler.updateZone);
    router.patch('/:id', handler.update);

    router.post('/', handler.create);
    router.post('/location', handler.createLocation);
    router.post('/zone', handler.createZone);
    router.post('/stockCorrection', stockHandler.create);
    router.post('/allocate', stockHandler.allocate);

    // router.delete('/', authStackMiddleware, handler.bulkRemove);
    router.delete('/location/:id', handler.removeLocation);
    router.delete('/stockCorrection', stockHandler.bulkRemove);
    router.delete('/stockCorrection/:id', stockHandler.remove); //TODO: it doesn't use
    router.delete('/zone/:id', handler.removeZone);
    router.delete('/:id', handler.remove);

    return router;
};
