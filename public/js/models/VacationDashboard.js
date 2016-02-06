/**
 * Created by soundstorm on 30.06.15.
 */
define([
    'Backbone',
    'collections/Dashboard/employeeDashboardData'
], function (Backbone, EmployeeDashboardData) {
    'use strict';
    var VacationDashboard = Backbone.Model.extend({
        idAttribute: "department._id",
        parse      : function (model) {
            if (model.employees) {
                model.employees = new EmployeeDashboardData(model.employees);
                model.employees = model.employees.toJSON();
            }

            return model;
        }
    });

    return VacationDashboard;
});