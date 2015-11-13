/**
 * Created by soundstorm on 30.06.15.
 */
define(['collections/Dashboard/employeeDashboardData'], function (employeeDashboardData) {
    var VacationDashboard = Backbone.Model.extend({
        idAttribute: "department._id",
        /*urlRoot: function () {
            return "/Vacation";
        }*/
        parse: function(model){
            if(model.employees){
                model.employees = new employeeDashboardData(model.employees);
                model.employees = model.employees.toJSON();
            }

            return model;
        }
    });

    return VacationDashboard;
});