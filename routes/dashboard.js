var express = require('express');
var router = express.Router();
var WtrackHandler = require('../handlers/dashboard');
var redisStore = require('../helpers/redisClient');
var moment = require('../public/js/libs/moment/moment');
var CONSTANTS = require('../constants/mainConstants');
var MODULES = require('../constants/modules');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    'use strict';
    var moduleHRId = MODULES.DASHBOARD_HR;
    var moduleVacationId = MODULES.DASHBOARD_VACATION;
    var accessStackMiddlewareHR = require('../helpers/access')(moduleHRId, models);
    var accessStackMiddlewareVacation = require('../helpers/access')(moduleVacationId, models);
    var handler = new WtrackHandler(models);

    function cacheRetriver(req, res, next) {
        var query = req.query;
        var filter = query.filter || {};
        var key;
        var startDate;
        var endDate;
        var startByWeek;
        var endByWeek;
        var needRefresh = !!query.refresh;

        console.time('cash');

        if (filter.startDate && filter.endDate) {
            startDate = new Date(filter.startDate);
            startDate = moment(startDate);
            endDate = new Date(filter.endDate);
            endDate = moment(endDate);
        } else if (filter.date && filter.date.value) {
            startDate = new Date(filter.date.value[0]);
            startDate = moment(startDate);
            endDate = new Date(filter.date.value[1]);
            endDate = moment(endDate);
        } else {
            startDate = moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'weeks');
            endDate = moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'weeks');
        }

        startByWeek = startDate.isoWeekYear() * 100 + startDate.isoWeek();
        endByWeek = endDate.isoWeekYear() * 100 + endDate.isoWeek();

        delete filter.startDate;
        delete filter.endDate;
        delete filter.date;

        key = startByWeek + '_' + endByWeek + '_' + JSON.stringify(filter);

        redisStore.readFromStorage('dashboardVacation', key, function (err, result) {
            if (needRefresh || !result) {
                /* filter.startDate = startDate;
                 filter.endDate = endDate; */
                filter.date = {
                    value: [startDate, endDate]
                };

                return next();
            }
            try {
                result = JSON.parse(result);
                res.status(200).send(result);
                console.timeEnd('cash');
            } catch (exc) {
                return next();
            }
        });
    }

    /**
     *@api {get} /dashboard/vacation/ Request dashboard vocation
     *
     * @apiVersion 0.0.1
     * @apiName getDashboardVocation
     * @apiGroup Dashboard
     *
     * @apiParam (?Field=value) {String} startTime
     * @apiParam (?Field=value) {String} filter
     *
     * @apiSuccess {Object} DashboardVocation
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "weeksArray": [
             {
                 "lastDate": "01.07",
                 "dateByWeek": 201626,
                 "week": 26,
                 "year": 2016
             },
             ...
         ],
         "sortDepartments": [
             {
                 "employees": [
                     {
                         "isEmployee": true,
                         "firstTransferDate": "2016-06-12T21:00:00.000Z",
                         "lastTransferDate": "2016-06-12T21:00:00.000Z",
                         "_lastTransferDate": 201624,
                         "_firstTransferDate": 201624,
                         "lastTransfer": "2016-06-12T21:00:00.000Z",
                         "name": "Ihor Kalashniuk",
                         "isTransfer": [
                             {
                                 "status": "hired",
                                 "date": "2016-06-12T21:00:00.000Z"
                             }
                         ],
                         "transferArr": [],
                         "_id": "575fc0bb7330dff16a340390",
                         "weekData": [
                             {
                                 "lastDate": "01.07",
                                 "dateByWeek": 201626,
                                 "week": 26,
                                 "year": 2016,
                                 "holidays": 1,
                                 "vacations": 0
                             },
                             ...
                         ],
                         "maxProjects": 0
                     },
                     {
                         "isEmployee": true,
                         "isLead": 0,
                         "firstTransferDate": "2016-02-01T00:00:00.000Z",
                         "lastTransferDate": "2016-06-01T00:00:00.000Z",
                         "_lastTransferDate": 201622,
                         "_firstTransferDate": 201605,
                         "lastTransfer": "2016-06-01T00:00:00.000Z",
                         "name": "Maxim Holubka",
                         "isTransfer": [
                             {
                                 "status": "updated",
                                 "date": "2016-02-01T00:00:00.000Z"
                             },
                             {
                                 "status": "updated",
                                 "date": "2016-06-01T00:00:00.000Z"
                             }
                         ],
                         "transferArr": [],
                         "_id": "55b92ad221e4b7c40f0000a5",
                         "weekData": [
                             {
                                 "lastDate": "01.07",
                                 "dateByWeek": 201626,
                                 "week": 26,
                                 "year": 2016,
                                 "holidays": 1,
                                 "vacations": 0
                             },
                             {
                                 "lastDate": "08.07",
                                 "dateByWeek": 201627,
                                 "week": 27,
                                 "year": 2016,
                                 "holidays": 0,
                                 "vacations": 0
                             },
                             ...
                         ],
                         "maxProjects": 0
                     },
                    ...
                    ]
                 }
                 ...
         ]
     }
     */
    router.get('/vacation', authStackMiddleware, accessStackMiddlewareVacation, cacheRetriver, handler.composeForVacation);
    // router.get('/vacation', handler.getFromCache);

    /**
     *@api {get} /dashboard/hr/ Request dashboard hr
     *
     * @apiVersion 0.0.1
     * @apiName getDashboardHr
     * @apiGroup Dashboard
     *
     * @apiSuccess {Object} DashboardHr
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
       "_id": "hired",
       "data": [
         {
           "_id": 201508,
           "hiredCount": 21,
           "hiredEmployees": [
             {
               "_id": "55e96ab13f3ae4fd0b000009",
               "department": {
                 "_id": "55bb1f40cb76ca630b000007",
                 "name": "PM"
               },
               "name": {
                 "last": "Pavliuk",
                 "first": "Oles"
               },
               "isEmployee": true,
               "hireDate": 201508
             },
             {
               "_id": "55ded6b3ae2b22730b00004e",
               "department": {
                 "_id": "55bb1f14cb76ca630b000006",
                 "name": "Design"
               },
               "name": {
                 "last": "Dimova",
                 "first": "Anastasia"
               },
               "isEmployee": false,
               "hireDate": 201508
             },
             ...
           ]
         },
         {
           "_id": 201509,
           "hiredCount": 20,
           "hiredEmployees": [
             {
               "_id": "56090d77066d979a33000009",
               "department": {
                 "_id": "55b92ace21e4b7c40f000011",
                 "name": "QA"
               },
               "name": {
                 "first": "Yuriy",
                 "last": "Bysaha"
               },
               "isEmployee": true,
               "hireDate": 201509
             },
             ...
           ]
         },
         ...
         ]
     },
     {
    "_id": "fired",
    "data": [
      {
        "_id": 201508,
        "firedCount": 6,
        "firedEmployees": [
          {
            "_id": "55cdffa59b42266a4f000015",
            "department": {
              "_id": "55b92ace21e4b7c40f000012",
              "name": ".NET/WP"
            },
            "name": {
              "last": "Magar",
              "first": "Dmitriy"
            },
            "isEmployee": false,
            "fireDate": 201508
          },
          {
            "_id": "55b92ad221e4b7c40f0000ab",
            "isLead": 0,
            "department": {
              "_id": "55b92ace21e4b7c40f000015",
              "name": "HR"
            },
            "name": {
              "last": "Olkhovik",
              "first": "Katerina"
            },
            "isEmployee": false,
            "fireDate": 201508
          },
         ...
        ]
      },
      {
        "_id": 201509,
        "firedCount": 7,
        "firedEmployees": [
          {
            "_id": "55ed5a437221afe30b000006",
            "department": {
              "_id": "55b92ace21e4b7c40f000013",
              "name": "Marketing"
            },
            "name": {
              "last": "Porokhnitska",
              "first": "Yulia"
            },
            "isEmployee": false,
            "fireDate": 201509
          },
          ...
        ]
      },
      ...
      ]
    }
     ]
     */
    router.get('/hr', authStackMiddleware, accessStackMiddlewareHR, handler.composeForHr);

    return router;
};
