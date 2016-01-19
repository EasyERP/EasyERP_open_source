var express = require('express');
var router = express.Router();
var WtrackHandler = require('../handlers/dashboard');
var redisStore = require('../helpers/redisClient');
var moment = require('../public/js/libs/moment/moment');
var CONSTANTS = require('../constants/mainConstants');

module.exports = function (models) {
    'use strict';
    var handler = new WtrackHandler(models);

    function cacheRetriver(req, res, next) {
        console.time('cash');
        var query = req.query;
        var filter = query.filter || {};
        var key;
        var startDate;
        var endDate;
        var startByWeek;
        var endByWeek;
        var needRefresh = !!query.refresh;

        if (filter.startDate && filter.endDate) {
            startDate = new Date(filter.startDate);
            startDate = moment(startDate);
            endDate = new Date(filter.endDate);
            endDate = moment(endDate);
        } else {
            startDate = moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'weeks');
            endDate = moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'weeks');
        }

        startByWeek = startDate.isoWeekYear() * 100 + startDate.isoWeek();
        endByWeek = endDate.isoWeekYear() * 100 + endDate.isoWeek();

        delete filter.startDate;
        delete filter.endDate;

        key = startByWeek + '_' + endByWeek + '_' + JSON.stringify(filter);

        redisStore.readFromStorage('dashboardVacation', key, function (err, result) {
            if (needRefresh || !result) {
                filter.startDate = startDate;
                filter.endDate = endDate;

                return next();
            }

            result = JSON.parse(result);
            res.status(200).send(result);
            console.timeEnd('cash');
        });
    }

    router.get('/vacation', cacheRetriver, handler.composeForVacation);
    //router.get('/vacation', handler.getFromCache);
    router.get('/hr', handler.composeForHr);

    return router;
};