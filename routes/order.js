var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.ORDER;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddlware);

    router.get('/', handler.getByViewType);

    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/getFilterValues', handler.getFilterValues);
    router.delete('/:id', handler.remove);
    router.patch('/:id', handler.putchModel);

    return router;
};