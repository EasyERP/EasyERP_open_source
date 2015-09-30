

var express = require('express');
var router = express.Router();
var WorkflowHandler = require('../handlers/workflow');

module.exports = function (models) {
    var handler = new WorkflowHandler(models);

    router.get('/getFirstForConvert', handler.getFirstForConvert);
    router.get('/fetch', handler.fetch);

    return router;
};