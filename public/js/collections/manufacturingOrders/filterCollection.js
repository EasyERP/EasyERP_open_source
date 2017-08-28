define([
    'Underscore',
    'Backbone',
    'collections/parent',
    'models/ManufacturingOrderModel',
    'common',
    'constants'
], function (_, Backbone, ParentCollection, Model, common, CONSTANTS) {
    'use strict';

    var Collection = ParentCollection.extend({

        model: Model,
        url  : CONSTANTS.URLS.MANUFACTURING_ORDERS,

        initialize: function (options) {
            var page;

            function _errorHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            page = options.page;
            options.error = options.error || _errorHandler;
            this.contentType = options.contentType;
            // this.filter = this.setFilterForSales(options.contentType, options.filter);

            options.filter = this.filter;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });

    return Collection;

});
