define([
        'Backbone',
        'Underscore',
        'models/OpportunitiesModel',
        'common'
    ],
    function (Backbone, _, OpportunityModel, common) {
        'use strict';

        var OpportunitiesCollection = Backbone.Collection.extend({
            model: OpportunityModel,
            parse: function (response) {
                if (response && response.data) {
                    _.map(response.data, function (opportunity) {
                        if (opportunity.nextAction) {
                            opportunity.nextAction.date = (opportunity.nextAction) ? common.utcDateToLocaleDate(opportunity.nextAction.date) : '';
                        }
                        return opportunity;
                    });
                }
                return response.data;
            }
        });
        return OpportunitiesCollection;
    });
