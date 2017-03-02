define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/reports/salesReports/InfoBySalesTemplate.html',
    'text!templates/reports/salesReports/SalesTemplate.html',
    'views/Filter/dateFilter',
    'dataService',
    'moment',
    'helpers',
    'd3'
], function (Backbone, _, $, main, SalesTemplate, DateFilterView, dataService, moment, helpers, d3) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template       : _.template(main),
        tableTemplate  : _.template(SalesTemplate),
        el             : '#infoBySales',
        noNeedCreatedIn: true,

        events: {
            'click .scaleButtons': 'activateTabs',
            'click .changeInfo'  : 'changeInfo'
        },

        initialize: function (options) {
            this.data = options.data && options.data.products ? options.data.products : [];
            this.datesArray = options.datesArray;

            this.render();
        },

        changeInfo: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $target.attr('id');

            $thisEl.find('.active').removeClass('active');
            $target.addClass('active');

            this.renderChart(id);
            this.activateTabs();
        },

        activateTabs: function (e) {
            var $thisEl = this.$el;
            var scaleButtons = $thisEl.find('.scaleButtons');
            var scaleTabs = $thisEl.find('.scaleTabs');
            var $target;
            var attr;

            scaleTabs.hide();
            scaleButtons.removeClass('active');

            if (!e) {
                $thisEl.find(scaleButtons[0]).addClass('active');
            } else {
                $target = $thisEl.find(e.target);
                $target.addClass('active');
            }

            $thisEl.find('.lineTabs').show();
        },

        changeDateRange: function (dateArray) {
            var self = this;
            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            dataService.getData('/reports/products', {
                startDate: this.startDate,
                endDate  : this.endDate
            }, function (resp) {
                self.data = resp.data && resp.data.products ? resp.data.products : [];

                self.renderChart('in_percents');
                self.activateTabs();
            });
        },

        renderChart: function (id) {
            this.$el.find('.tableListWrap').html(this.tableTemplate({
                collection      : this.data,
                currencySplitter: helpers.currencySplitter
            }));

            if (id === 'in_percents') {

                this.$el.find('.percents').removeClass('hidden');
                this.$el.find('.percents').find('svg').remove();
                this.$el.find('.units').addClass('hidden');
                this.renderLineGraphic({
                    frequency: 'productPercentSales',
                    letter   : 'product',
                    selector : 'lineGraphic',
                    color    : '51,77,151,',
                    percent  : true
                });
            } else {
                this.$el.find('.percents').addClass('hidden');
                this.$el.find('.units').find('svg').remove()
                this.$el.find('.units').removeClass('hidden');

                this.renderLineGraphic({
                    frequency: 'units',
                    letter   : 'product',
                    selector : 'lineGraphicUnits',
                    color    : '37,46,75,'
                });
            }
        },

        renderLineGraphic: function (options) {
            var info = 'productPercentSales';
            var infoY = options.percent ? 'Percent' : 'Units';
            var margin = {top: 20, right: 20, bottom: 30, left: 120};
            var container = options.percent ? this.$el.find('.lineGraphic') : this.$el.find('.lineGraphicUnits');
            var width = container.width() - margin.left - margin.right;
            var height = 350 - margin.bottom - margin.top;
            var tooltip;
            var valueLabel = 'frequency';
            var nameLabel = 'letter';
            var max;
            var min;
            var frequency = options.frequency;
            var letter = options.letter;
            var symbol = options.percent ? '% ' : ' ';
            var afterDot = options.percent ? 2 : 0;
            var x;
            var y;
            var yAxis;
            var svg;
            var data = [];

            if (!this.data || !this.data.length) {
                return;
            }

            if (this.data && this.data.length && ((container.width() / this.data.length) < 35)) {
                width = (this.data.length * 35) - margin.left - margin.right;
            }

            x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1, 1);

            y = d3.scale.linear()
                .range([height, 0]);

            yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            d3.select('.' + options.selector + ' > *').remove();

            svg = d3.select('.' + options.selector).append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            this.data.forEach(function (d) {

                data.push({
                    frequency: d[frequency],
                    letter   : d[letter] + ' ' + d.sku
                });
            });

            data = data.sort(function (a, b) {
                return d3.descending(a.frequency, b.frequency);
            })
                .map(function (d) {
                    return {
                        frequency: d.frequency,
                        letter   : d.letter
                    };
                });

            data.forEach(function (d) {
                d.frequency = +d.frequency;
            });

            x.domain(data.map(function (d) {
                return d.letter;
            }));

            max = d3.max(data, function (d) {
                return d.frequency;
            });

            min = d3.min(data, function (d) {
                return d.frequency;
            });

            if (min === max) {
                min = 0;
            }

            max = Math.ceil(max);

            y.domain([0, max]);

            tooltip = d3.select('.' + options.selector)
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end');

            svg.append('text')
                .attr('class', 'axisTitle')
                .attr('transform', 'translate(' + -30 + ' ,' + -20 + ')')
                .text(infoY);

            svg.selectAll('line.y')
                .data(y.ticks())
                .enter()
                .append('line')
                .attr('class', 'y')
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', y)
                .attr('y2', y)
                .style('stroke', '#ccc');

            svg.selectAll('.barItem')
                .data(data)
                .enter().append('rect')
                .attr('class', 'barItem')
                .attr('x', function (d) {
                    return x(d.letter);
                })
                .attr('width', x.rangeBand())
                .attr('y', function (d) {
                    return y(d.frequency);
                })
                .attr('height', function (d) {
                    return height - y(d.frequency);
                })
                .attr('fill', function (d) {
                    var colorAlp = ((d.frequency / (max + min)) + 0.45).toFixed(2);
                    return 'rgba(' + options.color + colorAlp + ')';
                });
            /*.on('mouseover', function (d) {
             var xPosition = this.x.baseVal.value + this.width.baseVal.value / 2 + 45;
             var yPosition = this.height.baseVal.value + 110;

             d3.select(this)
             .attr({
             opacity: 0.5
             });

             tooltip.transition()
             .duration(200)
             .style('opacity', 1);

             tooltip.html('<div>' + d[nameLabel] + '</div><div>' + helpers.currencySplitter(d[valueLabel].toFixed(afterDot)) + symbol + '</div>')
             .style('left', xPosition + 'px')
             .style('bottom', yPosition + 'px');

             })
             .on('mouseleave', function () {
             d3.select(this)
             .attr({
             opacity: 1
             });

             tooltip.transition()
             .duration(500)
             .style('opacity', 0);
             });*/

            svg.selectAll('.hover')
                .data(data)
                .enter().append('rect')
                .attr('class', 'hover')
                .attr('x', function (d) {
                    return x(d.letter);
                })
                .attr('width', x.rangeBand())
                .attr('y', 0)
                .attr('height', height)
                .attr('fill', function (d) {
                    var colorAlp = ((d.frequency / (max + min)) + 0.45).toFixed(2);
                    return 'rgba(' + options.color + 0 + ')';
                })
                .on('mouseover', function (d) {
                    var xPosition = this.x.baseVal.value + this.width.baseVal.value / 2 + 45;
                    var yPosition = height - y(d.frequency) + 120;

                    if (yPosition < 0) {
                        yPosition = 120;
                    }

                    d3.select(this)
                        .attr({
                            opacity: 0.5
                        });

                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 1);

                    tooltip.html('<div>' + d[nameLabel] + '</div><div>' + helpers.currencySplitter(d[valueLabel].toFixed(afterDot)) + symbol + '</div>')
                        .style('left', xPosition + 'px')
                        .style('bottom', yPosition + 'px');

                })
                .on('mouseleave', function () {
                    d3.select(this)
                        .attr({
                            opacity: 1
                        });

                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });

        },

        render: function () {
            var self = this;
            this.$el.html(this.template({
                className: ''
            }));

            this.activateTabs();

            this.dateFilterView = new DateFilterView({
                contentType: 'reports',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.changeDateRange(self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', this.datesArray);
        }

    });
    return ContentView;
});


