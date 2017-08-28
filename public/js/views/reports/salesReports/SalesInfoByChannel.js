define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/reports/salesReports/InfoByChannelSalesTemplate.html',
    'text!templates/reports/salesReports/SalesByChannelTemplate.html',
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
        noNeedCreatedIn: true,

        el        : '#channelSales',
        events    : {
            'click .changeInfo'  : 'changeInfo',
            'click .scaleButtons': 'activateTabs'
        },
        initialize: function (options) {
            this.data = options.data;

            this.datesArray = options.datesArray;

            this.render();
        },

        changeInfo: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $target.attr('id') || 'gross_sales';

            $thisEl.find('.active').removeClass('active');
            $target.addClass('active');

            if (id === 'total_sales') {
                this.renderChart();
                this.activateTabs();
                return;
            }

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

            return $thisEl.find('.salesChannelLine').show();

        },

        changeDateRange: function (dateArray) {
            var self = this;
            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            dataService.getData('/reports/getInfoSalesByChannel', {
                startDate: this.startDate,
                endDate  : this.endDate
            }, function (resp) {
                self.data = resp.data;

                self.renderChart('gross_sales');
                self.activateTabs();
            });
        },

        renderChart: function (info) {
            var $thisEl = this.$el;
            var text = info === 'gross_sales' ? 'Gross Sales' : info === 'orders' ? 'Orders Quantity' : info === 'quantity' ? 'Quantity' : 'Total Sales';

            this.$el.find('.tableListWrap').html(this.tableTemplate({
                collection      : this.data,
                currencySplitter: helpers.currencySplitter
            }));

            $thisEl.find('.salesChannelLine ._dashLineItem').html('');
            $thisEl.find('.salesChannelUnits').html('');

            this.$el.find('.dashboard').text(text);

            this.renderLineGraphic(info);
        },

        renderLineGraphic: function (info) {
            var info = info || 'total_sales';
            var margin = {top: 20, right: 20, bottom: 30, left: 120};
            var container = $('.inner ');
            var width = container.width() - margin.left - margin.right;
            var height = 350 - margin.bottom - margin.top;
            var color = '51,77,151,';
            var max;
            var min;
            var x;
            var y;
            var xAxis;
            var yAxis;
            var svg;
            var tooltip;
            var valueLabel = 'frequency';
            var nameLabel = 'letter';
            var x2;
            var data = [];
            var symbol = info === 'quantity' || info === 'orders' ? ' ' : '$ ';
            var afterDot = info === 'quantity' || info === 'orders' ? 0 : 2;
            var infoY = info === 'total_sales' || info === 'gross_sales' ? 'Sales' : 'Quantity';

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
                .orient('left')
                .tickFormat(d3.format('s'));

            svg = d3.select('.salesChannelLine ._dashLineItem').append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            this.data.forEach(function (d) {

                data.push({
                    frequency: d[info],
                    letter   : d._id
                });
            });

           /* data = data.sort(function (a, b) {
                return d3.descending(a.frequency, b.frequency);
            })
                .map(function (d) {
                    return {
                        frequency: d.frequency,
                        letter   : d.letter
                    };
                });*/

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

            tooltip = d3.select('.salesChannelLine')
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
                .attr('transform', 'translate(' + -30 + ' ,' + -10 + ')')
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
                    var colorAlp = 1; // ((d.frequency / (max + min)) + 0.45).toFixed(2);
                    return 'rgba(' + color + colorAlp + ')';
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
                    return 'rgba(' + color + 0 + ')';
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
            this.$el.html(this.template({}));

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


