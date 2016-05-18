

var express = require('express');
var router = express.Router();
var CategoryHandler = require('../handlers/productCategories');

module.exports = function (models, event) {
    var handler = new CategoryHandler(models, event);

    router.get('/', handler.getForDd);
    router.get('/getExpenses', handler.getExpenses);
    router.get('/:id', handler.getById);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);
    router.put('/:id', handler.update);

    return router;
};