/**
 * Created by soundstorm on 30.06.15.
 */
define([], function () {
    var VacationModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot    : function () {
            return "/Vacation";
        }
    });

    return VacationModel;
});