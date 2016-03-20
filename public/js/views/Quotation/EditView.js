define([
    'Backbone',
    'jQuery',
    'Underscore',
    "text!templates/Quotation/EditTemplate.html",
    "views/Projects/projectInfo/invoices/invoiceView",
    'views/selectView/selectView',
    'views/Assignees/AssigneesView',
    'views/Product/InvoiceOrder/ProductItems',
    'views/Projects/projectInfo/orders/orderView',
    'collections/Quotation/filterCollection',
    'collections/Proforma/filterCollection',
    "common",
    "custom",
    "dataService",
    "populate",
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, EditTemplate, ProformaView, SelectView, AssigneesView, ProductItemView, OrdersView, QuotationCollection, ProformaCollection, common, Custom, dataService, populate, CONSTANTS, keyValidator) {
    'use strict';

    var EditView = Backbone.View.extend({
        contentType: "Quotation",
        imageSrc   : '',
        template   : _.template(EditTemplate),

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
            }

            _.bindAll(this, "render", "saveItem");
            _.bindAll(this, "render", "deleteItem");

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.currentModel.urlRoot = "/quotation";
            this.responseObj = {};
            this.forSales = false;

            this.render(options);
        },

        events: {
            'keypress .forNum'                                 : 'keydownHandler',
            'click .dialog-tabs a'                             : 'changeTab',
            "click .current-selected"                          : "showNewSelect",
            "click"                                            : "hideNewSelect",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click .confirmOrder"                              : "confirmOrder",
            "click .createProforma"                            : "createProforma",
            "click .cancelQuotation"                           : "cancelQuotation",
            "click .setDraft"                                  : "setDraft"
        },

        showNewSelect: function (e) {
            var $target = $(e.target);
            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        hideNewSelect: function () {
            $(".newSelectList").hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var id = target.attr("id");
            var type = target.attr('data-level');

            var element = _.find(this.responseObj['#project'], function (el) {
                return el._id === id;
            });

            $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));

            if (type !== $.trim(this.$el.find('#supplierDd').text()) && element && element.customer && element.customer.name) {
                this.$el.find('#supplierDd').text(element.customer.name && element.customer.name.first ? element.customer.name.first + ' ' + element.customer.name.last : element.customer.name);
                this.$el.find('#supplierDd').attr('data-id', element.customer._id);
            }

            this.hideNewSelect();
        },

        keydownHandler: function (e) {
            var charCode = e.which;

            switch (charCode) {
                case 27:
                    this.hideDialog();
                    break;
                default:
                    return keyValidator(e);
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

        confirmOrder: function (e) {
            e.preventDefault();

            var self = this;
            var wId;
            var mid;
            var status;
            var id = self.currentModel.get('_id');

            if (this.forSales) {
                wId = 'Sales Order';
                mid = 63;
                status = "New";
            } else {
                wId = 'Purchase Order';
                mid = 57;
                status = 'In Progress'; // todo workflow for purchase
            }

            populate.fetchWorkflow({
                wId   : wId,
                source: 'purchase',
                status: status
                //targetSource: 'order'
            }, function (workflow) {
                var products;

                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                products = self.currentModel.get('products');

                if (products && products.length) {
                    self.currentModel.save({
                        isOrder : true,
                        type    : 'Not Invoiced',
                        workflow: workflow._id
                    }, {
                        headers: {
                            mid: mid
                        },
                        patch  : true,
                        success: function () {
                            var redirectUrl = self.forSales ? "easyErp/salesOrder" : "easyErp/Order";

                            if (self.redirect) {
                                var filter = {
                                    'projectName': {
                                        key  : 'project._id',
                                        value: [self.pId]
                                    },
                                    'isOrder'    : {
                                        key  : 'isOrder',
                                        value: ['true']
                                    }
                                };

                                self.ordersCollection = new QuotationCollection({
                                    count      : 50,
                                    viewType   : 'list',
                                    contentType: 'salesOrder',
                                    filter     : filter
                                });

                                self.ordersCollection.bind('reset', function () {
                                    self.ordersView = new OrdersView({
                                        collection    : self.ordersCollection,
                                        projectId     : self.pId,
                                        customerId    : self.customerId,
                                        projectManager: self.projectManager,
                                        filter        : filter,
                                        activeTab     : true
                                    });

                                    self.ordersView.showOrderDialog(id);
                                });

                                if (self.collection) {
                                    self.collection.remove(self.currentModel.get('_id'));

                                }

                            } else {
                                Backbone.history.navigate(redirectUrl, {trigger: true});
                            }
                        }
                    });
                } else {
                    return App.render({
                        type   : 'error',
                        message: CONSTANTS.RESPONSES.CONFIRM_ORDER
                    });
                }
            });
        },

        createProforma: function (e) {
            e.preventDefault();

            var self = this;
            var url = '/proforma/create';
            var quotationId = this.currentModel.id;
            var data = {
                forSales: this.forSales,
                quotationId : quotationId,
                currency: this.currentModel.currency
            };

            this.saveItem(function (err) {
                if (!err) {

                    dataService.postData(url, data, function (err, response) {
                        var filter;
                        var _id;
                        var tr;

                        function createView() {
                            this.proformaView = new ProformaView({
                                el       : '#proforma',
                                model    : self.collection,
                                activeTab: true
                            });
                            this.proformaView.showDialog(quotationId);
                        }

                        if (err) {
                            App.render({
                                type   : 'error',
                                message: 'Can\'t create proforma'
                            });
                        } else {

                            _id = window.location.hash.split('form/')[1];
                            tr = $('[data-id=' + quotationId + ']');

                            tr.find('.checkbox').addClass('notRemovable');
                            tr.find('.workflow').find('a').text('Proformed');

                            filter = {
                                project: {
                                    key  : 'project._id',
                                    value: [_id]
                                }
                            };

                            self.collection = new ProformaCollection({
                                count      : 50,
                                viewType   : 'list',
                                contentType: 'salesProforma',
                                filter     : filter
                            });

                            self.collection.unbind();
                            self.collection.bind('reset', createView);
                        }
                    });
                }
            });
        },

        cancelQuotation: function (e) {
            e.preventDefault();

            var self = this;

            populate.fetchWorkflow({
                wId         : 'Purchase Order',
                source      : 'purchase',
                targetSource: 'quotation',
                status      : 'Cancelled',
                order       : 1
            }, function (workflow) {
                //var redirectUrl = self.forSales ? "easyErp/salesQuotation" : "easyErp/Quotation";
                var redirectUrl = window.location.hash;

                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                self.currentModel.save({
                    workflow: workflow._id
                }, {
                    headers: {
                        mid: 57
                    },
                    patch  : true,
                    success: function () {
                        $(".edit-dialog").remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
        },

        setDraft: function (e) {
            e.preventDefault();

            var self = this;

            populate.fetchWorkflow({
                wId: 'Sales Order'
            }, function (workflow) {
                // var redirectUrl = self.forSales ? "easyErp/salesQuotation" : "easyErp/Quotation";
                var redirectUrl = window.location.hash;

                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                self.currentModel.save({
                    workflow: workflow._id
                }, {
                    headers: {
                        mid: 57
                    },
                    patch  : true,
                    success: function () {
                        $(".edit-dialog").remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
        },

        saveItem: function (proformaCb) {
            var self = this;
            var mid = this.forSales ? 62 : 55;
            var thisEl = this.$el;
            var selectedProducts = thisEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var quantity;
            var price;
            var supplier = thisEl.find('#supplierDd').attr('data-id');
            var project = thisEl.find('#projectDd').attr('data-id');
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
            var jobs;
            var scheduledDate;
            var usersId = [];

            var groupsId = [];
            var data;

            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };

            var wF = this.currentModel.get('workflow');
            var workflow = wF._id;
            var i;
            var whoCanRW;

            thisEl.find(".groupsAndUser tr").each(function () {
                if ($(this).data("type") === "targetUsers") {
                    usersId.push($(this).data("id"));
                }
                if ($(this).data("type") === "targetGroups") {
                    groupsId.push($(this).data("id"));
                }

            });

            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');

                    if (productId) {
                        quantity = targetEl.find('[data-name="quantity"]').text();
                        price = targetEl.find('[data-name="price"]').text();
                        scheduledDate = targetEl.find('[data-name="scheduledDate"]').text();
                        taxes = targetEl.find('.taxes').text();
                        description = targetEl.find('[data-name="productDescr"]').text();
                        jobs = targetEl.find('[data-name="jobs"]').attr("data-content");
                        subTotal = targetEl.find('.subtotal').text();

                        products.push({
                            product      : productId,
                            unitPrice    : price,
                            quantity     : quantity,
                            scheduledDate: scheduledDate,
                            taxes        : taxes,
                            description  : description,
                            subTotal     : subTotal,
                            jobs         : jobs
                        });
                    }
                }
            }

            data = {
                currency         : currency,
                supplier         : supplier,
                supplierReference: supplierReference,
                deliverTo        : deliverTo,
                products         : products,
                project          : project,
                orderDate        : orderDate,
                expectedDate     : expectedDate,
                destination      : destination,
                incoterm         : incoterm,
                invoiceControl   : invoiceControl,
                paymentTerm      : paymentTerm,
                fiscalPosition   : fiscalPosition,
                paymentInfo      : {
                    total  : total,
                    unTaxed: unTaxed,
                    taxes  : totalTaxes
                },
                groups           : {
                    owner: $("#allUsersSelect").data("id"),
                    users: usersId,
                    group: groupsId
                },
                whoCanRW         : whoCanRW,
                workflow         : workflow
            };

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        var url = window.location.hash;

                        self.hideDialog();

                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});

                        App.projectInfo = App.projectInfo || {};
                        App.projectInfo.currentTab = 'quotations';

                        if (proformaCb && typeof proformaCb === 'function') {
                            return proformaCb(null);
                        }
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);

                        if (proformaCb && typeof proformaCb === 'function') {
                            return proformaCb(xhr.text);
                        }
                    }
                });

            } else {
                App.render({
                    type   : 'error',
                    message: CONSTANTS.RESPONSES.CREATE_QUOTATION
                });
            }
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
            $(".crop-images-dialog").remove();
        },

        deleteItem: function (event) {
            var mid = this.forSales ? 62 : 55;
            var url;
            var answer = confirm("Really DELETE items ?!");

            event.preventDefault();

            if (answer === true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        $('.edit-product-dialog').remove();
                        // Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                        url = window.location.hash;

                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});

                        App.projectInfo = App.projectInfo || {};
                        App.projectInfo.currentTab = 'quotations';
                    },
                    error  : function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: "You do not have permission to perform this action"
                            });
                        }
                    }
                });
            }

        },

        render: function () {
            var self = this;
            var formString = this.template({
                model        : this.currentModel.toJSON(),
                visible      : this.visible,
                hidePrAndCust: this.hidePrAndCust
            });
            var service = this.forSales;
            var notDiv;
            var model;
            var productItemContainer;

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : "edit-dialog",
                title        : "Edit Quotation",
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

            populate.get("#currencyDd", "/currency/getForDd", {}, 'name', this, true);

            populate.get("#destination", "/destination", {}, 'name', this, false, true);
            populate.get("#incoterm", "/incoterm", {}, 'name', this, false, true);
            populate.get("#invoicingControl", "/invoicingControl", {}, 'name', this, false, true);
            populate.get("#paymentTerm", "/paymentTerm", {}, 'name', this, false, true);
            populate.get("#deliveryDd", "/deliverTo", {}, 'name', this, false, true);

            if (App.weTrack && this.forSales) {
                populate.get("#supplierDd", "/Customer", {}, "fullName", this, false, false);

                populate.get("#projectDd", "/getProjectsForDd", {}, "projectName", this, false, false);

            } else {
                populate.get2name("#supplierDd", "/supplier", {}, this, false, true);
            }

            this.$el.find('#orderDate').datepicker({
                dateFormat : "d M, yy",
                changeMonth: true,
                changeYear : true,
                maxDate    : "+0D"
            });

            this.delegateEvents(this.events);
            model = this.currentModel.toJSON();

            productItemContainer = this.$el.find('#productItemsHolder');

            productItemContainer.append(
                new ProductItemView({editable: true, canBeSold: true, service: service}).render({model: model}).el
            );

            dataService.getData("/project/getForWtrack", null, function (projects) {
                projects = _.map(projects.data, function (project) {
                    project.name = project.projectName;

                    return project;
                });

                self.responseObj['#project'] = projects;
            });

            if (model.groups) {
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
            }

            return this;
        }
    });

    return EditView;
});
