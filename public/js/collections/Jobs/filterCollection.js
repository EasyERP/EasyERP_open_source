define([
    'Backbone',
    'models/jobsModel',
    'collections/parent',
    'constants',
    'moment'
], function (Backbone, JobsModel, Parent, CONSTANTS, moment) {
    'use strict';

    var JobsCollection = Parent.extend({

        model       : JobsModel,
        url     : CONSTANTS.URLS.JOBS_DASHBOARD,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

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

            if (options && options.url) {
                this.url = options.url;
                delete options.url;
            }

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        parse: function (response) {
            var jobs = response;

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

                return job;
            });

            return Parent.prototype.parse.call(this, response);

        }
    });

    return JobsCollection;
});
