var express = require('express');
var router = express.Router();
var ProductHandler = require('../handlers/product');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new ProductHandler(models);
    var moduleId = MODULES.PRODUCT;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', handler.getForView);
    router.get('/getProductsAlphabet', handler.getProductsAlphabet);
    router.get('/getProductsTypeForDd', handler.getProductsTypeForDd);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/getProductsImages', handler.getProductsImages);
    // router.get('/exportToXlsx',handler.exportToXlsx);
    // router.get('/exportToCsv',handler.exportToCsv);
   
    router.post('/', handler.create);
    /* router.post('/uploadProductFiles', multipartMiddleware, handler.uploadProductFiles);*/// FixMe
    router.patch('/:_id', handler.productsUpdateOnlySelectedFields);
   
    router.delete('/:_id', handler.removeProduct);

    return router;
};
