/**
 * Created by soundstorm on 29.06.15.
 */
define([
    'models/VacationModel'
], function (VacationModel) {
    var VacationCollection = Backbone.Collection.extend({
        model: VacationModel,
        url: "/vacation/",
        viewType: null,
        contentType: null,

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};
            filterObject['month'] = (options && options.month) ? options.month.toString() : this.monthto;
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
            this.startTime = new Date();
            this.month = (this.startTime.getMonth() + 1).toString();
            this.year = (this.startTime.getFullYear()).toString();
            var that = this;
            this.namberToShow = options.count;
            this.viewType = options.viewType;
            this.contentType = options.contentType;
            this.count = options.count;
            this.page = options.page || 1;
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
                    that.page++;
                },
                error: function (models, xhr) {
                    if (xhr.status == 401) Backbone.history.navigate('#login', {trigger: true});
                }
            });
        }
    });
    return VacationCollection;
});