define([
    'models/jobsModel',
    'custom'
], function (JobsModel, custom) {
    var JobsCollection = Backbone.Collection.extend({

        model       : JobsModel,
        url         : '/jobs/',
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : 'list',

        initialize: function (options) {
            options = options || {};
            this.startTime = new Date();
            var self = this;

            this.filter = options ? options.filter : {};
            this.projectId = options.projectId;
            this.bySocket = options.bySocket;

            this.fetch({
                data   : options,
                reset  : true,
                success: function (newCollection) {

                    var key = 'jobs_projectId:' + self.projectId;
                    var collection = custom.retriveFromCash(key);

                    self.page++;

                    if (collection && collection.length) {

                        if (!App.projectInfo || (App.projectInfo && App.projectInfo.currentTab !== 'overview')) {
                            collection.reset(newCollection.models);
                        } else if (self.bySocket) {
                            App.render({
                                type   : 'notify',
                                message: 'Data were changed, please refresh browser'
                            });
                        }
                    } else {
                        custom.cacheToApp(key, newCollection, true);
                    }
                },
                error  : function (err, xhr) {
                    console.log(xhr);
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

            if (options && options.contentType && !(options.filter)) {
                options.filter = {};
            }

            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmore', models);
                },
                error  : function () {
                    alert('Some Error');
                }
            });
        }
    });

    return JobsCollection;
});
