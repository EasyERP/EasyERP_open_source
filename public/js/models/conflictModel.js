define([
    'Backbone',
    'common',
    'constants'
], function (Backbone, common, CONSTANTS) {
    'use strict';

    var ConflictModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.CONFLICT;
        }
    });

    return ConflictModel;
});
