var express = require('express');
var router = express.Router();
var Handler = require('../handlers/manufacturingOrder');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models, event) {
    'use strict';

    var handler = new Handler(models, event);

    router.use(authStackMiddleware);

    router.get('/', handler.get);

    router.get('/:id', handler.getById);

    router.post('/', handler.create);

    router.patch('/:id', handler.update);

    router.delete('/', handler.remove);

    return router;
};
