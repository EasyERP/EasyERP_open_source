/**
 * Created by soundstorm on 13.05.15.
 */
var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');

module.exports = function (models) {
    var handler = new QuotationHandler(models);

    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/:viewType', handler.getByViewType);
    router.get('/form/:id', handler.getById);
    router.delete('/:id', handler.remove);
    router.patch('/:_id', handler.quotationUpdateOnlySelectedFields);

    return router;
};