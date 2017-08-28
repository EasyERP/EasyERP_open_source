define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/purchaseOrders/CreateTemplate.html',
    'collections/Persons/PersonsCollection',
    'collections/Departments/DepartmentsCollection',
    'views/dialogViewBase',
    'views/Products/orderRows/ProductItems',
    'models/orderModel',
    'common',
    'populate',
    'constants',
    'views/Assignees/AssigneesView',
    'dataService',
    'helpers/keyValidator',
    'helpers',
    'views/guideTours/guideNotificationView'
], function (Backbone,
             $,
             _,
             CreateTemplate,
             PersonsCollection,
             DepartmentsCollection,
             ParentView,
             ProductItemView,
             OrderModel,
             common,
             populate,
             CONSTANTS,
             AssigneesView,
             dataService,
             keyValidator,
             helpers,
             GuideNotify) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'purchaseOrders',
        template   : _.template(CreateTemplate),
        forSales   : false,

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
            }
            _.bindAll(this, 'saveItem', 'render');
            this.model = new OrderModel();
            this.responseObj = {};
            this.currencySymbol = '$';

            this.render();

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },

        events: {
            'keypress .forNum': 'keydownHandler',
            // 'click .newSelectList li:not(.miniStylePagination,#generateJobs)': 'chooseOption'
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
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
                $target.closest('dd').find('.current-selected').attr('data-symbol', symbol);
                this.$el.find('.currencySymbol').text(symbol);
                this.currencySymbol = symbol;
                populate.get('#costList', 'priceList/getForDd', {currency: id}, 'name', this, true, true);
                populate.get('#priceList', 'priceList/getForDd', {currency: id}, 'name', this, true, true);

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

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            this.hideNewSelect();

            return false;
        },

        saveItem: function () {
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
            var shippingId;
            var shippingAmount;
            var shippingAccount;
            App.guideStatusErr = true;

            var forSales = this.forSales || false;

            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };

            var supplier = thisEl.find('#customerDd').attr('data-id');
            var paymentMethod = $.trim(thisEl.find('#paymentMethod').attr('data-id'));
            var destination = $.trim(thisEl.find('#destination').attr('data-id'));
            var assignedTo = $.trim(thisEl.find('#assignedTo').attr('data-id'));
            var deliverTo = $.trim(thisEl.find('#deliveryDd').attr('data-id'));
            var paymentTerm = $.trim(thisEl.find('#paymentTerm').attr('data-id'));
            var workflow = $.trim(thisEl.find('#workflowsDd').attr('data-id'));
            var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').attr('data-id'));
            var priceList = $.trim(thisEl.find('#priceList').data('id'));
            var warehouse = $.trim(thisEl.find('#warehouseDd').data('id'));

            var orderDate = thisEl.find('#orderDate').val();
            var expectedDate = thisEl.find('#expectDate').val() || thisEl.find('#orderDate').val();
            var creditAccount = $.trim(thisEl.find('#account').attr('data-id'));

            var total = helpers.spaceReplacer($.trim(thisEl.find('#totalAmount').text()));
            var totalTaxes = helpers.spaceReplacer($.trim(thisEl.find('#taxes').text()));
            var taxes;
            var description;
            var unTaxed = helpers.spaceReplacer($.trim(thisEl.find('#totalUntaxes').text()));
            var discount = helpers.spaceReplacer($.trim(thisEl.find('#discount').val()));
            var subTotal;
            var jobs;
            var cost;
            var account;
            var taxCode;

            var usersId = [];
            var groupsId = [];
            var i;
            var status = {
                fulfillStatus: 'NOR'
            };

            var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

            shippingId = thisEl.find('#shippingDd').attr('data-id');
            shippingAccount = thisEl.find('#shippingRow').find('.accountDd').attr('data-id');
            shippingAmount = helpers.spaceReplacer(thisEl.find('#shippingRow').find('[data-name="price"] input').val()) || helpers.spaceReplacer(thisEl.find('#shippingRow').find('[data-name="price"] span:not(.currencySymbol)').text());

            shippingAmount = shippingAmount || 0;
            shippingAmount = parseFloat(shippingAmount) * 100;

            total = parseFloat(total) * 100;
            unTaxed = parseFloat(unTaxed) * 100;
            totalTaxes = parseFloat(totalTaxes) * 100;
            discount = parseFloat(discount) * 100;

            if (!selectedLength) {
                return App.render({
                    type   : 'error',
                    message: "Products can't be empty."
                });
            }

            if (!paymentMethod) {
                return App.render({
                    type   : 'error',
                    message: "Bank Account can't be empty."
                });
            }

            if (shippingId || shippingAccount) {
                selectedLength += 1;
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = selectedProducts.length === i ? this.$el.find('#shippingRow') : $(selectedProducts[i]);
                productId = targetEl.find('.productsDd').attr('data-id');

                if (!productId && !shippingAccount) {
                    return App.render({
                        type   : 'error',
                        message: "Products can't be empty."
                    });
                }

                if (shippingId && !shippingAccount) {
                    return App.render({
                        type   : 'error',
                        message: "Shipping Account can't be empty."
                    });
                }

                quantity = targetEl.find('[data-name="quantity"] input').val() || targetEl.find('[data-name="quantity"] span').text();
                price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val()) * 100;

                if (productId && (isNaN(price) || price <= 0)) {
                    return App.render({
                        type   : 'error',
                        message: 'Please, enter Unit Price!'
                    });
                }
                // scheduledDate = targetEl.find('[data-name="scheduledDate"]').text();
                taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());
                cost = helpers.spaceReplacer(targetEl.find('.cost .sum').text());
                cost = parseFloat(cost) * 100;
                taxes = parseFloat(taxes) * 100;
                description = targetEl.find('textarea.productDescr').val();
                subTotal = helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());
                subTotal = parseFloat(subTotal) * 100;
                jobs = targetEl.find('.current-selected.jobs').attr('data-id');
                account = targetEl.find('.accountDd').attr('data-id');
                taxCode = targetEl.find('.current-selected.taxCode').attr('data-id');

                if (productId && !price) {
                    return App.render({
                        type   : 'error',
                        message: 'Unit price can\'t be empty'
                    });
                }

                if (!quantity) {
                    return App.render({
                        type   : 'error',
                        message: 'Quantity can\'t be empty'
                    });
                }

                if (jobs === 'jobs' && this.forSales) {
                    return App.render({
                        type   : 'error',
                        message: "Job field can't be empty. Please, choose or create one."
                    });
                }

                products.push({
                    product      : productId,
                    unitPrice    : price,
                    costPrice    : cost,
                    warehouse    : warehouse,
                    quantity     : quantity,
                    debitAccount : account,
                    creditAccount: creditAccount,
                    taxCode      : taxCode || null,
                    taxes        : [{
                        taxCode: taxCode || null,
                        tax    : taxes
                    }],

                    description: description,
                    subTotal   : subTotal,
                    totalTaxes : taxes
                });
            }

            if (products.length) {
                status.fulfillStatus = 'NOT';
            }

            data = {
                currency        : currency,
                forSales        : forSales,
                supplier        : supplier,
                deliverTo       : deliverTo,
                priceList       : priceList,
                salesPerson     : assignedTo,
                warehouse       : warehouse,
                products        : products,
                paymentMethod   : paymentMethod,
                orderDate       : helpers.setTimeToDate(orderDate),
                expectedDate    : expectedDate,
                destination     : destination,
                paymentTerm     : paymentTerm,
                fiscalPosition  : fiscalPosition,
                shippingMethod  : shippingId,
                shippingExpenses: {
                    account: shippingAccount,
                    amount : shippingAmount
                },

                populate   : true, // Need Populate data from server
                paymentInfo: {
                    total   : total,
                    unTaxed : unTaxed + shippingAmount,
                    taxes   : totalTaxes,
                    discount: discount
                },

                status: status,
                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                workflow: workflow
            };

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (model) {
                        self.redirectAfterSave(self, model);
                        App.guideStatusErr = false;
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });

            } else {
                return App.render({
                    type   : 'error',
                    message: CONSTANTS.RESPONSES.CREATE_QUOTATION
                });
            }
        },

        redirectAfterSave: function () {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        createProductView: function () {
            var productItemContainer;

            productItemContainer = this.$el.find('#productItemsHolder');

            productItemContainer.append(
                new ProductItemView({
                    canBePurchase   : true,
                    canBeSold       : false,
                    quotations      : true,
                    availableVisible: true,
                    currencySymbol  : this.currencySymbol,
                    responseObj     : this.responseObj,
                    discountVisible : true,
                    account         : this.account
                }).render().el
            );

            this.dialogCentering(this.$el);
        },

        render: function () {
            var formString = this.template({visible: this.visible, forSales: this.forSales});
            var self = this;
            var curDate = new Date();

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Order',
                width      : '1100px',
                buttons    : [{
                    id   : 'create-person-dialog',
                    text : 'Create',
                    class: 'btn blue',

                    click: function () {
                        self.saveItem();
                        self.gaTrackingConfirmEvents();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',

                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            this.renderAssignees(this.model);

            populate.get('#destination', '/destination', {}, 'name', this, true, true);
            populate.get('#incoterm', '/incoterm', {}, 'name', this, true, true);
            populate.get('#invoicingControl', '/invoicingControl', {}, 'name', this, true, true);
            //populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, true, true);
            populate.get('#deliveryDd', '/deliverTo', {}, 'name', this, true);
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {isSupplier: true}, this, true, true);
            populate.get('#priceList', 'priceList/getForDd', {cost: true}, 'name', this, true);
            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);
            populate.get('#account', '/chartOfAccount/getForDd', {}, 'name', this, true, true);
            populate.get('#taxCode', '/taxSettings/getForDd', {}, 'name', this, true, true);

            populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, false, null);

            dataService.getData('warehouse/getForDd', {}, function (resp) {
                var el = self.$el.find('#warehouseDd');
                self.responseObj['#warehouseDd'] = resp.data;

                if (resp.data && resp.data.length) {
                    self.warehouse = resp.data[0];
                    el.text(resp.data[0].name).attr('data-id', resp.data[0]._id)
                }

                self.createProductView();
            });

            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#assignedTo'] = employees;
            });

            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {
                id    : 'Purchase Order',
                status: {$ne: 'Done'}
            }, 'name', this, true);

            this.$el.find('#orderDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : '+0D',
                onSelect   : function (date) {
                    self.$el.find('#expectDate').datepicker('option', 'minDate', new Date(date));
                }
            }).datepicker('setDate', new Date(curDate));

            dataService.getData('/paymentTerm', {}, function (paymentTerm) {
                var currentDate = new Date();
                var dates = paymentTerm.data[0] && paymentTerm.data[0].hasOwnProperty('count') ? paymentTerm.data[0].count : 0;
                currentDate.setDate(currentDate.getDate() + parseInt(dates));

                self.$el.find('#expectDate').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    minDate    : new Date(curDate)
                }).datepicker('setDate', currentDate);
            });

            this.delegateEvents(this.events);
            return this;
        }

    });

    return CreateView;
});
