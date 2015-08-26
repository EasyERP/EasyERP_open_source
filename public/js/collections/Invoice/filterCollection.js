define([
        'models/InvoiceModel'
    ],
    function (InvoiceModel) {
        var InvoiceCollection = Backbone.Collection.extend({
            model: InvoiceModel,
            url: "/Invoice/",
            page: null,
            namberToShow: null,
            viewType: null,
            contentType: null,
            initialize: function (options) {
                this.startTime = new Date();
                var regex = /^sales/;

                var that = this;
                this.namberToShow = options.count;
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.page = options.page || 1;

                this.filter = options.filter;

                if (options && options.contentType && !(options.filter))
                {
                    options.filter = {};
                    if (regex.test(this.contentType)) {
                        options.filter.forSales = true;
                    }
                }



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
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                    }
                });
            },

            showMore: function (options) {
                var that = this;
                var regex = /^sales/;
                var filterObject = options || {};

                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType : this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;
                filterObject['filter'] = (options) ? options.filter : {};

                if (options && options.contentType && !(options.filter))
                {
                    options.filter = {};
                    if (regex.test(this.contentType)) {
                        filterObject.filter.forSales = true;
                    }
                }

                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error: function () {
                        alert('Some Error');
                    }
                });
            }
        });
        return InvoiceCollection;
    });