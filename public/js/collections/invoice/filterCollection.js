define([
    'Backbone',
    'collections/parent',
    'models/InvoicesModel',
    'constants'
], function (Backbone, Parent, InvoiceModel, CONSTANTS) {
    'use strict';

    var InvoiceCollection = Parent.extend({
        model   : InvoiceModel,
        url     : CONSTANTS.URLS.INVOICE,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

            this.viewType = options.viewType;
            this.contentType = options.contentType;

            this.filter = options.filter;

            options.forSales = true;
            this.forSales = options.forSales;

            if (options && options.contentType && options.contentType === 'invoice' && !(options.filter)) {
                options.filter = {};

                options.filter = {
                    forSales: {
                        key  : 'forSales',
                        type : 'boolean',
                        value: ['true']
                    }
                };
            }

            if (options && options.url) {
                this.url = options.url;
                delete options.url;
            }

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return InvoiceCollection;
});
