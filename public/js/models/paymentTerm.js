define([
    'Backbone',
    'Validation'
], function (Backbone, Validation) {
    var paymentMethod = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return '/paymentTerm';
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

            Validation.checkForOnlyNumber(errors, attrs.count, 'Number of days');
            Validation.isOfRange(errors, attrs.count, 'Number of days', 1);

            if (errors.length > 0) {
                return errors;
            }
        }
    });
    return paymentMethod;
});
