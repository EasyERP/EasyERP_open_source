define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/DividendPayments/CreateTemplate.html',
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
    'helpers/keyValidator'], function (Backbone,
                                       $,
                                       _,
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
                                       keyValidator) {
    var CreateView = Backbone.View.extend({
        el         : '#paymentHolder',
        contentType: 'Payment',
        template   : _.template(CreateTemplate),

        initialize: function (options) {

            this.eventChannel = options.eventChannel;

            if (options) {
                this.invoiceModel = options.model;
                this.totalAmount = this.invoiceModel.get('paymentInfo').balance || 0;
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

            this.currency = options.currency || {};
            this.changePaidAmount = _.debounce(this.changePaidAmount, 500);

            this.render();
        },

        events: {
            keypress                                                          : 'keypressHandler',
            'click .current-selected'                                         : 'showNewSelect',
            click                                                             : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)'               : 'chooseOption',
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'keyup #paidAmount'                                               : 'changePaidAmount',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect'
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },

        changePaidAmount: function () {
            var self = this;
            var targetEl = $('#paidAmount');
            var changedValue = $.trim(targetEl.val());
            var currency = $.trim(this.$el.find('#currencyDd').text());
            var differenceAmountContainer = this.$el.find('#differenceAmountContainer');
            var differenceAmount = differenceAmountContainer.find('#differenceAmount');
            var totalAmount = parseFloat(this.totalAmount);
            var date = $('#paymentDate').val();
            var data = {};

            changedValue = parseFloat(changedValue);

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

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);
            return false;
        },

        notHide: function () {
            return false;
        },

        hideNewSelect: function () {
            $('.newSelectList').hide();
        },

        chooseOption: function (e) {
            $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            this.changePaidAmount();
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
            var mid = self.mid || 56;
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
            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };

            paidAmount = parseFloat(paidAmount);
            if (isNaN(paidAmount) || paidAmount <= 0) {
                return App.render({
                    type   : 'error',
                    message: 'Please, enter Paid Amount!'
                });
            }

            paymentMethod = paymentMethod || null;
            period = period || null;

            data = {
                mid             : mid,
                forSale         : this.forSales,
                invoice         : invoiceModel._id,
                supplier        : supplierId,
                paymentMethod   : paymentMethodID,
                date            : date,
                period          : period,
                paymentRef      : paymentRef,
                paidAmount      : paidAmount,
                currency        : currency,
                differenceAmount: this.differenceAmount
            };

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        var redirectUrl;

                        if (mid === 97) {
                            redirectUrl = '#tinyERP/ExpensesPayments/list';
                        } else if (mid === 100) {
                            redirectUrl = '#tinyERP/DividendPayments/list';
                        } else {
                            redirectUrl = self.forSales ? 'tinyERP/customerPayments' : 'tinyERP/supplierPayments';
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

            populate.get2name('#supplierDd', '/supplier', {}, this, false, true);
            populate.get('#period', '/period', {}, 'name', this, true, true);
            populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, null, null, 2);
            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);

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
