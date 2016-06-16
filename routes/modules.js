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

    router.get('/', cacheRetriver, handler.getAllModulesByProfile);

    return router;
};
