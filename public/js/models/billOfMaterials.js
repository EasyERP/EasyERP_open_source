define([
    'Underscore',
    'Backbone',
    'common',
    'moment',
    'constants',
    'Validation'
], function (_, Backbone, common, moment, CONSTANTS, Validation) {
    'use strict';

    var BillOfMaterialsModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.BILLOFMATERIALS;
        },

        initialize: function () {
            this.on('invalid', function (model, errors) {
                var msg;

                if (errors.length > 0) {
                    msg = errors.join('\n');

                    App.render({
                        type   : 'error',
                        message: msg
                    });
                }
            });
        },

        validate: function (attrs) {
            var errors = [];

            Validation.checkForOnlyNumber(errors, attrs.quantity, 'Quantity');
            Validation.checkForPositiveValue(errors, attrs.quantity, 'Quantity');

            if (errors.length > 0) {
                return errors;
            }
        }
    });

    return BillOfMaterialsModel;
});