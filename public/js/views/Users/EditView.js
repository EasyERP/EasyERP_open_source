define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Users/EditTemplate.html',
    'common',
    'populate',
    'Validation',
    'constants'
], function (Backbone, _, $, EditTemplate, common, populate, Validation, CONSTANTS) {
    var EditView = Backbone.View.extend({
        el         : "#content-holder",
        contentType: "Users",
        imageSrc   : '',
        template   : _.template(EditTemplate),

        initialize   : function (options) {
            _.bindAll(this, "saveItem");
            _.bindAll(this, "render", "deleteItem");
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = "/users";
            this.responseObj = {};
            this.render();
        },

        events       : {
            "mouseenter .avatar"                                              : "showEdit",
            "mouseleave .avatar"                                              : "hideEdit",
            "click .current-selected"                                         : "showNewSelect",
            "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
            "click .newSelectList li.miniStylePagination"                     : "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click"                                                           : "hideNewSelect",
            "keypress #login"                                                 : "checkLoginInputKey"
        },

        notHide      : function () {
            return false;
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);
            return false;
        },

        chooseOption : function (e) {
            $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            $(".newSelectList").hide();
        },

        nextSelect   : function (e) {
            this.showNewSelect(e, false, true);
        },
        prevSelect   : function (e) {
            this.showNewSelect(e, true, false);
        },

        hideNewSelect: function () {
            $(".newSelectList").hide();
        },

        hideDialog   : function () {
            $(".edit-dialog").remove();
            $(".crop-images-dialog").remove();
        },

        showEdit     : function () {
            $(".upload").animate({
                height : "20px",
                display: "block"
            }, 250);

        },

        hideEdit     : function () {
            $(".upload").animate({
                height : "0px",
                display: "block"
            }, 250);

        },

        checkLoginInputKey: function (e) {
            var char = String.fromCharCode(e.charCode);

            if (Validation.loginCharNotValid(char)) {
                e.preventDefault();
            }
        },

        saveItem  : function () {
            var self = this;
            var $thisEl = this.$el;
            var mid = 39;
            var jsonModel = this.currentModel.toJSON();
            var email = $thisEl.find('#email').val();
            var login = $thisEl.find('#login').val();
            var profileId = $thisEl.find('#profilesDd').data("id");

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
                headers : {
                    mid: mid
                },
                patch   : true,
                wait    : true,
                success : function (model, response) {
                    self.hideDialog();
                    if (response && response.logout) {
                        window.location.pathname = '/logout';
                    } else {
                        Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                    }
                },
                error   : function (model, xhr) {
                    self.hideDialog();
                    self.render();
                    self.errorNotification(xhr);
                },
                editMode: true
            });

        },
        deleteItem: function (event) {
            var mid = 39;
            event.preventDefault();
            var self = this;
            var answer = confirm("Really DELETE items ?!");
            if (answer === true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        $('.edit-dialog').remove();
                        Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        render: function () {
            var formString = this.template(this.currentModel.toJSON());
            var self = this;
            this.$el = $(formString).dialog({
                dialogClass: "edit-dialog",
                width      : 600,
                title      : "Edit User",
                buttons    : {
                    save  : {
                        text : "Save",
                        class: "btn",
                        click: self.saveItem
                    },
                    cancel: {
                        text : "Cancel",
                        class: "btn",
                        click: function () {
                            self.hideDialog();
                        }
                    },
                    delete: {
                        text : "Delete",
                        class: "btn",
                        click: self.deleteItem
                    }
                }
            });
            populate.get("#profilesDd", CONSTANTS.URLS.PROFILES_FOR_DD, {}, "profileName", this);
            common.canvasDraw({model: this.model.toJSON()}, this);
            return this;
        }

    });

    return EditView;
});
