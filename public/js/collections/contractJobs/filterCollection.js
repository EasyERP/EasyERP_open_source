define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/contractJobsModel',
    'dataService',
    'constants',
    'moment'
], function (Backbone, _, Parent, Model, dataService, CONSTANTS, moment) {
    'use strict';

    var CompaniesCollection = Parent.extend({
        model      : Model,
        url        : CONSTANTS.URLS.CONTRACTJOBS,
        pageSize   : 10,
        contentType: 'Companies',

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        parse: function (response) {
            var jobs = response.data;

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

            return Parent.prototype.parse.call(this, response);

        }
    });

    return CompaniesCollection;
});
