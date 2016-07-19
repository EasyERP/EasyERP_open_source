var express = require('express');
var router = express.Router();
var PayRollHandler = require('../handlers/payroll');
var redisStore = require('../helpers/redisClient');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    'use strict';

    var handler = new PayRollHandler(models);
    var moduleId = MODULES.PAYROLLEXPENSES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    function cacheRetriver(req, res, next) {
        var query = req.query;
        var filter = query.filter;
        var key = 'payrollExpenses' + filter;

        redisStore.readFromStorage('payrollExpenses', key, function (err, expensesStringObject) {
            var expenses;

            if (!expensesStringObject) {
                return next();
            }

            expenses = JSON.parse(expensesStringObject);
            res.status(200).send(expenses);
        });
    }

    /**
     *@api {get} /payroll/ Request Payrolls
     *
     * @apiVersion 0.0.1
     * @apiName getPayrolls
     * @apiGroup Payroll
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of bonusTypes which will show
     * @apiParam (?Field=value) {String="PayrollPayments","PayrollExpenses"} contentType Type of content
     *
     * @apiParam (?Field=value) {Boolean} reset=true
     * @apiParam (?Field=value) {Boolean} showMore=false
     * @apiParam (?Field=value) {String} parrentContentId
     * @apiParam (?Field=value) {Object} filter
     *
     * @apiSuccess {Object} Payrolls
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "total": [
        {
            "201408": {
                "date": "2014-08-31T13:01:00.999Z",
                "status": false,
                "calc": {
                    "onCash": 37750.630000000005
                },
                "paid": {
                    "onCash": 0
                },
                "diff": {
                    "onCash": 37750.630000000005
                }
            }
        },
        {
            "201409": {
                "date": "2014-09-30T13:01:00.999Z",
                "status": false,
                "calc": {
                    "onCash": 37644.003333333334
                },
                "paid": {
                    "onCash": 0
                },
                "diff": {
                    "onCash": 37644.003333333334
                }
            }
        },
        ...
    ]
}
     */
    router.get('/', cacheRetriver, handler.getForView);

    // router.get('/', handler.getSorted);
    router.get('/getAsyncData', handler.getAsyncData);

    /**
     *@api {get} /payroll/:id Request Payroll
     *
     * @apiVersion 0.0.1
     * @apiName getPayroll
     * @apiGroup Payroll
     *
     * @apiParam {Number} id DataKey
     *
     * @apiSuccess {Object} Payroll
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
     {
         "_id": "5780bea7ce02eeb33ee969bc",
         "year": 2014,
         "month": 8,
         "dataKey": 201408,
         "paid": 0,
         "calc": 450,
         "diff": 450,
         "employee": {
             "_id": "55b92ad221e4b7c40f000031",
             "dateBirth": "1995-01-20T23:00:00.000Z",
             "ID": 6,
             "isLead": 2,
             "fire": [
                 "2016-05-12T00:00:00.000Z"
             ],
             "hire": [
                 "2014-03-02T00:00:00.000Z"
             ],
             "social": {
                 "FB": "",
                 "LI": ""
             },
             "sequence": 0,
             "jobType": "Full-time",
             "gender": "male",
             "marital": "unmarried",
             "contractEnd": {
                 "date": "2015-07-29T19:34:42.407Z",
                 "reason": ""
             },
             "attachments": [],
             "editedBy": {
                 "date": "2016-05-19T16:39:38.792Z",
                 "user": "52203e707d4dba8813000003"
             },
             "createdBy": {
                 "date": "2015-07-29T19:34:42.407Z",
                 "user": "52203e707d4dba8813000003"
             },
             "creationDate": "2015-07-29T19:34:42.407Z",
             "color": "#4d5a75",
             "otherInfo": "",
             "groups": {
                 "group": [],
                 "users": [],
                 "owner": "55ba28c8d79a3a3439000016"
             },
             "whoCanRW": "everyOne",
             "workflow": "52d2c1369b57890814000005",
             "active": false,
             "referredBy": "",
             "source": "",
             "age": 21,
             "homeAddress": {
                 "country": "",
                 "zip": "",
                 "state": "",
                 "city": "",
                 "street": ""
             },
             "otherId": "",
             "bankAccountNo": "",
             "nationality": "Ukrainian",
             "coach": null,
             "manager": "55b92ad221e4b7c40f000059",
             "jobPosition": "55b92acf21e4b7c40f00001d",
             "department": "55b92ace21e4b7c40f00000f",
             "visibility": "Public",
             "relatedUser": null,
             "officeLocation": "",
             "skype": "sasha.hleba",
             "workPhones": {
                 "mobile": "+380505192679",
                 "phone": ""
             },
             "personalEmail": "eddy2195@gmail.com",
             "workEmail": "alex.gleba@thinkmobiles.com",
             "workAddress": {
                 "country": "",
                 "zip": "",
                 "state": "",
                 "city": "",
                 "street": ""
             },
             "tags": [
                 ""
             ],
             "name": {
                 "last": "Gleba",
                 "first": "Alex"
             },
             "subject": "",
             "imageSrc": "data:image/jpeg;base64,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",
             "isEmployee": false,
             "__v": 0,
             "lastFire": 201619,
             "weeklyScheduler": "57332c3b94ee1140b6bb49e2",
             "nextAction": "",
             "passportNo": "",
             "identNo": ""
         }
     },
     {
         "_id": "5780bea7ce02eeb33ee969c2",
         "year": 2014,
         "month": 8,
         "dataKey": 201408,
         "paid": 0,
         "calc": 577.5,
         "diff": 577.5,
         "employee": {
             "_id": "55b92ad221e4b7c40f000058",
             "dateBirth": "1987-12-11T00:00:00.000Z",
             ...
         }
     },
     ...
]
     */
    router.get('/:id', handler.getForView);

    router.post('/', handler.create);
    router.post('/generate', handler.generate);
    router.post('/recount', handler.recount);
    router.post('/recountAll', handler.recountAll);
    router.patch('/', handler.putchBulk);
    router.patch('/byDataKey', handler.patchByDataKey);
    router.patch('/:id', handler.putchModel);

    router.delete('/byDataKey', handler.removeByDataKey);
    
    router.delete('/:id', handler.remove);

    return router;
};
