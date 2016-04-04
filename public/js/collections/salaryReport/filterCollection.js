/**
 * Created by liliy on 20.01.2016.
 */
'use strict';
define([
    'Backbone',
    'models/EmployeeDashboardItem',
    'custom'
], function (Backbone, EmpModel, Custom) {
    var salatyCollection = Backbone.Collection.extend({

        model       : EmpModel,
        url         : '/salaryReport/list',
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : 'list',

        initialize: function (options) {
            options = options || {};

            this.startTime = new Date();
            this.filter = options.filter || Custom.retriveFromCash('salaryReport.filter');
            var startDate = new Date();
            var endDate = new Date();
            startDate.setMonth(0);
            startDate.setDate(1);
            endDate.setMonth(11);
            endDate.setDate(31);
            var dateRange = Custom.retriveFromCash('salaryReportDateRange') || {};
            this.startDate = dateRange.startDate;
            this.endDate = dateRange.endDate;

            this.startDate = dateRange.startDate ||  startDate;
            this.endDate = dateRange.endDate || endDate;

            options.startDate = this.startDate;
            options.endDate = this.endDate;
            options.filter = this.filter;

            Custom.cacheToApp('salaryReportDateRange', {
                startDate: this.startDate,
                endDate  : this.endDate
            });

            this.fetch({
                data   : options,
                reset  : true,
                success: function () {

                },
                error  : function (err, xhr) {
                    console.log(xhr);
                }
            });
        },

        sortByOrder: function (key, order) {
            this.sortOrder = order;
            this.sortKey = key;

            this.comparator = function (modelA, modelB) {
                var self = this;
                var nameA = getSortName(modelA);
                var nameB = getSortName(modelB);

                function getSortName(model) {
                    var sortAttr = self.sortKey ? model.get(self.sortKey) : model.get('name');

                    return sortAttr;
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
                error  : function () {
                    App.render({
                        type: 'error',
                        message: "Some Error."
                    });
                }
            });
        }
    });

    return salatyCollection;
});
