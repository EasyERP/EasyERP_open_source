var express = require('express');
var router = express.Router();
var filterHandler = require('../handlers/filter');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new filterHandler(models);

    router.use(authStackMiddleware);
    
    router.get('/Employees', handler.getEmployeesFilters);
    router.get('/Persons', handler.getPersonFilters);
    router.get('/Companies', handler.getCompaniesFilters);
    router.get('/Applications', handler.getApplicationFilters);
    router.get('/Projects', handler.getProjectFilters);
    router.get('/Tasks', handler.getTasksFilters);
    router.get('/Invoices', handler.getInvoiceFilters);
    router.get('/salesInvoices', handler.getSalesInvoiceFilters);
    router.get('/salesProforma', handler.getSalesProformaFilters);
    router.get('/customerPayments', handler.getCustomerPaymentsFilters);
    router.get('/supplierPayments', handler.getSupplierPaymentsFilters);
    router.get('/Products', handler.getProductsFilters);
    router.get('/Quotations', handler.getQuotationFilters);
    router.get('/salesQuotations', handler.getSalesQuotationFilters);
    router.get('/salesOrders', handler.getSalesOrdersFilters);
    router.get('/Orders', handler.getOrdersFilters);
    router.get('/Leads', handler.getLeadsFilters);
    router.get('/Opportunities', handler.getOpportunitiesFilters);
    router.get('/salaryReport', handler.getSalaryReportFilters);
    router.get('/wTrack', handler.getWtrackFilters);
    router.get('/ExpensesInvoice', handler.getExpensesInvoiceFilters);
    router.get('/DividendInvoice', handler.getDividendInvoiceFilters);
    router.get('/DashVacation', handler.getDashVacationFilters);
    router.get('/ExpensesPayments', handler.getExpensesPaymentsFilters);
    router.get('/DividendPayments', handler.getDividendPaymentsFilters);
    router.get('/PayrollExpenses', handler.getPayRollFilters);
    router.get('/jobsDashboard', handler.getDashJobsFilters);
    router.get('/journalEntry', handler.getJournalEntryFilters);
    router.get('/inventoryReport', handler.getInventoryReportFilters);

    return router;
};
