var express = require('express');
var router = express.Router();
var OpportunityHandler = require('../handlers/opportunity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';

    var handler = new OpportunityHandler(models, event);
    var moduleId = MODULES.LEADS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', handler.getByViewType);
    router.get('/getLeadsForChart', handler.getLeadsForChart);
    router.get('/priority', handler.getLeadsPriority);

    router.post('/', handler.create);
    router.patch('/:id', handler.updateLead);
    router.put('/:id', handler.updateLead);

    router.delete('/:id', handler.remove);
    router.delete('/', handler.bulkRemove);

    return router;
};
