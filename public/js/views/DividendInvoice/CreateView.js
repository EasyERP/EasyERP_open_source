define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/DividendInvoice/CreateTemplate.html',
    'views/dialogViewBase',
    'models/InvoiceModel',
    'populate',
    'views/DividendInvoice/InvoiceProductItems',
    'views/Payment/list/ListHeaderInvoice',
    'constants',
    'helpers'
], function ($, _, Backbone, CreateTemplate, ParentView, InvoiceModel, populate, InvoiceItemView, ListHeaderInvoice, CONSTANTS, helpers) {

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

        chooseOption: function (e) {
            var currencyElement = $(e.target).parents('dd').find('.current-selected');
            var oldCurrency = currencyElement.attr('data-id');
            var newCurrency = $(e.target).attr('id');
            var oldCurrencyClass = helpers.currencyClass(oldCurrency);
            var newCurrencyClass = helpers.currencyClass(newCurrency);

            var array = this.$el.find('.' + oldCurrencyClass);

            array.removeClass(oldCurrencyClass).addClass(newCurrencyClass);

            currencyElement.text($(e.target).text()).attr('data-id', newCurrency);
        },

        saveItem: function () {
            var self = this;
            var mid = 100;
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

            var invoiceDate = $currentEl.find('#invoice_date').val();
            var dueDate = $currentEl.find('#due_date').val();

            var total = 100 * parseFloat($currentEl.find('#totalAmount').text());
            var unTaxed = 100 * parseFloat($currentEl.find('#totalUntaxes').text());
            var balance = 100 * parseFloat($currentEl.find('#balance').text());
            var i;
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
                        price = 100 * parseFloat(targetEl.find('[data-name="price"] input').val());
                        description = targetEl.find('[data-name="productDescr"] input').val();
                        taxes = targetEl.find('.taxes').text();
                        amount = 100 * targetEl.find('.amount').text();

                        if (!price) {
                            return App.render({
                                type   : 'error',
                                message: "Fields 'price' and 'quantity' can\'t be empty or 0"
                            });
                        }

                        products.push({
                            product    : productId,
                            description: description,
                            unitPrice  : price,
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

            whoCanRW = this.$el.find('[name="whoCanRW"]:checked').val();
            data = {
                forSales   : false,
                invoiceDate: invoiceDate,
                dueDate    : dueDate,
                journal    : null,
                products   : products,
                paymentInfo: payments,
                currency   : currency,
                groups     : {
                    owner: $('#allUsersSelect').data('id'),
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                workflow: this.defaultWorkflow
            };

            model = new InvoiceModel();
            model.urlRoot = function () {
                return 'DividendInvoice';
            };

            model.save(data, {
                patch  : true,
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function () {
                    self.hideDialog();
                    Backbone.history.navigate('#easyErp/DividendInvoice', {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var formString = this.template();
            var self = this;
            var invoiceItemContainer;
            var paymentContainer;
            var $thisEl;
            var today = new Date();

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Create Invoice',
                width        : '900px',
                position     : {within: $('#wrapper')},
                buttons      : [
                    {
                        id   : 'create-invoice-dialog',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }]

            });
            $thisEl = this.$el;

            this.renderAssignees(this.currentModel);

            invoiceItemContainer = $thisEl.find('#invoiceItemsHolder');
            invoiceItemContainer.append(
                new InvoiceItemView({balanceVisible: true, canBeSold: this.forSales, paid: 0}).render().el
            );

            paymentContainer = $thisEl.find('#payments-container');
            paymentContainer.append(
                new ListHeaderInvoice().render().el
            );

            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);
            populate.get2name('#employeesDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, true, false);
            populate.get('#payment_terms', '/paymentTerm', {}, 'name', this, true, true);
            populate.get2name('#salesPerson', CONSTANTS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
            populate.fetchWorkflow({wId: 'Purchase Invoice'}, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response._id;
                }
            });

            $thisEl.find('#invoice_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            }).datepicker('setDate', today);

            today.setDate(today.getDate() + 14);

            $thisEl.find('#due_date').datepicker({
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
