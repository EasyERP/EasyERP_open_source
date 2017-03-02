define([
    'Backbone',
    'Underscore',
    'constants',
    'Validation'
], function (Backbone, _, CONSTANTS, Validation) {
    'use strict';

    var ProductTypeModel = Backbone.Model.extend({
        idAttribute: '_id',

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

        defaults: {
            name          : '',
            priceListsCode: '',
            currency      : null
        },

        validate: function (attrs) {
            var errors = [];

            Validation.checkPresent(errors, true, attrs.name, 'Price List Name');
            Validation.checkPresent(errors, true, attrs.priceListCode, 'Price List Code');
            Validation.checkPresent(errors, true, attrs.currencyId, 'Currency');

            if (errors.length > 0) {
                return errors;
            }
        },

        urlRoot: function () {
            return CONSTANTS.URLS.PRICELIST;
        }
    });
    return ProductTypeModel;
});
