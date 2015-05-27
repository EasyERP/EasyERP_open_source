define([
        "text!templates/Quotation/CreateTemplate.html",
        "collections/Persons/PersonsCollection",
        "collections/Departments/DepartmentsCollection",
        'views/Product/InvoiceOrder/ProductItems',
        "models/QuotationModel",
        "common",
        "populate",
        'constants',
        'views/Assignees/AssigneesView'
    ],
    function (CreateTemplate, PersonsCollection, DepartmentsCollection, ProductItemView, QuotationModel, common, populate, CONSTANTS, AssigneesView) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Quotation",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                if (options) {
                    this.visible = options.visible;
                }
                _.bindAll(this, "saveItem", "render");
                this.model = new QuotationModel();
                this.responseObj = {};
                this.render();
            },

            events: {
                'keydown': 'keydownHandler',
                'click .dialog-tabs a': 'changeTab',
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
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
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
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
                var dialog_holder;
                var closestEl = holder.closest('.dialog-tabs');
                var dataClass = closestEl.data('class');
                var selector = '.dialog-tabs-items.' + dataClass;
                var itemActiveSelector = '.dialog-tabs-item.' + dataClass + '.active';
                var itemSelector = '.dialog-tabs-item.' + dataClass;

                closestEl.find("a.active").removeClass("active");
                holder.addClass("active");

                n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                dialog_holder = $(selector);

                dialog_holder.find(itemActiveSelector).removeClass("active");
                dialog_holder.find(itemSelector).eq(n).addClass("active");
            },

            saveItem: function () {

                var self = this;
                var mid = 55;
                var thisEl = this.$el;
                var selectedProducts = thisEl.find('.productItem');
                var products = [];
                var data;
                var selectedLength = selectedProducts.length;
                var targetEl;
                var productId;
                var quantity;
                var price;
                var scheduledDate;

                var supplier = thisEl.find('#supplierDd').data('id');
                var destination = $.trim(thisEl.find('#destination').data('id'));
                var deliverTo = $.trim(thisEl.find('#deliveryDd').data('id'));
                var incoterm = $.trim(thisEl.find('#incoterm').data('id'));
                var invoiceControl = $.trim(thisEl.find('#invoicingControl').data('id'));
                var paymentTerm = $.trim(thisEl.find('#paymentTerm').data('id'));
                var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').data('id'));
                var supplierReference = thisEl.find('#supplierReference').val();
                var orderDate = thisEl.find('#orderDate').val();
                var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#minScheduleDate').text();

                var total = $.trim(thisEl.find('#totalAmount').text());
                var totalTaxes = $.trim(thisEl.find('#taxes').text());
                var taxes;
                var description;
                var unTaxed = $.trim(thisEl.find('#totalUntaxes').text());
                var subTotal;

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

                if (selectedLength) {
                    for (var i = selectedLength - 1; i >= 0; i--) {
                        targetEl = $(selectedProducts[i]);
                        productId = targetEl.data('id');
                        if (productId) {
                            quantity = targetEl.find('[data-name="quantity"]').text();
                            price = targetEl.find('[data-name="price"]').text();
                            scheduledDate = targetEl.find('[data-name="scheduledDate"]').text();
                            taxes = targetEl.find('.taxes').text();
                            description = targetEl.find('[data-name="productDescr"]').text();
                            subTotal = targetEl.find('.subtotal').text();

                            products.push({
                                product: productId,
                                unitPrice: price,
                                quantity: quantity,
                                scheduledDate: scheduledDate,
                                taxes: taxes,
                                description: description,
                                subTotal: subTotal
                            });
                        }
                    }
                }


                data = {
                    supplier: supplier,
                    supplierReference: supplierReference,
                    deliverTo: deliverTo,
                    products: products,
                    orderDate: orderDate,
                    expectedDate: expectedDate,
                    destination: destination,
                    incoterm: incoterm,
                    invoiceControl: invoiceControl,
                    paymentTerm: paymentTerm,
                    fiscalPosition: fiscalPosition,
                    paymentInfo: {
                        total: total,
                        unTaxed: unTaxed,
                        taxes: totalTaxes
                    },
                    groups: {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW,
                    workflow: this.defaultWorkflow
                };

                if (supplier) {
                    this.model.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function () {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/Quotation", {trigger: true});
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

            render: function () {
                var formString = this.template({visible: this.visible});
                var self = this;
                var productItemContainer;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Create Quotation",
                    width: "900px",
                    buttons: [
                        {
                            id: "create-person-dialog",
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

                var notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                productItemContainer = this.$el.find('#productItemsHolder');
                productItemContainer.append(
                    new ProductItemView({canBeSold: this.canBeSold}).render().el
                );

                populate.get("#destination", "/destination", {}, 'name', this, true, true);
                populate.get("#incoterm", "/incoterm", {}, 'name', this, true, true);
                populate.get("#invoicingControl", "/invoicingControl", {}, 'name', this, true, true);
                populate.get("#paymentTerm", "/paymentTerm", {}, 'name', this, true, true);
                populate.get("#deliveryDd", "/deliverTo", {}, 'name', this, true);
                populate.get2name("#supplierDd", "/supplier", {}, this, false, true);

                populate.fetchWorkflow({
                    wId: 'Purchase Order',
                    source: 'purchase',
                    targetSource: 'quotation'
                }, function (response) {
                    if (!response.error) {
                        self.defaultWorkflow = response._id;
                    }
                });

                this.$el.find('#orderDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                }).datepicker('setDate', new Date());

                /*this.$el.find('#bidValidUntill').datepicker({
                 dateFormat: "d M, yy",
                 changeMonth: true,
                 changeYear: true
                 });*/

                this.$el.find('#expectedDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });

                this.delegateEvents(this.events);
                return this;
            }

        });

        return CreateView;
    });
