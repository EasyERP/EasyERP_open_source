define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/customDashboard/tools/ChartTemplate.html',
    'dataService',
    'constants',
    'async',
    'd3',
    'custom',
    'moment',
    'common'
], function (Backbone, $, _, template, dataService, CONSTANTS, async, d3, custom, moment, common) {
    'use strict';

    var View = Backbone.View.extend({

        template: _.template(template),

        initialize: function (options) {
            this.options = options;
            this.width = this.$el.width();
            this.height = this.$el.height() - 40;
            this.margin = {
                top   : 10,
                left  : 35,
                bottom: 55,
                right : 40
            };
            this.id = '#' + this.$el.attr('id');
            this.render();
        },

        renderLineChart: function (data, xLabel, yLabel, textObj) {
            var self = this;

            var minX = d3.min(data, function (d) {
                return d[xLabel];
            });

            var maxX = d3.max(data, function (d) {
                return d[xLabel];
            });

            var chart = d3.select(self.id).select('svg');
            var margin = {
                top   : 20,
                left  : 60,
                bottom: 60,
                right : 60
            };

            var width = parseInt(this.width, 10) - margin.left - margin.right;
            var height = parseInt(this.height, 10) - margin.top - margin.bottom;
            var g = chart.append('g')
                .attr({
                    transform: 'translate(' + margin.left + ',' + margin.top + ')'
                });

            var xScale = d3.scale.linear()
                .range([0, width])
                .domain([minX, maxX]);

            var yScale = d3.scale.linear()
                .range([height, 0])
                .domain([0, Math.ceil(d3.max(data,
                        function (d) {
                            return d[yLabel];
                        }) / 10) * 10]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(5);

            var line = d3.svg.line()
                .x(function (d) {
                    return xScale(d[xLabel]);
                })
                .y(function (d) {
                    return yScale(d[yLabel]);
                });

            g.append('path')
                .attr({
                    class         : 'lineCustom',
                    d             : line(data),
                    stroke        : '#4db7da',
                    'stroke-width': 2,
                    fill          : 'none'
                });

            g.append('g')
                .attr({
                    class    : 'x axis',
                    transform: 'translate(0,' + height + ')'
                })
                .call(xAxis);

            g.append('g')
                .attr({
                    class: 'y axis'
                })
                .call(yAxis)
                .select('path');

            chart.append('text')
                .attr({
                    class        : 'y label',
                    'text-anchor': 'middle',
                    x            : width / 2 + margin.left,
                    y            : height + margin.left
                })
                .text(textObj.xAxisLabel);

            chart.append('text')
                .attr({
                    class        : 'y label',
                    'text-anchor': 'middle',
                    transform    : 'rotate(-90,' + (margin.left / 2) + ',' + (height / 2 + margin.top) + ')',
                    x            : margin.left / 2,
                    y            : height / 2 + margin.top
                })
                .text(textObj.yAxisLabel);

            chart.selectAll('.x.axis line')
                .style({
                    stroke: '#f2f2f2'
                });

            chart.selectAll('.y.axis line')
                .attr({
                    x2: width
                });
        },

        renderVerticalBarChart: function (data, xLabel, yLabel, textObj) {
            var self = this;
            var $svg = this.$el.closest(this.id);
            var outerWidth = parseInt($svg.find('.panel-heading').width(), 10);
            var minX = d3.min(data, function (d) {
                return d[xLabel];
            });

            var maxX = d3.max(data, function (d) {
                return d[xLabel];
            });

            var chart = d3.select(self.id).select('svg')
                .attr({
                    width: outerWidth + 'px'
                });
            var margin = {
                top   : 20,
                left  : 60,
                bottom: 100,
                right : 60
            };

            var width = outerWidth - margin.left - margin.right;
            var height = parseInt($svg.height(), 10) - margin.top - margin.bottom;
            var g = chart.append('g')
                .attr({
                    transform: 'translate(' + margin.left + ',' + margin.top + ')'
                });

            var barWidth = width / data.length;

            var xScale = d3.scale.linear()
                .range([0, width])
                .domain([minX, maxX]);

            var yScale = d3.scale.linear()
                .range([height, 0])
                .domain([0, Math.ceil(d3.max(data,
                        function (d) {
                            return d[yLabel];
                        }) / 10) * 10]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(5);

            g.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr({
                    class: 'rect',
                    x    : function (d) {
                        return xScale(d[xLabel]);
                    },

                    y: function (d) {
                        return height - yScale(d[yLabel]);
                    },

                    width : (barWidth - 1),
                    height: function (d) {
                        return yScale(d[yLabel]);
                    },

                    fill: '#4db7da'
                });

            g.append('g')
                .attr({
                    class    : 'x axis',
                    transform: 'translate(' + barWidth / 2 + ',' + height + ')'
                })
                .call(xAxis);

            g.append('g')
                .attr({
                    class: 'y axis'
                })
                .call(yAxis)
                .select('path');

            chart.append('text')
                .attr({
                    class        : 'y label',
                    'text-anchor': 'middle',
                    x            : width / 2 + margin.left,
                    y            : height + margin.left
                })
                .text(textObj.xAxisLabel);

            chart.append('text')
                .attr({
                    class        : 'y label',
                    'text-anchor': 'middle',
                    transform    : 'rotate(-90,' + (margin.left / 2) + ',' + (height / 2 + margin.top) + ')',
                    x            : margin.left / 2,
                    y            : height / 2 + margin.top
                })
                .text(textObj.yAxisLabel);

            chart.selectAll('.y.axis line')
                .attr({
                    x2: width + barWidth
                });
        },

        renderHorizontalBarChart: function (data, xLabel, yLabel, textObj) {
            var self = this;
            var $svg = this.$el.closest(this.id);
            var offset = 2;
            var margin = {
                top   : 20,
                left  : 160,
                bottom: 120,
                right : 60
            };
            var maxX = Math.ceil(d3.max(data,
                    function (d) {
                        return d[xLabel];
                    }) / 100);
            var width = parseInt($svg.width(), 10) - margin.left - margin.right;
            var height = parseInt($svg.height(), 10) - margin.top - margin.bottom;
            var chart = d3.select(self.id).select('svg');
            var g = chart.append('g')
                .attr({
                    transform: 'translate(' + margin.left + ',' + margin.top + ')'
                });
            var barWidth = height / data.length;

            var xScale = d3.scale.linear()
                .range([0, width])
                .domain([0, maxX]);

            var yScale = d3.scale.linear()
                .range([height, 0])
                .domain([0, data.length]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickSize(0)
                .tickPadding(offset)
                .tickFormat(function (d, i) {
                    return data[i]._id;
                })
                .tickValues(d3.range(data.length));

            function sortData(a, b) {

                if (a[xLabel] > b[xLabel]) {
                    return 1;
                }
                if (a[xLabel] < b[xLabel]) {
                    return -1;
                }

                return 0;
            }

            data.sort(sortData);

            g.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr({
                    x: function () {
                        return xScale(0);
                    },

                    y: function (d, i) {
                        return yScale(i) + offset;
                    },

                    width: function (d) {
                        return xScale(d[xLabel] / 100);
                    },

                    height: barWidth - 2 * offset,
                    fill  : '#4db7da'
                });

            g.append('g')
                .attr({
                    class    : 'x axis',
                    transform: 'translate(0,' + (height + barWidth) + ')'
                })
                .call(xAxis);

            g.append('g')
                .attr({
                    class    : 'y axis',
                    transform: 'translate(0,' + (barWidth / 2) + ')'
                })
                .call(yAxis)
                .select('path');

            chart.append('text')
                .attr({
                    class        : 'y label',
                    'text-anchor': 'middle',
                    x            : width / 2 + margin.left,
                    y            : height + margin.bottom - 2 * margin.top
                })
                .text(textObj.xAxisLabel);

            chart.append('text')
                .attr({
                    class        : 'y label',
                    'text-anchor': 'middle',
                    transform    : 'rotate(-90,' + (20) + ',' + (height / 2 + margin.top) + ')',
                    x            : 20,
                    y            : height / 2 + margin.top
                })
                .text(textObj.yAxisLabel);

            chart.selectAll('.x.axis line')
                .attr({
                    y2: -height
                })
                .style({
                    stroke: '#f2f2f2'
                });
        },

        renderDonutChart: function (data, valueLabel, nameLabel) {
            var $svgHolder = this.$el.closest(this.id);
            var width = parseInt($svgHolder.width(), 10);
            var height = parseInt($svgHolder.height() - 40, 10);
            var color = d3.scale.ordinal()
                .range(['#4db7da', '#e36028', '#ffb128', '#51a87a', '#47d2d3', '#e485b2', '#f5964c']);
            var totalValue = 0;
            var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    totalValue += d[valueLabel];
                    return d[valueLabel];
                });
            var arcGroup;
            var radius = Math.min(width, height) / 2;
            var self = this;
            var tooltip;
            var arc = d3.svg.arc()
                .outerRadius(radius * 0.85)
                .innerRadius(radius * 0.55);
            var svg;
            var g;

            svg = d3.select(self.id).select('svg');

            tooltip = svg.append('text')
                .attr({
                    class: 'infoLabel',
                    x    : 10,
                    y    : 20
                })
                .style('display', 'none');

            g = svg.append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            arcGroup = g.selectAll('.arc')
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class', 'arc')
                .on('mouseover', function (d) {
                    d3.select(this)
                        .attr({
                            opacity: 0.5
                        });

                    tooltip
                        .transition()
                        .duration(300)
                        .style('display', 'block')
                        .text(d.data[nameLabel] + ': ' + (d.data[valueLabel] / 100).toFixed(2) + '$');

                })
                .on('mouseleave', function () {
                    d3.select(this)
                        .attr({
                            opacity: 1
                        });

                    tooltip.transition()
                        .duration(200)
                        .style('display', 'none');
                });

            arcGroup.append('path')
                .attr({
                    d: arc
                })
                .style({
                    fill: function (d, i) {
                        return color(i);
                    }
                });

            svg.append('text')
                .text('Total')
                .attr({
                    class      : '_label',
                    fill       : color(4),
                    'font-size': '14px',

                    x: function () {
                        return width / 2 - d3.select(this).node().getBBox().width / 2;
                    },

                    y: height / 2 - 15
                });

            svg.append('text')
                .text((totalValue / 100).toFixed(2) + '$')
                .attr({
                    class        : '_valueLabel',
                    fill         : color(4),
                    'font-size'  : '18px',
                    'font-weight': 'bold',

                    x: function () {
                        return width / 2 - d3.select(this).node().getBBox().width / 2;
                    },

                    y: height / 2 + 15
                });
        },

        renderSingleValue: function () {},

        renderHorizontalBarLayout: function (data, keys, textObj) {
            var offset = 2;
            var self = this;
            var $svg = this.$el.closest(this.id);
            var chart = d3.select(self.id).select('svg');
            var margin = {
                top   : 20,
                left  : 150,
                bottom: 100,
                right : 60
            };

            var width = parseInt($svg.width(), 10) - margin.left - margin.right;
            var height = parseInt($svg.height(), 10) - margin.top - margin.bottom;
            var g = chart.append('g')
                .attr({
                    transform: 'translate(' + margin.left + ',' + margin.top + ')'
                });

            var yScale = d3.scale.ordinal()
                .rangeRoundBands([height, 0], 0.35);

            var xScale = d3.scale.linear()
                .rangeRound([0, width]);

            var color = d3.scale.ordinal()
                .range(['#4db7da', '#e36028', '#ffb128', '#51a87a', '#47d2d3', '#e485b2', '#f5964c']);

            var dataIntermediate = keys.map(function (c) {
                return data.map(function (d) {
                    return {y: d[c], x: d.source};
                });
            });

            var dataStackLayout = d3.layout.stack()(dataIntermediate);

            var layer = g.selectAll('.stack')
                .data(dataStackLayout)
                .enter()
                .append('g')
                .attr('class', 'stack')
                .style('fill', function (d, i) {
                    return color(i);
                });

            var xAxis;
            var yAxis;

            xScale.domain([0, d3.max(dataStackLayout[dataStackLayout.length - 1],
                function (d) {
                    return d.y0 + d.y;
                })
            ])
                .nice();

            yScale.domain(dataStackLayout[0].map(function (d) {
                return d.x;
            }));

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickSize(0)
                .tickPadding(offset)
                .tickFormat(function (d, i) {
                    return data[i].source;
                });

            layer.selectAll('rect')
                .data(function (d) {
                    return d;
                })
                .enter()
                .append('rect')
                .attr({
                    x: function (d) {
                        return xScale(d.y0);
                    },

                    y: function (d) {
                        return yScale(d.x);
                    },

                    height: yScale.rangeBand(),

                    width: function (d) {
                        return xScale(d.y);
                    }
                });

            g.append('g')
                .attr({
                    class    : 'x axis',
                    transform: 'translate(0,' + (height) + ')'
                })
                .call(xAxis);

            g.append('g')
                .attr({
                    class    : 'y axis',
                    transform: 'translate(0,0)'
                })
                .call(yAxis)
                .select('path');

            chart.append('text')
                .attr({
                    class        : 'y label',
                    'text-anchor': 'middle',
                    x            : width / 2 + margin.left,
                    y            : height + margin.bottom - 2 * margin.top
                })
                .text(textObj.xAxisLabel);

            chart.append('text')
                .attr({
                    class        : 'y label',
                    'text-anchor': 'middle',
                    transform    : 'rotate(-90,' + (20) + ',' + (height / 2 + margin.top) + ')',
                    x            : 20,
                    y            : height / 2 + margin.top
                })
                .text(textObj.yAxisLabel);

            chart.selectAll('.x.axis line')
                .attr({
                    y2: -height
                })
                .style({
                    stroke: '#f2f2f2'
                });
        },

        render: function () {
            var height = parseFloat(this.$el.height()) - parseFloat(this.$el.find('.panel-heading').height()) + 'px';
            var width = this.$el.width() + 'px';
            var self = this;
            var chartObj;

            this.$el.find('.chartHolder').append(this.template({
                width : width,
                height: height
            }));

            chartObj = {

                line: {
                    invoiceByWeek: function () {
                        common.getinvoiceByWeek({
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            self.renderLineChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Invoice'
                            });
                        });
                    }
                },

                horizontalBar: {

                    revenueBySales: function () {
                        common.getRevenueBySales({
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Sales Manager'
                            });
                        });
                    },

                    revenueByCountry: function () {
                        common.getRevenueByCountry({
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });
                    },

                    revenueByCustomer: function () {
                        common.getRevenueByCustomer({
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Customer'
                            });
                        });
                    }
                },

                verticalBar: {
                    invoiceByWeek: function () {
                        common.getinvoiceByWeek({
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            self.renderLineChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Invoice'
                            });
                        });
                    }
                },

                donut: {

                    revenueBySales: function () {
                        common.getRevenueBySales({
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });
                    },

                    revenueByCountry: function () {
                        common.getRevenueByCountry({
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });
                    },

                    revenueByCustomer: function () {
                        common.getRevenueByCustomer({
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });
                    }
                },
                singleValue        : {},
                horizontalBarLayout: {
                    leadsBySource: function () {
                        common.getLeadsForChart('source', {
                            startDay: self.options.startDate,
                            endDay  : self.options.endDate
                        }, function (data) {
                            var sources = _.uniq(_.pluck(data, 'source'));
                            var newData = [];
                            var j;
                            var i;

                            for (i = sources.length; i--;) {
                                newData.push({
                                    source: sources[i],
                                    total : 0,
                                    isOpp : 0
                                });
                            }

                            for (i = data.length; i--;) {

                                for (j = newData.length; j--;) {

                                    if (newData[j].source === data[i].source) {

                                        if (data[i].isOpp) {
                                            newData[j].isOpp += data[i].count;
                                        } else {
                                            newData[j].total += data[i].count;
                                        }
                                    }
                                }
                            }

                            self.renderHorizontalBarLayout(newData, ['isOpp', 'total'], {
                                xAxisLabel: '',
                                yAxisLabel: 'Source'
                            });
                        });
                    }
                },

                verticalBarLayout: {}
            };

            chartObj[this.options.type][this.options.dataSelect]();
        }
    });

    return View;
});
