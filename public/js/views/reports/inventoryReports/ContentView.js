define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/reports/inventoryReports/IndexTemplate.html',
    'collections/reports/filterCollection',
    'views/reports/inventoryReports/IncomingStock',
    'views/reports/inventoryReports/ScarceProducts',
    'views/reports/inventoryReports/ProductListing',
    'dataService',
    'moment'
], function (Backbone, $, _, Parent, mainTemplate, ReportCollection, IncomingStock, ScarceProducts, ProductListing, dataService, moment) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'inventoryReports',
        actionType : 'Content',
        template   : _.template(mainTemplate),
        el         : '#content-holder',
        events     : {
            'click .tabs': 'hideButtons'
        },

        initialize: function (options) {
            var $thisEl = this.$el;
            var type = options.type;
            var self = this;
            var datesArray;

            $('#top-bar').hide();

            this.render({
                type: type
            });

            this.startDate = moment(new Date()).startOf('month');
            this.endDate = moment(this.startDate).endOf('month');

            datesArray = [this.startDate, this.endDate];

            dataService.getData('/reports/incomingStock', {
                startDate: this.startDate.toString(),
                endDate  : this.endDate.toString()
            }, function (resp) {
                var collection;

                collection = new ReportCollection({url: '/reports/incomingStock'});
                collection.set(resp.data);

                return new IncomingStock({collection: collection, datesArray: datesArray});
            });

            dataService.getData('/reports/scarceProducts', {}, function (resp) {
                var collection;

                collection = new ReportCollection({url: '/reports/scarceProducts'});
                collection.set(resp.data);

                return new ScarceProducts({collection: collection, datesArray: datesArray});
            });

            dataService.getData('/reports/getProductListingReport', {}, function (resp) {
                var collection;

                collection = new ReportCollection({url: '/reports/getProductListingReport'});
                collection.set(resp.data);

                return new ProductListing({collection: collection, datesArray: datesArray});
            });
        },

        hideButtons: function (e) {
            var $thisEl = this.$el;
            var $target = e ? $thisEl.find(e.target) : $thisEl.find('#low_stock');
            var id = $target.attr('id');
            var $hideButtons = $thisEl.find('.scaleButtons');
            var $choseSaleRange = $thisEl.find('.choseSaleRange');

            if (id === 'low_stock' || id === 'incoming_stock' || id === 'product_listing') {
                $choseSaleRange.hide();

                return $hideButtons.hide();
            }

            $hideButtons.show();
        },

        render: function (options) {
            var $thisEl = this.$el;
            var type = options.type;

            $thisEl.html(this.template());
            $thisEl.find('#' + type).click();

            this.hideButtons();

            return this;
        }

    });

    return ContentView;
});

