define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    var BonusModel = Backbone.Model.extend({
        urlRoot: function () {
            return CONSTANTS.URLS.CASH_TRANSFER;
        }
    });

    return BonusModel;
});
