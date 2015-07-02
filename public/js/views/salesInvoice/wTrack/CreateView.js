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
            $linwoiceGenerateTable: null,

            initialize: function (options) {
                var self = this;
                var projectId = options.project ? options.project._id : null;

                _.bindAll(this, "saveItem", "render");

                this.model = new InvoiceModel(options);
                this.model.bind('change:paymentInfo', this.changeTotal, this);
                this.responseObj = {};

                dataService.getData('/invoice/generateName?projectId=' + projectId, null, function (name) {
                    if (name) {
                        options.name = name;
                    }
                    self.render(options);
                });
            },

            events: {
                'keydown': 'keydownHandler',
                "click td.editable": "editRow",
                'click .dialog-tabs a': 'changeTab',
                "click .current-selected": "showNewSelect",
                "change .editing": "changeValue"
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },

            changeTotal: function (model, val) {
                this.$el.find("#totalAmount").text(val.total);
                this.$el.find("#totalUntaxes").text(val.total);
            },

            changeValue: function (e) {
                var paymentInfo;
                var total = 0;
                var targetEl = $(e.target);
                var editableArr = this.$el.find('.editable:not(:has(input))');

                editableArr.each(function (index, el) {
                    total += parseFloat($(el).text());
                });

                paymentInfo = _.clone(this.model.get('paymentInfo'));
                paymentInfo.total = parseFloat(targetEl.val()) + total;

                this.model.set('paymentInfo', paymentInfo);
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

            editRow: function (e, prev, next) {
                var el = $(e.target);
                var tr = el.closest('tr');
                var wTrackId = tr.data('id');
                var tempContainer;
                var width;
                var editedElement;
                var editedCol;
                var editedElementValue;
                var paymentInfo;

                if (wTrackId && el.prop('tagName') !== 'INPUT') {
                    if (this.wTrackId) {
                        editedElement = this.$linwoiceGenerateTable.find('.editing');

                        if (editedElement.length) {

                            editedCol = editedElement.closest('td');
                            editedElementValue = editedElement.val();

                            editedCol.text(editedElementValue);
                            editedElement.remove();
                        }
                    }
                    this.wTrackId = wTrackId;
                }


                tempContainer = el.text();
                width = el.width() - 6;
                el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');

                return false;
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

                var thisEl = this.$el;

                var usersId = [];
                var groupsId = [];

                var selectedProducts = thisEl.find('.productItem');
                var products = [];
                var selectedLength = selectedProducts.length;
                var targetEl;
                var productId;
                var quantity;
                var price;
                var taxes;
                var amount;
                var description;

                var supplier = thisEl.find("#supplier").data("id") || null;
                var salesPersonId = thisEl.find("#assigned").data("id") || null;
                var paymentTermId = thisEl.find("#paymentTerms").data("id") || null;
                var invoiceDate = thisEl.find("#invoiceDate").val();
                var dueDate = thisEl.find("#dueDate").val();
                var name = thisEl.find("#invoiceName").val();

                var total = parseFloat(thisEl.find("#totalAmount").text());
                var unTaxed = parseFloat(thisEl.find("#totalUntaxes").text());
                var balance = parseFloat(thisEl.find("#balance").text());

                var project = thisEl.find("#project").data('id');

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
                            quantity = targetEl.find('[data-name="quantity"]').text() || 1;
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


                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") === "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") === "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });

                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var data = {
                    supplier: supplier,
                    invoiceDate: invoiceDate,
                    dueDate: dueDate,
                    project: project,

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
                    workflow: this.defaultWorkflow,
                    name: name

                };

                if (supplier) {
                    var model = new InvoiceModel();
                    model.save(data, {
                        wait: true,
                        success: function () {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/salesInvoice", {trigger: true});
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
                    position: {within: $("#wrapper")},
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
                populate.fetchWorkflow({
                    wId: 'Sales Invoice',
                    source: 'purchase',
                    targetSource: 'invoice'
                }, function (response) {
                    if (!response.error) {
                        self.defaultWorkflow = response._id;
                    }
                });

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
                this.$linwoiceGenerateTable = this.$el.find('#linwoiceGenerateTable');

                return this;
            }

        });

        return CreateView;
    });