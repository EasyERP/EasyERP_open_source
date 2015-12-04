/**
 * Created by lilya on 30/11/15.
 */
define([
        "text!templates/Payment/EditTemplate.html",
        "helpers"
    ],
    function (EditTemplate, helpers) {
        "use strict";

        var EditView = Backbone.View.extend({
            contentType: "customerPayment",
            template   : _.template(EditTemplate),

            events: {

            },

            initialize: function (options) {
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/customerPayments";

                this.render();
            },

            hideDialog: function () {
                $('.edit-payment-dialog').remove();
            },

            render: function () {
                var self = this;
                var formString;
                var buttons;
                var model = this.currentModel.toJSON();

                formString = this.template({
                    model           : model,
                    currencySplitter: helpers.currencySplitter
                });

                buttons = [
                    {
                        text : "Close" ,
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ];

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-payment-dialog",
                    title        : "Edit Payment",
                    width        : self.isWtrack ? '1200' : '900',
                    position     : {my: "center bottom", at: "center", of: window},
                    buttons      : buttons

                });
                return this;
            }


        });

        return EditView;
    });
