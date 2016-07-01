define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Dashboard/DashboardTemplate.html',
    'collections/Filter/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'collections/Opportunities/OpportunitiesCollection',
    'd3',
    'common',
    'dataService',
    'helpers',
    'moment',
    'topojson'
], function (Backbone, $, _, DashboardTemplate, filterValuesCollection, workflowsCollection, OpportunitiesCollection, d3, common, dataService, helpers, moment, topojson) {
    var ContentView = Backbone.View.extend({
        contentType: 'Dashboard',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',
        initialize : function (options) {
            this.startTime = options.startTime;
            this.startTime = new Date();
            this.buildTime = 0;
            this.dateRange = {
                date                  : 30,
                source                : 30,
                opportunitie          : 30,
                sale                  : 7,
                opportunitieConversion: 90,
                winLost               : 30
            };

            this.dateItem = {
                date   : 'D',
                winLost: 'D'
            };
            this.numberToDate = {};
            this.source = null;

            this.resizeHandler = _.debounce(this.resizeHandler, 500);
            this.resizeHandler = this.resizeHandler.bind(this);

            this.render();
        },

        events: {
            'click .choseDateRange .item': 'newRange',
            'click .choseDateItem .item' : 'newItem',
            'click .chart-tabs a'        : 'changeTab'
        },

        changeTab: function (e) {
            var n;

            $(e.target).closest('.chart-tabs').find('a.active').removeClass('active');
            $(e.target).addClass('active');
            n = $(e.target).parents('.chart-tabs').find('li').index($(e.target).parent());
            $('.chart-tabs-items').find('.chart-tabs-item.active').removeClass('active');
            $('.chart-tabs-items').find('.chart-tabs-item').eq(n).addClass('active');
        },

        newRange: function (e) {
            var $parent = $(e.target).closest('.choseDateRange');
            var type = $parent.attr('data-type');

            $(e.target).parent().find('.active').removeClass('active');
            $(e.target).addClass('active');

            this.dateRange[type] = $(e.target).data('day');

            switch (type) {
                case 'date':
                    this.renderPopulate();
                    break;
                case 'source':
                    this.renderPopulateByType(this, type);
                    break;
                case 'sale':
                    this.renderPopulateByType(this, type);
                    break;
                case 'opportunitie':
                    this.renderOpportunities();
                    break;
                case 'opportunitieConversion':
                    this.renderOpportunitiesConversion();
                    break;
                case 'winLost':
                    this.renderOpportunitiesWinAndLost();
                    break;
                case 'salesByCountry':
                    this.renderSalesByCountry();
                    break;
                // skip default;
            }
        },

        newItem: function (e) {
            var $parent = $(e.target).closest('.choseDateItem');
            var type = $parent.attr('data-type');

            $(e.target).parent().find('.active').removeClass('active');
            $(e.target).addClass('active');

            this.dateItem[type] = $(e.target).data('item');

            switch (type) {
                case 'date':
                    this.renderPopulate();
                    break;
                case 'source':
                    this.renderPopulateByType(this, type);
                    break;
                case 'sale':
                    this.renderPopulateByType(this, type);
                    break;
                case 'opportunitie':
                    this.renderOpportunities();
                    break;
                case 'winLost':
                    this.renderOpportunitiesWinAndLost();
                    break;
                // skip default;
            }
        },

        getDateFromDayOfYear: function (index) {
            // return dateFormat(new Date(this.numberToDate[index]).toString('MMMM ,yyyy'), 'mmmm dd, yyyy');
            return moment(new Date(this.numberToDate[index])).format('MMM DD, YYYY');
        },

        getDay: function (index) {
            switch (index) {
                case 1:
                    return 'Monday';
                case 2:
                    return 'Tuesday';
                case 3:
                    return 'Wednesday';
                case 4:
                    return 'Thursday';
                case 5:
                    return 'Friday';
                case 6:
                    return 'Saturday';
                case 7:
                    return 'Sunday';
                // skip default;
            }
        },

        getMonth: function (index) {
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

        resizeHandler: function () {
            var self = this;

            self.renderPopulate();

            self.renderPopulateByType(self, 'source');
            self.renderPopulateByType(self, 'sale');
            self.renderOpportunities();
            self.renderOpportunitiesWinAndLost();
            self.renderOpportunitiesConversion();
            self.renderOpportunitiesAging();
            self.renderSalesByCountry();

            if ($(window).width() < 1370) {
                $('.legend-box').css('margin-top', '10px');
            } else {
                $('.legend-box').css('margin-top', '-39px');
            }
        },

        render: function () {
            var self = this;
            this.$el.html(this.template());
            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');
            $(window).unbind('resize').resize(self.resizeHandler);
        },

        renderPopulateByType: function (that, type) {
            var self = this;
            var chartClass = '.' + type + 'sChart';
            var dateRange = self.dateRange[type];
            var scaleArray;

            if (that) {
                self = that;
            }

            $(chartClass).empty();
            common.getLeadsForChart(type, dateRange, self.dateItem, function (data) {
                $('#timeBuildingDataFromServer').text('Server response in ' + self.buildTime + ' ms');

                if (type === 'sale') {
                    data.map(function (el) {
                        el.source = el.source || 'No User';
                        return el;
                    });
                }

                scaleArray = data.map(function (d) {
                    return d.source;
                });

                var margin = {top: 20, right: 160, bottom: 30, left: 160},
                    width = $('#wrapper').width() - margin.left - margin.right,
                    height = scaleArray.length * 40;

                var y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.3);

                var x = d3.scale.linear()
                    .range([width, 0]);

                var x2 = d3.scale.linear()
                    .range([0, width]);

                var xAxis = d3.svg.axis()
                    .scale(x2)
                    .orient('bottom');

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                var chart = d3.select(chartClass)
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                y.domain(scaleArray);
                x.domain([0, d3.max(data, function (d) {
                    return d.count;
                }) + 10]);
                x2.domain([0, d3.max(data, function (d) {
                    return d.count;
                }) + 10]);

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                var data1 = _.filter(data, function (item) {
                    return item.isOpp;
                });
                var data2 = _.filter(data, function (item) {
                    return !item.isOpp;
                });
                for (var i = 0; i < data1.length; i++) {
                    for (var j = 0; j < data2.length; j++) {
                        if (data1[i].source == data2[j].source) {
                            break;
                        }
                    }
                }

                chart.selectAll('.bar2')
                    .data(data2)
                    .enter().append('rect')
                    .attr('class', 'bar2')
                    .attr('x', function (d) {
                        return 0;
                    })
                    .attr('y', function (d) {
                        return y(d.source);
                    })
                    .attr('height', y.rangeBand())
                    .attr('width', function (d) {
                        return width - x(d.count);
                    });

                chart.selectAll('.bar')
                    .data(data1)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', function (d) {
                        return 0;
                    })
                    .attr('y', function (d) {
                        return y(d.source);
                    })
                    .attr('height', y.rangeBand())
                    .attr('width', function (d) {
                        return width - x(d.count);
                    });

                chart.selectAll('.x .tick line')
                    .data(data)
                    .attr('y2', function (d) {
                        return -height;
                    });

            });
        },

        renderOpportunitiesConversion: function () {
            var self = this;

            common.getOpportunitiesConversionForChart(this.dateRange.opportunitieConversion, this.dateItem, function (result) {
                var data;
                var margin;
                var formatxAxis;
                var percentScale;
                var x;
                var x2;
                var y;
                var max;
                var xAxis2;
                var xAxis;
                var yAxis;
                var chart;
                var width;
                var height;

                data = _.sortBy(result, function (d) {
                    return -(d.wonSum + d.lostSum);
                });

                margin = {
                    top   : 120,
                    right : 10,
                    bottom: 80,
                    left  : 200
                };

                width = $('#wrapper').width() - margin.left - margin.right;
                height = 40 * data.length;

                formatxAxis = d3.format('.0f');

                y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.3);

                x = d3.scale.linear()
                    .range([0, width - margin.left]);

                x2 = d3.scale.linear()
                    .range([0, width - margin.left]);

                max = d3.max(data, function (d) {
                    return (d.wonSum + d.lostSum);
                });

                max += 1000;

                y.domain(data.map(function (d) {
                    return d.sale;
                }));
                x.domain([0, 100]);
                x2.domain([0, max]);

                xAxis2 = d3.svg.axis()
                    .scale(x2)
                    .orient('top')
                    .tickFormat(function (d) {
                        return '$' + d / 1000 + 'k';
                    });

                percentScale = x2.ticks().map(function (val, i, col) {
                    return (100 * val / max);
                });

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickValues(percentScale)
                    .tickFormat(function (d) {
                        return parseInt(d, 10) + '%';
                    });

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                $('svg.opportunitieConversionAmount').empty();

                chart = d3.select('svg.opportunitieConversionAmount')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart.append('g')
                    .attr('class', 'x2 axis')
                    .call(xAxis2);

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + (height) + ')')
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                chart.selectAll('line.x')
                    .data(x2.ticks())
                    .enter().append('line')
                    .attr('class', 'x')
                    .attr('x1', x2)
                    .attr('x2', x2)
                    .attr('y1', 0)
                    .attr('y2', height)
                    .style('stroke', '#ccc');

                chart.selectAll('.bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', function (d) {
                        return 0;
                    })
                    .attr('y', function (d) {
                        return y(d.sale);
                    })
                    .attr('height', y.rangeBand())
                    .attr('width', function (d) {
                        return x2(d.wonSum + d.lostSum);
                    })
                    .attr('fill', '#6CC062');

                chart.selectAll('.ellipse')
                    .data(data)
                    .enter().append('ellipse')
                    .attr('class', 'ellipse')
                    .attr('cx', function (d) {
                        var won = d.wonSum || 0;
                        var lost = d.lostSum || 0;

                        if (won === 0 && lost === 0) {
                            return x(0);
                        }
                        return x(won * 100 / (won + lost));
                    })
                    .attr('cy', function (d) {
                        return y(d.sale) + y.rangeBand() / 2;
                    })
                    .attr('ry', function (d) {
                        return y.rangeBand() / 2;
                    })
                    .attr('rx', function (d) {
                        return y.rangeBand() / 2;
                    })
                    .style('fill', '#66ff66');

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -80)
                    .attr('x', width / 2)
                    .attr('dy', '2em')
                    .text('Finished Opportunities Sum');

                chart.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'end')
                    .attr('y', height + 15)
                    .attr('x', width / 2 - 50)
                    .attr('dy', '2em')
                    .text('Conversion Rate');

                $('svg.opportunitieConversionCount').empty();

                chart = d3.select('svg.opportunitieConversionCount')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                max = d3.max(data, function (d) {
                        return (d.wonCount + d.lostCount);
                    }) + 1;

                x2.domain([0, max]);

                xAxis2 = d3.svg.axis()
                    .scale(x2)
                    .orient('top')
                    .tickFormat(formatxAxis)
                    .ticks(5);

                percentScale = x2.ticks().map(function (val, i, col) {
                    return (100 * val / max);
                });

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickValues(percentScale)
                    .tickFormat(function (d) {
                        return parseInt(d, 10) + '%';
                    });

                chart.append('g')
                    .attr('class', 'x2 axis')
                    .call(xAxis2);

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + (height + 0) + ')')
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                chart.selectAll('line.x')
                    .data(x2.ticks())
                    .enter().append('line')
                    .attr('class', 'x')
                    .attr('x1', x2)
                    .attr('x2', x2)
                    .attr('y1', 0)
                    .attr('y2', height)
                    .style('stroke', '#ccc');

                chart.selectAll('.bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', function (d) {
                        return 0;
                    })
                    .attr('y', function (d) {
                        return y(d.sale);
                    })
                    .attr('height', y.rangeBand())
                    .attr('width', function (d) {
                        return x2(d.wonCount + d.lostCount);
                    })
                    .attr('fill', '#6CC062');

                chart.selectAll('.ellipse')
                    .data(data)
                    .enter().append('ellipse')
                    .attr('class', 'ellipse')
                    .attr('cx', function (d) {
                        var won = d.wonCount || 0;
                        var lost = d.lostCount || 0;

                        if (won === 0 && lost === 0) {
                            return x(0);
                        }
                        return x(won * 100 / (won + lost));
                    })
                    .attr('cy', function (d) {
                        return y(d.sale) + y.rangeBand() / 2;
                    })
                    .attr('ry', function (d) {
                        return y.rangeBand() / 2;
                    })
                    .attr('rx', 6)
                    .style('fill', '#66ff66');

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -80)
                    .attr('x', width / 2)
                    .attr('dy', '2em')
                    .text('Finished Opportunities Count');

                chart.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'end')
                    .attr('y', height + 15)
                    .attr('x', width / 2 - 50)
                    .attr('dy', '2em')
                    .text('Conversion Rate');

            });
        },

        renderOpportunitiesAging: function () {
            var self = this;

            common.getOpportunitiesAgingChart(function (data) {
                var margin;
                var x;
                var y;
                var xAxis;
                var yAxis;
                var xScaleDomain;
                var baseY;
                var chart;
                var chart1;
                var tip;
                var tip1;
                var colorMap;
                var outerWidth;
                var outerHeight;
                var innerWidth;
                var innerHeight;
                var barsMap;
                var labelsMap;
                var verticalBarSpacing = 3;

                labelsMap = {
                    ySum  : 'Opportunities Expected Revenue Sum',
                    yCount: 'Opportunities Count',
                    x     : 'Last Activity Days Ranges'
                };

                baseY = {
                    '0-7'   : 0,
                    '8-15'  : 0,
                    '16-30' : 0,
                    '31-60' : 0,
                    '61-120': 0,
                    '>120'  : 0
                };

                barsMap = {
                    New       : 'bar6',
                    '% 25-50' : 'bar7',
                    '% 50-75' : 'bar5',
                    '% 75-100': 'bar4'
                };

                colorMap = {
                    New        : 'yellow',
                    '% 25-50'  : '#86D1B5',
                    '% 50-75'  : '#26A7DE',
                    '% 75-100' : '#5FBA51',
                    'barStroke': '#2378ae'
                };

                margin = {
                    top   : 160,
                    right : 30,
                    bottom: 100,
                    left  : 120
                };

                xScaleDomain = ['0-7', '8-15', '16-30', '31-60', '61-120', '>120'];

                outerWidth = $('#wrapper').width() - 40;
                outerHeight = 600;

                innerWidth = outerWidth - margin.left - margin.right;
                innerHeight = outerHeight - margin.top - margin.bottom;

                x = d3.scale.ordinal()
                    .rangeRoundBands([0, innerWidth], 0.3)
                    .domain(xScaleDomain);

                y = d3.scale.linear()
                    .range([innerHeight, 0])
                    .domain([0, d3.max(data, function (d) {
                        return d['0-7_Sum'] + d['8-15_Sum'] + d['16-30_Sum'] + d['31-60_Sum'] + d['61-120_Sum'] + d['>120_Sum'];
                    })]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickFormat(function (d) {
                        return d + ' days';
                    });

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left')
                    .tickFormat(function (d) {
                        return '$' + d / 1000 + 'k';
                    });

                $('svg.opportunitieAgingSum').empty();

                chart = d3.select('svg.opportunitieAgingSum')
                    .attr('width', outerWidth)
                    .attr('height', outerHeight)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart.append('g')
                    .attr('class', 'x axis')
                    .call(xAxis)
                    .attr('transform', 'translate(0,' + innerHeight + ')');

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                chart.selectAll('line.y')
                    .data(y.ticks())
                    .enter().append('line')
                    .attr('class', 'y')
                    .attr('x1', 0)
                    .attr('x2', innerWidth)
                    .attr('y1', y)
                    .attr('y2', y)
                    .style('stroke', '#ccc');

                data.forEach(function (dataEl) {
                    chart.selectAll('.' + barsMap[dataEl.workflow])
                        .data(xScaleDomain)
                        .enter().append('rect')
                        .attr('class', barsMap[dataEl.workflow])
                        .attr('x', x)
                        .attr('y', function (d) {
                            baseY[d] += dataEl[d + '_Sum'];
                            return y(baseY[d]) + verticalBarSpacing;
                        })
                        .attr('height', function (d) {
                            var height = innerHeight - y(dataEl[d + '_Sum']);

                            if (height > verticalBarSpacing) {
                                return height - verticalBarSpacing;
                            } else {
                                return height;
                            }

                        })
                        .attr('width', x.rangeBand())
                        .attr('fill', colorMap[dataEl.workflow])
                        .on('mouseover', function (d) {
                            var attrs = this.attributes;

                            d3.select(this)
                                .style('stroke-width', '3')
                                .attr('stroke', colorMap.barStroke);

                            tip
                                .attr('x', +attrs.x.value + attrs.width.value / 2)
                                .attr('y', +attrs.y.value + attrs.height.value / 2 + 5)
                                .text('$' + helpers.currencySplitter(dataEl[d + '_Sum'].toString()));
                        })
                        .on('mouseout', function (d) {
                            d3.select(this)
                                .style('stroke-width', '0');

                            tip.text('');
                        });
                });

                tip = chart.append('text')
                    .attr('class', 'tip')
                    .attr('font-size', '12')
                    .attr('text-anchor', 'middle');

                chart.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'middle')
                    .attr('x', -innerHeight / 2)
                    .attr('y', -80)
                    .attr('transform', 'rotate(-90)')
                    .text(labelsMap.ySum);

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'middle')
                    .attr('x', innerWidth / 2)
                    .attr('y', innerHeight + 60)
                    .text(labelsMap.x);

                y = d3.scale.linear()
                    .range([innerHeight, 0])
                    .domain([0, d3.max(data, function (d) {
                        return d['0-7_Count'] + d['8-15_Count'] + d['16-30_Count'] + d['31-60_Count'] + d['61-120_Count'] + d['>120_Count'];
                    })]);

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left')
                    .tickFormat(d3.format('d'));

                $('svg.opportunitieAgingCount').empty();

                chart1 = d3.select('svg.opportunitieAgingCount')
                    .attr('width', outerWidth)
                    .attr('height', outerHeight)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart1.append('g')
                    .attr('class', 'x axis')
                    .call(xAxis)
                    .attr('transform', 'translate(0,' + innerHeight + ')');

                chart1.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                chart1.selectAll('line.y')
                    .data(y.ticks())
                    .enter().append('line')
                    .attr('class', 'y')
                    .attr('x1', 0)
                    .attr('x2', innerWidth)
                    .attr('y1', y)
                    .attr('y2', y)
                    .style('stroke', '#ccc');

                baseY = {
                    '0-7'   : 0,
                    '8-15'  : 0,
                    '16-30' : 0,
                    '31-60' : 0,
                    '61-120': 0,
                    '>120'  : 0
                };

                data.forEach(function (dataEl) {
                    chart1.selectAll('.' + barsMap[dataEl.workflow])
                        .data(xScaleDomain)
                        .enter().append('rect')
                        .attr('class', barsMap[dataEl.workflow])
                        .attr('x', x)
                        .attr('y', function (d) {
                            baseY[d] += dataEl[d + '_Count'];
                            return y(baseY[d]) + verticalBarSpacing;
                        })
                        .attr('height', function (d) {
                            var height = innerHeight - y(dataEl[d + '_Count']);

                            if (height > verticalBarSpacing) {
                                return height - verticalBarSpacing;
                            } else {
                                return height;
                            }

                        })
                        .attr('width', x.rangeBand())
                        .attr('fill', colorMap[dataEl.workflow])
                        .on('mouseover', function (d) {
                            var attrs = this.attributes;

                            d3.select(this)
                                .style('stroke-width', '3')
                                .attr('stroke', colorMap.barStroke);

                            tip1
                                .attr('x', +attrs.x.value + attrs.width.value / 2)
                                .attr('y', +attrs.y.value + attrs.height.value / 2 + 5)
                                .text(dataEl[d + '_Count']);
                        })
                        .on('mouseout', function (d) {
                            d3.select(this)
                                .style('stroke-width', '0');

                            tip1.text('');
                        });
                });

                tip1 = chart1.append('text')
                    .attr('class', 'tip')
                    .attr('font-size', '12')
                    .attr('text-anchor', 'middle');

                chart1.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'middle')
                    .attr('x', -innerHeight / 2)
                    .attr('y', -80)
                    .attr('transform', 'rotate(-90)')
                    .text(labelsMap.yCount);

                chart1.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'middle')
                    .attr('x', innerWidth / 2)
                    .attr('y', innerHeight + 60)
                    .text(labelsMap.x);
            });

        },

        renderPopulate: function () {
            var self = this;

            $('.leadChart').empty();

            common.getLeadsForChart('date', this.dateRange.date, this.dateItem.date, function (data) {
                var maxval = d3.max(data, function (d) {
                    return d.count;
                });
                var margin = {top: 20, right: 160, bottom: 190, left: 160};
                var width = $('#wrapper').width() - margin.left - margin.right;
                var height = 500 - margin.top - margin.bottom;
                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.6);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var y2 = d3.scale.linear()
                    .range([height, 0]);

                var x2 = d3.scale.linear()
                    .range([0, width]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickFormat(function (d) {
                        switch (self.dateItem.date) {
                            case 'DW':
                                return self.getDay(d);
                            case 'M':
                                return self.getMonth(d);
                            case 'D':
                                return self.getDateFromDayOfYear(d);
                        }
                        return d;

                    });

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(maxval)
                    .orient('left');

                var yAxis2 = d3.svg.axis()
                    .scale(y2)
                    .orient('right')
                    .tickFormat(function (d) {
                        return d + '%';
                    });
                var chart = d3.select('.leadChart')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                var line = d3.svg.line()
                    .x(function (d) {
                        return x(d.source) + x.rangeBand() / 2;
                    })
                    .y(function (d) {
                        return y2(d.count);
                    })
                    .interpolate('monotone');

                $('#timeBuildingDataFromServer').text('Server response in ' + self.buildTime + ' ms');

                if (self.dateItem.date == 'DW') {
                    var dt = _.unique(_.map(data, function (item) {
                        return item.source;
                    }));
                    for (var i = 1; i < 8; i++) {
                        if (dt.indexOf(i) === -1) {
                            data.push({count: 0, date: [0], isOpp: true, source: i, year: 2014});
                        }
                        data.push({count: 0, date: [0], source: i, isOpp: true, year: 2014});
                    }
                    data.sort(function (a, b) {
                        return d3.ascending(a.source, b.source);
                    });

                }
                if (self.dateItem.date == 'DM') {
                    var dt = _.unique(_.map(data, function (item) {
                        return item.source;
                    }));
                    for (var i = 1; i < 32; i++) {
                        if (dt.indexOf(i) === -1) {
                            data.push({count: 0, date: [0], isOpp: true, source: i, year: 2014});
                        }
                        data.push({count: 0, date: [0], source: i, isOpp: true, year: 2014});
                    }
                    data.sort(function (a, b) {
                        return d3.ascending(a.source, b.source);
                    });

                }
                if (self.dateItem.date == 'M' && self.dateRange.date == 365) {
                    var dt = _.unique(_.map(data, function (item) {
                        return item.source;
                    }));
                    for (var i = 1; i < 13; i++) {
                        if (dt.indexOf(i) === -1) {
                            data.push({count: 0, date: [0], isOpp: true, source: i, year: 2014});
                        }
                        data.push({count: 0, date: [0], source: i, isOpp: true, year: 2014});
                    }
                    data.sort(function (a, b) {
                        return d3.ascending(a.source, b.source);
                    });

                }
                if (self.dateItem.date == 'D') {

                    var dt = _.unique(_.map(data, function (item) {
                        return item.source;
                    }));
                    for (var i = 0; i < self.dateRange.date; i++) {
                        var now = new Date(new Date() - i * 24 * 60 * 60 * 1000);
                        var start = new Date(now.getFullYear(), 0, 0);
                        var diff = now - start;
                        var oneDay = 1000 * 60 * 60 * 24;
                        var dayofYera = Math.floor(diff / oneDay);
                        if (dt.indexOf(dayofYera) === -1) {
                            data.push({
                                count : 0,
                                date  : [now],
                                isOpp : true,
                                source: dayofYera,
                                year  : now.getFullYear()
                            });
                        }
                        // data.push({count: 0, date: [now], source: dayofYera, isOpp: true, year: now.getFullYear()});
                    }
                    data = _.map(data, function (item) {
                        item.source = item.source + item.year * 10000;
                        return item;
                    });

                    data.sort(function (a, b) {
                        return d3.ascending(a.source, b.source);
                    });

                }
                data.forEach(function (item) {
                    self.numberToDate[item.source] = item.date[0];
                });

                var data1 = _.filter(data, function (item) {
                    return item.isOpp;
                });
                var data2 = _.filter(data, function (item) {
                    return !item.isOpp;
                });

                var percent = [];
                var unicSource = _.map(data1, function (item) {
                    return item.source;
                });
                unicSource = unicSource.concat(_.map(data2, function (item) {
                    return item.source;
                }));
                unicSource = _.unique(unicSource);
                unicSource.sort(function (a, b) {
                    return d3.ascending(a, b);
                });
                var dataAll = [];
                for (var z = 0; z < unicSource.length; z++) {
                    var d1 = 0;
                    for (var i = 0; i < data1.length; i++) {
                        if (data1[i].source == unicSource[z]) {
                            d1 = data1[i].count;
                        }
                    }
                    var d2 = 0;
                    for (var i = 0; i < data2.length; i++) {
                        if (data2[i].source == unicSource[z]) {
                            d2 = data2[i].count;
                        }
                    }
                    if (d1 || d2) {
                        d1 = d1 || 0;
                        d2 = d2 || 0;
                        percent.push({source: unicSource[z], count: d1 / (d1 + d2)});
                    } else {
                        percent.push({source: unicSource[z], count: 0});
                    }
                    dataAll.push(({source: unicSource[z], count: d1 + d2}));
                }
                maxval = d3.max(data1, function (d) {
                    return d.count;
                });
                data1 = dataAll;
                var scale = 1;
                maxval = d3.max(data1, function (d) {
                        return d.count;
                    }) * scale;
                var minval2 = d3.min(percent, function (d) {
                        return d.count;
                    }) * scale;

                var maxval2 = d3.max(percent, function (d) {
                    return d.count;
                });
                if (maxval2 == 0) {
                    maxval2 = 1;
                }
                percent = _.map(percent, function (item) {
                    item.count = (item.count) * 100;
                    return item;

                });
                var maxval3 = d3.max(percent, function (d) {
                    return d.count;
                });
                var minval3 = d3.min(percent, function (d) {
                    return d.count;
                });
                x.domain(data.map(function (d) {
                    return d.source;
                }));
                y.domain([0, d3.max(data1, function (d) {
                    return d.count;
                })]);
                y2.domain([0, 100]);
                x2.domain([0, d3.max(data, function (d) {
                    return d.count;
                })]);
                if (self.dateItem.date != 'D') {
                    chart.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', 'translate(0,' + height + ')')
                        .call(xAxis)
                        .selectAll('text');

                } else {
                    if (self.dateRange.date == '7') {
                        chart.append('g')
                            .attr('class', 'x axis')
                            .attr('transform', 'translate(0,' + height + ')')
                            .call(xAxis)
                            .selectAll('text');
                    }
                    if (self.dateRange.date == '30') {
                        chart.append('g')
                            .attr('class', 'x axis')
                            .attr('transform', 'translate(0,' + height + ')')
                            .call(xAxis)
                            .selectAll('text')
                            .attr('transform', 'rotate(-60)')
                            .attr('x', '-10')
                            .attr('y', '2')
                            .attr('style', 'text-anchor:end');
                    }
                    if (self.dateRange.date == '90') {
                        chart.append('g')
                            .attr('class', 'x axis')
                            .attr('transform', 'translate(0,' + height + ')')
                            .call(xAxis)
                            .selectAll('text')
                            .attr('transform', 'rotate(-60)')
                            .attr('x', function (d, i) {
                                if (i % 2 != 0) {
                                    return 1000;
                                }
                                return -10;
                            })
                            .attr('data-id', function () {
                                return this.getComputedTextLength();
                            })
                            .attr('style', 'text-anchor:end;')
                            .attr('y', '2');
                    }
                    if (self.dateRange.date == '365') {
                        if (width > 1350) {
                            chart.append('g')
                                .attr('class', 'x axis')
                                .attr('transform', 'translate(0,' + height + ')')
                                .call(xAxis)
                                .selectAll('text')
                                .attr('transform', 'rotate(-90)')
                                .attr('x', function (d, i) {
                                    if (i % 5 != 0) {
                                        return 1000;
                                    }
                                    return -10;
                                })
                                .attr('y', '2')
                                .attr('style', 'text-anchor:end');

                        }
                        if (width > 1200 && width < 1350) {
                            chart.append('g')
                                .attr('class', 'x axis')
                                .attr('transform', 'translate(0,' + height + ')')
                                .call(xAxis)
                                .selectAll('text')
                                .attr('transform', 'rotate(-60)')
                                .attr('x', function (d, i) {
                                    if (i % 7 != 0) {
                                        return 1000;
                                    }
                                    return -10;
                                })
                                .attr('y', '2')
                                .attr('style', 'text-anchor:end');

                        }
                        if (width < 1200) {
                            chart.append('g')
                                .attr('class', 'x axis')
                                .attr('transform', 'translate(0,' + height + ')')
                                .call(xAxis)
                                .selectAll('text')
                                .attr('transform', 'rotate(-60)')
                                .attr('x', function (d, i) {
                                    if (i % 20 != 0) {
                                        return 1000;
                                    }
                                    return -10;
                                })
                                .attr('y', '2')
                                .attr('style', 'text-anchor:end');

                        }
                    }
                }

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis)
                    .selectAll('.tick line')
                    .attr('x2', function (d) {
                        return width;
                    })
                    .style('fill', '#1EBBEA');

                chart.append('g')
                    .attr('class', 'y2 axis')
                    .attr('transform', 'translate(' + width + ',0)')
                    .call(yAxis2);

                chart.selectAll('.bar')
                    .data(data1)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', function (d) {
                        return x(d.source);
                    })
                    .attr('y', function (d) {
                        return y(d.count);
                    })
                    .attr('height', function (d) {
                        return height - y(d.count);
                    })
                    .attr('width', x.rangeBand());

                chart.selectAll('.bar2')
                    .data(data2)
                    .enter().append('rect')
                    .attr('class', 'bar2')
                    .attr('x', function (d) {
                        return x(d.source);
                    })
                    .attr('y', function (d) {
                        return y(d.count);
                    })
                    .attr('height', function (d) {
                        return height - y(d.count);
                    })
                    .attr('width', x.rangeBand());

                chart.selectAll('.bar3')
                    .data(data2)
                    .enter().append('rect')
                    .attr('class', 'bar3')
                    .attr('x', function (d) {
                        return x(d.source);
                    })
                    .attr('y', function (d) {
                        return y(d.count);
                    })
                    .attr('height', function (d) {
                        return 2;
                    })
                    .attr('width', x.rangeBand());

                chart.append('path')
                    .datum(percent)
                    .attr('class', 'line')
                    .attr('d', line);

                chart.selectAll('.circle')
                    .data(percent)
                    .enter().append('circle')
                    .attr('class', 'circle')
                    .attr('cx', function (d) {
                        return x(d.source) + x.rangeBand() / 2;
                    })
                    .attr('cy', function (d) {
                        return y2(d.count);
                    })
                    .attr('r', function (d) {
                        return 4;
                    })
                    .style('fill', '#1EBBEA')
                    .style('stroke', '#fff')
                    .style('stroke-width', '2');

                chart.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'end')
                    .attr('y', -65)
                    .attr('x', -height / 2 + 80)
                    .attr('dy', '.75em')
                    .attr('transform', 'rotate(-90)')
                    .text('Number of Leads');

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -width - 75)
                    .attr('x', height / 2 + 120)
                    .attr('dy', '.75em')
                    .attr('transform', 'rotate(90)')
                    .text('Opportunity Conversion Rate');
            });

        },

        renderOpportunities: function () {
            var self = this;

            $('.opportunitiesChart').empty();

            common.getOpportunitiesForChart(null, this.dateRange.opportunitie, null, function (data) {
                var margin = {top: 20, right: 160, bottom: 30, left: 160};
                var width = $('#wrapper').width() - margin.left - margin.right;
                var height;
                var y;
                var x;
                var x2;
                var xAxis;
                var yAxis;
                var chart;
                var data1;
                var data2;
                var data3;
                var data4;
                var arrData;
                var arrSum;
                var maxHeight;
                var i;

                self.opportunitiesData = data;

                data.forEach(function (item) {
                    if (item._id === 'New') {
                        data1 = item.data;
                    }
                    if (item._id === '% 25-50') {
                        data2 = item.data;
                    }
                    if (item._id === '% 50-75') {
                        data3 = item.data;
                    }
                    if (item._id === '% 75-100') {
                        data4 = item.data;
                    }
                });

                data1 = data1 || [];
                data2 = data2 || [];
                data3 = data3 || [];
                data4 = data4 || [];

                for (i = data1.length - 1; i >= 0; i--) {
                    if (data1[i] && !data1[i].sum || data1[i].sum === 0) {
                        data1.splice(i, 1);
                    }
                }

                for (i = data2.length - 1; i >= 0; i--) {
                    if (data2[i] && !data2[i].sum || data2[i].sum === 0) {
                        data2.splice(i, 1);
                    }
                }

                for (i = data3.length - 1; i >= 0; i--) {
                    if (data3[i] && !data3[i].sum || data3[i].sum === 0) {
                        data3.splice(i, 1);
                    }
                }

                for (i = data4.length - 1; i >= 0; i--) {
                    if (data4[i] && !data4[i].sum || data4[i].sum === 0) {
                        data4.splice(i, 1);
                    }
                }

                arrData = _.union(_.pluck(data1, 'salesPerson'), _.pluck(data2, 'salesPerson'), _.pluck(data3, 'salesPerson'), _.pluck(data4, 'salesPerson'));
                arrSum = _.map(_.groupBy(_.union(data1, data2, data3, data4), 'salesPerson'), function (el) {
                    return _.reduce(el, function (memo, num) {
                        return memo + num.sum;
                    }, 0);
                });

                for (i = arrData.length - 1; i >= 0; i--) {
                    if (!arrData[i]) {
                        arrData[i] = 'NoUser';
                    }
                }

                maxHeight = arrData.length < 2 ? 200 : (arrData.length < 4) ? 300 : 600;
                height = maxHeight - margin.top - margin.bottom;

                y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.3);

                x = d3.scale.linear()
                    .range([0, width]);

                x2 = d3.scale.linear()
                    .range([0, width]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                chart = d3.select('.opportunitiesChart')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                y.domain(arrData);

                x.domain([0, d3.max(arrSum, function (d) {
                    return d;
                }) + 10]);

                x2.domain([0, d3.max(data, function (d) {
                    return d.count;
                }) + 10]);

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                chart.selectAll('.bar')
                    .data(data1)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', function (d) {
                        return 0;
                    })
                    .attr('y', function (d) {
                        var range = y.rangeBand();
                        var difference = range > 70 ? ((range - 70) / 2) : 0;

                        return y(d.salesPerson) + difference;
                    })
                    .attr('height', function () {
                        var range = y.rangeBand();

                        return range > 70 ? 70 : range;
                    })
                    .attr('width', function (d) {
                        return x(d.sum);
                    })
                    .style('fill', 'yellow')
                    .style('opacity', '0.8');

                chart.selectAll('.bar2')
                    .data(data2)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar2')
                    .attr('x', function (d) {
                        var x0 = 0;

                        data1.forEach(function (item) {
                            if (d.salesPerson === item.salesPerson) {
                                x0 += x(item.sum);
                            }
                        });

                        return x0;
                    })
                    .attr('y', function (d) {
                        var range = y.rangeBand();
                        var difference = range > 70 ? ((range - 70) / 2) : 0;

                        return y(d.salesPerson) + difference;
                    })
                    .attr('height', function () {
                        var range = y.rangeBand();

                        return range > 70 ? 70 : range;
                    })
                    .attr('width', function (d) {
                        return x(d.sum);
                    })
                    .style('fill', '#56D1B5')
                    .style('opacity', '0.8');

                chart.selectAll('.bar3')
                    .data(data3)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar3')
                    .attr('x', function (d) {
                        var x0 = 0;

                        data1.forEach(function (item) {
                            if (d.salesPerson === item.salesPerson) {
                                x0 += x(item.sum);
                            }
                        });

                        data2.forEach(function (item) {
                            if (d.salesPerson === item.salesPerson) {
                                x0 += x(item.sum);
                            }
                        });

                        return x0;
                    })
                    .attr('y', function (d) {
                        var range = y.rangeBand();
                        var difference = range > 70 ? ((range - 70) / 2) : 0;

                        return y(d.salesPerson) + difference;
                    })
                    .attr('height', function () {
                        var range = y.rangeBand();

                        return range > 70 ? 70 : range;
                    })
                    .attr('width', function (d) {
                        return x(d.sum);
                    })
                    .style('fill', '#26A7DE')
                    .style('opacity', '0.8');

                chart.selectAll('.bar4')
                    .data(data4)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar4')
                    .attr('x', function (d) {
                        var x0 = 0;

                        data1.forEach(function (item) {
                            if (d.salesPerson === item.salesPerson) {
                                x0 += x(item.sum);
                            }
                        });

                        data2.forEach(function (item) {
                            if (d.salesPerson === item.salesPerson) {
                                x0 += x(item.sum);
                            }
                        });

                        data3.forEach(function (item) {
                            if (d.salesPerson === item.salesPerson) {
                                x0 += x(item.sum);
                            }
                        });

                        return x0;
                    })
                    .attr('y', function (d) {
                        var range = y.rangeBand();
                        var difference = range > 70 ? ((range - 70) / 2) : 0;

                        return y(d.salesPerson) + difference;
                    })
                    .attr('height', function () {
                        var range = y.rangeBand();

                        return range > 70 ? 70 : range;
                    })
                    .attr('width', function (d) {
                        return x(d.sum);
                    })
                    .style('fill', '#5FBA51')
                    .style('opacity', '0.8');

                chart.selectAll('.x .tick line')
                    .data(x.ticks())
                    .attr('y2', function (d) {
                        return -height;
                    }).style('opacity', '0.2');
            });
        },

        renderOpportunitiesWinAndLost: function () {
            var self = this;

            $('.winAndLostOpportunitiesChart').empty();

            common.getOpportunitiesForChart('date', this.dateRange.winLost, this.dateItem['winLost'], function (data) {

                $('#timeBuildingDataFromServer').text('Server response in ' + self.buildTime + ' ms');

                var margin = {top: 20, right: 160, bottom: 190, left: 160},
                    width = $('#wrapper').width() - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.6);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var y2 = d3.scale.linear()
                    .range([height, 0]);

                var x2 = d3.scale.linear()
                    .range([0, width]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickFormat(function (d) {
                        return d;
                    });

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(5)
                    .orient('left');

                var yAxis2 = d3.svg.axis()
                    .scale(y2)
                    .orient('right')
                    .tickFormat(function (d) {
                        return d + '%';
                    });

                var chart = d3.select('.winAndLostOpportunitiesChart')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                var format;

                switch (self.dateItem['winLost']) {
                    case 'DW':
                        format = function (d) {
                            return self.getDay((new Date(parseInt(d.year), parseInt(d.mounth) - 1, parseInt(d.day))).getDay());
                        };
                        break;
                    case 'DM':
                        format = function (d) {
                            return d.day;
                        };
                        break;
                    case 'M':
                        format = function (d) {
                            return self.getMonth(parseInt(d.mounth));
                        };
                        break;
                    case 'W':
                        format = function (d) {
                            return d.week;
                        };
                        break;
                    case 'D':
                        format = function (d) {
                            var now = new Date(d.year, parseInt(d.mounth) - 1, d.day);
                            var start = new Date(now.getFullYear(), 0, 0);
                            var diff = now - start;
                            var oneDay = 1000 * 60 * 60 * 24;
                            var day = Math.floor(diff / oneDay);

                            //return dateFormat(new Date(d.year, parseInt(d.mounth) - 1, d.day).toString('MMMM ,yyyy'), 'mmmm dd, yyyy');
                            return moment(new Date(d.year, parseInt(d.mounth) - 1, d.day)).format('MMM DD, YYYY');
                        };
                        break;
                }

                var line = d3.svg.line()
                    .x(function (d) {
                        return x(format(d.date)) + x.rangeBand() / 2;
                    })
                    .y(function (d) {
                        return y2(d.value);
                    })
                    .interpolate('monotone');

                var percent = [];

                data.forEach(function (d, i) {
                    if ((d.wonCount + d.inProgressCount + d.lostCount) === 0) {
                        data.splice(i, 1);
                    }
                });

                data.forEach(function (d, i) {
                    var value;

                    d.wonCount = d.wonCount || 0;
                    d.lostCount = d.lostCount || 0;
                    value = d.wonCount || d.lostCount ? (d.wonCount / (d.wonCount + d.lostCount) * 100) : 0;

                    percent.push({
                        date : d._id,
                        value: value
                    });
                });

                x.domain(data.map(function (d) {
                    return format(d._id);
                }));

                y.domain([0, d3.max(data, function (d) {
                    return d.wonCount + d.inProgressCount + d.lostCount;
                })]);

                y2.domain([0, 100]);

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis)
                    .selectAll('text');

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis)
                    .selectAll('.tick line')
                    .attr('x2', function (d) {
                        return width;
                    })
                    .style('fill', '#1EBBEA');

                chart.append('g')
                    .attr('class', 'y2 axis')
                    .attr('transform', 'translate(' + width + ',0)')
                    .call(yAxis2);

                chart.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'end')
                    .attr('y', -50)
                    .attr('x', -50)
                    .attr('dy', '.75em')
                    .attr('transform', 'rotate(-90)')
                    .text('Number of Opportunities');

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'middle')
                    .attr('y', -50)
                    .attr('x', 120)
                    .attr('dy', 0)
                    .attr('transform', 'rotate(90), translate(0,' + (-width) + ')')
                    .text('Win percent');

                chart.selectAll('.bar4')
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'bar4')
                    .attr('x', function (d) {
                        var range = x.rangeBand();
                        var difference = range > 70 ? (range - 70) / 2 : 0;

                        return x(format(d._id)) + difference;
                    })
                    .attr('y', function (d) {
                        return y(d.lostCount);
                    })
                    .attr('height', function (d) {
                        return height - y(d.lostCount);
                    })
                    .attr('width', function () {
                        var range = x.rangeBand();

                        return range < 70 ? range : 70;
                    })
                    .attr('fill', 'red')
                    .style('opacity', '0.8');

                chart.selectAll('.bar5')
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'bar5')
                    .attr('x', function (d) {
                        var range = x.rangeBand();
                        var difference = range > 70 ? (range - 70) / 2 : 0;

                        return x(format(d._id)) + difference;
                    })
                    .attr('y', function (d) {
                        return y(d.inProgressCount + d.lostCount);
                    })
                    .attr('height', function (d) {
                        return height - y(d.inProgressCount);
                    })
                    .attr('width', function () {
                        var range = x.rangeBand();

                        return range < 70 ? range : 70;
                    })
                    .attr('fill', '#00B3E9')
                    .style('opacity', '0.8');

                chart.selectAll('.bar6')
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'bar6')
                    .attr('x', function (d) {
                        var range = x.rangeBand();
                        var difference = range > 70 ? ((range - 70) / 2) : 0;

                        return x(format(d._id)) + difference;
                    })
                    .attr('y', function (d) {
                        return y(d.inProgressCount + d.wonCount + d.lostCount);
                    })
                    .attr('height', function (d) {
                        return height - y(d.wonCount);
                    })
                    .attr('width', function () {
                        var range = x.rangeBand();

                        return range < 70 ? range : 70;
                    })
                    .attr('fill', '#6FC362')
                    .style('opacity', '0.8');

                chart.append('path')
                    .datum(percent)
                    .attr('class', 'line')
                    .attr('d', line).style('stroke', '#3E88B9');

                chart.selectAll('.circle')
                    .data(percent)
                    .enter().append('circle')
                    .attr('class', 'circle')
                    .attr('cx', function (d) {
                        return x(format(d.date)) + x.rangeBand() / 2;
                    })
                    .attr('cy', function (d) {
                        return y2(d.value);
                    })
                    .attr('r', function (d) {
                        return 4;
                    })
                    .style('fill', '#3E88B9')
                    .style('stroke', '#fff')
                    .style('stroke-width', '2');
            });
        },

        renderSalesByCountry: function (){
            var self = this;
            var dataUrl = '../../maps/';
            var width = 700;
            var height = 450;
            var svg;
            var g;
            var projection = d3.geo.mercator()
                .translate([width/2, height/1.5])
                .scale([width/6]);

            var path = d3.geo.path().projection(projection);

            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 50])
                .on("zoom", function () {

                    d3.select('#wrapper div').style("opacity", 0);

                    var e = d3.event,
                        tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
                        ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
                    zoom.translate([tx, ty]);
                    g.attr("transform", [
                        "translate(" + [tx, ty] + ")",
                        "scale(" + e.scale + ")"
                    ].join(" "));
                });

            d3.selectAll('svg.salesByCountryChart > *').remove();

            svg = d3.select('svg.salesByCountryChart')
                .attr({
                    'width' : width,
                    'height': height,
                    'style' : 'background: #ACC7F2'
                });

            g = svg.append('g');

            d3.json(dataUrl + 'world-110m2.json', function (error, topology) {

                g.selectAll('path')
                    .data(topojson.object(topology, topology.objects.countries)
                        .geometries)
                    .enter()
                    .append("path")
                    .attr({
                        'd'   : path,
                        'fill': '#F4F3EF',
                        'id'  : function (d) {
                            return d.id;
                        }
                    });

                d3.csv(dataUrl + 'country-capitals.csv', function(error, data) {
                    g.selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr({
                            'cx': function(d) {
                                return projection([
                                    parseFloat(d.CapitalLongitude), 
                                    parseFloat(d.CapitalLatitude)]
                                )[0];
                            },
                            'cy': function(d) {
                                return projection([
                                    parseFloat(d.CapitalLongitude), 
                                    parseFloat(d.CapitalLatitude)]
                                )[1];
                            },
                            'r': function(d) {
                                if (d.CountryName === 'Faroe Islands') {
                                    return 2;
                                } else {
                                    return 10;
                                }
                            },
                            'fill': '#5CD1C8',
                            'opacity': 0.75,
                            'stroke': '#43A395',
                            'stroke-width': 1
                        });
                });

                g.call(zoom);
            })
        }
    });
    return ContentView;
});
