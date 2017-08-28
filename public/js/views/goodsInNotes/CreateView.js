define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/goodsInNotes/CreateTemplate.html',
    'text!templates/goodsInNotes/ProductItems.html',
    'models/goodsInNotesModel',
    'common',
    'populate',
    'constants',
    'helpers/keyValidator',
    'helpers',
    'views/guideTours/guideNotificationView'
], function (Backbone, $, _, ParentView, CreateTemplate, ProductItems, GoodsModel, common, populate, CONSTANTS, keyValidator, helpers, GuideNotify) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        template   : _.template(CreateTemplate),
        responseObj: {},

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');
            this.orderModel = options.orderModel;
            this.render();
            this.responseObj = {};
            this.changedQuantity = _.debounce(this.changedQuantity, 250);

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },

        events: {
            'keypress  .quantity'   : 'keypressHandler',
            'click  .removeLocation': 'removeLocation',
            'keyup  input.quantity' : 'changedQuantity'
        },

        removeLocation: function (e) {
            var $target = $(e.target);
            var $div = $target.closest('div');

            $div.remove();
        },

        keypressHandler: function (e) {
            return keyValidator(e, true, true);
        },

        changedQuantity: function (e) {
            var $targetEl = $(e.target);
            var $parent = $targetEl.closest('tr');
            var ordered = parseFloat($parent.find('#ordered').val());
            var received = parseFloat($parent.find('#received').val());
            var $div = $targetEl.closest('.receiveLocation');
            var lengthLocations = this.responseObj['.locationDd'] ? this.responseObj['.locationDd'].length : 0;
            var $siblingDivs = $div.siblings();
            var prevQuantity = 0;
            var diff = ordered - received;
            var inputEl = $targetEl.closest('input');
            var val;

            if (!inputEl.length) {
                inputEl = $parent.find('textarea');
            }
            val = parseInt(inputEl.val());

            $siblingDivs.each(function () {
                prevQuantity += parseFloat($(this).find('input').val());
            });

            diff -= prevQuantity;

            if (!val) {
                val = 0;
            }

            e.preventDefault();

            if (val < diff && !$div.next().length && (lengthLocations !== ($siblingDivs.length + 1))) {
                $parent.find('td[data-name="newShip"]').append('<div class="receiveLocation">' +
                    '<div><input id="newShip" class="quantity" maxlength="9" value="' + (diff - val) + '"> into</div>' +
                    '<div> <a class="current-selected" id="locationDd" href="javascript:;" data-id="">Select</a></div>' +
                    '<span title="Delete" class="icon-close5 removeLocation"></span></div>');
            }

            if (val > diff) {
                inputEl.val(diff);
            }

        },

        saveItem: function () {
            var self = this;
            var order = this.orderModel.id;
            var name = this.orderModel.get('name');
            var orderRows = this.orderModel.get('products');
            var orderRow;
            var warehouse = this.$el.find('#warehouseDd').attr('data-id');
            var date = helpers.setTimeToDate(this.$el.find('#date').val());
            var shippingCost = $.trim(this.$el.find('#shippingCost').val()) || 0;
            var shippingMethod = this.$el.find('#shippingMethods').attr('data-id');
            var orderRowId;
            var quantity;
            var targetEl;
            var saveObject;
            var products = [];
            var productAvailable;
            var i;
            var _model;

            var selectedProducts = self.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var locationsReceived;
            var ordered;
            var cost;
            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                orderRowId = targetEl.attr('id');
                locationsReceived = [];
                productAvailable = targetEl.find('#productsDd').attr('data-id');
                quantity = 0;
                ordered = parseFloat(targetEl.find('#ordered').val());

                orderRow = _.findWhere(orderRows, {_id: orderRowId});

                cost = orderRow ? parseFloat(orderRow.unitPrice) * 100 : 0;

                targetEl.find('.receiveLocation').each(function () {
                    var quantityLocation = parseFloat($(this).find('.quantity').val()) || 0;
                    var location = $(this).find('.locationDd').attr('data-id');
                    if (location && quantityLocation) {
                        locationsReceived.push({
                            location: location,
                            quantity: quantityLocation
                        });
                        quantity += quantityLocation;
                    }
                });

                if (locationsReceived.length) {
                    products.push({
                        orderRowId       : orderRowId,
                        locationsReceived: locationsReceived,
                        product          : productAvailable,
                        ordered          : ordered,
                        cost             : cost,
                        quantity         : quantity
                    });
                }

            }

            if (!products.length) {
                return App.render({
                    type   : 'error',
                    message: 'No products for receive'
                });
            }

            saveObject = {
                warehouse     : warehouse,
                order         : order,
                name          : name,
                date          : date,
                shippingMethod: shippingMethod,
                shippingCost  : shippingCost,
                status        : {
                    received: true
                },

                orderRows: products
            };

            _model = new GoodsModel();

            _model.save(saveObject, {
                success: function () {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                }
            });
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var $parent = $target.closest('tr');
            var $existedLocation = $parent.find('[data-id="' + id + '"]');
            var type = $target.closest('a').attr('id');

            if (type === 'locationDd' && $existedLocation.length) {
                return false;
            }

            $target.closest('.current-selected').text($target.text()).attr('data-id', id);

            this.hideNewSelect();

            return false;
        },

        render: function () {
            var orderModel = this.orderModel.toJSON();
            var formString = this.template({model: orderModel});
            var shippingMethod = orderModel.shippingMethod;
            var self = this;

            var warehouse = orderModel.warehouse ? orderModel.warehouse._id : '';

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 750,
                position   : {
                    at: "top+35%"
                },

                title  : 'Create Task',
                buttons: {
                    save: {
                        id   : 'goodsInNotesSaveBtn',
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

            populate.get('#warehouseDd', 'warehouse/getForDD', {}, 'name', this, true, false, null);
            populate.get('#shippingMethods', '/shippingMethod/getForDd', {}, 'name', this, false, false, shippingMethod);

            populate.get('.locationDd', 'warehouse/location/getForDd', {warehouse: warehouse}, 'name', this, true, false, null);
            this.delegateEvents(this.events);

            this.$el.find('#productItemsHolder').html(_.template(ProductItems, {products: orderModel.products}));

            return this;
        }

    });

    return CreateView;
});
