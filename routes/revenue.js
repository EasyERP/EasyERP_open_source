

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
    router.get('/employeeBySales', expressSession.authenticatedUser, handler.employeeBySales);

    router.get('/getFromCash', expressSession.authenticatedUser, handler.getFromCash);
    router.get('/hoursByDep', expressSession.authenticatedUser, handler.hoursByDep);
    router.get('/totalHours', expressSession.authenticatedUser, handler.totalHours);
    router.get('/hoursSold', expressSession.authenticatedUser, handler.hoursSold);

    router.get('/allBonus', expressSession.authenticatedUser, handler.allBonus);
    router.get('/uncalcBonus', expressSession.authenticatedUser, handler.uncalcBonus);
    router.get('/calcBonus', expressSession.authenticatedUser, handler.calcBonus);
    router.get('/synthetic', expressSession.authenticatedUser, handler.synthetic);

  /*  router.get('/paidBonus', expressSession.authenticatedUser, handler.paidBonus);
    router.get('/balanceBonus', expressSession.authenticatedUser, handler.balanceBonus);*/

    return router;
};