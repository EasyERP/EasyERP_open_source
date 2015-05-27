define([
        'models/ProductModel',
        "dataService"
],
    function (ProductModel, dataService) {
        var ProductCollection = Backbone.Collection.extend({
            model: ProductModel,
            url: "/product/",
            page: null,
            namberToShow: null,
            viewType: null,
            contentType: null,

            initialize: function (options) {
                var that = this;
                var regex = /^sales/;

                this.startTime = new Date();

                this.namberToShow = options.count;
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.page = options.page || 1;

                if (options && options.contentType && !(options.filter))
                {
                    options.filter = {};
                    if (regex.test(this.contentType)) {
                        options.filter.canBeSold = true;
                    } else {
                        options.filter.canBePurchased = true;
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
                var filterObject = options || {};
                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType : this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;
                filterObject['filter'] = (options) ? options.filter : {};
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
            },
            showMoreAlphabet: function (options) {
                var that = this;
                var filterObject = options || {};
                that.page = 1;
                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType : this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;
                filterObject['filter'] = (options) ? options.filter : {};
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page++;
                        that.trigger('showmoreAlphabet', models);
                    },
                    error: function () {
                        alert('Some Error');
                    }
                });
            },
            getAlphabet: function (callback) {
                dataService.getData("/product/getProductsAlphabet", { mid: 58 }, function (response) {
                    if (callback) {
                        callback(response.data);
                    }
                });
            },

            parse: true,
            parse: function (response) {
                return response.success;
            }
        });
        return ProductCollection;
    });