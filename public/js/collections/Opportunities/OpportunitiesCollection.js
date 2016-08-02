define([
    'Backbone',
    'Underscore',
    'models/OpportunitiesModel',
    'common'
], function (Backbone, _, OpportunityModel, common) {
    'use strict';

    var OpportunitiesCollection = Backbone.Collection.extend({
        model: OpportunityModel,
        parse: function (response) {
            if (response && response.data) {
                _.map(response.data, function (opportunity) {
                    if (opportunity.expectedClosing) {
                        opportunity.expectedClosing =  common.utcDateToLocaleDate(opportunity.expectedClosing) || '';
                    }
                    return opportunity;
                });
            }
            return response.data;
        }
    });
    return OpportunitiesCollection;
});
