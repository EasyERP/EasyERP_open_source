define([
        'models/QuotationModel',
        'common'
    ],
    function (QuotationModel, common) {
        var QuotationCollection = Backbone.Collection.extend({
            model: QuotationModel,
            url: "/quotation/",
            page: null,
            namberToShow: null,
            viewType: null,
            contentType: null,

            initialize: function (options) {
                this.startTime = new Date();
                var that = this;
                this.namberToShow = options.count;
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.count = options.count;
                this.page = options.page || 1;
                if (options && options.viewType) {
                    this.url += options.viewType;
                }
                this.fetch({
                    data: options,
                    reset: true,
                    success: function () {
                        that.page++;
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', {trigger: true});
                    }
                });
            },

            parse: function (quotations) {
                _.map(quotations, function (quotation) {
                    quotation.orderDate = common.utcDateToLocaleDate(quotation.orderDate);
                    if(quotation.expectedDate){
                        quotation.expectedDate = common.utcDateToLocaleDate(quotation.expectedDate);
                    }

                    return quotation;
                });

                return quotations;
            }
        });
        return QuotationCollection;
    });