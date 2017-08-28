define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/stockCorrections/CreateTemplate.html',
    'text!templates/stockCorrections/ProductItems.html',
    'text!templates/stockCorrections/ProductItem.html',
    'models/stockCorrectionModel',
    'common',
    'populate',
    'constants',
    'helpers/keyValidator',
    'dataService'
], function (Backbone, $, _, ParentView, CreateTemplate, ProductItems, ProductItem, CorrectionModel, common, populate, CONSTANTS, keyValidator, dataService) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Tasks',
        template   : _.template(CreateTemplate),
        responseObj: {},

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new CorrectionModel();
            this.render();
            this.responseObj = {};
            this.changedQuantity = _.debounce(this.changedQuantity, 250);
        },

        events: {
            'click .addProductItem a': 'getProducts',
            'click .removeJob'       : 'deleteRow',
            'keypress  .number'      : 'keypressHandler',
            'keyup  input.quantity'  : 'changedQuantity'
        },

        getProducts: function (e) {
            this.$el.find('#productList').prepend(_.template(ProductItem, {elem: {}}));
        },

        keypressHandler: function (e) {
            return keyValidator(e, true, true);
        },

        changedQuantity: function (e) {
            var $targetEl = $(e.target);
            var $parent = $targetEl.closest('tr');
            var inputEl = $targetEl.closest('input');
            var type = inputEl.attr('id');
            var available = parseInt($parent.find('#onHand').val()) || 0;
            var val;

            if (!inputEl.length) {
                inputEl = $parent.find('textarea');
            }
            val = parseInt(inputEl.val());

            if (!val) {
                val = 0;
            }

            e.preventDefault();

            if (type === 'newOnHand') {
                $parent.find('#adjusted').val(val - available);
            } else {
                $parent.find('#newOnHand').val(val + available);
            }

        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var warehouse = $thisEl.find('#warehouseDd').attr('data-id');
            var location = this.$el.find('#locationDd').attr('data-id');
            var description = this.$el.find('#description').val();
            var selectedProducts = this.$el.find('.productItem');
            var saveObject;
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var adjusted;
            var cost;
            var onHand;
            var products = [];
            var productAvailable;
            var i;

            if (!selectedLength) {
                return App.render({
                    type   : 'error',
                    message: "Products can't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                productId = targetEl.find('#productsDd').attr('data-id');
                productAvailable = targetEl.attr('id');

                if (!productId) {
                    return App.render({
                        type   : 'error',
                        message: "Products can't be empty."
                    });
                }

                adjusted = parseFloat(targetEl.find('#adjusted').val());
                onHand = parseFloat(targetEl.find('#newOnHand').val());
                cost = parseFloat(targetEl.find('#cost').val()) * 100;

                if (onHand < 0) {
                    return App.render({
                        type   : 'error',
                        message: "Available products value can't be negative"
                    });
                }

                if (!adjusted) {
                    return App.render({
                        type   : 'error',
                        message: "Corrections not found in products"
                    });
                }

                products.push({
                    productAvailable: productAvailable,
                    product         : productId,
                    cost            : cost,
                    quantity        : adjusted,
                    onHand          : onHand
                });
            }

            saveObject = {
                warehouse  : warehouse,
                location   : location,
                orderRows  : products,
                description: description
            };

            this.model.save(saveObject, {
                wait   : true,
                success: function (model) {

                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var jobId = tr.find('#productsDd').attr('data-id');
            var product = _.findWhere(this.responseObj['#productsDd'], {_id: jobId});
            if (product) {
                product.selectedElement = false;
            }

            e.stopPropagation();
            e.preventDefault();

            tr.remove();
        },

        chooseOption: function (e) {
            var $target = $(e.target).closest('li');
            var id = $target.attr('id');
            var $thisEl = this.$el;
            var self = this;
            var type = $target.closest('a').attr('id');
            var warehouse = this.$el.find('#warehouseDd').attr('data-id');
            var location = this.$el.find('#locationDd').attr('data-id');
            var product;
            var $row = $target.closest('.productItem,deleteItem');
            var prevProduct = $row.find('#productsDd').attr('data-id');

            if (type === 'warehouseDd') {    // added condition for project with no data-level empty
                populate.get('#locationDd', 'warehouse/location/getForDd', {warehouse: id}, 'name', this, false);
                $thisEl.find('.jobs').removeClass('jobs');
                $thisEl.find('#productList').html('');
                $thisEl.find('#locationDd').text('Select').attr('data-id', '');
                self.responseObj['#productsDd'].forEach(function (el) {
                    delete el.selectedElement;
                });
            }

            if (type === 'locationDd' && warehouse) {    // added condition for project with no data-level empty
                $thisEl.find('#newItem').removeClass('hidden');
                $thisEl.find('#productList').html('');
                self.responseObj['#productsDd'].forEach(function (el) {
                    delete el.selectedElement;
                });
            }

            if (type === 'productsDd') {
                dataService.getData('warehouse/getAvailability', {location: location, product: id}, function (data) {
                    product = _.findWhere(self.responseObj['#productsDd'], {_id: id});

                    if (prevProduct) {
                        prevProduct = _.findWhere(self.responseObj['#productsDd'], {_id: prevProduct});
                        delete prevProduct.selectedElement;
                    }

                    product.selectedElement = true;
                    $row.find('.productDescr').val(product.info.description).prop('disabled', false).attr('placeholder', '');
                    if (data) {
                        $row.attr('id', data._id);
                        $row.find('#onHand').val(data.onHand || 0);
                        $row.find('#newOnHand').val(data.onHand || 0);
                        $row.find('#adjusted').val(0);
                        $row.find('#cost').val(0);
                    } else {
                        $row.find('.statusInfo').each(function () {
                            $(this).val(0);
                        });
                    }
                });
            }

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            this.hideNewSelect();

            return false;
        },

        render: function () {
            var formString = this.template();
            var self = this;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 950,
                title      : 'Create Task',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }
                }
            });

            populate.get('#locationDd', 'warehouse/location/getForDd', {}, 'name', this, false);
            populate.get('#warehouseDd', 'warehouse/getForDD', {}, 'name', this, false);

            dataService.getData('products/', {canBeSold: true}, function (data) {
                self.responseObj['#productsDd'] = data.success;
            });

            this.delegateEvents(this.events);

            this.$el.find('#productItemsHolder').html(_.template(ProductItems));

            return this;
        }

    });

    return CreateView;
});
