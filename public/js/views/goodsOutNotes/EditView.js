define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/goodsOutNotes/EditTemplate.html',
    'helpers'
], function (Backbone, $, _, EditTemplate, helpers) {
    'use strict';

    var EditView = Backbone.View.extend({
        contentType: 'goodsOutNotes',
        template   : _.template(EditTemplate),

        events: {},

        initialize: function (options) {
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/customerPayments';

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
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
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
                width      : self.isWtrack ? '1200' : '900',
                position   : {my: 'center bottom', at: 'center', of: window},
                buttons    : buttons

            });
            return this;
        }

    });

    return EditView;
});
