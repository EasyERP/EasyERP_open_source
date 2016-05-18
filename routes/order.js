
var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);

    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/getFilterValues', handler.getFilterValues);
    router.get('/:viewType', handler.getByViewType);
    router.get('/form/:id', handler.getById);
    router.delete('/:id', handler.remove);
    router.patch('/:id', handler.putchModel);

    return router;
};