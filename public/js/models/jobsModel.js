define([
    'Backbone',
    'Underscore',
    'moment'
], function (Backbone, _, moment) {
    'use strict';

    var JobsModel = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            budget: {
                budget       : [],
                projectValues: {
                    markUp : 0,
                    radio  : 0,
                    revenue: 0,
                    profit : 0
                },

                budgetTotal: {
                    revenueSum : 0,
                    revenueByQa: 0,
                    profitSum  : 0,
                    costSum    : 0,
                    rateSum    : {
                        byDev: 0,
                        byQA : 0
                    },

                    hoursByQa: 0,
                    hoursSum : 0,
                    maxDate  : 0,
                    minDate  : 0
                }
            }
        },

        parse: function (response) {
            var jobs;

            if (response.length) {
                jobs = response;
            } else {
                jobs = [response];
            }

            _.map(jobs, function (job) {
                var i;
                var minDate = job.tCardMinDate;
                var maxDate = job.tCardMaxDate;

                if (minDate) {
                    for (i = 1; i <= 7; i++) {
                        if ((typeof minDate[i] === 'number') && minDate[i] !== 0) {
                            job.tCardMinDate = moment().year(minDate.year).week(minDate.week).isoWeekday(i).format('D/M/YYYY');
                            break;
                        }
                    }
                }
                if (maxDate) {
                    for (i = 7; i >= 1; i--) {
                        if ((typeof maxDate[i] === 'number') && maxDate[i] !== 0) {
                            job.tCardMaxDate = moment().year(maxDate.year).week(maxDate.week).isoWeekday(i).format('D/M/YYYY');
                            break;
                        }
                    }
                }

                return response;
            });

            return response;

        }
    });

    return JobsModel;
});
