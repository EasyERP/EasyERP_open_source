define([
    'Backbone',
    'collections/parent',
    'helpers/getDateHelper',
    'constants'
], function (Backbone, Parent, DateHelper, CONSTANTS) {
    'use strict';

    var CustomReportsCollection = Parent.extend({
        url     : CONSTANTS.URLS.REPORTS_DATA,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var dateRange;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            options.dateRange = dateRange;

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            this.startTime = new Date();

            this.getFirstPage(options);
        },

        parse: function (response) {
            if (response instanceof Array) {
                return response;
            }

            this.reportType = response.type;
            this.reportCategory = response.category;
            this.reportHeaderMapper = response.headerMapper;
            this.total = response.total;

            return response.data;
        }
    });

    return CustomReportsCollection;
});
