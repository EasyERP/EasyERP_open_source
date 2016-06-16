define([
    'Backbone',
    'moment'
], function (Backbone, moment) {
    "use strict";
    var Model = Backbone.Model.extend({
        idAttribute: '_id',

        parse: function (response) {
            var _Model = Backbone.Model.extend({
                idAttribute: 'salesPerson',

                parse: function (_response) {
                    if (!_response.salesPerson) {
                        _response.salesPerson = 'empty';
                    }

                    return _response;
                }
            });
            var _SupplierModel = Backbone.Model.extend({
                idAttribute: 'supplier',

                parse: function (_response) {
                    if (!_response.supplier) {
                        _response.supplier = 'empty';
                    }

                    return _response;
                }
            });
            var Collection = Backbone.Collection.extend({
                model: _Model
            });
            var _SupplierCollection = Backbone.Collection.extend({
                model: _SupplierModel
            });
            var collection = this.collection || {};
            var sales;
            var paid;
            var revenue;
            var suppliers;
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
            suppliers = response.suppliers || [];
            paid = response.paidBySales || [];
            revenue = response.revenueBySales || [];

            response.sales = new Collection(sales, {parse: true});
            response.paidBySales = new Collection(paid, {parse: true});
            response.revenueBySales = new Collection(revenue);
            response.suppliers = new _SupplierCollection(suppliers);

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

        parse: function (response) {
            this.sales = response.sales;
            this.suppliers = response.suppliers;

            return response.payments;
        }
    });

    return Colection;
});
