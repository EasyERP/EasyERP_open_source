define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/order/form/FormView',
    'text!templates/order/baseForm/baseFormEditTemplate.html',
    'text!templates/order/baseForm/baseFormViewTemplate.html',
    'views/NoteEditor/NoteView',
    'models/goodsOutNotesModel',
    'views/Products/orderRows/ProductItems',
    'views/goodsOutNotes/CreateView',
    'views/Payment/CreateView',
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
             NoteEditor,
             GoodsOutNote,
             ProductItemView,
             CreateView,
             PaymentCreateView,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             helpers,
             journalService) {

    var EditView = ParentView.extend({
        contentType: 'order',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        forSales   : true,
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
            this.currentModel.urlRoot = '/order';
            this.responseObj = {};
            this.warehouse = this.currentModel.get('warehouse');
            this.eventChannel = options.eventChannel;
            this.editable = options.editable || true;
            this.balanceVissible = false;
            modelObj = this.currentModel.toJSON();
            this.onlyView = (modelObj.workflow && modelObj.workflow.status === 'Done');
            this.deletedProducts = [];

            App.stopPreload();
        },

        changeAllocation: function (e) {
            var $target = $(e.target);

            $target.addClass('changed');
        },

        cancelOrder: function (e) {
            var self = this;
            var canceledObj;
            var answer = confirm('Do you really want to Cancel Order? All products will be returned.');

            if (!answer){
                return false;
            }

            e.preventDefault();
            e.stopPropagation();

            canceledObj = _.find(this.responseObj['#workflowsDd'], function (el) {
                return el.status === 'Cancelled';
            });

            if (this.currentModel.toJSON().workflow.status === 'Done') {
                canceledObj = this.currentModel.toJSON().workflow;
            }

            self.currentModel.save({
                workflow: canceledObj._id,
                cancel  : true,
                forSales: true
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

        splitFulfil: function (e) {
            var self = this;
            var debitAccount = this.$el.find('#account').attr('data-id');
            var costOfGoodSold = _.findWhere(this.responseObj['#account'], {_id: CONSTANTS.COGS});

            if (!this.checkActiveClass(e)) {
                return false;
            }

            if (!this.onlyView && debitAccount !== CONSTANTS.COGS) {
                this.$el.find('#account').text(costOfGoodSold.name).attr('data-id', costOfGoodSold._id);
            }

            debitAccount = this.$el.find('#account').attr('data-id');

            if (!debitAccount) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, choose COGS Account first'
                });
            }

            e.preventDefault();

            this.saveItem(function () {
                return new CreateView({orderModel: self.model});
            });
        },

        receiveInvoice: function (e) {
            var self = this;
            var url = '/invoice/receive';
            var journal = this.forSales ? CONSTANTS.INVOICE_JOURNAL : CONSTANTS.INVOICE_PURCHASE;
            var data = {
                forSales: this.forSales,
                orderId : this.currentModel.id,
                currency: this.currentModel.currency,
                journal : journal
            };
            var debitAccount = this.$el.find('#account').attr('data-id');
            var costOfGoodSold = _.findWhere(this.responseObj['#account'], {_id: CONSTANTS.COGS});

            if (!this.onlyView && debitAccount !== CONSTANTS.COGS) {
                this.$el.find('#account').text(costOfGoodSold.name).attr('data-id', costOfGoodSold._id);
            }

            debitAccount = this.$el.find('#account').attr('data-id');

            if (!debitAccount) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, choose COGS Account first'
                });
            }

            e.preventDefault();

            this.saveItem(function (err) {
                if (!err) {
                    dataService.postData(url, data, function (err) {
                        var redirectUrl = 'easyErp/invoice';

                        if (err) {
                            App.render({
                                type   : 'error',
                                message: 'Can\'t create invoice'
                            });
                        } else {
                            if (self.eventChannel) {
                                return self.eventChannel.trigger('invoiceReceive', null, true);
                            }

                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    });
                }
            });
        },

        fullfillShip: function (e) {
            var self = this;
            var $target = $(e.target).closest('a');
            var goodsNote = new GoodsOutNote();
            var isShip = $target.attr('id') === 'fulfilAndShip';
            var rowId = this.$el.find('.productItem');
            var data;
            var rows = [];
            var debitAccount = this.$el.find('#account').attr('data-id');
            var costOfGoodSold = _.findWhere(this.responseObj['#account'], {_id: CONSTANTS.COGS});
            var answer;

            if (!this.checkActiveClass(e)) {
                return false;
            }

            if (!this.onlyView && debitAccount !== CONSTANTS.COGS) {
                this.$el.find('#account').text(costOfGoodSold.name).attr('data-id', costOfGoodSold._id);
            }

            debitAccount = this.$el.find('#account').attr('data-id');

            if (this.$el.find('.changedPrice').length) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save changes before'
                });
            }

            if (!debitAccount) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, choose COGS Account first'
                });
            }

            e.preventDefault();

            rowId.each(function () {
                var allocatedAll = $(this).find('input#quantity').val() || $(this).find('[data-name="quantity"] span').text();
                var fullfield = $(this).find('#fullfilled').text();
                var product = $(this).find('.productsDd').attr('data-id');
                var lastQuantity = parseInt(allocatedAll, 10) - fullfield;
                var onHand = parseInt($(this).attr('data-hand'), 10);

                allocatedAll = parseInt(allocatedAll, 10);

                if (lastQuantity > onHand) {
                    lastQuantity = onHand;
                }

                if (lastQuantity) {
                    if (lastQuantity !== allocatedAll) {
                        if (onHand) {
                            rows.push({
                                orderRowId: $(this).attr('data-id'),
                                quantity  : lastQuantity,
                                product   : product
                            });
                        }
                    } else {
                        rows.push({
                            orderRowId: $(this).attr('data-id'),
                            quantity  : lastQuantity,
                            product   : product
                        });
                    }

                }

            });

            data = {
                orderRows: rows,
                order    : this.model.get('_id'),
                name     : this.model.get('name'),
                warehouse: this.warehouse
            };
            if (isShip) {
                data['status.shipped'] = true;
            }

            answer = confirm('Do you really want to Fulfill');

            if (rows.length && answer) {
                this.saveItem(function () {
                    var shipping = self.model.get('shippingMethod');
                    var shippingExpenses = self.model.get('shippingExpenses');

                    data.shippingMethod = shipping && shipping._id ? shipping._id : shipping;
                    data.shippingCost = shippingExpenses && shippingExpenses.amount ? shippingExpenses.amount : 0;

                    goodsNote.save(data, {
                        headers: {
                            mid: 57
                        },
                        patch  : true,
                        success: function () {
                            Backbone.history.fragment = '';
                            return Backbone.history.navigate(window.location.hash, {trigger: true});
                        },

                        error: function (model, err) {
                            var message = err.message;
                            if (err.status === 404) {
                                message = 'Not enough available products';
                            }
                            App.render({
                                type   : 'error',
                                message: message
                            });
                        }
                    });
                });
            } else if (!rows.length) {
                App.render({
                    type   : 'error',
                    message: 'No items for fulfill'
                });
            }

        },

        createAllocation: function (array, cb) {
            var body = {
                data : array,
                order: this.model.id
            };

            dataService.postData('warehouse/allocate', body, function (err) {
                if (err) {
                    App.render({
                        type   : 'error',
                        message: err.message
                    });
                } else {
                    App.render({
                        type   : 'notify',
                        message: 'Success'
                    });
                }
                if (cb && typeof cb === 'function') {
                    cb();
                }
            });
        },

        allocateAll: function (e) {
            var rowId = this.$el.find('.productItem');
            var rows = [];
            var self = this;
            e.preventDefault();

            rowId.each(function () {
                var allocatedAll = $(this).find('input#quantity').val() || $(this).find('[data-name="quantity"] span').text();
                var fullfield = $(this).next().find('#fullfilled').text();
                var lastQuantity = allocatedAll - fullfield;
                var onHand = parseInt($(this).attr('data-hand'), 10);

                if (onHand) {
                    rows.push({
                        orderRowId: $(this).attr('data-id'),
                        quantity  : lastQuantity,
                        product   : $(this).find('.productsDd').attr('data-id'),
                        warehouse : self.warehouse
                    });
                }

            });

            if (rows && rows.length) {
                this.createAllocation(rows);
            } else {
                App.render({
                    type   : 'notify',
                    message: 'Nothing can be allocated. On Hand value is 0'
                });
            }

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
            dataService.postData('/priceList/resetPrices', body, function (err, data) {
                var info = self.model.get('paymentInfo');
                if (data) {
                    data.rows.forEach(function (row) {
                        var existedProduct = _.findWhere(self.model.get('products'), {_id: row.orderRowId});
                        existedProduct.subTotal = helpers.currencySplitter(row.priceAll.toFixed(2));
                        existedProduct.unitPrice = helpers.currencySplitter(row.price.toFixed(2));
                        existedProduct.quantity = row.quantity;
                    });

                    info.total = helpers.currencySplitter(data.info ? data.info.total.toFixed(2) : '0');
                    info.unTaxed = helpers.currencySplitter(data.info ? data.info.total.toFixed(2) : '0');
                }

                self.ProductItemView.render();

            });

        },

        deleteAllocation: function (e) {
            var rowId = this.$el.find('.productItem');
            var rows = [];
            var self = this;
            e.preventDefault();

            rowId.each(function () {

                rows.push({
                    orderRowId: $(this).attr('data-id'),
                    quantity  : 0,
                    product   : $(this).find('.productsDd').attr('data-id'),
                    warehouse : self.warehouse
                });
            });

            this.createAllocation(rows);
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
            var description;
            var subTotal;
            var scheduledDate;
            var taxes;
            var infoEl;
            var supplier = thisEl.find('#supplierDd').data('id');

            var debitAccount = $.trim(thisEl.find('#account').attr('data-id'));
            var paymentMethod = $.trim(thisEl.find('#paymentMethod').attr('data-id')) || null;
            var priceList = $.trim(thisEl.find('#priceList').data('id'));
            var orderDate = thisEl.find('#orderDate').val() || thisEl.find('#orderDate').text();
            var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#expectedDate').text();
            var assignedTo = $.trim(thisEl.find('#assignedTo').attr('data-id'));
            var warehouse = $.trim(thisEl.find('#warehouseDd').attr('data-id'));

            var total = helpers.spaceReplacer($.trim(thisEl.find('#totalAmount').text()));
            var totalTaxes = helpers.spaceReplacer($.trim(thisEl.find('#taxes').text()));
            var unTaxed = helpers.spaceReplacer($.trim(thisEl.find('#totalUntaxes').text()));
            var discount = helpers.spaceReplacer($.trim(thisEl.find('#discount').val()));
            var workflow = $.trim(thisEl.find('#workflowsDd').attr('data-id'));
            var workflowStatus = $.trim(thisEl.find('#workflowsDd').text());

            var currentModelJSON = this.model.toJSON();

            var usersId = [];
            var groupsId = [];
            var conflictCustomerIndex;
            var conflictedTypes;
            var whoCanRW;
            var currency;
            var changedAllocated;
            var allocated;
            var allocateProducts = [];
            var allocatedAll;
            var fullfield;
            var lastQuantity;
            var shippingAmount;
            var shippingAccount;
            var cost;
            var id;
            var i;
            var account;
            var taxCode;
            var shippingId;

            unTaxed = parseFloat(unTaxed) * 100;
            total = parseFloat(total) * 100;
            totalTaxes = parseFloat(totalTaxes) * 100;
            discount = parseFloat(discount) * 100;

            if (thisEl.find('#currencyDd').attr('data-id')) {
                currency = {
                    _id : thisEl.find('#currencyDd').attr('data-id'),
                    name: $.trim(thisEl.find('#currencyDd').text())
                };
            } else {
                currency = {
                    _id : App.organizationSettings && App.organizationSettings.currency ? App.organizationSettings.currency._id : 'USD',
                    name: App.organizationSettings && App.organizationSettings.currency ? App.organizationSettings.currency.name : 'USD'
                };
            }

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

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            shippingId = thisEl.find('#shippingDd').attr('data-id');
            shippingAccount = thisEl.find('#shippingRow').find('.accountDd').attr('data-id');
            shippingAmount = helpers.spaceReplacer(thisEl.find('#shippingRow').find('[data-name="price"] input').val()) || helpers.spaceReplacer(thisEl.find('#shippingRow').find('[data-name="price"] span:not(.currencySymbol)').text());
            shippingAmount = shippingAmount || 0;

            shippingAmount = parseFloat(shippingAmount) * 100;

            whoCanRW = this.$el.find('[name="whoCanRW"]:checked').val();

            if (selectedLength) {
                if (shippingId || shippingAccount) {
                    selectedLength += 1;
                }

                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = selectedProducts.length === i ? this.$el.find('#shippingRow') : $(selectedProducts[i]);
                    infoEl = targetEl.next();
                    id = targetEl.data('id');
                    productId = targetEl.find('.productsDd').attr('data-id');
                    account = targetEl.find('.accountDd').attr('data-id');
                    taxCode = targetEl.find('.current-selected.taxCode').attr('data-id');
                    if (productId || shippingAccount) {  // added more info for save

                        quantity = $.trim(targetEl.find('[data-name="quantity"]').text()) || targetEl.find('[data-name="quantity"] input').val();
                        quantity = parseFloat(quantity);
                        price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val()) || helpers.spaceReplacer(targetEl.find('[data-name="price"] span:not(.currencySymbol)').text());
                        price = parseFloat(price) * 100;
                        scheduledDate = $.trim(targetEl.find('[data-name="scheduledDate"]').text());
                        taxes = helpers.spaceReplacer($.trim(targetEl.find('[data-name="taxes"] .sum').text()));
                        taxes = parseFloat(taxes) * 100;
                        cost = helpers.spaceReplacer($.trim(targetEl.find('[data-name="cost"] .sum').text()));
                        cost = parseFloat(cost) * 100;
                        description = targetEl.find('[data-name="description"] textarea').val() || targetEl.find('[data-name="productDescr"]').text();
                        changedAllocated = infoEl.find('#allocated.changed');
                        allocated = changedAllocated.val();

                        subTotal = helpers.spaceReplacer($.trim(targetEl.find('.subtotal .sum').text()));
                        subTotal = parseFloat(subTotal) * 100;

                        if (!quantity) {
                            return App.render({
                                type   : 'error',
                                message: 'Quantity can\'t be empty'
                            });
                        }

                        if (changedAllocated.length) {
                            fullfield = infoEl.find('#fullfilled').text() || 0;
                            lastQuantity = quantity - fullfield;
                            allocatedAll = parseFloat(changedAllocated.val());

                            if (allocatedAll > lastQuantity) {
                                allocatedAll = lastQuantity;
                            }

                            allocateProducts.push({
                                orderRowId: id,
                                quantity  : allocatedAll,
                                product   : productId,
                                warehouse : self.warehouse
                            });
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
                            creditAccount: account || null,
                            debitAccount : debitAccount || null,
                            totalTaxes   : taxes || 0
                        });
                    }
                }
            }

            if (this.currentModel.toJSON().orderDate !== orderDate) {
                orderDate = helpers.setTimeToDate(orderDate);
            }

            data = {
                currency        : currency,
                supplier        : supplier,
                paymentMethod   : paymentMethod,
                priceList       : priceList,
                orderRows       : products,
                orderDate       : orderDate,
                expectedDate    : expectedDate,
                workflow        : workflow,
                warehouse       : warehouse,
                salesPerson     : assignedTo,
                shippingMethod  : shippingId,
                shippingExpenses: {
                    account: shippingAccount,
                    amount : shippingAmount
                },

                forSales   : true,
                paymentInfo: {
                    total   : total,
                    unTaxed : unTaxed + shippingAmount,
                    taxes   : totalTaxes,
                    discount: discount
                },

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW       : whoCanRW,
                deletedProducts: this.deletedProducts
            };

            if (supplier) {
                conflictCustomerIndex = (_.pluck(currentModelJSON.conflictTypes, 'type')).indexOf('customer');
                conflictedTypes = currentModelJSON.conflictTypes;

                if (currentModelJSON.conflictTypes && currentModelJSON.conflictTypes.length && conflictCustomerIndex >= 0) {

                    data.workflow = {
                        _id: currentModelJSON.tempWorkflow
                    };

                    conflictedTypes.splice(conflictCustomerIndex, 1);

                    data.conflictTypes = conflictedTypes;
                }

                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    patch  : true,
                    success: function () {
                        function callBack() {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(window.location.hash, {trigger: true});
                            self.hideDialog();
                        }

                        if (invoiceCb && (typeof invoiceCb === 'function')) {
                            return self.model.fetch({
                                success: function () {
                                    return invoiceCb();
                                }
                            });

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
                    message: CONSTANTS.RESPONSES.CREATE_ORDER
                });
            }
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var productItemContainer;
            var buttons;
            var template;
            var timeLine;

            if (!this.onlyView) {
                buttons = [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }
                ];
            } else {
                buttons = [{
                    text : 'Close',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }
                ];
            }

            this.template = _.template(EditTemplate);

            if (this.onlyView /*&& this.currentModel.toJSON().status.fulfillStatus === 'ALL'*/) {
                $('.saveBtn').addClass('hidden');
                this.template = _.template(ViewTemplate);
            } else {
                $('.saveBtn').removeClass('hidden');
            }

            /*if (this.onlyView) {
             this.template = _.template(ViewTemplate);
             }*/

            formString = this.template({
                model      : this.currentModel.toJSON(),
                visible    : this.visible,
                onlyView   : this.onlyView,
                forSales   : this.forSales,
                dialog     : this.dialog,
                notEditable: this.notEditable
            });

            if (!this.dialog) {
                $thisEl.html(formString);

                template = this.templateDoc({
                    model           : this.currentModel.toJSON(),
                    currencySplitter: helpers.currencySplitter,
                    addressMaker    : helpers.addressMaker
                });

                $thisEl.find('#templateDiv').html(template);

                timeLine = new NoteEditor({
                    model: this.currentModel
                });

                $thisEl.find('#historyDiv').html(
                    timeLine.render().el
                );

            } else {
                this.$el = $(formString).dialog({
                    autoOpen   : true,
                    dialogClass: 'edit-dialog',
                    title      : 'Edit Order',
                    width      : '1100px',
                    buttons    : buttons
                });

                this.$el.find('.saveBtn').remove();
            }

            this.delegateEvents(this.events);

            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {
                id    : 'Sales Order',
                status: {$ne: 'Done'}
            }, 'name', this);

            if (!this.onlyView/* || this.currentModel.toJSON().status.fulfillStatus !== 'ALL'*/) {

                populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);
                populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, false, true, null);
                populate.get('#priceList', 'priceList/getForDd', {cost: false}, 'name', this, true, true);
                populate.get('#invoicingControl', '/invoicingControl', {}, 'name', this, false, true);
                populate.get('#deliveryDd', '/deliverTo', {}, 'name', this, false, true);
                populate.get2name('#supplierDd', CONSTANTS.URLS.CUSTOMERS, {isCustomer: true}, this, false, true);
                populate.get('#taxCode', '/taxSettings/getForDd', {}, 'name', this, true, true);
                populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {
                    id    : 'Sales Order',
                    status: {$ne: 'Done'}
                }, 'name', this);
                populate.get('#account', '/chartOfAccount/getForDd', {}, 'name', this, true, true);
                populate.get('#warehouseDd', 'warehouse/getForDd', {}, 'name', this, true);

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
                balanceVissible : self.balanceVissible,
                parentModel     : self.model,
                availableVisible: true,
                canBeSold       : true,
                discountVisible : true,
                service         : self.service,
                warehouse       : this.warehouse,
                responseObj     : this.responseObj,
                deletedProducts : this.deletedProducts
            });

            productItemContainer.append(
                self.ProductItemView.render().el
            );

            return this;
        }

    });

    return EditView;
});
