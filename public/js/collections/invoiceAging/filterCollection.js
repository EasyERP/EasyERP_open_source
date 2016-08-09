define([
    'Backbone',
    'collections/parent',
    'models/invoiceAging',
    'constants'
], function (Backbone, Parent, InvoiceAging, CONSTANTS) {
    'use strict';

    var Collection = Parent.extend({
        model   : InvoiceAging,
        url     : CONSTANTS.URLS.INVOICE_STATS,
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

            if (options && options.contentType) {

                options.filter = options.filter || {};

                options.filter.forSales = {
                    key  : 'forSales',
                    type : 'boolean',
                    value: ['true']
                };
            }

            this.filter = options.filter;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return Collection;
});
