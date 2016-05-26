

var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.QUOTATION;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddlware, handler.totalCollectionLength);
    router.get('/getFilterValues', authStackMiddleware, accessStackMiddlware, handler.getFilterValues);
    router.get('/:viewType', authStackMiddleware, accessStackMiddlware, handler.getByViewType);
    router.get('/form/:id', authStackMiddleware, accessStackMiddlware, handler.getById);
    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);
    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.putchModel);
    router.put('/:id', authStackMiddleware, accessStackMiddlware, handler.updateModel);

    return router;
};