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
    var moduleId = MODULES.OPPORTUNITIES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    /**
     *@api {get} /opportunities/ Request Opportunities
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunities
     * @apiGroup Opportunity
     *
     * @apiParam {String} workflowId
     * @apiParam {String} viewType="kanban"
     *
     *
     * @apiSuccess {Object} Opportunities
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "data": [

      ],
      "workflowId": "528cdcb4f3f67bc40b000006",
      "fold": false
}
     */
    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getByViewType);

    /**
     *@api {get} /opportunities/getFilterValues Request FilterValues
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Opportunity
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
     {
         "_id": null,
         "Name": [
             ".net devs",
             "APP Project",
             "AR/VR Store",
             ...
         ],
         "Creation date": [
             "2016-07-12T13:14:28.804Z",
             "2016-07-12T09:42:36.899Z",
             ...
         ],
         "Expected revenue": [
             0,
             200,
             300,
             640,
             1000,
             ...
         ]
     }
]
     */
    router.get('/getForDd', authStackMiddleware, handler.getForDd);

    router.get('/getFilterValues', authStackMiddleware, accessStackMiddleware, handler.getFilterValues);

    /**
     *@api {get} /opportunities/OpportunitiesForMiniView Request Opportunities For MiniView
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesForMiniView
     * @apiGroup Opportunity
     *
     * @apiParam (?Field=value) {String} person Unique id of Person
     * @apiParam (?Field=value) {String} company Unique id of Company
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=4 Count of Opportunities which will show
     * @apiParam (?Field=value) {Boolean} onlyCount=true
     *
     * @apiSuccess {Object} OpportunitiesForMiniView
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "listLength": 0
}
     */
    router.get('/OpportunitiesForMiniView', authStackMiddleware, accessStackMiddleware, handler.opportunitiesForMiniView);

    /**
     *@api {get} /opportunities/OpportunitiesForChart Request OpportunitiesForChart
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesForChart
     * @apiGroup Opportunity
     *
     * @apiParam (?Field=value) {String="Date"} type
     * @apiParam (?Field=value) {Number} dataRange
     * @apiParam (?Field=value) {String="D"} dataItem
     *
     * @apiSuccess {Object} OpportunitiesForChart
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
        {
            "_id": {
                "year": "2016",
                "mounth": "06",
                "day": "15"
            },
            "wonCount": 0,
            "lostCount": 0,
            "inProgressCount": 0
        },
        {
            "_id": {
                "year": "2016",
                "mounth": "06",
                "day": "21"
            },
            "wonCount": 0,
            "lostCount": 0,
            "inProgressCount": 0
        },
        {
            "_id": {
                "year": "2016",
                "mounth": "07",
                "day": "06"
            },
            "wonCount": 0,
            "lostCount": 0,
            "inProgressCount": 0
        }
    ]
}
     */
    router.get('/OpportunitiesForChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesForChart);

    /**
     *@api {get} /opportunities/OpportunitiesConversionForChart Request OpportunitiesConversionForChart
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesConversionForChart
     * @apiGroup Opportunity
     *
     * @apiParam (?Field=value) {Number} dataRange
     *
     * @apiSuccess {Object} OpportunitiesConversionForChart
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "data": [
        {
          "_id": "Vasiliy Almashiy",
          "wonSum": 0,
          "wonCount": 0,
          "lostSum": 49000,
          "lostCount": 1,
          "sale": "Vasiliy Almashiy"
        },
        ...
      ]
}
     */
    router.get('/OpportunitiesConversionForChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesConversionForChart);

    /**
     *@api {get} /opportunities/OpportunitiesAgingChart Request OpportunitiesAgingChart
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesAgingChart
     * @apiGroup Opportunity
     *
     * @apiSuccess {Object} OpportunitiesAgingChart
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
        {
            "0-7_Sum": 17000,
            "8-15_Sum": 0,
            "16-30_Sum": 0,
            "31-60_Sum": 0,
            "61-120_Sum": 0,
            ">120_Sum": 0,
            "0-7_Count": 1,
            "8-15_Count": 0,
            "16-30_Count": 0,
            "31-60_Count": 0,
            "61-120_Count": 0,
            ">120_Count": 0,
            "workflow": "Finalization"
        },
        {
            "0-7_Sum": 0,
            "8-15_Sum": 0,
            "16-30_Sum": 0,
            "31-60_Sum": 0,
            "61-120_Sum": 0,
            ">120_Sum": 0,
            "0-7_Count": 1,
            "8-15_Count": 0,
            "16-30_Count": 0,
            "31-60_Count": 0,
            "61-120_Count": 0,
            ">120_Count": 0,
            "workflow": "Waiting fo response"
        },
        ...
    ]
}
     */
    router.get('/OpportunitiesAgingChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesAgingChart);

    /**
     *@api {get} /opportunities/getLengthByWorkflows/ Request LengthByWorkflows
     *
     * @apiVersion 0.0.1
     * @apiName getLengthByWorkflows
     * @apiGroup Opportunity
     *
     * @apiSuccess {Object} LengthByWorkflows
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "showMore": true,
    "arrayOfObjects": [
        {
            "_id": "528cdd2af3f67bc40b000007",
            "count": 1
        },
        {
            "_id": "5773e332ba4ab32d0f4dc85e",
            "count": 1
        },
        {
            "_id": "56dd819ccc599b971852913b",
            "count": 16
        },
        {
            "_id": "528cdf1cf3f67bc40b00000b",
            "count": 29
        },
        {
            "_id": "528cdef4f3f67bc40b00000a",
            "count": 24
        }
    ]
}
     */
    router.get('/getLengthByWorkflows', authStackMiddleware, accessStackMiddleware, handler.getLengthByWorkflows);

    /**
     *@api {get} /opportunities/priority/ Request Priorities
     *
     * @apiVersion 0.0.1
     * @apiName getPriorities
     * @apiGroup Opportunity
     *
     *
     * @apiSuccess {Object} Priorities
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
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
     */
    router.get('/priority', authStackMiddleware, accessStackMiddleware, handler.getLeadsPriority);
    router.get('/getFilteredOpportunities', authStackMiddleware, accessStackMiddleware, handler.getFilteredOpportunities);
    router.get('/:id',authStackMiddleware, accessStackMiddleware, handler.getById);
    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.post('/createLeadFromSite', handler.addNewLeadFromSite);

    /**
     *@api {post} /opportunities/uploadFiles/ Request for updating Opportunity and upload Files
     *
     * @apiVersion 0.0.1
     * @apiName uploadFiles
     * @apiGroup Opportunity
     *
     * @apiHeader (HeaderName=HeaderValue) {String} Content-Type="multipart/form-data"
     * @apiHeader (HeaderName=HeaderValue) {String} modelid
     * @apiHeader (HeaderName=HeaderValue) {String} modelname="Opportunities"
     *
     * @apiSuccess {Object} UpdatedOpportunity
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": "Opportunity updated success",
      "data": {
        "_id": "57693909e6b2b396201e2411",
        "__v": 0,
        "skype": "",
        "social": {
          "LI": "",
          "FB": ""
        },
        "projectType": "fixed",
        "attachments": [
          {
            "_id": "57850694b7c30f675048cdad",
            "name": "united-kingdom-england-london-6527.jpg",
            "shortPas": "uploads%2Fopportunities%2F57693909e6b2b396201e2411%2Funited-kingdom-england-london-6527.jpg",
            "size": "0.309&nbsp;Mb",
            "uploadDate": "2016-07-12T15:02:44.827Z",
            "uploaderName": "admin"
          }
        ],
        "notes": [

        ],
        "convertedDate": "2016-06-21T12:54:33.527Z",
        "isConverted": false,
        "source": "",
        "campaign": "",
        "editedBy": {
          "date": "2016-07-12T14:55:12.973Z",
          "user": "52203e707d4dba8813000003"
        },
        "createdBy": {
          "date": "2016-06-21T12:54:33.527Z",
          "user": "563f673270bbc2b740ce89ae"
        },
        "sequence": 10,
        "groups": {
          "group": [

          ],
          "users": [

          ],
          "owner": "560c099da5d4a2e20ba5068b"
        },
        "whoCanRW": "everyOne",
        "workflow": "528cdcb4f3f67bc40b000006",
        "reffered": "",
        "optout": false,
        "active": false,
        "color": "#4d5a75",
        "categories": {
          "name": "",
          "id": ""
        },
        "priority": "Select",
        "expectedClosing": "",
        "nextAction": {
          "date": "2016-07-03T22:00:00.000Z",
          "desc": ""
        },
        "internalNotes": "",
        "salesTeam": null,
        "salesPerson": "55b92ad221e4b7c40f000040",
        "func": "",
        "phones": {
          "fax": "",
          "phone": "",
          "mobile": ""
        },
        "email": "",
        "contactName": {
          "last": "",
          "first": ""
        },
        "address": {
          "country": "USA",
          "zip": "",
          "state": "",
          "city": "",
          "street": ""
        },
        "customer": "574818d53ee88113675f3520",
        "company": null,
        "tempCompanyField": "",
        "creationDate": "2016-06-21T12:54:33.526Z",
        "expectedRevenue": {
          "currency": "$",
          "progress": 0,
          "value": 0
        },
        "name": "iOS + Android",
        "isOpportunitie": true
      }
}
     */
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    /**
     *@api {patch} /opportunities/:id Request for updating Opportunity
     *
     * @apiVersion 0.0.1
     * @apiName updateOpportunity
     * @apiGroup Opportunity
     *
     * @apiParam {String} id Unique id of Opportunity
     * @apiParamExample {json} Request-Example:
{
      "customer": "574818d53ee88113675f3520",
      "address": {
        "street": "",
        "city": "",
        "state": "",
        "zip": "",
        "country": "USA"
      },
      "active": false,
      "groups": {
        "owner": "560c099da5d4a2e20ba5068b",
        "users": [

        ],
        "group": [

        ]
      }
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": "Opportunities updated",
      "notes": [

      ],
      "sequence": 10
}
     *
     */
    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.updateOnlySelectedFields);
    router.put('/:id', authStackMiddleware, accessStackMiddleware, handler.update);

    /**
     *@api {delete} /opportunities/:id Request for deleting Opportunity
     *
     * @apiVersion 0.0.1
     * @apiName deleteOpportunity
     * @apiGroup Opportunity
     *
     * @apiParam {String} id Unique id of Opportunity
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"Opportunities removed"
}
     */
    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    /**
     *@api {delete} /opportunities/ Request for deleting selected Opportunities
     *
     * @apiVersion 0.0.1
     * @apiName deleteSelectedOpportunities
     * @apiGroup Opportunity
     *
     * @apiParamExample {json} Request-Example:
{
      "contentType": "Opportunities",
      "ids": [
            "57153854eb8118dc63f02b7f",
            "574300a57c51918533cb200b"
      ]
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":true
}
     */
    router.delete('/', authStackMiddleware, accessStackMiddleware, handler.bulkRemove);

    return router;
};
