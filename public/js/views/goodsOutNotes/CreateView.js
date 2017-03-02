define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/goodsOutNotes/CreateTemplate.html',
    'text!templates/goodsOutNotes/ProductItems.html',
    'text!templates/goodsOutNotes/goodsNoteItems.html',
    'models/goodsOutNotesModel',
    'collections/goodsOutNotes/editCollection',
    'common',
    'populate',
    'constants',
    'helpers/keyValidator',
    'dataService',
    'helpers'
], function (Backbone, $, _, ParentView, CreateTemplate, ProductItems, goodsNoteItems, GoodsModel, GoodsCollection, common, populate, CONSTANTS, keyValidator, dataService, helpers) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'goodsOutNote',
        template   : _.template(CreateTemplate),
        responseObj: {},

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');
            this.collection = new GoodsCollection();
            this.orderModel = options.orderModel;
            this.render();
            this.responseObj = {};
            this.changedQuantity = _.debounce(this.changedQuantity, 250);
            this.collection.on('saved', this.reRenderPage, this);
        },

        events: {
            'click .removeJob'     : 'deleteRow',
            'keypress  .quantity'  : 'keypressHandler',
            'keyup  input.quantity': 'changedQuantity'
        },

        reRenderPage: function () {
            this.hideDialog();
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        changedQuantity: function (e) {
            var $targetEl = $(e.target);
            var $parent = $targetEl.closest('tr');
            var inputEl = $targetEl.closest('input');
            var type = inputEl.attr('id');
            var available = parseInt($parent.find('#onHand').val());
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
            var order = this.orderModel.id;
            var name = this.orderModel.get('name');
            var date = helpers.setTimeToDate(this.$el.find('#date').val());

            self.responseObj['#warehouseDd'].forEach(function (el) {
                var orderRowId;
                var fulfilled;
                var ordered;
                var quantity;
                var targetEl;
                var saveObject;
                var products = [];
                var productAvailable;
                var i;
                var warehouse;
                var _model;
                var id = el._id;

                var selectedProducts = self.$el.find('.productItem[data-id="' + id + '"]');
                var selectedLength = selectedProducts.length;
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    orderRowId = targetEl.attr('id');
                    productAvailable = targetEl.find('#productsDd').attr('data-id');
                    warehouse = targetEl.find('#warehouseDd').attr('data-id');
                    quantity = parseFloat(targetEl.find('#newShip').val());
                    fulfilled = parseFloat(targetEl.find('#fulfilled').val());
                    ordered = parseFloat(targetEl.find('#ordered').val());

                    if (!quantity) {
                        continue;
                    }

                    quantity = quantity > (ordered - fulfilled) ? ordered - fulfilled : quantity;

                    products.push({
                        orderRowId: orderRowId,
                        quantity  : quantity,
                        product   : productAvailable
                    });
                }

                if (!products.length) {
                    return;
                }

                saveObject = {
                    warehouse: id,
                    order    : order,
                    name     : name,
                    date     : date,
                    orderRows: products
                };

                _model = new GoodsModel(saveObject);

                self.collection.add(_model);
            });

            if (!this.collection.length) {
                return App.render({
                    type   : 'error',
                    message: 'No products for fulfill'
                });
            }

            this.collection.save();
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var id = tr.attr('id');
            var deleteArr = [];

            if (id) {
                deleteArr.push(id);
            }
            e.stopPropagation();
            e.preventDefault();

            dataService.deleteData('/goodsOutNotes', {ids: deleteArr}, function (err) {
                if (!err) {
                    tr.remove();
                }

            });
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var type = $target.closest('a').attr('id');

            var $row = $target.closest('.productItem,deleteItem');
            var product = $row.find('#productsDd').attr('data-id');

            if (type === 'warehouseDd') {
                dataService.getData('warehouse/getAvailability', {warehouse: id, product: product}, function (data) {

                    if (data) {
                        $row.find('.warehouseOnHand').text('(' + (data.onHand || 0) + ') on Hand');
                    } else {
                        $row.find('.warehouseOnHand').text('');
                    }

                });
                $row.attr('data-id', id);
            }
            $target.closest('.current-selected').text($target.text()).attr('data-id', id);

            this.hideNewSelect();

            return false;
        },

        render: function () {
            var orderModel = this.orderModel.toJSON();
            var formString = this.template({model: orderModel});
            var self = this;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 1050,
                position   : {
                    at: "top+35%"
                },

                title  : 'Create Task',
                buttons: {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }
                }
            });

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : new Date(this.orderModel.toJSON().orderDate),
                maxDate    : new Date()
            }).datepicker('setDate', new Date());

            populate.get('#locationDd', 'warehouse/location/getForDd', {}, 'name', this, false);
            populate.get('#warehouseDd', 'warehouse/getForDD', {}, 'name', this, false);

            this.delegateEvents(this.events);

            this.$el.find('#productItemsHolder').html(_.template(ProductItems, {products: orderModel.products}));
            this.$el.find('#goodsHolder').html(_.template(goodsNoteItems, {goodsNotes: orderModel.goodsNotes}));

            return this;
        }

    });

    return CreateView;
});
