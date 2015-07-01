var express = require('express');
var router = express.Router();
var jobPositionHandler = require('../handlers/jobPosition');

module.exports = function (models) {
    var handler = new jobPositionHandler(models);

    router.get('/getFilterValues', handler.getFilterValues);

    return router;
};