define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Quotations/form/EditTemplate.html',
    'views/dialogViewBase',
    'views/Assignees/AssigneesView',
    'views/Products/InvoiceOrder/ProductItems',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers/keyValidator',
    'helpers'
], function (Backbone,
             $,
             _,
             EditTemplate,
             BaseView,
             AssigneesView,
             ProductItemView,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             keyValidator,
             helpers) {
    'use strict';

    var FormView = BaseView.extend({
        contentType: CONSTANTS.QUOTATIONS,
        imageSrc   : '',
        el         : '.form-holder',
        template   : _.template(EditTemplate),

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
                this.eventChannel = options.eventChannel;
            }

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.currentModel.urlRoot = '/quotations';
            this.responseObj = {};
            this.forSales = options.forSales;

        },

        events: {
            'click .saveBtn': 'saveQuotation'
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var type = $target.attr('data-level');
            var dd =  $target.closest('dd').find('.current-selected');
            var symbol;
            var currency;

            var element = _.find(this.responseObj['#project'], function (el) {
                return el._id === id;
            });

            if ($target.closest('a').attr('id') === 'currencyDd'){
                currency =  _.findWhere(this.responseObj['#currencyDd'], {_id : $target.attr('id')});
                symbol = currency ? currency.currency : '$';
                dd.attr('data-symbol', symbol);
                dd.text($(e.target).text());
                dd.attr('data-id', id);
                this.$el.find('.currencySymbol').text(symbol);
            }

            if (type !== $.trim(this.$el.find('#supplierDd').text()) && element && element.customer && element.customer.name) {
                this.$el.find('#supplierDd').text(element.customer.name && element.customer.name.first ? element.customer.name.first +
                ' ' + element.customer.name.last : element.customer.name);
                this.$el.find('#supplierDd').attr('data-id', element.customer._id);
            }

            this.hideNewSelect();
        },

        saveQuotation: function(e){
            e.preventDefault();

            this.saveItem();
        },

        saveItem: function (proformaCb /* orderCb*/) {
            var self = this;
            var mid = this.forSales ? 62 : 55;
            var thisEl = this.$el;
            var selectedProducts = thisEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var quantity;
            var price;
            var supplier = thisEl.find('#supplierDd').attr('data-id');
            var project = thisEl.find('#projectDd').attr('data-id');
            var destination = $.trim(thisEl.find('#destination').data('id'));
            var deliverTo = $.trim(thisEl.find('#deliveryDd').data('id'));
            var incoterm = $.trim(thisEl.find('#incoterm').data('id'));
            var invoiceControl = $.trim(thisEl.find('#invoicingControl').data('id'));
            var paymentTerm = $.trim(thisEl.find('#paymentTerm').data('id'));
            var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').data('id'));
            var supplierReference = thisEl.find('#supplierReference').val();
            var orderDate = thisEl.find('#orderDate').val();
            var expectedDate = thisEl.find('#expectedDate').val() || orderDate;
            var total = helpers.spaceReplacer($.trim(thisEl.find('#totalAmount').text()));
            var totalTaxes = helpers.spaceReplacer($.trim(thisEl.find('#taxes').text()));
            var unTaxed = helpers.spaceReplacer($.trim(thisEl.find('#totalUntaxes').text()));
            var discount = parseFloat(thisEl.find('#discount').val());
            var taxes;
            var jobDescription;
            var description;
            var subTotal;
            var jobs;
            var scheduledDate;
            var usersId = [];
            var groupsId = [];
            var data;

            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };

            var i;
            var whoCanRW;
            var owner = this.$el.find('#allUsersSelect').attr('data-id') || null;

            unTaxed = parseFloat(unTaxed) * 100;
            total = parseFloat(total) * 100;
            totalTaxes = parseFloat(totalTaxes) * 100;

            thisEl.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');

                    if (productId) {
                        quantity = targetEl.find('[data-name="quantity"] input').val() || targetEl.find('[data-name="quantity"] span').text();
                        price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val());
                        price = parseFloat(price) * 100;

                        if (isNaN(price) || price <= 0) {
                            App.stopPreload();
                            return App.render({
                                type   : 'error',
                                message: 'Please, enter Unit Price!'
                            });
                        }
                        scheduledDate = targetEl.find('[data-name="scheduledDate"]').text();
                        taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());

                        taxes = parseFloat(taxes) * 100;
                        description = targetEl.find('.productDescr').val();
                        jobs = targetEl.find('[data-name="jobs"]').attr('data-content');
                        jobDescription = targetEl.find('textarea.jobsDescription').val();
                        subTotal = helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());
                        subTotal = parseFloat(subTotal) * 100;

                        if (!quantity) {
                            return App.render({
                                type   : 'error',
                                message: 'Quantity can\'t be empty'
                            });
                        }

                        if (!price) {
                            return App.render({
                                type   : 'error',
                                message: 'Unit price can\'t be empty'
                            });
                        }

                        if (jobs) {
                            products.push({
                                product       : productId,
                                unitPrice     : price,
                                quantity      : quantity,
                                scheduledDate : scheduledDate,
                                taxes         : taxes,
                                description   : $.trim(description),
                                jobDescription: jobDescription,
                                subTotal      : subTotal,
                                jobs          : jobs
                            });
                        } else if (this.forSales) {
                            return App.render({
                                type   : 'notify',
                                message: "Jobs can't be empty."
                            });
                        } else {
                            products.push({
                                product      : productId,
                                unitPrice    : price,
                                quantity     : quantity,
                                scheduledDate: scheduledDate,
                                taxes        : taxes,
                                description  : description,
                                subTotal     : subTotal
                            });
                        }

                    }
                }
            }

            data = {
                currency         : currency,
                supplier         : supplier,
                supplierReference: supplierReference,
                deliverTo        : deliverTo,
                products         : products,
                project          : project,
                orderDate        : orderDate,
                expectedDate     : expectedDate,
                destination      : destination,
                incoterm         : incoterm,
                invoiceControl   : invoiceControl,
                paymentTerm      : paymentTerm,
                fiscalPosition   : fiscalPosition,
                paymentInfo : {
                    total   : total,
                    unTaxed : unTaxed,
                    taxes   : totalTaxes,
                    discount: discount
                },

                groups: {
                    owner: owner,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            };

            if (supplier) {
                this.model.set(data);
                this.model.save(this.model.changed, {
                    headers: {
                        mid: mid
                    },
                    patch  : true,
                    wait   : true,
                    success: function (res) {
                        //if (url === '#easyErp/salesQuotations/list') {
                        //    self.hideDialog();
                        //    Backbone.history.fragment = '';
                        //    Backbone.history.navigate(url, {trigger: true});
                        //} else {
                        //    self.hideDialog();
                        //}

                        if (proformaCb && typeof proformaCb === 'function') {
                            return proformaCb(null, res);
                        }

                        if (self.eventChannel) {
                            self.eventChannel.trigger('quotationUpdated');
                        }

                        self.redirectAfter(self, res);
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);

                        if (proformaCb && typeof proformaCb === 'function') {
                            return proformaCb(xhr.text);
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

        redirectAfter: function (content) {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var model = this.currentModel.toJSON();
            var formString = this.template({
                model        : model,
                visible      : this.visible,
                hidePrAndCust: this.hidePrAndCust
            });
            var service = this.forSales;
            var productItemContainer;

            $thisEl.html(formString);

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);

            populate.get('#destination', '/destination', {}, 'name', this, false, true);
            populate.get('#incoterm', '/incoterm', {}, 'name', this, false, true);
            populate.get('#invoicingControl', '/invoicingControl', {}, 'name', this, false, true);
            populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, false, true);
            populate.get('#deliveryDd', '/deliverTo', {}, 'name', this, false, true);

            if (this.forSales) {
                populate.get('#supplierDd', CONSTANTS.URLS.CUSTOMERS, {}, 'fullName', this, false, false);

                populate.get('#projectDd', '/projects/getForDd', {}, 'name', this, false, false);

            } else {
                populate.get2name('#supplierDd', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);
            }

            this.$el.find('#orderDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : '+0D'
            });

            this.$el.find('#expectedDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : '+0D'
            });

            this.delegateEvents(this.events);
            model = this.currentModel.toJSON();

            productItemContainer = this.$el.find('#productItemsHolder');

            productItemContainer.append(
                new ProductItemView({
                    editable  : true,
                    forSales  : self.forSales,
                    canBeSold : self.forSales,
                    discountVisible : true,
                    quotations: true
                }).render({model: model}).el
            );

            dataService.getData(CONSTANTS.URLS.PROJECTS_GET_FOR_WTRACK, null, function (projects) {
                projects = _.map(projects.data, function (project) {
                    project.name = project.projectName;

                    return project;
                });

                self.responseObj['#project'] = projects;
            });

            App.stopPreload();

            return this;
        }
    });

    return FormView;
});
