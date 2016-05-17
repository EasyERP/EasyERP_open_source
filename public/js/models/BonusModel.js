/**
 * Created by German on 08.07.2015.
 */
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