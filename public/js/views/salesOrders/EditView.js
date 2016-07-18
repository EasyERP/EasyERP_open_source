define([
    'Underscore',
    'views/Orders/EditView'
], function (_, ParentEditView) {
    'use strict';

    var EditView = ParentEditView.extend({
        forSales   : true,
        contentType: 'salesOrders',

        initialize: function (options) {
            this.forSales = true;
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/orders';
            this.responseObj = {};
            this.visible = options.visible;
            this.editable = options.editable || true;
            this.balanceVissible = false;
            this.service = true;
            this.editablePrice = this.currentModel.get('workflow').status === 'New' || false;
            this.onlyView = !!options.onlyView;

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            this.render();
        }
    });

    return EditView;
});