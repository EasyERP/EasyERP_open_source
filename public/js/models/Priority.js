define(function () {
    var taskPriority = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            _id: null,
            priority: ""
        },
        urlRoot: function () {
            return "/Priority";
        }
    });
    return taskPriority;
});