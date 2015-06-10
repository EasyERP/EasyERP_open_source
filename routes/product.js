/**
 * Created by Roman on 29.04.2015.
 */
var express = require('express');
var router = express.Router();
var ProductHandler = require('../handlers/product');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models) {
    var handler = new ProductHandler(models);

    router.get('/', handler.getAll);
    router.get('/getProductsAlphabet', handler.getProductsAlphabet);
    router.get('/getProductsTypeForDd', handler.getProductsTypeForDd);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/getProductsImages', handler.getProductsImages);
    router.get('/:viewType', handler.getForView);
    router.post('/', handler.create);
    /*router.post('/uploadProductFiles', multipartMiddleware, handler.uploadProductFiles);*///FixMe
    router.patch('/:_id', handler.productsUpdateOnlySelectedFields);
    router.delete('/:_id', handler.removeProduct);

    return router;
};