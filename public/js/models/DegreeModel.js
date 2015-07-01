define(function () {
    var DegreeModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            name: ''
        },
        urlRoot: function () {
            return "/Degrees";
        }
    });
    return DegreeModel;
});