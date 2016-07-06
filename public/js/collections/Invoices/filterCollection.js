define([
    'Backbone',
    'collections/parent',
    'models/InvoiceModel',
    'constants'
], function (Backbone, Parent, InvoiceModel, CONSTANTS) {
    'use strict';

    var InvoiceCollection = Parent.extend({
        model   : InvoiceModel,
        url     : CONSTANTS.URLS.INVOICES,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var regex = /^sales/;
            var page;

            this.viewType = options.viewType;
            this.contentType = options.contentType;

            this.filter = options.filter;

            if (regex.test(this.contentType)) {
                options.forSales = true;
            }

            if (options && options.contentType && !(options.filter)) {
                options.filter = {};
                if (regex.test(this.contentType)) {
                    options.filter = {
                        forSales: {
                            key  : 'forSales',
                            type : 'boolean',
                            value: ['true']
                        }
                    };
                } else {
                    options.filter = {
                        forSales: {
                            key  : 'forSales',
                            type : 'boolean',
                            value: ['false']
                        }
                    };
                }
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
