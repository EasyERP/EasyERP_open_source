var express = require('express');
var router = express.Router();
var StockInventory = require('../handlers/stockInventory');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new StockInventory(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getList);
   /* router.get('/:id', handler.getById);
    router.post('/', handler.create);*/
    router.patch('/:id', handler.transfer);

  /*  router.delete('/', handler.bulkRemove);*/

    return router;
};
