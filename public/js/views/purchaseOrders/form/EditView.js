define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/purchaseOrders/form/FormView',
    'text!templates/order/baseForm/baseFormEditTemplate.html',
    'text!templates/order/baseForm/baseFormViewTemplate.html',
    'models/goodsInNotesModel',
    'views/Products/orderRows/ProductItems',
    'views/goodsInNotes/CreateView',
    'views/Payment/CreateView',
    'views/guideTours/guideNotificationView',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers',
    'services/showJournalEntries'
], function (Backbone,
             $,
             _,
             ParentView,
             EditTemplate,
             ViewTemplate,
             GoodsInNote,
             ProductItemView,
             CreateView,
             PaymentCreateView,
             GuideNotify,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             helpers,
             journalService) {

    var EditView = ParentView.extend({
        contentType: 'purchaseOrders',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        forSales   : false,
        service    : false,
        el         : '.form-holder',

        initialize: function (options) {
            var modelObj;

            if (options) {
                this.visible = options.visible;
            }

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/purchaseOrders';
            this.responseObj = {};
            this.editablePrice = this.currentModel.get('workflow').status === 'New' || false;
            this.warehouse = this.currentModel.get('warehouse');
            this.editable = options.editable || true;
            this.balanceVissible = false;
            modelObj = this.currentModel.toJSON();
            this.onlyView = (modelObj.workflow && modelObj.workflow.status === 'Done');
        },

        resetPrices: function (e) {
            var rowId = this.$el.find('.productItem');
            var priceList = this.$el.find('#priceList').attr('data-id');

            var rows = [];
            var body = {
                priceList: priceList,
                rows     : rows
            };
            var self = this;
            e.preventDefault();

            rowId.each(function () {
                var product = $(this).find('.productsDd').attr('data-id');
                var quantity = $(this).find('input#quantity').val();

                rows.push({
                    orderRowId: $(this).attr('data-id'),
                    product   : product,
                    quantity  : parseFloat(quantity)
                });
            });

            this.saveItem(function (err) {
                if (!err) {

                    dataService.postData('/priceList/resetPrices', body, function (err, data) {
                        var info = self.model.get('paymentInfo');
                        if (data) {
                            data.rows.forEach(function (row) {
                                var existedProduct = _.findWhere(self.model.get('products'), {_id: row.orderRowId});

                                if (!existedProduct) {
                                    existedProduct = {};
                                }

                                existedProduct.subTotal = helpers.currencySplitter(row.priceAll.toFixed(2));
                                existedProduct.unitPrice = helpers.currencySplitter(row.price.toFixed(2));
                                existedProduct.quantity = row.quantity;

                            });
                            info.total = helpers.currencySplitter(data.info ? data.info.total.toFixed(2) : '0');
                            info.unTaxed = helpers.currencySplitter(data.info ? data.info.total.toFixed(2) : '0');

                        }

                        self.ProductItemView.render();

                    });
                }
            });

        },

        cancelOrder: function (e) {
            var self = this;
            var canceledObj;

            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            canceledObj = _.find(this.responseObj['#workflowsDd'], function (el) {
                return el.status === 'Cancelled';
            });

            if (this.currentModel.toJSON().workflow.status === 'Done') {
                canceledObj = this.currentModel.toJSON().workflow;
            }

            self.currentModel.save({
                workflow: canceledObj._id
                // cancel  : true
            }, {
                headers: {
                    mid: 57
                },
                patch  : true,
                success: function () {
                    var url = window.location.hash;

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var $targetElement = $(e.target).closest('a');
            var symbol;
            var currency;
          var warehouse;
          var account;
          var table = this.$el.find('#productItemsHolder');
          var trs = table.find('tr.productItem');
          var accountObj;

            if ($target.closest('a').attr('id') === 'currencyDd') {
                currency = _.findWhere(this.responseObj['#currencyDd'], {_id: $target.attr('id')});
                symbol = currency ? currency.currency : '$';
                $targetElement.attr('data-symbol', symbol);
                $targetElement.text($(e.target).text());
                $targetElement.attr('data-id', id);
                this.$el.find('.currencySymbol').text(symbol);
            } else if ($target.closest('a').attr('id') === 'workflowsDd' && $(e.target).attr('data-status') === 'cancelled') {
                this.cancelOrder(e);
            } else if ($target.closest('a').attr('id') === 'warehouseDd') {
              warehouse = _.findWhere(this.responseObj['#warehouseDd'], {_id: $target.attr('id')});
              account = warehouse ? warehouse.account : null;
              accountObj = _.findWhere(this.responseObj['#account'], {_id: account});

              if (accountObj && accountObj._id) {
                trs.each(function () {
                  var self = this;

                  $(this).find('.accountDd').text(accountObj.name).attr('data-id', accountObj._id);

                  if ($(this).find('.productsDd').attr('data-id')) {
                    dataService.getData('/products/productAvalaible', {
                      product  : $(this).find('.productsDd').attr('data-id'),
                      warehouse: warehouse._id
                    }, function (data) {
                      var itemsStock = data.onHand ? 'green' : 'red';
                      var fullfilledHolder = $(self).next().find('.fullfilledHolder');

                      fullfilledHolder.removeClass('green red');

                      fullfilledHolder.addClass(itemsStock);
                      $(self).attr('data-hand', data.onHand);
                      fullfilledHolder.find('.fullfilledInfo').html('<div><span>' + (data.inStock || 0) + ' in Stock, ' + (data.onHand || 0) + ' on Hand </span></div>');
                    });
                  }

                });
              } else {
                return App.render({
                  type   : 'error',
                  message: 'There is no account in this warehouse, please go to Settings and set it.'
                });
              }
            }

            $targetElement.text($(e.target).text()).attr('data-id', id);

            this.hideNewSelect();
        },

        saveOrder: function (e) {
            e.preventDefault();
            this.gaTrackingEditConfirm();
            this.saveItem();
        },

        receiveInvoice: function (e) {
            var self = this;
            var url = '/purchaseInvoices/receive';
            var journal = CONSTANTS.INVOICE_PURCHASE;
            var data = {
                forSales: this.forSales,
                orderId : this.currentModel.id,
                currency: this.currentModel.currency,
                journal : journal
            };
            var creditAccount = this.$el.find('#account').attr('data-id');
            var stockReceivedNotInvoiced = _.findWhere(this.responseObj['#account'], {_id: CONSTANTS.STOCK_RECEIVED_NOT_INVOICED});

            if (!this.onlyView && creditAccount !== CONSTANTS.STOCK_RECEIVED_NOT_INVOICED) {
                this.$el.find('#account').text(stockReceivedNotInvoiced.name).attr('data-id', stockReceivedNotInvoiced._id);
            }

            creditAccount = this.$el.find('#account').attr('data-id');

            if (!creditAccount) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, choose Payable Accrual Account first'
                });
            }

            e.preventDefault();
            e.stopPropagation();

            this.saveItem(function (err) {
                if (!err) {
                    dataService.postData(url, data, function (err) {
                        var redirectUrl = 'easyErp/purchaseInvoices';

                        if (err) {
                            App.render({
                                type   : 'error',
                                message: 'Can\'t create invoice'
                            });
                        } else {
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    });
                }
            });
        },

        saveItem: function (invoiceCb) {
            var self = this;
            var mid = 129;
            var thisEl = this.$el;
            var selectedProducts = thisEl.find('.productItem');
            var products = [];
            var data;
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var quantity;
            var price;
            var description;
            var subTotal;
            var scheduledDate;
            var taxes;
            var supplier = thisEl.find('#supplierDd').data('id');
            var orderRows = this.model.get('products');
            var paymentMethod = $.trim(thisEl.find('#paymentMethod').attr('data-id')) || null;
            var destination = $.trim(thisEl.find('#destination').data('id'));
            var priceList = $.trim(thisEl.find('#priceList').data('id'));
            var paymentTerm = $.trim(thisEl.find('#paymentTerm').data('id'));
            var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').data('id'));
            var supplierReference = thisEl.find('#supplierReference').val();
            var orderDate = thisEl.find('#orderDate').val() || thisEl.find('#orderDate').text();
            var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#expectedDate').text();
            var assignedTo = $.trim(thisEl.find('#assignedTo').attr('data-id'));
            var creditAccount = $.trim(thisEl.find('#account').attr('data-id'));
            var workflowStatus = $.trim(thisEl.find('#workflowsDd').text());

            var total = helpers.spaceReplacer($.trim(thisEl.find('#totalAmount').text()));
            var totalTaxes = helpers.spaceReplacer($.trim(thisEl.find('#taxes').text()));
            var unTaxed = helpers.spaceReplacer($.trim(thisEl.find('#totalUntaxes').text()));
            var discount = helpers.spaceReplacer($.trim(thisEl.find('#discount').val()));
            var workflow = $.trim(thisEl.find('#workflowsDd').attr('data-id'));
            var account;
            var currency;
            var allocateProducts = [];
            var cost;
            var i;
            var orderRow;
            var id;
            var taxCode;
            var shippingAmount;
            var shippingAccount;
            var shippingId;

            if (workflowStatus === 'Cancelled') {
                return App.render({
                    type   : 'error',
                    message: 'Please, change status fom Cancelled to another.'
                });
            }

            if (!paymentMethod) {
                return App.render({
                    type   : 'error',
                    message: "Bank Account can't be empty."
                });
            }

            unTaxed = parseFloat(unTaxed) * 100;
            total = parseFloat(total) * 100;
            totalTaxes = parseFloat(totalTaxes) * 100;
            discount = parseFloat(discount) * 100;

            if (thisEl.find('#currencyDd').attr('data-id')) {
                currency = {
                    _id : thisEl.find('#currencyDd').attr('data-id'),
                    name: thisEl.find('#currencyDd').text()
                };
            } else {
                currency = {
                    _id : App.organizationSettings && App.organizationSettings.currency ? App.organizationSettings.currency._id : 'USD',
                    name: App.organizationSettings && App.organizationSettings.currency ? App.organizationSettings.currency.name : 'USD'
                };
            }

            shippingId = thisEl.find('#shippingDd').attr('data-id');
            shippingAccount = thisEl.find('#shippingRow').find('.accountDd').attr('data-id');
            shippingAmount = helpers.spaceReplacer(thisEl.find('#shippingRow').find('[data-name="price"] input').val()) || helpers.spaceReplacer(thisEl.find('#shippingRow').find('[data-name="price"] span:not(.currencySymbol)').text());
            shippingAmount = shippingAmount || 0;

            shippingAmount = parseFloat(shippingAmount) * 100;

            if (selectedLength && !this.onlyView) {
                if (shippingId || shippingAccount) {
                    selectedLength += 1;
                }

                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = selectedProducts.length === i ? this.$el.find('#shippingRow') : $(selectedProducts[i]);
                    id = targetEl.data('id');
                    productId = targetEl.find('.productsDd').attr('data-id');
                    account = targetEl.find('.accountDd').attr('data-id');
                    taxCode = targetEl.find('.current-selected.taxCode').attr('data-id');

                    if (productId || shippingAccount) {  // added more info for save

                        quantity = $.trim(targetEl.find('[data-name="quantity"]').text()) || targetEl.find('[data-name="quantity"] input').val();
                        quantity = parseFloat(quantity);
                        price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val()) || helpers.spaceReplacer(targetEl.find('[data-name="price"] span').text());
                        price = parseFloat(price) * 100;
                        scheduledDate = $.trim(targetEl.find('[data-name="scheduledDate"]').text());
                        taxes = helpers.spaceReplacer($.trim(targetEl.find('[data-name="taxes"] .sum').text()));
                        taxes = parseFloat(taxes) * 100;
                        cost = helpers.spaceReplacer($.trim(targetEl.find('[data-name="cost"] .sum').text()));
                        cost = parseFloat(cost) * 100;
                        description = targetEl.find('textarea.productDescr').val() || targetEl.find('[data-name="productDescr"]').text();

                        subTotal = helpers.spaceReplacer($.trim(targetEl.find('.subtotal .sum').text()));
                        subTotal = parseFloat(subTotal) * 100;

                        if (!quantity) {
                            return App.render({
                                type   : 'error',
                                message: 'Quantity can\'t be empty'
                            });
                        }

                        if (id) {
                            orderRow = _.findWhere(orderRows, {_id: id});

                            if (orderRow && orderRow.fulfilled && orderRow.fulfilled > quantity) {
                                quantity = orderRow.fulfilled;
                            }
                        }

                        if (productId && !price) {
                            return App.render({
                                type   : 'error',
                                message: 'Unit price can\'t be empty'
                            });
                        }

                        products.push({
                            id           : id,
                            warehouse    : this.warehouse,
                            product      : productId,
                            costPrice    : cost,
                            unitPrice    : price,
                            quantity     : quantity,
                            scheduledDate: scheduledDate,
                            taxes        : [{
                                taxCode: taxCode || null,
                                tax    : taxes
                            }],

                            description  : description,
                            subTotal     : subTotal,
                            debitAccount : account || null,
                            creditAccount: creditAccount || null,
                            taxCode      : taxCode || null,
                            totalTaxes   : taxes || 0
                        });
                    }
                }
            }

            data = {
                currency         : currency,
                supplier         : supplier,
                supplierReference: supplierReference,
                paymentMethod    : paymentMethod,
                priceList        : priceList,
                expectedDate     : expectedDate,
                destination      : destination || null,
                invoiceControl   : priceList || null,
                paymentTerm      : paymentTerm || null,
                fiscalPosition   : fiscalPosition || null,
                workflow         : workflow,
                salesPerson      : assignedTo,
                shippingMethod   : shippingId,
                shippingExpenses : {
                    account: shippingAccount,
                    amount : shippingAmount
                },

                paymentInfo: {
                    total   : total,
                    unTaxed : unTaxed + shippingAmount,
                    taxes   : totalTaxes,
                    discount: discount
                }
            };

            if (this.currentModel.toJSON().orderDate !== orderDate) {
                orderDate = helpers.setTimeToDate(orderDate);

                data.orderDate = orderDate;
            }

            if (!this.onlyView) {
                data.orderRows = products;
            }

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    patch  : true,
                    success: function () {
                        function callBack() {
                            var hash = window.location.hash;

                            if (invoiceCb && typeof invoiceCb === 'function') {
                                return self.model.fetch({
                                    success: function () {
                                        invoiceCb(null);
                                    }
                                });

                            }

                            Backbone.history.fragment = '';
                            Backbone.history.navigate(hash, {trigger: true});
                            self.hideDialog();
                        }

                        if (allocateProducts && allocateProducts.length) {
                            self.createAllocation(allocateProducts, callBack);
                        } else {
                            callBack();
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

        receiveInventory: function (e) {
            var self = this;
            var creditAccount = this.$el.find('#account').attr('data-id');
            var stockReceivedNotInvoiced = _.findWhere(this.responseObj['#account'], {_id: CONSTANTS.STOCK_RECEIVED_NOT_INVOICED});

            e.preventDefault();

            if (!this.onlyView && creditAccount !== CONSTANTS.STOCK_RECEIVED_NOT_INVOICED && stockReceivedNotInvoiced) {
                this.$el.find('#account').text(stockReceivedNotInvoiced.name).attr('data-id', stockReceivedNotInvoiced._id);
            }

            creditAccount = this.$el.find('#account').attr('data-id');

            if (!creditAccount) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, choose Payable Accrual Account first'
                });
            }

            this.saveItem(function () {
                return new CreateView({orderModel: self.model});
            });
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var productItemContainer;

            this.template = _.template(EditTemplate);

            if (this.onlyView/* && this.currentModel.toJSON().status.fulfillStatus === 'ALL'*/) {
                $('.saveBtn').addClass('hidden');
                this.template = _.template(ViewTemplate);
            } else {
                $('.saveBtn').removeClass('hidden');
            }

            formString = this.template({
                model      : this.currentModel.toJSON(),
                visible    : this.visible,
                onlyView   : this.onlyView,
                forSales   : this.forSales,
                notEditable: this.notEditable
            });

            $thisEl.html(formString);

            this.delegateEvents(this.events);

            if (!this.onlyView/* || this.currentModel.toJSON().status.fulfillStatus !== 'ALL'*/) {

                populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);
                populate.get('#destination', '/destination', {}, 'name', this, false, true);
                populate.get('#priceList', 'priceList/getForDd', {cost: true}, 'name', this, true, true);
                populate.get('#invoicingControl', '/invoicingControl', {}, 'name', this, false, true);
                populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, false, true);
                populate.get('#deliveryDd', '/deliverTo', {}, 'name', this, false, true);
                populate.get2name('#supplierDd', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);
                populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {
                    id    : 'Purchase Order',
                    status: {$ne: 'Done'}
                }, 'name', this);
                populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, false, true, null);
                populate.get('#account', '/chartOfAccount/getForDd', {}, 'name', this, true, true);
                populate.get('#taxCode', '/taxSettings/getForDd', {}, 'name', this, true, true);
                populate.get('#warehouseDd', 'warehouse/getForDd', {}, 'name', this, true, true);

                this.$el.find('#expectedDate').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    minDate    : new Date()
                });

                this.$el.find('#orderDate').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function (date) {
                        self.$el.find('#expectedDate').datepicker('option', 'minDate', new Date(date));

                        if (self.$el.find('#expectedDate').val() < self.$el.find('#orderDate').val()) {
                            self.$el.find('#expectedDate').datepicker('setDate', new Date(date));
                        }
                    }
                });

                dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee;
                    });

                    self.responseObj['#assignedTo'] = employees;
                });

            }

            productItemContainer = this.$el.find('#productItemsHolder');

            if (this.onlyView) {
                this.notEditable = true;
            }

            this.ProductItemView = new ProductItemView({
                notEditable     : self.notEditable,
                editablePrice   : self.editablePrice,
                balanceVissible : self.balanceVissible,
                parentModel     : self.model,
                discountVisible : true,
                availableVisible: true,
                forSales        : true,
                canBeSold       : true,
                service         : self.service,
                warehouse       : this.warehouse,
                responseObj     : this.responseObj
            });

            productItemContainer.append(
                self.ProductItemView.render().el
            );

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

            return this;
        }

    });

    return EditView;
});
