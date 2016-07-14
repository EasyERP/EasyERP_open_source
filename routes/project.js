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
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';
    var handler = new ProjectHandler(models, event);
    var invoiceHandler = new InvoiceHandler(models);
    var wTrackHandler = new WeTrackHandler(null, models);
    var jobsHandler = new JobsHandler(models);
    var quotationHandler = new QuotationHandler(models);
    var paymentsHandler = new PaymentsHandler(models);

    var moduleId = MODULES.PROJECTS;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

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
     *     HTTP/1.1 200 OK
     *     {
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
     *     HTTP/1.1 200 OK
     *     {
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
    router.get('/projectType', accessStackMiddleWare, handler.getProjectType);

    /**
     *@api {get} /projects/forDD Request ProjectsForDD
     *
     * @apiVersion 0.0.1
     * @apiName getProjectsForDD
     * @apiGroup Project
     *
     * @apiSuccess {Object} ProjectsForDD
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
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
    router.get('/getForDd', accessStackMiddleWare, handler.getForDd);
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
     *     HTTP/1.1 200 OK
     *     {
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
    router.get('/getForWtrack', accessStackMiddleWare, handler.getForWtrack);

    /**
     *@api {get} /projects/getFilterValues/ Request FilterValues
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Project
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
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
     *@apiParam {String} id Unique id of Project
     *
     * @apiSuccess {Object} ProjectEmails
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
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
     *@apiParam {String} id Unique id of Project
     *
     * @apiSuccess {Object} Project
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
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
    router.get('/:id/invoices', accessStackMiddleWare, invoiceHandler.getForProject);
    router.get('/:id/weTracks', accessStackMiddleWare, wTrackHandler.getForProject);
    router.get('/:id/info', accessStackMiddleWare, jobsHandler.getForOverview);
    router.get('/:id/quotations', accessStackMiddleWare, quotationHandler.getForProject);
    router.get('/:id/orders', accessStackMiddleWare, quotationHandler.getForProject);
    router.get('/:id/payments', accessStackMiddleWare, paymentsHandler.getForProject);

    /**
     *@api {post} /projects/ Request for creating new Project
     *
     * @apiVersion 0.0.1
     * @apiName createNewProject
     * @apiGroup Project
     *
     * @apiParamExample {json} Request-Example:
     * {
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
     *     HTTP/1.1 201 Created
     *     {
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
     * @apiSuccess {Object} UpdatedCustomer
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
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
    //todo "@apiParamExample"
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
     * {
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
     *     HTTP/1.1 200 OK
     *     {
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
     * {
          "contentType": "Projects",
          "ids": [
            "57835e33d72226643fc8d4c1",
            "577d2b5a3e23cb6656e89457"
          ]
        }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *      "ok":1,
     *      "n":2
     *     }
     */
    router.delete('/', accessStackMiddleWare, handler.bulkRemove);

    return router;
};
