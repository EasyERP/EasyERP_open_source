define([
    'Backbone',
    'models/EmployeeDashboardItem',
    'helpers/getDateHelper',
    'custom'
], function (Backbone, EmpModel, DateHelper, Custom) {
    'use strict';

    var salaryReportCollection = Backbone.Collection.extend({

        model       : EmpModel,
        url         : '/salaryReport/',
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : 'list',

        initialize: function (options) {
            var dateRange;
            var _opts;

            this.startTime = new Date();

            this.filter = options.filter || Custom.retriveFromCash('salaryReport.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisYear');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            Custom.cacheToApp('salaryReport.filter', options.filter);

            _opts = options || {};

            this.fetch({
                data   : _opts,
                reset  : true,
                success: function () {
                },

                error: function (err, xhr) {
                    console.log(xhr);
                }
            });
        },

        sortByOrder: function (key, order) {
            this.sortOrder = order;
            this.sortKey = key;

            this.comparator = function (modelA, modelB) {
                var self = this;
                var nameA;
                var nameB;

                function getSortName(model) {
                    return self.sortKey ? model.get(self.sortKey) : model.get('name');
                }

                nameA = getSortName(modelA);
                nameB = getSortName(modelB);

                if (nameA && nameB) {
                    if (nameA > nameB) {
                        return self.sortOrder;
                    } else if (nameA < nameB) {
                        return self.sortOrder * (-1);
                    }
                    return 0;
                }
            };

            this.sort();
        },

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};

            filterObject.filter = options ? options.filter : {};

            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmore', models);
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Some Error.'
                    });
                }
            });
        }
    });
    return salaryReportCollection;
});
