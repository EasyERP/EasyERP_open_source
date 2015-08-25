

var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');

module.exports = function (models) {
    var handler = new CustomerHandler(models);

    router.get('/', handler.getSuppliersForDD);
    router.get('/getFilterValues', handler.getFilterValues)

    return router;
};