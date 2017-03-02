define([
    'moment'
], function (moment) {
    'use strict';

    function switchPeriod(period) {
        var periodsObject = {};

        periodsObject.thisMonth = {
            type: 'months'
        };

        periodsObject.thisYear = periodsObject.thisFinYear = {
            type: 'year'
        };

        periodsObject.lastMonth = {
            count: 1,
            type : 'months'
        };

        periodsObject.lastQuarter = {
            type: 'quarter'
        };

        periodsObject.lastYear = periodsObject.lastFinYear = {
            count: 1,
            type : 'year'
        };

        return periodsObject[period];
    }

    function getDate(period) {
        var startDate;
        var endDate;
        var operator;
        var quarter;
        var count;
        var type;
        var _opts;
        var date;

        if (typeof period === 'string') {
            _opts = switchPeriod(period);
        } else if (typeof period === 'object') {
            _opts = period || {};
        } else {
            _opts = null;
        }

        if (!_opts) {
            return false;
        }

        date = _opts.date ? new Date(_opts.date) : new Date();
        operator = _opts.operator || 'subtract';
        type = _opts.type || 'days';
        count = _opts.count;

        if (typeof period === 'string') {
            if (type !== 'quarter') {
                if (count) {
                    date = moment(date)[operator](count, type);
                }
                startDate = moment(date).startOf(type);
                endDate = moment(date).endOf(type);
            } else {
                quarter = moment(date).quarter();
                startDate = moment(date).quarter(quarter - 1).startOf(type);
                endDate = moment(startDate).endOf(type);
            }
        } else {
            if (operator === 'add') {
                startDate = moment(date);
                endDate = moment(date)[operator](count, type);
            } else {
                startDate = moment(date)[operator](count, type);
                endDate = moment(date);
            }
        }

        return [startDate.format('D MMM, YYYY'), endDate.format('D MMM, YYYY')];
    }

    return {
        getDate: getDate
    };
});
