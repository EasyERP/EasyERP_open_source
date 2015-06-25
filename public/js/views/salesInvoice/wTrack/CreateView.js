define([
        "text!templates/salesInvoice/wTrack/CreateTemplate.html",
        "models/InvoiceModel",
        "common",
        "populate",
        "views/salesInvoice/wTrack/wTrackRows",
        "views/Assignees/AssigneesView",
        "views/Payment/list/ListHeaderInvoice",
        "dataService",
        'constants',
        'moment'
],
    function (CreateTemplate, InvoiceModel, common, populate, wTrackRows, AssigneesView, listHederInvoice, dataService, CONSTANTS, moment) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Invoice",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                var self = this;
                var projectId = options.project ? options.project._id : null;

                _.bindAll(this, "saveItem", "render");
                this.model = new InvoiceModel(options);
                this.responseObj = {};

                dataService.getData('/invoice/generateName?projectId=' + projectId, null, function (name) {
                    if (name) {
                        options.invoiceName = name;
                    }
                    self.render(options);
                });
            },

            events: {
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                "click .details": "showDetailsBox"
            },

            showDetailsBox: function (e) {
                $(e.target).parent().find(".details-box").toggle();
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

            changeTab: function (e) {
                var holder = $(e.target);
                var n;
                var dialogHolder;
                var closestEl = holder.closest('.dialog-tabs');
                var dataClass = closestEl.data('class');
                var selector = '.dialog-tabs-items.' + dataClass;
                var itemActiveSelector = '.dialog-tabs-item.' + dataClass + '.active';
                var itemSelector = '.dialog-tabs-item.' + dataClass;

                closestEl.find("a.active").removeClass("active");
                holder.addClass("active");

                n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                dialogHolder = $(selector);

                dialogHolder.find(itemActiveSelector).removeClass("active");
                dialogHolder.find(itemSelector).eq(n).addClass("active");
            },

            saveItem: function () {
                var self = this;

                var selectedProducts = this.$el.find('.productItem');
                var products = [];
                var selectedLength = selectedProducts.length;
                var targetEl;
                var productId;
                var quantity;
                var price;
                var taxes;
                var amount;
                var description;

                var supplier = this.$("#supplier").data("id");
                var salesPersonId = this.$("#salesPerson").data("id") ? this.$("#salesPerson").data("id") : null;
                var paymentTermId = this.$("#paymentTerms").data("id") ? this.$("#payment_terms").data("id") : null;
                var invoiceDate = this.$("#invoiceFate").val();
                var dueDate = this.$("#dueDate").val();

                var total = parseFloat(this.$("#totalAmount").text());
                var unTaxed = parseFloat(this.$("#totalUntaxes").text());
                var balance = parseFloat(this.$("#balance").text());

                var payments = {
                    total: total,
                    unTaxed: unTaxed,
                    balance: balance
                };

                if (selectedLength) {
                    for (var i = selectedLength - 1; i >= 0; i--) {
                        targetEl = $(selectedProducts[i]);
                        productId = targetEl.data('id');
                        if (productId) {
                            quantity = targetEl.find('[data-name="quantity"]').text();
                            price = targetEl.find('[data-name="price"]').text();
                            description = targetEl.find('[data-name="productDescr"]').text();
                            taxes = targetEl.find('.taxes').text();
                            amount = targetEl.find('.amount').text();

                            products.push({
                                product: productId,
                                description: description,
                                unitPrice: price,
                                quantity: quantity,
                                taxes: taxes,
                                subTotal: amount
                            });
                        }
                    }
                }

                var usersId = [];
                var groupsId = [];
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });

                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var data = {
                    supplier: supplier,
                    invoiceDate: invoiceDate,
                    dueDate: dueDate,
                    account: null,
                    journal: null,

                    salesPerson: salesPersonId,
                    paymentTerms: paymentTermId,

                    products: products,
                    paymentInfo: payments,

                    groups: {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW,
                    workflow: this.defaultWorkflow

                };

                if (supplier) {
                    var model = new InvoiceModel();
                    model.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function () {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/Invoice", {trigger: true});
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });

                } else {
                    alert(CONSTANTS.RESPONSES.CREATE_QUOTATION);
                }

            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            render: function (options) {
                options.model = null;
                options.balanceVisible = null;
                var notDiv;
                var now = new Date();
                var dueDate = moment().add(15, 'days').toDate();
                var formString = this.template(options);
                var self = this;
                var invoiceItemContainer;
                var paymentContainer;
                var invoiceContainer;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Create Invoice",
                    width: '1000',
                    //width: 'auto',
                    position: { within: $("#wrapper") },
                    buttons: [
                        {
                            id: "create-invoice-dialog",
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
                        }]

                });

                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );


                invoiceContainer = new wTrackRows(options);

                paymentContainer = this.$el.find('#payments-container');
                paymentContainer.append(
                    new listHederInvoice().render().el
                );

                populate.get("#paymentTerms", "/paymentTerm", {}, 'name', this, true);

                this.$el.find('#invoiceDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                }).datepicker('setDate', now);

                this.$el.find('#dueDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                }).datepicker('setDate', dueDate);


                this.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
