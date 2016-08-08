define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Invoices/CreateTemplate.html',
    'models/InvoiceModel',
    'populate',
    'views/Invoices/InvoiceProductItems',
    'views/Assignees/AssigneesView',
    'views/Payment/list/ListHeaderInvoice',
    'constants',
    'helpers',
    'views/Notes/AttachView',
    'views/Notes/NoteView',
    'views/Products/InvoiceOrder/ProductItems'
], function (Backbone, $, _, ParentView, CreateTemplate, InvoiceModel, populate, InvoiceItemView, AssigneesView, ListHederInvoice, CONSTANTS, helpers, AttachView, NoteView, ProductItemView) {
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
            'click .details'     : 'showDetailsBox',
            'click .fa-paperclip': 'clickInput'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        chooseOption: function (e) {
            var currencyElement = $(e.target).parents('dd').find('.current-selected');
            var oldCurrency = currencyElement.attr('data-id');
            var newCurrency = $(e.target).attr('id');
            var oldCurrencyClass = helpers.currencyClass(oldCurrency);
            var newCurrencyClass = helpers.currencyClass(newCurrency);
            var holder;
            var array = this.$el.find('.' + oldCurrencyClass);

            array.removeClass(oldCurrencyClass).addClass(newCurrencyClass);

            currencyElement.text($(e.target).text()).attr('data-id', newCurrency);

            holder = $(e.target).parents('dd').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            this.hideNewSelect();
        },

        showDetailsBox: function (e) {
            $(e.target).parent().find('.details-box').toggle();
        },

        saveItem: function () {
            var self = this;
            var mid = 56;
            var $currentEl = this.$el;

            var selectedProducts = $currentEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var quantity;
            var price;
            var taxes;
            var subtotal;
            var description;
            var notes = [];
            var note;
            var internalNotes = $.trim(this.$el.find('#internalNotes').val());

            var forSales = this.forSales || false;

            var supplier = $currentEl.find('#supplier').data('id');
            var salesPersonId = $currentEl.find('#salesPerson').data('id') ? this.$('#salesPerson').data('id') : null;
            var paymentTermId = $currentEl.find('#payment_terms').data('id') ? this.$('#payment_terms').data('id') : null;
            var invoiceDate = $currentEl.find('#invoice_date').val();
            var dueDate = $currentEl.find('#due_date').val();
            var i;
            var total = parseFloat($currentEl.find('#totalAmount').text()) * 100;
            var unTaxed = parseFloat($currentEl.find('#totalUntaxes').text()) * 100;
            var balance = total; // parseFloat($currentEl.find('#balance').text()) * 100;
            var journal = $currentEl.find('#journal').attr('data-id') || null;

            var payments = {
                total  : total,
                unTaxed: unTaxed,
                balance: balance
            };

            var currency = {
                _id : $currentEl.find('#currencyDd').attr('data-id'),
                name: $.trim($currentEl.find('#currencyDd').text())
            };

            var usersId = [];
            var groupsId = [];
            var whoCanRW;
            var data;
            var model;

            if (internalNotes) {
                note = {
                    title: '',
                    note : internalNotes
                };
                notes.push(note);
            }

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');
                    if (productId) {
                        quantity = targetEl.find('[data-name="quantity"] input').val();
                        price = targetEl.find('[data-name="price"] input').val() * 100;
                        description = targetEl.find('[data-name="productDescr"] textarea').val();
                        taxes = targetEl.find('.taxes').text();
                        subtotal = targetEl.find('.subtotal').text();
                        subtotal = parseFloat(subtotal) * 100;

                        if (isNaN(price) || price <= 0) {
                            return App.render({
                                type   : 'error',
                                message: 'Please, enter Unit Price!'
                            });
                        }

                        if (price === '') {
                            return App.render({
                                type   : 'error',
                                message: 'Unit price can\'t be empty'
                            });
                        }

                        products.push({
                            product    : productId,
                            description: description,
                            unitPrice  : price,
                            quantity   : quantity,
                            taxes      : taxes,
                            subTotal   : subtotal
                        });
                    }
                }
            }

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
                forSales: forSales,

                supplier             : supplier,
                fiscalPosition       : null,
                sourceDocument       : null, // $.trim($('#source_document').val()),
                supplierInvoiceNumber: $.trim($('#supplier_invoice_num').val()),
                paymentReference     : $.trim($('#payment_reference').val()),
                invoiceDate          : helpers.setTimeToDate(invoiceDate),
                dueDate              : dueDate,
                account              : null,
                journal              : journal,
                name                 : $.trim($('#supplier_invoice_num').val()),
                salesPerson          : salesPersonId,
                paymentTerms         : paymentTermId,
                notes                : notes,

                products   : products,
                paymentInfo: payments,
                currency   : currency,

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                workflow: this.defaultWorkflow

            };

            if (supplier) {
                model = new InvoiceModel();
                model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (savedModel) {
                        //var redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/Invoices';

                        self.attachView.sendToServer(null, savedModel.changed);

                        self.hideDialog();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });

            } else {
                App.render({
                    type   : 'error',
                    message: CONSTANTS.RESPONSES.CREATE_QUOTATION
                });
            }

        },

        createProductView: function () {
            var productItemContainer;

            productItemContainer = this.$el.find('#productItemsHolder');

            if (this.forSales) {
                productItemContainer.append(
                    new ProductItemView({canBeSold: true, service: true}).render().el
                );
            } else {
                productItemContainer.append(
                    new ProductItemView({canBeSold: false}).render().el
                );
            }
        },

        render: function () {
            var formString = this.template();
            var self = this;
            var invoiceItemContainer;
            var paymentContainer;
            var $notDiv;
            var invoiceDate;

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

            this.renderAssignees(this.model);

            this.createProductView();

            invoiceItemContainer = this.$el.find('#invoiceItemsHolder');
            invoiceItemContainer.append(
                new InvoiceItemView({balanceVisible: true, canBeSold: this.forSales}).render().el
            );

            paymentContainer = this.$el.find('#payments-container');
            paymentContainer.append(
                new ListHederInvoice().render().el
            );

            $notDiv = this.$el.find('#attach-container');
            this.attachView = new AttachView({
                model      : new InvoiceModel(),
                contentType: self.contentType,
                isCreate   : true
            });
            $notDiv.append(this.attachView.render().el);

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);

            populate.get2name('#supplier', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);
            populate.get('#payment_terms', '/paymentTerm', {}, 'name', this, true, true);
            populate.get2name('#salesPerson', CONSTANTS.URLS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
            populate.get('#journal', '/journals/getForDd', {}, 'name', this, true);
            populate.fetchWorkflow({wId: 'Purchase Invoice'}, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response._id;
                }
            });

            this.$el.find('#invoice_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function () {
                    invoiceDate = self.$el.find('#invoice_date').val();
                    self.$el.find('#due_date').datepicker('option', 'minDate', invoiceDate);
                }
            }).datepicker('setDate', new Date());

            invoiceDate = this.$el.find('#invoice_date').val();

            this.$el.find('#due_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function () {
                    var targetInput = $(this);

                    targetInput.removeClass('errorContent');
                }
            }).datepicker('option', 'minDate', invoiceDate);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
