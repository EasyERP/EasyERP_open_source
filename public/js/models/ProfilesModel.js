define(['Validation'], function (Validation) {
    var ProfilesModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {
            this.on('invalid', function (model, errors) {
                if (errors.length > 0) {
                    var msg = errors.join('\n');
                    alert(msg);
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