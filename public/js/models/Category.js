define([
    'Backbone',
    'constants',
    'Validation'
], function (Backbone, CONSTANTS, Validation) {
    'use strict';
    var Model = Backbone.Model.extend({
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

        urlRoot: function () {
            return CONSTANTS.URLS.CATEGORY;
        },

        validate: function (attrs) {
            var errors = [];

            Validation.checkNameField(errors, true, attrs.name, 'Category Name');

            if (errors.length > 0) {
                return errors;
            }
        }
    });

    return Model;
});
