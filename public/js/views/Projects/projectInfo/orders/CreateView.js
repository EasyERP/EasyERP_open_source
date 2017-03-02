define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/order/CreateView',
    'collections/Persons/PersonsCollection',
    'collections/Departments/DepartmentsCollection',
    'views/Products/InvoiceOrder/ProductItems',
    'models/orderModel',
    'common',
    'populate',
    'constants',
    'views/Assignees/AssigneesView',
    'dataService',
    'helpers'
], function (Backbone, $, _, createView, PersonsCollection, DepartmentsCollection, ProductItemView, OredrModel, common, populate, CONSTANTS, AssigneesView, dataService, helpers) {
    'use strict';

    var CreateView = createView.extend({
        el         : '#content-holder',
        contentType: 'order',
        /*        template      : _.template(CreateTemplate),
         templateNewRow: _.template(newRow),*/

        initialize: function (options) {

            if (options) {
                this.visible = options.visible;
                this.projectModel = options.projectModel;
                this.wTrackCollection = options.wTrackCollection;
                this.createJob = options.createJob;
                this.eventChannel = options.eventChannel;
            }

            this.populate = true;

            if (options.collection) {
                this.collection = options.collection;
            }

            _.bindAll(this, 'saveItem', 'render');
            this.model = new OredrModel();
            this.responseObj = {};
            this.projectId = options.projectId;
            this.customerId = options.customerId;
            this.salesManager = options.salesManager;
            this.render();
            this.getForDd(this.projectId, this.customerId);
            this.forSales = true;
        },

        getForDd: function (projectID, customerId) {
            var customer = this.$el.find('.assigned dd');
            var customerDl = this.$el.find('.assigned dt');

            populate.get('#customerDd', CONSTANTS.URLS.CUSTOMERS, {isCustomer: true}, 'fullName', this, false, false, customerId);

            customer.last().hide();
            customerDl.last().hide();

            customer.last().after("<dt><label>Project</label></dt><dd><span id='projectDd'></span></dd>");

            if (projectID) {
                populate.get('#projectDd', '/projects/getForDd', {}, 'name', this, false, false, projectID);
            } else {
                populate.get('#projectDd', '/projects/getForDd', {}, 'name', this, true, true);
            }

            /*  if (this.salesManager) {
             populate.get('#assignedTo', '/employees/getNames', {isEmployee: true}, 'name', this, false, false, this.salesManager);
             } else {
             populate.get('#assignedTo', '/employees/getNames', {isEmployee: true}, 'name', this, true, true);
             }*/
        },

/*        saveItem: function () {
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

            var forSales = this.forSales || false;

            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };

            var supplier = thisEl.find('#customerDd').attr('data-id');

            var project = this.projectId;
            var destination = thisEl.find('#destination').attr('data-id');
            var assignedTo = thisEl.find('#assignedTo').attr('data-id');
            var deliverTo = thisEl.find('#deliveryDd').attr('data-id');
            var paymentTerm = thisEl.find('#paymentTerm').attr('data-id');
            var workflow = thisEl.find('#workflowsDd').attr('data-id');
            var fiscalPosition = thisEl.find('#fiscalPosition').attr('data-id');
            var priceList = thisEl.find('#priceList').data('id');
            var warehouse = thisEl.find('#warehouseDd').data('id');

            var orderDate = thisEl.find('#orderDate').val();
            var expectedDate = thisEl.find('#expectDate').val() || thisEl.find('#orderDate').val();

            var total = helpers.spaceReplacer($.trim(thisEl.find('#totalAmount').text()));
            var totalTaxes = helpers.spaceReplacer($.trim(thisEl.find('#taxes').text()));
            var taxes;
            var description;
            var jobDescription;
            var unTaxed = helpers.spaceReplacer($.trim(thisEl.find('#totalUntaxes').text()));
            var subTotal;
            var jobs;
            var cost;
            var account;
            var taxCode;

            var usersId = [];
            var groupsId = [];
            var i;
            var status = {
                allocateStatus: 'NOR',
                fulfillStatus : 'NOR',
                shippingStatus: 'NOR'

            };

            var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

            total = parseFloat(total) * 100;
            unTaxed = parseFloat(unTaxed) * 100;

            if (!selectedLength) {
                return App.render({
                    type   : 'error',
                    message: "Products can't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                productId = targetEl.find('.productsDd').attr('data-id');

                if (!productId) {
                    return App.render({
                        type   : 'error',
                        message: "Products can't be empty."
                    });
                }

                quantity = targetEl.find('[data-name="quantity"] input').val() || targetEl.find('[data-name="quantity"] span').text();
                price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val()) * 100;

                if (isNaN(price) || price <= 0) {
                    return App.render({
                        type   : 'error',
                        message: 'Please, enter Unit Price!'
                    });
                }
                taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());
                cost = helpers.spaceReplacer(targetEl.find('.cost .sum').text());
                cost = parseFloat(cost) * 100;
                description = targetEl.find('[data-name="productDescr"] textarea').val();
                jobDescription = targetEl.find('textarea.jobsDescription').val();
                subTotal = helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());
                subTotal = parseFloat(subTotal) * 100;
                jobs = targetEl.find('.current-selected.jobs').attr('data-id');
                account = targetEl.find('.current-selected.accountDd').attr('data-id');
                taxCode = targetEl.find('.current-selected.taxCode').attr('data-id');

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
                    taxes        : taxes,
                    description  : description,
                    subTotal     : subTotal,
                    creditAccount: account,
                    taxCode      : taxCode || null
                });
            }

            if (products.length) {
                status.allocateStatus = 'NOT';
                status.fulfillStatus = 'NOT';
                status.shippingStatus = 'NOT';
            }

            data = {
                currency      : currency,
                forSales      : forSales,
                supplier      : supplier,
                deliverTo     : deliverTo,
                priceList     : priceList,
                project       : project,
                salesPerson   : assignedTo,
                warehouse     : warehouse,
                products      : products,
                orderDate     : helpers.setTimeToDate(orderDate),
                expectedDate  : expectedDate,
                destination   : destination,
                paymentTerm   : paymentTerm,
                fiscalPosition: fiscalPosition,
                populate      : true, // Need Populate data from server
                paymentInfo   : {
                    total  : total,
                    unTaxed: unTaxed,
                    taxes  : totalTaxes
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
        },*/

        redirectAfterSave: function () {
            if (this.eventChannel) {
                this.eventChannel.trigger('orderCreate', null, null, true);
            }
        }
    });

    return CreateView;
});
