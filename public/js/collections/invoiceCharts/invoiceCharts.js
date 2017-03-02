define([
    'Backbone',
    'helpers/getDateHelper',
    'moment',
    'custom'
], function (Backbone, DateHelper, moment, custom) {
    'use strict';
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
            var dateRange;
            var _opts = options || {};

            this.startTime = new Date();

            this.filter = _opts.filter || custom.retriveFromCash('invoiceCharts.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate({
                    count: 2,
                    type : 'year'
                });

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);
            this.byWeek = !!_opts.byWeek;

            _opts.filter = this.filter || {};

            _opts.filter.date = {
                value: [this.startDate, this.endDate]
            };

            custom.cacheToApp('invoiceCharts.filter', _opts.filter);

            this.fetch({
                data   : _opts,
                reset  : true,
                success: function () {
                },

                error: function (err, xhr) {
                    console.log(xhr);
                }
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
