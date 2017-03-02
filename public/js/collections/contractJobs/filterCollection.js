define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/contractJobsModel',
    'helpers/getDateHelper',
    'dataService',
    'constants',
    'moment',
    'custom'
], function (Backbone, _, Parent, Model, DateHelper, dataService, CONSTANTS, moment, Custom) {
    'use strict';

    var ContractJobsCollection = Parent.extend({
        model      : Model,
        url        : CONSTANTS.URLS.CONTRACTJOBS,
        pageSize   : 10,
        contentType: 'contractJobs',

        initialize: function (options) {
            var dateRange;
            var _opts;

            this.filter = options.filter || Custom.retriveFromCash(this.contentType + '.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            Custom.cacheToApp(this.contentType + '.filter', options.filter);

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            this.page = options.page;

            _opts = options || {};
            _opts.error = _opts.error || _errHandler;

            this.startTime = new Date();

            if (this.page) {
                return this.getPage(this.page, _opts);
            }

            this.getFirstPage(_opts);
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

    return ContractJobsCollection;
});
