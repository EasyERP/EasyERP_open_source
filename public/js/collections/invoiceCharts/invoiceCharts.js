define([],
    function () {
        "use strict";
        var Model = Backbone.Model.extend({
            idAttribute: '_id',

            parse: function (response) {
                var sales;
                var Model = Backbone.Model.extend({
                    idAttribute: 'salesPerson'
                });
                var Collection = Backbone.Collection.extend({
                    model: Model
                });

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