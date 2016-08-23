var express = require('express');
var router = express.Router();
var jobsHandler = require('../handlers/jobs');

module.exports = function (models, event) {
    var handler = new jobsHandler(models, event);
    
    router.get('/', handler.getForProjectsDashboard);

    return router;
};
