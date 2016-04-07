define([
        'Backbone',
        'models/VacationDashboard',
        'custom'
    ],
    function (Backbone, Model, custom) {
        var Colection = Backbone.Collection.extend({
            model: Model,
            url: 'dashboard/vacation',

            initialize: function (options) {
                this.fetch({
                    data : options,
                    reset: true
                });
            },

            parse: function(response){
                var weeksArr = response ? response.weeksArray: [];

                custom.cacheToApp('vacationDashWeeksArr', weeksArr);

                return response ? response.sortDepartments: [];
            }

        });

        return Colection;
    });