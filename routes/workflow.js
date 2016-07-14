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

    /**
     *@api {get} /workflows/getFirstForConvert/ Request FirstWorkflowForConvert
     *
     * @apiVersion 0.0.1
     * @apiName getFirstWorkflowForConvert
     * @apiGroup Workflow
     *
     * @apiParam (?Field=value) {String} wId="Purchase Order"
     * @apiParam (?Field=value) {String} source="purchase"
     * @apiParam (?Field=value) {String} targetSource="quotation"
     *
     * @apiSuccess {Object} FirstWorkflowForConvert
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
            "_id": "5555bf276a3f01acae0b5560",
            "color": "#2C3E50",
            "name": "Not Ordered",
            "sequence": 3,
            "status": "New",
            "wId": "Purchase Order",
            "wName": "order",
            "source": "purchase",
            "targetSource": [
                "quotation"
            ],
            "visible": true
        }
     */
    router.get('/getFirstForConvert', handler.getFirstForConvert);
    router.get('/fetch', handler.fetch);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.put('/:id', authStackMiddleware, accessStackMiddleware, handler.updateWorkflow);
    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.updateOnlySelectedFields);

    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    return router;
};
