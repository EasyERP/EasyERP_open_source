define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/customDashboard/tools/ChartTemplate.html',
    'text!templates/customDashboard/tools/TableTemplate.html',
    'text!templates/customDashboard/tools/SingleTemplate.html',
    'dataService',
    'constants',
    'async',
    'd3',
    'custom',
    'moment',
    'common',
    'helpers'
], function (Backbone, $, _, template, tableTemplate, singleTemplate, dataService, CONSTANTS, async, d3, custom, moment, common, helpers) {
    'use strict';

    var View = Backbone.View.extend({

        template      : _.template(template),
        tableTemplate : _.template(tableTemplate),
        singleTemplate: _.template(singleTemplate),

        initialize: function (options) {
            this.options = options;
            this.width = this.$el.width();
            this.height = this.$el.height() - 40;
            this.cellsModel = options.cellsModel;
            this.limitCells = options.limitCells;
            this.xPoints = options.xPoints;
            this.yPoints = options.yPoints;
            this.selfEl = options.selfEl;
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
            var height = parseInt(this.height, 10) - margin.top - margin.bottom * 2;
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
            var height = parseInt($svg.height(), 10) - margin.top - margin.bottom - 50;
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
                top   : 160,
                left  : 160,
                bottom: 120,
                right : 60
            };
            var maxX = Math.ceil(d3.max(data,
                    function (d) {
                        return d[xLabel];
                    }) / 100);
            var width = parseInt(/*$svg.width()*/$svg.css('width'), 10) - margin.left - margin.right;
            var height = parseInt(/*$svg.height()*/$svg.css('height'), 10) - margin.top - margin.bottom - 30;
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
                .call(xAxis)
                .selectAll("text")
                .attr("transform", "rotate(45)");

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
            var height = parseInt($svgHolder.height() - 40, 10) - 50;
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
                        .text(d.data[nameLabel] ? (d.data[nameLabel] + ': $ ' + helpers.currencySplitter((d.data[valueLabel] / 100).toFixed(2))) : '$ ' + helpers.currencySplitter((d.data[valueLabel] / 100).toFixed(2)));

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
                .text('$ ' + helpers.currencySplitter((totalValue / 100).toFixed(2)))
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

        renderHorizontalBarLayout: function (data, keys, textObj) {
            var offset = 2;
            var self = this;
            var $svg = this.$el.closest(this.id);
            var chart = d3.select(self.id).select('svg');
            var margin = {
                top   : 20,
                left  : 150,
                bottom: 150,
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

        renderTable: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text : 'Date',
                field: 'invoiceDate'
            }, {
                text    : 'Customer',
                field   : 'supplier',
                subField: 'name'
            }, {
                text    : 'Amount',
                field   : 'paymentInfo',
                subField: 'total'
            }];

            if ($svg.width() < 400) {
                if ($svg.find('.notResize').length) {
                    $svg.width('400px');
                    this.$el.attr('data-width', 2);
                    this.markEngagedCells();
                } else {
                    $svg.height('388px');
                    this.$el.attr('data-height', 2);
                    this.markEngagedCells();
                }
            }

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        markEngagedCells: function () {
            var newEngagedCells = [];
            var self = this;

            $('.panel').each(function () {
                var xIndex = self.xPoints.indexOf(parseFloat($(this).attr('data-x')));
                var yIndex = self.yPoints.indexOf(parseFloat($(this).attr('data-y')));
                var panelWidth = parseInt($(this).attr('data-width'), 10);
                var panelHeight = parseInt($(this).attr('data-height'), 10);
                var xIndexVal = xIndex + panelWidth;
                var yIndexVal = yIndex + panelHeight;
                var dataIndex = [];
                var i;
                var j;

                for (i = xIndex; i < xIndexVal; i++) {

                    for (j = yIndex; j < yIndexVal; j++) {
                        dataIndex.push(i + '' + j);
                        newEngagedCells.push(i + '' + j);
                    }
                }

                $(this).attr('data-index', dataIndex);
            });

            this.cellsModel.set({engagedCells: (this.limitCells.slice(0)).concat(newEngagedCells)});
        },

        renderTableOverview: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response && response.data ? response.data : response;
            var columns = [];
            var totalCount;
            var totalRevenue;
            var totalCountSum = 0;
            var totalRevenueSum = 0;
            var totalStatusCount = 0;
            var secondRow = [];
            var statusObject = {
                allocateStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                },

                fulfillStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                },

                shippingStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                }
            };

            data.forEach(function (el) {
                totalCountSum += el.count;
                totalRevenueSum += el.total;

                if (el.status && el.status.length) {
                    totalStatusCount++;
                    el.status.forEach(function (stat) {
                        statusObject.allocateStatus[stat.allocateStatus] += 1;
                        statusObject.fulfillStatus[stat.fulfillStatus] += 1;
                        statusObject.shippingStatus[stat.shippingStatus] += 1;
                    });
                }

            });

            if ($svg.width() < 400) {
                $svg.width('400px');
                this.$el.attr('data-width', 4);
                this.markEngagedCells();
            }

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : true,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

            totalCount = $svg.find('.totalCount');
            totalRevenue = $svg.find('.totalRevenue');

            if (totalStatusCount) {
                secondRow = [{
                    name : 'Allocated',
                    value: statusObject.allocateStatus
                }, {
                    name : 'Fulfilled',
                    value: statusObject.fulfillStatus
                }, {
                    name : 'Shipped',
                    value: statusObject.shippingStatus
                }];

                $svg.find('.allocated').text(helpers.currencySplitter(statusObject.allocateStatus.ALL.toFixed()));
                $svg.find('.fulfilled').text(helpers.currencySplitter(statusObject.fulfillStatus.ALL.toFixed()));
                $svg.find('.shipped').text(helpers.currencySplitter(statusObject.shippingStatus.ALL.toFixed()));

                $svg.find('.status div').removeClass('hidden');
            }

            totalCount.text(helpers.currencySplitter(totalCountSum.toFixed()));
            totalRevenue.text(helpers.currencySplitter(totalRevenueSum.toFixed(2)));

        },

        renderSingleValue: function (response, title) {
            var $svg = this.$el.closest(this.id);

            if ($svg.width() < 400) {
                $svg.width('400px');
                //$svg.height('100px');
                this.$el.attr('data-width', 4);
                // this.$el.attr('data-height', 1);
                this.markEngagedCells();
            }

            $svg.find('.chartHolder').html(this.singleTemplate({
                data: {
                    revenue: response.total || 0,
                    count  : response.count || 0
                },

                title           : title,
                currencySplitter: helpers.currencySplitter
            }));
        },

        setHref: function (href) {
            var ref = '#easyErp/' + href;
            this.$el.find('#viewAll').attr('href', ref);
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
                        var _opts = self.options;
                        var filter = {
                            date: {

                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, true, function (data) {
                            self.renderLineChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Invoice'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseInvoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, false, function (data) {
                            self.renderLineChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('purchaseInvoices');
                    }
                },

                horizontalBar: {

                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Sales Manager'
                            });
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Customer'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Sales Manager'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Customer'
                            });
                        });

                        self.setHref('invoice');
                    }
                },

                verticalBar: {
                    invoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, true, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Invoice'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseInvoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, false, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('purchaseInvoices');
                    }
                },

                donut: {
                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    }
                },

                singleValue: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueForSingle(filter, false, function (data) {
                            self.renderSingleValue(data, 'Purchase Orders');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueForSingle(filter, true, function (data) {
                            self.renderSingleValue(data, 'Sales Orders');
                        });

                        self.setHref('invoice');
                    }
                },

                horizontalBarLayout: {
                    leadsBySource: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsForChart('source', filter, function (data) {
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

                        self.setHref('Leads');
                    }
                },

                verticalBarLayout: {},

                overview: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoiceByWorkflows(filter, false, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoiceByWorkflows(filter, true, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseOrders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrdersByWorkflows(filter, false, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('purchaseOrders');
                    },

                    orders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrdersByWorkflows(filter, true, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('order');
                    }

                },

                table: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoices(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoices(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    pastDuePurchaseInvoices: function () {
                        var _opts = self.options;
                        var filter = {
                            date   : {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            },
                            pastDue: true
                        };

                        common.getInvoices(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    pastDueInvoices: function () {
                        var _opts = self.options;
                        var filter = {
                            date   : {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            },
                            pastDue: true
                        };

                        common.getInvoices(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseOrders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrders(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseOrders');
                    },

                    orders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrders(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('order');
                    }
                }
            };

            chartObj[this.options.type][this.options.dataSelect]();
        }
    });

    return View;
});
