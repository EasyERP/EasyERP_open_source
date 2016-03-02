define([
    'Backbone',
    'Validation',
    'common',
    'moment'
], function (Backbone, Validation, common, moment) {
    "use strict";

    var wTrackModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            dateByWeek : 0,
            dateByMonth: 0,
            project    : {
                workflow      : {},
                customer      : {},
                projectmanager: {}
            },
            employee   : {},
            department : {},
            worked     : 40,
            1          : 8,
            2          : 8,
            3          : 8,
            4          : 8,
            5          : 8,
            6          : 0,
            7          : 0,
            revenue    : 0,
            cost       : 0,
            amount     : 0,
            rate       : 0
        },
        urlRoot : function () {
            return "/wTrack/";
        },
        parse   : function (model) {
            var profit;
            var revenue = model.revenue;
            var cost = model.cost;
            var amount = model.amount;

            profit = (revenue - cost) / 100;
            revenue = (revenue / 100).toFixed(2);
            cost = (cost / 100).toFixed(2);
            amount = amount ? (amount / 100).toFixed(2) : 0;

            model.revenue = revenue;
            model.profit = profit.toFixed(2);
            model.cost = cost;
            model.amount = amount;

            return model;
        }
    });

    return wTrackModel;
});