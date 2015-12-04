/**
 * Created by liliya on 22.10.15.
 */
define(['models/jobsModel'
], function (JobsModel) {
    var JobsCollection = Backbone.Collection.extend({

        model: JobsModel,
        url: '/jobs/',
        contentType: null,
        page: null,
        numberToShow: null,
        viewType: null,

        initialize: function (options) {
            this.startTime = new Date();
            var that = this;

            this.filter = options ? options.filter : {};

            this.fetch({
                data: options,
                reset: true,
                success: function (newCollection) {
                    that.page ++;

                    if (App.currectCollection){
                        App.currectCollection.add(newCollection.models, {remove: false});
                    }
                },
                error: function(err, xhr){
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

    return JobsCollection;
});
