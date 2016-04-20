define([
    'Backbone',
    'moment'
], function (Backbone, moment) {
    'use strict';
    var Model = Backbone.Model.extend({
        idAttribute: '_id'
    });
    var Colection = Backbone.Collection.extend({
        model: Model,

        url: 'revenue/profit',

        initialize: function (options) {
            options = options || {};

            this.byWeek = !!options.byWeek;

            this.fetch({
                data : options,
                reset: true
            });
        },

        parse: function (response) {
            this.sales = response.sales;

            console.log(response.data);

            return response.data;
        }
    });

    return Colection;
});
