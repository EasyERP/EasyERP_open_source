define([
    'Underscore',
    'views/Quotations/EditView'
], function (_, ParentEditView) {
    'use strict';

    var EditView = ParentEditView.extend({
        forSales   : true,
        contentType: 'salesQuotations',

        initialize: function (options) {
            this.forSales = true;
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/quotations';
            this.responseObj = {};
            this.salesManager = this.currentModel.toJSON().project.salesmanager;
            this.customerId = options.customerId;
            this.pId = options.pId;
            this.redirect = options.redirect;
            this.collection = options.collection;
            this.hidePrAndCust = options.hidePrAndCust || false;
            this.eventChannel = options.eventChannel;

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            this.render();
        }
    });

    return EditView;
});
