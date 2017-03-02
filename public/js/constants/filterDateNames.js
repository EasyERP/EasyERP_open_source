'use strict';

(function () {
    var root;

    var DATE_FILTER_NAMES = {
        line: {
            _id: 'line'
        },

        thisWeek: {
            _id : 'thisWeek',
            name: 'This Week'
        },

        thisMonth: {
            _id : 'thisMonth',
            name: 'This Month'
        },

        thisYear: {
            _id : 'thisYear',
            name: 'This Year'
        },

        thisFinYear: {
            _id : 'thisFinYear',
            name: 'This Financial Year'
        },

        lastWeek: {
            _id : 'lastWeek',
            name: 'Last Week'
        },

        lastMonth: {
            _id : 'lastMonth',
            name: 'Last Month'
        },

        lastQuarter: {
            _id : 'lastQuarter',
            name: 'Last Quarter'
        },

        lastFinYear: {
            _id : 'lastFinYear',
            name: 'Last Financial Year'
        },

        lastYear: {
            _id : 'lastYear',
            name: 'Last Year'
        },

        custom: {
            _id : 'custom',
            name: 'Custom Dates'
        },

        sevenDays: {
            _id : '7',
            name: '7D'
        },

        thirtyDays: {
            _id : '30',
            name: '30D'
        },

        ninetyDays: {
            _id : '90',
            name: '90D'
        },

        twelveMonths: {
            _id : '365',
            name: '12M'
        },

        day: {
            _id : 'day',
            name: 'Day'
        },

        week: {
            _id : 'week',
            name: 'Week'
        },

        month: {
            _id : 'month',
            name: 'Month'
        },

        dayOfWeek: {
            _id : 'dayOfWeek',
            name: 'Day Of Week'
        },

        dayOfMonth: {
            _id : 'dayOfMonth',
            name: 'Day Of Month'
        },

        endDate: {
            _id: 'endDate'
        }
    };

    if (typeof window === 'object' && this === window) {
        root = window;
    } else if (typeof global === 'object' && this === global) {
        root = global;
    } else {
        root = this;
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = DATE_FILTER_NAMES;
        }
    } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return DATE_FILTER_NAMES;
        });
    } else {
        root.DATE_FILTER_NAMES = DATE_FILTER_NAMES;
    }
}());
