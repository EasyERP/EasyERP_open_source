var express = require('express');
var router = express.Router();
var CurrencyHandler = require('../handlers/currency');

module.exports = function (models) {
    var handler = new CurrencyHandler(models);

    router.get('/getForDD', handler.getForDd);

    return router;
};