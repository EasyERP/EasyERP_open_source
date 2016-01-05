/**
 * Created by soundstorm on 20.05.15.
 */
define([
    'Backbone',
    'jQuery',
    'Underscore',
    "text!templates/Payment/CreateTemplate.html",
    "collections/Persons/PersonsCollection",
    "collections/Departments/DepartmentsCollection",
    'collections/salesInvoice/filterCollection',
    'collections/customerPayments/filterCollection',
    'views/Projects/projectInfo/payments/paymentView',
    //"views/Projects/projectInfo/invoices/invoiceView",
    "models/PaymentModel",
    "common",
    "populate",
    'constants'], function (Backbone, $, _, CreateTemplate, PersonCollection, DepartmentCollection, invoiceCollection, paymentCollection, PaymentView, /*invoiceView, */PaymentModel, common, populate, constants) {
    var CreateView = Backbone.View.extend({
        el         : "#paymentHolder",
        contentType: "Payment",
        template   : _.template(CreateTemplate),

        initialize: function (options) {
            if (options) {
                this.forSales = options.forSales;
                this.invoiceModel = options.model;
                this.totalAmount = this.invoiceModel.get('paymentInfo').balance || 0;
            }
            this.responseObj = {};
            this.model = new PaymentModel();
            this.differenceAmount = 0;

            this.redirect = options.redirect;
            this.collection = options.collection;

            if (!this.forSales) {
                this.forSales = App.weTrack;
            }

            this.render();
        },

        events: {
            'keydown'                                          : 'keydownHandler',
            "click .current-selected"                          : "showNewSelect",
            "click"                                            : "hideNewSelect",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click .newSelectList li.miniStylePagination"      : "notHide",
            "change #paidAmount"                               : "changePaidAmount",

            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },

        changePaidAmount: function (e) {
            var targetEl = $(e.target);
            var changedValue = targetEl.val();
            var differenceAmountContainer = this.$el.find('#differenceAmountContainer');
            var differenceAmount = differenceAmountContainer.find('#differenceAmount');
            var totalAmount = parseFloat(this.totalAmount);
            var difference;

            changedValue = parseFloat(changedValue);
            difference = totalAmount - changedValue;

            if (changedValue < totalAmount) {
                differenceAmount.text(difference.toFixed(2));
                this.differenceAmount = difference;

                return differenceAmountContainer.removeClass('hidden');
            }

            if (!differenceAmountContainer.hasClass('hidden')) {
                return differenceAmountContainer.addClass('hidden');
            }
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);
            return false;
        },

        notHide: function () {
            return false;
        },

        hideNewSelect: function () {
            $(".newSelectList").hide();
        },

        chooseOption: function (e) {
            $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
        },

        keydownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                default:
                    break;
            }
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
        },

        saveItem: function () {

            var self = this;
            var data;
            //FixMe change mid value to proper number after inserting it into DB
            var mid = 56;
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
                differenceAmount: this.differenceAmount
            };

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        var redirectUrl = self.forSales ? "easyErp/customerPayments" : "easyErp/supplierPayments";

                        self.hideDialog();

                        if (self.redirect) {
                            var _id = window.location.hash.split('form/')[1];

                            var filter = {
                                'project': {
                                    key  : 'project._id',
                                    value: [_id]
                                }
                            };

                            self.collection = new invoiceCollection({
                                count      : 50,
                                viewType   : 'list',
                                contentType: 'salesInvoice',
                                filter     : filter
                            });

                            function createView() {
                                var payments = [];

                                //new invoiceView({
                                //    model: self.collection
                                //}).render();

                                self.collection.toJSON().forEach(function (element) {
                                    element.payments.forEach(function (payment) {
                                        payments.push(payment);
                                    });
                                });

                                var filterPayment = {
                                    'name': {
                                        key  : '_id',
                                        value: payments
                                    }
                                };

                                self.pCollection = new paymentCollection({
                                    count      : 50,
                                    viewType   : 'list',
                                    contentType: 'customerPayments',
                                    filter     : filterPayment
                                });

                                self.pCollection.unbind();
                                self.pCollection.bind('reset', createPayment);

                                function createPayment() {
                                    new PaymentView({
                                        model: self.pCollection
                                    }).render({activeTab: true});
                                }

                            };

                            self.collection.unbind();
                            self.collection.bind('reset', createView);
                        } else {
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    },
                    error  : function (model, xhr) {
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
            var htmBody = this.template({invoice: model});

            this.$el = $(htmBody).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : "edit-dialog",
                title        : "Create Payment",
                buttons      : [
                    {
                        id   : "create-payment-dialog",
                        text : "Create",
                        click: function () {
                            self.saveItem();
                        }
                    },
                    {
                        text : "Cancel",
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]
            });

            populate.get2name("#supplierDd", "/supplier", {}, this, false, true);
            populate.get("#period", "/period", {}, 'name', this, true, true);
            populate.get("#paymentMethod", "/paymentMethod", {}, 'name', this, true);

            this.$el.find('#paymentDate').datepicker({
                dateFormat : "d M, yy",
                changeMonth: true,
                changeYear : true
            }).datepicker('setDate', new Date())
                .datepicker('option', 'minDate', model.invoiceDate);

            this.delegateEvents(this.events);
            return this;
        }
    });

    return CreateView;
});