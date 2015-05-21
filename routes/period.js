/**
 * Created by Roman on 21.05.2015.
 */
var express = require('express');
var router = express.Router();
var PeriodHandler = require('../handlers/period');

module.exports = function (models) {
    var handler = new PeriodHandler(models);

    router.get('/', handler.getForDd);

    return router;
};