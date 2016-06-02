var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new CustomerHandler(models);

    router.get('/', authStackMiddleware, handler.getSuppliersForDD);
    router.get('/getFilterValues', authStackMiddleware, handler.getFilterValues);

    return router;
};