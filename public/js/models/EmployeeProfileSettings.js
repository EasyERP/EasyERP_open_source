define([
    'Backbone'
], function (Backbone) {
    'use strict';
    var EmployeeForDashboard = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return 'employees/settings';
        }
    });

    return EmployeeForDashboard;
});
