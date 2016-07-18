var express = require('express');
var router = express.Router();
var PrPositionHandler = require('../handlers/projectPosition');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PrPositionHandler(models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /projectPosition/getForDD/ Request ProjectPositionForDD
     *
     * @apiVersion 0.0.1
     * @apiName getProjectPositionForDD
     * @apiGroup Project Position
     *
     * @apiSuccess {Object} ProjectPositionForDD
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
        {
            "_id": "570e9a75785753b3f1d9c871",
            "name": "Developer"
        },
        {
            "_id": "570e9a75785753b3f1d9c870",
            "name": "Marketer"
        },
        {
            "_id": "570e9a75785753b3f1d9c86f",
            "name": "Project manager"
        },
        {
            "_id": "570e9a75785753b3f1d9c873",
            "name": "Reference person"
        },
        {
            "_id": "570e9a75785753b3f1d9c86e",
            "name": "Sales manager"
        },
        {
            "_id": "570e9a75785753b3f1d9c872",
            "name": "Team lead"
        }
    ]
}
     */
    router.get('/getForDD', handler.getForDd);

    return router;
};
