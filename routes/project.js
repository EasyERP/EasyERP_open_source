var express = require('express');
var router = express.Router();
var ProjectHandler = require('../handlers/project');
var InvoiceHandler = require('../handlers/invoices');
var WeTrackHandler = require('../handlers/wTrack');
var JobsHandler = require('../handlers/jobs');
var OrderHandler = require('../handlers/order');
var PaymentsHandler = require('../handlers/payment');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';
    var handler = new ProjectHandler(models, event);
    var invoiceHandler = new InvoiceHandler(models);
    var wTrackHandler = new WeTrackHandler(null, models);
    var jobsHandler = new JobsHandler(models);
    var orderHandler = new OrderHandler(models);
    var paymentsHandler = new PaymentsHandler(models);

    var moduleId = MODULES.PROJECTS;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'project', event);
    }

    router.use(authStackMiddleware);

    /**
     *@api {get} /projects/ Request Projects
     *
     * @apiVersion 0.0.1
     * @apiName getProjects
     * @apiGroup Project
     *
     * @apiParam (?Field=value) {String} viewType="thumbnails" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=50 Count of Projects which will show
     * @apiParam (?Field=value) {String} contentType="Projects" Type of content
     *
     * @apiSuccess {Object} Projects
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "total": 245,
           "data": [
             {
               "_id": "55b92ad621e4b7c40f000686",
               "total": 245,
               "name": "Sensei",
               "task": [

               ],
               "workflow": {
                 "name": "In Progress"
               },
               "salesManager": {
                 "_id": "55b92ad221e4b7c40f00005f"
               },
               "customer": {
                 "name": {
                   "last": "Knudsen",
                   "first": "Thomas"
                 }
               },
               "health": 1,
               "projecttype": ""
             },
             ...
           ]
     }
     */
    router.get('/', accessStackMiddleWare, handler.getByViewType);
    router.get('/test', accessStackMiddleWare, handler.getByViewTypeTest);
    router.get('/getProjectPMForDashboard', accessStackMiddleWare, handler.getProjectPMForDashboard);

    router.get('/exportToXlsx', handler.exportToXlsx);
    router.get('/exportToCsv', handler.exportToCsv);

    /**
     *@api {get} /projects/getForQuotation/ Request ProjectsForQuotation
     *
     * @apiVersion 0.0.1
     * @apiName getProjectsForQuotation
     * @apiGroup Project
     *
     * @apiParam (?Field=value) {String} projectId Unique id of Project
     *
     * @apiSuccess {Object} ProjectsForQuotation
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "_id": "573db3d09fdef3d14282b561",
           "StartDate": "2016-04-30T22:00:00.000Z",
           "__v": 0,
           "budget": {
             "projectTeam": [

             ],
             "bonus": [

             ]
           },
           "bonus": [

           ],
           "health": 1,
           "editedBy": {
             "date": "2016-05-19T12:38:40.501Z",
             "user": "567181ae8453e8b464b70c19"
           },
           "attachments": [

           ],
           "notes": [

           ],
           "paymentMethod": "565f2e05ab70d49024242e07",
           "paymentTerms": "55536e52475b7be475f335f6",
           "projecttype": "fixed",
           "createdBy": {
             "date": "2016-05-19T12:38:40.501Z",
             "user": "567181ae8453e8b464b70c19"
           },
           "progress": 0,
           "remaining": 0,
           "logged": 0,
           "estimated": 0,
           "workflow": "528ce7d0f3f67bc40b000021",
           "parent": null,
           "sequence": 0,
           "groups": {
             "group": [

             ],
             "users": [

             ],
             "owner": "55b9fc0fd79a3a3439000008"
           },
           "whoCanRW": "everyOne",
           "customer": "57347f7fa91aace5132deff9",
           "task": [

           ],
           "name": "ADBC",
           "projectShortDesc": "Abu-Dhabi Business Centre"
     }
     */
    router.get('/getForQuotation', accessStackMiddleWare, handler.getForQuotation);

    /**
     *@api {get} /projects/projectType Request ProjectTypes
     *
     * @apiVersion 0.0.1
     * @apiName getProjectTypes
     * @apiGroup Project
     *
     * @apiSuccess {Object} ProjectTypes
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "data": [
             {
               "_id": "fixed",
               "name": "fixed"
             },
             {
               "_id": "mixed",
               "name": "mixed"
             },
             {
               "_id": "time & material",
               "name": "time & material"
             }
           ]
     }
     */
    router.get('/projectType', handler.getProjectType);

    /**
     *@api {get} /projects/forDD Request ProjectsForDD
     *
     * @apiVersion 0.0.1
     * @apiName getProjectsForDD
     * @apiGroup Project
     *
     * @apiSuccess {Object} ProjectsForDD
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "data": [
             {
               "_id": "56e689c75ec71b00429745a9",
               "projectShortDesc": "SDK",
               "name": "360CamSDK"
             },
             {
               "_id": "571a079eb629a41976c9ac96",
               "projectShortDesc": "Peter Hickey",
               "name": "3D Bolus (Windows)"
             },
             ...
           ]
     }
     */
    router.get('/getForDd', handler.getForDd);
    // router.get('/getForDashboard', handler.getForDashboard);

    /**
     *@api {get} /projects/getForWtrack Request ProjectsForWTrack
     *
     * @apiVersion 0.0.1
     * @apiName getProjectsForWTrack
     * @apiGroup Project
     *
     * @apiSuccess {Object} ProjectsForWTrack
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "data": [
             {
               "_id": "56e689c75ec71b00429745a9",
               "TargetEndDate": "2016-03-31T00:00:00.000Z",
               "StartDate": null,
               "budget": {
                 "projectTeam": [
                   "56e6f1ae0d773c634e918b68"
                 ],
                 "bonus": [

                 ]
               },
               "bonus": [

               ],
               "health": 1,
               "editedBy": {
                 "date": "2016-03-14T16:19:02.059Z",
                 "user": "55b9fc0fd79a3a3439000008"
               },
               "attachments": [

               ],
               "notes": [

               ],
               "projecttype": "iOs",
               "createdBy": {
                 "date": "2016-03-14T09:52:07.280Z",
                 "user": "55b9fc0fd79a3a3439000008"
               },
               "progress": 0,
               "remaining": 0,
               "logged": 0,
               "estimated": 0,
               "workflow": {
                 "_id": "528ce7f2f3f67bc40b000023",
                 "name": "In Progress"
               },
               "parent": null,
               "sequence": 0,
               "groups": {
                 "owner": "560c099da5d4a2e20ba5068b",
                 "users": [

                 ],
                 "group": [

                 ]
               },
               "whoCanRW": "everyOne",
               "customer": {
                 "_id": "56a9eeabd59a04d6225b0df5",
                 "name": {
                   "last": "Voloshchuk",
                   "first": "Peter"
                 }
               },
               "task": [
                 "5717661c2c8b789c7a0bb82d"
               ],
               "projectShortDesc": "SDK",
               "__v": 0,
               "EndDate": null,
               "paymentTerms": {
                 "_id": "55536e52475b7be475f335f6",
                 "name": "15 Days"
               },
               "paymentMethod": "565f2e05ab70d49024242e07",
               "name": "360CamSDK"
             },
             ...
             ]
     }
     */
    router.get('/getForWtrack', /*accessStackMiddleWare,*/ handler.getForWtrack);

    /**
     *@api {get} /projects/getFilterValues/ Request FilterValues
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Project
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
         "_id": null,
         "project": [
             "360CamSDK",
             "3D ArtistModelling",
             "3D Bolus (Windows)",
             "3DBolus",
              ...
         ],
         "startDate": [
             "",
             "2016-07-05T22:00:00.000Z",
             "2016-07-03T22:00:00.000Z",
             "2016-06-30T22:00:00.000Z",
              ...
         ],
         "endDate": [
             "",
             null
         ]
     }
     ]
     */
    router.get('/getFilterValues', accessStackMiddleWare, handler.getFilterValues);

    /**
     *@api {get} /projects/emails/:id Request ProjectEmails
     *
     * @apiVersion 0.0.1
     * @apiName getProjectEmails
     * @apiGroup Project
     *
     * @apiParam {String} id Unique id of Project
     *
     * @apiSuccess {Object} ProjectEmails
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
         "customerCompany": "info@kenlo-group.com",
         "customerPersons": [
             "igor@kenlo-group.com"
         ]
     }
     ]
     */
    router.get('/emails/:id', accessStackMiddleWare, handler.getEmails);

    /**
     *@api {get} /projects/:id Request Project
     *
     * @apiVersion 0.0.1
     * @apiName getProject
     * @apiGroup Project
     *
     * @apiParam {String} id Unique id of Project
     *
     * @apiSuccess {Object} Project
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": "55b92ad621e4b7c40f000660",
         "EndDate": null,
         "StartDate": null,
         "health": 1,
         "attachments": [],
         "notes": [
             {
                 "author": "anton.nizhegorodov",
                 "date": "12 Apr, 2016",
                 "_id": "570ca2fcba64e33d603a789a",
                 "title": "",
                 "note": ""
             },
             {
                 "author": "anton.nizhegorodov",
                 "date": "2016-04-12T07:26:37.315Z",
                 "_id": "570ca309ba64e33d603a789b",
                 "title": "",
                 "note": ""
             }
         ],
         "projecttype": "",
         "workflow": {
             "_id": "528ce82df3f67bc40b000025",
             "name": "Closed"
         },
         "groups": {
             "group": [],
             "users": [],
             "owner": {
                 "_id": "55ba28c8d79a3a3439000016",
                 "login": "AndrianaLemko"
             }
         },
         "whoCanRW": "everyOne",
         "customer": {
             "_id": "55b92ad621e4b7c40f00064f",
             "fullName": "Kenlo Group Ltd "
         },
         "projectShortDesc": "emptyProject",
         "TargetEndDate": null,
         "description": "",
         "paymentTerms": {
             "_id": "55536e52475b7be475f335f6",
             "name": "15 Days"
         },
         "paymentMethod": {
             "_id": "565f2e05ab70d49024242e07",
             "name": "Erste USD",
             "account": "HU24 1160 0006 0000 0000 4916 1522",
             "currency": "USD",
             "bank": "Erste Bank",
             "owner": "Alexander Sokhanych"
         },
         "name": "iOS1",
         "salesManager": {
             "_id": "55b92ad221e4b7c40f00004f",
             "fullName": "Alex Sokhanych"
         },
         "projectManager": {
             "fullName": null
         }
     }
     */
    router.get('/:id', accessStackMiddleWare, handler.getById);

    /**
     *@api {get} /projects/:id/invoices Request ProjectInvoices
     *
     * @apiVersion 0.0.1
     * @apiName getProjectInvoices
     * @apiGroup Project
     *
     * @apiParam {String} id Unique id of Project
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of ProjectInvoices which will show
     * @apiParam (?Field=value) {String="proforma","salesInvoice"} contentType Type of content
     *
     * @apiParam (?Field=value) {Object} filter={forSales : {key: "forSales", type: "Boolean", value: false}}
     *
     * @apiSuccess {Object} ProjectInvoices
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "total": 1,
           "data": [
             {
               "_id": "5710d954bdf5e5ce780db66e",
               "total": 1,
               "salesPerson": {
                 "_id": "55b92ad221e4b7c40f00005f",
                 "name": {
                   "last": "Voloshchuk",
                   "first": "Peter"
                 }
               },
               "workflow": {
                 "status": "Done",
                 "name": "Paid"
               },
               "supplier": {
                 "_id": "55b92ad621e4b7c40f00064b",
                 "name": {
                   "last": "Knudsen",
                   "first": "Thomas"
                 }
               },
               "forSales": true,
               "currency": {
                 "_id": "565eab29aeb95fa9c0f9df2d",
                 "rate": 1
               },
               "paymentInfo": {
                 "total": 300000,
                 "unTaxed": 300000,
                 "balance": 0,
                 "taxes": 0
               },
               "invoiceDate": "2016-03-01T04:00:00.000Z",
               "name": "PO975",
               "paymentDate": "2016-03-14T04:00:00.000Z",
               "dueDate": "2016-04-21T00:00:00.000Z",
               "payments": [
                 "5710d979508b8c5f797ce3a7"
               ],
               "approved": true,
               "_type": "Proforma",
               "removable": true,
               "paid": 3000
             }
           ]
     }
     */
    router.get('/:id/invoices', accessStackMiddleWare, invoiceHandler.getForProject);

    /**
     *@api {get} /projects/:id/weTracks Request ProjectWTracks
     *
     * @apiVersion 0.0.1
     * @apiName getProjectWTracks
     * @apiGroup Project
     *
     * @apiParam {String} id Unique id of Project
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of ProjectWTracks which will show
     *
     * @apiSuccess {Object} ProjectWTracks
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "total": 75,
           "data": [
             {
               "1": 0,
               "2": 0,
               "3": 3,
               "4": 4,
               "5": 0,
               "6": 0,
               "7": 0,
               "_id": "5780eed25dc67c373fcf4a65",
               "worked": 7,
               "month": 7,
               "year": 2016,
               "week": 27,
               "jobs": {
                 "_id": "56b8b958d54899a905ae0273",
                 "name": "15.05.15 - 15.07.16"
               },
               "isPaid": false,
               "cost": 0,
               "_type": "ordinary",
               "department": {
                 "name": "Web"
               },
               "employee": {
                 "name": {
                   "last": "Stupchuk",
                   "first": "Andriy"
                 }
               },
               "project": {
                 "_id": "55b92ad621e4b7c40f000686",
                 "name": "Sensei"
               },
               "customer": {
                 "_id": "55b92ad621e4b7c40f00064b",
                 "name": {
                   "last": "Knudsen",
                   "first": "Thomas"
                 }
               }
             },
             ...
           ]
     }
     */
    router.get('/:id/weTracks', accessStackMiddleWare, wTrackHandler.getForProject);

    /**
     *@api {get} /projects/:id/info Request ProjectInfo
     *
     * @apiVersion 0.0.1
     * @apiName getProjectInfo
     * @apiGroup Project
     *
     * @apiParam {String} id Unique id of Project
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100
     * @apiParam (?Field=value) {String} projectId
     *
     * @apiParam (?Field=value) {Object} filter={project : {key: "project._id", value: ...}}
     *
     * @apiSuccess {Object} ProjectInfo
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
       "_id": "56b8b958d54899a905ae0273",
       "revenueTotal": 600000,
       "profitTotal": -105017.70047110086,
       "costTotal": 705017.7004711009,
       "workedTotal": 898,
       "name": "15.05.15 - 15.07.16",
       "invoice": {

       },
       "type": "Quoted",
       "quotation": {
         "_id": "5710d94b04850cef78c94929",
         "name": "PO975"
       },
       "workflow": {
         "_id": "56337c705d49d8d6537832eb",
         "name": "In Progress"
       },
       "cost": 705017.7004711009,
       "jobPrice": 600000,
       "totalWorked": 898,
       "revenue": [
         {
           "employee": {
             "_id": "55b92ad221e4b7c40f000063",
             "name": "Yana Gusti",
             "worked": 242
           },
           "department": "QA",
           "revenue": 161692.6503340757
         },
         ...
       ],
       "totalRevenue": 600000,
       "profit": -105017.70047110086
     }
     ]
     */
    router.get('/:id/info', accessStackMiddleWare, jobsHandler.getForOverview);

    /**
     *@api {get} /projects/:id/quotations Request ProjectQuotations
     *
     * @apiVersion 0.0.1
     * @apiName getProjectQuotations
     * @apiGroup Project
     *
     * @apiParam {String} id Unique id of Project
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of salesQuotations which will show
     * @apiParam (?Field=value) {String} contentType="salesQuotations" Type of content
     *
     * @apiParam (?Field=value) {Object} filter={forSales : {key: "forSales", type: "Boolean", value: true}}
     *
     * @apiSuccess {Object} ProjectQuotations
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "total": 1,
         "data": [
             {
                 "_id": "5710d94b04850cef78c94929",
                 "total": 1,
                 "salesPerson": {
                     "_id": "55b92ad221e4b7c40f00005f",
                     "name": {
                         "last": "Voloshchuk",
                         "first": "Peter"
                     }
                 },
                 "workflow": {
                     "name": "Not Ordered",
                     "status": "New"
                 },
                 "supplier": {
                     "_id": "55b92ad621e4b7c40f00064b",
                     "name": {
                         "last": "Knudsen",
                         "first": "Thomas"
                     }
                 },
                 "currency": {
                     "rate": 1,
                     "_id": "565eab29aeb95fa9c0f9df2d"
                 },
                 "paymentInfo": {
                     "total": 600000,
                     "unTaxed": 600000,
                     "taxes": 0
                 },
                 "orderDate": "2015-12-01T00:00:00.000Z",
                 "name": "PO975",
                 "isOrder": false
             }
         ]
     }
     */
    router.get('/:id/orders', accessStackMiddleWare, orderHandler.getForProject);
    router.get('/:id/payments', accessStackMiddleWare, paymentsHandler.getForProject);

    /**
     *@api {post} /projects/ Request for creating new Project
     *
     * @apiVersion 0.0.1
     * @apiName createNewProject
     * @apiGroup Project
     *
     * @apiParamExample {json} Request-Example:
     {
           "name": "Sensei",
           "projectShortDesc": "emptyProject",
           "customer": {
             "_id": "55b92ad621e4b7c40f00064b",
             "name": {
               "first": "Thomas",
               "last": "Knudsen"
             }
           },
           "workflow": {
             "_id": "528ce7f2f3f67bc40b000023",
             "name": "In Progress"
           },
           "projecttype": "mixed",
           "description": "",
           "paymentTerms": "55536e52475b7be475f335f9",
           "paymentMethod": "565f2e05ab70d49024242e07",
           "teams": {
             "users": [

             ]
           },
           "groups": {
             "owner": "560c099da5d4a2e20ba5068b",
             "users": [

             ],
             "group": [

             ]
           },
           "whoCanRW": "everyOne",
           "health": 1,
           "budget": {
             "bonus": [

             ],
             "projectTeam": [

             ]
           }
     }
     *
     * @apiSuccess {Object} CreatedProject
     * @apiSuccessExample Success-Response:
     HTTP/1.1 201 Created
     {
           "_id": "55b92ad621e4b7c40f000686",
           "EndDate": null,
           "StartDate": null,
           "ID": 1102,
           "__v": 0,
           "TargetEndDate": "",
           "description": "",
           "budget": {
             "projectTeam": [

             ],
             "bonus": [

             ]
           },
           "bonus": [
             {
               "bonusId": "55b92ad521e4b7c40f000608",
               "employeeId": "55b92ad221e4b7c40f00005f",
               "_id": "56fcdd4853db5c9d03fc9e82",
               "endDate": null,
               "startDate": null
             }
           ],
           "health": 1,
           "editedBy": {
             "date": "2016-03-31T08:18:16.522Z",
             "user": "55b9fc0fd79a3a3439000008"
           },
           "attachments": [

           ],
           "notes": [

           ],
           "paymentMethod": "565f2e05ab70d49024242e07",
           "paymentTerms": "55536e52475b7be475f335f9",
           "projecttype": "mixed",
           "createdBy": {
             "date": "2015-07-29T19:34:46.314Z",
             "user": "52203e707d4dba8813000003"
           },
           "progress": 0,
           "remaining": 0,
           "logged": 0,
           "estimated": 0,
           "workflow": "528ce7f2f3f67bc40b000023",
           "parent": null,
           "sequence": 0,
           "groups": {
             "group": [

             ],
             "users": [

             ],
             "owner": "560c099da5d4a2e20ba5068b"
           },
           "whoCanRW": "everyOne",
           "customer": "55b92ad621e4b7c40f00064b",
           "task": [

           ],
           "name": "Sensei",
           "projectShortDesc": "emptyProject"
     }
     */
    router.post('/', accessStackMiddleWare, handler.create);

    /**
     *@api {post} /projects/uploadFiles/ Request for uploading files and updating Customer
     *
     * @apiVersion 0.0.1
     * @apiName uploadFiles
     * @apiGroup Project
     *
     * @apiHeader (HeaderName=HeaderValue) {String} Content-Type="multipart/form-data"
     * @apiHeader (HeaderName=HeaderValue) {String} modelid
     * @apiHeader (HeaderName=HeaderValue) {String} modelname="Projects"
     *
     * @apiSuccess {Object} UpdatedCustomer
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "success": "Customers updated success",
           "data": {
             "_id": "55b92ad621e4b7c40f000686",
             "EndDate": null,
             "StartDate": null,
             "ID": 1102,
             "__v": 0,
             "TargetEndDate": "",
             "description": "",
             "budget": {
               "projectTeam": [

               ],
               "bonus": [

               ]
             },
             "bonus": [
               {
                 "bonusId": "55b92ad521e4b7c40f000608",
                 "employeeId": "55b92ad221e4b7c40f00005f",
                 "_id": "56fcdd4853db5c9d03fc9e82",
                 "endDate": null,
                 "startDate": null
               }
             ],
             "health": 1,
             "editedBy": {
               "date": "2016-03-31T08:18:16.522Z",
               "user": "55b9fc0fd79a3a3439000008"
             },
             "attachments": [
               {
                 "_id": "57877c93234b736c3842f57e",
                 "name": "soedinennye-shtaty-nyu-york-65.jpg",
                 "shortPas": "uploads%2Fprojects%2F55b92ad621e4b7c40f000686%2Fsoedinennye-shtaty-nyu-york-65.jpg",
                 "size": "0.544&nbsp;Mb",
                 "uploadDate": "2016-07-14T11:50:43.933Z",
                 "uploaderName": "admin"
               }
             ],
             "notes": [

             ],
             "paymentMethod": "565f2e05ab70d49024242e07",
             "paymentTerms": "55536e52475b7be475f335f9",
             "projecttype": "mixed",
             "createdBy": {
               "date": "2015-07-29T19:34:46.314Z",
               "user": "52203e707d4dba8813000003"
             },
             "progress": 0,
             "remaining": 0,
             "logged": 0,
             "estimated": 0,
             "workflow": "528ce7f2f3f67bc40b000023",
             "parent": null,
             "sequence": 0,
             "groups": {
               "group": [

               ],
               "users": [

               ],
               "owner": "560c099da5d4a2e20ba5068b"
             },
             "whoCanRW": "everyOne",
             "customer": "55b92ad621e4b7c40f00064b",
             "task": [

             ],
             "name": "Sensei",
             "projectShortDesc": "emptyProject"
           }
     }
     */
    router.post('/uploadFiles', accessStackMiddleWare, multipartMiddleware, handler.uploadFile);
    router.post('/updateAllProjects', accessStackMiddleWare, handler.updateAllProjects);
    router.post('/sendInvoice', accessStackMiddleWare, handler.sendInvoice);

    /**
     *@api {patch} /projects/:id Request for partly updating Project
     *
     * @apiVersion 0.0.1
     * @apiName updatingProject
     * @apiGroup Project
     *
     * @apiParam {String} id Unique id of Project
     * @apiParamExample {json} Request-Example:
     {
           "name": "Sensei",
           "projectShortDesc": "notEmptyProject",
           "customer": {
             "_id": "55b92ad621e4b7c40f00064b",
             "name": {
               "first": "Thomas",
               "last": "Knudsen"
             }
           },
           "workflow": {
             "_id": "528ce7f2f3f67bc40b000023",
             "name": "In Progress"
           },
           "projecttype": "mixed",
           "description": "",
           "paymentTerms": "55536e52475b7be475f335f9",
           "paymentMethod": "565f2e05ab70d49024242e07",
           "teams": {
             "users": [

             ]
           },
           "groups": {
             "owner": "560c099da5d4a2e20ba5068b",
             "users": [

             ],
             "group": [

             ]
           },
           "whoCanRW": "everyOne",
           "health": 1,
           "budget": {
             "bonus": [

             ],
             "projectTeam": [

             ]
           }
     }
     *
     * @apiSuccess {Object} UpdatedProject
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "_id": "55b92ad621e4b7c40f000686",
           "EndDate": null,
           "StartDate": null,
           "ID": 1102,
           "__v": 0,
           "TargetEndDate": "",
           "description": "",
           "budget": {
             "projectTeam": [

             ],
             "bonus": [

             ]
           },
           "bonus": [
             {
               "bonusId": "55b92ad521e4b7c40f000608",
               "employeeId": "55b92ad221e4b7c40f00005f",
               "_id": "56fcdd4853db5c9d03fc9e82",
               "endDate": null,
               "startDate": null
             }
           ],
           "health": 1,
           "editedBy": {
             "date": "2016-03-31T08:18:16.522Z",
             "user": "55b9fc0fd79a3a3439000008"
           },
           "attachments": [
             {
               "_id": "57877c93234b736c3842f57e",
               "name": "soedinennye-shtaty-nyu-york-65.jpg",
               "shortPas": "uploads%2Fprojects%2F55b92ad621e4b7c40f000686%2Fsoedinennye-shtaty-nyu-york-65.jpg",
               "size": "0.544&nbsp;Mb",
               "uploadDate": "2016-07-14T11:50:43.933Z",
               "uploaderName": "admin"
             }
           ],
           "notes": [

           ],
           "paymentMethod": "565f2e05ab70d49024242e07",
           "paymentTerms": "55536e52475b7be475f335f9",
           "projecttype": "mixed",
           "createdBy": {
             "date": "2015-07-29T19:34:46.314Z",
             "user": "52203e707d4dba8813000003"
           },
           "progress": 0,
           "remaining": 0,
           "logged": 0,
           "estimated": 0,
           "workflow": "528ce7f2f3f67bc40b000023",
           "parent": null,
           "sequence": 0,
           "groups": {
             "group": [

             ],
             "users": [

             ],
             "owner": "560c099da5d4a2e20ba5068b"
           },
           "whoCanRW": "everyOne",
           "customer": "55b92ad621e4b7c40f00064b",
           "task": [

           ],
           "name": "Sensei",
           "projectShortDesc": "notEmptyProject"
     }
     */
    router.patch('/:id', accessStackMiddleWare, handler.updateOnlySelectedFields);

    router.delete('/:id', accessStackMiddleWare, handler.remove);

    /**
     *@api {delete} /projects/ Request for deleting selected Projects
     *
     * @apiVersion 0.0.1
     * @apiName deletingProjects
     * @apiGroup Project
     *
     * @apiParamExample {json} Request-Example:
     {
         "contentType": "Projects",
         "ids": [
             "57835e33d72226643fc8d4c1",
             "577d2b5a3e23cb6656e89457"
         ]
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "ok":1,
         "n":2
     }
     */
    router.delete('/', accessStackMiddleWare, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
