var express = require('express');
var router = express.Router();
var OpportunityHandler = require('../handlers/opportunity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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
    router.post('/uploadFiles', multipartMiddleware, handler.uploadFile);

    router.post('/', handler.create);
    router.patch('/:id', handler.updateLead);
    router.put('/:id', handler.updateLead);

    router.delete('/:id', handler.remove);
    router.delete('/', handler.bulkRemove);

    return router;
};
