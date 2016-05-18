/**
 * Created by liliy on 21.03.2016.
 */
"use strict";
define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/cashFlow/list/ListTemplate.html',
        'helpers'
    ],

    function (Backbone, $, _, listTemplate, helpers) {
        var ListItemView = Backbone.View.extend({
            el: '.containerContent',

            initialize: function (options) {
                this.collection = options.collection && options.collection[0] ? options.collection[0] : {};

                this.operating  = this.collection.operating  || [];
                this.investing  = this.collection.investing  || [];
                this.financing  = this.collection.financing  || [];

                this.startDate = options.startDate;
                this.endDate = options.endDate;
            },

            setAllTotalVals: function () {
                var self = this;
                var ths = this.$el.find('th');

                ths.each(function () {
                    if ($(this).hasClass('countable')) {
                        self.calcTotal($(this).attr('data-id'));
                    }
                });
            },

            calcTotal: function (idTotal) {
                var trsOperating = this.$el.find('#listTableOperating').find('tr');
                var trsInvesting = this.$el.find('#listTableInvesting').find('tr');
                var trsFinancing = this.$el.find('#listTableFinancing').find('tr');
                var operatings = 0;
                var investings = 0;
                var financing = 0;
                var row;
                var rowTd;

                var operatingFooter = this.$el.find('#operatingFooter');
                var investingFooter = this.$el.find('#investingFooter');
                var financingFooter = this.$el.find('#financingFooter');

                $(trsOperating).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-id="' + idTotal + '"]');

                    operatings += parseFloat(rowTd.attr('data-value')) || 0;
                });

                $(trsInvesting).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-id="' + idTotal + '"]');

                    investings += parseFloat(rowTd.attr('data-value')) || 0;
                });

                $(trsFinancing).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-id="' + idTotal + '"]');

                    financing += parseFloat(rowTd.attr('data-value')) || 0;
                });

                operatingFooter.text('');
                investingFooter.text('');
                financingFooter.text('');

                operatingFooter.text(helpers.currencySplitter((operatings / 100).toFixed(2)));
                investingFooter.text(helpers.currencySplitter((investings / 100).toFixed(2)));
                financingFooter.text(helpers.currencySplitter((financing / 100).toFixed(2)));
            },

            render: function () {
                this.$el.find('#listTableOperating').append(_.template(listTemplate, {
                    collection      : this.operating,
                    currencySplitter: helpers.currencySplitter
                }));

                this.$el.find('#listTableInvesting').append(_.template(listTemplate, {
                    collection      : this.investing,
                    currencySplitter: helpers.currencySplitter
                }));

                this.$el.find('#listTableFinancing').append(_.template(listTemplate, {
                    collection      : this.financing,
                    currencySplitter: helpers.currencySplitter
                }));

                this.setAllTotalVals();

                return this;
            }
        });

        return ListItemView;
    });
