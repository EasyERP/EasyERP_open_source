define([
        'Backbone',
        'models/VacationDashboard',
        'constants'
    ],
    function (Backbone, Model, CONSTANTS) {
        'use strict';

        var Collection = Backbone.Collection.extend({
            model: Model,

            url: CONSTANTS.URLS.DASHBOARD_VACATION,

            initialize: function (options) {
                this.fetch({
                    data : options,
                    reset: true
                });
            }

        });

        return Collection;
    });