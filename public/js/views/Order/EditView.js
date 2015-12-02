define([
        "text!templates/Order/EditTemplate.html",
        'views/Assignees/AssigneesView',
        'views/Product/InvoiceOrder/ProductItems',
        "common",
        "custom",
        "dataService",
        "populate",
        "constants"
    ],
    function (EditTemplate, AssigneesView, ProductItemView, common, Custom, dataService, populate, CONSTANTS) {

        var EditView = Backbone.View.extend({
            contentType: "Order",
            imageSrc   : '',
            template   : _.template(EditTemplate),

            initialize: function (options) {
                if (options) {
                    this.visible = options.visible;
                }

                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");

                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/order";
                this.responseObj = {};
                this.forSales = false;
                this.render(options);
            },

            events: {
                'keydown'                                                         : 'keydownHandler',
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect",
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .receiveInvoice"                                           : "receiveInvoice",
                "click .cancelOrder"                                              : "cancelOrder",
                "click .setDraft"                                                 : "setDraft"
            },


            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },
            notHide      : function () {
                return false;
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption : function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },
            nextSelect   : function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect   : function (e) {
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

            cancelOrder: function (e) {
                e.preventDefault();

                var self = this;

                populate.fetchWorkflow({
                    wId   : 'Purchase Order',
                    status: 'Cancelled',
                    order : 1
                }, function (workflow) {
                    var redirectUrl = self.forSales ? "easyErp/salesOrder" : "easyErp/Order";

                    if (workflow && workflow.error) {
                        return alert(workflow.error.statusText);
                    }

                    self.currentModel.save({
                        workflow: {
                            _id : workflow._id,
                            name: workflow.name
                        }
                    }, {
                        headers: {
                            mid: 57
                        },
                        patch  : true,
                        success: function () {
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    });
                });
            },

            receiveInvoice: function (e) {
                e.preventDefault();

                var self = this;
                var url = '/invoice/receive';
                var data = {
                    forSales: this.forSales,
                    orderId : this.currentModel.id,
                    currency: this.currentModel.currency
                };

                this.saveItem(function (err) {
                    if (!err) {
                        dataService.postData(url, data, function (err, response) {
                            var redirectUrl = self.forSales ? "easyErp/salesInvoice" : "easyErp/Invoice";

                            if (err) {
                                alert('Can\'t receive invoice');
                            } else {
                                Backbone.history.navigate(redirectUrl, {trigger: true});
                            }
                        });
                    }
                });
            },

            setDraft: function (e) {
                e.preventDefault();

                var self = this;

                populate.fetchWorkflow({
                    wId: 'Quotation'
                }, function (workflow) {
                    var redirectUrl = self.forSales ? "easyErp/salesOrder" : "easyErp/Order";

                    if (workflow && workflow.error) {
                        return alert(workflow.error.statusText);
                    }

                    self.currentModel.save({
                        workflow: {
                            _id : workflow._id,
                            name: workflow.name
                        }
                    }, {
                        headers: {
                            mid: 57
                        },
                        patch  : true,
                        success: function () {
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    });
                });
            },

            saveItem: function (invoiceCb) {
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
                var supplier = {};
                supplier._id = thisEl.find('#supplierDd').data('id');
                supplier.name = thisEl.find('#supplierDd').text();

                var destination = $.trim(thisEl.find('#destination').data('id'));
                var incoterm = $.trim(thisEl.find('#incoterm').data('id'));
                var invoiceControl = $.trim(thisEl.find('#invoicingControl').data('id'));
                var paymentTerm = $.trim(thisEl.find('#paymentTerm').data('id'));
                var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').data('id'));
                var supplierReference = thisEl.find('#supplierReference').val();
                var orderDate = thisEl.find('#orderDate').val();
                var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#minScheduleDate').text();

                var total = $.trim(thisEl.find('#totalAmount').text());
                var unTaxed = $.trim(thisEl.find('#totalUntaxes').text());

                var usersId = [];
                var groupsId = [];

                var currency = {
                    _id : thisEl.find('#currencyDd').attr('data-id'),
                    name: thisEl.find('#currencyDd').text()
                };

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
                        quantity = targetEl.find('[data-name="quantity"]').text();
                        price = targetEl.find('[data-name="price"]').text();

                        products.push({
                            product  : productId,
                            unitPrice: price,
                            quantity : quantity
                        });
                    }
                }


                data = {
                    currency         : currency,
                    supplier         : supplier,
                    supplierReference: supplierReference,
                    products         : products,
                    orderDate        : orderDate,
                    expectedDate     : expectedDate,
                    destination      : destination ? destination : null,
                    incoterm         : incoterm ? incoterm : null,
                    invoiceControl   : invoiceControl ? invoiceControl : null,
                    paymentTerm      : paymentTerm ? paymentTerm : null,
                    fiscalPosition   : fiscalPosition ? fiscalPosition : null,
                    paymentInfo      : {
                        total  : total,
                        unTaxed: unTaxed
                    },
                    groups           : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW         : whoCanRW
                };

                if (supplier) {
                    this.model.save(data, {
                        headers: {
                            mid: mid
                        },
                        patch  : true,
                        success: function (model) {
                            Backbone.history.fragment = "";
                            Backbone.history.navigate(window.location.hash, {trigger: true});
                            self.hideDialog();

                            if (invoiceCb && typeof invoiceCb === 'function') {
                                return invoiceCb(null);
                            }
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);

                            if (invoiceCb && typeof invoiceCb === 'function') {
                                return invoiceCb(xhr.text);
                            }
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
            deleteItem: function (event) {
                var mid = 55;
                event.preventDefault();
                var self = this;
                var answer = confirm("Really DELETE items ?!");
                if (answer == true) {
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            $('.edit-product-dialog').remove();
                            Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                        },
                        error  : function (model, err) {
                            if (err.status === 403) {
                                alert("You do not have permission to perform this action");
                            }
                        }
                    });
                }

            },

            render: function () {
                var self = this;
                var formString = this.template({
                    model  : this.currentModel.toJSON(),
                    visible: this.visible
                });
                var notDiv;
                var model;
                var productItemContainer;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-dialog",
                    title        : "Edit Order",
                    width        : "900px",
                    buttons      : [
                        {
                            text : "Save",
                            click: function () {
                                self.saveItem();
                            }
                        },

                        {
                            text : "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        },
                        {
                            text : "Delete",
                            click: self.deleteItem
                        }
                    ]

                });

                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                populate.get("#currencyDd", "/currency/getForDd", {}, 'name', this, true, true);

                populate.get("#destination", "/destination", {}, 'name', this, false, true);
                populate.get("#incoterm", "/incoterm", {}, 'name', this, false, true);
                populate.get("#invoicingControl", "/invoicingControl", {}, 'name', this, false, true);
                populate.get("#paymentTerm", "/paymentTerm", {}, 'name', this, false, true);
                populate.get("#deliveryDd", "/deliverTo", {}, 'name', this, false, true);
                populate.get2name("#supplierDd", "/supplier", {}, this, false, true);

                this.delegateEvents(this.events);
                model = this.currentModel.toJSON();

                this.$el.find('#expectedDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true
                })/*.datepicker('setDate', model.expectedDate)*/;

                productItemContainer = this.$el.find('#productItemsHolder');

                productItemContainer.append(
                    new ProductItemView({editable: false, balanceVissible: false}).render({model: model}).el
                );


                if (model.groups)
                    if (model.groups.users.length > 0 || model.groups.group.length) {
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.departmentName + "</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='" + item._id + "'>" + item.departmentName + "</li>");
                        });
                        model.groups.users.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='" + item._id + "'>" + item.login + "</li>");
                        });

                    }
                return this;
            }

        });

        return EditView;
    });
