var express = require('express');
var router = express.Router();
var OpportunityHandler = require('../handlers/opportunity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';

    var handler = new OpportunityHandler(models, event);
    var moduleId = MODULES.LEADS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /leads/ Request Leads
     *
     * @apiVersion 0.0.1
     * @apiName getLeads
     * @apiGroup Leads
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Leads which will show
     * @apiParam (?Field=value) {String} contentType="Leads" Type of content
     *
     * @apiSuccess {Object} Leads
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
          "total": 219,
          "data": [
            {
              "_id": "573f2367abbc5755574c980b",
              "total": 219,
              "contactName": "Irving Steel",
              "salesPerson": {
                "_id": "55b92ad221e4b7c40f0000a0",
                "name": {
                  "last": "Bilak",
                  "first": "Ivan"
                }
              },
              "workflow": {
                "_id": "528ce79bf3f67bc40b000020",
                "name": "Cancelled",
                "status": "Cancelled"
              },
              "createdBy": {
                "user": "bohdana.stets",
                "date": "2016-05-20T14:47:03.943Z"
              },
              "name": "Ruby on Rails",
              "source": "",
              "address": {
                "country": "USA"
              }
            },
            {
              "_id": "574443c824b1cdef660b775e",
              "total": 219,
              "contactName": "Mansour ",
              "salesPerson": {
                "_id": "55b92ad221e4b7c40f00005f",
                "name": {
                  "last": "Voloshchuk",
                  "first": "Peter"
                }
              },
              "workflow": {
                "_id": "574ff52cf44dcec01dbb6e16",
                "name": "Qualified",
                "status": "Done"
              },
              "createdBy": {
                "user": "peter.volosh",
                "date": "2016-05-24T12:06:32.419Z"
              },
              "name": "Startup app",
              "source": null,
              "address": {
                "country": "Saudi Arabia"
              }
            },
            ...
            ]
    }
     **/
    router.get('/', handler.getByViewType);
    router.get('/getLeadsForChart', handler.getLeadsForChart);

    /**
     *@api {get} /leads/priority/ Request priority
     *
     * @apiVersion 0.0.1
     * @apiName getPriority
     * @apiGroup Leads
     *
     * @apiSuccess {Object} Priority
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
          "data": [
            {
              "_id": "Trivial",
              "type": "Leads",
              "priority": "Trivial"
            },
            {
              "_id": "Low",
              "type": "Leads",
              "priority": "Low"
            },
            {
              "_id": "Medium",
              "type": "Leads",
              "priority": "Medium"
            },
            {
              "_id": "High",
              "type": "Leads",
              "priority": "High"
            }
          ]
        }
     **/
    router.get('/priority', handler.getLeadsPriority);

    /**
     *@api {post} /leads/uploadFiles/ Request for uploading files and updating Opportunity
     *
     * @apiVersion 0.0.1
     * @apiName uploadFiles
     * @apiGroup Leads
     *
     * @apiSuccess {Object} UpdatedOpportunity
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
  "success": "Opportunity updated success",
  "data": {
    "_id": "573f2367abbc5755574c980b",
    "__v": 0,
    "skype": "",
    "social": {
      "LI": "",
      "FB": ""
    },
    "projectType": "fixed",
    "attachments": [
      {
        "_id": "5784e65fb75246bf3ee4f2b8",
        "name": "gory-ozero-priroda-pristan.jpg",
        "shortPas": "uploads%2Fleads%2F573f2367abbc5755574c980b%2Fgory-ozero-priroda-pristan.jpg",
        "size": "0.312&nbsp;Mb",
        "uploadDate": "2016-07-12T12:45:19.082Z",
        "uploaderName": "admin"
      }
    ],
    "notes": [

    ],
    "convertedDate": "2016-05-20T14:47:03.943Z",
    "isConverted": false,
    "source": "",
    "campaign": "",
    "editedBy": {
      "date": "2016-06-10T13:01:05.979Z",
      "user": "573d7f7907676c6435eeff3e"
    },
    "createdBy": {
      "date": "2016-05-20T14:47:03.943Z",
      "user": "573d7f7907676c6435eeff3e"
    },
    "sequence": 76,
    "groups": {
      "group": [

      ],
      "users": [

      ],
      "owner": "560c099da5d4a2e20ba5068b"
    },
    "whoCanRW": "everyOne",
    "workflow": "528ce79bf3f67bc40b000020",
    "reffered": "",
    "optout": false,
    "active": true,
    "color": "#4d5a75",
    "categories": {
      "name": "",
      "id": ""
    },
    "priority": "Trivial",
    "expectedClosing": null,
    "nextAction": {
      "date": "2016-05-20T14:47:03.943Z",
      "desc": ""
    },
    "internalNotes": "Відповіли що зацікавлені, вони наймають розробників і чи маємо ми розробників з досвідом на Ruby on Rails. Я відповіла що можу надіслати CV наших розробників і запропонувала організувати колл.",
    "salesTeam": null,
    "salesPerson": "55b92ad221e4b7c40f0000a0",
    "func": "",
    "phones": {
      "fax": "",
      "phone": "",
      "mobile": ""
    },
    "email": "Irving@prevailhs.com",
    "contactName": {
      "last": "Steel",
      "first": "Irving"
    },
    "address": {
      "country": "USA",
      "zip": "",
      "state": "",
      "city": "Chicago",
      "street": ""
    },
    "customer": null,
    "company": null,
    "tempCompanyField": "Prevail Health",
    "creationDate": "2016-05-20T14:47:03.942Z",
    "expectedRevenue": {
      "currency": "",
      "progress": 0,
      "value": 0
    },
    "name": "Ruby on Rails",
    "isOpportunitie": false
  }
}
     **/
    //todo "@apiParamExample"
    router.post('/uploadFiles', multipartMiddleware, handler.uploadFile);

    /**
     *@api {post} /leads/ Request for creating new Lead
     *
     * @apiVersion 0.0.1
     * @apiName createNewLead
     * @apiGroup Leads
     *
     * @apiParamExample {json} Request-Example:
     * {
          "isOpportunitie": false,
          "createCustomer": false,
          "name": "Ruby on Rails\tIrving Steel",
          "company": {
            "name": "",
            "id": ""
          },
          "customer": null,
          "address": {
            "street": "",
            "city": "",
            "state": "",
            "zip": "",
            "country": ""
          },
          "salesPerson": null,
          "contactName": {
            "first": "Eric",
            "last": "Vamosh"
          },
          "email": "eric@gmail.com",
          "func": "",
          "phones": {
            "phone": "",
            "mobile": "",
            "fax": ""
          },
          "categories": {
            "id": "",
            "name": ""
          },
          "internalNotes": "",
          "active": false,
          "optout": false,
          "reffered": "",
          "workflow": "528ce74ef3f67bc40b00001e",
          "social": {
            "LI": "",
            "FB": ""
          },
          "skype": "",
          "source": "Outbound",
          "fax": "",
          "notes": [

          ],
          "groups": {
            "owner": null,
            "users": [

            ],
            "group": [

            ]
          },
          "whoCanRW": "everyOne"
        }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
              "success": "A new Opportunities create success",
              "id": "5784ed34b75246bf3ee4f2b9"
            }
     *
     **/
    router.post('/', handler.create);

    /**
     *@api {patch} /opportunities/ Request for updating Lead
     *
     * @apiVersion 0.0.1
     * @apiName updateLead
     * @apiGroup Leads
     *
     * @apiParamExample {json} Request-Example:
     * {
          "company": "Prevail Health",
          "fax": "",
          "internalNotes": "",
          "groups": {
            "owner": "560c099da5d4a2e20ba5068b",
            "users": [

            ],
            "group": [

            ]
          }
        }
     *
     * @apiSuccess {Object} UpdatedLead
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
          "success": "Opportunities updated success",
          "result": {
            "_id": "573f2367abbc5755574c980b",
            "__v": 0,
            "skype": "",
            "social": {
              "LI": "",
              "FB": ""
            },
            "projectType": "fixed",
            "attachments": [
              {
                "_id": "5784e65fb75246bf3ee4f2b8",
                "name": "gory-ozero-priroda-pristan.jpg",
                "shortPas": "uploads%2Fleads%2F573f2367abbc5755574c980b%2Fgory-ozero-priroda-pristan.jpg",
                "size": "0.312&nbsp;Mb",
                "uploadDate": "2016-07-12T12:45:19.082Z",
                "uploaderName": "admin"
              }
            ],
            "notes": [

            ],
            "convertedDate": "2016-05-20T14:47:03.943Z",
            "isConverted": false,
            "source": "",
            "campaign": "",
            "editedBy": {
              "date": "2016-06-10T13:01:05.979Z",
              "user": "573d7f7907676c6435eeff3e"
            },
            "createdBy": {
              "date": "2016-05-20T14:47:03.943Z",
              "user": "573d7f7907676c6435eeff3e"
            },
            "sequence": 0,
            "groups": {
              "group": [

              ],
              "users": [

              ],
              "owner": "560c099da5d4a2e20ba5068b"
            },
            "whoCanRW": "everyOne",
            "workflow": "528ce79bf3f67bc40b000020",
            "reffered": "",
            "optout": false,
            "active": true,
            "color": "#4d5a75",
            "categories": {
              "name": "",
              "id": ""
            },
            "priority": "Trivial",
            "expectedClosing": null,
            "nextAction": {
              "date": "2016-05-20T14:47:03.943Z",
              "desc": ""
            },
            "internalNotes": "",
            "salesTeam": null,
            "salesPerson": "55b92ad221e4b7c40f0000a0",
            "func": "",
            "phones": {
              "fax": "",
              "phone": "",
              "mobile": ""
            },
            "email": "Irving@prevailhs.com",
            "contactName": {
              "last": "Steel",
              "first": "Irving"
            },
            "address": {
              "country": "USA",
              "zip": "",
              "state": "",
              "city": "Chicago",
              "street": ""
            },
            "customer": null,
            "company": null,
            "tempCompanyField": "Prevail Health",
            "creationDate": "2016-05-20T14:47:03.942Z",
            "expectedRevenue": {
              "currency": "",
              "progress": 0,
              "value": 0
            },
            "name": "Ruby on Rails",
            "isOpportunitie": false
          }
        }
     **/
    router.patch('/:id', handler.updateLead);
    router.put('/:id', handler.updateLead);

    router.delete('/:id', handler.remove);

    /**
     *@api {delete} /opportunities/ Request for deleting Leads
     *
     * @apiVersion 0.0.1
     * @apiName deleteLeads
     * @apiGroup Leads
     *
     * @apiParamExample {json} Request-Example:
     * {
          "contentType": "Leads",
          "ids": [
            "57427b89bd80afa95681fd67",
            "5744497bf135d4a167d9bc0e"
          ]
        }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
              "success": true
           }
     **/
    router.delete('/', handler.bulkRemove);

    return router;
};
