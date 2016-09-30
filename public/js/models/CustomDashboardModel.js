define([
    'Underscore',
    'Backbone',
    'common',
    'constants'
], function (_, Backbone, common, CONSTANTS) {
    'use strict';

    var CustomDashboardModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.CUSTOMDASHBOARD;
        }
    });

    return CustomDashboardModel;
});
