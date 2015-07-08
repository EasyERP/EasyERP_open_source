/**
 * Created by German on 08.07.2015.
 */
define([], function () {
    var BonusModel = Backbone.Model.extend({
        defaults: {
            employeeId: null,
            bonusId: null,
            startDate: new Date(),
            endDate: new Date()
        }
    });

    return BonusModel;
});