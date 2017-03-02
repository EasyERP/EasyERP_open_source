define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Payment/temps/documentTemp.html',
    'views/refund/CreateView',
    'helpers'
], function (Backbone, $, _, EditTemplate, CreateRefundView, helpers) {
    'use strict';

    var EditView = Backbone.View.extend({
        contentType: 'customerPayment',
        template   : _.template(EditTemplate),

        events: {
            'click .refund': 'refund'
        },

        initialize: function (options) {
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/customerPayments';

            this.render();
        },

        refund: function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.hideDialog();

            return new CreateRefundView({model: this.currentModel, payment: true});
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
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass,
                addressMaker    : helpers.addressMaker
            });

            buttons = [
                {
                    text : 'Close',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }
            ];

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-payment-dialog',
                title      : 'Edit Payment',
                width      : self.isWtrack ? '1200' : '800',
                position   : {within: $('#wrapper')},
                buttons    : buttons

            });
            return this;
        }

    });

    return EditView;
});
