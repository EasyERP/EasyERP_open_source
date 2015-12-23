define(['moment'],
    function (moment) {
        "use strict";
        var Model = Backbone.Model.extend({
            idAttribute: '_id',

            parse: function (response) {
                var Model = Backbone.Model.extend({
                    idAttribute: 'salesPerson'
                });
                var Collection = Backbone.Collection.extend({
                    model: Model
                });
                var collection = this.collection || {};
                var sales;
                var year = response.date.toString().substr(0, 4);
                var monthOrWeek = response.date.toString().substr(4);

                this.byWeek = !!collection.byWeek;

                if(!this.byWeek){
                    response.date = moment([year, monthOrWeek - 1]).format('MMM, YY');
                } else {
                    response.date = monthOrWeek + ', ' + year;
                }

                response.invoiced = response.invoiced || 0;
                response.invoiced /= 100;

                response.paid = response.paid || 0;
                response.paid /= 100;

                sales = response.sales || [];

                response.sales = new Collection(sales);

                return response;
            }
        });
        var Colection = Backbone.Collection.extend({
            model: Model,

            url: 'revenue/synthetic',

            initialize: function (options) {
                options = options || {};

                this.byWeek = !!options.byWeek;

                this.fetch({
                    data : options,
                    reset: true
                });
            },

            parse: function(response){
                this.sales = response.sales;

                return response.payments
            }
        });

        return Colection;
    });