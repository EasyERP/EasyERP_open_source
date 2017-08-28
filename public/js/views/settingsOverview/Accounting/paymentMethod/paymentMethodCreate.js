define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/paymentMethod/CreatePaymentMethods.html',
    'text!templates/settingsOverview/Accounting/paymentMethod/paymentMethodEl.html',
    'models/paymentMethod',
    'populate',
    'constants'
], function (Backbone, $, _, Parent, template, tableEL, Model, populate, CONSTANTS) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'paymentMethod',
        initialize : function (options) {

            _.bindAll(this, 'render', 'saveItem');

            if (options.channel) {
                this.eventsChannel = options.channel;
            }

            if (options.model) {
                this.modelData = options.model.value;
            }

            this.currentModel = new Model();
            this.collection = options.collection;
            this.responseObj = {};

            this.render(options);
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $(e.target).attr('id'));

            this.hideNewSelect();
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var name = thisEl.find('#paymentMethodName').val();
            var account = thisEl.find('#account').val();
            var address = thisEl.find('#address').val();
            var swiftCode = thisEl.find('#swiftCode').val();
            var owner = thisEl.find('#owner').val();
            var chartAccount = thisEl.find('#chartAccount').attr('data-id');
            var currency = $.trim(thisEl.find('#currency').text());
            var bank = thisEl.find('#bankName').val();

            var data = {
                currency    : currency,
                name        : name,
                account     : account,
                chartAccount: chartAccount,
                bank        : bank,
                address     : address,
                swiftCode   : swiftCode,
                owner       : owner
            };

            if (self.eventsChannel) {
                data.fixOrders = true;
            }

            this.currentModel.save(data, {
                wait   : true,
                success: function (res, model) {
                    self.hideDialog();

                    if (self.eventsChannel) {
                        return self.eventsChannel.trigger('createdPaymentMethod', model);
                    }

                    $('#paymentMethodsTable').prepend(_.template(tableEL, {elem: model}));

                    if (self.collection) {
                        self.collection.add(res);
                    }
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

            if (this.modelData) {
                this.currentModel.set(this.modelData);
            }

            formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Bank Account',
                width      : '800px',
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
                }
                ]
            });

            populate.get('#currency', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);
            populate.get('#chartAccount', '/ChartOfAccount/getForDd', {category: 'ACCOUNTS_BANK_AND_CASH'}, 'name', this, true);

            App.stopPreload();

            return this;
        }
    });

    return EditView;
});
