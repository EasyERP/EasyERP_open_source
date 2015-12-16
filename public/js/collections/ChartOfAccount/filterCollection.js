/**
 * Created by lilya on 27/11/15.
 */
/**
 * Created by liliya on 22.10.15.
 */
define(['models/chartOfAccount'
], function (JobsModel) {
    var JobsCollection = Backbone.Collection.extend({

        model       : JobsModel,
        url         : '/chartOfAccount/',
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : null,

        initialize: function (options) {
            this.startTime = new Date();
            var that = this;

            this.filter = options ? options.filter : {};

            this.fetch({
                data   : options,
                reset  : true,
                success: function (newCollection) {
                    that.page++;

                    if (App.currectCollection) {
                        App.currectCollection.reset(newCollection.models);
                    }
                },
                error  : function (err, xhr) {
                    console.log(xhr);
                }
            });
        }
    });

    return JobsCollection;
});
