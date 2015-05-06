define([
    'models/OpportunitiesModel',
    'common'
],
    function (OpportunityModel, common) {
        var OpportunitiesCollection = Backbone.Collection.extend({
            model: OpportunityModel,
            initialize: function () {},
            parse: true,
            parse: function (response) {
                if (response && response.data) {
                    _.map(response.data, function (opportunity) {
                        if (opportunity.nextAction)
                            opportunity.nextAction.date = (opportunity.nextAction) ? common.utcDateToLocaleDate(opportunity.nextAction.date) : '';
                        return opportunity;
                    });
                }
                return response.data;
            },
        });
        return OpportunitiesCollection;
    });
