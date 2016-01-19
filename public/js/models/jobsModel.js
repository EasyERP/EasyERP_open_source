/**
 * Created by liliya on 22.10.15.
 */
define([], function () {
    var JobsModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            budget: {
                budget       : [],
                projectValues: {
                    markUp : 0,
                    radio  : 0,
                    revenue: 0,
                    profit : 0
                },
                budgetTotal  : {
                    revenueSum : 0,
                    revenueByQa: 0,
                    profitSum  : 0,
                    costSum    : 0,
                    rateSum    : {
                        byDev: 0,
                        byQA : 0
                    },
                    hoursByQa  : 0,
                    hoursSum   : 0,
                    maxDate    : 0,
                    minDate    : 0
                }
            }
        }
    });

    return JobsModel;
});