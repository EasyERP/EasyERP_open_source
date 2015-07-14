/**
 * Created by Roman on 16.06.2015.
 */

var express = require('express');
var router = express.Router();
var revenueHandler = require('../handlers/revenue');

var expressSession = require('../handlers/expressSession');

module.exports = function (models) {
    var handler = new revenueHandler(models);

    router.get('/bySales', expressSession.authenticatedUser, handler.bySales);
    router.get('/byDepartment', expressSession.authenticatedUser, handler.byDepartment);
    router.get('/paidwtrack', expressSession.authenticatedUser, handler.paidwtrack);
    router.get('/unpaidwtrack', expressSession.authenticatedUser, handler.unpaidwtrack);
    router.get('/cancelledWtrack', expressSession.authenticatedUser, handler.cancelledWtrack);
    router.get('/projectBySales', expressSession.authenticatedUser, handler.projectBySales);

    return router;
};