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
    'helpers'
], function (Backbone, $, _, CreateTemplate, Model, common, populate, ParentView, CONSTANTS, helpers) {
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
            var amount = parseFloat(this.$el.find('#amount').val()) * 100;
            var date = this.$el.find('#date').val();
            var currency = this.$el.find('#currency').text();
            var currencyTo;

            var debitAcc = _.find(this.responseObj['#debitAccount'], function (el) {
                return debitAccount === el._id;
            });

            var creditAcc = _.find(this.responseObj['#creditAccount'], function (el) {
                return creditAccount === el._id;
            });

            currencyTo = creditAcc.currency;

            data = {
                debitAccount : debitAcc.chartAccount ? debitAcc.chartAccount._id : null,
                creditAccount: creditAcc.chartAccount ? creditAcc.chartAccount._id : null,
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

        chooseOption: function (e) {
            var target = $(e.target);
            var targetElement = target.closest('a');
            var attr = targetElement.attr('id');
            var targetId = target.attr('id');
            var debitAcc;
            var currency;

            if (attr === 'debitAccount') {
                debitAcc = _.find(this.responseObj['#debitAccount'], function (el) {
                    return targetId === el._id;
                });

                currency = debitAcc.currency || 'USD';

                this.$el.find('#currency').text(currency);

            }

            $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

        },

        render: function () {
            var formString = this.template();
            var self = this;

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                dialogClass  : 'edit-dialog',
                width        : 600,
                title        : 'Create Cash Transfer',
                buttons      : {
                    save: {
                        text : 'Create',
                        class: 'btn',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }
                }
            });

            this.delegateEvents(this.events);

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : new Date(),
                onSelect   : function () {
                    // set date to model
                }
            }).datepicker('setDate', new Date());

            populate.get('#debitAccount', CONSTANTS.URLS.PAYMENT_METHOD_DD, {}, 'name', this);
            populate.get('#creditAccount', CONSTANTS.URLS.PAYMENT_METHOD_DD, {}, 'name', this);

            return this;
        }
    });
    return CreateView;
});
