define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/reports/productsReports/IndexTemplate.html',
    'views/reports/productsReports/IncomingStock',
    'views/reports/productsReports/InfoBySalesProducts',
    'views/reports/productsReports/ScarceProducts',
    'views/reports/productsReports/ProductListing',
    'views/reports/productsReports/SalesInfoByMonth',
    'views/reports/productsReports/SalesInfoByChannel',
    'dataService',
    'moment'
], function (Backbone, $, _, Parent, mainTemplate, IncomingStock, InfoBySalesProducts, ScarceProducts, ProductListing, SalesInfoByMonth, SalesInfoByChannel, dataService, moment) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'productsReports',
        actionType : 'Content',
        template   : _.template(mainTemplate),
        el         : '#content-holder',
        events     : {
            'click .tabs': 'hideButtons'
        },

        initialize: function () {
            var datesArray;
            var $thisEl = this.$el;

            $('#top-bar').hide();

            this.render();

            this.startDate = moment(new Date()).startOf('month');
            this.endDate = moment(this.startDate).endOf('month');

            datesArray = [this.startDate, this.endDate];

            dataService.getData('/reports/products', {
                startDate: this.startDate.toString(),
                endDate  : this.endDate.toString()
            }, function (resp) {
                return new InfoBySalesProducts({data: resp.data, datesArray: datesArray});
            });

            dataService.getData('/reports/incomingStock', {
                startDate: this.startDate.toString(),
                endDate  : this.endDate.toString()
            }, function (resp) {
                return new IncomingStock({data: resp.data, datesArray: datesArray});
            });

            dataService.getData('/reports/scarceProducts', {}, function (resp) {
                return new ScarceProducts({data: resp.data, datesArray: datesArray});
            });

            dataService.getData('/reports/getProductListingReport', {}, function (resp) {
                return new ProductListing({data: resp.data, datesArray: datesArray});
            });

            dataService.getData('/reports/getInfoSalesByMonth', {}, function (resp) {
                return new SalesInfoByMonth({data: resp.data, datesArray: datesArray});
            });

            dataService.getData('/reports/getInfoSalesByChannel', {}, function (resp) {
                return new SalesInfoByChannel({data: resp.data, datesArray: datesArray});
            });
        },

        hideButtons: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $target.attr('id');
            var $hideButtons = $thisEl.find('.scaleButtons');

            if (id === 'low_stock' || id === 'incoming_stock' || id === 'product_listing') {
                return $hideButtons.hide();
            }

            $hideButtons.show();
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        }

    });

    return ContentView;
});

