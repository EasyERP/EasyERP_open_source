define([
    'Backbone',
    'moment'
], function (Backbone, moment) {
    'use strict';
    var Model = Backbone.Model.extend({
        idAttribute: 'date',

        parse: function (response) {
            var _Model = Backbone.Model.extend({
                idAttribute: 'salesPerson'
            });
            var Collection = Backbone.Collection.extend({
                model: _Model
            });
            var collection = this.collection || {};
            var sales;
            var paid;
            var revenue;
            var year = response.date.toString().substr(0, 4);
            var monthOrWeek = response.date.toString().substr(4);

            this.byWeek = !!collection.byWeek;

            if (!this.byWeek) {
                response.date = moment([year, monthOrWeek - 1]).format('MMM, YY');
            } else {
                response.date = monthOrWeek + ', ' + year;
            }

            sales = response.profitBySales || [];

            response.profitByMonth = response.profitByMonth || 0;
            response.profitByMonth /= 100;

            response.sales = new Collection(sales);

            return response;
        }
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

            return response.data;
        }
    });

    return Colection;
});
