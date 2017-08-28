define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'views/Products/orderRows/ProductItems',
    'models/ManufacturingOrderModel',
    'collections/Products/products',
    'text!templates/manufacturingOrders/CreateTemplate.html',
    'text!templates/manufacturingOrders/ConsumedTemplate.html',
    'constants',
    'dataService',
    'populate',
    'helpers',
    'helpers/keyValidator',
    'helpers/ga'
], function (Backbone, _, $, Parent, ProductItemView, Model, ProductCollection, CreateTemplate, ConsumedTemplate, CONSTANTS, dataService, populate, helpers, keyValidator, ga) {
    'use strict';

    var CreateView = Parent.extend({
        el              : '#content-holder',
        template        : _.template(CreateTemplate),
        consumedTemplate: _.template(ConsumedTemplate),
        contentType     : CONSTANTS.MANUFACTURINGORDERS,

        initialize: function (options) {
            this.model = new Model();
            this.responseObj = options && options.responseObj || {};
            this.products = options && options.products || [];
            this.components = [];

            this.render();
        },

        events: {
            'keypress .forNum'        : 'keypressHandler',
            'keyup #quantityToProduce': 'changeQuantity'
        },

        keypressHandler: function (e) {
            return keyValidator(e, false);
        },

        changeQuantity: function () {
            this.$el.find('#consumedContainer').html(this.consumedTemplate({
                data    : this.currentBillObject && this.currentBillObject.components,
                quantity: this.$el.find('#quantityToProduce').val(),
                isCreate: true
            }));
        },

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.closest('a').attr('id');
            var $targetId = $target.attr('id');
            var warehouse;
            var productId;
            var currentBillObject;

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $targetId);

            if (id === 'productsDd' || id === 'warehouseDd') {
                warehouse = this.$el.find('#warehouseDd').attr('data-id');
                productId = this.$el.find('#productsDd').attr('data-id');
                dataService.getData('/billOfMaterials/byProduct', {
                    _id      : productId,
                    warehouse: warehouse
                }, function (resp) {
                    if (resp && resp.data && resp.data.length) {
                        self.responseObj['#billOfMaterial'] = resp.data;
                        if (resp.data && resp.data.length) {
                            self.components = resp.data[0].components;

                            self.currentBillObject = resp.data[0];

                            if (id === 'productsDd') {
                                self.$el.find('#billOfMaterial').html(resp.data[0].name).attr('data-id', resp.data[0]._id);
                            }

                            self.$el.find('#consumedContainer').html(self.consumedTemplate({
                                data    : self.components,
                                quantity: self.$el.find('#quantityToProduce').val(),
                                isCreate: true
                            }));

                            if (resp.data[0].routing) {
                                self.$el.find('#routing').html(resp.data[0].routing.name).attr('data-id', resp.data[0].routing._id);
                            } else {
                                self.$el.find('#routing').html('Not Selected').attr('data-id', null);
                            }
                        }

                    } else {
                        self.$el.find('#billOfMaterial').html('No data').attr('data-id', null);
                        self.$el.find('#routing').html('No data').attr('data-id', null);
                        self.$el.find('#consumedContainer').html('');
                    }
                }, this);
            } else if (id === 'billOfMaterial') {
                currentBillObject = _.find(self.responseObj['#billOfMaterial'], function (el) {
                    return el._id === $targetId;
                });

                self.currentBillObject = currentBillObject;

                self.$el.find('#consumedContainer').html(self.consumedTemplate({
                    data    : currentBillObject.components,
                    quantity: self.$el.find('#quantityToProduce').val(),
                    isCreate: true
                }));

                if (currentBillObject && currentBillObject.routing) {
                    self.$el.find('#routing').html(currentBillObject.routing.name).attr('data-id', currentBillObject.routing._id);
                } else {
                    self.$el.find('#routing').html('Not selected').attr('data-id', null);
                }
            }
            this.hideNewSelect();

            return false;
        },

        saveItem: function () {
            var self = this;
            var $el = this.$el;
            var responsible = _.escape($.trim($el.find('#responsible').attr('data-id')));
            var warehouseDd = _.escape($.trim($el.find('#warehouseDd').attr('data-id')));
            var warehouseTo = _.escape($.trim($el.find('#warehouseToDd').attr('data-id')));
            var workflowsDd = _.escape($.trim($el.find('#workflowsDd').attr('data-id')));
            var product = _.escape($.trim($el.find('#productsDd').attr('data-id')));
            var quantityToProduce = _.escape($el.find('#quantityToProduce').val());
            var routing = _.escape($.trim($el.find('#routing').attr('data-id')));
            var billOfMaterial = _.escape($.trim($el.find('#billOfMaterial').attr('data-id')));
            var source = _.escape($.trim($el.find('#source').attr('data-id')));
            var deadlineStart = _.escape($el.find('#deadlineStart').val());
            var data;

            if (!product) {
                return App.render({
                    type   : 'error',
                    message: 'Product can\'t be empty'
                });
            }

            if (!warehouseDd) {
                return App.render({
                    type   : 'error',
                    message: 'Warehouse can\'t be empty'
                });
            }

            if (!parseInt(quantityToProduce, 10) > 0) {
                return App.render({
                    type   : 'error',
                    message: 'Quantity to produce must be grater than 0'
                });
            }

            data = {
                components    : this.components,
                product       : product,
                warehouse     : warehouseDd,
                warehouseTo   : warehouseTo,
                source        : source || null,
                routing       : routing || null,
                responsible   : responsible || null,
                billOfMaterial: billOfMaterial || null,
                deadlineStart : deadlineStart || Date.now(),
                quantity      : parseInt(quantityToProduce, 10),
                workflow      : workflowsDd,
                status        : {
                    allocateStatus: 'NOT',
                    fulfillStatus : 'NOT',
                    shippingStatus: 'NOT'
                }
            };

            this.model.save(data, {
                wait   : true,
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var formString = this.template();
            var self = this;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : '1100px',
                title      : 'Create Manufacturing Order',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            ga && ga.trackingEditConfirm(self.contentType);
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                            ga && ga.trackingEditCancel(self.contentType);
                        }
                    }
                }
            });

            populate.get('#productsDd', '/products/getProductsNames', {}, 'name', this);
            populate.get('#source', '/manufacturingOrders', {}, 'name', this, true, true, null);
            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#responsible'] = employees;
            });
            dataService.getData('warehouse/getForDd', {}, function (resp) {
                var el = self.$el.find('#warehouseDd');
                var elTo = self.$el.find('#warehouseToDd');
                self.responseObj['#warehouseDd'] = resp.data;
                self.responseObj['#warehouseToDd'] = resp.data;
                if (resp.data && resp.data.length) {
                    self.warehouse = resp.data[0];
                    el.text(resp.data[0].name).attr('data-id', resp.data[0]._id);
                    elTo.text(resp.data[0].name).attr('data-id', resp.data[0]._id);
                }
            });
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {
                id    : 'Sales Order',
                status: {$ne: 'Done'}
            }, 'name', this, false, function (resp) {
                var el = self.$el.find('#workflowsDd');
                var workflowObj;

                self.responseObj['#workflows'] = resp;
                if (resp && resp.length) {
                    workflowObj = _.find(self.responseObj['#workflows'], function (elem) {
                        return elem.name === 'Processing';
                    });
                    self.workflow = workflowObj;
                    el.text(workflowObj.name).attr('data-id', workflowObj._id);
                }
            });
            this.$el.find('#deadlineStart').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : 0
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return CreateView;
});