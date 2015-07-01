define([
    'models/EmployeesModel',
    'common'
],
    function (EmployeeModel, common) {
        var EmployeesCollection = Backbone.Collection.extend({
            model: EmployeeModel,
            url: "/Birthdays",
            initialize: function (options) {
				this.startTime = new Date();
                this.fetch({
                    reset: true,
                    success: function() {
                    },
                    error: this.fetchError
                });
            },
            parse: true,
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
                return response.data;
            }
        });
        return EmployeesCollection;
    });