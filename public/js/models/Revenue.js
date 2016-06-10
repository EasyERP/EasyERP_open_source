define([
    'Backbone'
], function (Backbone) {
    'use strict';
    var MainModel = Backbone.Model.extend({
        defaults: {
            bySales         : [],
            byProject       : [],
            currentStartWeek: null,
            currentYear     : null,
            currentMonth    : null,
            yearOfMonth     : null,
            weeksArr        : [],
            bySalesData     : [],
            byDepData       : [],
            paidBySales     : [],
            unpaidBySales   : [],
            cancelledBySales: [],
            projectBySales  : [],
            employeeBySales : [],
            hoursByDep      : [],
            allBonus        : [],
            uncalcBonus     : [],
            calcBonus       : [],
            paidBonus       : [],
            balanceBonus    : [],
            allBonusByMonth : [],
            totalHours      : [],
            hoursSold       : [],
            hoursUnsold     : []
        }
    });

    return MainModel;
});
