define([
    'Backbone',
    'Validation'
], function (Backbone, Validation) {
    var orgSettings = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return '/organizationSettings';
        },
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
        validate: function (attrs) {
            var errors = [];
            Validation.checkGroupsNameField(errors, true, attrs.name, 'Company');
            Validation.checkPhoneField(errors, false, attrs.phone, 'Phone');
            Validation.checkCountryCityStateField(errors,  false, attrs.address.country, 'Country');
            Validation.checkCountryCityStateField(errors, false,  attrs.address.state, 'State');
            Validation.checkCountryCityStateField(errors, false,  attrs.address.city, 'City');
            Validation.checkStreetField(errors, false, attrs.address.street, 'Street');
            Validation.checkZipField(errors, false, attrs.address.zip, 'Zip');

            if (errors.length > 0) {
                return errors;
            }

        },
    });
    return orgSettings;
});
