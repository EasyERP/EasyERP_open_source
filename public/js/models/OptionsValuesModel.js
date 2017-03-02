define([
    'Backbone',
    'Underscore',
    'constants',
    'moment'
], function (Backbone, _, CONSTANTS, moment) {
    'use strict';

    var OptionsValuesModel = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            value: ''
        },

        urlRoot: function () {
            return CONSTANTS.URLS.SETTINGS_PRODUCTS_VALUES;
        }
    });
    return OptionsValuesModel;
});
