
var express = require('express');
var router = express.Router();
var VocationHandler = require('../handlers/vacation');

module.exports = function (event, models) {
    'use strict';
    var handler = new VocationHandler(event, models);

    router.get('/getYears', handler.getYears);
    router.get('/:viewType', handler.getForView);
    router.patch('/', handler.putchBulk);
    router.patch('/:id', handler.putchModel);
    router.delete('/:id', handler.remove);
    router.post('/', handler.create);

    return router;
};