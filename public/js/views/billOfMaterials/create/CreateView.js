define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/billOfMaterials/CreateTemplate.html',
    '../../dialogViewBase',
    'views/billOfMaterials/create/ComponentItemView',
    'models/billOfMaterials',
    'populate',
    'dataService',
    'helpers/keyValidator'
], function (Backbone,
             $,
             _,
             CreateTemplate,
             ParentView,
             ComponentItemView,
             BillOfMaterialsModel,
             populate,
             dataService, keyValidator) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'billOfMaterials',
        formUrl    : '#easyErp/billOfMaterials',
        viewType   : 'list',
        template   : _.template(CreateTemplate),

        events: {
            'keypress .forNum': 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, false);
        },

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new BillOfMaterialsModel();
            this.responseObj = {};
            this.products = [];

            this.render();
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.closest('a').attr('id');
            var $targetId = $target.attr('id');
            var dataId = $target.closest('a').attr('data-id');

            if (id === 'product') {

                if (this.products.indexOf($targetId) > -1) {
                    return App.render({
                        type   : 'error',
                        message: 'Please choose another product'
                    });
                }
                this.products.push($targetId);
                if (this.products.indexOf(dataId) > -1) {
                    this.products.splice(this.products.indexOf(dataId), 1);
                }
            }

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $targetId);

            this.hideNewSelect();

            return false;
        },

        hideNewSelect: function () {
            if (this.selectView) {
                this.selectView.remove();
            }
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var selectedComponents = thisEl.find('.componentItem');
            var components = [];
            var data;
            var selectedLength = selectedComponents.length;
            var targetEl;
            var componentId;
            var quantityComponent;
            var info;
            var i;

            var productId = thisEl.find('#product').attr('data-id');
            var routingId = thisEl.find('#routing').attr('data-id');
            var description = $.trim(thisEl.find('#description').val());
            var isComponent = thisEl.find('.bomType:checked').attr('data-type');
            var quantity = $.trim(thisEl.find('#quantity').val());

            if (!productId) {
                return App.render({
                    type   : 'error',
                    message: "Product can't be empty."
                });
            }

            if (!quantity) {
                return App.render({
                    type   : 'error',
                    message: "Quantity can't be empty."
                });
            }

            if (isNaN(+quantity)) {
                return App.render({
                    type   : 'error',
                    message: 'Quantity must be only number.'
                });
            }

            if (quantity < 1) {
                return App.render({
                    type   : 'error',
                    message: 'Quantity must be positive number.'
                });
            }

            if (!selectedLength) {
                return App.render({
                    type   : 'error',
                    message: "Components can't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedComponents[i]);
                componentId = targetEl.find('.componentsDd').attr('data-id') || null;

                if (!componentId) {
                    return App.render({
                        type   : 'error',
                        message: "Components can't be empty."
                    });
                }

                quantityComponent = targetEl.find('[data-name="quantity"] input').val();
                info = targetEl.find('[data-name="info"]').val();

                if (!quantityComponent) {
                    return App.render({
                        type   : 'error',
                        message: 'Quantity can\'t be empty'
                    });
                }

                if (isNaN(+quantityComponent)) {
                    return App.render({
                        type   : 'error',
                        message: 'Quantity must be only number.'
                    });
                }

                if (quantityComponent < 1) {
                    return App.render({
                        type   : 'error',
                        message: 'Quantity must be positive number.'
                    });
                }

                components.push(
                    {
                        component: _.escape(componentId),
                        quantity : _.escape(parseInt(quantityComponent, 10)),
                        info     : _.escape($.trim(info))
                    });
            }

            data = {
                product    : _.escape(productId),
                routing    : _.escape(routingId),
                isComponent: _.escape(isComponent),
                quantity   : _.escape(parseInt(quantity, 10)),
                description: _.escape(description),
                components : components
            };

            this.model.save(data, {
                success: function (model) {
                    self.redirectAfterSave(self, model);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        redirectAfterSave: function () {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        createComponentView: function () {
            var productItemContainer = this.$el.find('#productItemsHolder');

            productItemContainer.append(
                new ComponentItemView({
                    responseObj: this.responseObj,
                    products   : this.products,
                    context    : this
                }).render().el
            );

            this.dialogCentering(this.$el);
        },

        render: function () {
            var formString = this.template();
            var self = this;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Bill of Materials',
                width      : '940px',
                buttons    : [{
                    id   : 'create-billOfMaterials-dialog',
                    text : 'Create',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                        self.gaTrackingConfirmEvents();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            this.renderAssignees(this.model);

            populate.get('#product', 'products/getProductsNames', {}, 'name', this, true, false, null);
            populate.get('#routing', 'routing/getNames', {}, 'name', this, true, true, null);

            this.createComponentView();

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
