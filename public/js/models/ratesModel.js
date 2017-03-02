define([
    'Backbone',
    'constants',
    'moment'
], function (Backbone, CONSTANTS, moment) {
    'use strict';

    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        parse: function (response) {
            if (!response.data) {
                if (response.date) {
                    response.date = moment(new Date(response.date)).format('DD MMM, YYYY');
                }
            }

            return response;
        },

        urlRoot: function () {
            return CONSTANTS.URLS.RATES;
        }
    });
    return Model;
});
