var Modules = require('../handlers/modules');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var redisStore = require('../helpers/redisClient');

module.exports = function (event, models) {
    var handler = new Modules(event, models);

    console.time('module');
    function cacheRetriver(req, res, next) {
        var key = req.session.profileId;

        redisStore.readFromStorage('modules', key, function (err, result) {
            if (!result) {
                return next();
            }
            try {
                result = JSON.parse(result);
                res.status(200).send(result);
                console.timeEnd('module');
            } catch (exc) {
                return next();
            }
        });
    }

    router.use(authStackMiddleware);

    /**
     *@api {get} /modules/ Request Modules
     *
     * @apiVersion 0.0.1
     * @apiName getModules
     * @apiGroup Modules
     *
     * @apiSuccess {Object} Modules
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
     {
         "subModules": [
             {
                 "mname": "Leads",
                 "href": "Leads",
                 "link": true
             },
             {
                 "mname": "Opportunities",
                 "href": "Opportunities",
                 "link": true
             },
             ...
         ],
         "_id": 19,
         "mname": "Sales",
         "href": "Sales",
         "link": false
     },
     {
         "subModules": [
             {
                 "mname": "Projects",
                 "href": "Projects",
                 "link": true
             },
             ...
         ],
         "_id": 36,
         "mname": "Project",
         "href": "Project",
         "link": false
     },
     ...
]
     */
    router.get('/', /*cacheRetriver,*/ handler.getAllModulesByProfile);

    return router;
};
