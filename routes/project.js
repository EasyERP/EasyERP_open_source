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

module.exports = function (models) {
    'use strict';
    var handler = new ProjectHandler(models);
    var invoiceHandler = new InvoiceHandler(models);
    var wTrackHandler = new WeTrackHandler(null, models);
    var jobsHandler = new JobsHandler(models);
    var quotationHandler = new QuotationHandler(models);
    var paymentsHandler = new PaymentsHandler(models);

    var moduleId = MODULES.PROJECT;
    var accessStackMiddlWare = require('../helpers/access')(moduleId, models);
    
    router.use(authStackMiddleware);
    
    router.get('/', accessStackMiddlWare, handler.getByViewType);
    router.get('/getProjectPMForDashboard', handler.getProjectPMForDashboard);
    router.get('/getForQuotation', handler.getForQuotation);
    router.get('/projectType', handler.getProjectType);
    router.get('/getForDd', handler.getForDd);
    // router.get('/getForDashboard', handler.getForDashboard);
    router.get('/getForWtrack', handler.getForWtrack);
    router.get('/getFilterValues', handler.getFilterValues);
    router.get('/emails/:id', handler.getEmails);
    router.get('/:id', handler.getById);
    router.get('/:id/invoices', invoiceHandler.getForProject);
    router.get('/:id/weTracks', wTrackHandler.getForProject);
    router.get('/:id/info', jobsHandler.getForOverview);
    router.get('/:id/quotations', quotationHandler.getForProject);
    router.get('/:id/orders', quotationHandler.getForProject);
    router.get('/:id/payments', paymentsHandler.getForProject);
    
    router.post('/updateAllProjects', handler.updateAllProjects);
    router.post('/sendInvoice', handler.sendInvoice);

    return router;
};
