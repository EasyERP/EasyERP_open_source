var Handler = require('../handlers/contractJobs');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new Handler(models, event);
    var moduleId = MODULES.CONTRACTJOBS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', handler.getForOverview);

    return router;
};
