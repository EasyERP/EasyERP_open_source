define([
        'models/VacationDashboard'
    ],
    function (Model) {
        var Colection = Backbone.Collection.extend({
            model: Model,

            url: 'dashboard/vacation',

            initialize: function (options) {
                this.fetch({
                    data : options,
                    reset: true
                });
            }

        });

        return Colection;
    });