var express = require('express');
var router = express.Router();
var DestinationHandler = require('../handlers/destination');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new DestinationHandler(models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /destination/ Request Destinations
     *
     * @apiVersion 0.0.1
     * @apiName getDestinations
     * @apiGroup Destination
     *
     * @apiSuccess {Object} Destinations
     * @apiSuccessExample Success-Response:
HTTP/1.1 304 Not Modified
{
  "data": [
    {
      "_id": "555362d5475b7be475f335f2",
      "name": "Stock"
    }
  ]
}
     */
    router.get('/', handler.getForDd);

    return router;
};
