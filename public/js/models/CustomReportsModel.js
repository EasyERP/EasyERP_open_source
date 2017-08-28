define([
    'Underscore',
    'Backbone',
    'Validation',
    'common',
    'constants'
], function (_, Backbone, Validation, common, CONSTANTS) {
    'use strict';

    var CustomReportsModel = Backbone.Model.extend({
        idAttribute: '_id',

        initialize : function () {
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
            return CONSTANTS.URLS.REPORTS;
        },

        validate: function (attrs) {
            var errors = [];
            var required = !attrs.isForProfile;

            Validation.checkPresent(errors, true, attrs.name, 'Name');
            Validation.checkNameField(errors, true, attrs.reportType, 'Type Report');

            if (errors.length > 0) {
                return errors;
            }
        }
    });

    return CustomReportsModel;
});
