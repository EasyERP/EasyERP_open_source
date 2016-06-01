var express = require('express');
var router = express.Router();
var ProformaHandler = require('../handlers/proforma');
var InvoiceHandler = require('../handlers/invoice');

module.exports = function (models, event) {
    var handler = new ProformaHandler(models, event);
    var iHandler = new InvoiceHandler(models, event);

    router.get('/', iHandler.getForView);
    router.post('/create', handler.create);
    router.get('/totalCollectionLength', iHandler.totalCollectionLength);
    router.get('/stats/project', iHandler.getStatsForProject);

    return router;
};
