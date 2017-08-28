define([
    'Backbone',
    'Underscore',
    'Validation',
    'moment',
    'constants'
], function (Backbone, _, Validation, moment, CONSTANTS) {
    'use strict';

    var WorkCenterModel = Backbone.Model.extend({
        idAttribute: '_id',

        initialize: function () {

        },

        urlRoot: function () {
            return CONSTANTS.URLS.WORKCENTERS;
        }
    });

    return WorkCenterModel;
});
