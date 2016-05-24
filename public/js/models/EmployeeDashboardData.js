define([
    'Backbone'
], function (Backbone) {
    'use strict';
    var EmployeeForDashboard = Backbone.Model.extend({
        idAttribute: "employee"

    });

    return EmployeeForDashboard;
});