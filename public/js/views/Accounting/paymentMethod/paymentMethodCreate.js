define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/CreatePaymentMethods.html',
    'text!templates/Accounting/paymentMethodEl.html',
    'views/selectView/selectView',
    'models/paymentMethod',
    'populate',
    'constants'
], function (Backbone, $, _, template, tableEL, SelectView, Model, populate, CONSTANTS) {
    'use strict';

    var EditView = Backbone.View.extend({
        template  : _.template(template),
        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();
            this.collection = options.collection;
            this.responseObj = {};
            this.render(options);
        },

        events: {
            'click .current-selected:not(.jobs)'               : 'showNewSelect',
            click                                              : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
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
            $('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            $target.parents('.account-wrapper').find('.current-selected').text($target.text()).attr('data-id', $(e.target).attr('id'));

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
                    self.hideDialog();
                    $('#paymentMethodsTable').prepend(_.template(tableEL, {elem: model}));
                    self.collection.add(res);
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
                title      : 'Create Bank Account',
                width      : '800px',
                buttons    : [
                    {
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
            populate.get('#chartAccount', '/ChartOfAccount/getForDd', {}, 'name', this, true);

            App.stopPreload();

            return this;
        }
    });

    return EditView;
});
