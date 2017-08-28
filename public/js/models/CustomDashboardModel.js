define([
    'Underscore',
    'Backbone',
    'Validation',
    'common',
    'constants'
], function (_, Backbone, Validation, common, CONSTANTS) {
    'use strict';

    var CustomDashboardModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.DASHBOARDS;
        }
    });

    return CustomDashboardModel;
});
