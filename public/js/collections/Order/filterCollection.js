define([
    'Underscore',
    'Backbone',
    'collections/parent',
    'models/QuotationModel',
    'common',
    'constants'
], function (_, Backbone, ParentCollection, QuotationModel, common, CONSTANTS) {
    'use strict';

    var QuotationFilterCollection = ParentCollection.extend({

        model: QuotationModel,
        url  : CONSTANTS.URLS.QUOTATION,

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};

            filterObject.page = (options && options.page) ? options.page : this.page;
            filterObject.count = (options && options.count) ? options.count : this.namberToShow;
            filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
            filterObject.contentType = (options && options.contentType) ? options.contentType : this.contentType;
            filterObject.filter = (options) ? options.filter : {};

            filterObject.filter = this.setFilterForSales(filterObject.contentType, filterObject.filter);

            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmore', models);
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Some Error.'
                    });
                }
            });
        },

        setFilterForSales: function (contentType, filter) {
            var regex = /^sales/;
            var _filter = {};

            if (contentType) {
                _filter = filter || _filter;

                if (regex.test(contentType)) {
                    _filter.forSales = {
                        key  : 'forSales',
                        value: ['true']
                    };
                } else {
                    _filter.forSales = {
                        key  : 'forSales',
                        value: ['false']
                    };
                }
            }

            return _filter;
        },

        initialize: function (options) {
            var that = this;

            this.startTime = new Date();
            this.namberToShow = options.count;
            this.viewType = options.viewType;
            this.contentType = options.contentType;
            this.count = options.count;
            this.page = options.page || 1;
            this.filter = options.filter;

            options.filter = this.setFilterForSales(options.contentType, options.filter);

            /*
                if (options && options.viewType) {
                    this.url += options.viewType;
                }
            */

            this.filter = options.filter;

            this.fetch({
                data   : options,
                reset  : true,
                success: function () {
                    that.page++;
                },

                error: function (models, xhr) {
                    if (xhr.status === 401) {
                        Backbone.history.navigate('#login', {trigger: true});
                    }
                }
            });
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
