var express = require('express');
var router = express.Router();
var IncotermHandler = require('../handlers/incoterm');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new IncotermHandler(models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /incoterm/ Request Incoterms
     *
     * @apiVersion 0.0.1
     * @apiName getIncoterms
     * @apiGroup Incoterm
     *
     * @apiSuccess {Object} Incoterms
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
  "data": [
    {
      "_id": "55537115475b7be475f33602",
      "code": "CIP",
      "name": "CARRIAGE AND INSURANCE PAID TO"
    },
    {
      "_id": "55537115475b7be475f33601",
      "code": "CPT",
      "name": "CARRIAGE PAID TO"
    },
    ...
  ]
}
     * */
    router.get('/', handler.getForDd);

    return router;
};
