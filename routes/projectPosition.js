var express = require('express');
var router = express.Router();
var PrPositionHandler = require('../handlers/projectPosition');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PrPositionHandler(models);
    
    router.use(authStackMiddleware);

    router.get('/getForDD', handler.getForDd);

    return router;
};