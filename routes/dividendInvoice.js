var express = require('express');
var router = express.Router();
var DividendInvoiceHandler = require('../handlers/dividendInvoice');
var InvoiceHandler = require('../handlers/invoice');

module.exports = function (models, event) {
    var handler = new DividendInvoiceHandler(models, event);
    var iHandler = new InvoiceHandler(models, event);

    router.post('/', handler.create);

    return router;
};
