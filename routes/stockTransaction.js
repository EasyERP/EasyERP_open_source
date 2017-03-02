var express = require('express');
var router = express.Router();
var StockTransaction = require('../handlers/stockTransactions');
var authStackMiddleware = require('../helpers/checkAuth');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models) {
    var handler = new StockTransaction(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getList);
    router.get('/:id', handler.getById);

    router.post('/', handler.create);
    router.post('/uploadFiles', multipartMiddleware, handler.uploadFile);

    router.patch('/:id', handler.update);

    router.delete('/', handler.bulkRemove);

    return router;
};
