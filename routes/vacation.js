var express = require('express');
var router = express.Router();
var VocationHandler = require('../handlers/vacation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new VocationHandler(event, models);
    var moduleId = MODULES.VACATION;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    /**
     *@api {get} /vacation/ Request Vacation
     *
     * @apiVersion 0.0.1
     * @apiName getVacation
     * @apiGroup Vacation
     *
     * @apiParam (?Field=value) {String} year="Line Year"
     * @apiParam (?Field=value) {String} employee="55b92ad221e4b7c40f00004f" Unique id of Employee
     *
     * @apiSuccess {Object} Vocation
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "data": [
    
      ],
      "stat": {
        "leaveDays": 0,
        "workingDays": 282,
        "vacation": 0,
        "personal": 0,
        "sick": 0,
        "education": 0
      }
}
     */
    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getForView);
    router.get('/getYears', authStackMiddleware, accessStackMiddleware, handler.getYears);
    router.get('/getStatistic', authStackMiddleware, accessStackMiddleware, handler.getStatistic);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.patch('/', authStackMiddleware, accessStackMiddleware, handler.putchBulk);

    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    return router;
};
