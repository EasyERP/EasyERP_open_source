var express = require('express');
var router = express.Router();
var CategoryHandler = require('../handlers/priceLists');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new CategoryHandler(models, event);

    var moduleId = MODULES.PRICELISTS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', handler.get);
    router.get('/forProduct', handler.getForProduct);
    router.get('/getPrices', handler.getPrices);
    router.get('/getForDd', handler.getForDd);
    router.get('/:id', handler.getById);

    router.post('/resetPrices', handler.resetPrices);
    router.post('/', handler.create);
    
    router.patch('/:_id', handler.update);

    router.delete('/', handler.delete);
    router.delete('/:id', handler.delete);

    return router;
};
