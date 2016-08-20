define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/contractJobsModel',
    'dataService',
    'constants',
    'moment',
    'custom'
], function (Backbone, _, Parent, Model, dataService, CONSTANTS, moment, Custom) {
    'use strict';

    var CompaniesCollection = Parent.extend({
        model      : Model,
        url        : CONSTANTS.URLS.CONTRACTJOBS,
        pageSize   : 10,
        contentType: 'Companies',

        initialize: function (options) {
            var page;
            var startDate = moment(new Date());
            var endDate = moment(new Date());

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            this.filter = options.filter || Custom.retriveFromCash('balanceSheet.filter');

            startDate.month(startDate.month() - 1);
            startDate.date(1);
            endDate.month(startDate.month());
            endDate.endOf('month');

            var dateRange = Custom.retriveFromCash('contractJobsDateRange') || {};
            this.startDate = dateRange.startDate;
            this.endDate = dateRange.endDate;

            this.startDate = dateRange.startDate || new Date(startDate);
            this.endDate = dateRange.endDate || new Date(endDate);

            options.startDate = this.startDate;
            options.endDate = this.endDate;
            options.filter = this.filter;

            Custom.cacheToApp('contractJobsDateRange', {
                startDate: this.startDate,
                endDate  : this.endDate
            });
            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

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
