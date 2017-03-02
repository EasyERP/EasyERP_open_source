define([
    'Backbone',
    'Underscore',
    'constants',
    'moment'
], function (Backbone, _, CONSTANTS, moment) {
    'use strict';

    var OptionModel = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            name: ''
        },

        urlRoot: function () {
            return CONSTANTS.URLS.SETTINGS_PRODUCTS_OPTION;
        }
    });
    return OptionModel;
});
