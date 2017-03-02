/**
 * Created by liliy on 10.10.2016.
 */
define([
    'Underscore',
    'Backbone',
    'collections/parent',
    'models/orderModel',
    'common',
    'constants'
], function (_, Backbone, ParentCollection, OrdersModel, common, CONSTANTS) {
    'use strict';

    var QuotationFilterCollection = ParentCollection.extend({

        model: OrdersModel,
        url  : CONSTANTS.URLS.PURCHASEORDERS,

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

            this.filter = this.setFilterForSales(options.contentType, options.filter);
            options.filter = this.filter;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        setFilterForSales: function (contentType, filter) {
            var regex = /^purchase/;
            var _filter = {};

            if (contentType) {
                _filter = filter || _filter;

                if (!regex.test(contentType)) {
                    _filter.forSales = {
                        key  : 'forSales',
                        type : 'boolean',
                        value: ['true']
                    };
                } else {
                    _filter.forSales = {
                        key  : 'forSales',
                        type : 'boolean',
                        value: ['false']
                    };
                }
            }

            return _filter;
        },

        parse: function (response) {
            var quotations = response.data;

            response.data = _.map(quotations, function (quotation) {
                quotation.orderDate = common.utcDateToLocaleDate(quotation.orderDate);
                if (quotation.expectedDate) {
                    quotation.expectedDate = common.utcDateToLocaleDate(quotation.expectedDate);
                }

                return quotation;
            });

            return ParentCollection.prototype.parse.call(this, response);
        }

    });

    return QuotationFilterCollection;

});
