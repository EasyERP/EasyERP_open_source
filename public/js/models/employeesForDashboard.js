/**
 * Created by soundstorm on 30.06.15.
 */
define([
    'Backbone',
    'collections/Dashboard/employeeByDepartment'
], function (Backbone, EmployeeDashboardData) {
    'use strict';

    var Model = Backbone.Model.extend({
        idAttribute: "department",

        parse: function (model) {
            if (model.employeeData) {
                model.employeeData = new EmployeeDashboardData(model.employees);
            }

            return model;
        }
    });

    return Model;
});