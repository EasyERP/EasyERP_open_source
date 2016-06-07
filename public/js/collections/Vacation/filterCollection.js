/**
 * Created by soundstorm on 29.06.15.
 */
define([
    'Backbone',
    'collections/parent',
    'models/VacationModel',
    'constants'
], function (Backbone, Parent, VacationModel, CONSTANTS) {
    'use strict';

    var VacationCollection = Parent.extend({
        model      : VacationModel,
        url        : CONSTANTS.URLS.VACATION,
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
                    }

                    return sortAttr.name;
                }

                return false;
            }

            if (nameA && nameB) {

                if (self.sortSubKey) {
                    if (nameA.last > nameB.last) {
                        return self.sortOrder;
                    }
                    if (nameA.last < nameB.last) {
                        return self.sortOrder * (-1);
                    }

                    return 0;
                }

                if (nameA > nameB) {
                    return self.sortOrder;
                }
                if (nameA < nameB) {
                    return self.sortOrder * (-1);
                }

                return 0;

            }
        },

        sortByOrder: function (key, subKey, order) {
            this.sortOrder = order;
            this.sortKey = key;
            this.sortSubKey = subKey;
            this.sort();
        },

       /* showMore: function (options) {
            var that = this;
            var filterObject = options || {};

            filterObject.month = (options && options.month) ? options.month.toString() : this.month.toString();
            filterObject.year = (options && options.year) ? options.year : this.year;
            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.trigger('showmore', models);
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Some Error.'
                    });
                }
            });
        },*/

        initialize: function (options) {
            var page;

            this.sortOrder = 1;
            this.startTime = new Date();
            this.month = (this.startTime.getMonth() + 1).toString();
            this.year = (this.startTime.getFullYear()).toString();
            this.viewType = options.viewType;
            this.contentType = options.contentType;
            /* if (options && options.viewType) {
             this.url += options.viewType;
             }*/
            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};

            if (!options.year) {
                options.year = this.year;
            }

            if (!options.month) {
                options.month = this.month;
            }


            options.error = options.error || _errHandler;
            page = options.page;

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return VacationCollection;
});
