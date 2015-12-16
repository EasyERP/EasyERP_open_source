/**
 * Created by soundstorm on 29.06.15.
 */
define([
    'common'
], function (common) {
    var HolidayModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {
        },
        urlRoot    : function () {
            return "/Holiday";
        },
        parse      : function (holiday) {
            holiday.date = common.utcDateToLocaleDate(holiday.date);

            return holiday;
        }
    });

    return HolidayModel;
});