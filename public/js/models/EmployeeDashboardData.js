/**
 * Created by soundstorm on 30.06.15.
 */
define([], function () {
    var EmployeeForDashboard = Backbone.Model.extend({
        idAttribute: "employee"
        /*urlRoot: function () {
            return "/Vacation";
        }*/
    });

    return EmployeeForDashboard;
});