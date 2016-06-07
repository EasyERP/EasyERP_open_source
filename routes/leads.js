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

    router.get('/', accessStackMiddleware, handler.getByViewType);
    router.get('/totalCollectionLength', accessStackMiddleware, handler.totalCollectionLength);
    router.get('/getLeadsForChart', accessStackMiddleware, handler.getLeadsForChart);
    router.get('/priority', accessStackMiddleware, handler.getLeadsPriority);
    router.post('/', accessStackMiddleware, handler.create);
    router.patch('/:id', accessStackMiddleware, handler.updateLead);
    router.put('/:id', accessStackMiddleware, handler.updateLead);
    router.delete('/:id', accessStackMiddleware, handler.remove);

    return router;
};
