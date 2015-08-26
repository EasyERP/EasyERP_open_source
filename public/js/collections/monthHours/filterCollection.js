/**
 * Created by Liliya on 23.06.2015.
 */
define(['models/MonthHoursModel'
], function (MonthHoursModel) {
    var MonthHoursCollection = Backbone.Collection.extend({

        model: MonthHoursModel,
        url: '/monthHours/',
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
        },

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};

            filterObject['page'] = (options && options.page) ? options.page : this.page;
            filterObject['count'] = (options && options.count) ? options.count : this.numberToShow;
            filterObject['viewType'] = (options && options.viewType) ? options.viewType : this.viewType;
            filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;
            filterObject['filter'] = (options) ? options.filter : {};

            if (options && options.contentType && !(options.filter)) {
                options.filter = {};
            }

            this.fetch({
                data: filterObject,
                waite: true,
                success: function (models) {
                    that.page ++;
                    that.trigger('showmore', models);
                },
                error: function() {
                    alert('Some Error');
                }
            });
        }
    });

    return MonthHoursCollection;
});
