define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/cashTransfer/CreateTemplate.html',
    'models/cashTransferModel',
    'common',
    'populate',
    'views/dialogViewBase',
    'constants',
    'helpers',
    'dataService'
], function (Backbone, $, _, CreateTemplate, Model, common, populate, ParentView, CONSTANTS, helpers, dataService) {
    'use strict';
    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'cashTransfer',
        template   : _.template(CreateTemplate),
        imageSrc   : '',

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new Model();
            this.responseObj = {};

            this.render();
        },

        saveItem: function () {
            var data;
            var self = this;
            var debitAccount = this.$el.find('#debitAccount').attr('data-id');
            var creditAccount = this.$el.find('#creditAccount').attr('data-id');
            var amount = parseFloat(helpers.spaceReplacer(this.$el.find('#amount').val())) * 100;
            var date = this.$el.find('#date').val();
            var currency = this.$el.find('#currency').text();
            var currencyTo;

            var from = _.find(this.responseObj['#debitAccount'], function (el) {
                return debitAccount === el._id;
            });

            var to = _.find(this.responseObj['#creditAccount'], function (el) {
                return creditAccount === el._id;
            });

            currencyTo = to ? to.currency : null;

            if (amount > self.maxAmount) {
                return App.render({
                    type   : 'error',
                    message: 'Please, change amount less than balance.'
                });
            }

            if (!debitAccount || !creditAccount || !amount) {
                return App.render({
                    type   : 'error',
                    message: 'Fill all fields, please.'
                });
            }

            data = {
                debitAccount : to.chartAccount ? to.chartAccount._id : null,
                creditAccount: from.chartAccount ? from.chartAccount._id : null,
                amount       : amount,
                date         : helpers.setTimeToDate(date),
                currency     : currency,
                currencyTo   : currencyTo
            };

            this.model.save(data, {
                success: function () {
                    var url = window.location.hash;

                    Backbone.history.fragment = '';

                    Backbone.history.navigate(url, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        currencyClass: function (currency) {
            var currencyName;
            switch (currency) {
                case 'USD':
                    currencyName = 'dollar';
                    break;
                case 'EUR':
                    currencyName = 'euro';
                    break;
                case 'UAH':
                    currencyName = 'uah';
                    break;
                // skip default;
            }
            return currencyName;
        },

        chooseOption: function (e) {
            var self = this;
            var target = $(e.target);
            var targetElement = target.closest('a');
            var attr = targetElement.attr('id');
            var targetId = target.attr('id');
            var date = this.$el.find('#date').val();
            var debitAcc;
            var currency;

            if (attr === 'debitAccount') {
                debitAcc = _.find(this.responseObj['#debitAccount'], function (el) {
                    return targetId === el._id;
                });

                currency = debitAcc ? debitAcc.currency : 'USD';

                this.$el.find('#currency').text(currency);

                dataService.getData('/journalEntries/getBalanceForAccount', {
                    account: debitAcc.chartAccount ? debitAcc.chartAccount._id : null,
                    date   : date
                }, function (resp) {
                    self.$el.find('#amount').text(0);

                    if (resp.error) {
                        return App.render({
                            type   : 'error',
                            message: 'Some error'
                        });
                    }

                    if (!resp.maxAmount) {
                        return App.render({
                            type   : 'error',
                            message: "You don't have enough money on this account. Please change account or try another date."
                        });
                    }

                    self.$el.find('#maxAmount').text(helpers.currencySplitter((resp.maxAmount / 100).toFixed(2)));
                    self.$el.find('#maxAmount').addClass(self.currencyClass(currency));

                    self.maxAmount = resp.maxAmount;
                });

            }

            $(e.target).closest('.cashBalanceRow').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

        },

        render: function () {
            var formString = this.template();
            var self = this;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 450,
                title      : 'Create Cash Transfer',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }
                }
            });

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : new Date(),
                onSelect   : function () {
                    var debitId = self.$el.find('#debitAccount').attr('data-id');
                    var date = $(this).val();
                    var debitAcc;
                    var currency;

                    debitAcc = _.find(self.responseObj['#debitAccount'], function (el) {
                        return debitId === el._id;
                    });

                    if (debitAcc) {
                        currency = debitAcc.currency || 'USD';

                        dataService.getData('/journalEntries/getBalanceForAccount', {
                            account: debitAcc.chartAccount ? debitAcc.chartAccount._id : null,
                            date   : date
                        }, function (resp) {
                            self.$el.find('#amount').text(0);

                            if (resp.error) {
                                return App.render({
                                    type   : 'error',
                                    message: 'Some error'
                                });
                            }

                            if (!resp.maxAmount) {
                                return App.render({
                                    type   : 'error',
                                    message: "You don't have enough money on this account. Please change account or try another date."
                                });
                            }

                            self.$el.find('#maxAmount').text(helpers.currencySplitter((resp.maxAmount / 100).toFixed(2)));
                            self.$el.find('#maxAmount').addClass(self.currencyClass(currency));

                            self.maxAmount = resp.maxAmount;
                        });
                    }

                }
            }).datepicker('setDate', new Date());

            populate.get('#debitAccount', CONSTANTS.URLS.PAYMENT_METHOD_DD, {}, 'name', this);
            populate.get('#creditAccount', CONSTANTS.URLS.PAYMENT_METHOD_DD, {}, 'name', this);

            this.delegateEvents(this.events);

            return this;
        }
    });
    return CreateView;
});
