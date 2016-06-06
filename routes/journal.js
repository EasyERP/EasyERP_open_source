var express = require('express');
var router = express.Router();
var journalHandler = require('../handlers/journal');
var journalEntryHandler = require('../handlers/journalEntry');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _journalHandler = new journalHandler(models, event);
    var _journalEntryHandler = new journalEntryHandler(models, event);
    var moduleId = MODULES.JOURNALENTRY;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddlware);

    router.get('/', _journalHandler.getForView);
    router.get('/getForDd', _journalHandler.getForDd);
    router.get('/getReconcileDate', _journalEntryHandler.getReconcileDate);
    router.get('/journalEntry/getForReport', _journalEntryHandler.getForReport);
    router.get('/journalEntry/getAsyncData', _journalEntryHandler.getAsyncData);
    router.get('/journalEntry/getAsyncDataForGL', _journalEntryHandler.getAsyncDataForGL);
    router.get('/journalEntry/getAsyncCloseMonth', _journalEntryHandler.getAsyncCloseMonth);
    router.get('/journalEntry/getTrialBalance', _journalEntryHandler.getForGL);
    router.get('/journalEntry/getBalanceSheet', _journalEntryHandler.getBalanceSheet);
    router.get('/journalEntry/getCloseMonth', _journalEntryHandler.getCloseMonth);
    router.get('/journalEntry/getProfitAndLoss', _journalEntryHandler.getProfitAndLoss);
    router.get('/journalEntry/getCashFlow', _journalEntryHandler.getCashFlow);
    router.get('/journalEntry/getPayrollForReport', _journalEntryHandler.getPayrollForReport);
    router.get('/journalEntry/getInventoryReport', _journalEntryHandler.getInventoryReport);
    router.get('/journalEntry/getExpenses', _journalEntryHandler.getExpenses);
    router.get('/journalEntry/exportToXlsx/:filter', _journalEntryHandler.exportToXlsx);
    router.get('/journalEntry/exportToCsv/:filter', _journalEntryHandler.exportToCsv);
    router.get('/journalEntry/:viewType', _journalEntryHandler.getForView);
    router.post('/', _journalHandler.create);
    router.post('/journalEntry', _journalEntryHandler.create);
    router.post('/reconcile', _journalEntryHandler.reconcile);
    router.post('/journalEntry/closeMonth', _journalEntryHandler.closeMonth);
    router.post('/journalEntry/recloseMonth', _journalEntryHandler.recloseMonth);
    router.delete('/:id', _journalHandler.remove);
    router.patch('/', _journalHandler.putchBulk);

    return router;
};
