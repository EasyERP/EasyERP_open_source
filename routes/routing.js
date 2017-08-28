var express = require('express');
var router = express.Router();
var Handler = require('../handlers/routing');

module.exports = function (models, event) {
    'use strict';

    var handler = new Handler(models, event);

    router.get('/getNames', handler.getNamesForBillComponents);

    router.get('/:id', handler.getById);

    router.get('/', handler.getForDD);

    router.post('/', handler.create);

    router.patch('/:id', handler.update);

    router.delete('/', handler.remove);
    router.delete('/:id', handler.remove);

    return router;
};
