var express = require('express');
var router = express.Router();
var CountriesHandler = require('../handlers/countries');

module.exports = function (models) {
    var handler = new CountriesHandler(models);

    router.get('/getForDD', handler.getForDd);

    return router;
};
