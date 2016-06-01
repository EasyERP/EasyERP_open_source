

var express = require('express');
var router = express.Router();
var InvoicingControlHandler = require('../handlers/invoicingControl');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new InvoicingControlHandler(models);

    router.get('/', authStackMiddleware, handler.getForDd);

    return router;
};