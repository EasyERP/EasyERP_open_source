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
    router.get('/getForDd', accessStackMiddleWare, handler.getForDd);
    // router.get('/getForDashboard', handler.getForDashboard);
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
    router.post('/updateAllProjects', accessStackMiddleWare, handler.updateAllProjects);
    router.post('/sendInvoice', accessStackMiddleWare, handler.sendInvoice);

    router.patch('/:id', accessStackMiddleWare, handler.updateOnlySelectedFields);
    router.delete('/:id', accessStackMiddleWare, handler.remove);

    return router;
};
