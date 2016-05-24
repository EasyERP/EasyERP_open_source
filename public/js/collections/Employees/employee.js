/**
 * Created by soundstorm on 17.06.15.
 */
define([
        'Backbone',
        'models/EmployeesModel',
        'constants'
    ],
    function (Backbone, EmployeeModel, CONSTANTS) {
        'use strict';

        var EmployeeCollection = Backbone.Collection.extend({
            model: EmployeeModel,
            url  : CONSTANTS.URLS.EMPLOYEES_GETFORDD,

            initialize: function (options) {

                this.fetch({
                    data   : options,
                    reset  : true,
                    success: function () {
                    },
                    error  : function (models, xhr) {
                        if (xhr.status === 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            },
            parse     : function (response) {
                return response.data;
            }
        });
        return EmployeeCollection;
    });