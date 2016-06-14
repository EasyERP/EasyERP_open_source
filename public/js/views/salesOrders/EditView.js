define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/salesOrders/EditTemplate.html',
    'text!templates/salesOrders/ViewTemplate.html',
    'views/dialogViewBase',
    'views/Product/InvoiceOrder/ProductItems',
    'views/Projects/projectInfo/invoices/invoiceView',
    'collections/salesInvoices/filterCollection',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers'
], function (Backbone,
             $,
             _,
             EditTemplate,
             ViewTemplate,
             ParentView,
             ProductItemView,
             InvoiceView,
             InvoiceCollection,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             helpers) {
    'use strict';
    var EditView = ParentView.extend({
        contentType: 'Orders',
        imageSrc   : '',
        template   : _.template(EditTemplate),

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
            }

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            this.forSales = true;
            this.redirect = options.redirect;

            this.onlyView = !!options.onlyView;

            this.projectManager = options.projectManager;
            this.eventChannel = options.eventChannel;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/orders';
            this.responseObj = {};

            this.render(options);
        },

        events: {
            'click .receiveInvoice': 'receiveInvoice',
            'click .cancelOrder'   : 'cancelOrder',
            'click .setDraft'      : 'setDraft'
        },

        chooseOption: function (e) {
            var $targetEl = $(e.target);

            $targetEl.parents('dd').find('.current-selected').text($targetEl.text()).attr('data-id', $targetEl.attr('id'));
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
            var $dialogHolder;
            var closestEl = holder.closest('.dialog-tabs');
            var dataClass = closestEl.data('class');
            var selector = '.dialog-tabs-items.' + dataClass;
            var itemActiveSelector = '.dialog-tabs-item.' + dataClass + '.active';
            var itemSelector = '.dialog-tabs-item.' + dataClass;

            closestEl.find('a.active').removeClass('active');
            holder.addClass('active');

            n = holder.parents('.dialog-tabs').find('li').index(holder.parent());
            $dialogHolder = $(selector);

            $dialogHolder.find(itemActiveSelector).removeClass('active');
            $dialogHolder.find(itemSelector).eq(n).addClass('active');
        },

        cancelOrder: function (e) {
            var self = this;

            e.preventDefault();

            populate.fetchWorkflow({
                wId   : 'Purchase Order',
                status: 'Cancelled',
                order : 1
            }, function (workflow) {
                var redirectUrl = window.location.hash; // self.forSales ? "easyErp/salesOrders" : "easyErp/Orders";

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
                        $('.edit-dialog').remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
        },

        receiveInvoice: function (e) {
            var self = this;

            var url = '/invoices/receive';
            var orderId = this.currentModel.id;
            var data = {
                forSales: this.forSales,
                orderId : orderId,
                currency: this.currentModel.toJSON().currency,
                journal : CONSTANTS.INVOICE_JOURNAL
            };

            App.startPreload();

            if (e) {
                e.preventDefault();
            }

            this.saveItem(function (err) {
                App.stopPreload();

                if (!err) {
                    dataService.postData(url, data, function (err, response) {
                        var redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/Invoices';

                        if (err) {
                            App.render({
                                type   : 'error',
                                message: 'Can\'t receive invoice'
                            });
                        } else {
                            if (self.redirect) {
                                if (self.eventChannel) {
                                    self.eventChannel.trigger('invoiceReceive', response._id, true);
                                }
                            } else {
                                Backbone.history.navigate(redirectUrl, {trigger: true});
                            }
                        }
                    });
                }
            });
        },

        setDraft: function (e) {
            var self = this;

            e.preventDefault();

            populate.fetchWorkflow({
                wId: 'Quotation'
            }, function (workflow) {
                var redirectUrl = self.forSales ? 'easyErp/salesOrders' : 'easyErp/Orders';

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

        saveItem: function (invoiceCb) {
            var self = this;
            var mid = this.forSales ? 62 : 55;
            var thisEl = this.$el;
            var selectedProducts = thisEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var destination = $.trim(thisEl.find('#destination').data('id'));
            var incoterm = $.trim(thisEl.find('#incoterm').data('id'));
            var invoiceControl = $.trim(thisEl.find('#invoicingControl').data('id'));
            var paymentTerm = $.trim(thisEl.find('#paymentTerm').data('id'));
            var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').data('id'));
            var supplierReference = thisEl.find('#supplierReference').val();
            var orderDate = thisEl.find('#orderDate').val();
            var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#minScheduleDate').text();
            var total = helpers.spaceReplacer($.trim(thisEl.find('#totalAmount').text()));

            var unTaxed = helpers.spaceReplacer($.trim(thisEl.find('#totalUntaxes').text()));
            var totalTaxes = helpers.spaceReplacer($.trim(thisEl.find('#taxes').text()));
            var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            var targetEl;
            var productId;
            var quantity;
            var price;
            var taxes;
            var subtotal;
            var scheduledDate;
            var data;

            var usersId = [];
            var groupsId = [];
            var supplier;
            var project;
            var jobs;
            var currency;
            var i;

            total = parseFloat(total) * 100;
            unTaxed = parseFloat(unTaxed) * 100;
            totalTaxes = parseFloat(totalTaxes) * 100;

            if (thisEl.find('#currencyDd').attr('data-id')) {
                currency = {
                    _id : thisEl.find('#currencyDd').attr('data-id'),
                    name: thisEl.find('#currencyDd').text()
                };
            } else {
                currency = {
                    _id : null,
                    name: ''
                };
            }

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            supplier = thisEl.find('#supplierDd').attr('data-id');
            project = thisEl.find('#projectDd').attr('data-id');

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');
                    scheduledDate = targetEl.find('[data-name="scheduledDate"]').text();
                    quantity = targetEl.find('[data-name="quantity"]').text();
                    price = parseFloat(helpers.spaceReplacer(targetEl.find('[data-name="price"]').text())) * 100;
                    taxes = parseFloat(helpers.spaceReplacer(targetEl.find('.taxes').text())) * 100;
                    subtotal = parseFloat(helpers.spaceReplacer(targetEl.find('.subtotal').text())) * 100;
                    jobs = targetEl.find('[data-name="jobs"]').attr('data-content');

                    products.push({
                        product      : productId,
                        unitPrice    : price,
                        taxes        : taxes,
                        subTotal     : subtotal,
                        quantity     : quantity,
                        jobs         : jobs,
                        scheduledDate: scheduledDate
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
                destination      : destination || null,
                incoterm         : incoterm || null,
                invoiceControl   : invoiceControl || null,
                paymentTerm      : paymentTerm || null,
                fiscalPosition   : fiscalPosition || null,
                project          : project,
                whoCanRW         : whoCanRW,

                paymentInfo: {
                    total  : total,
                    unTaxed: unTaxed,
                    taxes  : totalTaxes
                },

                groups: {
                    owner: $('#allUsersSelect').attr('data-id'),
                    users: usersId,
                    group: groupsId
                }
            };

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },

                    patch: true,

                    success: function (model) {
                        self.hideDialog();

                        App.projectInfo = App.projectInfo || {};
                        App.projectInfo.currentTab = 'orders';

                        self.hideDialog();

                        if (self.eventChannel) {
                            self.eventChannel.trigger('orderUpdate');
                        }
                        if (invoiceCb && typeof invoiceCb === 'function') {
                            return invoiceCb(null);
                        }
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);

                        if (invoiceCb && typeof invoiceCb === 'function') {
                            return invoiceCb(xhr.text);
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

        deleteItem: function (event) {
            var mid = 55;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (!answer) {
                return;
            }

            this.currentModel.destroy({
                headers: {
                    mid: mid
                },

                success: function () {
                    $('.edit-product-dialog').remove();

                    App.projectInfo = App.projectInfo || {};
                    App.projectInfo.currentTab = 'orders';

                    self.hideDialog();

                    if (self.eventChannel) {
                        self.eventChannel.trigger('orderRemove');
                    }
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });

        },

        render: function () {
            var self = this;
            var formString;
            var service = true;
            var model;
            var productItemContainer;
            var buttons;

            this.template = !this.onlyView ? _.template(EditTemplate) : _.template(ViewTemplate);

            formString = this.template({
                model   : this.currentModel.toJSON(),
                visible : this.visible,
                onlyView: this.onlyView
            });

            if (!this.onlyView) {
                buttons = [
                    {
                        text : 'Save',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    },
                    {
                        text : 'Delete',
                        click: self.deleteItem
                    }
                ];
            } else {
                buttons = [
                    {
                        text : 'Close',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ];
            }

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Edit Order',
                width        : '900px',
                buttons      : buttons
            });

            this.renderAssignees(this.currentModel);

            populate.get('#destination', '/destination', {}, 'name', this, false, true);
            populate.get('#incoterm', '/incoterm', {}, 'name', this, false, true);
            populate.get('#invoicingControl', '/invoicingControl', {}, 'name', this, false, true);
            populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, false, true);
            populate.get('#deliveryDd', '/deliverTo', {}, 'name', this, false, true);
            populate.get2name('#supplierDd', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);

            this.delegateEvents(this.events);
            model = this.currentModel.toJSON();

            this.$el.find('#expectedDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });

            this.$el.find('#orderDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : 0,
                minDate    : model.orderDate
            });

            productItemContainer = this.$el.find('#productItemsHolder');

            productItemContainer.append(
                new ProductItemView({
                    editable       : false,
                    balanceVissible: false,
                    service        : service
                }).render({model: model}).el
            );

            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    $('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $('.groupsAndUser').append('<tr data-type="targetGroups" data-id="' + item._id + '"><td>' +
                            item.name + '</td><td class="text-right"></td></tr>');
                        $('#targetGroups').append('<li id="' + item._id + '">' + item.name + '</li>');
                    });
                    model.groups.users.forEach(function (item) {
                        $('.groupsAndUser').append('<tr data-type="targetUsers" data-id="' + item._id +
                            '"><td>' + item.login + '</td><td class="text-right"></td></tr>');
                        $('#targetUsers').append('<li id="' + item._id + '">' + item.login + '</li>');
                    });

                }
            }
            return this;
        }

    });

    return EditView;
});
