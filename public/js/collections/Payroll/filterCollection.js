define([
        'models/PayRollModel',
        'common'
    ],
    function (PayRollModel, common) {
        var PayRollCollection = Backbone.Collection.extend({
            model       : PayRollModel,
            url         : "/payroll/",
            page        : null,
            namberToShow: null,
            viewType    : null,
            contentType : null,

            showMore: function (options) {
                var that = this;
                var filterObject = {};
                var month = options.month;
                var year = options.year;
                var dataKey;

                if (month && year) {
                    dataKey = year * 100 + month;

                    filterObject.filter = {
                        'dataKey': {
                            key: 'dataKey',
                            value: [dataKey]
                        }
                    };
                }

                //filterObject['page'] = (options && options.page) ? options.page : this.page;
                //filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;

                this.fetch({
                    data   : filterObject,
                    waite  : true,
                    success: function (models) {
                        that.trigger('showmore', models);
                    },
                    error  : function () {
                        alert('Some Error');
                    }
                });
            },

            initialize: function (options) {
                this.sortOrder = 1;
                this.startTime = new Date();
                this.month = (this.startTime.getMonth() + 1).toString();
                this.year = 2014;//(this.startTime.getFullYear()).toString();
                this.viewType = options.viewType;
                this.contentType = options.contentType;

                if (options && options.viewType) {
                    this.url += options.viewType;
                }

                if (options && options.year) {
                    options.year = options.year
                } else {
                    options.year = this.year;
                }

                if (options && options.month) {
                    options.month = options.month
                } else {
                    options.month = this.month;
                }

                this.fetch({
                    data   : options,
                    reset  : true,
                    success: function () {
                    },
                    error  : function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', {trigger: true});
                    }
                });
            }
        });
        return PayRollCollection;
    });