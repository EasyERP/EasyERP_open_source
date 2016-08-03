define([
    'Backbone',
    'collections/parent',
    'Underscore',
    'models/DealTasksModel',
    'common',
    'constants'
], function (Backbone, Parent, _, EmployeeModel, common, CONSTANTS) {
    'use strict';

    var EmployeesCollection = Parent.extend({
        model   : EmployeeModel,
        url     : CONSTANTS.URLS.DEALTASKS,
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

        initialize: function (options) {
            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;

            this.startTime = new Date();

            this.getFirstPage(options);
        },

        parse: function (response) {
            if (response.data) {
                if (response.data.thisWeek) {
                    _.map(response.data.thisWeek, function (employee) {
                        employee.dueDate = common.utcDateToLocaleDateTime(employee.dueDate);
                        return employee;
                    });
                }
                if (response.data.tomorrow) {
                    _.map(response.data.tomorrow, function (employee) {
                        employee.dueDate = common.utcDateToLocaleHours(employee.dueDate);
                        return employee;
                    });
                }
                if (response.data.overdue) {
                    _.map(response.data.overdue, function (employee) {
                        employee.dueDate = common.utcDateToLocaleHours(employee.dueDate);
                        return employee;
                    });
                }
                if (response.data.today) {
                    _.map(response.data.today, function (employee) {
                        employee.dueDate = common.utcDateToLocaleHours(employee.dueDate);
                        return employee;
                    });
                }
            }

            return Parent.prototype.parse.apply(this, arguments);
        }
    });

    return EmployeesCollection;
});