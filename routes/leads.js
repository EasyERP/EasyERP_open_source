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
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'opportunities', event);
    }

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
HTTP/1.1 200 OK
     {
       "total": 996,
       "data": [
         {
           "_id": "583ff7a0d3ce17370e90be0e",
           "total": 996,
           "salesPerson": {
             "name": null
           },
           "workflow": {
             "_id": "528ce74ef3f67bc40b00001e",
             "name": "New",
             "status": "New"
           },
           "editedBy": {
             "date": "2016-12-01T10:12:48.581Z"
           },
           "expectedClosing": null,
           "name": "Krishna Sheombar Sing",
           "priority": "Cold",
           "tags": [

           ],
           "source": "ThinkMobiles"
         },
         ...
       ]
     }
     **/

    /**
     *@api {get} /leads/ Request Leads in date range
     *
     * @apiVersion 0.0.1
     * @apiName getLeadsInDateRange
     * @apiGroup Leads
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: ["Sun Jan 01 2017 00:00:00 GMT+0200 (EET)","Tue Jan 31 2017 00:00:00 GMT+0200 (EET)"]}}" Filter object of period of time
     *
     * @apiSuccess {Object} leadsInDateRange
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       "createdBy": [
         {
           "_id": 20170117,
           "count": 1,
           "source": 17,
           "isOpp": false
         },
         {
           "_id": 20170116,
           "count": 1,
           "source": 16,
           "isOpp": false
         },
         {
           "_id": 20170112,
           "count": 1,
           "source": 12,
           "isOpp": false
         }
       ],
       "leadsBySales": [
         {
           "count": 1,
           "salesPerson": "Liliya Mykhailova"
         },
         {
           "count": 2,
           "salesPerson": "Alex Michenko"
         }
       ],
       "assignedTo": [
         {
           "_id": 20170117,
           "count": 1,
           "isOpp": false,
           "sourse": 17
         },
         {
           "_id": 20170116,
           "count": 1,
           "isOpp": false,
           "sourse": 16
         },
         {
           "_id": 20170112,
           "count": 1,
           "isOpp": false,
           "sourse": 12
         }
       ],
       "qualifiedBy": [
         {
           "count": 2,
           "salesPerson": "testAdmin"
         },
         {
           "count": 2,
           "salesPerson": "liliya.mykhailova"
         }
       ],
       "qualifiedFrom": [
         {
           "count": 1,
           "salesPerson": "testAdmin"
         },
         {
           "count": 3,
           "salesPerson": "Empty"
         }
       ]
     }
     **/
    router.get('/', handler.getByViewType);

    /**
     *@api {get} /leads/getLeadsForChart Request LeadsForChart
     *
     * @apiVersion 0.0.1
     * @apiName getLeadsForChart
     * @apiGroup Leads
     *
     * @apiParam (?Field=value) {String="source","sale"} type
     * @apiParam (?Field=value) {Object} filter="{date: {value: ["Sun Jan 01 2017 00:00:00 GMT+0200 (EET)","Tue Jan 31 2017 00:00:00 GMT+0200 (EET)"]}}" Filter object of period of time
     *
     * @apiSuccess {Object} LeadsForChart with type "source"
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
     {
       data: [
         {
           count: 1,
           source: "Outbound LinkedIn",
           isOpp: false
         },
         {
           count: 1,
           source: "Offline Meetings",
           isOpp: false
         },
         {
           count: 1,
           source: "Nets",
           isOpp: false
         },
         {
           count: 1,
           source: "Outbound Cold Call",
           isOpp: false
         }
       ]
     }
     **/
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
HTTP/1.1 200 OK
     {
       data: [
         {
           _id: "Hot",
           priority: "Hot",
           type: "Leads"
         },
         {
           _id: "Cold",
           priority: "Cold",
           type: "Leads"
         },
         {
           _id: "Medium",
           priority: "Medium",
           type: "Leads"
         }
       ]
     }
     **/
    router.get('/priority', handler.getLeadsPriority);

    /**
     *@api {get} /leads/:id Request Lead
     *
     * @apiVersion 0.0.1
     * @apiName getLead
     * @apiGroup Leads
     *
     * @apiParam (?Field=value) {String} id Unique id of Leads
     *
     * @apiSuccess {Object} Lead
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
  "_id": "587dd7a923ddd08c2030f0e8",
  "dateBirth": "1999-01-17T00:00:00.000Z",
  "skype": "skype_aaron",
  "social": {
    "LI": "https://my[].com",
    "FB": ""
  },
  "attachments": [
    {
      "_id": "587dd80fc6a640eb205e8ca2",
      "name": "2017-calendar-template-05.jpg",
      "shortPas": "uploads%2Fopportunities%2F587dd7a923ddd08c2030f0e8%2F2017-calendar-template-05.jpg",
      "size": "0.534&nbsp;Mb",
      "uploadDate": "2017-01-17T08:38:39.219Z",
      "uploaderName": "testAdmin"
    },
    {
      "_id": "587dd82bab1707af208fdb9a",
      "name": "2017-calendar-template-05(1).jpg",
      "shortPas": "uploads%2Fopportunities%2F587dd7a923ddd08c2030f0e8%2F2017-calendar-template-05(1).jpg",
      "size": "0.534&nbsp;Mb",
      "uploadDate": "2017-01-17T08:39:07.026Z",
      "uploaderName": "testAdmin"
    }
  ],
  "notes": [
    {
      "date": "2017-01-17T08:36:57.095Z",
      "history": {
        "editedBy": {
          "_id": "585cdc6ed210f7ec05c45f1f",
          "login": "testAdmin"
        },
        "newValue": "Sent",
        "changedField": "workflow",
        "collectionName": "Opportunities",
        "contentId": "587dd7a923ddd08c2030f0e8",
        "date": "2017-01-17T08:36:57.095Z"
      },
      "user": {
        "_id": "585cdc6ed210f7ec05c45f1f",
        "login": "testAdmin"
      },
      "_id": ""
    },
    {
      "date": "2017-01-17T08:36:57.095Z",
      "history": {
        "editedBy": {
          "_id": "585cdc6ed210f7ec05c45f1f",
          "login": "testAdmin"
        },
        "prevValue": null,
        "newValue": "Alex Michenko",
        "changedField": "salesPerson",
        "collectionName": "Opportunities",
        "contentId": "587dd7a923ddd08c2030f0e8",
        "date": "2017-01-17T08:36:57.095Z"
      },
      "user": {
        "_id": "585cdc6ed210f7ec05c45f1f",
        "login": "testAdmin"
      },
      "_id": ""
    },
    {
      "date": "2017-01-17T08:36:57.095Z",
      "history": {
        "editedBy": {
          "_id": "585cdc6ed210f7ec05c45f1f",
          "login": "testAdmin"
        },
        "prevValue": null,
        "newValue": "2017-01-17T08:36:57.086Z",
        "changedField": "Creation Date",
        "collectionName": "Opportunities",
        "contentId": "587dd7a923ddd08c2030f0e8",
        "date": "2017-01-17T08:36:57.095Z"
      },
      "user": {
        "_id": "585cdc6ed210f7ec05c45f1f",
        "login": "testAdmin"
      },
      "_id": ""
    },
    {
      "date": "2017-01-17T08:36:57.095Z",
      "history": {
        "editedBy": {
          "_id": "585cdc6ed210f7ec05c45f1f",
          "login": "testAdmin"
        },
        "prevValue": null,
        "newValue": "2017-01-31T00:00:00.000Z",
        "changedField": "Close Date",
        "collectionName": "Opportunities",
        "contentId": "587dd7a923ddd08c2030f0e8",
        "date": "2017-01-17T08:36:57.095Z"
      },
      "user": {
        "_id": "585cdc6ed210f7ec05c45f1f",
        "login": "testAdmin"
      },
      "_id": ""
    },
    {
      "_id": "587dd7d4d3438c9220bcfea1",
      "note": "This is lead note.",
      "user": {
        "login": "testAdmin",
        "_id": "585cdc6ed210f7ec05c45f1f"
      },
      "date": "2017-01-17T08:37:40.569Z",
      "task": null
    },
    {
      "date": "2017-01-17T08:38:03.817Z",
      "task": {
        "_id": "587dd7ebab1707af208fdb93",
        "description": "This is the task for lead.",
        "dealDate": "2017-01-17T08:38:03.817Z",
        "attachments": [

        ],
        "notes": [

        ],
        "type": "",
        "workflow": {
          "_id": "5783b351df8b918c31af24a8",
          "name": "Not Started",
          "status": "New",
          "wId": "DealTasks",
          "wName": "Deal Tasks",
          "sequence": 3,
          "visible": true
        },
        "dueDate": "2017-01-27T08:29:00.000Z",
        "contact": null,
        "company": null,
        "sequence": 64,
        "category": {
          "_id": "587762390e749d2d08633c3d",
          "name": "Find",
          "color": "bgGreenDark",
          "type": "Category",
          "__v": 0
        },
        "assignedTo": {
          "_id": "55b92ad221e4b7c40f00009e",
          "name": {
            "last": "Michenko",
            "first": "Alex"
          },
          "imageSrc": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDVoopawNhKKWigYlFLRQAlLRRQAlFLRQISkpTTd49aQC0lNMif3h+dOBB6UAFJS0UDEpDTqaaBDTSGlNIaAEpKU0lACUlLSUALRRRQBbopaKYBRRRQMKKKWgBKKKKACmOyopZiFA6k052CKWY4AGSa5zUNRF4TGo2xA9T1NAFy71dV3Rw4LdNx6fh61kzXEshJad/oOBUDyeSeEBHrnNMkklADrhlPoKpIlkvmhRy7Z9zT4r6WJgYpSPrVFpA/U4NN3YPrSaC501jrIlcR3ACk8Bh0rWrhlbnHfsa6TRL9rlDDMcyIMg+oqRmrSGlpDQMaaaacaaaBCU2lpKACkopaYBRRRQBcpaKKACiiigYUUtFACUUtNchVJPQCgDD128bPkISAPvYPWseCN3YBRkZqzOrzynAyS351o2Vq0QXchBqkgRmSacWOFXBPOKctlLCuCMiugaAZBxzTfJBGCM1fKPlOVuLcqxJFVmworprq1DZwMVhXtq0TbiOD3qHoJxKW7mtDS7lYbyOVjgA4bHoeM1nkVJCSre1Ik72mmqulXH2ixRj95flP4VaNIY0000pppoAQ0lKabQAUUUUCHUUUUDLlLRRQAUUUUAFFFLQAlV77P2OXHXbVioroZtZf900DMbTogzgkcitlVGKy9P8A9ZtHYZrUBreIIGOB0qIsAamLIRgkfnUcgBptFIhfDVVuII3Qhl4qzwD1qC4mQdWA+tZsoyXsIQelVZrILkoeK0nmiPR1/OoZDlDj0qBNIv8Ah9v9FkT0fP6VpmsnQOkx9cf1rWNIzGmmmlNIaYCU00tFAhKKKBSAdRSUUAXqKKKBi0UUUAFFFFMAqtfSeXCBjO9gv0qzUF3F5sQGcYYH9aEVG19TN0+No7h1cYO0VYuS6ocEge3enJl7ov2K4H4H/wCvVkxq4+YZrdLoDVjnLvcjLuLndgjn6/j2qzZq+8JlgfY5rRuLVSAOCR0yOn0plvaGNi+eaHHUEJdRmO3L5yawmzcFi3JAJx3robpSYGB9KwkUhiBxzWctGXbQqIoIZlQAKcdasqPkJHQipvKHfFKyhVxUsVibQCf3o/hUD8zWwaoaNEI7Vnxy7fy/yavGkQxppDSmm0CEpKWkoAKBRRSELRRRTAv0UUUDCiiigAooooAKCMjFFFAFbyQhyCc55Hr71KrYNPKg9QDTAtaxdyr3HONwBqLdgVKfu4qFgNuKsaGPl424rBkBWXGO9a8peNCoYkse5rJO7zWaTr/Ks5lom/hpm1pGCqMk8Cnbvlqzpq/vHb0GKzFJl6GMQwrGvRRinGikNBkIaaaU000ABpDRSUAFLSUUCFopKKANGiiimMKWkooAWikooAWkoooAKYxw3tT6jJBfGckdRVQ3AViKrMkwBKyjk9CtTkbfdf5UHYR1rYaZkXH2gPzIp9OKpGKUuS8nB9BWxMqFuaozMATjFZSNU9CJ8ZAArTtIjDD833m5NZkB3XUf+8K2M1BnJi0hNGaaTQSBpKCaSgBDRRSUhBRSUUAOzRSUUAaVFFFMAooooGFFFFABRQTioJLqON1U7ju6HHFNJvYVySRmVGKgEgZ5OKzdEuGukuJmGCZcY/AVZYx3ke1bgKXUtg8fKOn5ms/wvIptpo/4g+7HsQP8K3UOUSepuAZqOS3RvUH2qQHFI571QzKvLYxDd5hNZhyz8kmtXUnLIFH41mquDWMtzRDfNFsRL/d5rYilWaJZEOVYZFc9qDf6O49RVrRbh0tcy/6rdtDemMf4iptciT1Nk0hoBBGQcg0lSIKSikoAKSlpKAEpc0lJSAdmim5opgalFFFABS1DPMYlyqFznHHQVVcmeciOfYyY3LLwPyq4029RcyvYuGaMZG9SfQEZqA3ineP9UQPvSD/OaqSASB5kkhV41LA7uScVBbRyXNs91cTwvJu2qWwcfQdBWqppC5hf7RNyJLYAGReRI/yqKlsiY7d3vj50jApFjoPcVDqjGHTVzdI3zfdUD0NZ+GEEN0ly8gJyYg2Cp9OD0rRWRGr0Ny506J45YoXIdikS88fd561zthctp+oAk8Z2tXQ2eoWkqo0u6GQbpHDfTA/nXLXp/wBJkOQ3zk5HQ8056oS0Z20cqyoHU8GlZvlNYukXDeWFY9K1S4wayUrm1ipcnIPc1Qb5EJPetIx+YcCqV8m1goqJFox78kx4p9nIosZIt+HEgZV/vcc/yFLergVBYIsk7KwzxkH0pxWjM5fEaMNzcG7kK7jCnYdR9R3q/BeJMpbBVf73ashpzLd7YsFnUYJ9R2P60s5lWSNYgYxKMkL8wY/SpsmGyN0MGGQQR6iistLho9kKIYX6EkfKTVn7YokWM/MT/EvIqeUZapKQMG6Hp1pakBDSUppKYBRSUUhGrSPnYxBCkDqe1FQ3SuwjaMbmRwxX1HT+tVBXlYJOyGwxsI4XklaGNzv5PJzVGxe2GoXirE8pLfL78mrjiFoUuZnyqyHEY7c9KqpdPHrp+yQgLOnyj/P0NdljG63epCJIlS5V7Zg3lnB59DUdo9t/ZbYhkL7s/r9asu17EbkMitujPp6GmWT3v9nOBEu0tyfx+tJJjbj2MS/+0yv5kkRWMcLjkCm2V41osijIEgxuXqv0ra1Fb7+z4wwVU3D09DSyaYJLa3e6kjBKDkAcjinyk83YrWdxpMVg0cqyyTSEbio5Az0Hasq+Mbyu0CsseflDdRWiLayjvTGxd025AU85zVTUEj8z9whRMdDzg0aWsPXck0i4/gY8rW35mRXKwuYZQwGR0I9a27a4V0DKcg1zSVmdEJXVjat2AHNQXMPmksKbDJ8uQaeJFUHc6ovdmOAKFroXtqY2pxGO33Y4LYqhY3Ys52coGDIVwRUuoXf2nagcsFJPtzjp+VUlheY7V4OM1tblic0pc0iy8sRkW4Z45BtxsztYYHeobSSZrmFVkxtPy7jwKhihdo2ZlJwcZFP8tRJGoLKzddw6VkNs6BTdC4G5UkzVe13C9uVNuSST9089falhhtxIuJyrY5PoaLOKQ6tP5dyOjc596CtOjHpLHArTNvD9w3ersUgljVwCM9jWddySRW0qyhZEJAz6GpbYvG0I37oigFS0GpeoopKgYUUUUAadQXMc+wywSAY42/rU1Ur1d4R4ZsMWKlfoa0prUUnZDhcW0k3kzR7X8rJUd36/yqlfz3DrBcRKI0ibAP1//Uatxqn9qyLP8sscQw2ODjbUeoRT3aTp/qotpYfhzXU0zFOK2EmtZjJOPtf8Bzk+xqLTopTp0u68CgPjGevSmWiWklsjPK+8pg9+RkelGmLY/ZJt0jE7uOD6D2pWRfNLsSalDGdPj33u/wCYfLu9j708JYx2ts295ML938BUeoNYrp64jcvuHP8Ak1MLiAWduI7TJ29x7CnoHvleSaCPVbdre2J+Q8HuSD9fWpzLdSz7TaKQequmQeKbf3Fy2oWZjt/L7AEf59asSJqJnXJVW4x0oukTyN7syo7WSS5urc2keeShC9Bn2PvWc0dxZOxCMNv3gehHrXQRx3keuvtdfnGCOPQGmXVhezpLGNrEA+maUkmhxTXUp2V6jpuLYHfPas2/uzdS8cRr90f1qqD5QbJIzwVq1FFGCpdXYnsOBWSio7luUpqyK0RUuiMSCx9K04LezkZv3hXA4JprGJNTh/cDGAduPY1bgezkeXdCy+mBQ5X0EoyRSsLaQ20rRSKRnofwp8gkjurUzQh1ycY70unQW0lvL+9IYevTtTpkdJbQxTCT5sAHsamw790WDNam4w9uV9gMVDb/AGR9WmyWRcN/Orge7+0fNErH0H0+tVrSRBqFy01tj7w6e9UkxNxKkmTdJEhLwHBYfnViVhErtE37mTj3GKZDJ5DyzGPMcvyqPT1p4kt3intY/vHjce3rUbj2NFGygOc8dRS1W051ezj2n7vBqzWbKCikopAalZ2oR27tHGGMblm3Z6A5q+/3G7cGs65MR8mO5DLKqgM3qa2pLRsmTfQkiLrqNwkxWWHysb/T7vP60XFrMkKebMPJQevVc1X02HzLy7MEm+EqQQe4yP6Cm6pG63EEcEhlg2lioPIHf+VdHQzT1v1F082kZaPYzgMdh9u1GkXFuLacC23HI6gelS6VcMm5IbYuisQHweenX3pdKnuhZz7Lcctjke1CsO0x1/dH+zkEdnj5h8wH/wBapDc3bWcGIMfLjJU+gpupy3x02MGJVXcP5H3p7C/aztwWVRs9vQUXFyvqytqf29r2y34Viwx04ORVmW1vTcRhrjB46MfWq+p294byzWSfkkAEE8cip57B/tEe66OeP5/Wi4cq7ld7W6XXkAnOTjncf7tWWguonlZrn7gLE7z0qrLZZ1yIC4PbnH+z9alvbNooLv8A0gnETN068dOtF2LlXc525s5cR3jxvl3G7IOCTzWybmZ5UUWxHTsao32oXQMFm8QVVZXwR97sK1JZLwyJthUZx2/+vWWhSTKXnzHWwTCeAMAg/wB2rKXOJZfNtgST3/8A1VXR7v8AtnJjXcRxn/dq9FNdrLIfIByecCnoPlZmaXJamGYNGQcZ4ov1tBaxzROySI+QOadpU+1blZrfPy9T+NR6hcQNZKoh2tu9OnWk7B75ZthcfalMVwGz0yc9qrvPdQ39yxAYEkcfWpnNpJIgiYxSDoScCs6Yyx3Ev77hn2nJ9ScVPQbbvqi7Z+Zv/eKDCTxkcAmq8i2yal5akhDjLetSbF+zJumygYgAd6SVrU3SNsIVQOO55pDJtNdB58cfRZCR9KvZqhAxOoTeWm2Lg/pV3NZy3GvMWikzRSGXrhDMFgRsO54+g5NMu5VdnF7DyF+8PaiiuqklyGM21Iz9IgjaxeSKYpKWHHqB/wDrp8kDPrCKsgSURfOCeCf/AK4NFFWtgbvuLpcd8iSBXUYnZTnHHT296tWcV6pvUSVcK/T/ACKKKpbGb3E1WC9/s6Mmcbdw7+x9qe1nc/ZLfdcH7nqT2FFFAIp6naAahaI9yDkjJPb9aszWlqtxHm5Ujj+IetFFS2WlcqS29v8A25GvngKMc5H92pL+1h8q5ZZw2I2I5HJ2miii4OJQ1W4k8q2geRDLuBAwMgfWtG4F6PKBcZ7dKKKm+4imyXQ1qMbxuAGTx/dq9GL7zZArAnv0oooQGXZ3k9mZ1dFJbjPHXkevvTr65M2l7nhzyCrYooqW9S7aJitcQvOplgCgLk4rJdUnV5Q+0sSTnt/nNFFQ9irsuWbWyWakqzuWPJqVbmCSPzhFl92Mdh6fyoopLUclZaEm+ZtREjDYjx5IPtVzNFFRMIhmiiioKP/Z",
          "fullName": "Alex Michenko",
          "id": "55b92ad221e4b7c40f00009e"
        },
        "deal": {
          "_id": "587dd7a923ddd08c2030f0e8",
          "name": "Android application for Enterprise"
        },
        "taskCount": 1,
        "__v": 0,
        "editedBy": {
          "date": "2017-01-17T08:38:03.853Z",
          "user": {
            "_id": "585cdc6ed210f7ec05c45f1f",
            "login": "testAdmin"
          }
        }
      },
      "_id": "587dd7ebab1707af208fdb93",
      "user": {
        "_id": "585cdc6ed210f7ec05c45f1f",
        "login": "testAdmin"
      }
    },
    {
      "attachment": {
        "shortPas": "uploads%2Fopportunities%2F587dd7a923ddd08c2030f0e8%2F2017-calendar-template-05.jpg",
        "name": "2017-calendar-template-05.jpg"
      },
      "_id": "587dd80fc6a640eb205e8ca3",
      "user": {
        "login": "testAdmin",
        "_id": "585cdc6ed210f7ec05c45f1f"
      },
      "date": "2017-01-17T08:38:39.219Z",
      "task": null
    },
    {
      "attachment": {
        "shortPas": "uploads%2Fopportunities%2F587dd7a923ddd08c2030f0e8%2F2017-calendar-template-05(1).jpg",
        "name": "2017-calendar-template-05(1).jpg"
      },
      "_id": "587dd82bab1707af208fdb9b",
      "user": {
        "login": "testAdmin",
        "_id": "585cdc6ed210f7ec05c45f1f"
      },
      "date": "2017-01-17T08:39:07.027Z",
      "task": null
    },
    {
      "_id": "587dd7a923ddd08c2030f0ea",
      "note": "This is internal note.",
      "title": "",
      "user": {
        "login": "testAdmin",
        "_id": "585cdc6ed210f7ec05c45f1f"
      },
      "date": "2017-01-17T10:36:57.000Z",
      "task": null
    }
  ],
  "source": "Outbound LinkedIn",
  "campaign": "",
  "editedBy": {
    "date": "2017-01-17T08:39:41.096Z",
    "user": {
      "_id": "585cdc6ed210f7ec05c45f1f",
      "login": "testAdmin"
    }
  },
  "createdBy": {
    "date": "2017-01-17T08:36:57.086Z",
    "user": {
      "_id": "585cdc6ed210f7ec05c45f1f",
      "login": "testAdmin"
    }
  },
  "groups": {
    "group": [

    ],
    "users": [

    ],
    "owner": null
  },
  "whoCanRW": "everyOne",
  "workflow": {
    "_id": "528ce779f3f67bc40b00001f",
    "name": "Sent",
    "sequence": 2
  },
  "priority": "Hot",
  "expectedClosing": "2017-01-31T00:00:00.000Z",
  "nextAction": {
    "date": "2017-01-17T08:36:57.086Z",
    "desc": ""
  },
  "internalNotes": "",
  "salesPerson": {
    "_id": "55b92ad221e4b7c40f00009e",
    "name": {
      "last": "Michenko",
      "first": "Alex"
    },
    "fullName": "Alex Michenko",
    "id": "55b92ad221e4b7c40f00009e"
  },
  "phones": {
    "fax": "",
    "phone": "+380507770000",
    "mobile": ""
  },
  "email": "person@email.com",
  "contactName": {
    "last": "Hurst",
    "first": "Aaron"
  },
  "address": {
    "country": "Afghanistan",
    "zip": "75446",
    "state": "Transcarpathia",
    "city": "Birmingham",
    "street": "Notsafe str. 6"
  },
  "tags": [
    {
      "_id": "5787a2a276819b8549566451",
      "name": "Android",
      "color": "bgGreenDark"
    },
    {
      "_id": "578895500a5d4753492dddad",
      "name": "Design",
      "color": "bgGreenLight"
    },
    {
      "_id": "57c67ef44041249e796cb670",
      "name": "ERP",
      "color": "bgGreenDark"
    },
    {
      "_id": "57a9cf19b8d99bb3075b663a",
      "name": "Marketing",
      "color": "bgRed"
    },
    {
      "_id": "57d961bc3e7542733499a5d5",
      "name": "Web",
      "color": "bgBlueDark"
    },
    {
      "_id": "57aaf1e21c50a2212dc518d9",
      "name": "backend",
      "color": "bgGreenDark"
    }
  ],
  "customer": {
    "_id": "57ce6557a3c7f97535e33da5",
    "dateBirth": "",
    "__v": 0,
    "channel": null,
    "integrationId": "",
    "companyInfo": {
      "industry": null
    },
    "editedBy": {
      "date": "2016-09-06T06:42:31.976Z",
      "user": "577a78347134263421cab3ed"
    },
    "createdBy": {
      "date": "2016-09-06T06:42:31.976Z",
      "user": "577a78347134263421cab3ed"
    },
    "history": [

    ],
    "attachments": [

    ],
    "notes": [

    ],
    "groups": {
      "group": [

      ],
      "users": [

      ],
      "owner": null
    },
    "whoCanRW": "everyOne",
    "social": {
      "LI": "",
      "FB": ""
    },
    "color": "#4d5a75",
    "relatedUser": null,
    "salesPurchases": {
      "receiveMessages": 0,
      "language": "English",
      "reference": "",
      "active": false,
      "implementedBy": null,
      "salesTeam": null,
      "salesPerson": null,
      "isSupplier": false,
      "isCustomer": true
    },
    "title": "",
    "internalNotes": "",
    "contacts": [

    ],
    "phones": {
      "fax": "",
      "mobile": "",
      "phone": ""
    },
    "skype": "aaronius0000",
    "jobPosition": "CEO",
    "website": "",
    "shippingAddress": {
      "name": "",
      "country": "",
      "zip": "",
      "state": "",
      "city": "",
      "street": ""
    },
    "address": {
      "country": "Select",
      "zip": "",
      "state": "",
      "city": "",
      "street": ""
    },
    "timezone": "UTC",
    "department": null,
    "company": null,
    "email": "",
    "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
    "name": {
      "last": "Hurst",
      "first": "Aaron"
    },
    "isHidden": false,
    "isOwn": false,
    "type": "Person",
    "fullName": "Aaron Hurst",
    "id": "57ce6557a3c7f97535e33da5"
  },
  "company": {
    "_id": "5877a4243336a81d081bd4a9",
    "__v": 0,
    "channel": null,
    "integrationId": "",
    "companyInfo": {
      "industry": null
    },
    "editedBy": {
      "date": "2017-01-12T15:47:31.076Z",
      "user": "585cdc6ed210f7ec05c45f1f"
    },
    "createdBy": {
      "date": "2017-01-12T15:43:32.231Z",
      "user": "585cdc6ed210f7ec05c45f1f"
    },
    "history": [

    ],
    "attachments": [

    ],
    "notes": [

    ],
    "groups": {
      "group": [

      ],
      "users": [

      ],
      "owner": null
    },
    "whoCanRW": "everyOne",
    "social": {
      "LI": "nopromises",
      "FB": "nopromises"
    },
    "color": "#4d5a75",
    "relatedUser": null,
    "salesPurchases": {
      "receiveMessages": 0,
      "language": "English",
      "reference": "",
      "active": false,
      "implementedBy": null,
      "salesTeam": null,
      "salesPerson": "55b92ad221e4b7c40f000048",
      "isSupplier": false,
      "isCustomer": false
    },
    "title": "",
    "internalNotes": "",
    "contacts": [

    ],
    "phones": {
      "fax": "",
      "mobile": "+478520588",
      "phone": "+547852145"
    },
    "skype": "",
    "jobPosition": "",
    "website": "nopromises.com",
    "shippingAddress": {
      "name": "Eternity Insurance group",
      "country": "",
      "zip": "",
      "state": "",
      "city": "",
      "street": ""
    },
    "address": {
      "country": "Antarctica",
      "zip": "75446",
      "state": "Transcarpathia",
      "city": "Birmingham",
      "street": "Notsafe str. 6"
    },
    "timezone": "UTC",
    "department": null,
    "company": null,
    "email": "nopromises@mail.com",
    "imageSrc": "data:image/jpeg;base64,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",
    "name": {
      "last": "",
      "first": "Eternity Insurance group"
    },
    "isHidden": false,
    "isOwn": false,
    "type": "Company",
    "fullName": "Eternity Insurance group ",
    "id": "5877a4243336a81d081bd4a9"
  },
  "tempCompanyField": "Eternity Insurance group",
  "jobPosition": "CEO",
  "expectedRevenue": {
    "currency": "",
    "progress": 0,
    "value": 0
  },
  "name": "Android application for Enterprise",
  "isOpportunitie": false,
  "followers": [
    {
      "name": "Alex Filchak",
      "followerId": "564dac3e9b85f8b16b574fea",
      "_id": "587dd81923ddd08c2030f0ef"
    },
    {
      "name": "Alex Roman",
      "followerId": "55b92ad221e4b7c40f000057",
      "_id": "587dd81cfdbc94ba20861b3d"
    },
    {
      "name": "Alex Storojenko",
      "followerId": "55b92ad221e4b7c40f0000ce",
      "_id": "587dd82108dbc47c207dbb2c"
    }
  ]
}
     */
    router.get('/:id', handler.getById);

    /**
     *@api {post} /leads/uploadFiles/ Request for uploading files and updating Lead
     *
     * @apiVersion 0.0.1
     * @apiName uploadFiles
     * @apiGroup Leads
     *
     * @apiHeader (HeaderName=HeaderValue) {String} Content-Type="multipart/form-data"
     * @apiHeader (HeaderName=HeaderValue) {String} modelid
     * @apiHeader (HeaderName=HeaderValue) {String} modelname="Leads"
     *
     * @apiSuccess {Object} UpdatedOpportunity
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
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
    router.post('/uploadFiles', multipartMiddleware, handler.uploadFile);

    /**
     *@api {post} /leads/ Request for creating new Lead
     *
     * @apiVersion 0.0.1
     * @apiName createNewLead
     * @apiGroup Leads
     *
     * @apiParamExample {json} Request-Example:
{
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
HTTP/1.1 201 Created
{
    "success": "A new Opportunities create success",
    "id": "5784ed34b75246bf3ee4f2b9"
}
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
{
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
HTTP/1.1 200 OK
{
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
{
  "contentType": "Leads",
  "ids": [
        "57427b89bd80afa95681fd67",
        "5744497bf135d4a167d9bc0e"
  ]
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success": true
}
     **/
    router.delete('/', accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
