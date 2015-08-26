define([
        'models/VacationDashboard'
    ],
    function (Model) {
        var Colection = Backbone.Collection.extend({
            model: Model,

            url: 'dashboard/vacation',

            initialize: function(){
                this.fetch({
                    reset: true
                });
            }


        });

        return Colection;
    });