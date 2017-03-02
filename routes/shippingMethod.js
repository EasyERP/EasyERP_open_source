var express = require('express');
var router = express.Router();
var Handler = require('../handlers/shippingMethod');

module.exports = function (models) {
    var handler = new Handler(models);

    router.get('/', handler.getAll);
    router.get('/getForDd', handler.getForDd);

    router.post('/', handler.create);
    router.patch('/:id', handler.update);

    router.delete('/:id', handler.remove);

    return router;
};

