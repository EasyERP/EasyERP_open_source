define([
        'text!templates/Proforma/EditTemplate.html',
        'views/Assignees/AssigneesView',
        'views/Proforma/InvoiceProductItems',
        'views/salesInvoice/wTrack/wTrackRows',
        'views/Payment/ProformaCreateView',
        'views/Payment/list/ListHeaderInvoice',
        'common',
        'custom',
        'dataService',
        'populate',
        'constants',
        'helpers'
    ],
    function (EditTemplate, AssigneesView, InvoiceItemView, wTrackRows, PaymentCreateView, listHederInvoice, common, Custom, dataService, populate, CONSTANTS, helpers) {
        "use strict";

        var EditView = Backbone.View.extend({
            contentType: "Invoice",
            template   : _.template(EditTemplate),

            events: {
                "click #saveBtn"                                                  : "saveItem",
                "click #cancelBtn"                                                : "hideDialog",
                "click .current-selected"                                         : "showNewSelect",
                "click"                                                           : "hideNewSelect",
                'click .dialog-tabs a'                                            : 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .details"                                                  : "showDetailsBox",
                "click .newPayment"                                               : "newPayment",
                'click .approve'                                                  : 'approve',
                "click .cancelInvoice"                                            : "cancelInvoice",
                // "click .refund": "refund",
                "click .setDraft"                                                 : "setDraft"

            },

            initialize: function (options) {

                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");

                this.eventChannel = options.eventChannel;

                this.isWtrack = !!options.isWtrack;
                this.filter = options.filter;
                this.forSales = options.forSales;

                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/Invoice";
                this.responseObj = {};

                this.redirect = options.redirect;
                this.collection = options.collection;

                this.notCreate = !!options.notCreate;

                if (!App || !App.currentDb) {
                    dataService.getData('/currentDb', null, function (response) {
                        if (response && !response.error) {
                            App.currentDb = response;
                            App.weTrack = true;
                        } else {
                            console.log('can\'t fetch current db');
                        }

                        this.render();
                    });
                } else {
                    this.render();
                }

                /* this.render();*/
            },

            newPayment: function (e) {
                var paymentView;
                var self = this;

                e.preventDefault();

                this.saveItem(function (err, currency) {
                    if (!err) {
                        paymentView = new PaymentCreateView({
                            model     : self.currentModel,
                            redirect  : self.redirect,
                            collection: self.collection,
                            currency  : currency,
                            mid       : 95,
                            eventChannel: self.eventChannel
                        });
                    }
                });
            },

            cancelInvoice: function (e) {
                e.preventDefault();

                var wId;

                var self = this;
                var redirectUrl = self.forSales ? "easyErp/salesInvoice" : "easyErp/Invoice";

                if (self.forSales) {
                    wId = 'Sales Invoice';
                } else {
                    wId = 'Purchase Invoice';
                }

                populate.fetchWorkflow({
                    wId         : wId,
                    source      : 'purchase',
                    targetSource: 'invoice',
                    status      : 'Cancelled',
                    order       : 1
                }, function (workflow) {
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
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    });
                });
            },

            setDraft: function (e) {
                e.preventDefault();

                var self = this;
                var wId;

                if (self.forSales) {
                    wId = 'Sales Invoice';
                } else {
                    wId = 'Purchase Invoice';
                }

                var redirectUrl = self.forSales ? "easyErp/salesInvoice" : "easyErp/Invoice";

                populate.fetchWorkflow({
                    wId: wId
                }, function (workflow) {
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
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    });
                });
            },

            showDetailsBox: function (e) {
                $(e.target).parent().find(".details-box").toggle();
            },
            notHide       : function () {
                return false;
            },
            nextSelect    : function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect    : function (e) {
                this.showNewSelect(e, true, false);
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

            chooseUser: function (e) {
                $(e.target).toggleClass("choosen");
            },

            hideDialog: function () {
                $('.edit-invoice-dialog').remove();
            },

            approve: function (e) {
                var self = this;
                var data;
                var url;
                var proformaId;
                var $li;
                var $tr;
                var $priceInputs;
                var payBtnHtml;
                var $currencyDd

                e.preventDefault();

                proformaId = self.currentModel.get('_id');
                $li = $('button.approve').parent('li');
                $tr = $('tr[data-id=' + proformaId + ']');
                $priceInputs = self.$el.find('td[data-name="price"]');
                $currencyDd = self.$el.find('#currencyDd');

                App.startPreload();

                payBtnHtml = '<button class="btn newPayment"><span>Pay</span></button>';
                url = '/invoice/approve';
                data = {
                    invoiceId: proformaId
                };

                dataService.patchData(url, data, function (err, response) {
                    if (!err) {

                        self.currentModel.set({approved: true});
                        $li.html(payBtnHtml);
                        $currencyDd.removeClass('current-selected');
                        $priceInputs.each(function() {
                            var $td = $(this);
                            var price = $td.find('input').val();

                            $td.html('<span>' + price + '</span>');
                        });

                        App.stopPreload();

                    } else {
                        App.render({
                            type   : 'error',
                            message: 'Approve fail'
                        });
                    }
                });
            },

            saveItem: function (paymentCb) {
                var self = this;
                var mid = 56;

                var $thisEl = this.$el;

                var errors = $thisEl.find('.errorContent');
                var selectedProducts = $thisEl.find('.productItem');
                var products = [];
                var selectedLength = selectedProducts.length;
                var targetEl;
                var productId;
                var journalId;
                var quantity;
                var price;
                var description;
                var taxes;
                var jobs;
                var amount;
                var data;
                var workflow = this.currentModel.workflow ? this.currentModel.workflow : this.currentModel.get('workflow');
                var salesPerson = this.currentModel.salesPerson ? this.currentModel.salesPerson : this.currentModel.get('salesPerson');
                var productsOld = this.currentModel.products ? this.currentModel.products : this.currentModel.get('products');
                var currency = {
                    _id : $thisEl.find('#currencyDd').attr('data-id'),
                    name: $.trim($thisEl.find('#currencyDd').text())
                };

                var invoiceDate = $thisEl.find("#invoice_date").val() || $thisEl.find('#inv_date').text();
                var dueDate = $thisEl.find("#due_date").val();

                var supplier = $thisEl.find('#supplier').attr("data-id");

                var total = parseFloat(helpers.spaceReplacer($thisEl.find("#totalAmount").text())) * 100;
                var unTaxed = parseFloat(helpers.spaceReplacer($thisEl.find("#totalUntaxes").text())) * 100;
                var balance = parseFloat(helpers.spaceReplacer($thisEl.find("#balance").text())) * 100;
                var taxes = parseFloat(helpers.spaceReplacer($thisEl.find("#taxes").text())) * 100;

                var payments = {
                    total  : total,
                    unTaxed: unTaxed,
                    balance: balance,
                    taxes  : taxes
                };

                var salesPersonId = $thisEl.find("#salesPerson").attr("data-id") || null;
                var paymentTermId = $thisEl.find("#payment_terms").attr("data-id") || null;
                var journalId = this.$el.find('#journal').attr("data-id") || null;

                var usersId = [];
                var groupsId = [];

                var whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();

                if (errors.length) {
                    return false;
                }

                if (selectedLength) {
                    for (var i = selectedLength - 1; i >= 0; i--) {
                        targetEl = $(selectedProducts[i]);
                        productId = targetEl.data('id');

                        if (productId) {
                            quantity = targetEl.find('[data-name="quantity"]').text();
                            price = targetEl.find('[data-name="price"] input').val() || targetEl.find('[data-name="price"] span').text();
                            jobs = targetEl.find('[data-name="jobs"]').attr("data-content");
                            taxes = targetEl.find('.taxes').text();
                            amount = helpers.spaceReplacer(targetEl.find('.amount').text());

                            products.push({
                                product    : productId,
                                jobs       : jobs,
                                unitPrice  : price,
                                quantity   : quantity,
                                taxes      : taxes,
                                subTotal   : amount
                            });
                        }
                    }
                }

                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });

                data = {
                    currency             : currency,
                    supplier             : supplier,
                    fiscalPosition       : null,
                    //sourceDocument: $.trim(this.$el.find('#source_document').val()),
                    supplierInvoiceNumber: $.trim(this.$el.find('#supplier_invoice_num').val()),
                    //name            : $.trim(this.$el.find('#supplier_invoice_num').val()), //changed For Yana
                    //paymentReference: $.trim(this.$el.find('#payment_reference').val()),
                    invoiceDate          : invoiceDate,
                    dueDate              : dueDate,
                    account              : null,
                    journal              : journalId,

                    salesPerson : salesPerson,
                    paymentTerms: paymentTermId,

                    products   : products,
                    paymentInfo: payments,

                    groups  : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW,
                    workflow: workflow,
                };

                if (supplier) {
                    this.model.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        patch  : true,
                        success: function (err, result) {
                            var $dueDateEl;
                            var url = window.location.hash;
                            var redirectUrl = self.forSales ? "easyErp/salesInvoice" : "easyErp/Invoice";

                            self.hideDialog();

                            if (paymentCb && typeof paymentCb === 'function') {
                                return paymentCb(null, currency);
                            }

                            self.eventChannel && self.eventChannel.trigger('savedProforma');

                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);

                            if (paymentCb && typeof paymentCb === 'function') {
                                return paymentCb(xhr.text);
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

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption : function (e) {
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },

            deleteItem: function (event) {
                var url = window.location.hash;
                var self = this;

                // var redirectUrl = this.forSales ? url : "easyErp/Invoice";

                event.preventDefault();

                var answer = confirm("Really DELETE items ?!");
                if (answer == true) {
                    this.currentModel.destroy({
                        success: function () {
                            $('.edit-invoice-dialog').remove();
                            self.hideDialog();
                            self.eventChannel && self.eventChannel.trigger('proformaRemove');
                        },
                        error  : function (model, err) {
                            if (err.status === 403) {
                                App.render({
                                    type   : 'error',
                                    message: "You do not have permission to perform this action"
                                });
                            }
                        }
                    });
                }

            },

            render: function () {
                var self = this;
                var formString;
                var notDiv;
                var model;
                var invoiceItemContainer;
                var paymentContainer;
                var wTracks;
                var project;
                var assigned;
                var customer;
                var total;
                var wTracksDom;
                var buttons;
                var invoiceDate;
                var isFinancial;

                model = this.currentModel.toJSON();
                invoiceDate = model.invoiceDate;

                this.isPaid = !!(model && model.workflow && model.workflow.status !== 'New');

                this.notAddItem = true;

                if (this.isWtrack) {
                    wTracks = _.map(model.products, function (product) {
                        return product.product;
                    });
                    project = model.project;
                    assigned = model.salesPerson;
                    customer = model.supplier;
                    total = model.paymentInfo ? model.paymentInfo.total : '0.00';
                }

                isFinancial = CONSTANTS.INVOICE_APPROVE_PROFILES.indexOf(App.currentUser.profile._id) !== -1;

                formString = this.template({
                    model           : this.currentModel.toJSON(),
                    isWtrack        : self.isWtrack,
                    isPaid          : this.isPaid,
                    notAddItem      : this.notAddItem,
                    wTracks         : wTracks,
                    project         : project,
                    assigned        : assigned,
                    customer        : customer,
                    total           : total,
                    currencySplitter: helpers.currencySplitter,
                    isFinancial     : isFinancial
                });

                if (this.isWtrack || this.isPaid) {
                    buttons = [
                        {
                            text : this.isPaid ? "Close" : 'Cancel',
                            click: function () {
                                self.hideDialog();
                            }
                        }/*,
                         {
                         text : "Delete",
                         click: self.deleteItem
                         }*/
                    ];
                } else {
                    buttons = [
                        {
                            text : "Save",
                            click: self.saveItem
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
                }

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-invoice-dialog",
                    title        : "Edit Invoice",
                    width        : self.isWtrack ? '1200' : '900',
                    position     : {my: "center bottom", at: "center", of: window},
                    buttons      : buttons

                });

                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                paymentContainer = this.$el.find('#payments-container');
                paymentContainer.append(
                    new listHederInvoice().render({model: this.currentModel.toJSON()}).el
                );

                populate.get2name("#supplier", "/supplier", {}, this, false);
                populate.get2name("#salesPerson", "/getForDdByRelatedUser", {}, this, true, true);
                populate.get("#paymentTerm", "/paymentTerm", {}, 'name', this, true, true);
                populate.get("#currencyDd", "/currency/getForDd", {}, 'name', this, true);
              //  populate.get("#journal", "/journal/getForDd", {}, 'name', this, true);

                if (model.workflow.status !== 'New') {
                    this.$el.find('#invoice_date').datepicker({
                        dateFormat : "d M, yy",
                        changeMonth: true,
                        changeYear : true,
                        disabled   : true,
                        maxDate    : 0,
                        onSelect   : function () {
                            var dueDatePicker = $('#due_date');
                            var endDate = $(this).datepicker('getDate');

                            endDate.setDate(endDate.getDate());

                            dueDatePicker.datepicker('option', 'minDate', endDate);
                        }
                    });
                } else {
                    this.$el.find('#invoice_date').datepicker({
                        dateFormat : "d M, yy",
                        changeMonth: true,
                        changeYear : true,
                        minDate    : new Date(model.sourceDocument.orderDate),
                        maxDate    : 0,
                        onSelect   : function () {
                            var dueDatePicker = $('#due_date');
                            var endDate = $(this).datepicker('getDate');

                            endDate.setDate(endDate.getDate());

                            dueDatePicker.datepicker('option', 'minDate', endDate);
                        }
                    });
                }

                this.$el.find('#due_date').datepicker({
                    defaultValue: invoiceDate,
                    dateFormat  : "d M, yy",
                    changeMonth : true,
                    changeYear  : true,
                    onSelect    : function () {
                        var targetInput = $(this);

                        targetInput.removeClass('errorContent');
                    }
                }).datepicker('option', 'minDate', invoiceDate);

                this.delegateEvents(this.events);

                invoiceItemContainer = this.$el.find('#invoiceItemsHolder');

                invoiceItemContainer.append(
                    new InvoiceItemView({
                        balanceVisible: true,
                        forSales      : self.forSales,
                        isPaid        : this.isPaid,
                        notAddItem    : this.notAddItem,
                        paid          : this.model.get('paymentInfo').paid,
                        approved      : model.approved
                    }).render({model: model}).el
                );

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

                App.stopPreload();

                return this;
            }

        });

        return EditView;
    });
