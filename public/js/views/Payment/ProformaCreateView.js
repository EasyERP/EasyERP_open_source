define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Payment/ProformaCreateTemplate.html',
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
    'helpers'
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
             helpers) {
    var CreateView = Parent.extend({
        el         : '#paymentHolder',
        contentType: 'Payment',
        template   : _.template(CreateTemplate),

        initialize: function (options) {

            this.eventChannel = options.eventChannel;

            if (options) {
                this.invoiceModel = options.model;
                this.mid = options.mid || 95;
                this.totalAmount = this.invoiceModel.get('paymentInfo').balance || 0;
                this.forSales = this.invoiceModel.get('forSales');
            } else {
                this.forSales = true;
            }
            this.responseObj = {};
            this.model = new PaymentModel();
            this.differenceAmount = 0;

            this.redirect = options.redirect;
            this.collection = options.collection;
            this.proforma = options.proforma;

            this.currency = options.currency || {};

            this.changePaidAmount = _.debounce(this.changePaidAmount, 500);

            this.render();
        },

        events: {
            keypress           : 'keypressHandler',
            'keyup #paidAmount': 'changePaidAmount'
        },

        changePaidAmount: function (e) {
            var self = this;
            var targetEl = $('#paidAmount');
            var changedValue = $.trim(targetEl.val());
            var currency = $.trim(this.$el.find('#currencyDd').text());
            var differenceAmountContainer = this.$el.find('#differenceAmountContainer');
            var differenceAmount = differenceAmountContainer.find('#differenceAmount');
            var totalAmount = parseFloat(this.totalAmount);
            var date = $('#paymentDate').val();
            var data = {};
            data.date = date;

            changedValue = parseFloat(changedValue);

            data.totalAmount = totalAmount;
            data.paymentAmount = changedValue;
            data.invoiceCurrency = this.currency.name;
            data.paymentCurrency = currency;

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
            var paymentMethods;
            var el;

            if (attr === 'paymentMethod') {

                paymentMethods = self.responseObj['#paymentMethod'];

                el = _.find(paymentMethods, function (item) {
                    return item._id === newCurrency;
                });

                if (el && el.chartAccount && el.chartAccount._id) {
                    dataService.getData('/journals/getByAccount', {
                        transaction : 'Payment',
                        debitAccount: el.chartAccount._id
                    }, function (resp) {

                        if (resp.data && resp.data.length) {
                            (self.$el.find('#journal').text(resp.data[0].name)).attr('data-id', resp.data[0]._id);
                        } else {
                            (self.$el.find('#journal').text('Select')).attr('data-id', null);
                            self.$el.find('#journal').addClass('errorContent');
                        }

                    });
                } else {
                    (self.$el.find('#journal').text('Select')).attr('data-id', null);
                }

                $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

                this.changePaidAmount();
            } else {
                $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

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
            var data;
            // FixMe change mid value to proper number after inserting it into DB
            //var mid = 95;
            var thisEl = this.$el;
            var invoiceModel = this.invoiceModel.toJSON();
            var supplier = thisEl.find('#supplierDd');
            var supplierId = supplier.attr('data-id');
            var paidAmount = thisEl.find('#paidAmount').val();
            var paymentMethod = thisEl.find('#paymentMethod');
            var paymentMethodID = paymentMethod.attr('data-id');
            var date = thisEl.find('#paymentDate').val();
            var paymentRef = thisEl.find('#paymentRef').val();
            var period = thisEl.find('#period').attr('data-id');
            var journal = thisEl.find('#journal').attr('data-id');
            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };

            period = period || null;

            paidAmount = parseFloat(paidAmount);
            if (isNaN(paidAmount) || paidAmount <= 0) {
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

            if (!journal) {
                return App.render({
                    type   : 'error',
                    message: "Journal can't be empty."
                });
            }

            data = {
                mid             : this.mid,
                forSale         : this.forSales,
                invoice         : invoiceModel._id,
                supplier        : supplierId,
                paymentMethod   : paymentMethodID,
                date            : helpers.setTimeToDate(date),
                period          : period,
                paymentRef      : paymentRef,
                paidAmount      : paidAmount,
                currency        : currency,
                differenceAmount: this.differenceAmount,
                proforma        : this.proforma,
                journal         : journal
            };

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: self.mid
                    },
                    wait   : true,
                    success: function () {
                        var redirectUrl;

                        if (self.mid === 97) {
                            redirectUrl = '#easyErp/ExpensesPayments/list';
                        } else if (self.mid === 100) {
                            redirectUrl = '#easyErp/DividendPayments/list';
                        } else if (self.mid === 109) {
                            redirectUrl = '#easyErp/purchasePayments/list';
                        } else if (self.mid === 95) {
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
            var htmBody = this.template({
                invoice : model,
                currency: self.currency
            });

            this.$el = $(htmBody).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Payment',
                buttons    : [
                    {
                        id   : 'create-payment-dialog',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },
                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]
            });

            populate.get2name('#supplierDd', '/supplier', {}, this, false, true);
            populate.get('#period', '/period', {}, 'name', this, true, true);
            populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true, null);
            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);

            populate.get('#journal', '/journals/getForDd', {}, 'name', this, true, true);

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
