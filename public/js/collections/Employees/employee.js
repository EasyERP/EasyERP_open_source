/**
 * Created by soundstorm on 17.06.15.
 */
define([
        'models/EmployeesModel'
    ],
    function (EmployeeModel) {
        var EmployeeCollection = Backbone.Collection.extend({
            model: EmployeeModel,
            url: "/employee/getForDD",

            initialize: function (options) {

                this.fetch({
                    data: options,
                    reset: true,
                    success: function () {
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) {
                            Backbone.history.navigate('#login', { trigger: true });
                        }
                    }
                });
            },
            parse: function(response){
                return response.data;
            }
        });
        return EmployeeCollection;
    });