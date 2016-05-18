var express = require('express');
var router = express.Router();
var taskHandler = require('../handlers/task');

module.exports = function (models) {
    var handler = new taskHandler(models);

    router.get('/getFilterValues', handler.getFilterValues);

    return router;
};