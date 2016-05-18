define(function () {
    var EventModel = Backbone.Model.extend({
        idAttribute: "id",
        initialize : function () {
        },
        defaults   : {
            color      : "",
            assignedTo : "Nobody",
            description: '',
            eventType  : "call"
        },
        urlRoot    : "/Events"
    });
    return EventModel;
});