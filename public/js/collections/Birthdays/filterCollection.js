define([
    'Backbone',
    'collections/parent',
    'Underscore',
    'models/EmployeesModel',
    'common',
    'constants'
], function (Backbone, Parent, _, EmployeeModel, common, CONSTANTS) {
    'use strict';

    var EmployeesCollection = Parent.extend({
        model   : EmployeeModel,
        url     : CONSTANTS.URLS.BIRTHDAYS,
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
                if (response.data.weekly) {
                    _.map(response.data.weekly, function (employee) {
                        employee.dateBirth = common.utcDateToLocaleDate(employee.dateBirth);
                        return employee;
                    });
                }
                if (response.data.nextweek) {
                    _.map(response.data.nextweek, function (employee) {
                        employee.dateBirth = common.utcDateToLocaleDate(employee.dateBirth);
                        return employee;
                    });
                }
                if (response.data.monthly) {
                    _.map(response.data.monthly, function (employee) {
                        employee.dateBirth = common.utcDateToLocaleDate(employee.dateBirth);
                        return employee;
                    });
                }
            }

            return Parent.prototype.parse.apply(this, arguments);
        }
    });

    return EmployeesCollection;
});