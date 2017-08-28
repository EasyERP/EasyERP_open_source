define([
    'Backbone',
    'moment'
], function (Backbone, moment) {
    'use strict';

    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        parse: function (response) {
            if (response.date) {
                response.date = moment(response.date).format('LLL');
            }

            return response;
        }
    });

    return Model;
});
