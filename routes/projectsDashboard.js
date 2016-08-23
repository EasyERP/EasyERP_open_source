var express = require('express');
var router = express.Router();
var jobsHandler = require('../handlers/jobs');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new jobsHandler(models, event);
    var moduleId = MODULES.PROJECTSDASHBOARD;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    
    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getForProjectsDashboard);

    return router;
};
