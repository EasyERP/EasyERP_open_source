var express = require('express');
var router = express.Router();
var DeliverToHandler = require('../handlers/deliverTo');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new DeliverToHandler(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getForDd);

    return router;
};
