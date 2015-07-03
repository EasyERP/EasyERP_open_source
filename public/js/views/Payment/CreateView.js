/**
 * Created by soundstorm on 20.05.15.
 */
define([
        "text!templates/Payment/CreateTemplate.html",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        "models/PaymentModel",
        "common",
        "populate",
        'constants'
    ],
    function (CreateTemplate, PersonCollection, DepartmentCollection, PaymentModel, common, populate, constants) {
        var CreateView = Backbone.View.extend({
            el: "#paymentHolder",
            contentType: "Payment",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                if (options) {
                    this.forSale = options.forSale;
                    this.invoiceModel = options.model;
                    this.totalAmount = this.invoiceModel.get('paymentInfo').balance || 0;
                }
                this.responseObj = {};
                this.model = new PaymentModel();
                this.differenceAmount = 0;

                this.render();

                this.forSales = App.currentDb === constants.WTRACK_DB_NAME;
            },

            events: {
                'keydown': 'keydownHandler',
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "change #paidAmount": "changePaidAmount"
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

                if(!differenceAmountContainer.hasClass('hidden')){
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
                //FixMe change mid value to proper number after inserting it into DB
                var mid = 55;
                var thisEl = this.$el;
                var invoiceModel = this.invoiceModel.toJSON();
                var supplier = thisEl.find('#supplierDd').data('id');
                var paidAmount = thisEl.find('#paidAmount').val();
                var paymentMethod = thisEl.find('#paymentMethod').data('id');
                var date = thisEl.find('#paymentDate').val();
                var paymentRef = thisEl.find('#paymentRef').val();
                var period = thisEl.find('#period').data('id');

                paymentMethod = paymentMethod || null;
                period = period || null;

                data = {
                    forSale: this.forSale,
                    invoice: invoiceModel._id,
                    supplier: supplier,
                    paymentMethod: paymentMethod,
                    date: date,
                    period: period,
                    paymentRef: paymentRef,
                    paidAmount: paidAmount,
                    differenceAmount: this.differenceAmount
                };

                if (supplier) {
                    this.model.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function () {
                            var redirectUrl = self.forSales ? "easyErp/customerPayments" : "easyErp/supplierPayments";

                            self.hideDialog();
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });

                } else {
                    alert(CONSTANTS.RESPONSES.CREATE_QUOTATION);
                }
            },

            render: function () {
                var self = this;
                var model = this.invoiceModel.toJSON();
                var htmBody = this.template({invoice: model});

                this.$el = $(htmBody).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Cretae Payment",
                    buttons: [
                        {
                            id: "create-payment-dialog",
                            text: "Create",
                            click: function () {
                                self.saveItem();
                            }
                        },
                        {
                            text: "Cancel",
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
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                }).datepicker('setDate', new Date());

                this.delegateEvents(this.events);
                return this;
            }
        });

        return CreateView;
    });