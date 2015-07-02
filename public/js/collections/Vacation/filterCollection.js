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
            filterObject['viewType'] = (options && options.viewType) ? options.viewType : this.viewType;
            filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;
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
        },

        initialize: function (options) {
            this.startTime = new Date();
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
                options.year = (this.startTime.getFullYear()).toString();
            }

            if (options && options.month) {
                options.month = options.month
            } else {
                options.month = (this.startTime.getMonth() + 1).toString();
            }

            options.month = "3";

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