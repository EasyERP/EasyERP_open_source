define([
    'Backbone',
    'collections/parent',
    'models/stockInventoryModel',
    'constants'
], function (Backbone, Parent, stockTransActionModel, CONSTANTS) {
    'use strict';

    var bonusTypeCollection = Parent.extend({
        model   : stockTransActionModel,
        url     : CONSTANTS.URLS.STOCKINVENTORY,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });

    return bonusTypeCollection;
});
