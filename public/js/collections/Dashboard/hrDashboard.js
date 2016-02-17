define([
        'Backbone',
        'models/hrDashboard',
        'constants'
    ],
    function (Backbone, Model, CONSTANTS) {
        'use strict';

        var Colection = Backbone.Collection.extend({
            model: Model,

            url: CONSTANTS.URLS.DASHBOARD_HR,

            initialize: function () {
                this.fetch({
                    reset: true
                });
            }
        });

        return Colection;
    });