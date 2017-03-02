var express = require('express');
var router = express.Router();
var Handler = require('../handlers/rates');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new Handler(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getForList);
    router.get('/syncRates', handler.syncRates);

    router.patch('/:id', handler.update);
    router.post('/', handler.create);

    router.delete('/:id', handler.remove);

    return router;
};

