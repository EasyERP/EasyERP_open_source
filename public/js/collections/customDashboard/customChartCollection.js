define([
    'Backbone',
    'Underscore',
    'models/CustomChartModel'
], function (Backbone, _, CustomChartModel) {
    'use strict';

    var CustomChartCollection = Backbone.Collection.extend({
        model: CustomChartModel,
        url  : '/customChart',

        save: function () {

            Backbone.sync('create', this);
        },

        remove: function (options) {
            Backbone.sync('delete', this, {
                data : options,
                reset: true
            });
        }
    });

    return CustomChartCollection;
});
