define([
        'Backbone',
        'jQuery',
        'models/LeadsModel',
        'constants',
        'common'

    ],
    function (Backbone, $, LeadModel, CONSTANTS, common) {
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
                if (response && response.data) {
                    _.map(response.data, function (opportunity) {
                        if (opportunity.nextAction) {
                            opportunity.nextAction.date = (opportunity.nextAction) ? common.utcDateToLocaleDate(opportunity.nextAction.date) : '';
                        }
                        if (opportunity.dateBirth) {
                            opportunity.dateBirth = (opportunity.dateBirth) ? common.utcDateToLocaleDate(opportunity.dateBirth) : '';
                        }
                        return opportunity;
                    });
                }
                return response.data;
            }
        });

        return LeadsCollection;
    });