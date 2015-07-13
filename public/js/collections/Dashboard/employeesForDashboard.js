define([
        'models/employeesForDashboard'
    ],
    function (Model) {
        var Colection = Backbone.Collection.extend({
            model: Model,

            url: 'employee/byDepartment',

            initialize: function(){
                this.fetch({
                    reset: true
                });
            }


        });

        return Colection;
    });