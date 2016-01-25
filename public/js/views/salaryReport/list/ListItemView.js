/**
 * Created by liliy on 20.01.2016.
 */
"use strict";
define([
        'Backbone',
        'Underscore',
        'text!templates/salaryReport/list/ListTemplate.html',
        'helpers',
    'moment'
    ],

    function (Backbone, _, listTemplate, helpers, moment) {
        var ListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startDate = options.startDate;
                this.endDate = options.endDate;
                //this.year = options.year;
                //this.month = options.month;
            },

            setAllTotalVals: function () {
               for (var i = this.endKey; i >= this.startKey; i--){
                   this.calcTotal(i);
               }
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
                this.startKey = moment(this.startDate).year() * 100 + moment(this.startDate).month();
                this.endKey = moment(this.endDate).year() * 100 + moment(this.endDate).month();

                this.$el.append(_.template(listTemplate, {
                    collection: this.collection,
                    startKey: this.startKey,
                    endKey: this.endKey,
                    //year: this.year,
                    //month: this.month,
                    moment: moment
                }));

                this.setAllTotalVals();
            }
        });

        return ListItemView;
    });
