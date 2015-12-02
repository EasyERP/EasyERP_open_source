define([
        'text!templates/journal/list/ListTemplate.html',
        'helpers',
        'async'
    ],

    function (listTemplate, helpers, async) {
        "use strict";

        var ListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;//Counting the start index of list items
            },

            render: function () {
                var $thisEl = this.$el;

                function calcTotalZero(cb) {
                    var total = 0;
                    var $zeroContainer = $thisEl.find('#zeroTotal');
                    var _$zeroContainer = $thisEl.find('td[data-content="zeroTotal"]');

                    _$zeroContainer.each(function () {
                        var val = $.trim($(this).text());

                        val = val.replace(' ', '') || 0;

                        total += parseInt(val);
                    });

                    total = total.toFixed(2);
                    total = helpers.currencySplitter(total);
                    $zeroContainer.text(total);

                    cb();
                }

                function calcTotalThirty(cb) {
                    var total = 0;

                    var $thirtyTotal = $thisEl.find('#thirtyTotal');
                    var _$thirtyTotal = $thisEl.find('td[data-content="thirtyTotal"]');

                    _$thirtyTotal.each(function () {
                        var val = $.trim($(this).text());

                        val = val.replace(' ', '') || 0;

                        total += parseInt(val);

                    });

                    total = total.toFixed(2);
                    total = helpers.currencySplitter(total);
                    $thirtyTotal.text(total);

                    cb();
                }

                function calcTotalFifteen(cb) {
                    var total = 0;

                    var $fifteenTotal = $thisEl.find('#fifteenTotal');
                    var _$fifteenTotal = $thisEl.find('td[data-content="fifteenTotal"]');

                    _$fifteenTotal.each(function () {
                        var val = $.trim($(this).text());

                        val = val.replace(' ', '') || 0;

                        total += parseInt(val);

                    });

                    total = total.toFixed(2);
                    total = helpers.currencySplitter(total);
                    $fifteenTotal.text(total);

                    cb();
                }

                function calcTotalSixty(cb) {
                    var total = 0;

                    var $sixtyTotal = $thisEl.find('#sixtyTotal');
                    var _$sixtyTotal = $thisEl.find('td[data-content="sixtyTotal"]');

                    _$sixtyTotal.each(function () {
                        var val = $.trim($(this).text());

                        val = val.replace(' ', '') || 0;

                        total += parseInt(val);
                    });

                    total = total.toFixed(2);
                    total = helpers.currencySplitter(total);
                    $sixtyTotal.text(total);

                    cb();
                }

                function calcTotalNinety(cb) {
                    var total = 0;

                    var $ninetyTotal = $thisEl.find('#ninetyTotal');
                    var _$ninetyTotal = $thisEl.find('td[data-content="ninetyTotal"]');

                    _$ninetyTotal.each(function () {
                        var val = $.trim($(this).text());

                        val = val.replace(' ', '') || 0;

                        total += parseInt(val);
                    });

                    total = total.toFixed(2);
                    total = helpers.currencySplitter(total);
                    $ninetyTotal.text(total);

                    cb();
                }

                function calcTotalMore(cb) {
                    var total = 0;

                    var $moreTotal = $thisEl.find('#moreTotal');
                    var _$moreTotal = $thisEl.find('td[data-content="moreTotal"]');

                    _$moreTotal.each(function () {
                        var val = $.trim($(this).text());

                        val = val.replace(' ', '') || 0;

                        total += parseInt(val);
                    });

                    total = total.toFixed(2);
                    total = helpers.currencySplitter(total);
                    $moreTotal.text(total);

                    cb();
                }

                this.$el.append(_.template(listTemplate, {
                    currencySplitter: helpers.currencySplitter,
                    collection      : this.collection.toJSON(),
                    startNumber     : this.startNumber
                }));

                async.parallel([calcTotalZero, calcTotalFifteen, calcTotalThirty, calcTotalSixty, calcTotalNinety, calcTotalMore], function(){

                });
            }
        });

        return ListItemView;
    });
