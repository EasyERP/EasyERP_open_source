define([
        'models/invoiceAging',
        'common'
    ],
    function (InvoiceAging, common) {
        var Collection = Backbone.Collection.extend({
            model: InvoiceAging,
            url: "/invoice/stats/",
            page: null,
            namberToShow: null,
            viewType: null,
            contentType: null,

            initialize: function (options) {
                var that = this;

                this.startTime = new Date();
                this.namberToShow = options.count;
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.count = options.count;
                this.page = options.page || 1;

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

            showMore: function (options) {
                var that = this;
                var filterObject = options || {};

                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType : this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;

                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error: function (model, xhr) {
                        App.render({
                            type: 'error',
                            message: xhr ? xhr.text : 'Some error'
                        });
                    }
                });
            }
        });
        return Collection;
    });