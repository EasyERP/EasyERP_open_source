define([
    'Backbone',
    'collections/parent',
    'Underscore',
    'models/ProductTypeModel',
    'common',
    'constants'
], function (Backbone, Parent, _, ProductTypeModel, common, CONSTANTS) {
    'use strict';

    var ProguctTypeCollection = Parent.extend({
        model: ProductTypeModel,
        url  : CONSTANTS.URLS.PRODUCT_TYPES,

        initialize: function (options) {
            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;

            options.reset = true;

            this.startTime = new Date();

            this.getFirstPage(options);
        }
    });

    return ProguctTypeCollection;
});
