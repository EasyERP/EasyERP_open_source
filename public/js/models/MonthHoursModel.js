/**
 * Created by Liliya on 22.06.2015.
 */
define([], function () {

    var MonthHoursModel = Backbone.Model.extend({
        idAttribute: "_id",

        urlRoot: function () {
            return "/monthHours";
        }
    });
    return MonthHoursModel;

});