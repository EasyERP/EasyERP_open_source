define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/stockTransactions/receiveTemplate.html',
    'text!templates/stockTransactions/receiveItems.html',
    'models/goodsInNotesModel',
    'common',
    'populate',
    'constants',
    'helpers/keyValidator',
    'dataService'
], function (Backbone, $, _, ParentView, CreateTemplate, ProductItems, GoodsModel, common, populate, CONSTANTS, keyValidator) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        template   : _.template(CreateTemplate),
        responseObj: {},

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');
            this.parentModel = options.parentModel;
            this.render();
            this.responseObj = {};
            this.changedQuantity = _.debounce(this.changedQuantity, 250);
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
            var diff = parseFloat($parent.find('#ordered').val());
            var lengthLocations = this.responseObj['#locationDd'] ? this.responseObj['#locationDd'].length : 0;

            var $div = $targetEl.closest('.receiveLocation');
            var prevDivs = $div.prevAll();
            var nextDivs = $div.nextAll();
            var prevQuantity = 0;
            var inputEl = $targetEl.closest('input');
            var val;

            if (!inputEl.length) {
                inputEl = $parent.find('textarea');
            }
            val = parseInt(inputEl.val(), 10);

            prevDivs.each(function () {
                prevQuantity += parseFloat($(this).find('input').val());
            });
            nextDivs.each(function () {
                prevQuantity += parseFloat($(this).find('input').val());
            });

            diff -= prevQuantity;

            if (!val) {
                val = 0;
            }

            e.preventDefault();

            if (val < diff && !$div.next().length && (lengthLocations !== (prevDivs.length + 1))) {
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
            var orderRows = this.parentModel.get('orderRows');
            var orderRow;
            var orderRowId;
            var targetEl;
            var saveObject;
            var products = [];
            var i;
            var allReceived = 0;

            var selectedProducts = self.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var locationsReceived;
            var ordered;

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                orderRowId = targetEl.attr('id');
                locationsReceived = [];
                ordered = parseFloat(targetEl.find('#ordered').val());

                orderRow = _.findWhere(orderRows, {_id: orderRowId});

                orderRow.locationsDeliver = orderRow.locationsDeliver ? orderRow.locationsDeliver.map(function (elem) {
                    return elem._id;
                }) : [];

                targetEl.find('.receiveLocation').each(function () {
                    var quantityLocation = parseFloat($(this).find('.quantity').val()) || 0;
                    var location = $(this).find('#locationDd').attr('data-id');

                    if (location && quantityLocation) {
                        locationsReceived.push({
                            location: location,
                            quantity: quantityLocation
                        });
                        allReceived += quantityLocation;
                    }
                });

                if (locationsReceived.length && (allReceived === ordered)) {
                    orderRow.locationsReceived = locationsReceived;
                    orderRow.product = orderRow.product ? orderRow.product._id : null;
                    products.push(orderRow);
                } else {
                    return App.render({
                        type   : 'error',
                        message: 'Please, choose locations to receive'
                    });
                }

            }

            if (!products.length) {
                return App.render({
                    type   : 'error',
                    message: 'Not all products received'
                });
            }

            saveObject = {
                'status.received': true,
                orderRows        : products
            };

            this.parentModel.save(saveObject, {
                patch  : true,
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
            var parentModel = this.parentModel.toJSON();
            var formString = this.template({model: parentModel});
            var self = this;

            var warehouse = parentModel.warehouseTo ? parentModel.warehouseTo._id : '';

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 1050,
                position   : {
                    at: "top+35%"
                },
                title      : 'Create Task',
                buttons    : {
                    save: {
                        text : 'Receive',
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

            populate.get('#locationDd', 'warehouse/location/getForDd', {warehouse: warehouse}, 'name', this);

            this.delegateEvents(this.events);

            this.$el.find('#productItemsHolder').html(_.template(ProductItems, {products: parentModel.orderRows}));
            return this;
        }

    });

    return CreateView;
});
