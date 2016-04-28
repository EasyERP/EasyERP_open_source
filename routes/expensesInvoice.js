var express = require('express');
var router = express.Router();
var ExpensesInvoiceHandler = require('../handlers/expensesInvoice');
var InvoiceHandler = require('../handlers/invoice');

module.exports = function (models, event) {
    var handler = new ExpensesInvoiceHandler(models, event);
    var iHandler = new InvoiceHandler(models, event);

    router.post('/', handler.create);

    return router;
};
