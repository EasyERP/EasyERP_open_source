var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.QUOTATIONS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getByViewType);
    router.get('/getFilterValues', accessStackMiddleware, handler.getFilterValues);

    router.post('/', accessStackMiddleware, handler.create);
    router.patch('/:id', accessStackMiddleware, handler.putchModel);
    router.put('/:id', accessStackMiddleware, handler.updateModel);

    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
