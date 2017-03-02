define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Quotations/CreateTemplate.html',
    'collections/Persons/PersonsCollection',
    'collections/Departments/DepartmentsCollection',
    'views/dialogViewBase',
    'views/Products/InvoiceOrder/ProductItems',
    'models/QuotationModel',
    'common',
    'populate',
    'constants',
    'views/Assignees/AssigneesView',
    'dataService',
    'helpers/keyValidator',
    'helpers'
], function (Backbone,
             $,
             _,
             CreateTemplate,
             PersonsCollection,
             DepartmentsCollection,
             ParentView,
             ProductItemView,
             QuotationModel,
             common,
             populate,
             CONSTANTS,
             AssigneesView,
             dataService,
             keyValidator,
             helpers) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Quotations',
        template   : _.template(CreateTemplate),

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
            }
            _.bindAll(this, 'saveItem', 'render');
            this.model = new QuotationModel();
            this.responseObj = {};
            this.forSales = false;
            this.currencySymbol = '$';

            this.render();
        },

        events: {
            'keypress .forNum'                                               : 'keydownHandler',
            'click .newSelectList li:not(.miniStylePagination,#generateJobs)': 'chooseOption'
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var type = $target.attr('data-level');
            var aEl;
            var symbol;
            var currency;

            var element = _.find(this.responseObj['#project'], function (el) {
                return el._id === id;
            });
            if ($target.closest('a').attr('id') === 'currencyDd') {
                currency = _.findWhere(this.responseObj['#currencyDd'], {_id: $target.attr('id')});
                symbol = currency ? currency.currency : '$';
                $target.closest('dd').find('.current-selected').attr('data-symbol', symbol);
                this.$el.find('.currencySymbol').text(symbol);
                this.currencySymbol = symbol;
            }

            if (type) {    // added condition for project with no data-level empty
                this.salesManager = element.salesmanager;

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

        saveItem: function () {
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

            var supplier = thisEl.find('#supplierDd').attr('data-id');

            var project = thisEl.find('#projectDd').attr('data-id');
            var destination = $.trim(thisEl.find('#destination').attr('data-id'));
            var deliverTo = $.trim(thisEl.find('#deliveryDd').attr('data-id'));
            var incoterm = $.trim(thisEl.find('#incoterm').attr('data-id'));
            var invoiceControl = $.trim(thisEl.find('#invoicingControl').attr('data-id'));
            var paymentTerm = $.trim(thisEl.find('#paymentTerm').attr('data-id'));
            var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').attr('data-id'));

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
            var usersId = [];
            var groupsId = [];
            var i;

            var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

            total = parseFloat(total) * 100;
            unTaxed = parseFloat(unTaxed) * 100;

            thisEl.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            if (!selectedLength) {
                return App.render({
                    type   : 'error',
                    message: "Products can't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                productId = targetEl.data('id');

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
                // scheduledDate = targetEl.find('[data-name="scheduledDate"]').text();
                taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());
                description = targetEl.find('[data-name="productDescr"] textarea').val();
                jobDescription = targetEl.find('textarea.jobsDescription').val();
                subTotal = helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());
                subTotal = parseFloat(subTotal) * 100;
                jobs = targetEl.find('.current-selected.jobs').attr('data-id');

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
                    product       : productId,
                    unitPrice     : price,
                    quantity      : quantity,
                    taxes         : taxes,
                    description   : description,
                    jobDescription: jobDescription,
                    subTotal      : subTotal,
                    jobs          : jobs
                });
            }

            data = {
                currency      : currency,
                forSales      : forSales,
                supplier      : supplier,
                project       : project,
                deliverTo     : deliverTo,
                products      : products,
                orderDate     : helpers.setTimeToDate(orderDate),
                expectedDate  : expectedDate,
                destination   : destination,
                incoterm      : incoterm,
                invoiceControl: invoiceControl,
                paymentTerm   : paymentTerm,
                fiscalPosition: fiscalPosition,
                populate      : true, // Need Populate data from server
                paymentInfo   : {
                    total  : total,
                    unTaxed: unTaxed,
                    taxes  : totalTaxes
                },

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                workflow: this.defaultWorkflow
            };

            if (supplier && selectedLength) {
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
        },

        redirectAfterSave: function (content) {
            //var redirectUrl = content.forSales ? 'easyErp/salesQuotations' : 'easyErp/Quotations';

            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        createProductView: function () {
            var productItemContainer;

            productItemContainer = this.$el.find('#productItemsHolder');

            if (this.forSales) {
                productItemContainer.append(
                    new ProductItemView({
                        canBeSold     : true,
                        quotations    : true,
                        currencySymbol: this.currencySymbol
                    }).render().el
                );
            } else {
                productItemContainer.append(
                    new ProductItemView({canBeSold: false, quotations: true}).render().el
                );
            }
        },

        render: function () {
            var formString = this.template({visible: this.visible, forSales: this.forSales});
            var self = this;
            var curDate = new Date();

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Quotation',
                width      : '950px',
                buttons    : [
                    {
                        id   : 'create-person-dialog',
                        text : 'Create',
                        class: 'btn blue',
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

            this.createProductView();

            populate.get('#destination', '/destination', {}, 'name', this, true, true);
            populate.get('#incoterm', '/incoterm', {}, 'name', this, true, true);
            populate.get('#invoicingControl', '/invoicingControl', {}, 'name', this, true, true);
            populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, true, true);
            populate.get('#deliveryDd', '/deliverTo', {}, 'name', this, true);

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);

            if (this.forSales) {
                this.$el.find('#supplierDd').removeClass('current-selected');
                populate.get('#projectDd', '/projects/getForDd', {}, 'name', this);
            } else {
                populate.get2name('#supplierDd', CONSTANTS.URLS.SUPPLIER, {}, this);
            }

            dataService.getData('/projects/getForWtrack', null, function (projects) {
                projects = _.map(projects.data, function (project) {
                    project.name = project.projectName;

                    return project;
                });

                self.responseObj['#project'] = projects;
            });

            populate.fetchWorkflow({
                wId         : 'Purchase Order',
                source      : 'purchase',
                targetSource: 'quotation'
            }, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response._id;
                }
            });

            this.$el.find('#orderDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : '+0D'
            }).datepicker('setDate', curDate);

            this.$el.find('#expectDate').datepicker({
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
