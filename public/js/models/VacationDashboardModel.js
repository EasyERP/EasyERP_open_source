define([
    'Backbone'
], function (Backbone) {
    'use strict';

    var VacationDashboardModel = Backbone.Model.extend({
        defaults: {
            departments: ['Android', 'iOS', 'Marketing', 'QA', 'Web', 'WP']
        }
    });

    return VacationDashboardModel;
});
