define([
    'Backbone',
    'models/VacationDashboard',
    'helpers/getDateHelper',
    'constants',
    'custom'
], function (Backbone, Model, DateHelper, CONSTANTS, custom) {
    'use strict';

    var VacationDashCollection = Backbone.Collection.extend({
        model: Model,
        url  : CONSTANTS.URLS.DASHBOARD_VACATION,

        initialize: function (options) {
            var dateRange;
            var _opts;

            this.startTime = new Date();

            this.filter = options.filter || custom.retriveFromCash('DashVacation.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            custom.cacheToApp('DashVacation.filter', options.filter);

            _opts = options || {};

            this.fetch({
                data   : _opts,
                reset  : true,
                success: function () {
                },

                error: function (err, xhr) {
                    console.log(xhr);
                }
            });
        },

        parse: function (response) {
            var weeksArr = response ? response.weeksArray : [];

            custom.cacheToApp('vacationDashWeeksArr', weeksArr);

            return response ? response.sortDepartments : [];
        }

    });

    return VacationDashCollection;
});
