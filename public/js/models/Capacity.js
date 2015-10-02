define([], function () {
    var CapacityModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: function () {
            return "/Capacity";
        }
    });

    return CapacityModel;
});