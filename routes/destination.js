var express = require('express');
var router = express.Router();
var DestinationHandler = require('../handlers/destination');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new DestinationHandler(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getForDd);

    return router;
};
