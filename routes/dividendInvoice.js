var express = require('express');
var router = express.Router();
var DividendInvoiceHandler = require('../handlers/dividendInvoice');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new DividendInvoiceHandler(models, event);
    var moduleId = MODULES.DIVIDENDINVOICE;
    var accessStackMiddlWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.post('/', accessStackMiddlWare, handler.create);

    return router;
};
