/**
 * Created by soundstorm on 30.06.15.
 */
define(['collections/Dashboard/employeeByDepartment'], function (employeeDashboardData) {
    var Model = Backbone.Model.extend({
        idAttribute: "department",

        parse: function (model) {
            if (model.employeeData) {
                model.employeeData = new employeeDashboardData(model.employees);
            }

            return model;
        }
    });

    return Model;
});