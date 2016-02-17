define([
        'Backbone',
        'Underscore',
        'models/QuotationModel',
        'common',
        'constants'
    ],
    function (Backbone, _, QuotationModel, common, CONSTANTS) {
        'use strict';

        var QuotationCollection = Backbone.Collection.extend({
            model       : QuotationModel,
            url         : CONSTANTS.URLS.QUOTATION,
            page        : null,
            namberToShow: null,
            viewType    : null,
            contentType : null,

            showMore: function (options) {
                var that = this;
                var filterObject = options || {};
                filterObject.page = (options && options.page) ? options.page : this.page;
                filterObject.count = (options && options.count) ? options.count : this.namberToShow;
                filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
                filterObject.contentType = (options && options.contentType) ? options.contentType : this.contentType;
                this.fetch({
                    data   : filterObject,
                    waite  : true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: "Some Error."
                        });
                    }
                });
            },

            initialize: function (options) {
                this.startTime = new Date();

                var that = this;
                var regex = /^sales/;

                this.namberToShow = options.count;
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.count = options.count;
                this.page = options.page || 1;

                if (regex.test(this.contentType) && !(options.filter)) {
                    options.filter = {};

                    options.filter = {
                        'forSales': {
                            key  : 'forSales',
                            value: ['true']
                        }
                    };
                } else {
                    options.filter = {};

                    options.filter = {
                        'forSales': {
                            key  : 'forSales',
                            value: ['false']
                        }
                    };
                }

                this.filter = options.filter;

                if (options && options.viewType) {
                    this.url += options.viewType;
                }

                this.filter = options.filter;

                this.fetch({
                    data   : options,
                    reset  : true,
                    success: function () {
                        that.page++;
                    },
                    error  : function (models, xhr) {
                        if (xhr.status === 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            },

            parse: function (quotations) {
                _.map(quotations, function (quotation) {
                    quotation.orderDate = common.utcDateToLocaleDate(quotation.orderDate);
                    if (quotation.expectedDate) {
                        quotation.expectedDate = common.utcDateToLocaleDate(quotation.expectedDate);
                    }

                    return quotation;
                });

                return quotations;
            }
        });
        return QuotationCollection;
    });