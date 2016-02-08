define([
        'Backbone',
        'jQuery',
        'models/DegreeModel',
        'constants'
    ],
    function (Backbone, $, DegreeModel, CONSTANTS) {
        'use strict';

        var DegreesCollection = Backbone.Collection.extend({
            model     : DegreeModel,
            url       : function () {
                return CONSTANTS.URLS.DEGREES;
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

            parse: function (response) {
                return response.data;
            }
        });
        return DegreesCollection;
    });