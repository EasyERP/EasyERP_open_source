define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var EventModel = Backbone.Model.extend({
        idAttribute: "id",

        defaults: {
            color      : "",
            assignedTo : "Nobody",
            description: '',
            eventType  : "call"
        },
        urlRoot : CONSTANTS.URLS.EVENTS
    });
    return EventModel;
});