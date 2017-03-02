define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';

    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            code: 'T'
        },

        urlRoot: function () {
            return CONSTANTS.URLS.TAXSETTINGS;
        }
    });

    return Model;
});

