var express = require('express');
var router = express.Router();
var JournalEntryHandler = require('../handlers/journalEntry');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _journalEntryHandler = new JournalEntryHandler(models, event);
    var moduleId = MODULES.JOURNALENTRY;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/getReconcileDate', _journalEntryHandler.getReconcileDate);
    router.get('/getForReport', _journalEntryHandler.getForReport);
    router.get('/getAsyncData', _journalEntryHandler.getAsyncData);
    router.get('/getAsyncDataForGL', _journalEntryHandler.getAsyncDataForGL);
    router.get('/getAsyncCloseMonth', _journalEntryHandler.getAsyncCloseMonth);
    router.get('/getTrialBalance', _journalEntryHandler.getForGL);
    router.get('/getBalanceSheet', _journalEntryHandler.getBalanceSheet);
    router.get('/getCloseMonth', _journalEntryHandler.getCloseMonth);
    router.get('/getProfitAndLoss', _journalEntryHandler.getProfitAndLoss);
    router.get('/getCashFlow', _journalEntryHandler.getCashFlow);
    router.get('/getPayrollForReport', _journalEntryHandler.getPayrollForReport);
    router.get('/getInventoryReport', _journalEntryHandler.getInventoryReport);
    router.get('/getExpenses', _journalEntryHandler.getExpenses);
    router.get('/exportToXlsx/:filter', _journalEntryHandler.exportToXlsx);
    router.get('/exportToCsv/:filter', _journalEntryHandler.exportToCsv);
    router.get('/', _journalEntryHandler.getForView);

    router.post('/', _journalEntryHandler.create);
    router.post('/reconcile', _journalEntryHandler.reconcile);
    router.post('/closeMonth', _journalEntryHandler.closeMonth);
    router.post('/recloseMonth', _journalEntryHandler.recloseMonth);

    return router;
};
