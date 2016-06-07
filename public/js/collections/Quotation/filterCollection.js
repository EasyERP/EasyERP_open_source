define([
        'Backbone',
        'Underscore',
        'collections/parent',
        'models/QuotationModel',
        'common',
        'constants'
    ],
    function (Backbone, _, Parent, QuotationModel, common, CONSTANTS) {
        'use strict';

        var QuotationCollection = Parent.extend({
            model       : QuotationModel,
            url         : CONSTANTS.URLS.QUOTATION,
            pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,
            //page        : null,
            //namberToShow: null,
            //viewType    : null,
            //contentType : null,

            initialize: function (options) {
                var that = this;
                var regex = /^sales/;
                var page;

                this.startTime = new Date();

                //this.namberToShow = options.count;
                //this.viewType = options.viewType;
                this.contentType = options.contentType;
                //this.count = options.count;
                //this.page = options.page || 1;

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
                            value: ['true']
                        };
                    } else {
                        options.filter.forSales = {
                            key  : 'forSales',
                            value: ['false']
                        };
                    }
                }

                this.filter = options.filter;

                if (options && options.url) {
                    this.url = options.url;
                    delete options.url;
                }/* else if (options && options.viewType) {
                    this.url += options.viewType;
                }*/

                if (page) {
                    return this.getPage(page, options);
                }

                this.getFirstPage(options);

                /*this.fetch({
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
                });*/
            },

            /*showMore: function (options) {
                var that = this;
                var regex = /^sales/;
                var filterObject = options || {};

                filterObject.page = (options && options.page) ? options.page : this.page;
                filterObject.count = (options && options.count) ? options.count : this.namberToShow;
                filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
                filterObject.contentType = (options && options.contentType) ? options.contentType : this.contentType;
                filterObject.filter = options ? options.filter : {};

                if (options && options.contentType) {

                    options.filter = options.filter || {};

                    if (regex.test(this.contentType)) {
                        options.filter.forSales = {
                            key  : 'forSales',
                            value: ['true']
                        };
                    } else {
                        options.filter.forSales = {
                            key  : 'forSales',
                            value: ['false']
                        };
                    }
                }

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
            },*/

            parse: function (response) {
                var quotations = response.data;

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