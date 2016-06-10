define([
    'Backbone'
], function (Backbone) {
    var BonusModel = Backbone.Model.extend({
        defaults: {
            employee : {},
            bonus    : {},
            startDate: null,
            endDate  : null
        }
    });

    return BonusModel;
});
