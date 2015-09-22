var express = require('express');
var router = express.Router();
var CapacityHandler = require('../handlers/capacity');

module.exports = function (models) {
    var handler = new CapacityHandler(models);

    router.get('/', handler.getForType);
    router.get('/create', handler.create);

    return router;
};