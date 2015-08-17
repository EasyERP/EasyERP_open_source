define([
    "text!templates/Users/EditTemplate.html",
    "common",
    "populate"
],
    function (EditTemplate, common, populate) {
        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Users",
            imageSrc: '',
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/Users";
                this.responseObj = {};
                this.render();
            },
            events: {
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click": "hideNewSelect"
            },
            notHide: function () {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
            },
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".crop-images-dialog").remove();
            },
            showEdit: function () {
                $(".upload").animate({
                    height: "20px",
                    display: "block"
                }, 250);

            },
            hideEdit: function () {
                $(".upload").animate({
                    height: "0px",
                    display: "block"
                }, 250);

            },

            saveItem: function () {
                var self = this;

                var mid = 39;
                var data = {
                    imageSrc: this.imageSrc,
                    email: $('#email').val(),
                    login: $('#login').val(),
                    profile: $('#profilesDd').data("id")
                };
                this.currentModel.set(data);
                this.currentModel.save(this.currentModel.changed, {
                    headers: {
                        mid: mid
                    },
                    patch: true,
                    success: function (model, response) {
                        self.hideDialog();
                        if (response && response.logout) {
                            window.location.pathname = '/logout';
                        } else {
                            Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                        }
                    },
                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    },
                    editMode: true
                });


            },
            deleteItem: function (event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) {
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            $('.edit-dialog').remove();
                            Backbone.history.navigate("easyErp/" + self.contentType, { trigger: true });
                        },
                        error: function (model, xhr) {
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
                    width: 600,
                    title: "Edit User",
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                self.hideDialog();
                            }
                        },
                        delete: {
                            text: "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
                populate.get("#profilesDd", "ProfilesForDd", {}, "profileName", this);
                common.canvasDraw({ model: this.model.toJSON() }, this);
                return this;
            }

        });

        return EditView;
    });
