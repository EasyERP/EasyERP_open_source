define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Payment/CreateTemplate.html',
    'collections/Persons/PersonsCollection',
    'collections/Departments/DepartmentsCollection',
    'collections/salesInvoices/filterCollection',
    'collections/customerPayments/filterCollection',
    'views/Projects/projectInfo/payments/paymentView',
    'models/PaymentModel',
    'common',
    'populate',
    'dataService',
    'constants',
    'helpers/keyValidator',
    'helpers',
    'views/guideTours/guideNotificationView'
], function (Backbone,
             $,
             _,
             Parent,
             CreateTemplate,
             PersonCollection,
             DepartmentCollection,
             invoiceCollection,
             paymentCollection,
             PaymentView,
             PaymentModel,
             common,
             populate,
             dataService,
             CONSTANTS,
             keyValidator,
             helpers,
             GuideNotify) {
    var CreateView = Parent.extend({
        el         : '#paymentHolder',
        contentType: 'Payment',
        template   : _.template(CreateTemplate),

        initialize: function (options) {

            this.eventChannel = options.eventChannel;

            if (options) {
                this.invoiceModel = options.model;
                this.totalAmount = this.invoiceModel.get('paymentInfo').balance || this.invoiceModel.get('paymentInfo').total || 0;
                this.forSales = this.invoiceModel.get('forSales');
                this.mid = options.mid || 56;
            } else {
                this.forSales = true;
            }
            this.responseObj = {};
            this.model = new PaymentModel();
            this.differenceAmount = 0;

            this.redirect = options.redirect;
            this.collection = options.collection;
            this.title = options.title;
            this.prepayment = options.prepayment;
            this.paymentsSum = options.paymentsSum || 0;

            this.currency = options.currency || {};
            this.changePaidAmount = _.debounce(this.changePaidAmount, 500);

            this.render();
            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },

        events: {
            'keypress:not(#selectInput)': 'keypressHandler',
            'keyup #paidAmount'         : 'changePaidAmount',
            'keyup #prepaidAmount'      : 'changePrepaidAmount',
            'keyup #bankExpenses'       : 'changeBankExpensesAmount'
        },

        changePrepaidAmount: function () {
            var self = this;
            var targetEl = $('#prepaidAmount');
            var changedValue = $.trim(targetEl.val());
            var currency = $.trim(this.$el.find('#currencyDd').text());
            var overPaymentContainer = this.$el.find('#overPayment');
            var bankExpensesInput = this.$el.find('#bankExpenses');
            var overPaymentDiffInput = overPaymentContainer.find('#overPaymentDiff');
            var totalAmount = parseFloat(this.invoiceModel.get('paymentInfo').total) - this.paymentsSum;
            var date = $('#paymentDate').val();
            var data = {};
            var bankExpenses;

            changedValue = parseFloat(helpers.spaceReplacer(changedValue)) || 0;
            bankExpenses = parseFloat(helpers.spaceReplacer(bankExpensesInput.val())) || 0;

            data.totalAmount = totalAmount;
            data.paymentAmount = changedValue;
            data.invoiceCurrency = this.currency.name;
            data.paymentCurrency = currency;
            data.date = date;

            if (!changedValue || changedValue === totalAmount) {
                if (!overPaymentContainer.hasClass('hidden')) {
                    overPaymentContainer.addClass('hidden');
                }

                this.bankExpenses = 0;

                return bankExpensesInput.val('');
            }

            this.bankExpenses = this.bankExpenses || 0;

            if (changedValue + this.bankExpenses >= totalAmount) {
                dataService.getData(CONSTANTS.URLS.PAYMENT_AMOUNT_LEFT, data,
                    function (res, self) {
                        if (res.difference) {
                            res.difference *= -1;
                            overPaymentDiffInput.val(res.difference.toFixed(2));
                            self.differenceAmount = res.difference;

                            self.overPayment = res.difference;

                            if (changedValue > totalAmount) {
                                targetEl.val(helpers.currencySplitter((totalAmount - bankExpenses).toFixed(2)));
                            }

                            return overPaymentContainer.removeClass('hidden');
                        }

                        if (!overPaymentContainer.hasClass('hidden')) {
                            return overPaymentContainer.addClass('hidden');
                        }
                    }, self);
            }

            App.stopPreload();
        },

        changeBankExpensesAmount: function () {
            var targetEl = $('#bankExpenses');
            var changedValue = $.trim(targetEl.val());
            var prepaidAmountInput = this.$el.find('#prepaidAmount');
            var prepaidAmount;

            changedValue = parseFloat(helpers.spaceReplacer(changedValue)) || 0;

            /*if (!prepaidAmountInput.length) {
             prepaidAmountInput = this.$el.find('#paidAmount');
             }*/

            /*prepaidAmount = parseFloat(helpers.spaceReplacer(prepaidAmountInput.val()));

             if (changedValue > prepaidAmount) {
             return targetEl.val(0);
             }*/

            this.bankExpenses = this.bankExpenses || 0;
            //this.overPayment = this.overPayment || 0;

            if (changedValue < 0) {
                changedValue = 0;
                targetEl.val(changedValue);
            }

            // prepaidAmountInput.val(helpers.currencySplitter(((prepaidAmount + this.bankExpenses/* + this.overPayment*/) - changedValue).toFixed(2)));

            this.bankExpenses = changedValue;

        },

        changePaidAmount: function (e) {
            var self = this;
            var targetEl = $('#paidAmount');
            var changedValue = $.trim(targetEl.val());
            var currency = $.trim(this.$el.find('#currencyDd').text());
            var differenceAmountContainer = this.$el.find('#differenceAmountContainer');
            var differenceAmount = differenceAmountContainer.find('#differenceAmount');
            var totalAmount = parseFloat(this.totalAmount) - this.paymentsSum;
            var date = $('#paymentDate').val();
            var data = {};

            changedValue = parseFloat(helpers.spaceReplacer(changedValue));

            data.totalAmount = totalAmount;
            data.paymentAmount = changedValue;
            data.invoiceCurrency = this.currency.name;
            data.paymentCurrency = currency;
            data.date = date;

            dataService.getData(CONSTANTS.URLS.PAYMENT_AMOUNT_LEFT, data,
                function (res, self) {
                    if (res.difference) {
                        differenceAmount.text(res.difference.toFixed(2));
                        self.differenceAmount = res.difference;

                        return differenceAmountContainer.removeClass('hidden');
                    }

                    if (!differenceAmountContainer.hasClass('hidden')) {
                        return differenceAmountContainer.addClass('hidden');
                    }
                }, self);

            App.stopPreload();
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

            var array = this.$el.find('#paidAmountDd');
            array.attr('class', newCurrencyClass);

            if (attr === 'paymentMethod') {

                paymentMethods = self.responseObj['#paymentMethod'];

                el = _.find(paymentMethods, function (item) {
                    return item._id === newCurrency;
                });

                if (el && el.chartAccount && el.chartAccount._id) {
                    (self.$el.find('#account').text(el.chartAccount.name)).attr('data-id', el.chartAccount._id);
                } else {
                    (this.$el.find('#account').text('None')).attr('data-id', null);
                    self.$el.find('#account').addClass('errorContent');
                }

                $(e.target).closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

                this.changePaidAmount();
            } else {
                $(e.target).closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

                this.changePaidAmount();
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
            var data = {};
            // FixMe change mid value to proper number after inserting it into DB
            var mid = self.mid || 56;
            var thisEl = this.$el;

            var invoiceModel = this.invoiceModel.toJSON();
            var supplier = thisEl.find('#supplierDd');
            var supplierId = supplier.attr('data-id');
            var paidAmount = helpers.spaceReplacer(thisEl.find('#paidAmount').val()) || helpers.spaceReplacer(thisEl.find('#prepaidAmount').val()) || 0;
            var bankExpensesAccount = thisEl.find('#bankExpensesAccountDd').attr('data-id');
            var bankExpenses = helpers.spaceReplacer(thisEl.find('#bankExpenses').val()) || 0;
            var overPaymentAccount = thisEl.find('#overPaymentAccountDd').attr('data-id');
            var overPayment = helpers.spaceReplacer(thisEl.find('#overPaymentDiff').val()) || 0;
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
            bankExpenses = parseFloat(bankExpenses);
            overPayment = parseFloat(overPayment);

            if (isNaN(paidAmount) || paidAmount + bankExpenses + overPayment <= 0) {
                return App.render({
                    type   : 'error',
                    message: 'Please, enter Paid Amount!'
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

            if (bankExpenses && !bankExpensesAccount) {
                return App.render({
                    type   : 'error',
                    message: "Bank Expenses Account can't be empty if is some Bank Expenses sum."
                });
            }

            if (overPayment && !overPaymentAccount) {
                return App.render({
                    type   : 'error',
                    message: "Over Payment Account can't be empty if is some Over Payment sum."
                });
            }

            data = {
                mid             : mid,
                forSale         : this.forSales,
                supplier        : supplierId,
                paymentMethod   : paymentMethodID,
                date            : helpers.setTimeToDate(date),
                period          : period,
                paymentRef      : paymentRef,
                paidAmount      : paidAmount,
                currency        : currency,
                differenceAmount: this.differenceAmount,
                bankAccount     : account,
                overPayment     : {
                    account: overPaymentAccount,
                    amount : overPayment
                },

                bankExpenses: {
                    account: bankExpensesAccount,
                    amount : bankExpenses
                }
            };

            if (mid === 123 || mid === 129) {
                data.order = invoiceModel._id;
            } else {
                data.invoice = invoiceModel._id;
            }

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        var redirectUrl;

                        if (mid === 97) {
                            redirectUrl = '#easyErp/ExpensesPayments/list';
                        } else if (mid === 100) {
                            redirectUrl = '#easyErp/DividendPayments/list';
                        } else if (mid === 109) {
                            redirectUrl = '#easyErp/purchasePayments/list';
                        } else if (mid === 95 || mid === 129 || mid === 130) {
                            redirectUrl = '#easyErp/purchasePayments/list';
                        } else {
                            redirectUrl = self.forSales ? 'easyErp/customerPayments' : 'easyErp/supplierPayments';
                        }

                        self.hideDialog();

                        if (self.redirect) {
                            if (self.eventChannel) {
                                self.eventChannel.trigger('newPayment');
                            }
                        } else {
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
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
            var model = this.invoiceModel.toJSON();
            var account = model.project && model.project.paymentMethod || model.paymentMethod;
            var el;
            var htmBody = this.template({
                invoice      : model,
                paymentsSum  : this.paymentsSum,
                currency     : self.currency,
                currencyClass: helpers.currencyClass,
                title        : this.title,
                prepayment   : this.prepayment
            });

            this.$el = $(htmBody).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Payment',
                buttons    : [
                    {
                        id   : 'create-payment-dialog',
                        class: 'btn blue',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },
                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]
            });

            populate.get2name('#supplierDd', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);
            populate.get('#period', '/period', {}, 'name', this, true, true);

            if (!model.paymentMethod && model.project && model.project.paymentMethod) {
                populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true, model.project.paymentMethod, null);
            } else {
                populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true,  model.paymentMethod && model.paymentMethod._id ? model.paymentMethod._id : model.paymentMethod, null, this.$el);
            }

            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);
            // populate.get('#journal', '/journals/getForDd', {}, 'name', this, true, true);

            dataService.getData('/chartOfAccount/getForDd', {category: 'ACCOUNTS_EXPENSES'}, function (response) {
                self.responseObj['#overPaymentAccountDd'] = response.data;
                self.responseObj['#bankExpensesAccountDd'] = response.data;
                self.responseObj['#accountDd'] = response.data;
            });

            this.$el.find('#paymentDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : 0,
                onSelect   : function () {
                    self.changePaidAmount();
                }
            }).datepicker('setDate', new Date())
                .datepicker('option', 'minDate', model.invoiceDate);

            this.delegateEvents(this.events);
            return this;
        }
    });

    return CreateView;
});
