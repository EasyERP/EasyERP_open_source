var express = require('express');
var router = express.Router();
var opportunityHandler = require('../handlers/opportunity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';

    var handler = new opportunityHandler(models, event);
    var moduleId = MODULES.OPPORTUNITIES;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/getFilterValues', authStackMiddleware, accessStackMiddlware, handler.getFilterValues);
    router.get('/OpportunitiesForMiniView', authStackMiddleware, accessStackMiddlware, handler.opportunitiesForMiniView);
    router.get('/:viewType', authStackMiddleware, accessStackMiddlware, handler.getByViewType);

    router.post('/createLeadFromSite', handler.addNewLeadFromSite);

    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);

    return router;
};