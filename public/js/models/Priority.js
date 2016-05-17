define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';

    var taskPriority = Backbone.Model.extend({
        idAttribute: "_id",
        defaults   : {
            _id     : null,
            priority: ""
        },
        urlRoot    : function () {
            return CONSTANTS.URLS.PRIORITY;
        }
    });
    return taskPriority;
});