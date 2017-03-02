var express = require('express');
var router = express.Router();
var StockReturns = require('../handlers/stockReturns');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new StockReturns(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getAll);

    router.get('/:id', handler.getById);

    return router;
};
