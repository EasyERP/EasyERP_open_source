define([
    'Backbone',
    'Underscore',
    'constants'
], function (Backbone, _, CONSTANTS) {
    'use strict';

    var ProductTypeModel = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            name   : '',
            options: []
        },

        urlRoot: function () {
            return CONSTANTS.URLS.PRODUCT_TYPES;
        }
    });
    return ProductTypeModel;
});
