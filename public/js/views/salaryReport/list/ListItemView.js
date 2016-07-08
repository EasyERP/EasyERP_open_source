define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/salaryReport/list/ListTemplate.html',
    'helpers',
    'moment'
], function (Backbone, $, _, listTemplate, helpers, moment) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.startDate = options.startDate;
            this.endDate = options.endDate;
        },

        setAllTotalVals: function () {
            var self = this;
            var ths = $('#caption').find('th');

            ths.each(function () {
                if ($(this).hasClass('dates')) {
                    self.calcTotal($(this).attr('data-id'));
                }
            });
        },

        calcTotal: function (idTotal) {
            var footerRow = $('#salaryReportFooter');
            var trs = this.$el.find('tr');
            var totalTd = $(footerRow).find('#' + idTotal);
            var rowTdVal = 0;
            var row;
            var rowTd;

            $(trs).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                rowTdVal += parseFloat(helpers.spaceReplacer(rowTd.html())) || 0;
            });

            totalTd.text('');

            if (rowTdVal) {
                totalTd.text(helpers.currencySplitter(rowTdVal.toFixed()));
                totalTd.addClass('money');
            }
        },

        render: function () {
            this.startKey = moment(this.startDate).year() * 100 + moment(this.startDate).month();
            this.endKey = moment(this.endDate).year() * 100 + moment(this.endDate).month();

            this.$el.append(_.template(listTemplate, {
                collection      : this.collection,
                startKey        : this.startKey,
                endKey          : this.endKey,
                moment          : moment,
                currencySplitter: helpers.currencySplitter
            }));

            this.setAllTotalVals();
        }
    });

    return ListItemView;
});
