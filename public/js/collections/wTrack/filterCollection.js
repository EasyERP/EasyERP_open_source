define([
        'models/wTrackModel',
        'common'
    ],
    function (QuotationModel, common) {
        var wTrackCollection = Backbone.Collection.extend({
            model: QuotationModel,
            url: "/wTrack/",
            page: null,
            namberToShow: null,
            viewType: null,
            contentType: null,

            initialize: function (options) {
                this.startTime = new Date();
                var that = this;
                this.namberToShow = options.count;

                if (options && options.viewType) {
                    this.viewType = options.viewType;
                    this.url += options.viewType;
                }

                this.contentType = options.contentType;
                this.count = options.count;
                this.page = options.page || 1;
                this.filter = options.filter;

                this.fetch({
                    data: options,
                    reset: true,
                    success: function () {
                        that.page++;
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
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

                if (options && options.contentType && !(options.filter))
                {
                    options.filter = {};
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
        return wTrackCollection;
    });