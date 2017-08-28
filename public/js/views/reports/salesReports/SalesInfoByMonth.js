define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/reports/salesReports/InfoByMonthSalesTemplate.html',
    'text!templates/reports/salesReports/SalesByMonthTemplate.html',
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

        el: '#monthSales',

        events: {
            'click .changeInfo'  : 'changeInfo',
            'click .scaleButtons': 'activateTabs'
        },

        initialize: function (options) {
            this.data = options.data;
            this.datesArray = options.datesArray;

            this.activateTabs();

            this.render();
        },

        changeInfo: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $target.attr('id');

            $thisEl.find('.active').removeClass('active');
            $target.addClass('active');

            if (id === 'total_sales') {
                this.activateTabs();
                this.renderChart();
                return;
            }

            this.activateTabs();
            this.renderChart(id);
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

            return $thisEl.find('.salesMonthLine').show();

        },

        changeDateRange: function (dateArray) {
            var self = this;
            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            dataService.getData('/reports/getInfoSalesByMonth', {
                startDate: this.startDate,
                endDate  : this.endDate
            }, function (resp) {
                self.data = resp.data;

                self.activateTabs();
                self.renderChart();
            });
        },

        getMonth: function (index) {
            index = parseInt(index, 10);

            switch (index) {
                case 1:
                    return 'January';
                case 2:
                    return 'February';
                case 3:
                    return 'March';
                case 4:
                    return 'April';
                case 5:
                    return 'May';
                case 6:
                    return 'June';
                case 7:
                    return 'July';
                case 8:
                    return 'August';
                case 9:
                    return 'September';
                case 10:
                    return 'October';
                case 11:
                    return 'November';
                case 12:
                    return 'December';
                // skip default;
            }
        },

        renderChart: function (info) {
            var $thisEl = this.$el;
            var text = info === 'gross_sales' ? 'Gross Sales' : info === 'data' ? 'Orders Quantity' : 'Total Sales';

            this.$el.find('.tableListWrap').html(this.tableTemplate({
                collection      : this.data,
                currencySplitter: helpers.currencySplitter,
                moment          : moment,
                className       : ''
            }));

            $thisEl.find('.salesMonthLine ._dashLineItem').html('');
            $thisEl.find('.salesMonthUnits').html('');

            this.$el.find('.dashboard').text(text);

            this.renderLineGraphic(info);
        },

        renderLineGraphic: function (info) {
            var info = info || 'total_sales';
            var margin = {top: 20, right: 20, bottom: 30, left: 120};
            var container = $('.inner ');
            var width = container.width() - margin.left - margin.right;
            var height = 350 - margin.bottom - margin.top;
            var symbol = info === 'total_sales' || info === 'gross_sales' ? '$ ' : ' ';
            var afterDot = info === 'total_sales' || info === 'gross_sales' ? 2 : 0;
            var max;
            var min;
            var tooltip;
            var valueLabel = 'frequency';
            var nameLabel = 'letter';
            var color = '51,77,151,';
            var self = this;
            var format;
            var x;
            var y;
            var xAxis;
            var yAxis;
            var svg;
            var data = [];
            var convertedDate;
            var formatDate;
            var infoY = info === 'total_sales' || info === 'gross_sales' ? 'Sales' : 'Quantity';

            if (!this.data || !this.data.length) {
                return;
            }

            if (this.data && this.data.length && ((container.width() / this.data.length) < 130)) {
                width = (this.data.length * 160) - margin.left - margin.right;
            }

            x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1, 1);

            y = d3.scale.linear()
                .range([height, 0]);

            xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .tickFormat(function (d) {
                    return format(d);
                });

            yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .tickFormat(d3.format('s'));

            svg = d3.select('.salesMonthLine ._dashLineItem').append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            format = function (d) {
                if (isNaN((new Date(d)).getFullYear())) {
                    return 'Invalid Date';
                }
                return self.getMonth((new Date(d)).getMonth() + 1) + ', ' + (new Date(d)).getFullYear();
            };

            formatDate = function (month, year) {
                return self.getMonth(month) + ', ' + year;
            };

            this.data.forEach(function (d) {
                convertedDate = formatDate(d._id.toString().substr(4), d._id.toString().substr(0, 4));

                data.push({
                    frequency: d[info],
                    timestamp: d._id,
                    letter   : convertedDate
                });
            });

            data = data.sort(function (a, b) {
                return d3.ascending(a.timestamp, b.timestamp);
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
                return format(d.letter);
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

            y.domain([0, max]);

            tooltip = d3.select('.salesMonthLine')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (height) + ')')
                .call(xAxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end');

            svg.append('text')
                .attr('class', 'axisTitle')
                .attr('transform', 'translate(' + -30 + ' ,' + -10 + ')')
                .text(infoY);

            svg.selectAll('line.y')
                .data(y.ticks())
                .enter().append('line')
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


