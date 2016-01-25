/**
 * Created by liliy on 20.01.2016.
 */
"use strict";
define([
        'Backbone',
        'Underscore',
        'text!templates/salaryReport/list/ListTemplate.html',
        'helpers'
    ],

    function (Backbone, _, listTemplate, helpers) {
        var ListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.year = options.year;
                this.month = options.month;
            },

            setAllTotalVals: function () {
                this.calcTotal('1');
                this.calcTotal('2');
                this.calcTotal('3');
                this.calcTotal('4');
                this.calcTotal('5');
                this.calcTotal('6');
                this.calcTotal('7');
                this.calcTotal('8');
                this.calcTotal('9');
                this.calcTotal('10');
                this.calcTotal('11');
                this.calcTotal('12');
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

                    rowTdVal += parseFloat(rowTd.html()) || 0;
                });

                totalTd.text('');

                if (rowTdVal){
                    totalTd.text(helpers.currencySplitter(rowTdVal.toFixed()));
                }
            },

            render: function () {
                this.$el.append(_.template(listTemplate, {
                    collection: this.collection,
                    year: this.year,
                    month: this.month
                }));

                this.setAllTotalVals();
            }
        });

        return ListItemView;
    });
