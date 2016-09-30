define([
    'Underscore',
    'Backbone',
    'common',
    'constants'
], function (_, Backbone) {
    'use strict';

    var CustomChartModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return '/customCharts';
        }
    });

    return CustomChartModel;
});
