define([
        "text!templates/PayrollPayments/CreateTemplate.html"
    ],
    function (CreateTemplate) {
        "use strict";

        var CreateView = Backbone.View.extend({
            el      : '#content-holder',
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.render(options);
            },

            events: {},

            pay: function () {

            },

            removeDialog: function(){
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            render: function (options) {
                var formString = this.template(options);
                var self = this;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-dialog",
                    title        : "Create Quotation",
                    width        : "900px",
                    buttons      : [
                        {
                            id   : "payButton",
                            text: "Pay",
                            click: function () {
                                self.pay();
                            }
                        },

                        {
                            text : "Cancel",
                            click: function () {
                                self.removeDialog();
                            }
                        }]

                });

                this.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
