/**
 * Created by liliy on 05.02.2016.
 */
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

    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddlware, handler.totalCollectionLength);
    router.get('/getLeadsForChart', authStackMiddleware, accessStackMiddlware, handler.getLeadsForChart);
    router.get('/:viewType', authStackMiddleware, accessStackMiddlware, handler.getByViewType);
    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.updateLead);
    router.put('/:id', authStackMiddleware, accessStackMiddlware, handler.updateLead);
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);

    return router;
};