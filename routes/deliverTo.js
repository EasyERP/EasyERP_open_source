
var express = require('express');
var router = express.Router();
var DeliverToHandler = require('../handlers/deliverTo');

module.exports = function (models) {
    var handler = new DeliverToHandler(models);

    router.get('/', handler.getForDd);

    return router;
};