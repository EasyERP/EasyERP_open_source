define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/refund/CreateTemplate.html',
    'models/PaymentModel',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'populate',
    'constants'
], function (Backbone, $, _, Parent, CreateTemplate, PaymentModel, keyValidator, helpers, dataService, populate, CONSTANTS) {
    var CreateView = Parent.extend({
        el         : '#content-holder',
        contentType: 'Payment',
        template   : _.template(CreateTemplate),

        initialize: function (options) {
            var self = this;

            this.model = options.model;
            this.payment = options.payment;
            this.mid = options.mid;
            this.responseObj = {};

            this.dontRedirect = options.dontRedirect;

            this.newModel = new PaymentModel();

            dataService.getData('/paymentMethod', {}, function (response) {
                self.responseObj['#paymentMethod'] = response.data;

                if (self.payment) {
                    dataService.getData('/payments/refundAmount', {id: self.model.id}, function (response) {

                        self.maxValue = response ? response.refundAmount : 0;

                        if (parseFloat(self.model.get('paidAmount')) === response.refundAmount) {
                            self.maxValue = response.refundAmount;
                        }

                        if (response.refundAmount > parseFloat(self.model.get('paidAmount'))) {
                            self.maxValue = parseFloat(self.model.get('paidAmount'));
                        }

                        if (self.maxValue < 0) {
                            self.maxValue = 0;
                        }

                        self.dontCheck = true;

                        self.render();
                    });
                } else {
                    self.render();
                }
            });
        },

        events: {
            'keypress:not(#selectInput)': 'keypressHandler',
            'keyup #amount'             : 'changePaidAmount'
        },

        changePaidAmount: function (e) {
            var $target = $(e.target);
            var value = $.trim($target.val());
            var maxValue = parseFloat(this.maxValue);

            value = parseFloat(value);

            if (value < 0) {
                value = Math.abs(value);
                $target.val(helpers.currencySplitter(value.toFixed(2)));
            }

            if (value > maxValue) {
                $target.val(helpers.currencySplitter(maxValue.toFixed(2)));
            }
        },

        chooseOption: function (e) {
            var self = this;
            var target = $(e.target);
            var targetElement = target.closest('a');
            var attr = targetElement.attr('id');
            var newCurrency = target.attr('id');
            var newCurrencyClass = helpers.currencyClass(newCurrency);
            var paymentMethods;
            var el;

            var array = this.$el.find('#amountDd');
            array.attr('class', newCurrencyClass);

            if (attr === 'paymentMethod') {

                paymentMethods = self.responseObj['#paymentMethod'];

                el = _.find(paymentMethods, function (item) {
                    return item._id === newCurrency;
                });

                if (el && el.chartAccount && el.chartAccount._id) {
                    (self.$el.find('#account').text(el.chartAccount.name)).attr('data-id', el.chartAccount._id);
                    self.$el.find('#account').removeClass('errorContent');
                } else {
                    (this.$el.find('#account').text('None')).attr('data-id', null);
                    self.$el.find('#account').addClass('errorContent');
                }

                $(e.target).closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            } else {
                $(e.target).closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            }
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        saveItem: function () {
            var self = this;
            var data;
            var mid = self.mid || 128;
            var thisEl = this.$el;
            var model = this.model.toJSON();
            var supplier = thisEl.find('#supplierDd');
            var supplierId = supplier.attr('data-id');
            var paidAmount = helpers.spaceReplacer(thisEl.find('#amount').val()) || helpers.spaceReplacer(thisEl.find('#amount').val()) || 0;
            var paymentMethod = thisEl.find('#paymentMethod');
            var paymentMethodID = paymentMethod.attr('data-id');
            var date = thisEl.find('#paymentDate').val();
            var paymentRef = thisEl.find('#paymentRef').val();
            var period = thisEl.find('#period').attr('data-id');
            var account = thisEl.find('#account').attr('data-id');
            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };

            paidAmount = parseFloat(paidAmount);

            if (isNaN(paidAmount) || paidAmount <= 0) {
                return App.render({
                    type   : 'error',
                    message: 'Please, enter Amount!'
                });
            }

            if (!paymentMethodID) {
                return App.render({
                    type   : 'error',
                    message: "Bank Account can't be empty."
                });
            }

            if (!account) {
                return App.render({
                    type   : 'error',
                    message: "Account can't be empty."
                });
            }

            data = {
                forSale         : model.forSales || model.forSale || false,
                refund          : true,
                supplier        : supplierId,
                paymentMethod   : paymentMethodID,
                date            : helpers.setTimeToDate(date),
                period          : period,
                paymentRef      : paymentRef,
                paidAmount      : paidAmount,
                differenceAmount: 0,
                currency        : currency,
                bankAccount     : account
            };

            if (model.orderDate) {
                data.order = model._id;

                if (model.forSales) {
                    mid = 123;
                } else {
                    mid = 129;
                }
            } else if (model.invoiceDate) {
                data.invoice = model._id;

                if (model.forSales) {
                    mid = 128;
                } else {
                    mid = 130;
                }
            } else if (model.order) {
                data.order = model.order;
                data.refundId = model._id;
                data.checkSource = true;

                if (model.forSale) {
                    mid = 123;
                } else {
                    mid = 129;
                }

            } else if (model.invoice) {
                data.invoice = model.invoice;
                data.refundId = model._id;
                data.checkSource = true;

                if (model.forSale) {
                    mid = 128;
                } else {
                    mid = 130;
                }
            }

            data.mid = mid;

            if (supplier) {
                this.newModel.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        var redirectUrl;

                        redirectUrl = model.forSales || model.forSale ? 'easyErp/customerPayments/list' : 'easyErp/purchasePayments/list';

                        self.hideDialog();

                        if (self.dontRedirect) {
                            redirectUrl = window.location.hash;
                        }

                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });

            } else {
                App.render({
                    type   : 'error',
                    message: CONSTANTS.RESPONSES.CREATE_QUOTATION
                });
            }
        },

        render: function () {
            var self = this;
            var model = this.model.toJSON();
            var paymentMethod = model.paymentMethod || {};
            var accountMethod = _.find(this.responseObj['#paymentMethod'], function (el) {
                return el._id === paymentMethod._id;
            });
            var htmBody;

            if (this.maxValue && this.maxValue < 0) {
                this.maxValue = 0;
                this.dontCheck = true;
            }

            if (!this.maxValue && !this.dontCheck) {
                if (model.invoiceDate) {
                    this.maxValue = model.paymentInfo.total - model.paymentInfo.balance;
                    this.date = model.prepayment.date;
                } else if (model.orderDate) {
                    this.maxValue = model.prepayment.sum / 100;
                    this.date = model.prepayment.date;
                } else if (model.date) {
                    this.maxValue = model.paidAmount;

                    if (model.invoice && model.invoice.invoiceDate) {
                        this.date = model.invoice.invoiceDate;
                    } else {
                        this.date = model.order.orderDate;
                    }
                }
            }

            if (this.maxValue === 0) {
                return App.render({
                    type   : 'error',
                    message: 'This Payment was already refunded!'
                });
            }

            htmBody = this.template({
                model           : model,
                payment         : true,
                amount          : this.maxValue,
                account         : accountMethod && accountMethod.chartAccount ? accountMethod.chartAccount : {},
                currencyClass   : helpers.currencyClass,
                currencySplitter: helpers.currencySplitter
            });

            this.$el = $(htmBody).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                dialogClass  : 'edit-dialog',
                width        : 450,
                title        : 'Create Refund',
                buttons      : [{
                    id   : 'create-payment-dialog',
                    class: 'btn blue',
                    text : 'Create',
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

            dataService.getData('/chartOfAccount/getForDd', {}, function (response) {
                self.responseObj['#accountDd'] = response.data;
            });
            this.$el.find('#paymentDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : 0,
                onSelect   : function () {
                }
            }).datepicker('setDate', new Date())
                .datepicker('option', 'minDate', new Date(this.date));

            this.delegateEvents(this.events);
            return this;
        }
    });

    return CreateView;
});
