

var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.QUOTATION;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/getFilterValues', handler.getFilterValues);
    router.get('/:viewType', handler.getByViewType);
    router.get('/form/:id', handler.getById);
    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.delete('/:id', handler.remove);
    router.patch('/:id', handler.putchModel);
    router.put('/:id', handler.updateModel);

    return router;
};