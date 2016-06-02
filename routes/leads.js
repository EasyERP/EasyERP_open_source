var express = require('express');
var router = express.Router();
var OpportunityHandler = require('../handlers/opportunity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';

    var handler = new OpportunityHandler(models, event);
    var moduleId = MODULES.LEADS;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddlware, handler.getByViewType);
    router.get('/totalCollectionLength', accessStackMiddlware, handler.totalCollectionLength);
    router.get('/getLeadsForChart', accessStackMiddlware, handler.getLeadsForChart);
    router.get('/priority', accessStackMiddlware, handler.getLeadsPriority);
    router.post('/', accessStackMiddlware, handler.create);
    router.patch('/:id', accessStackMiddlware, handler.updateLead);
    router.put('/:id', accessStackMiddlware, handler.updateLead);
    router.delete('/:id', accessStackMiddlware, handler.remove);

    return router;
};
