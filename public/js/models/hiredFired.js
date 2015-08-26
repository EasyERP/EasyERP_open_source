
define([], function () {
    var EmployeeForDashboard = Backbone.Model.extend({
        idAttribute: "_id"
        /*urlRoot: function () {
            return "/Vacation";
        }*/
    });

    return EmployeeForDashboard;
});