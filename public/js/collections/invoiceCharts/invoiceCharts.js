define([
    'Backbone',
    'moment',
    'constants'
], function (Backbone, moment, CONSTANTS) {
    "use strict";

    var Model = Backbone.Model.extend({
        idAttribute: '_id',

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

            response.invoiced = response.invoiced || 0;
            response.invoiced /= 100;

            response.paid = response.paid || 0;
            response.paid /= 100;

            response.revenue = response.revenue || 0;
            response.revenue /= 100;

            sales = response.sales || [];
            paid = response.paidBySales || [];
            revenue = response.revenueBySales || [];

            response.sales = new Collection(sales);
            response.paidBySales = new Collection(paid);
            response.revenueBySales = new Collection(revenue);

            return response;
        }
    });
    var Colection = Backbone.Collection.extend({
        model: Model,

        url: CONSTANTS.URLS.REVENUE_SYNTHETIC,

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

            return response.payments;
        }
    });

    return Colection;
});