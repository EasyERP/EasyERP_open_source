/**
 * Created by Roman on 16.06.2015.
 */

var express = require('express');
var router = express.Router();
var revenueHandler = require('../handlers/revenue');

var expressSession = require('../handlers/expressSession');

module.exports = function (models) {
    var handler = new revenueHandler(models);

    router.get('/bysales', expressSession.authenticatedUser, handler.bySales);

    return router;
};