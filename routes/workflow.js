

var express = require('express');
var router = express.Router();
var WorkflowHandler = require('../handlers/workflow');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';
    var handler = new WorkflowHandler(models, event);
    var moduleId = MODULES.WORKFLOWS;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware,  handler.get);
    router.get('/relatedStatus', authStackMiddleware, handler.relatedStatus);
    router.get('/getWorkflowsForDd', authStackMiddleware, handler.getWorkflowsForDd);
    router.get('/getFirstForConvert', handler.getFirstForConvert);
    router.get('/fetch', handler.fetch);

    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.put('/:id', authStackMiddleware, accessStackMiddlware, handler.updateWorkflow);
    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.updateOnlySelectedFields);
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);

    return router;
};