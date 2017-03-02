define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Quotations/EditTemplate.html',
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
             ParentView,
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

    var EditView = ParentView.extend({
        contentType: 'Quotations',
        imageSrc   : '',
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

            this.render(options);
        },

        events: {
            'click .confirmOrder'   : 'confirmOrder',
            'click .createProforma' : 'createProforma',
            'click .cancelQuotation': 'cancelQuotation',
            'click .setDraft'       : 'setDraft'
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var id = target.attr('id');
            var type = target.attr('data-level');

            var element = _.find(this.responseObj['#project'], function (el) {
                return el._id === id;
            });

            var currencyElement = $(e.target).parents('dd').find('.current-selected');
            var oldCurrency = currencyElement.attr('data-id');
            var newCurrency = $(e.target).attr('id');
            var oldCurrencyClass = helpers.currencyClass(oldCurrency);
            var newCurrencyClass = helpers.currencyClass(newCurrency);

            var array = this.$el.find('.' + oldCurrencyClass);

            array.removeClass(oldCurrencyClass).addClass(newCurrencyClass);

            currencyElement.text($(e.target).text()).attr('data-id', newCurrency);

            if (type !== $.trim(this.$el.find('#supplierDd').text()) && element && element.customer && element.customer.name) {
                this.$el.find('#supplierDd').text(element.customer.name && element.customer.name.first ? element.customer.name.first +
                ' ' + element.customer.name.last : element.customer.name);
                this.$el.find('#supplierDd').attr('data-id', element.customer._id);
            }

            this.hideNewSelect();
        },

        confirmOrder: function (e) {
            var self = this;
            var wId;
            var mid;
            var status;
            var id = self.currentModel.get('_id');

            e.preventDefault();

            if (this.forSales) {
                wId = 'Sales Order';
                mid = 63;
                status = 'New';
            } else {
                wId = 'Purchase Order';
                mid = 57;
                status = 'In Progress'; // todo workflow for purchase
            }

            this.saveItem(function (err) {
                if (!err) {
                    populate.fetchWorkflow({
                        wId    : wId,
                        status : status,
                        visible: true
                        // targetSource: 'order'
                    }, function (workflow) {
                        var products;

                        if (workflow && workflow.error) {
                            return App.render({
                                type   : 'error',
                                message: workflow.error.statusText
                            });
                        }

                        products = self.currentModel.get('products');

                        if (products && products.length) {
                            self.currentModel.save({
                                isOrder : true,
                                type    : 'Not Invoiced',
                                workflow: workflow._id
                            }, {
                                headers: {
                                    mid: mid
                                },
                                patch  : true,
                                success: function () {
                                    var redirectUrl = self.forSales ? 'easyErp/salesOrders' : 'easyErp/Orders';

                                    if (self.redirect) {

                                        if (self.eventChannel) {
                                            self.eventChannel.trigger('orderUpdate', null, self.currentModel.get('_id'), true);
                                        }

                                        if (self.collection) {
                                            self.collection.remove(self.currentModel.get('_id'));

                                        }

                                    } else {
                                        Backbone.history.navigate(redirectUrl, {trigger: true});
                                    }
                                }
                            });
                        } else {
                            return App.render({
                                type   : 'error',
                                message: CONSTANTS.RESPONSES.CONFIRM_ORDER
                            });
                        }
                    });
                }
            });
        },

        createProforma: function (e) {
            var self = this;
            var url = '/proforma';
            var quotationId = this.currentModel.id;
            var journal = this.forSales ? CONSTANTS.PROFORMA_JOURNAL : null;
            var data = {
                forSales   : this.forSales,
                quotationId: quotationId,
                currency   : this.currentModel.toJSON().currency,
                journal    : journal
            };
            var redirectUrl = self.forSales ? 'easyErp/salesProforma/list' : 'easyErp/Proforma/list';

            if (e) {
                e.preventDefault();
            }
            App.startPreload();

            this.saveItem(function (err, res) {
                var id = res.id;
                if (!err) {

                    dataService.postData(url, data, function (err, response) {
                        var tr;

                        App.stopPreload();

                        if (err) {
                            App.render({
                                type   : 'error',
                                message: 'Can\'t create proforma'
                            });
                        } else {
                            if (App.projectInfo) {
                                App.projectInfo.currentTab = 'proforma';
                            }

                            if (self.eventChannel) {
                                $('.edit-dialog').remove();
                                self.eventChannel.trigger('newProforma', response._id);
                            } else {
                                Backbone.history.fragment = '';
                                Backbone.history.navigate(redirectUrl, {trigger: true});
                            }

                            tr = $('[data-id=' + quotationId + ']');
                            tr.find('.checkbox').addClass('notRemovable');
                            tr.find('.workflow').find('a').text('Proformed');
                        }
                    });
                }
            });
        },

        cancelQuotation: function (e) {
            var self = this;

            e.preventDefault();

            populate.fetchWorkflow({
                wId         : 'Purchase Order',
                source      : 'purchase',
                targetSource: 'quotation',
                status      : 'Cancelled',
                order       : 1
            }, function (workflow) {
                var redirectUrl = window.location.hash;

                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                self.currentModel.save({
                    workflow: workflow._id
                }, {
                    headers: {
                        mid: 57
                    },
                    patch  : true,
                    success: function () {
                        $('.edit-dialog').remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
        },

        setDraft: function (e) {
            var self = this;

            e.preventDefault();

            populate.fetchWorkflow({
                wId: 'Sales Order'
            }, function (workflow) {
                var redirectUrl = window.location.hash;

                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                self.currentModel.save({
                    workflow: workflow._id
                }, {
                    headers: {
                        mid: 57
                    },
                    patch  : true,
                    success: function () {
                        $('.edit-dialog').remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
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
            var taxes;
            var description;
            var subTotal;
            var jobs;
            var scheduledDate;
            var usersId = [];
            var groupsId = [];
            var jobDescription;
            var data;

            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };
            var wF = this.currentModel.get('workflow');

            var workflow = wF._id;

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
                        description = targetEl.find('[data-name="productName"] textarea').val() || targetEl.find('[data-name="productDescr"]').text();
                        jobDescription = targetEl.find('textarea.jobsDescription').val();
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
                orderDate        : helpers.setTimeToDate(orderDate),
                expectedDate     : expectedDate,
                destination      : destination,
                incoterm         : incoterm,
                invoiceControl   : invoiceControl,
                paymentTerm      : paymentTerm,
                fiscalPosition   : fiscalPosition,
                paymentInfo      : {
                    total  : total,
                    unTaxed: unTaxed,
                    taxes  : totalTaxes
                },

                groups: {
                    owner: owner,
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

        deleteItem: function (event) {
            var self = this;
            var mid = this.forSales ? 62 : 55;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer === true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (model) {

                        App.projectInfo = App.projectInfo || {};
                        App.projectInfo.currentTab = 'quotations';

                        if (self.eventChannel) {
                            self.eventChannel.trigger('quotationRemove');
                        }

                        self.redirectAfter(self, model);
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

        redirectAfter: function (content) {
            var redirectUrl = content.forSales ? 'easyErp/salesQuotations' : 'easyErp/Quotations';

            $('.edit-dialog').remove();
            //content.hideDialog();
            Backbone.history.navigate(redirectUrl, {trigger: true});
        },

        render: function () {
            var self = this;
            var model = this.currentModel.toJSON();
            var formString = this.template({
                model        : model,
                visible      : this.visible,
                hidePrAndCust: this.hidePrAndCust
            });
            var service = this.forSales;
            var productItemContainer;
            var buttons = [
                {
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }
            ];

            if (!model.proformaCounter) {
                buttons.push({
                    text : 'Delete',
                    class: 'btn',
                    click: self.deleteItem
                });
            }

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Quotation',
                width      : '900px',
                buttons    : buttons

            });

            this.renderAssignees(this.currentModel);

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

            this.delegateEvents(this.events);
            model = this.currentModel.toJSON();

            productItemContainer = this.$el.find('#productItemsHolder');

            productItemContainer.append(
                new ProductItemView({
                    editable  : true,
                    canBeSold : true,
                    service   : service,
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

            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    $('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $('.groupsAndUser').append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" +
                            item.name + "</td><td class='text-right'></td></tr>");
                        $('#targetGroups').append("<li id='" + item._id + "'>" + item.name + "</li>");
                    });
                    model.groups.users.forEach(function (item) {
                        $('.groupsAndUser').append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" +
                            item.login + "</td><td class='text-right'></td></tr>");
                        $('#targetUsers').append("<li id='" + item._id + "'>" + item.login + "</li>");
                    });

                }
            }

            App.stopPreload();

            return this;
        }
    });

    return EditView;
});
