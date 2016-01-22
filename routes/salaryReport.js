/**
 * Created by liliy on 20.01.2016.
 */
"use strict";
var express = require('express');
var router = express.Router();
var SalaryHandler = require('../handlers/payroll');
var redisStore = require('../helpers/redisClient');

module.exports = function (models) {
    var handler = new SalaryHandler(models);

    function cacheRetriver(req, res, next){
        var query = req.query;
        var filter = query.filter;
        var year = query.year;
        var key = 'salaryReport' + JSON.stringify(filter) + year;

        redisStore.readFromStorage('salaryReport', key, function(err, reportStringObject){
            var report;

            if(!reportStringObject || err) {
                return next();
            }

            report = JSON.parse(reportStringObject);
            res.status(200).send(report);
        });
    }

    router.get('/list', cacheRetriver, handler.getSalaryReport);

    return router;
};