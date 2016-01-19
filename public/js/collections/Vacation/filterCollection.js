/**
 * Created by soundstorm on 29.06.15.
 */
define([
    'models/VacationModel'
], function (VacationModel) {
    var VacationCollection = Backbone.Collection.extend({
        model      : VacationModel,
        url        : "/vacation/",
        viewType   : null,
        contentType: null,

        comparator: function (modelA, modelB) {
            var self = this;
            var nameA = getSortName(modelA);
            var nameB = getSortName(modelB);

            function getSortName(model) {
                var sortAttr = self.sortKey ? model.get(self.sortKey) : model.get('employee');

                if (sortAttr) {
                    if (self.sortSubKey) {
                        return sortAttr[self.sortSubKey];
                    } else {
                        return sortAttr['name'];
                    }
                }

                return false;
            }

            if (nameA && nameB) {
                if (nameA > nameB) {
                    return self.sortOrder;
                } else if (nameA < nameB) {
                    return self.sortOrder * (-1);
                } else {
                    return 0;
                }
            }
        },

        sortByOrder: function (key, subKey, order) {
            this.sortOrder = order;
            this.sortKey = key;
            this.sortSubKey = subKey;
            this.sort();
        },

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};
            filterObject['month'] = (options && options.month) ? options.month.toString() : this.month.toString();
            filterObject['year'] = (options && options.year) ? options.year : this.year;
            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.trigger('showmore', models);
                },
                error  : function () {
                    App.render({
                        type: 'error',
                        message: "Some Error."
                    });
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
                data   : options,
                reset  : true,
                success: function () {
                },
                error  : function (models, xhr) {
                    if (xhr.status == 401) {
                        Backbone.history.navigate('#login', {trigger: true});
                    }
                }
            });
        }
    });
    return VacationCollection;
});