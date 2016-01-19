define([
        'models/ApplicationsModel'
    ],
    function (ApplicationModel) {
        var TasksCollection = Backbone.Collection.extend({
            model       : ApplicationModel,
            url         : "/Applications/",
            page        : null,
            namberToShow: null,
            contentType : null,
            viewType    : null,

            initialize: function (options) {
                var that = this;
                this.startTime = new Date();
                this.contentType = options.contentType;
                this.viewType = options.viewType;
                this.wfStatus = options.status || [];

                if (options && options.viewType) {
                    this.url += options.viewType;
                }
                if (options && options.count) {
                    this.namberToShow = options.count;
                    this.count = options.count;
                    this.page = options.page || 1;
                }
                this.fetch({
                    data   : options,
                    reset  : true,
                    success: function () {
                        that.page++;

                    },
                    error  : function (models, xhr) {
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
                filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType : this.viewType;
                this.fetch({
                    data   : filterObject,
                    waite  : true,
                    success: function (models) {
                        that.page++;
                        that.trigger('showmore', models);
                    },
                    error  : function () {
                        App.render({
                            type: 'error',
                            message: "Some Error."
                        });
                    }
                });

            },

            parse: function (response) {
                return response.data;
            }
        });

        return TasksCollection;
    });
