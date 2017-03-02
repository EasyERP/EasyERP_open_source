define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/reports/salesReports/IndexTemplate.html',
    'views/reports/salesReports/InfoBySalesProducts',
    'views/reports/salesReports/SalesInfoByMonth',
    'views/reports/salesReports/SalesInfoByChannel',
    'dataService',
    'moment'
], function (Backbone, $, _, Parent, mainTemplate, InfoBySalesProducts, SalesInfoByMonth, SalesInfoByChannel, dataService, moment) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'salesReports',
        actionType : 'Content',
        template   : _.template(mainTemplate),
        el         : '#content-holder',
        events     : {
            'click .tabs': 'hideButtons'
        },

        initialize: function (options) {
            var datesArray;
            var $thisEl = this.$el;
            var type = options.type;

            $('#top-bar').hide();

            this.render({
                type: type
            });

            this.startDate = moment(new Date()).startOf('month');
            this.endDate = moment(this.startDate).endOf('month');

            datesArray = [this.startDate, this.endDate];

            dataService.getData('/reports/products', {
                startDate: this.startDate.toString(),
                endDate  : this.endDate.toString()
            }, function (resp) {
                return new InfoBySalesProducts({data: resp.data, datesArray: datesArray});
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

        render: function (options) {
            var $thisEl = this.$el;
            var type = options.type;

            $thisEl.html(this.template());
            $thisEl.find('#' + type).click();

            return this;
        }

    });

    return ContentView;
});

