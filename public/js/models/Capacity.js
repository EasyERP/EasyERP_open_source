define([], function () {
    var VacationModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: function () {
            return "/Capacity";
        }
    });

    return VacationModel;
});