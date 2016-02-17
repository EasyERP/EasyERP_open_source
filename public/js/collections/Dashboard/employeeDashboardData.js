define([
        'Backbone',
        'models/EmployeeDashboardData'
    ],
    function (Backbone, Model) {
        'use strict';

        var Colection = Backbone.Collection.extend({
            model: Model,

            comparator: 'name'

        });

        return Colection;
    });