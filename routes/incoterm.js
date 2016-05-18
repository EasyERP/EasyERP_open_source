

var express = require('express');
var router = express.Router();
var IncotermHandler = require('../handlers/incoterm');

module.exports = function (models) {
    var handler = new IncotermHandler(models);

    router.get('/', handler.getForDd);

    return router;
};