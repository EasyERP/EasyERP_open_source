/**
 * Created by German on 08.07.2015.
 */
define([
    ''
], function () {
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