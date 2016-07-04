define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/WriteOff/CreateTemplate.html',
    'models/InvoiceModel',
    'populate',
    'views/Product/InvoiceOrder/ProductItems',
    'views/Assignees/AssigneesView',
    'constants',
    'dataService',
    'helpers'
], function (Backbone, $, _, ParentView, CreateTemplate, InvoiceModel, populate, ProductItemView, AssigneesView, CONSTANTS, dataService, helpers) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'WriteOff',
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
            var id = $target.attr('id');
            var type = $target.attr('data-level');
            var aEl;

            var element = _.find(this.responseObj['#project'], function (el) {
                return el._id === id;
            });

            var currencyElement = $target.parents('dd').find('.current-selected');
            var oldCurrency = currencyElement.attr('data-id');
            var newCurrency = $target.attr('id');
            var oldCurrencyClass = helpers.currencyClass(oldCurrency);
            var newCurrencyClass = helpers.currencyClass(newCurrency);

            var array = this.$el.find('.' + oldCurrencyClass);
            array.removeClass(oldCurrencyClass).addClass(newCurrencyClass);

            if (type) {    // added condition for project with no data-level empty

                this.$el.find('#supplierDd').text(element.customer.name.first + element.customer.name.last);
                this.$el.find('#supplierDd').attr('data-id', element.customer._id);

                aEl = $('.current-selected.jobs');
                aEl.text('Select');
                aEl.attr('data-id', 'jobs');
            }

            $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            this.hideNewSelect();

            return false;
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
            var amount;
            var description;

            var forSales = this.forSales || false;

            var supplier = $currentEl.find('#supplierDd').data('id');
            var project = $currentEl.find('#projectDd').data('id');
           /* var salesPersonId = $currentEl.find('#salesPerson').data('id') ? this.$('#salesPerson').data('id') : null;*/
           /* var paymentTermId = $currentEl.find('#payment_terms').data('id') ? this.$('#payment_terms').data('id') : null;*/
            var invoiceDate = $currentEl.find('#invoice_date').val();
            var dueDate = $currentEl.find('#due_date').val();
            var i;
            var total = parseFloat($currentEl.find('#totalAmount').text());
            var unTaxed = parseFloat($currentEl.find('#totalUntaxes').text());
            var balance = parseFloat($currentEl.find('#balance').text());

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

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');
                    if (productId) {
                        quantity = targetEl.find('[data-name="quantity"]').text();
                        price = targetEl.find('[data-name="price"]').text();
                        description = targetEl.find('[data-name="productDescr"]').text();
                        taxes = targetEl.find('.taxes').text();
                        amount = targetEl.find('.amount').text();

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
                forSales: false,

                supplier             : supplier,
                fiscalPosition       : null,
                sourceDocument       : null, // $.trim($('#source_document').val()),
                supplierInvoiceNumber: $.trim($('#supplier_invoice_num').val()),
             /*   paymentReference     : $.trim($('#payment_reference').val()),*/
                invoiceDate          : helpers.setTimeToDate(invoiceDate),
                dueDate              : dueDate,
                account              : null,
                journal              : null,
                project              : project,
/*
                salesPerson : salesPersonId,
                paymentTerms: paymentTermId,*/

                products   : products,
             /*   paymentInfo: payments,*/
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
                model.urlRoot = function () {
                    return 'writeOff';
                };
                model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        var redirectUrl = window.location.hash;

                        self.hideDialog();
                        Backbone.history.navigate(redirectUrl, {trigger: true});
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

        render: function () {
            var formString = this.template();
            var self = this;
            var invoiceItemContainer;
            var paymentContainer;

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Create WriteOff',
                width        : '900px',
                position     : {within: $('#wrapper')},
                buttons      : [
                    {
                        id   : 'create-write-off-dialog',
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

            invoiceItemContainer = this.$el.find('#invoiceItemsHolder');
            invoiceItemContainer.append(
                new ProductItemView({canBeSold: true, service: true}).render().el
            );

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);
            populate.get2name('#supplier', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);
            populate.get('#projectDd', '/projects/getForDd', {}, 'name', this, false, false);
            populate.get('#payment_terms', '/paymentTerm', {}, 'name', this, true, true);
            populate.get2name('#salesPerson', CONSTANTS.URLS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
            populate.fetchWorkflow({wId: 'Purchase Invoice'}, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response._id;
                }
            });

            dataService.getData('/projects/getForWtrack', null, function (projects) {
                self.responseObj['#project'] = projects.data;
            });

            this.$el.find('#invoice_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            }).datepicker('setDate', new Date());

            this.$el.find('#due_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
