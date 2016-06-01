var express = require('express');
var router = express.Router();
var CurrencyHandler = require('../handlers/currency');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new CurrencyHandler(models);
    
    router.get('/getForDD', authStackMiddleware, handler.getForDd);

    return router;
};