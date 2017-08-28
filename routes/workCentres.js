var express = require('express');
var router = express.Router();
var WorkCentresHandler = require('../handlers/workCentres');

module.exports = function (models, event) {
    'use strict';

    var handler = new WorkCentresHandler(models, event);

    router.get('/getForDd', handler.getForDD);

    router.get('/:id', handler.getById);

    router.get('/', handler.get);

    router.post('/', handler.create);

    router.patch('/:id', handler.update);

    router.delete('/:id', handler.remove);
    router.delete('/', handler.remove);

    return router;
};
