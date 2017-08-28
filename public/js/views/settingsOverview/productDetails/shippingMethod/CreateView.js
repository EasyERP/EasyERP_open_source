define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/shippingMethod/CreateTemplate.html',
    'models/ShippingMethodModel',
    'populate',
    'constants',
    'helpers/keyValidator',
    'helpers'
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator, helpers) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'shippingMethods',

        initialize : function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #price': 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var name = $.trim(thisEl.find('#name').val());
            var code = $.trim(thisEl.find('#code').val());
            var price = $.trim(thisEl.find('#price').val());
            var account = thisEl.find('#account').attr('data-id');

            price = parseFloat(price) * 100;

            this.currentModel.save({
                name   : name,
                account: account,
                code   : code,
                price  : price
            }, {
                wait   : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.add(model);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString;

            formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Shipping Method',
                width      : '500px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });
            populate.get('#account', '/chartOfAccount/getForDd', {category: 'ACCOUNTS_EXPENSES'}, 'name', this, true);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
