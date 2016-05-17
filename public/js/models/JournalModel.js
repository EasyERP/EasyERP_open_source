define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var JournalModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot    : function () {
            return CONSTANTS.URLS.JOURNAL;
        }
    });
    return JournalModel;
});