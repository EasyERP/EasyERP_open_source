var express = require('express');
var router = express.Router();
var ProjectHandler = require('../handlers/project');
var InvoiceHandler = require('../handlers/invoice');
var WeTrackHandler = require('../handlers/wTrack');
var JobsHandler = require('../handlers/jobs');

module.exports = function (models) {
    var handler = new ProjectHandler(models);
    var invoiceHandler = new InvoiceHandler(models);
    var wTrackHandler = new WeTrackHandler(null, models);
    var jobsHandler = new JobsHandler(models);

    router.post('/updateAllProjects', handler.updateAllProjects);
    router.post('/sendInvoice', handler.sendInvoice);
    router.get('/getProjectPMForDashboard', handler.getProjectPMForDashboard);
    router.get('/getForQuotation', handler.getForQuotation);
    // router.get('/getForDashboard', handler.getForDashboard);
    router.get('/getForWtrack', handler.getForWtrack);
    router.get('/getFilterValues', handler.getFilterValues);
    router.get('/emails/:id', handler.getEmails);
    router.get('/:id/invoices', invoiceHandler.getForProject);
    router.get('/:id/weTracks', wTrackHandler.getForProject);
    router.get('/:id/info', jobsHandler.getForProjectInfo);

    return router;
};