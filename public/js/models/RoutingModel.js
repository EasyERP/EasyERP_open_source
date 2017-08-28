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

        parse: function (model) {
            if (model.createdBy.date) {
                model.createdBy.date = moment(new Date(model.createdBy.date)).format('LLL');
            }

            return model;
        },

        urlRoot: function () {
            return CONSTANTS.URLS.ROUTING;
        }
    });

    return WorkCenterModel;
});
