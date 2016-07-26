define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Quotations/form/FormView',
    'constants'
], function (Backbone,
             $,
             _,
             BaseView,
             CONSTANTS
            ) {
    'use strict';

    var FormView = BaseView.extend({
        contentType: CONSTANTS.SALESQUOTATIONS,

        initialize: function (options) {
            var modelObj;

            this.forSales = true;
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/quotations';
            this.responseObj = {};
            modelObj = this.currentModel.toJSON();
            this.salesManager = modelObj.project && modelObj.project.salesmanager;
            this.customerId = options.customerId;
            this.pId = options.pId;
            this.redirect = options.redirect;
            this.collection = options.collection;
            this.hidePrAndCust = options.hidePrAndCust || false;
            this.eventChannel = options.eventChannel;

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');
        }
    });

    return FormView;
});
