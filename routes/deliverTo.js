var express = require('express');
var router = express.Router();
var DeliverToHandler = require('../handlers/deliverTo');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new DeliverToHandler(models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /deliverTo/ Request deliverTo for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getDeliverTo
     * @apiGroup DeliverTo
     *
     * @apiSuccess {Object} deliverTo
     * @apiSuccessExample Success-Response:
HTTP/1.1 304 Not Modified
{
  "data": [
    {
      "_id": "55543831d51bdef79ea0d58c",
      "name": "YourCompany"
    }
  ]
}
     * */
    router.get('/', handler.getForDd);

    return router;
};
