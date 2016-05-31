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
    var accessStackMiddlWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddlWare, handler.getByViewType);
    router.get('/test', accessStackMiddlWare, handler.getByViewTypeTest);
    router.get('/getProjectPMForDashboard', accessStackMiddlWare, handler.getProjectPMForDashboard);
    router.get('/getForQuotation', accessStackMiddlWare, handler.getForQuotation);
    router.get('/projectType', accessStackMiddlWare, handler.getProjectType);
    router.get('/getForDd', accessStackMiddlWare, handler.getForDd);
    // router.get('/getForDashboard', handler.getForDashboard);
    router.get('/getForWtrack', accessStackMiddlWare, handler.getForWtrack);
    router.get('/getFilterValues', accessStackMiddlWare, handler.getFilterValues);
    router.get('/emails/:id', accessStackMiddlWare, handler.getEmails);
    router.get('/:id', accessStackMiddlWare, handler.getById);
    router.get('/:id/invoices', accessStackMiddlWare, invoiceHandler.getForProject);
    router.get('/:id/weTracks', accessStackMiddlWare, wTrackHandler.getForProject);
    router.get('/:id/info', accessStackMiddlWare, jobsHandler.getForOverview);
    router.get('/:id/quotations', accessStackMiddlWare, quotationHandler.getForProject);
    router.get('/:id/orders', accessStackMiddlWare, quotationHandler.getForProject);
    router.get('/:id/payments', accessStackMiddlWare, paymentsHandler.getForProject);

    router.post('/', accessStackMiddlWare, handler.create);
    router.post('/updateAllProjects', accessStackMiddlWare, handler.updateAllProjects);
    router.post('/sendInvoice', accessStackMiddlWare, handler.sendInvoice);
    
    router.patch('/:id', accessStackMiddlWare, handler.updateOnlySelectedFields);
    router.delete('/:id', accessStackMiddlWare, handler.remove);

    return router;
};
