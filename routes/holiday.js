var express = require('express');
var router = express.Router();
var HolidayHandler = require('../handlers/holiday');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    var handler = new HolidayHandler(models, event);
    var moduleId = MODULES.HOLIDAY;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /holiday/ Request Holidays
     *
     * @apiVersion 0.0.1
     * @apiName getHolidays
     * @apiGroup Holiday
     *
     * @apiParam (?Field=value) {Number} year=2016
     * @apiParam (?Field=value) {Number} week=28
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     *
     * @apiSuccess {Object} Holidays
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
   "2": "H"
}
     * */
    router.get('/', handler.getForView);
    
    router.patch('/', accessStackMiddleWare, handler.putchBulk);
    router.patch('/:id', accessStackMiddleWare, handler.putchModel);
    router.post('/', accessStackMiddleWare, handler.create);

    router.delete('/:id', accessStackMiddleWare, handler.remove);
    router.delete('/', accessStackMiddleWare, handler.bulkRemove);

    return router;
};
