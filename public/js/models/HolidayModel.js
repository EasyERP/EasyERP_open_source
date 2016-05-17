/**
 * Created by soundstorm on 29.06.15.
 */
define([
    'Backbone',
    'common',
    'constants'
], function (Backbone, common, CONSTANTS) {
    'use strict';

    var HolidayModel = Backbone.Model.extend({
        idAttribute: "_id",

        urlRoot: function () {
            return CONSTANTS.URLS.HOLIDAY;
        },
        parse  : function (holiday) {
            holiday.date = common.utcDateToLocaleDate(holiday.date);

            return holiday;
        }
    });

    return HolidayModel;
});