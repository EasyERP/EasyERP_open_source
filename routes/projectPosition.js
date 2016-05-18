var express = require('express');
var router = express.Router();
var PrPositionHandler = require('../handlers/projectPosition');

module.exports = function (models) {
    var handler = new PrPositionHandler(models);

    router.get('/getForDD', handler.getForDd);

    return router;
};