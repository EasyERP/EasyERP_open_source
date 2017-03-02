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
    'views/Products/InvoiceOrder/ProductItems',
    'views/Assignees/AssigneesView',
    'views/Payment/list/ListHeaderInvoice',
    'dataService',
    'constants',
    'helpers'
], function ($, _, Backbone, ParentView, CreateTemplate, attachView, InvoiceModel, common, populate, ProductItemView, AssigneesView, ListHeaderInvoice, dataService, CONSTANTS, helpers) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Invoices',
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new InvoiceModel();
            this.responseObj = {};
            this.render();
        },

        events: {
            'click .details': 'showDetailsBox'
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.parents('ul').closest('.current-selected');
            var symbol;
            var currency;

            if ($target.closest('a').attr('id') === 'currencyDd') {
                currency = _.findWhere(this.responseObj['#currencyDd'], {_id: $target.attr('id')});
                symbol = currency ? currency.currency : '$';
                $target.closest('dd').find('.current-selected').attr('data-symbol', symbol);
                this.$el.find('.currencySymbol').text(symbol);
                this.currencySymbol = symbol;
            }

            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            $(e.target).closest('td').removeClass('errorContent');
        },

        showDetailsBox: function (e) {
            $(e.target).parent().find('.details-box').toggle();
        },

        saveItem: function () {
            var self = this;
            var mid = 97;
            var $currentEl = this.$el;
            var errors = $currentEl.find('.errorContent');
            var selectedProducts = $currentEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var quantity;
            var price;
            var taxes;
            var whoCanRW;
            var data;
            var model;
            var amount;
            var groupsId;
            var usersId;
            var description;
            var i;
            var supplier = $currentEl.find('#supplier').data('id');
            var invoiceDate = $currentEl.find('#invoice_date').val();
            var dueDate = $currentEl.find('#due_date').val();

            var total = 100 * parseFloat(helpers.spaceReplacer($currentEl.find('#totalAmount').text()));
            var unTaxed = 100 * parseFloat(helpers.spaceReplacer($currentEl.find('#totalUntaxes').text()));
            var balance = 100 * parseFloat(helpers.spaceReplacer($currentEl.find('#balance').text()));

            var payments = {
                total  : total,
                unTaxed: unTaxed,
                balance: balance
            };

            var currency = {
                _id : $currentEl.find('#currencyDd').attr('data-id'),
                name: $.trim($currentEl.find('#currencyDd').text())
            };

            if (errors.length) {
                return false;
            }

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');
                    if (productId) {
                        quantity = parseFloat(helpers.spaceReplacer(targetEl.find('[data-name="quantity"] input').val()));
                        price = 100 * parseFloat(helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val()));
                        description = targetEl.find('[data-name="productDescr"] input').val();
                        taxes = targetEl.find('.taxes .sum').text();
                        amount = 100 * helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());

                        if (!quantity || !price) {
                            return App.render({
                                type   : 'error',
                                message: 'Fields "price" and "quantity" can\'t be empty or 0'
                            });
                        }

                        products.push({
                            product    : productId,
                            description: description,
                            unitPrice  : price,
                            quantity   : quantity,
                            taxes      : taxes,
                            subTotal   : amount
                        });
                    }
                }
            }

            usersId = [];
            groupsId = [];
            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            data = {
                forSales             : false,
                supplier             : supplier,
                supplierInvoiceNumber: $.trim($('#supplier_invoice_num').val()),
                invoiceDate          : invoiceDate,
                dueDate              : dueDate,
                journal              : null,
                products             : products,
                paymentInfo          : payments,
                currency             : currency,
                groups               : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
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
                    message: 'Please fill all fields.'
                });
            }

        },

        createProductView: function () {
            var productItemContainer;

            productItemContainer = this.$el.find('#invoiceItemsHolder');

            productItemContainer.append(
                new ProductItemView({canBeSold: false}).render().el
            );

        },

        render: function () {
            var formString = this.template();
            var self = this;
            var invoiceItemContainer;
            var paymentContainer;
            var notDiv;
            var today = new Date();

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Invoice',
                width      : '900px',
                position   : {within: $('#wrapper')},
                buttons    : [
                    {
                        id   : 'create-invoice-dialog',
                        class: 'btn blue',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    }, {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }]
            });

            this.renderAssignees(this.model);
            this.createProductView();

            /*  invoiceItemContainer = this.$el.find('#invoiceItemsHolder');
             invoiceItemContainer.append(
             new InvoiceItemView({balanceVisible: true, canBeSold: this.forSales}).render().el
             );*/

            paymentContainer = this.$el.find('#payments-container');
            paymentContainer.append(
                new ListHeaderInvoice().render().el
            );

            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);

            populate.get2name('#supplier', '/supplier', {}, this, false, true);
            populate.get('#payment_terms', '/paymentTerm', {}, 'name', this, true, true);
            populate.get2name('#salesPerson', CONSTANTS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
            populate.fetchWorkflow({wId: 'Purchase Invoice'}, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response._id;
                }
            });

            this.$el.find('#invoice_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            }).datepicker('setDate', today);

            today.setDate(today.getDate() + 14);

            this.$el.find('#due_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
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
