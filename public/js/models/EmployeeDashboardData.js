define([], function () {
    var EmployeeForDashboard = Backbone.Model.extend({
        idAttribute: "employee"
        /*urlRoot: function () {
         return "/Vacation";
         }*/
    });

    return EmployeeForDashboard;
});