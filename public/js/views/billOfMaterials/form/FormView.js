define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/billOfMaterials/form/FormTemplate.html',
    'text!templates/billOfMaterials/components/ComponentInputContent.html',
    'dataService',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, _, $,
             ParentView,
             FormTemplate,
             componentInputContent,
             dataService,
             populate,
             CONSTANTS, keyValidator) {

    var FormBillOfMaterialsView = ParentView.extend({
        el          : '#content-holder',
        formTemplate: _.template(FormTemplate),

        events: {
            'click .removeJob'       : 'deleteRow',
            'click .addProductItem a': 'getComponents',
            'click #saveBtn'         : 'saveItem',
            'keypress .forNum'       : 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, false);
        },

        initialize: function (options) {
            var model;
            var self = this;
            this.responseObj = {};

            this.formModel = options.model;
            this.products = [];

            model = this.formModel.toJSON();
            this.products.push(model.data.productId);

            model.data.components.forEach(function (el) {
                self.products.push(el.componentId);
            });
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.closest('a').attr('id');
            var $targetId = $target.attr('id');
            var dataId = $target.closest('a').attr('data-id');

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

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $targetId);

            this.hideNewSelect();

            return false;
        },

        getComponents: function (e) {
            var target;
            var $parrent;

            if (!this.products.length) {
                return App.render({
                    type   : 'error',
                    message: 'Please choose product at first'
                });
            }

            target = $(e.target);
            $parrent = target.closest('#ComponentList');

            e.preventDefault();
            e.stopPropagation();

            $parrent.prepend(_.template(componentInputContent));

            // this.removeEditableCass($parrent.find('tr').last());

            $('.newSelectList').remove();

            return false;
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var selectedComponents = thisEl.find('.componentItem');
            var components = [];
            var selectedLength = selectedComponents.length;
            var targetEl;
            var componentId;
            var quantityComponent;
            var info;
            var data;

            var productId = thisEl.find('#product').attr('data-id');
            var routingId = thisEl.find('#routing').attr('data-id');
            var description = $.trim(thisEl.find('#description').val());
            var isComponent = thisEl.find('.bomType:checked').attr('data-type');
            var quantity = thisEl.find('#quantity').val();

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
                    message: "Quantity must be only number."
                });
            }

            if (quantity < 1) {
                return App.render({
                    type   : 'error',
                    message: "Quantity must be positive number."
                });
            }

            if (!selectedLength) {
                return App.render({
                    type   : 'error',
                    message: "Components can't be empty."
                });
            }

            for (var i = selectedLength - 1; i >= 0; i--) {
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
                        message: "Quantity must be only number."
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
                        quantity : _.escape(parseFloat(quantityComponent)),
                        info     : _.escape($.trim(info))
                    });
            }

            this.model.set({
                product    : _.escape(productId),
                routing    : _.escape(routingId),
                isComponent: _.escape(isComponent),
                quantity   : _.escape(parseFloat(quantity)),
                description: _.escape(description),
                components : components
            });

            data = this.model.changed;

            if (!Object.keys(data).length) {
                return App.render({
                    type   : 'error',
                    message: "Please change something before save"
                });
            } else {
                this.model.save(data, {
                    patch  : true,
                    success: function (model) {
                        self.redirectAfterSave(self, model);
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        redirectAfterSave: function (content) {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        hideNewSelect: function () {
            if (this.selectView) {
                this.selectView.remove();
            }
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var trNext = tr.next();
            var jobId = tr.attr('data-id');
            var exJob = _.findWhere(this.responseObj['#jobs'], {_id: jobId});

            e.stopPropagation();
            e.preventDefault();

            if (this.responseObj['#jobs']) {
                this.responseObj['#jobs'].splice(_.indexOf(this.responseObj['#jobs'], exJob), 1);
            }

            tr.remove();
            trNext.remove();
        },

        render: function (element) {
            var formModel = this.formModel.toJSON();
            var $thisEl = this.$el;
            var self = this;

            $thisEl.html(this.formTemplate({model: formModel.data}));

            populate.get('#product', 'products/getProductsNames', {}, 'name', this, true, false, null);
            populate.get('#routing', 'routing/getNames', {}, 'name', this, true, false, null);

            return self;
        }

    });
    return FormBillOfMaterialsView;
});
