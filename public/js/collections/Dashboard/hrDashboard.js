define([
        'models/hrDashboard'
    ],
    function (Model) {
        var Colection = Backbone.Collection.extend({
            model: Model,

            url: 'dashboard/hr',

            initialize: function () {
                this.fetch({
                    reset: true
                });
            }
        });

        return Colection;
    });