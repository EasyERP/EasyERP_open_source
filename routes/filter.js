/**
 * Created by soundstorm on 12.08.15.
 */
var express = require('express');
var router = express.Router();
var filterHandler = require('../handlers/filter');

module.exports = function (models) {
    var handler = new filterHandler(models);

    router.get('/getFiltersValues', handler.getFiltersValues);

    return router;
};