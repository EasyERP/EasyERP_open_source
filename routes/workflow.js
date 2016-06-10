var express = require('express');
var router = express.Router();
var WorkflowHandler = require('../handlers/workflow');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';
    var handler = new WorkflowHandler(models, event);
    var moduleId = MODULES.WORKFLOWS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, handler.get);
    router.get('/relatedStatus', authStackMiddleware, handler.relatedStatus);
    router.get('/getWorkflowsForDd', authStackMiddleware, handler.getWorkflowsForDd);
    router.get('/getFirstForConvert', handler.getFirstForConvert);
    router.get('/fetch', handler.fetch);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.put('/:id', authStackMiddleware, accessStackMiddleware, handler.updateWorkflow);
    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.updateOnlySelectedFields);

    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    return router;
};
