var express = require('express');
var router = express.Router();
var ProjectHandler = require('../handlers/project');
var InvoiceHandler = require('../handlers/invoice');
var WeTrackHandler = require('../handlers/wTrack');
var JobsHandler = require('../handlers/jobs');
var QuotationHandler = require('../handlers/quotation');
var PaymentsHandler = require('../handlers/payment');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';
    var handler = new ProjectHandler(models, event);
    var invoiceHandler = new InvoiceHandler(models);
    var wTrackHandler = new WeTrackHandler(null, models);
    var jobsHandler = new JobsHandler(models);
    var quotationHandler = new QuotationHandler(models);
    var paymentsHandler = new PaymentsHandler(models);

    var moduleId = MODULES.PROJECTS;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleWare, handler.getByViewType);
    router.get('/test', accessStackMiddleWare, handler.getByViewTypeTest);
    router.get('/getProjectPMForDashboard', accessStackMiddleWare, handler.getProjectPMForDashboard);
    router.get('/getForQuotation', accessStackMiddleWare, handler.getForQuotation);
    router.get('/projectType', accessStackMiddleWare, handler.getProjectType);

    /**
     *@api {get} /projects/forDD Request ProjectsForDD
     *
     * @apiVersion 0.0.1
     * @apiName getProjectsForDD
     * @apiGroup Project
     *
     * @apiSuccess {Object} ProjectsForDD
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
              "data": [
                {
                  "_id": "56e689c75ec71b00429745a9",
                  "projectShortDesc": "SDK",
                  "name": "360CamSDK"
                },
                {
                  "_id": "571a079eb629a41976c9ac96",
                  "projectShortDesc": "Peter Hickey",
                  "name": "3D Bolus (Windows)"
                },
                ...
              ]
            }
     */
    router.get('/getForDd', accessStackMiddleWare, handler.getForDd);
    // router.get('/getForDashboard', handler.getForDashboard);

    /**
     *@api {get} /projects/getForWtrack Request ProjectsForWTrack
     *
     * @apiVersion 0.0.1
     * @apiName getProjectsForWTrack
     * @apiGroup Project
     *
     * @apiSuccess {Object} ProjectsForWTrack
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
          "data": [
            {
              "_id": "56e689c75ec71b00429745a9",
              "TargetEndDate": "2016-03-31T00:00:00.000Z",
              "StartDate": null,
              "budget": {
                "projectTeam": [
                  "56e6f1ae0d773c634e918b68"
                ],
                "bonus": [

                ]
              },
              "bonus": [

              ],
              "health": 1,
              "editedBy": {
                "date": "2016-03-14T16:19:02.059Z",
                "user": "55b9fc0fd79a3a3439000008"
              },
              "attachments": [

              ],
              "notes": [

              ],
              "projecttype": "iOs",
              "createdBy": {
                "date": "2016-03-14T09:52:07.280Z",
                "user": "55b9fc0fd79a3a3439000008"
              },
              "progress": 0,
              "remaining": 0,
              "logged": 0,
              "estimated": 0,
              "workflow": {
                "_id": "528ce7f2f3f67bc40b000023",
                "name": "In Progress"
              },
              "parent": null,
              "sequence": 0,
              "groups": {
                "owner": "560c099da5d4a2e20ba5068b",
                "users": [

                ],
                "group": [

                ]
              },
              "whoCanRW": "everyOne",
              "customer": {
                "_id": "56a9eeabd59a04d6225b0df5",
                "name": {
                  "last": "Voloshchuk",
                  "first": "Peter"
                }
              },
              "task": [
                "5717661c2c8b789c7a0bb82d"
              ],
              "projectShortDesc": "SDK",
              "__v": 0,
              "EndDate": null,
              "paymentTerms": {
                "_id": "55536e52475b7be475f335f6",
                "name": "15 Days"
              },
              "paymentMethod": "565f2e05ab70d49024242e07",
              "name": "360CamSDK"
            },
            ...
            ]

            }
     */
    router.get('/getForWtrack', accessStackMiddleWare, handler.getForWtrack);
    router.get('/getFilterValues', accessStackMiddleWare, handler.getFilterValues);
    router.get('/emails/:id', accessStackMiddleWare, handler.getEmails);
    router.get('/:id', accessStackMiddleWare, handler.getById);
    router.get('/:id/invoices', accessStackMiddleWare, invoiceHandler.getForProject);
    router.get('/:id/weTracks', accessStackMiddleWare, wTrackHandler.getForProject);
    router.get('/:id/info', accessStackMiddleWare, jobsHandler.getForOverview);
    router.get('/:id/quotations', accessStackMiddleWare, quotationHandler.getForProject);
    router.get('/:id/orders', accessStackMiddleWare, quotationHandler.getForProject);
    router.get('/:id/payments', accessStackMiddleWare, paymentsHandler.getForProject);

    router.post('/', accessStackMiddleWare, handler.create);
    router.post('/uploadFiles', accessStackMiddleWare, multipartMiddleware, handler.uploadFile);
    router.post('/updateAllProjects', accessStackMiddleWare, handler.updateAllProjects);
    router.post('/sendInvoice', accessStackMiddleWare, handler.sendInvoice);

    router.patch('/:id', accessStackMiddleWare, handler.updateOnlySelectedFields);
    router.delete('/:id', accessStackMiddleWare, handler.remove);
    router.delete('/', accessStackMiddleWare, handler.bulkRemove);

    return router;
};
