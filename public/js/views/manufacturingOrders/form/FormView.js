define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'views/manufacturingOrders/CreateView',
    'views/Products/orderRows/ProductItems',
    'text!templates/manufacturingOrders/form/FormTemplate.html',
    'text!templates/manufacturingOrders/ConsumedTemplate.html',
    'models/goodsOutNotesModel',
    'dataService',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, _, $,
             ParentView,
             CreateView,
             ProductItemView,
             FormTemplate,
             ConsumedTemplate,
             GoodsOutNote,
             dataService,
             populate,
             CONSTANTS,
             keyValidator) {

    var FormManufacturingOrdersView = ParentView.extend({
        el              : '#content-holder',
        formTemplate    : _.template(FormTemplate),
        consumedTemplate: _.template(ConsumedTemplate),

        events: {
            'click .removeJob'        : 'deleteRow',
            'click .addProductItem a' : 'getComponents',
            'click #fulfillAll'       : 'fullfillShip',
            'click #fulfilAndShip'    : 'fullfillShip',
            'click #cancelOrder'      : 'cancelOrder',
            'click #saveBtn'          : 'saveItem',
            'click .saveBtn'          : 'saveOrder',
            'keypress .forNum'        : 'keypressHandler',
            'keyup #quantityToProduce': 'changeQuantity'
        },

        keypressHandler: function (e) {
            return keyValidator(e, false);
        },

        initialize: function (options) {
            var modelObj;
            this.responseObj = {};

            this.formModel = options.model;
            modelObj = this.formModel.toJSON();
            this.onlyView = (modelObj.workflow && modelObj.workflow.status === 'Done');

            this.render();
        },

        saveOrder: function (e) {
            e.preventDefault();
            this.gaTrackingEditConfirm();
            this.saveItem();
        },

        changeQuantity: function () {
            this.$el.find('#consumedContainer').html(this.consumedTemplate({
                data    : this.currentBillObject && this.currentBillObject.components,
                quantity: this.$el.find('#quantityToProduce').val(),
                isCreate: true
            }));
        },

        saveItem: function (invoiceCb) {
            var self = this;
            var $el = this.$el;
            var productsDd = $el.find('#productsDd').attr('data-id');
            var billOfMaterial = $el.find('#billOfMaterial').attr('data-id');
            var routing = $el.find('#routing').attr('data-id');
            var deadlineStart = $el.find('#deadlineStart').val();
            var quantityToProduce = $el.find('#quantityToProduce').val();
            var responsible = $el.find('#responsible').attr('data-id');
            var source = $el.find('#source').attr('data-id');
            var warehouseDd = $el.find('#warehouseDd').attr('data-id');
            var warehouseTo = this.$el.find('#warehouseToDd').attr('data-id');
            var workflow = $el.find('#workflowsDd').attr('data-id');
            var allocateProducts = [];
            var products = [];
            var selectedProducts = $el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var quantityAvailable;
            var productId;
            var quantity;
            var targetEl;
            var data;
            var id;
            var i;

            if (!productsDd) {
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

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    id = targetEl.attr('data-id');
                    productId = targetEl.find('.productsDd').attr('data-id');

                    if (productId) {
                        quantity = $.trim(targetEl.find('[data-name="quantity"]').text());
                        quantityAvailable = $.trim(targetEl.find('[data-name="availabilityQuantity"]').text());
                        quantity = parseFloat(quantity);
                        quantityAvailable = parseFloat(quantityAvailable);

                        products.push({
                            id       : id,
                            warehouse: this.warehouse,
                            product  : productId,
                            quantity : quantity
                        });
                    }
                }
            }

            data = {
                quantity      : quantityToProduce || null,
                billOfMaterial: billOfMaterial || null,
                deadlineStart : deadlineStart || null,
                responsible   : responsible || null,
                routing       : routing || null,
                source        : source || null,
                warehouse     : warehouseDd,
                warehouseTo   : warehouseTo,
                product       : productsDd,
                workflow      : workflow,
                orderRows     : products
            };

            this.formModel.save(data, {
                wait   : true,
                patch  : true,
                success: function () {
                    function callBack() {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                        self.hideDialog();
                    }

                    if (invoiceCb && (typeof invoiceCb === 'function')) {
                        return self.model.fetch({
                            success: function () {
                                return invoiceCb();
                            }
                        });

                    }

                    if (allocateProducts && allocateProducts.length) {
                        self.createAllocation(allocateProducts, callBack);
                    } else {
                        callBack();
                    }
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });

        },

        checkActiveClass: function (e) {
            var $target = $(e.target);

            if ($target.closest('li').hasClass('activeItem')) {
                return true;
            }

            return false;
        },

        cancelOrder: function (e) {
            var self = this;
            var canceledObj;
            var answer = confirm('Do you really want to Cancel Order? All products will be returned.');

            if (!answer) {
                return false;
            }

            e.preventDefault();
            e.stopPropagation();

            canceledObj = _.find(this.responseObj['#workflowsDd'], function (el) {
                return el.status === 'Cancelled';
            });

            if (this.formModel.toJSON().workflow.status === 'Done') {
                canceledObj = this.formModel.toJSON().workflow;
            }

            self.formModel.save({
                workflow: canceledObj._id,
                cancel  : true,
                forSales: true
            }, {
                headers: {
                    mid: 57
                },
                patch  : true,
                success: function () {
                    var url = window.location.hash;

                    self.deleteAllocation();

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        deleteAllocation: function () {
            var rowId = this.$el.find('.productItem');
            var rows = [];
            var self = this;

            rowId.each(function () {

                rows.push({
                    orderRowId: $(this).attr('data-id'),
                    quantity  : 0,
                    product   : $(this).find('.productsDd').attr('data-id'),
                    warehouse : self.$el.find('#warehouseDd').attr('data-id')

                });
            });

            this.createAllocation(rows);
        },

        createAllocation: function (array, cb) {
            var body = {
                data : array,
                order: this.formModel.toJSON()._id
            };

            dataService.postData('warehouse/allocate', body, function (err) {
                if (err) {
                    App.render({
                        type   : 'error',
                        message: err.message
                    });
                } else {
                    App.render({
                        type   : 'notify',
                        message: 'Success'
                    });
                }
                if (cb && typeof cb === 'function') {
                    cb();
                }
            });
        },

        fullfillShip: function (e) {
            var self = this;
            var $target = $(e.target).closest('a');
            var goodsNote = new GoodsOutNote();
            var rowId = this.$el.find('.productItem');
            var warehouse = this.$el.find('#warehouseDd').attr('data-id');
            var formModel = this.formModel.toJSON();
            var workflow = $.trim(this.$el.find('#workflowsDd').attr('data-id'));
            var isShip = $target.attr('id') === 'fulfilAndShip';
            var quantityProduce = parseInt(this.$el.find('#quantityToProduce').val(), 10);
            var rows = [];
            var answer;
            var data;
            var products = formModel.products;

            if (!this.checkActiveClass(e)) {
                return false;
            }

            e.preventDefault();
            e.stopPropagation();

            rowId.each(function () {
                var allocatedAll = parseInt($(this).find('[data-name="quantity"] span').text(), 10);
                var product = $(this).find('.productsDd').attr('data-id');
                var onHand = parseInt($.trim($(this).find('[data-name="availabilityQuantity"] span').text()), 10);
                var lastQuantity;
                var self = this;
                var item = products.find(function (el) {
                    return el.product._id === $(self).attr('data-id');
                });

                lastQuantity = allocatedAll;

                if (lastQuantity > onHand) {
                    lastQuantity = onHand;
                }

                if (lastQuantity) {
                    if (lastQuantity !== allocatedAll) {
                        if (onHand) {
                            rows.push({
                                orderRowId: item && item._id ? item._id : null,
                                quantity  : lastQuantity,
                                product   : product
                            });
                        }
                    } else {
                        rows.push({
                            orderRowId: item && item._id ? item._id : null,
                            quantity  : lastQuantity,
                            product   : product
                        });
                    }

                }
            });

            data = {
                orderRows         : rows,
                manufacturingOrder: formModel._id,
                product           : formModel.product_id,
                name              : formModel.name,
                warehouse         : warehouse,
                workflow          : workflow
            };
            if (isShip) {
                data['status.shipped'] = true;
            }

            answer = confirm('Do you really want to Fulfill');

            if (!answer) {
                return false;
            }

            if (rows.length) {
                this.saveItem(function () {
                    data.isManufacturing = true;

                    goodsNote.save(data, {
                        headers: {
                            mid: 57
                        },
                        patch  : true,
                        success: function () {
                            Backbone.history.fragment = '';

                            return Backbone.history.navigate(window.location.hash, {trigger: true});
                        },

                        error: function (model, err) {
                            var message = err.message;

                            if (err.status === 404) {
                                message = 'Not enough available products';
                            }
                            App.render({
                                type   : 'error',
                                message: message
                            });
                        }
                    });
                });
            } else if (!rows.length) {
                App.render({
                    type   : 'error',
                    message: 'No items for fulfill'
                });
            }

        },

        renderComponents: function (warehouse, productId, bill, id) {
            var self = this;
            var formModel = this.formModel.toJSON();
            var data = {};
            var currentBill;
            var products = formModel.products;

            dataService.getData('/billOfMaterials/byProduct', {
                _id      : productId,
                warehouse: warehouse
            }, function (resp) {
                if (resp && resp.data) {
                    self.responseObj['#billOfMaterial'] = resp.data;

                    currentBill = _.find(self.responseObj['#billOfMaterial'], function (el) {
                        return el._id === bill;
                    });

                    if (!currentBill) {
                        currentBill = resp.data[0];
                    }

                    if (resp.data && resp.data.length) {

                        if (id === 'productsDd') {
                            self.$el.find('#billOfMaterial').html(currentBill.name).attr('data-id', currentBill._id);

                            if (resp.data[0].routing) {
                                self.$el.find('#routing').html(currentBill.routing.name).attr('data-id', currentBill.routing._id);
                            } else {
                                self.$el.find('#routing').html('Not Selected').attr('data-id', null);
                            }
                        }

                        self.currentBillObject = currentBill;

                        self.$el.find('#consumedContainer').html(self.consumedTemplate({
                            data    : currentBill.components,
                            quantity: self.$el.find('#quantityToProduce').val(),
                            isCreate: false
                        }));

                    }

                } else {
                    self.$el.find('#billOfMaterial').html('No data').attr('data-id', null);
                    self.$el.find('#routing').html('No data').attr('data-id', null);
                    self.$el.find('#consumedContainer').html('');
                }
            }, this);
        },

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.closest('a').attr('id');
            var $targetId = $target.attr('id');
            var warehouse;
            var bill;
            var productId;
            var currentBillObject;

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $targetId);

            if (id === 'workflowsDd' && $target.attr('data-status') === 'cancelled') {
                this.cancelOrder(e);
            }

            if (id === 'productsDd' || id === 'warehouseDd') {
                warehouse = this.$el.find('#warehouseDd').attr('data-id');
                bill = this.$el.find('#billOfMaterial').attr('data-id');
                productId = this.$el.find('#productsDd').attr('data-id');
                this.renderComponents(warehouse, productId, bill, id);
            } else if (id === 'billOfMaterial') {
                currentBillObject = _.find(self.responseObj['#billOfMaterial'], function (el) {
                    return el._id === $targetId;
                });

                self.currentBillObject = currentBillObject;

                self.$el.find('#consumedContainer').html(self.consumedTemplate({
                    data    : currentBillObject.components,
                    quantity: self.$el.find('#quantityToProduce').val(),
                    isCreate: false
                }));

                if (currentBillObject && currentBillObject.routing) {
                    self.$el.find('#routing').html(currentBillObject.routing.name).attr('data-id', currentBillObject.routing._id);
                } else {
                    self.$el.find('#routing').html('Not Selected').attr('data-id', null);
                }
            }
            this.hideNewSelect();

            return false;
        },

        render: function () {
            var formModel = this.formModel.toJSON();
            var $thisEl = this.$el;
            var self = this;
            var billOfMaterial = formModel.billOfMaterial && formModel.billOfMaterial._id;

            formModel.onlyView = this.onlyView;

            $thisEl.html(this.formTemplate(formModel));

            if (!this.onlyView) {
                populate.get('#productsDd', '/products/getProductsNames', {}, 'name', this, true, false, null);
                populate.get('#source', '/manufacturingOrders', {}, 'name', this, true, true, null);
                populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {
                    id    : 'Sales Order',
                    status: {$ne: 'Done'}
                }, 'name', this, false, function (resp) {
                    var el = self.$el.find('#workflowsDd');
                    var workflowObj;

                    self.responseObj['#workflows'] = resp;
                    if (resp && resp.length) {
                        workflowObj = _.find(self.responseObj['#workflows'], function (elem) {
                            return elem.name === formModel.workflow.name;
                        });
                        self.workflow = workflowObj;
                        el.text(workflowObj.name).attr('data-id', workflowObj._id);
                    }
                });

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
                        el.text(formModel.warehouse.name).attr('data-id', formModel.warehouse._id);
                        elTo.text(formModel.warehouseTo.name).attr('data-id', formModel.warehouseTo._id);
                    }
                });

            }

            this.$el.find('#deadlineStart').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : 0
            }).datepicker('setDate', new Date(formModel.deadlineStart));

            this.renderComponents(formModel.warehouse._id, formModel.product._id, billOfMaterial);

            return self;
        }

    });
    return FormManufacturingOrdersView;
});
