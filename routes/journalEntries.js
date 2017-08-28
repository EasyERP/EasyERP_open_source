var express = require('express');
var router = express.Router();
var JournalEntryHandler = require('../handlers/journalEntry');
var PaymentsHandler = require('../handlers/payment');
var EmployeesHandler = require('../handlers/employee');
var InvoicesHandler = require('../handlers/invoices');
var JobsHandler = require('../handlers/jobs');
var OrderHandler = require('../handlers/order');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _journalEntryHandler = new JournalEntryHandler(models, event);
    var jobsHandler = new JobsHandler(models, event);
    var invoicesHandler = new InvoicesHandler(models, event);
    var employeesHandler = new EmployeesHandler(event, models);
    var paymentsHandler = new PaymentsHandler(models, event);
    var orderHandler = new OrderHandler(models, event);
    var moduleId = MODULES.JOURNALENTRY;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /journalEntries/getReconcileDate/ Request Reconcile Date
     *
     * @apiVersion 0.0.1
     * @apiName getReconcileDate
     * @apiGroup Journal Entries
     *
     * @apiSuccess {Object} ReconcileDate
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "date": "2014-07-13T21:00:00.000Z"
     }
     * */

    router.get('/getReconcileDate', _journalEntryHandler.getReconcileDate);
    router.get('/getForReport', _journalEntryHandler.getForReport);
    router.get('/getAsyncData', _journalEntryHandler.getAsyncData);
    router.get('/getSourceForDd', _journalEntryHandler.getSourceForDd);

    /**
     *@api {get} /journalEntries/getAsyncDataForGL Request AsyncDataForGL
     *
     * @apiVersion 0.0.1
     * @apiName getAsyncDataForGL
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} id
     * @apiParam (?Field=value) {String} startDate
     * @apiParam (?Field=value) {String} endDate
     *
     * @apiSuccess {Object} AsyncDataForGL
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "journalEntries": [
             {
               "_id": "2016-06-30T13:24:53.000Z",
               "credit": 0,
               "debit": 2350000,
               "account": "565eb53a6aa50532e5df0bdc"
             },
             {
               "_id": "2016-06-29T22:00:00.000Z",
               "credit": 2350000,
               "debit": 0,
               "account": "565eb53a6aa50532e5df0bdc"
             }
           ]
     }
     * */

    router.get('/getAsyncDataForGL', _journalEntryHandler.getAsyncDataForGL);
    router.get('/getAsyncForBalanceSheet', _journalEntryHandler.getAsyncForBalanceSheet);

    /**
     *@api {get} /journalEntries/getAsyncCloseMonth Request AsyncCloseMonth
     *
     * @apiVersion 0.0.1
     * @apiName getAsyncCloseMonth
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} _id
     *
     * @apiSuccess {Object} AsyncCloseMonth
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "journalEntries": [
             {
                 "_id": "56f90e8d8cea58642c57f442",
                 "debit": 600000,
                 "credit": 600000,
                 "date": "2014-08-31T18:59:59.999Z",
                 "journal": {
                     "_id": "56f90e8d8cea58642c57f442",
                     "name": "Close month / Admin expenses",
                     "creditAccount": "565eb53a6aa50532e5df0bf1",
                     "debitAccount": "56cc6bf2541812c07197356a",
                     "editedBy": {
                         "date": "2016-05-06T12:56:15.940Z",
                         "user": null
                     },
                     "createdBy": {
                         "date": "2016-03-28T10:59:25.489Z",
                         "user": null
                     },
                     "description": "",
                     "currency": {
                         "name": "USD"
                     },
                     "transaction": "Accrual",
                     "type": "",
                     "date": "2016-03-28T10:59:25.488Z",
                     "__v": 0
                 }
             },
             ...
         ]
     }
     * */

    router.get('/getAsyncCloseMonth', _journalEntryHandler.getAsyncCloseMonth);

    /**
     *@api {get} /journalEntries/getTrialBalance Request TrialBalance
     *
     * @apiVersion 0.0.1
     * @apiName getTrialBalance
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Boolean} reset=true
     * @apiParam (?Field=value) {Number} count=100
     * @apiParam (?Field=value) {Object} filter={startDate:{key:"startDate",value:...},endDate:{key:"endDate",value:...}}
     * @apiParam (?Field=value) {String} contentType="trialBalance" Type of content
     * @apiParam (?Field=value) {Boolean} showMore=false
     * @apiParam (?Field=value) {String} parrentContentId
     * @apiParam (?Field=value) {String} startDate
     * @apiParam (?Field=value) {String} endDate
     *
     * @apiSuccess {Object} TrialBalance
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
         "_id": "565eb53a6aa50532e5df0bc9",
         "name": "101200 Account Receivable",
         "debit": 19587378,
         "credit": 15553338.092053942
     },
     {
         "_id": "565eb53a6aa50532e5df0bcb",
         "name": "101402 Ukrsibbank USD ThinkMobiles",
         "debit": 6635200,
         "credit": 0
     },
     ...
     ]
     * */
    router.get('/getTrialBalance', _journalEntryHandler.getForGL);
    router.get('/getCashBook', _journalEntryHandler.getCashBook);

    /**
     *@api {get} /journalEntries/getBalanceSheet Request BalanceSheet
     *
     * @apiVersion 0.0.1
     * @apiName getBalanceSheet
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Boolean} reset=true
     * @apiParam (?Field=value) {Number} count=100
     * @apiParam (?Field=value) {Object} filter={startDate:{key:"startDate",value:...},endDate:{key:"endDate",value:...}}
     * @apiParam (?Field=value) {String} contentType="balanceSheet" Type of content
     * @apiParam (?Field=value) {Boolean} showMore=false
     * @apiParam (?Field=value) {String} parrentContentId
     * @apiParam (?Field=value) {String} startDate
     * @apiParam (?Field=value) {String} endDate
     *
     * @apiSuccess {Object} BalanceSheet
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "assets": [
             {
                 "_id": "565eb53a6aa50532e5df0bc9",
                 "name": "101200 Account Receivable",
                 "credit": 15553338.092053942,
                 "debit": 19587378
             },
             {
                 "_id": "565eb53a6aa50532e5df0bcb",
                 "name": "101402 Ukrsibbank USD ThinkMobiles",
                 "credit": 0,
                 "debit": 6635200
             },
             {
                 "_id": "565eb53a6aa50532e5df0bd2",
                 "name": "101500 Cash USD",
                 "credit": 2350000,
                 "debit": 6110355.91463318
             },
             {
                 "_id": "565eb53a6aa50532e5df0bd9",
                 "name": "104000 Finished Goods",
                 "credit": 17417345.153104898,
                 "debit": 17417345.153104894
             },
             {
                 "_id": "565eb53a6aa50532e5df0bda",
                 "name": "104001 Work In Process",
                 "credit": 17417345.153104886,
                 "debit": 13100063.676315987
             }
         ],
         "liabilities": [
             {
                 "_id": "565eb53a6aa50532e5df0bdc",
                 "name": "111100 Account Payable",
                 "credit": 2350000,
                 "debit": 2350000,
                 "group": "liabilities"
             },
             {
                 "_id": "56c4444eb81fd51e19207f3e",
                 "name": "111101 Salary Payable",
                 "credit": 8749694.736842107,
                 "debit": 0,
                 "group": "liabilities"
             },
             {
                 "_id": "56c9d555c3b88f6d64490fb5",
                 "name": "212103 Salary Overtime Paybale",
                 "credit": 48375,
                 "debit": 0,
                 "group": "liabilities"
             },
             {
                 "_id": "565eb53a6aa50532e5df0bdb",
                 "name": "111000 Unearned  Service Revenue",
                 "credit": 3062755.91463318,
                 "debit": 3009738.092053943,
                 "group": "liabilities"
             }
         ],
         "equity": [
             {
                 "_id": "565eb53a6aa50532e5df0bf3",
                 "name": [
                     "300200 Retained Earnings"
                 ],
                 "credit": -3917043.4411872514,
                 "debit": 0,
                 "group": "assets"
             }
         ]
     }
     * */

    router.get('/getBalanceSheet', _journalEntryHandler.getBalanceSheet);

    /**
     *@api {get} /journalEntries/getCloseMonth Request CloseMonth
     *
     * @apiVersion 0.0.1
     * @apiName getCloseMonth
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Boolean} reset=true
     * @apiParam (?Field=value) {Number} count=100
     * @apiParam (?Field=value) {Object} filter
     * @apiParam (?Field=value) {String} contentType="closeMonth" Type of content
     * @apiParam (?Field=value) {Boolean} showMore=false
     * @apiParam (?Field=value) {String} parrentContentId
     *
     * @apiSuccess {Object} CloseMonth
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
         "_id": "2014-08-31T18:59:59.999Z"
     },
     {
         "_id": "2014-09-30T18:59:59.999Z"
     },
     ...
     ]
     * */

    router.get('/getCloseMonth', _journalEntryHandler.getCloseMonth);

    /**
     *@api {get} /journalEntries/getProfitAndLoss Request ProfitAndLoss
     *
     * @apiVersion 0.0.1
     * @apiName getProfitAndLoss
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Boolean} reset=true
     * @apiParam (?Field=value) {Number} count=100
     * @apiParam (?Field=value) {Object} filter={startDate:{key:"startDate",value:...},endDate:{key:"endDate",value:...}}
     * @apiParam (?Field=value) {String} contentType="profitAndLoss" Type of content
     * @apiParam (?Field=value) {Boolean} showMore=false
     * @apiParam (?Field=value) {String} parrentContentId
     * @apiParam (?Field=value) {String} startDate
     * @apiParam (?Field=value) {String} endDate
     *
     * @apiSuccess {Object} ProfitAndLoss
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "grossFit": [
             {
                 "_id": "565eb53a6aa50532e5df0be0",
                 "name": "200000 Product Sales",
                 "debit": 19587378
             }
         ],
         "expenses": [
             {
                 "_id": "565eb53a6aa50532e5df0be2",
                 "name": "210000 Cost of Goods Sold",
                 "debit": 17417345.153104894
             }
         ],
         "dividends": 0
     }
     * */

    router.get('/getProfitAndLoss', _journalEntryHandler.getProfitAndLoss);

    /**
     *@api {get} /journalEntries/getCashFlow Request CashFlow
     *
     * @apiVersion 0.0.1
     * @apiName getCashFlow
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Boolean} reset=true
     * @apiParam (?Field=value) {Number} count=100
     * @apiParam (?Field=value) {Object} filter={startDate:{key:"startDate",value:...},endDate:{key:"endDate",value:...}}
     * @apiParam (?Field=value) {String} contentType="cashFlow" Type of content
     * @apiParam (?Field=value) {Boolean} showMore=false
     * @apiParam (?Field=value) {String} parrentContentId
     * @apiParam (?Field=value) {String} startDate
     * @apiParam (?Field=value) {String} endDate
     *
     * @apiSuccess {Object} CashFlow
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "operating": [
             {
                 "name": "Operating Income (EBIT)",
                 "debit": 2170032.846895106
             },
             {
                 "name": "101200 Account Receivable",
                 "debit": -4034039.9079460576
             },
             {
                 "name": [
                     "104000 Finished Goods"
                 ],
                 "debit": 3.725290298461914e-9
             },
             {
                 "name": [
                     "104001 Work In Process"
                 ],
                 "debit": 4317281.476788899
             },
             {
                 "name": [
                     "111101 Salary Payable"
                 ],
                 "debit": 8749694.736842107
             },
             {
                 "name": [
                     "212103 Salary Overtime Paybale"
                 ],
                 "debit": 48375
             },
             {
                 "name": [
                     "111000 Unearned  Service Revenue"
                 ],
                 "debit": 53017.82257923717
             },
             {
                 "name": [
                     "111100 Account Payable"
                 ],
                 "debit": 0
             }
         ],
         "investing": [],
         "financing": [
             {
                 "name": "777777 Dividends Payable",
                 "debit": 0
             }
         ]
     }
     * */

    router.get('/getCashFlow', _journalEntryHandler.getCashFlow);
    router.get('/getPayrollForReport', _journalEntryHandler.getPayrollForReport);

    /**
     *@api {get} /journalEntries/getInventoryReport Request InventoryReport
     *
     * @apiVersion 0.0.1
     * @apiName getInventoryReport
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100
     * @apiParam (?Field=value) {Object} filter
     * @apiParam (?Field=value) {String} contentType="inventoryReport" Type of content
     *
     * @apiSuccess {Object} InventoryReport
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "total": 183,
         "data": [
             {
                 "_id": "5769142ee6b2b396201e2409",
                 "name": "01-28.02.2016",
                 "salesmanager": "Yana Gusti",
                 "project": "55b92ad621e4b7c40f000694",
                 "projectName": "QA iOS Purple Ocean",
                 "openingBalance": 175.16254737246985,
                 "inwards": 0,
                 "outwards": 0,
                 "closingBalance": 175.16254737246985
             },
             {
                 "_id": "57691660d742b37b20468338",
                 "name": "01-30.05.2016",
                 "salesmanager": "Yana Gusti",
                 "project": "55b92ad621e4b7c40f000694",
                 "projectName": "QA iOS Purple Ocean",
                 "openingBalance": 260.6448134153063,
                 "inwards": 0,
                 "outwards": 0,
                 "closingBalance": 260.6448134153063
             },
             ...
         ]
     }
     * */

    router.get('/getInventoryReport', _journalEntryHandler.getInventoryReport);

    /**
     *@api {get} /journalEntries/getExpenses Request Expenses
     *
     * @apiVersion 0.0.1
     * @apiName getExpenses
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {Number} month
     * @apiParam (?Field=value) {Number} year
     *
     * @apiSuccess {Object} Expenses
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "actualHours": 6350,
         "vacationExpenses": 84000,
         "adminSalary": 366585.7142857143,
         "adminExpenses": 1119600,
         "idleExpenses": 1788812.5
     }
     * */
    router.get('/getExpenses', _journalEntryHandler.getExpenses);
    router.get('/getBalanceForAccount', _journalEntryHandler.getBalanceForAccount);
    router.get('/exportToXlsx', _journalEntryHandler.exportToXlsx);
    router.get('/exportToCsv', _journalEntryHandler.exportToCsv);

    router.get('/jobs', jobsHandler.getForJournalSource);
    router.get('/invoices', invoicesHandler.getInvoiceById);
    router.get('/payments', paymentsHandler.getById);
    router.get('/employees', employeesHandler.getForJournalSource);
    router.get('/order', orderHandler.getById);
    router.get('/taxReport', _journalEntryHandler.taxReport);

    /**
     *@api {get} /journalEntries/ Request JournalEntries
     *
     * @apiVersion 0.0.1
     * @apiName getJournalEntries
     * @apiGroup Journal Entries
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of JournalEntries which will show
     * @apiParam (?Field=value) {Object} filter
     * @apiParam (?Field=value) {String} contentType="journalEntry" Type of content
     *
     * @apiSuccess {Object} JournalEntries
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       "total": 1104,
       "data": [
         {
           "_id": "577a744b832a51132161e87d",
           "debit": 300000,
           "sourceDocument": {
             "model": "Invoice",
             "_id": {
               "_id": "576148951425f5f920989d42",
               "_type": "wTrackInvoice",
               "__v": 0,
               "project": "56e2924a1f2850d361927dd1",
               "products": [
                 {
                   "subTotal": 300000,
                   "unitPrice": 300000,
                   "taxes": null,
                   "jobs": "56e29ad7f9e1c56461b971d4",
                   "description": "",
                   "product": "5540d528dacb551c24000003",
                   "quantity": 1
                 }
               ],
               "emailed": false,
               "approved": true,
               "removable": false,
               "invoiced": false,
               "attachments": [
                 {
                   "uploaderName": "alex.sokhanych",
                   "uploadDate": "2016-06-15T12:22:57.524Z",
                   "size": "0.015&nbsp;Mb",
                   "shortPas": "uploads%2Finvoices%2F576148951425f5f920989d42%2FInvoice%20ThinkMobiles_DigiPresence%20.xlsx",
                   "name": "Invoice ThinkMobiles_DigiPresence .xlsx",
                   "_id": "576148a10a750b1a211b3c6e"
                 }
               ],
               "editedBy": {
                 "user": "563f673270bbc2b740ce89ae",
                 "date": "2016-06-15T12:23:04.190Z"
               },
               "createdBy": {
                 "user": "563f673270bbc2b740ce89ae",
                 "date": "2016-04-12T15:15:57.243Z"
               },
               "creationDate": "2016-04-12T15:15:57.243Z",
               "groups": {
                 "owner": "560c099da5d4a2e20ba5068b",
                 "users": [

                 ],
                 "group": [

                 ]
               },
               "whoCanRW": "everyOne",
               "workflow": "55647d982e4aa3804a765ecb",
               "paymentInfo": {
                 "total": 300000,
                 "balance": 0,
                 "unTaxed": 300000,
                 "taxes": 0
               },
               "paymentTerms": null,
               "salesPerson": "55b92ad221e4b7c40f00005f",
               "currency": {
                 "_id": "565eab29aeb95fa9c0f9df2d",
                 "rate": 1
               },
               "journal": "565ef6ba270f53d02ee71d65",
               "invoiceDate": "2016-05-31T22:00:00.000Z",
               "paymentReference": "PO948",
               "sourceDocument": "570d112d9c3d584d619a26a5",
               "supplier": "57347f7fa91aace5132deff9",
               "forSales": true,
               "name": "PO948",
               "dueDate": "2016-06-14T22:00:00.000Z",
               "paymentDate": "2016-06-12T22:00:00.000Z",
               "payments": [
                 "576148b3d2ebf06e2104e72a"
               ],
               "reconcile": true
             },
             "subject": {
               "name": {
                 "last": "",
                 "first": "Digipresence"
               }
             },
             "name": "PO948"
           },
           "currency": {
             "rate": 1,
             "name": "USD"
           },
           "journal": {
             "name": "Invoice Journal",
             "creditAccount": {
               "_id": "565eb53a6aa50532e5df0be0",
               "code": 200000,
               "account": "Product Sales",
               "type": "Income",
               "name": "200000 Product Sales"
             },
             "debitAccount": {
               "_id": "565eb53a6aa50532e5df0bc9",
               "code": 101200,
               "account": "Account Receivable",
               "type": "Current Assets",
               "name": "101200 Account Receivable",
               "editedBy": {
                 "date": "2016-05-06T10:04:35.796Z",
                 "user": "563f673270bbc2b740ce89ae"
               }
             }
           },
           "date": "2016-05-31T22:00:00.000Z"
         },
         ...
         ],
          "totalValue": 92027278.39113054
     }
     *
     * */

    router.get('/', _journalEntryHandler.getForView);

    // router.post('/', _journalEntryHandler.create);

    /**
     *@api {post} /journalEntries/reconcile/ Request for creating Reconcile
     *
     * @apiVersion 0.0.1
     * @apiName createReconcile
     * @apiGroup Journal Entries
     *
     * @apiParamExample {json} Request-Example:
     {
         "date": "14 Jul, 2014"
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success":true
     }
     * */

    router.post('/reconcile', _journalEntryHandler.reconcile);
    router.post('/createManual', _journalEntryHandler.createManual);
    router.post('/closeDay', _journalEntryHandler.closeDay);
    router.post('/recloseDay', _journalEntryHandler.recloseDay);
    router.post('/closeMonth', _journalEntryHandler.closeMonth);
    router.post('/recloseMonth', _journalEntryHandler.recloseMonth);

    router.delete('/', _journalEntryHandler.removeBulk);

    return router;
};
