var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.ORDER;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', handler.getByViewType);
    router.get('/getFilterValues', handler.getFilterValues);

    router.patch('/:id', handler.putchModel);

    router.delete('/:id', handler.remove);

    return router;
};
