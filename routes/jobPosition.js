var express = require('express');
var router = express.Router();
var jobPositionHandler = require('../handlers/jobPosition');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    'use strict';
    var handler = new jobPositionHandler(models);
    var moduleId = MODULES.JOBPOSITIONS;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);
    router.use(authStackMiddleware);

    router.get('/getFilterValues', accessStackMiddlware, handler.getFilterValues);
    router.get('/getForDd', handler.getForDd);
    router.get('/jobType', handler.jobType);
    router.get('/totalCollectionLength', accessStackMiddlware, handler.totalCollectionLength);
    router.get('/:id', accessStackMiddlware, handler.getByViewType);

    router.post('/', accessStackMiddlware, handler.create);
    router.patch('/:id', accessStackMiddlware, handler.update);
    router.put('/:id', accessStackMiddlware, handler.update);
    router.delete('/:id', accessStackMiddlware, handler.remove);

    //router.get('/form', accessStackMiddlware, handler.getById);
    //router.get('/list', accessStackMiddlware, handler.getFilterJobPositions);
    return router;
};