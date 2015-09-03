
var express = require('express');
var router = express.Router();
var DepartmentHandler = require('../handlers/department');

module.exports = function (models) {
    var handler = new DepartmentHandler(models);

    router.get('/getForDD', handler.getForDD);

    return router;
};