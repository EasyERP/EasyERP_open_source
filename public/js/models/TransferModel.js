define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';

    var TransfersModel = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            date                : new Date,
            //isDeveloper         : true,
            salary              : 0
        },

        urlRoot: function () {
            return CONSTANTS.URLS.TRANSFER;
        },

        parse: function (model) {
            return model;
        }
    });

    return TransfersModel;
});
