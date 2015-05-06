/**
 * Created by Roman on 04.05.2015.
 */

var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');

module.exports = function (models) {
    var handler = new CustomerHandler(models);

    router.get('/', handler.getSuppliersForDD);

    return router;
};