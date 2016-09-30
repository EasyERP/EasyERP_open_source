define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Orders/form/EditTemplate.html',
    'text!templates/Orders/form/ViewTemplate.html',
    'views/Assignees/AssigneesView',
    'views/Products/InvoiceOrder/ProductItems',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers'
], function (Backbone, $, _, ParentView, EditTemplate, ViewTemplate, AssigneesView, ProductItemView, common, Custom, dataService, populate, CONSTANTS, helpers) {

    var EditView = ParentView.extend({
        contentType: 'Orders',
        imageSrc   : '',
        template   : _.template(EditTemplate),
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
            this.currentModel.urlRoot = '/orders';
            this.responseObj = {};
            this.editablePrice = this.currentModel.get('workflow').status === 'New' || false;
            this.editable = options.editable || true;
            this.balanceVisible = false;
            this.forSales = options.forSales;
            modelObj = this.currentModel.toJSON();
            this.onlyView = (modelObj.workflow && modelObj.workflow.status === 'Done');
        },

        events: {
            'click .saveBtn'       : 'saveOrder'
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var dd = $target.closest('dd').find('.current-selected');
            var symbol;
            var currency;

            if ($target.closest('a').attr('id') === 'currencyDd') {
                currency = _.findWhere(this.responseObj['#currencyDd'], {_id: $target.attr('id')});
                symbol = currency ? currency.currency : '$';
                dd.attr('data-symbol', symbol);
                dd.text($(e.target).text());
                dd.attr('data-id', id);
                this.$el.find('.currencySymbol').text(symbol);
            }

            //$(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            this.hideNewSelect();
        },

        saveOrder: function (e) {
            e.preventDefault();

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
            var jobs;
            var scheduledDate;
            var taxes;
            var supplier = thisEl.find('#supplierDd').data('id');
            var jobDescription;

            var destination = $.trim(thisEl.find('#destination').data('id'));
            var incoterm = $.trim(thisEl.find('#incoterm').data('id'));
            var invoiceControl = $.trim(thisEl.find('#invoicingControl').data('id'));
            var paymentTerm = $.trim(thisEl.find('#paymentTerm').data('id'));
            var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').data('id'));
            var supplierReference = thisEl.find('#supplierReference').val();
            var orderDate = thisEl.find('#orderDate').val() || thisEl.find('#orderDate').text();
            var expectedDate = thisEl.find('#expectedDate').val() || thisEl.find('#expectedDate').text();

            var total = helpers.spaceReplacer($.trim(thisEl.find('#totalAmount').text()));
            var totalTaxes = helpers.spaceReplacer($.trim(thisEl.find('#taxes').text()));
            var unTaxed = helpers.spaceReplacer($.trim(thisEl.find('#totalUntaxes').text()));
            var discount = parseFloat(thisEl.find('#discount').val());

            var usersId = [];
            var groupsId = [];
            var whoCanRW;
            var currency;
            var i;

            unTaxed = parseFloat(unTaxed) * 100;
            total = parseFloat(total) * 100;
            totalTaxes = parseFloat(totalTaxes) * 100;

            if (thisEl.find('#currencyDd').attr('data-id')) {
                currency = {
                    _id : thisEl.find('#currencyDd').attr('data-id'),
                    name: thisEl.find('#currencyDd').text()
                };
            } else {
                currency = {
                    _id : null,
                    name: ''
                };
            }

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            whoCanRW = this.$el.find('[name="whoCanRW"]:checked').val();

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');
                    if (productId) {  // added more info for save
                        quantity = $.trim(targetEl.find('[data-name="quantity"]').text()) || targetEl.find('[data-name="quantity"] input').val();
                        price = helpers.spaceReplacer(targetEl.find('[data-name="price"] .sum').text()) || helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val());
                        price = parseFloat(price) * 100;
                        scheduledDate = $.trim(targetEl.find('[data-name="scheduledDate"]').text());
                        taxes = helpers.spaceReplacer($.trim(targetEl.find('[data-name="taxes"] .sum').text()));
                        taxes = parseFloat(taxes) * 100;
                        description = targetEl.find('.productDescr').val();
                        jobDescription = targetEl.find('textarea.jobsDescription').val();
                        jobs = targetEl.find('[data-name="jobs"]').attr('data-content');
                        subTotal = helpers.spaceReplacer($.trim(targetEl.find('.subtotal .sum').text()));
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

                        products.push({
                            product       : productId,
                            unitPrice     : price,
                            quantity      : quantity,
                            scheduledDate : scheduledDate,
                            taxes         : taxes,
                            description   : description,
                            jobDescription: jobDescription,
                            subTotal      : subTotal,
                            jobs          : jobs || null
                        });
                    }
                }
            }

            data = {
                currency         : currency,
                supplier         : supplier,
                supplierReference: supplierReference,
                products         : products,
                orderDate        :orderDate,
                expectedDate     : expectedDate,
                destination      : destination || null,
                incoterm         : incoterm || null,
                invoiceControl   : invoiceControl || null,
                paymentTerm      : paymentTerm || null,
                fiscalPosition   : fiscalPosition || null,
                paymentInfo: {
                    total   : total,
                    unTaxed : unTaxed,
                    discount: discount
                },

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
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
                    success: function () {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                        self.hideDialog();

                        if (invoiceCb && typeof invoiceCb === 'function') {
                            return invoiceCb(null);
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

        deleteItem: function (event) {
            var mid = 55;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        $('.edit-product-dialog').remove();
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            }

        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var model;
            var productItemContainer;

            if (this.onlyView) {
                $('.saveBtn').addClass('hidden');
            } else {
                $('.saveBtn').removeClass('hidden');
            }

            this.template = this.onlyView ? _.template(ViewTemplate) : _.template(EditTemplate);

            formString = this.template({
                model   : this.currentModel.toJSON(),
                visible : this.visible,
                onlyView: this.onlyView,
                forSales: this.forSales
            });

            $thisEl.html(formString);

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);

            populate.get('#destination', '/destination', {}, 'name', this, false, true);
            populate.get('#incoterm', '/incoterm', {}, 'name', this, false, true);
            populate.get('#invoicingControl', '/invoicingControl', {}, 'name', this, false, true);
            populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, false, true);
            populate.get('#deliveryDd', '/deliverTo', {}, 'name', this, false, true);
            populate.get2name('#supplierDd', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);

            this.delegateEvents(this.events);
            model = this.currentModel.toJSON();

            productItemContainer = this.$el.find('#productItemsHolder');

            if (this.onlyView) {
                this.editable = false;
            }

            productItemContainer.append(
                new ProductItemView({
                    editable       : self.editable,
                    editablePrice  : self.editablePrice,
                    balanceVissible: self.balanceVissible,
                    discountVisible: true,
                    forSales       : self.forSales,
                    canBeSold      : self.forSales
                }).render({model: model}).el
            );

            return this;
        }

    });

    return EditView;
});
