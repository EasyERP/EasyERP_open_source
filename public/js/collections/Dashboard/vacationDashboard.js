define([
    'Backbone',
    'models/VacationDashboard',
    'constants',
    'custom'
], function (Backbone, Model, CONSTANTS, custom) {
    'use strict';

    var Collection = Backbone.Collection.extend({
        model: Model,
        url  : CONSTANTS.URLS.DASHBOARD_VACATION,

        initialize: function (options) {
            this.fetch({
                data : options,
                reset: true
            });
        },

        parse: function (response) {
            var weeksArr = response ? response.weeksArray : [];

            custom.cacheToApp('vacationDashWeeksArr', weeksArr);

            return response ? response.sortDepartments : [];
        }

    });

    return Collection;
});