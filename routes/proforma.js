var express = require('express');
var router = express.Router();
var ProformaHandler = require('../handlers/proforma');
var InvoiceHandler = require('../handlers/invoice');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new ProformaHandler(models, event);
    var iHandler = new InvoiceHandler(models, event);

    var moduleId = MODULES.PROFORMA;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddlware);

    router.get('/', iHandler.getForView);
    router.post('/create', handler.create);
    router.get('/totalCollectionLength', iHandler.totalCollectionLength);
    router.get('/stats/project', iHandler.getStatsForProject);

    return router;
};
