/**
 * Created by liliya on 22.10.15.
 */
define(['models/JobsModel'
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
                    that.page ++;
                },
                error: function(err, xhr){
                    console.log(xhr);
                }
            });
        }
    });

    return JobsCollection;
});
