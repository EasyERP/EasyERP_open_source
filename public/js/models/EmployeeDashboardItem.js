/**
 * Created by soundstorm on 30.06.15.
 */
define([
    'Backbone'
], function (Backbone) {
    'use strict';

    var EmployeeForDashboard = Backbone.Model.extend({
        idAttribute: "_id"
    });

    return EmployeeForDashboard;
});