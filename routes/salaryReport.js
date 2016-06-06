var express = require('express');
var router = express.Router();
var SalaryHandler = require('../handlers/payroll');
var redisStore = require('../helpers/redisClient');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    'use strict';

    var handler = new SalaryHandler(models);

    function cacheRetriver(req, res, next) {
        var query = req.query;
        var filter = query.filter;
        var startDate = query.startDate;
        var endDate = query.endDate;
        var dateKey = '';

        if (startDate && endDate) {
            dateKey = startDate.toString() + endDate.toString();
        }
        var key = 'salaryReport' + JSON.stringify(filter) + dateKey;

        redisStore.readFromStorage('salaryReport', key, function (err, reportStringObject) {
            var report;

            if (!reportStringObject || err) {
                return next();
            }

            report = JSON.parse(reportStringObject);
            res.status(200).send(report);
        });
    }

    router.get('/', authStackMiddleware, cacheRetriver, handler.getSalaryReport);

    return router;
};
