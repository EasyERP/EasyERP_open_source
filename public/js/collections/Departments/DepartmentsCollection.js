define([
        'Backbone',
        'jQuery',
        'models/DepartmentsModel',
        'constants'
    ],
    function (Backbone, $, DepartmentsModel, CONSTANTS) {
        'use strict';

        var departmentsCollection = Backbone.Collection.extend({
            model     : DepartmentsModel,
            url       : function () {
                return CONSTANTS.URLS.DEPARTMENTS;
            },
            initialize: function () {
                var mid = 39;

                this.fetch({
                    data   : $.param({
                        mid: mid
                    }),
                    type   : 'GET',
                    reset  : true,
                    success: this.fetchSuccess,
                    error  : this.fetchError
                });
            },
            parse     : function (response) {
                return response.data;
            }
        });
        return departmentsCollection;
    });