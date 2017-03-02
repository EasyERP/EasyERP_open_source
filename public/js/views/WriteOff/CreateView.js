define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/WriteOff/CreateTemplate.html',
    'models/InvoiceModel',
    'populate',
    'views/Products/InvoiceOrder/ProductItems',
    'constants',
    'helpers'
], function (Backbone, $, _, ParentView, CreateTemplate, InvoiceModel, populate, ProductItemView, CONSTANTS, helpers) {
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

            var currencyElement = $target.parent('ul').closest('.current-selected');
            var oldCurrency = currencyElement.attr('data-id');
            var newCurrency = $target.attr('id');
            var oldCurrencyClass = helpers.currencyClass(oldCurrency);
            var newCurrencyClass = helpers.currencyClass(newCurrency);

            var array = this.$el.find('.' + oldCurrencyClass);
            array.removeClass(oldCurrencyClass).addClass(newCurrencyClass);

            if (type) {    // added condition for project with no data-level empty
                aEl = $('.current-selected.jobs');
                aEl.text('Select');
                aEl.attr('data-id', 'jobs');
            }

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

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
            var jobs;
            var project = $currentEl.find('#projectDd').attr('data-id');
            var invoiceDate = $currentEl.find('#invoice_date').val();
            var i;
            var journal = $currentEl.find('#writeOffWay').attr('data-id');

            var usersId = [];
            var groupsId = [];
            var whoCanRW;
            var data;
            var model;

            App.startPreload();

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');
                    if (productId) {
                        quantity = targetEl.find('[data-name="quantity"]').text();
                        price = $.trim(targetEl.find('[data-name="price"] input').val());
                        jobs = targetEl.find('.current-selected.jobs').attr('data-id');

                        if (jobs === 'jobs') {
                            return App.render({
                                type   : 'notify',
                                message: "Job field can't be empty. Please, choose or create one."
                            });
                        }

                        products.push({
                            product : productId,
                            jobs    : jobs,
                            quantity: quantity
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

                fiscalPosition: null,
                sourceDocument: null,
                invoiceDate   : helpers.setTimeToDate(invoiceDate),
                account       : null,
                journal       : journal,
                project       : project,
                products      : products,
                paymentInfo   : null,
                groups        : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW

            };

            if (project) {
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

                        App.stopPreload();

                        self.hideDialog();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });

            } else {
                App.stopPreload();

                App.render({
                    type   : 'error',
                    message: CONSTANTS.RESPONSES.CREATE_WRITEOFF
                });
            }

        },

        render: function () {
            var formString = this.template();
            var self = this;
            var invoiceItemContainer;
            var paymentContainer;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create WriteOff',
                width      : '900px',
                position   : {within: $('#wrapper')},
                buttons    : [
                    {
                        id   : 'create-write-off-dialog',
                        class: 'btn blue',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }]

            });

            this.renderAssignees(this.model);

            invoiceItemContainer = this.$el.find('#invoiceItemsHolder');
            invoiceItemContainer.append(
                new ProductItemView({canBeSold: true, service: true, notPayed: true, writeOff: true}).render().el
            );

            populate.get('#writeOffWay', CONSTANTS.URLS.WRITE_OFF_WAY, {}, 'name', this, true);
            populate.get2name('#supplier', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);
            populate.get('#projectDd', '/projects/getForDd', {}, 'name', this, false, false);
            populate.get('#payment_terms', '/paymentTerm', {}, 'name', this, true, true);
            populate.get2name('#salesPerson', CONSTANTS.URLS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
            populate.fetchWorkflow({wId: 'Purchase Invoice'}, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response._id;
                }
            });

            this.$el.find('#invoice_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            }).datepicker('setDate', new Date());

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
