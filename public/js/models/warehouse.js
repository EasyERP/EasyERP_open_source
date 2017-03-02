define([
    'Backbone',
    'constants',
    'Validation'
], function (Backbone, CONSTANTS, Validation) {
    'use strict';

    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.WAREHOUSE;
        },

        validate: function (attrs) {
            var errors = [];

            Validation.checkGroupsNameField(errors, true, attrs.name, 'Project name');

            if (errors.length > 0) {
                return errors;
            }
        }
    });

    return Model;
});
