define([
    'Backbone',
    'collections/parent',
    'models/ProductModel',
    'dataService',
    'constants'
], function (Backbone, Parent, ProductModel, dataService, CONSTANTS) {
    'use strict';

    var ProductCollection = Parent.extend({
        model   : ProductModel,
        url     : CONSTANTS.URLS.PRODUCT,
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

        initialize: function (options) {
            var regex = /^sales/;
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
            this.mid = options.contentType && options.contentType === 'Products' ? 58 : 65;

            if (options.contentType && !(options.filter)) {
                options.filter = {};
                if (regex.test(options.contentType)) {
                    options.filter = {
                        canBeSold: {
                            key  : 'canBeSold',
                            value: ['true']
                        }

                    };
                } else {
                    options.filter = {
                        canBePurchased: {
                            key  : 'canBePurchased',
                            value: ['true']
                        }
                    };
                }
            }

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        showMoreAlphabet: function (options) {
            var that = this;
            var filterObject = options || {};

            that.page = 1;
            filterObject.page = (options && options.page) ? options.page : this.page;
            filterObject.count = (options && options.count) ? options.count : this.namberToShow;
            filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
            filterObject.contentType = (options && options.contentType) ? options.contentType : this.contentType;
            filterObject.filter = options ? options.filter : {};

            this.getFirstPage(filterObject);
        },

        getAlphabet: function (callback) {
            dataService.getData(CONSTANTS.URLS.PRODUCT_ALPHABET, {mid: this.mid}, function (response) {
                if (callback) {
                    callback(response.data);
                }
            });
        }
    });

    return ProductCollection;
});