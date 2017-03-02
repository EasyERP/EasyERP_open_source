define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/stockInventory/receiveTemplate.html',
    'models/stockInventoryModel',
    'common',
    'populate',
    'constants',
    'helpers/keyValidator',
    'dataService'
], function (Backbone, $, _, ParentView, CreateTemplate, ProductItems, common, populate, CONSTANTS, keyValidator) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        template   : _.template(CreateTemplate),
        responseObj: {},

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');
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
            var $div = $targetEl.closest('.receiveLocation');
            var lengthLocations = this.responseObj['#locationDd'] ? this.responseObj['#locationDd'].length : 0;
            var prevDivs = $div.prevAll();
            var nextDivs = $div.nextAll();
            var prevQuantity = 0;
            var inputEl = $targetEl.closest('input');
            var val;

            if (!inputEl.length) {
                inputEl = $parent.find('textarea');
            }
            val = parseInt(inputEl.val());

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
            var quantity = 0;
            var $thisEl = this.$el;
            var saveObject;
            var locationsReceived;
            var onHand = parseFloat($thisEl.find('#ordered').val());

            locationsReceived = [];

            $thisEl.find('.receiveLocation').each(function () {
                var quantityLocation = parseFloat($(this).find('.quantity').val()) || 0;
                var location = $(this).find('#locationDd').attr('data-id');
                if (location && quantityLocation) {
                    locationsReceived.push({
                        location: location,
                        quantity: quantityLocation
                    });
                    quantity += quantityLocation;
                }
            });

            if (!locationsReceived.length) {
                return App.render({
                    type   : 'error',
                    message: 'No locations for transfer'
                });
            }

            saveObject = {
                onHand        : onHand - quantity,
                availabilities: locationsReceived
            };

            this.model.save(saveObject, {
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
            var location = this.model.get('location');
            var $parent = $target.closest('tr');
            var $existedLocation = $parent.find('[data-id="' + id + '"]');
            var type = $target.closest('a').attr('id');

            location = location ? location._id : '';

            if (type === 'locationDd' && ($existedLocation.length || location === id)) {
                return false;
            }

            $target.closest('.current-selected').text($target.text()).attr('data-id', id);

            this.hideNewSelect();

            return false;
        },

        render: function () {
            var orderModel = this.model.toJSON();
            var formString = this.template({elem: orderModel});
            var self = this;

            var warehouse = orderModel.warehouse ? orderModel.warehouse._id : '';

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 1050,
                position   : {
                    at: "top+35%"
                },
                title      : 'Create Task',
                buttons    : {
                    save: {
                        text : 'Transfer',
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

            return this;
        }

    });

    return CreateView;
});
