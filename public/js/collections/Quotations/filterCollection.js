define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/QuotationModel',
    'common',
    'constants'
], function (Backbone, _, Parent, QuotationModel, common, CONSTANTS) {
    'use strict';

    var QuotationCollection = Parent.extend({
        model   : QuotationModel,
        url     : CONSTANTS.URLS.QUOTATIONS,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var regex = /^sales/;
            var page;

            this.startTime = new Date();
            this.contentType = options.contentType;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            if (options && options.contentType) {

                options.filter = options.filter || {};

                if (regex.test(this.contentType)) {
                    options.filter.forSales = {
                        key  : 'forSales',
                        type: 'boolean',
                        value: ['true']
                    };
                } else {
                    options.filter.forSales = {
                        key  : 'forSales',
                        type: 'boolean',
                        value: ['false']
                    };
                }
            }

            this.filter = options.filter;

            if (options && options.url) {
                this.url = options.url;
                delete options.url;
            }

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        parse: function (response) {
            var quotations = response.data;

            _.map(quotations, function (quotation) {
                quotation.orderDate = common.utcDateToLocaleDate(quotation.orderDate);
                if (quotation.expectedDate) {
                    quotation.expectedDate = common.utcDateToLocaleDate(quotation.expectedDate);
                }

                return quotation;
            });

            return Parent.prototype.parse.call(this, response);

        }
    });
    return QuotationCollection;
});
