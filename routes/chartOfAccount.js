var express = require('express');
var router = express.Router();
var ChartOfAccountHandler = require('../handlers/chartOfAccount');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new ChartOfAccountHandler(models);
    var moduleId = MODULES.CHARTOFACCOUNT;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

/**
 *@api {get} /ChartOfAccount/ Request Chart Of Account
 *
 * @apiVersion 0.0.1
 * @apiName getChartOfAccount
 * @apiGroup ChartOfAccount
 *
 * @apiParam (?Field=value) {String} viewType="list" Type of View
 * @apiParam (?Field=value) {Number} page=1 Number of page
 * @apiParam (?Field=value) {Number} count=100 Count of bonusTypes which will show
 * @apiParam (?Field=value) {String} contentType="bonusType" Type of content
 *
 * @apiSuccess {Object} ChartOfAccount Chart Of Account
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK

 */
router.get('/', accessStackMiddleware, handler.getForView);
router.get('/getForDd', accessStackMiddleware, handler.getForDd);

router.post('/', accessStackMiddleware, handler.create);
router.patch('/', accessStackMiddleware, handler.putchBulk);

router.delete('/:id', accessStackMiddleware, handler.remove);
router.delete('/', accessStackMiddleware, handler.bulkRemove);

return router;
};
