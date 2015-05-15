/**
 * Created by Roman on 04.05.2015.
 */

var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');

module.exports = function (models) {
    var handler = new QuotationHandler(models);

    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/:viewType', handler.getByViewType);
    router.get('/form/:id', handler.getById);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);
    router.patch('/:id', handler.putchModel);

    return router;
};