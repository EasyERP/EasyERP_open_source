var CustomReportsHandler = require('../handlers/customReports');
var express = require('express');
var router = express.Router();

module.exports = function (models) {
    var handler = new CustomReportsHandler(models);

    router.get('/', handler.get);
    router.post('/', handler.create);

    return router;
};
