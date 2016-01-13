define(['Validation'], function (Validation) {
    var UserModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults   : {
            imageSrc       : "",
            login          : "",
            email          : "",
            profile        : null,
            relatedEmployee: null,
            savedFilters   : []
        },
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
        validate   : function (attrs, options) {
            var errors = [];
            if (options.editMode == false) {
                Validation.checkLoginField(errors, true, attrs.login, "Login");
                Validation.checkEmailField(errors, false, attrs.email, "Email");
                Validation.checkPasswordField(errors, true, attrs.pass, "Password");
                Validation.checkPasswordField(errors, true, options.confirmPass, "Confirm password");
                Validation.checkPasswordField(errors, true, attrs.oldpass, "Old password");
                Validation.comparePasswords(errors, attrs.pass, options.confirmPass);
            }
            else if (options.editMode == true) {
                Validation.checkLoginField(errors, true, attrs.login, "Login");
                Validation.checkEmailField(errors, false, attrs.email, "Email");
            }
            else {
                Validation.checkLoginField(errors, true, attrs.login, "Login");
                Validation.checkEmailField(errors, false, attrs.email, "Email");
                Validation.checkPasswordField(errors, true, attrs.pass, "Password");
                Validation.checkPasswordField(errors, true, options.confirmPass, "Confirm password");
                Validation.comparePasswords(errors, attrs.pass, options.confirmPass);
            }

            if (errors.length > 0) {
                return errors;
            }
        },
        urlRoot    : function () {
            return "/Users";
        }
    });
    return UserModel;
});