define([
    'models/Capacity'
], function (CapacityModel) {
    var CapacityCollection = Backbone.Collection.extend({
        model: CapacityModel,
        url: "/capacity/",
        viewType: null,
        contentType: null,

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};

            filterObject['month'] = (options && options.month) ? options.month.toString() : this.month.toString();
            filterObject['year'] = (options && options.year) ? options.year : this.year;

            this.fetch({
                data: filterObject,
                waite: true,
                success: function (models) {
                    that.trigger('showmore', models);
                },
                error: function () {
                    alert('Some Error');
                }
            });
        },

        initialize: function (options) {
            this.sortOrder = 1;
            this.startTime = new Date();
            this.month = (this.startTime.getMonth() + 1).toString();
            this.year = (this.startTime.getFullYear()).toString();
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
                data: options,
                reset: true,
                success: function () {
                },
                error: function (models, xhr) {
                    if (xhr.status == 401) Backbone.history.navigate('#login', {trigger: true});
                }
            });
        }
    });
    return CapacityCollection;
});