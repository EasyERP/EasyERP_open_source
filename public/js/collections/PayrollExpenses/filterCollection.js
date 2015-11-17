define([
        'models/PayRollModel',
        'common'
    ],
    function (PayRollModel, common) {
        var PayRollCollection = Backbone.Collection.extend({
            model       : PayRollModel,
            url         : "/payroll/",

            showMore: function (options) {
                var that = this;

                //filterObject['page'] = (options && options.page) ? options.page : this.page;
                //filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;

                this.fetch({
                    data   : options,
                    waite  : true,
                    success: function (models) {
                        that.trigger('showmore', models);
                    },
                    error  : function () {
                        App.render({
                            type: 'error',
                            message: 'Some error during fetching data'
                        });
                    }
                });
            },

            initialize: function (options) {
                var filterObject;

                this.startTime = new Date();
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                //filterObject = App.filtersValues[this.contentType];
                //
                //this.dataKey = _.max(filterObject.dataKey, function (dataKey) {
                //    return dataKey._id;
                //})
                //
                //this.dataKey.status = true;
                //
                //this.filter = {
                //    'dataKey': {
                //        key  : 'dataKey',
                //        value: [this.dataKey._id]
                //    }
                //};
                //
                //if (!options.filter) {
                //    options.filter = this.filter;
                //}

                if (options && options.viewType) {
                    this.url += options.viewType;
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