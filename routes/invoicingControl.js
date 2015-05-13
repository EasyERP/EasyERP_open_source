/**
 * Created by Roman on 13.05.2015.
 */

var express = require('express');
var router = express.Router();
var InvoicingControlHandler = require('../handlers/invoicingControl');

module.exports = function (models) {
    var handler = new InvoicingControlHandler(models);

    router.get('/', handler.getForDd);

    return router;
};