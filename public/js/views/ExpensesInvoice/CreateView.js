define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/ExpensesInvoice/CreateTemplate.html',
    'views/Notes/AttachView',
    'models/InvoiceModel',
    'common',
    'populate',
    'views/Products/orderRows/ProductItems',
    'views/Assignees/AssigneesView',
    'views/Payment/list/ListHeaderInvoice',
    'dataService',
    'constants',
    'helpers'
], function ($, _, Backbone, ParentView, CreateTemplate, attachView, InvoiceModel, common, populate, ProductItemView, AssigneesView, ListHeaderInvoice, dataService, CONSTANTS, helpers) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'expensesInvoice',
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new InvoiceModel();
            this.responseObj = {};
            this.account = null;
            this.render();
        },

        events: {
            'click .details': 'showDetailsBox'
        },

        chooseOption: function (e) {
            var $target = $(e.target).closest('li');
            var holder = $target.parents('ul').closest('.current-selected');
            var symbol;
            var currency;
            var expensesCategory;
            var category;
            var accountObj;

            if (holder.attr('id') === 'currencyDd') {
                currency = _.findWhere(this.responseObj['#currencyDd'], {_id: $target.attr('id')});
                symbol = currency ? currency.currency : '$';
                $target.closest('dd').find('.current-selected').attr('data-symbol', symbol);
                this.$el.find('.currencySymbol').text(symbol);
                this.currencySymbol = symbol;
            }

            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            if (holder.attr('id') === 'categories') {
                category = $target.attr('id');

                expensesCategory = _.findWhere(this.responseObj['#categories'], {_id: category});

                this.account = expensesCategory && expensesCategory.account ? expensesCategory.account : null;

                accountObj = _.findWhere(this.responseObj['#accountDd'], {_id: this.account});

                accountObj = accountObj || {_id: null, name: ''};

                this.$el.find('#productList tr').each(function () {
                    $(this).find('.accountDd').text(accountObj.name).attr('data-id', accountObj._id);
                });

            }

            $(e.target).closest('td').removeClass('errorContent');
        },

        showDetailsBox: function (e) {
            $(e.target).parent().find('.details-box').toggle();
        },

        saveItem: function () {
            var self = this;
            var mid = 97;
            var $currentEl = this.$el;
            var selectedProducts = $currentEl.find('.item');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var quantity;
            var price;
            var whoCanRW;
            var data;
            var model;
            var description;
            var i;
            var supplier = $currentEl.find('#supplier').attr('data-id');
            var invoiceDate = $currentEl.find('#invoice_date').val();
            var dueDate = $currentEl.find('#due_date').val();
            var expensesCategory = $currentEl.find('#categories').attr('data-id') || null;
            var account;
            var usersId = [];
            var groupsId = [];
            var total = helpers.spaceReplacer($currentEl.find('#totalAmount').text());
            var discount = parseFloat($currentEl.find('#discount').val()) || 0;
            var unTaxed = helpers.spaceReplacer($currentEl.find('#totalUntaxes').text());
            var balance = helpers.spaceReplacer($currentEl.find('#balance').text());
            var taxes = helpers.spaceReplacer($currentEl.find('#taxes').text());
            var name = $.trim($('#supplier_invoice_num').val());
            var subTotal;
            var taxCode;
            var payments;
            var currency;

            total = parseFloat(total);
            balance = parseFloat(balance);
            unTaxed = parseFloat(unTaxed);
            taxes = parseFloat(taxes);

            payments = {
                total   : total * 100,
                taxes   : taxes * 100,
                unTaxed : unTaxed * 100,
                balance : balance * 100,
                discount: discount
            };

            currency = {
                _id : $currentEl.find('#currencyDd').attr('data-id'),
                name: $.trim($currentEl.find('#currencyDd').text())
            };

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'Invoice Number can\'t be empty'
                });
            }

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);

                    quantity = targetEl.find('[data-name="quantity"] input').val() || targetEl.find('[data-name="quantity"] span').text();
                    price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val()) * 100;

                    if (isNaN(price) || price <= 0) {
                        return App.render({
                            type   : 'error',
                            message: 'Please, enter Unit Price!'
                        });
                    }
                    taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());
                    description = targetEl.find('.productDescr').val();
                    subTotal = helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());
                    subTotal = parseFloat(subTotal) * 100;
                    account = targetEl.find('.accountDd').attr('data-id');
                    taxCode = targetEl.find('.current-selected.taxCode').attr('data-id') || null;

                    if (!price) {
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

                    if (!account) {
                        return App.render({
                            type   : 'error',
                            message: 'Account can\'t be empty. Please, choose Expenses Category with account'
                        });
                    }

                    if (!description) {
                        return App.render({
                            type   : 'error',
                            message: 'Expense info can\'t be empty'
                        });
                    }

                    products.push({
                        unitPrice    : price,
                        quantity     : quantity,
                        description  : description,
                        subTotal     : subTotal,
                        debitAccount : account,
                        creditAccount: CONSTANTS.ACCOUNT_PAYABLE,
                        taxes        : [{
                            taxCode: taxCode || null,
                            tax    : taxes * 100
                        }]
                    });
                }
            } else {
                return App.render({type: 'error', message: 'Expenses can\'t be empty'});
            }

            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            data = {
                forSales        : false,
                supplier        : supplier,
                name            : name,
                invoiceDate     : invoiceDate,
                dueDate         : dueDate,
                journal         : null,
                expensesCategory: expensesCategory,
                products        : products,
                paymentInfo     : payments,
                currency        : currency,
                groups          : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW || 'everyOne',
                workflow: this.defaultWorkflow
            };

            if (supplier) {
                model = new InvoiceModel();
                model.urlRoot = function () {
                    return 'expensesInvoice';
                };

                model.save(data, {
                    patch  : true,
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        self.hideDialog();
                        Backbone.history.navigate('#easyErp/ExpensesInvoice', {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });

            } else {
                App.render({
                    type   : 'error',
                    message: 'Please, select Supplier.'
                });
            }

        },

        createProductView: function () {
            var productItemContainer;

            productItemContainer = this.$el.find('#invoiceItemsHolder');

            productItemContainer.append(
                new ProductItemView({
                    canBeSold      : false,
                    expense        : true,
                    responseObj    : this.responseObj,
                    balanceVisible : true,
                    discountVisible: true
                }).render().el
            );

        },

        render: function () {
            var formString = this.template({model: this.model});
            var self = this;
            var paymentContainer;
            var today = new Date();

            this.$el = $(formString).dialog({
                closeOnEscape: true,
                autoOpen     : true,
                dialogClass  : 'edit-dialog',
                title        : 'Create Invoice',
                width        : '900px',
                position     : {within: $('#wrapper')},
                buttons      : [
                    {
                        id   : 'create-invoice-dialog',
                        class: 'btn blue',
                        text : 'Create',
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
            this.createProductView();

            paymentContainer = this.$el.find('#payments-container');
            paymentContainer.append(
                new ListHeaderInvoice().render().el
            );

            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);
            populate.get('#taxCode', '/taxSettings/getForDd', {}, 'name', this, true, true);
            populate.getParrentCategory('#categories', '/expensesCategories/getAll', {}, this, true, true);
            populate.get('#accountDd', '/chartOfAccount/getForDd', {category: 'ACCOUNTS_EXPENSES'}, 'name', this, true, true);

            populate.get2name('#supplier', '/supplier', {}, this, false, true);
            populate.fetchWorkflow({wId: 'Purchase Invoice'}, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response._id;
                }
            });

            this.$el.find('#invoice_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function (date) {
                    self.$el.find('#due_date').datepicker('option', 'minDate', new Date(date));
                }
            }).datepicker('setDate', today);

            today.setDate(today.getDate() + 14);

            this.$el.find('#due_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : new Date(),
                onSelect   : function () {
                    var targetInput = $(this);
                    targetInput.removeClass('errorContent');
                }
            }).datepicker('setDate', today);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
