define([
    'Backbone',
    'collections/parent',
    'Underscore',
    'models/PriceListsModel',
    'common',
    'constants'
], function (Backbone, Parent, _, PriceListsModel, common, CONSTANTS) {
    'use strict';

    var PriceListsCollection = Parent.extend({
        model: PriceListsModel,
        url  : CONSTANTS.URLS.PRICELIST,

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

    return PriceListsCollection;
});