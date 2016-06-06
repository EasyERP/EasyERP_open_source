var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.QUOTATION;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddlware, handler.getByViewType);
    router.get('/totalCollectionLength', accessStackMiddlware, handler.totalCollectionLength);
    router.get('/getFilterValues', accessStackMiddlware, handler.getFilterValues);
    router.post('/', accessStackMiddlware, handler.create);
    router.delete('/:id', accessStackMiddlware, handler.remove);
    router.patch('/:id', accessStackMiddlware, handler.putchModel);
    router.put('/:id', accessStackMiddlware, handler.updateModel);

    return router;
};
