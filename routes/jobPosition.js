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

    router.get('/getFilterValues', authStackMiddleware, accessStackMiddlware, handler.getFilterValues);
    router.get('/getForDd', authStackMiddleware, handler.getForDd);
    router.get('/jobType', authStackMiddleware, handler.jobType);
    router.get('/form', authStackMiddleware, accessStackMiddlware, handler.getById);
    router.get('/list', authStackMiddleware, accessStackMiddlware, handler.getFilterJobPositions);
    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddlware, handler.totalCollectionLength);

    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.update);
    router.put('/:id', authStackMiddleware, accessStackMiddlware, handler.update);
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);


    return router;
};