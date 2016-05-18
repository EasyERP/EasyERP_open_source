define([
    'Backbone',
    'collections/Dashboard/employeeDashboardData'
], function (Backbone, employeeDashboardData) {
    var VacationDashboard = Backbone.Model.extend({
        idAttribute: "department._id",
        /*urlRoot: function () {
         return "/Vacation";
         }*/
        parse      : function (model) {
            if (model.employees) {
                model.employees = new employeeDashboardData(model.employees);
                model.employees = model.employees.toJSON();
            }

            return model;
        }
    });

    return VacationDashboard;
});