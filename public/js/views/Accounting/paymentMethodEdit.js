define([
    'Backbone',
    'jQuery',
    'Underscore',
    "text!templates/Accounting/EditPaymentMethods.html",
    'views/selectView/selectView',
    'populate'
], function (Backbone, $, _, EditTemplate, SelectView, populate) {
    'use strict';

    var EditView = Backbone.View.extend({
        template   : _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, "render", "saveItem");
            _.bindAll(this, "render", "deleteItem");

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }
            this.currentModel.urlRoot = "/paymentMethod";

            this.responseObj = {};

            this.render(options);
        },

        events: {
            "click .current-selected:not(.jobs)"               : "showNewSelect",
            "click"                                            : "hideNewSelect",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption"
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

        hideNewSelect: function () {
            $(".newSelectList").hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        chooseOption: function (e) {
            $(e.target).parents("dd").find(".current-selected").text($(e.target).text());

            this.hideNewSelect();
        },

        saveItem: function (proformaCb /*orderCb*/) {
            var self = this;
            var thisEl = this.$el;

            var name = thisEl.find('#paymentMethodName').val();
            var account = thisEl.find('#account').val();
            var currency = $.trim(thisEl.find('#currency').text())
            var bank = thisEl.find('#bankName').val();


            var data = {
                currency         : currency,
                name             : name,
                account          : account,
                bank             : bank
            };

            this.currentModel.save(data, {
                wait   : true,
                success: function (res) {
                    var url = window.location.hash;

                    if (url === '#easyErp/Accounts') {
                        self.hideDialog();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});
                    } else {
                        self.hideDialog();
                    }
                },
                error  : function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
            $(".crop-images-dialog").remove();
        },

        deleteItem: function (event) {
            var self = this;
            var mid = this.forSales ? 62 : 55;
            var url;
            var answer = confirm("Really DELETE items ?!");

            event.preventDefault();

            if (answer === true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function (model) {
                        $('a[data-id="' + model.id + '"]').remove();
                        self.hideDialog();
                    },
                    error  : function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: "You do not have permission to perform this action"
                            });
                        }
                    }
                });
            }

        },

        render: function () {
            var self = this;
            var formString = this.template({
                model        : this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : "edit-dialog",
                title        : "Edit Bank Account",
                width        : "500px",
                buttons      : [
                    {
                        text : "Save",
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : "Cancel",
                        click: function () {
                            self.hideDialog();
                        }
                    },
                    {
                        text : "Delete",
                        click: self.deleteItem
                    }
                ]

            });

            populate.get("#currency", "/currency/getForDd", {}, 'name', this, true);

            App.stopPreload();

            return this;
        }
    });

    return EditView;
});
