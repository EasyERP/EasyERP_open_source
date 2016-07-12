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

    /**
     *@api {get} /journalEntries/getReconcileDate/ Request Reconcile Date
     *
     * @apiVersion 0.0.1
     * @apiName getReconcileDate
     * @apiGroup Journal Entries
     *
     * @apiSuccess {Object} ReconcileDate
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *      {
     *        "date": "2014-07-13T21:00:00.000Z"
     *      }
     * */
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
     *     HTTP/1.1 200 OK
     *     {
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

    router.post('/', _journalEntryHandler.create);

    /**
     *@api {post} /journalEntries/reconcile/ Request for creating Reconcile
     *
     * @apiVersion 0.0.1
     * @apiName createReconcile
     * @apiGroup Journal Entries
     *
     * @apiParamExample {json} Request-Example:
     * {
          "date": "14 Jul, 2014"
        }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "success":true
     *     }
     * */
    router.post('/reconcile', _journalEntryHandler.reconcile);
    router.post('/closeMonth', _journalEntryHandler.closeMonth);
    router.post('/recloseMonth', _journalEntryHandler.recloseMonth);

    return router;
};
