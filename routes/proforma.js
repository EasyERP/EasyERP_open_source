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
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', iHandler.getForView);
    router.get('/stats/project', iHandler.getStatsForProject);

    router.post('/create', handler.create);

    router.delete('/', iHandler.bulkRemove);
    
    return router;
};
