define(['Validation'], function (Validation) {
    var ProfilesModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {
            this.on('invalid', function (model, errors) {
                var msg;

                if (errors.length > 0) {
                    msg = errors.join('\n');

                    App.render({
                        type: 'error',
                        message: msg
                    });
                }
            });
        },
        validate   : function (attrs) {
            var errors = [];
            Validation.checkGroupsNameField(errors, true, attrs.profileName, "Profile name");

            if (errors.length > 0) {
                return errors;
            }
        },
        urlRoot    : function () {
            return "/Profiles";
        }
    });
    return ProfilesModel;
});