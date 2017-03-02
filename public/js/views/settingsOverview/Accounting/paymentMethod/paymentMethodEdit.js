define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/paymentMethod/EditPaymentMethods.html',
    'text!templates/settingsOverview/Accounting/paymentMethod/paymentMethodEl.html',
    'populate',
    'constants'
], function (Backbone, $, _, Parent, EditTemplate, tableEL, populate, CONSTANTS) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.responseObj = {};

            this.render(options);
        },

        chooseOption: function (e) {
            $(e.target).parents('ul').closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

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

            this.currentModel.save(data, {
                wait   : true,
                success: function (res, model) {
                    var el = $('#paymentMethodsTable').find('tr[data-id="' + model._id + '"]');
                    self.hideDialog();

                    el.after(_.template(tableEL, {elem: model}));
                    el.remove();
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
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Bank Account',
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

            return this;
        }
    });

    return EditView;
});
