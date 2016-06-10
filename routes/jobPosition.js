var express = require('express');
var router = express.Router();
var jobPositionHandler = require('../handlers/jobPosition');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    'use strict';
    var handler = new jobPositionHandler(models);
    var moduleId = MODULES.JOBPOSITIONS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getByViewType);
    router.get('/getFilterValues', accessStackMiddleware, handler.getFilterValues);
    router.get('/getForDd', handler.getForDd);
    router.get('/jobType', handler.jobType);

    router.post('/', accessStackMiddleware, handler.create);
    router.patch('/:id', accessStackMiddleware, handler.update);
    router.put('/:id', accessStackMiddleware, handler.update);
    
    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
