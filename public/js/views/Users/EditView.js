define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Users/EditTemplate.html',
    'text!templates/myProfile/ChangePassword.html',
    'models/UsersModel',
    'common',
    'populate',
    'Validation',
    'constants',
    'mixins/changePassword',
    'views/selectView/selectView',
    'helpers/ga'
], function (Backbone, _, $, EditTemplate, ChangePassTempl, UsersModel, common, populate, Validation, CONSTANTS, changePasswordMixIn, SelectView, ga) {
    var EditView = Backbone.View.extend({
        el             : '#content-holder',
        contentType    : 'Users',
        imageSrc       : '',
        UsersModel     : UsersModel,
        template       : _.template(EditTemplate),
        changePassTempl: _.template(ChangePassTempl),

        initialize: function (options) {
            _.bindAll(this, 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/users';
            this.responseObj = {};
            this.isForProfile = App.currentUser && App.currentUser._id === this.currentModel.id;
            this.render();
        },

        events: {
            'mouseenter .avatar'                                              : 'showEdit',
            'mouseleave .avatar'                                              : 'hideEdit',
            'click .current-selected'                                         : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)'               : 'chooseOption',
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            click                                                             : 'hideNewSelect',
            'keypress #login'                                                 : 'checkLoginInputKey',
            'click #changePassword'                                           : 'changePassword'
        },

        notHide: function () {
            return false;
        },

        showNewSelect: function (e) {
            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            this.$el.find('.newSelectList').hide();
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },
        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },

        hideNewSelect: function () {
            $('.newSelectList').hide();
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        showEdit: function () {
            $('.upload').animate({
                height : '20px',
                display: 'block'
            }, 250);

        },

        hideEdit: function () {
            $('.upload').animate({
                height : '0px',
                display: 'block'
            }, 250);

        },

        checkLoginInputKey: function (e) {
            var char = String.fromCharCode(e.charCode);

            if (Validation.loginCharNotValid(char)) {
                e.preventDefault();
            }
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var mid = 39;
            var jsonModel = this.currentModel.toJSON();
            var email = $thisEl.find('#email').val();
            var login = $thisEl.find('#login').val();
            var profileId = $thisEl.find('#profilesDd').data('id');

            var data = Object.create(null);

            if (this.imageSrc !== jsonModel.imageSrc) {
                data.imageSrc = this.imageSrc;
            }

            if (email !== jsonModel.email) {
                data.email = email;
            }

            if (login !== jsonModel.login) {
                data.login = login;
            }

            if (profileId !== jsonModel.profile._id) {
                data.profile = profileId;
            }

            if (Object.keys(data).length === 0) {
                self.hideDialog();
            }

            this.currentModel.save(data, {
                headers: {
                    mid: mid
                },

                patch  : true,
                wait   : true,
                success: function (model, response) {
                    self.hideDialog();
                    if (response && response.logout) {
                        window.location.pathname = '/logout';
                    } else {
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    }
                },

                error: function (model, xhr) {
                    self.hideDialog();
                    self.render();
                    self.errorNotification(xhr);
                },

                editMode: true
            });

        },

        deleteItem: function (event) {
            var mid = 39;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer === true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        $('.edit-dialog').remove();
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        render: function () {
            var model = this.currentModel.toJSON();
            var currentUser = App.currentUser;
            var timezoneOffset = (new Date()).getTimezoneOffset();
            var timezone;
            var self = this;
            var dialogOptions = {
                dialogClass: 'edit-dialog',
                width      : 600,
                title      : 'Edit User',
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            ga && ga.trackingEditConfirm();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                            ga && ga.trackingEditCancel();
                        }
                    }
                }
            };
            var formString;

            if (timezoneOffset < 0) {
                timezone = ('UTC +' + (timezoneOffset / 60) * (-1));
            } else {
                timezone = ('UTC -' + (timezoneOffset / 60) * (-1));
            }

            model.isForProfile = this.isForProfile;
            model.timezone = timezone;

            formString = this.template(model);

            if (!currentUser || currentUser._id !== model._id) {
                dialogOptions.buttons.delete = {
                    text : 'Delete',
                    class: 'btn',
                    click: self.deleteItem
                };
            }

            this.$el = $(formString).dialog(dialogOptions);

            populate.get('#profilesDd', CONSTANTS.URLS.PROFILES_FOR_DD, {}, 'profileName', this);
            common.canvasDraw({model: this.model.toJSON()}, this);

            return this;
        }

    });

    EditView = changePasswordMixIn(EditView);

    return EditView;
});
