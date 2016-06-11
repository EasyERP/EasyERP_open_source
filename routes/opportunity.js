var express = require('express');
var router = express.Router();
var OpportunityHandler = require('../handlers/opportunity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';

    var handler = new OpportunityHandler(models, event);
    var moduleId = MODULES.OPPORTUNITIES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getByViewType);
    router.get('/getFilterValues', authStackMiddleware, accessStackMiddleware, handler.getFilterValues);
    router.get('/OpportunitiesForMiniView', authStackMiddleware, accessStackMiddleware, handler.opportunitiesForMiniView);
    router.get('/OpportunitiesForChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesForChart);
    router.get('/OpportunitiesConversionForChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesConversionForChart);
    router.get('/OpportunitiesAgingChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesAgingChart);
    router.get('/getLengthByWorkflows', authStackMiddleware, accessStackMiddleware, handler.getLengthByWorkflows);
    router.get('/priority', authStackMiddleware, accessStackMiddleware, handler.getLeadsPriority);
   
    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.post('/createLeadFromSite', handler.addNewLeadFromSite);
    router.post('/uploadOpportunitiesFiles', accessStackMiddleware, multipartMiddleware, handler.uploadOpportunitiesFiles);
    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.updateOnlySelectedFields);
    router.put('/:id', authStackMiddleware, accessStackMiddleware, handler.update);
   
    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);
    router.delete('/', authStackMiddleware, accessStackMiddleware, handler.bulkRemove);
    
    return router;
};
