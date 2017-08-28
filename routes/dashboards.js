var CustomDashboardHandler = require('../handlers/dashboards');
var express = require('express');
var router = express.Router();

module.exports = function (models) {
    var handler = new CustomDashboardHandler(models);

    /**
     *@api {get} /dashboards/ Request Dashboards
     *
     * @apiVersion 0.0.1
     * @apiName getDashboards
     * @apiGroup dashboards
     *
     * @apiSuccess {Object} dashboards
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
       _id: "57faf984b18096e334d71436",
       description: "",
       charts: [

       ],
       columns: 6,
       rows: 4,
       created: "2016-10-10T02:14:28.527Z",
       name: "sales1"
     },
     {
       _id: "582bfabf5a43a4bc2524bf09",
       description: "",
       charts: [
         "582d617bb11d8d9405a196b1",
         "582d617bb11d8d9405a196b2",
         "582d617bb11d8d9405a196b3",
         "582d617bb11d8d9405a196b4",
         "582d617bb11d8d9405a196b5",
         "582d617bb11d8d9405a196b6",
         "582d617bb11d8d9405a196b8",
         "582d617bb11d8d9405a196b7",
         "582d617bb11d8d9405a196b9",
         "582d617bb11d8d9405a196be",
         "582d617bb11d8d9405a196ba",
         "582d617bb11d8d9405a196bc",
         "582d617bb11d8d9405a196bd",
         "582e9affd3b21a202767aad4"
       ],
       columns: 12,
       rows: 10,
       created: "2016-11-16T06:20:47.548Z",
       name: "Dashboard"
     }
     ]
     **/
    router.get('/', handler.getDashboards);

    /**
     *@api {get} /dashboards/582bfabf5a43a4bc2524bf09 Request Dashboards
     *
     * @apiVersion 0.0.1
     * @apiName getDashboards
     * @apiGroup dashboards
     *
     * @apiSuccess {Object} dashboards
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
       "_id": "582bfabf5a43a4bc2524bf09",
       "description": "",
       "charts": [
         {
           "_id": "582d617bb11d8d9405a196b1",
           "dataHeight": 1,
           "dataWidth": 6,
           "indexY": 0,
           "indexX": 6,
           "nameId": "chart",
           "type": "overview",
           "dataset": "totalSalesRevenue",
           "startDate": "01, Nov 2016",
           "endDate": "22, Nov 2016",
           "dashboard": "582bfabf5a43a4bc2524bf09",
           "name": "Sales Invoices"
         },
         {
           "_id": "582d617bb11d8d9405a196b2",
           "dataHeight": 2,
           "dataWidth": 4,
           "indexY": 1,
           "indexX": 4,
           "nameId": "chart",
           "type": "horizontalBar",
           "dataset": "revenueBySales",
           "startDate": "01, Nov 2016",
           "endDate": "22, Nov 2016",
           "dashboard": "582bfabf5a43a4bc2524bf09",
           "name": "Revenue By Sales Manager"
         },
         ...
       ],
       "columns": 12,
       "rows": 10,
       "created": "2016-11-16T06:20:47.548Z",
       "name": "Dashboard"
     }
     ]
     **/
    router.get('/:id', handler.getById);
    router.post('/', handler.createDashboard);
    router.patch('/:id', handler.updateDashboard);
    router.delete('/:id', handler.deleteDashboards);
    router.delete('/', handler.deleteDashboards);

    return router;
};
