/**
 * Created by Roman on 21.05.2015.
 */
var express = require('express');
var router = express.Router();
var ProjectHandler = require('../handlers/project');

module.exports = function (models) {
    var handler = new ProjectHandler(models);

    router.get('/getForWtrack', handler.getForWtrack);
    router.get('/getFilterValues', handler.getFilterValues);

    return router;
};