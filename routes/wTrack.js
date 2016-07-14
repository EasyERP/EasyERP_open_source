var express = require('express');
var router = express.Router();
var WTrackHandler = require('../handlers/wTrack');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new WTrackHandler(event, models);
    var moduleId = MODULES.WTRACK;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware); // added generall check on auth

    router.get('/getForProjects', accessStackMiddleware, handler.getForProjects);
    // router.get('/exportToXlsx',handler.exportToXlsx);
    // router.get('/exportToCsv',handler.exportToCsv);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/dash', handler.getForDashVacation);
    router.get('/hours', handler.getHours);
    router.get('/', accessStackMiddleware, handler.getByViewType);
    
    router.post('/', accessStackMiddleware, handler.create);


    /**
     *@api {post} /wTrack/generateWTrack/ Request for generating wTrack
     *
     * @apiVersion 0.0.1
     * @apiName GenerateWTrack
     * @apiGroup wTrack
     *
     * @apiParamExample {json} Request-Example:
     * [
         {
           "1": 8,
           "2": 8,
           "3": 8,
           "4": 8,
           "5": 8,
           "6": 0,
           "7": 0,
           "startDate": "6 Jul, 2016",
           "endDate": "20 Jul, 2016",
           "hours": "",
           "project": "573db3d09fdef3d14282b561",
           "employee": "577b6349d2658cb5213589b2",
           "department": "55b92ace21e4b7c40f000016"
         }
     ]
     *
     * @apiSuccess {String} Status
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     "success"
     */
    router.post('/generateWTrack', accessStackMiddleware, handler.generateWTrack);
    router.patch('/', accessStackMiddleware, handler.putchBulk);
    router.patch('/:id', accessStackMiddleware, handler.putchModel);
    /* router.put('/:id', handler.updateModel);*/

    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
