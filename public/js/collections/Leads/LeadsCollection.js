define([
        'Backbone',
        'jQuery',
        'models/LeadsModel',
        'constants'
    ],
    function (Backbone, $, LeadModel, CONSTANTS) {
        'use strict';

        var LeadsCollection = Backbone.Collection.extend({
            model     : LeadModel,
            url       : function () {
                return CONSTANTS.URLS.LEADS;
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
        return LeadsCollection;
    });