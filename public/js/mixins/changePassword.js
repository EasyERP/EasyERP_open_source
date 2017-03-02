define([
    'jQuery',
    'Underscore',
    'constants',
    'dataService'
], function ($, _, CONSTANTS, dataService) {
    return function (View) {
        var Mixin = {
            hideChangePassDialog: function () {
                $('.change-password-dialog').remove();

                return this.revertThisEl();
            },

            revertThisEl: function () {
                this.$el = this.$prevThisEl;
            },

            changePassword: function (e) {
                var formString = this.changePassTempl();
                var self = this;

                e.preventDefault();

                this.$prevThisEl = this.$el;

                this.$el = $(formString).dialog({
                    dialogClass: 'change-password-dialog',
                    width      : '500px',
                    title      : 'Change Password',
                    autoOpen   : true,
                    resizable  : true,
                    buttons    : {
                        save: {
                            text : 'Save',
                            class: 'btn',
                            click: function () {
                                self._changePassword(self);
                            }
                        },

                        cancel: {
                            text : 'Cancel',
                            class: 'btn',
                            click: function () {
                                self.hideChangePassDialog();
                            }
                        }
                    }
                });
            },

            updateUserInfo: function (options) {
                var currentUser = App.currentUser;
                var self = this;

                if (!currentUser) {
                    dataService.getData(CONSTANTS.URLS.CURRENT_USER, null, function (response) {
                        var user = response && response.user;

                        self.saveUserModel(user, options);
                    });
                } else {
                    this.saveUserModel(currentUser, options);
                }
            },

            saveUserModel: function (currentUser, data) {
                var mid = 39;
                var self = this;
                var confirmPass = data.confirmPass;
                var user = new this.UsersModel(currentUser);

                delete data.confirmPass;

                user.urlRoot = CONSTANTS.URLS.CURRENT_USER;

                user.save(data, {
                    headers: {
                        mid: mid
                    },

                    wait       : true,
                    patch      : true,
                    editMode   : false,
                    confirmPass: confirmPass,

                    success: function () {
                        self.hideChangePassDialog();
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            },



            _changePassword: function () {
                var $thisEl = this.$el;
                var oldpass = $.trim($thisEl.find('#old_password').val());
                var pass = $.trim($thisEl.find('#new_password').val());
                var confirmPass = $.trim($thisEl.find('#confirm_new_password').val());

                return this.updateUserInfo({oldpass: oldpass, pass: pass, confirmPass: confirmPass});
            }
        };

        _.extend(View.prototype, Mixin);

        return View;
    };
});
