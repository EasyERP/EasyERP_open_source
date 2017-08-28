define([
    'Backbone',
    'jQuery',
    'Underscore',
    'async',
    'views/Filter/dateFilter',
    'text!templates/Dashboard/DashboardTemplate.html',
    'custom',
    'd3',
    'common',
    'dataService',
    'helpers',
    'helpers/getDateHelper',
    'moment',
    'topojson'
], function (Backbone, $, _, async, DateFilterView, DashboardTemplate, Custom, d3, common, dataService, helpers, getDateHelper, moment, topojson) {

    var ContentView = Backbone.View.extend({
        contentType: 'Dashboard',
        actionType: 'Content',
        template: _.template(DashboardTemplate),
        el: '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;
            this.leadsByNamesChartType = 'leadsBySales';
            this.startTime = new Date();
            this.buildTime = 0;
            this.dateRange = {
                date: 30,
                source: 30,
                opportunitie: 30,
                sale: 7,
                opportunitieConversion: 90,
                winLost: 30,
                salesByCountry: 30
            };

            this.dateItem = {
                date: 'D',
                WonLost: 'D',
                Leads: 'createdBy',
                LeadsByName: 'leadsBySales'
            };

            this.dataForLeadsChart = [];
            this.numberToDate = {};
            this.source = null;
            this.resizeHandler = _.debounce(this.resizeHandler, 500);
            this.resizeHandler = this.resizeHandler.bind(this);
            this.type = options.type || 'leadsByResearcher';
            this.render();
        },

        events: {
            'click .choseDateItem .item': 'newItem',
            'click .chart-tabs a': 'changeTab',
            'click .dropDownDateRangeContainer': 'toggleDateFilter'
        },

        toggleDateFilter: function (e) {
            var $target = $(e.target);
            if ($target.hasClass('active')) {

                e.stopPropagation();
                e.preventDefault();
            }

            $target.closest('.dropDownDateRangeContainer').find('.dropDownDateRange').toggleClass('open');
        },

        newItem: function (e) {
            var $target = $(e.target);
            var $parent = $(e.target).closest('.choseDateItem');
            var type = $parent.attr('data-type');
            var viewName = type + 'DateFilterView';

            if ($target.hasClass('active')) {
                return;
            }

            $target.parent().find('.active').removeClass('active');
            $target.addClass('active');
            this.dateItem[type] = $(e.target).data('item');

            switch (type) {
                case 'WonLost':
                    this.renderWonLost(viewName);
                    break;
                case 'LeadsByName':
                    this.renderLeadsByName(viewName);
                    break;
                case 'Leads':
                    this.renderLeads(viewName);
                    break;
                // skip default;
            }
        },

        changeTab: function (e) {
            var $tab = $('.chart-tabs-items');
            var n;

            $(e.target).closest('.chart-tabs').find('a.active').removeClass('active');
            $(e.target).addClass('active');
            n = $(e.target).parents('.chart-tabs').find('li').index($(e.target).parent());
            $tab.find('.chart-tabs-item.active').removeClass('active');
            $tab.find('.chart-tabs-item').eq(n).addClass('active');
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

        renderDateFilters: function (options) {
            var self = this;
            var _opts = options || {};
            var contentTypeArr = Object.keys(_opts);

            async.map(contentTypeArr, function (contentType) {
                var viewName = contentType + 'DateFilterView';

                self[viewName] = new DateFilterView({
                    contentType: contentType,
                    type: _opts[contentType].type,
                    el: self.$el.find('#' + contentType + 'DateFilter')
                });
                self[viewName].on('dateChecked', function () {
                    if (['LeadsBySale', 'LeadsBySource'].indexOf(contentType) === -1) {
                        self['render' + contentType](viewName);
                    } else {
                        if (contentType === 'LeadsBySale') {
                            self['render' + contentType](viewName, 'sale');
                        } else {
                            self['render' + contentType](viewName, 'source');
                        }
                    }
                });
                self[viewName].checkElement(_opts[contentType].defaultValue);
            });
        },

        activeTab: function () {
            this.$el.find('li a.' + this.type).addClass('active');
            this.$el.find('li a.' + this.type).click();
        },

        render: function () {
            var date = moment(new Date());
            var self = this;
            var optionsForDateFilter = {
                'LeadsBySale': {
                    defaultValue: 'thisMonth',
                    type: 'date'
                },

                'LeadsBySource': {
                    defaultValue: 'thisMonth',
                    type: 'date'
                },

                'OpportunitiesConversion': {
                    defaultValue: 'thirtyDays',
                    type: 'range'
                },

                'Opportunities': {
                    defaultValue: 'thirtyDays',
                    type: 'range'
                },

                'WonLost': {
                    defaultValue: 'thirtyDays',
                    type: 'range'
                },

                'SalesByCountry': {
                    defaultValue: 'thisMonth',
                    type: 'date'
                },

                'Leads': {
                    defaultValue: 'thisMonth',
                    type: 'date'
                },

                'LeadsByName': {
                    defaultValue: 'thisMonth',
                    type: 'date'
                }
            };

            this.startDate = (date.startOf('month')).format('D MMM, YYYY');
            this.endDate = (moment(this.startDate).endOf('month')).format('D MMM, YYYY');

            this.$el.html(this.template({
                startDate: this.startDate,
                endDate: this.endDate,
                startDateLeads: this.startDateLeads,
                endDateLeads: this.endDateLeads,
                startDateLeadsByNames: this.startDateLeadsByName,
                endDateLeadsByNames: this.endDateLeadsByName,
                startDateLeadsBySale: this.startDateLeadsBySale,
                endDateLeadsBySale: this.endDateLeadsBySale,
                startDateLeadsBySource: this.startDateLeadsBySource,
                endDateLeadsBySource: this.endDateLeadsBySource
            }));

            this.renderMap();
            this.renderOpportunitiesAging();
            this.renderDateFilters(optionsForDateFilter);
            this.renderTreemap();

            this.activeTab();

            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');

            return this;
        },

        renderLeadsBySale: function (viewName, type) {
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var chartClass = '.' + type + 'sChart';
            var self = this;
            var margin = {
                top: 50,
                right: 50,
                bottom: 80,
                left: 150
            };
            var maxOpportunities;
            var uniqueNames;
            var scaleArray;
            var gradient2;
            var gradient;
            var maxLeads;
            var height;
            var width;
            var xAxis;
            var yAxis;
            var chart;
            var data1;
            var data2;
            var y;
            var x;

            function uniqueVal(value, index, self) {
                return self.indexOf(value) === index;
            }

            $(chartClass).empty();


            common.getLeadsForChart(type, filter, function (data) {

                $('#timeBuildingDataFromServer').text('Server response in ' + self.buildTime + ' ms');

                if (type === 'sale') {
                    data.map(function (el) {
                        el.source = el.source || 'No User';
                        return el;
                    });

                } else {
                    data.map(function (el) {
                        el.source = el.source || 'No Source Name';
                        return el;
                    });
                }

                scaleArray = data.map(function (d) {
                    return d.source;
                });

                uniqueNames = scaleArray.slice().filter(uniqueVal);
                width = ($('#content-holder').width()) / 2;
                height = uniqueNames.length * 20;

                y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.3)
                    .domain(uniqueNames);

                x = d3.scale.linear()
                    .range([0, width])
                    .domain([0, d3.max(data, function (d) {
                        return d.count;
                    }) + 10]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                chart = d3.select(chartClass)
                    .attr('width', width - margin.left - margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                chart.append('text')
                    .attr("transform", "translate(" + width / 2 + " ," + (height + 40) + ")")
                    .text('Number of Leads');

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                chart.append('text')
                    .attr("transform", "translate(" + 0 + " ," + -20 + ")")
                    .text('Researcher Name');

                data1 = _.filter(data, function (item) {
                    return item.isOpp;
                });

                data2 = _.filter(data, function (item) {
                    return !item.isOpp;
                });

                maxLeads = d3.max(data2, function (d) {
                        return d.count;
                    }) || 0;

                maxOpportunities = d3.max(data1, function (d) {
                        return d.count;
                    }) || 0;

                gradient = d3.select('svg.chart.' + type + 'sChart').select('g').append('linearGradient')
                    .attr({
                        'y1': 0,
                        'y2': 0,
                        'x1': 0,
                        'x2': x(maxOpportunities),
                        'id': 'gradientBarForOpportunities',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset': '0',
                        'stop-color': '#98aac4'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset': '0.8',
                        'stop-color': '#6b456c'
                    });

                gradient2 = d3.select('svg.chart.' + type + 'sChart').select('g').append('linearGradient')
                    .attr({
                        'y1': 0,
                        'y2': 0,
                        'x1': 0,
                        'x2': x(maxLeads),
                        'id': 'gradientBarForTotalLeads',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient2
                    .append('stop')
                    .attr({
                        'offset': '0',
                        'stop-color': '#FFA17F'
                    });

                gradient2
                    .append('stop')
                    .attr({
                        'offset': '0.7',
                        'stop-color': '#ACC7F2'
                    });

                chart.selectAll('.bar2')
                    .data(data2)
                    .enter()
                    .append('rect')
                    .attr({
                        'class': 'bar2',
                        'x': 0,
                        'y': function (d) {
                            return y(d.source);
                        },
                        'height': y.rangeBand(),
                        'width': function (d) {
                            return x(d.count);
                        }
                    })
                    .style('fill', 'url(#gradientBarForTotalLeads)')
                    .style('opacity', 1);

                chart.selectAll('.bar')
                    .data(data1)
                    .enter()
                    .append('rect')
                    .attr({
                        'class': 'bar',
                        'x': 0,
                        'y': function (d) {
                            return y(d.source);
                        },
                        'height': y.rangeBand(),
                        'width': function (d) {
                            return x(d.count);
                        }
                    })
                    .attr('fill', 'url(#gradientBarForOpportunities)');

                chart.selectAll('.x .tick line')
                    .data(data)
                    .attr('y2', function (d) {
                        return -height;
                    });
            });
        },

        renderLeadsBySource: function (viewName, type) {
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var chartClass = '.' + type + 'sChart';
            var self = this;
            var margin = {
                top: 50,
                right: 50,
                bottom: 80,
                left: 150
            };
            var maxOpportunities;
            var uniqueNames;
            var scaleArray;
            var gradient2;
            var gradient;
            var maxLeads;
            var height;
            var width;
            var xAxis;
            var yAxis;
            var chart;
            var data1;
            var data2;
            var y;
            var x;

            function uniqueVal(value, index, self) {
                return self.indexOf(value) === index;
            }

            $(chartClass).empty();

            common.getLeadsForChart(type, filter, function (data) {

                $('#timeBuildingDataFromServer').text('Server response in ' + self.buildTime + ' ms');

                if (type === 'sale') {
                    data.map(function (el) {
                        el.source = el.source || 'No User';
                        return el;
                    });

                } else {
                    data.map(function (el) {
                        el.source = el.source || 'No Source Name';
                        return el;
                    });
                }

                scaleArray = data.map(function (d) {
                    return d.source;
                });

                uniqueNames = scaleArray.slice().filter(uniqueVal);
                width = ($('#content-holder').width()) / 2;
                height = uniqueNames.length * 20;

                y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.3)
                    .domain(uniqueNames);

                x = d3.scale.linear()
                    .range([0, width])
                    .domain([0, d3.max(data, function (d) {
                        return d.count;
                    }) + 10]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                chart = d3.select(chartClass)
                    .attr('width', width - margin.left - margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                data1 = _.filter(data, function (item) {
                    return item.isOpp;
                });

                data2 = _.filter(data, function (item) {
                    return !item.isOpp;
                });

                maxLeads = d3.max(data2, function (d) {
                        return d.count;
                    }) || 0;

                maxOpportunities = d3.max(data1, function (d) {
                        return d.count;
                    }) || 0;

                gradient = d3.select('svg.chart.' + type + 'sChart').select('g').append('linearGradient')
                    .attr({
                        'y1': 0,
                        'y2': 0,
                        'x1': 0,
                        'x2': x(maxOpportunities),
                        'id': 'gradientBarForOpportunities',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset': '0',
                        'stop-color': '#98aac4'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset': '0.8',
                        'stop-color': '#6b456c'
                    });

                gradient2 = d3.select('svg.chart.' + type + 'sChart').select('g').append('linearGradient')
                    .attr({
                        'y1': 0,
                        'y2': 0,
                        'x1': 0,
                        'x2': x(maxLeads),
                        'id': 'gradientBarForTotalLeads',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient2
                    .append('stop')
                    .attr({
                        'offset': '0',
                        'stop-color': '#FFA17F'
                    });

                gradient2
                    .append('stop')
                    .attr({
                        'offset': '0.7',
                        'stop-color': '#ACC7F2'
                    });

                chart.selectAll('.bar2')
                    .data(data2)
                    .enter()
                    .append('rect')
                    .attr({
                        'class': 'bar2',
                        'x': 0,
                        'y': function (d) {
                            return y(d.source);
                        },
                        'height': y.rangeBand(),
                        'width': function (d) {
                            return x(d.count);
                        }
                    })
                    .style('fill', 'url(#gradientBarForTotalLeads)')
                    .style('opacity', 1);

                chart.selectAll('.bar')
                    .data(data1)
                    .enter()
                    .append('rect')
                    .attr({
                        'class': 'bar',
                        'x': 0,
                        'y': function (d) {
                            return y(d.source);
                        },
                        'height': y.rangeBand(),
                        'width': function (d) {
                            return x(d.count);
                        }
                    })
                    .attr('fill', 'url(#gradientBarForOpportunities)');

                chart.selectAll('.x .tick line')
                    .data(data)
                    .attr('y2', function (d) {
                        return -height;
                    });

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -55)
                    .attr('x', 0)
                    .attr('dy', '2em')
                    .text('Source');

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', height)
                    .attr('x', width)
                    .attr('dy', '2em')
                    .text('Number');
            });
        },

        renderOpportunitiesConversion: function (viewName) {
            var self = this;
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };

            common.getOpportunitiesConversionForChart(filter, function (result) {
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
                var tooltip1;
                var tooltip2;

                data = _.sortBy(result, function (d) {
                    return -(d.wonSum + d.lostSum);
                });

                margin = {
                    top: 120,
                    right: 10,
                    bottom: 80,
                    left: 150
                };

                width = $('#content-holder').width() / 2 - margin.left - margin.right - 120;
                height = 40 * data.length - margin.bottom;

                formatxAxis = d3.format('.0f');

                y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.3);

                x = d3.scale.linear()
                    .range([0, width - margin.right]);

                x2 = d3.scale.linear()
                    .range([0, width - margin.right]);

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
                    .tickPadding(10)
                    .orient('left');

                $('svg.opportunitieConversionAmount').empty();

                chart = d3.select('svg.opportunitieConversionAmount')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                tooltip1 = chart.append('text')
                    .attr({
                        class: 'infoLabel',
                        x: -20,
                        y: -100
                    })
                    .style('display', 'none');

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

                chart.selectAll('.bar1')
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'bar1')
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
                    .attr('fill', '#26A7DE')
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .attr({
                                opacity: 0.5
                            });

                        tooltip1
                            .transition()
                            .duration(300)
                            .style('display', 'block')
                            .text(d._id + ' -> ' + (d.wonSum + d.lostSum));

                    })
                    .on('mouseleave', function () {
                        d3.select(this)
                            .attr({
                                opacity: 1
                            });

                        tooltip1.transition()
                            .duration(200)
                            .style('display', 'none');
                    });

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
                    .style('fill', '#66ff66')
                    .on('mouseover', function (d) {
                        var won = d.wonSum || 0;
                        var lost = d.lostSum || 0;
                        var text;

                        if (won === 0 && lost === 0) {
                            text = 0;
                        } else {
                            text = won * 100 / (won + lost);
                        }

                        d3.select(this)
                            .attr({
                                opacity: 0.5
                            });

                        tooltip1
                            .transition()
                            .duration(300)
                            .style('display', 'block')
                            .text(d.sale + ' -> ' + text);
                    })
                    .on('mouseleave', function () {
                        d3.select(this)
                            .attr({
                                opacity: 1
                            });

                        tooltip1.transition()
                            .duration(200)
                            .style('display', 'none');
                    });

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

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -55)
                    .attr('x', 0)
                    .attr('dy', '2em')
                    .text('Researcher Name');

                $('svg.opportunitieConversionCount').empty();

                chart = d3.select('svg.opportunitieConversionCount')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                tooltip2 = chart.append('text')
                    .attr({
                        class: 'infoLabel',
                        x: -20,
                        y: -100
                    })
                    .style('display', 'none');

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

                chart.selectAll('.bar2')
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'bar2')
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
                    .attr('fill', '#26A7DE')
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .attr({
                                opacity: 0.5
                            });

                        tooltip2
                            .transition()
                            .duration(300)
                            .style('display', 'block')
                            .text(d._id + ' -> ' + (d.wonCount + d.lostCount));
                    })
                    .on('mouseleave', function () {
                        d3.select(this)
                            .attr({
                                opacity: 1
                            });

                        tooltip2.transition()
                            .duration(200)
                            .style('display', 'none');
                    });

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
                    .style('fill', '#66ff66')
                    .on('mouseover', function (d) {
                        var won = d.wonSum || 0;
                        var lost = d.lostSum || 0;
                        var text;

                        if (won === 0 && lost === 0) {
                            text = 0;
                        } else {
                            text = won * 100 / (won + lost);
                        }

                        d3.select(this)
                            .attr({
                                opacity: 0.5
                            });

                        tooltip2
                            .transition()
                            .duration(300)
                            .style('display', 'block')
                            .text(d.sale + ' -> ' + text);
                    })
                    .on('mouseleave', function () {
                        d3.select(this)
                            .attr({
                                opacity: 1
                            });

                        tooltip2.transition()
                            .duration(200)
                            .style('display', 'none');
                    });

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -80)
                    .attr('x', width / 2)
                    .attr('dy', '2em')
                    .text('Finished Opportunities Count');

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -55)
                    .attr('x', 0)
                    .attr('dy', '2em')
                    .text('Researcher Name');

                chart.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'end')
                    .attr('y', height + 15)
                    .attr('x', width / 2 - 50)
                    .attr('dy', '2em')
                    .text('Conversion Rate');
            });
        },

        renderOpportunitiesAging: function (viewName) {
            var verticalBarSpacing = 3;
            var yScaleDomain;
            var workflowArr;
            var outerHeight;
            var innerHeight;
            var outerWidth;
            var innerWidth;
            var labelsMap;
            var colorMap;
            var barsMap;
            var margin;
            var chart1;
            var xAxis;
            var yAxis;
            var baseX;
            var chart;
            var keys;
            var tip1;
            var tip;
            var x;
            var y;

            common.getOpportunitiesAgingChart(function (data) {

                function sortByWorkflow(a, b) {
                    if (workflowArr.indexOf(a.workflow) > workflowArr.indexOf(b.workflow)) {
                        return 1;
                    } else {
                        return -1;
                    }
                }

                labelsMap = {
                    ySum: 'Opportunities Expected Revenue Sum',
                    yCount: 'Opportunities Count',
                    x: 'Last Activity Days Ranges'
                };

                baseX = {
                    '0-7': 0,
                    '8-15': 0,
                    '16-30': 0,
                    '31-60': 0,
                    '61-120': 0,
                    '>120': 0
                };

                keys = [
                    {range: '0-7_', value: 0, count: 0},
                    {range: '8-15_', value: 0, count: 0},
                    {range: '16-30_', value: 0, count: 0},
                    {range: '31-60_', value: 0, count: 0},
                    {range: '61-120_', value: 0, count: 0},
                    {range: '>120_', value: 0, count: 0}
                ];

                barsMap = {
                    'New': 'bar8',
                    'To estimate': 'bar9',
                    'Discuss estimate': 'bar10',
                    'Proposal': 'bar11',
                    'PM approval': 'bar12',
                    'In development': 'bar13',
                    'Lost': 'bar14'
                };

                colorMap = {
                    'New': '#93648D', //violet
                    'To estimate': '#4CC3D9', //blue
                    'Done estimate': '#F1DD9E', //brown green
                    'Send offer': '#7BC8A4', //green
                    'PM approve': '#FFC65D', //yellow
                    'Pre-development': '#5D4C46', //brown
                    'In development': '#EB6E44', //orange
                    'Lost': '#93073E', //dark red
                    'barStroke': '#2378ae'
                };

                margin = {
                    top: 20,
                    right: 50,
                    bottom: 100,
                    left: 140
                };

                workflowArr = ['New', 'To estimate', 'Done estimate',
                    'Send offer', 'PM approve', 'Pre-development', 'In development', 'Lost'];

                data.sort(sortByWorkflow);

                yScaleDomain = ['>120', '61-120', '31-60', '16-30', '8-15', '0-7'];
                outerWidth = $('#content-holder').width() - 40;
                outerHeight = 600;
                innerWidth = outerWidth - margin.left - margin.right;
                innerHeight = outerHeight - margin.top - margin.bottom;

                $('svg.opportunitieAgingSum').empty();

                for (var i = data.length; i--;) {

                    for (var j = keys.length; j--;) {

                        keys[j].value += data[i][keys[j].range + 'Sum'];
                        keys[j].count += data[i][keys[j].range + 'Count'];
                    }
                }

                x = d3.scale.linear()
                    .range([0, (innerWidth / 2 - margin.right)])
                    .domain([0, d3.max(keys, function (d) {
                        return d.value;
                    })]);

                y = d3.scale.ordinal()
                    .rangeRoundBands([0, innerHeight])
                    .domain(yScaleDomain);

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left')
                    .tickFormat(function (d) {
                        return d + ' days';
                    });

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickFormat(function (d) {
                        return '$' + d / 1000 + 'k';
                    });

                chart = d3.select('svg.opportunitieAgingSum')
                    .attr({
                        'width': outerWidth / 2,
                        'height': outerHeight
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart.append('g')
                    .attr('class', 'x axis')
                    .call(yAxis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(xAxis)
                    .attr('transform', 'translate(0,' + innerHeight + ')');

                chart.selectAll('line.x')
                    .data(x.ticks())
                    .enter()
                    .append('line')
                    .attr({
                        'class': 'x',
                        'x1': x,
                        'x2': x,
                        'y1': y,
                        'y2': innerHeight,
                        'stroke': '#ccc'
                    });

                chart.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'middle')
                    .attr('x', -innerHeight / 2)
                    .attr('y', -100)
                    .attr('transform', 'rotate(-90)')
                    .text(labelsMap.x);

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'middle')
                    .attr('x', innerWidth / 4)
                    .attr('y', innerHeight + 60)
                    .text(labelsMap.ySum);

                tip = chart.append('text')
                    .attr({
                        'class': 'tip',
                        'font-size': '14',
                        'text-anchor': 'middle',
                        'font-weight': 'bolder'
                    });

                data.forEach(function (dataEl) {

                    chart.selectAll('.' + barsMap[dataEl.workflow])
                        .data(yScaleDomain)
                        .enter()
                        .append('rect')
                        .attr({
                            'class': barsMap[dataEl.workflow],
                            'x': function (d) {
                                baseX[d] += x(dataEl[d + '_Sum']);
                                return baseX[d] - x(dataEl[d + '_Sum']);
                            },
                            'y': function (d) {
                                return y(d) + verticalBarSpacing;
                            },
                            'width': function (d) {
                                var width = x(dataEl[d + '_Sum']);

                                if (width > verticalBarSpacing) {
                                    return width - verticalBarSpacing;
                                } else {
                                    return width;
                                }
                            },
                            'height': y.rangeBand() - 2 * verticalBarSpacing,
                            'fill': colorMap[dataEl.workflow]
                        })
                        .on('mouseover', function (d) {
                            var attrs = this.attributes;
                            var xVal = parseFloat(attrs.x.value) + attrs.width.value / 2;
                            var yVal = parseFloat(attrs.y.value) + attrs.height.value / 2;

                            d3.select(this)
                                .style('stroke-width', '3')
                                .attr({
                                    'stroke': colorMap.barStroke,
                                    'opacity': 0.5
                                });

                            tip
                                .attr('x', xVal)
                                .attr('y', (yVal + 5))
                                .text('$' + helpers.currencySplitter(dataEl[d + '_Sum'].toString()))
                                .attr('transform', 'rotate(90,' + xVal + ',' + yVal + ')');
                        })
                        .on('mouseout', function (d) {

                            d3.select(this)
                                .style('stroke-width', '0')
                                .attr('opacity', 1);

                            tip.text('');
                        });
                });

                $('svg.opportunitieAgingCount').empty();

                x = d3.scale.linear()
                    .range([0, innerWidth / 2 - 1.5 * margin.left])
                    .domain([0, d3.max(keys, function (d) {
                        return d.count;
                    })]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickFormat(d3.format('d'));

                chart1 = d3.select('svg.opportunitieAgingCount')
                    .attr({
                        'width': outerWidth / 2,
                        'height': outerHeight
                    })
                    .append('g')
                    .attr('transform', 'translate(' + (margin.left) + ',' + margin.top + ')');

                chart1.append('g')
                    .attr('class', 'x axis')
                    .call(yAxis);

                chart1.append('g')
                    .attr('class', 'y axis')
                    .call(xAxis)
                    .attr('transform', 'translate(0,' + innerHeight + ')');

                chart1.selectAll('line.x')
                    .data(x.ticks())
                    .enter()
                    .append('line')
                    .attr({
                        'class': 'x',
                        'x1': x,
                        'x2': x,
                        'y1': y,
                        'y2': innerHeight,
                        'stroke': '#ccc'
                    });

                chart1.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'middle')
                    .attr('x', -innerHeight / 2)
                    .attr('y', -100)
                    .attr('transform', 'rotate(-90)')
                    .text(labelsMap.x);

                chart1.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'middle')
                    .attr('x', innerWidth / 4)
                    .attr('y', innerHeight + 60)
                    .text(labelsMap.yCount);

                baseX = {
                    '0-7': 0,
                    '8-15': 0,
                    '16-30': 0,
                    '31-60': 0,
                    '61-120': 0,
                    '>120': 0
                };

                tip1 = chart1.append('text')
                    .attr({
                        'class': 'tip',
                        'font-size': '14',
                        'text-anchor': 'middle',
                        'font-weight': 'bolder'
                    });

                data.forEach(function (dataEl) {

                    chart1.selectAll('.' + barsMap[dataEl.workflow])
                        .data(yScaleDomain)
                        .enter()
                        .append('rect')
                        .attr({
                            'class': barsMap[dataEl.workflow],
                            'x': function (d) {
                                baseX[d] += x(dataEl[d + '_Count']);
                                return baseX[d] - x(dataEl[d + '_Count']);
                            },
                            'y': function (d) {
                                return y(d) + verticalBarSpacing;
                            },
                            'width': function (d) {
                                var width = x(dataEl[d + '_Count']);

                                if (width > verticalBarSpacing) {
                                    return width - verticalBarSpacing;
                                } else {
                                    return width;
                                }
                            },
                            'height': y.rangeBand() - 2 * verticalBarSpacing,
                            'fill': colorMap[dataEl.workflow]
                        })
                        .on('mouseover', function (d) {
                            var attrs = this.attributes;
                            var xVal = parseFloat(attrs.x.value) + attrs.width.value / 2;
                            var yVal = parseFloat(attrs.y.value) + attrs.height.value / 2;

                            d3.select(this)
                                .style('stroke-width', '3')
                                .attr({
                                    'stroke': colorMap.barStroke,
                                    'opacity': 0.5
                                });

                            tip1
                                .attr('x', xVal)
                                .attr('y', (yVal + 5))
                                .text('$' + helpers.currencySplitter(dataEl[d + '_Sum'].toString()))
                                .attr('transform', 'rotate(90,' + xVal + ',' + yVal + ')');
                        })
                        .on('mouseout', function (d) {

                            d3.select(this)
                                .style('stroke-width', '0')
                                .attr('opacity', 1);

                            tip1.text('');
                        });
                });
            });
        },

        renderOpportunities: function (viewName) {
            var self = this;
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };

            $('.opportunitiesChart').empty();

            common.getOpportunitiesForChart(null, filter, null, function (data) {
                var margin = {top: 20, right: 160, bottom: 30, left: 160};
                var width = $('#content-holder').width() - margin.left - margin.right;
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
                var data5;
                var data6;
                var data7;
                var data8;
                var arrData;
                var arrSum;
                var colorMap;
                var maxHeight;
                var i;

                data.forEach(function (item) {

                    switch (item._id) {
                        case 'New':
                            data1 = item.data;
                            break;
                        case 'To estimate':
                            data2 = item.data;
                            break;
                        case 'Done estimate':
                            data3 = item.data;
                            break;
                        case 'Send offer':
                            data4 = item.data;
                            break;
                        case 'PM approve':
                            data5 = item.data;
                            break;
                        case 'Pre-development':
                            data6 = item.data;
                            break;
                        case 'In development':
                            data7 = item.data;
                            break;
                        case 'Lost':
                            data8 = item.data;
                            break;
                    }
                });

                colorMap = {
                    'bar': '#93648D', //violet
                    'bar2': '#4CC3D9', //blue
                    'bar3': '#F1DD9E', //brown green
                    'bar4': '#7BC8A4', //green
                    'bar5': '#FFC65D', //yellow
                    'bar6': '#5D4C46', //brown
                    'bar7': '#EB6E44', //orange
                    'bar8': '#93073E', //dark red
                    'barStroke': '#2378ae'
                };

                data1 = data1 || [];
                data2 = data2 || [];
                data3 = data3 || [];
                data4 = data4 || [];
                data5 = data5 || [];
                data6 = data6 || [];
                data7 = data7 || [];
                data8 = data8 || [];

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

                for (i = data5.length - 1; i >= 0; i--) {
                    if (data5[i] && !data5[i].sum || data5[i].sum === 0) {
                        data5.splice(i, 1);
                    }
                }

                for (i = data6.length - 1; i >= 0; i--) {
                    if (data6[i] && !data6[i].sum || data6[i].sum === 0) {
                        data6.splice(i, 1);
                    }
                }

                for (i = data7.length - 1; i >= 0; i--) {
                    if (data7[i] && !data7[i].sum || data7[i].sum === 0) {
                        data7.splice(i, 1);
                    }
                }

                for (i = data8.length - 1; i >= 0; i--) {
                    if (data8[i] && !data8[i].sum || data8[i].sum === 0) {
                        data8.splice(i, 1);
                    }
                }

                arrData = _.union(_.pluck(data1, 'salesPerson'), _.pluck(data2, 'salesPerson'), _.pluck(data3, 'salesPerson'), _.pluck(data4, 'salesPerson'), _.pluck(data5, 'salesPerson'), _.pluck(data6, 'salesPerson'), _.pluck(data7, 'salesPerson'));
                arrSum = _.map(_.groupBy(_.union(data1, data2, data3, data4, data5, data6, data7), 'salesPerson'), function (el) {
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
                    .style('fill', colorMap.bar)
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
                    .style('fill', colorMap.bar2)
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
                    .style('fill', colorMap.bar3)
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
                    .style('fill', colorMap.bar4)
                    .style('opacity', '0.8');

                chart.selectAll('.bar5')
                    .data(data5)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar5')
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

                        data4.forEach(function (item) {
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
                    .style('fill', colorMap.bar5)
                    .style('opacity', '0.8');

                chart.selectAll('.bar6')
                    .data(data6)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar6')
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

                        data4.forEach(function (item) {
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
                    .style('fill', colorMap.bar6)
                    .style('opacity', '0.8');

                chart.selectAll('.bar7')
                    .data(data7)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar7')
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

                        data4.forEach(function (item) {
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
                    .style('fill', colorMap.bar7)
                    .style('opacity', '0.8');

                chart.selectAll('.bar8')
                    .data(data7)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar8')
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

                        data4.forEach(function (item) {
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
                    .style('fill', colorMap.bar8)
                    .style('opacity', '0.8');

                chart.selectAll('.x .tick line')
                    .data(x.ticks())
                    .attr('y2', function (d) {
                        return -height;
                    }).style('opacity', '0.2');
            });
        },

        renderWonLost: function (viewName) {
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var verticalBarSpacing = 2;
            var percent = [];
            var self = this;
            var percentCircleRadius;
            var difference;
            var colorMap;
            var margin;
            var height;
            var format;
            var barMap;
            var yAxis2;
            var oneDay;
            var width;
            var value;
            var xAxis;
            var yAxis;
            var chart;
            var range;
            var start;
            var diff;
            var line;
            var day;
            var now;
            var y2;
            var x;
            var y;

            $('.winAndLostOpportunitiesChart').empty();

            common.getOpportunitiesForChart('date', filter, this.dateItem.WonLost, function (data) {

                /*   data = [
                 {
                 "_id"            : {"year": "2016", "mounth": "05", "day": "27"},
                 "wonCount"       : 4,
                 "lostCount"      : 1,
                 "inProgressCount": 2
                 }, {
                 "_id"            : {"year": "2016", "mounth": "06", "day": "07"},
                 "wonCount"       : 5,
                 "lostCount"      : 1,
                 "inProgressCount": 4
                 }, {
                 "_id"     : {"year": "2016", "mounth": "06", "day": "10"},
                 "wonCount": 0, "lostCount": 0, "inProgressCount": 0
                 }, {
                 "_id"            : {"year": "2016", "mounth": "06", "day": "13"},
                 "wonCount"       : 4,
                 "lostCount"      : 1,
                 "inProgressCount": 6
                 }, {
                 "_id"            : {"year": "2016", "mounth": "06", "day": "14"},
                 "wonCount"       : 10,
                 "lostCount"      : 4,
                 "inProgressCount": 5
                 }, {
                 "_id"            : {"year": "2016", "mounth": "06", "day": "15"},
                 "wonCount"       : 7,
                 "lostCount"      : 9,
                 "inProgressCount": 1
                 }, {
                 "_id"            : {"year": "2016", "mounth": "06", "day": "21"},
                 "wonCount"       : 3,
                 "lostCount"      : 1,
                 "inProgressCount": 1
                 }, {
                 "_id"            : {"year": "2016", "mounth": "07", "day": "06"},
                 "wonCount"       : 5,
                 "lostCount"      : 3,
                 "inProgressCount": 1
                 }
                 ];*/

                $('#timeBuildingDataFromServer').text('Server response in ' + self.buildTime + ' ms');

                margin = {
                    top: 20,
                    right: 160,
                    bottom: 190,
                    left: 160
                };

                width = $('#content-holder').width() - margin.left - margin.right;
                height = 500 - margin.top - margin.bottom;

                barMap = {
                    'wonCount': 'bar4',
                    'lostCount': 'bar5',
                    'inProgressCount': 'bar6'
                };

                colorMap = {
                    'wonCount': '#6CC062',
                    'lostCount': '#F68065',
                    'inProgressCount': '#00B4EA',
                    'percentLine': '#6CC062'
                };

                x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.6);

                y = d3.scale.linear()
                    .range([height, 0]);

                y2 = d3.scale.linear()
                    .range([height, 0]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickFormat(function (d) {
                        return d;
                    });

                yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(10)
                    .orient('left');

                yAxis2 = d3.svg.axis()
                    .scale(y2)
                    .orient('right')
                    .tickFormat(function (d) {
                        return d + '%';
                    });

                chart = d3.select('.winAndLostOpportunitiesChart')
                    .attr({
                        'width': width + margin.left + margin.right,
                        'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr({
                        'transform': 'translate(' + margin.left + ',' + margin.top + ')'
                    });

                switch (self.dateItem.WonLost) {
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
                            now = new Date(d.year, parseInt(d.mounth) - 1, d.day);
                            start = new Date(now.getFullYear(), 0, 0);
                            diff = now - start;
                            oneDay = 1000 * 60 * 60 * 24;
                            day = Math.floor(diff / oneDay);

                            //return dateFormat(new Date(d.year, parseInt(d.mounth) - 1, d.day).toString('MMMM ,yyyy'), 'mmmm dd, yyyy');
                            return moment(new Date(d.year, parseInt(d.mounth) - 1, d.day)).format('MMM DD, YYYY');
                        };
                        break;
                }

                line = d3.svg.line()
                    .x(function (d) {
                        return x(format(d.date)) + x.rangeBand() / 2;
                    })
                    .y(function (d) {
                        return y2(d.value);
                    })
                    .interpolate('monotone');

                data.forEach(function (d, i) {
                    if ((d.wonCount + d.inProgressCount + d.lostCount) === 0) {
                        data.splice(i, 1);
                    }
                });

                data.forEach(function (d, i) {

                    d.wonCount = d.wonCount || 0;
                    d.lostCount = d.lostCount || 0;
                    value = d.wonCount || d.lostCount ? (d.wonCount / (d.wonCount + d.lostCount) * 100) : 0;

                    percent.push({
                        date: d._id,
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
                    .attr({
                        'class': 'x axis',
                        'transform': 'translate(0,' + (height + 35) + ')'
                    })
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
                    .attr({
                        'class': 'y2 axis',
                        'transform': 'translate(' + width + ',0)'
                    })
                    .call(yAxis2);

                chart.append('text')
                    .attr({
                        'class': 'y label',
                        'text-anchor': 'end',
                        'y': -50,
                        'x': -50,
                        'dy': '.75em',
                        'transform': 'rotate(-90)'
                    })
                    .text('Number of Opportunities');

                chart.append('text')
                    .attr({
                        'class': 'y2 label',
                        'text-anchor': 'middle',
                        'y': -50,
                        'x': 120,
                        'dy': 0,
                        'transform': 'rotate(90), translate(0,' + (-width) + ')'
                    })
                    .text('Win percent');

                chart.selectAll('.bar4')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        'class': 'bar4',
                        'x': function (d) {
                            range = x.rangeBand();
                            difference = range > 70 ? (range - 70) / 2 : 0;

                            return x(format(d._id)) + difference;
                        },
                        'y': function (d) {
                            return y(d.wonCount);
                        },
                        'height': function (d) {
                            return height - y(d.wonCount);
                        },
                        'width': function () {
                            range = x.rangeBand();

                            return range < 70 ? range : 70;
                        },
                        'fill': colorMap.wonCount
                    });

                chart.selectAll('.bar5')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        'class': 'bar5',
                        'x': function (d) {
                            range = x.rangeBand();
                            difference = range > 70 ? (range - 70) / 2 : 0;

                            return x(format(d._id)) + difference;
                        },
                        'y': function (d) {
                            return y(d.inProgressCount + d.wonCount) - verticalBarSpacing;
                        },
                        'height': function (d) {
                            return height - y(d.inProgressCount);
                        },
                        'width': function () {
                            range = x.rangeBand();

                            return range < 70 ? range : 70;
                        },
                        'fill': colorMap.inProgressCount
                    });

                chart.selectAll('.bar6')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        'class': 'bar6',
                        'x': function (d) {
                            range = x.rangeBand();
                            difference = range > 70 ? ((range - 70) / 2) : 0;

                            return x(format(d._id)) + difference;
                        },
                        'y': function (d) {
                            return y(d.inProgressCount + d.wonCount + d.lostCount) - 2 * verticalBarSpacing;
                        },
                        'height': function (d) {
                            return height - y(d.lostCount);
                        },
                        'width': function () {
                            range = x.rangeBand();

                            return range < 70 ? range : 70;
                        },
                        'fill': colorMap.lostCount
                    });

                chart.append('path')
                    .datum(percent)
                    .attr({
                        'class': 'line',
                        'd': line
                    })
                    .style('stroke', colorMap.percentLine)
                    .style('stroke-width', 5);

                percentCircleRadius = (range < 70 ? range : 70) / 7;

                chart.selectAll('.circle')
                    .data(percent)
                    .enter().append('circle')
                    .attr({
                        'class': 'circle',
                        'cx': function (d) {
                            return x(format(d.date)) + x.rangeBand() / 2;
                        },
                        'cy': function (d) {
                            return y2(d.value);
                        },
                        'r': function (d) {
                            return percentCircleRadius * d.value / 100;
                        },
                        'fill': colorMap.percentLine,
                        'stroke': '#fff',
                        'stroke-width': '2'
                    });
            });
        },

        renderSalesByCountry: function (viewName) {
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var $wrapper = $('.content-holder');
            var dataUrl = '../../maps/';
            var padding = 15;
            var offset = 2;
            var barChart;
            var gradient;
            var height1;
            var xScale;
            var yScale;
            var margin;
            var width;
            var xAxis;
            var yAxis;
            var rect;
            var max;
            var svg;
            var tx;
            var ty;
            var g;
            var e;
            var i;
            var projection;
            var height;

            this.$el.find('.salesByCountryBarChart').empty();

            common.getSalesByCountry(filter, true, function (data) {

                function chooseRadius(csvData) {

                    max = d3.max(data, function (d) {
                        return d.pays;
                    });

                    for (i = data.length; i--;) {
                        if (csvData.CountryName === data[i]._id) {
                            return 20 * data[i].pays / max;
                        }
                    }
                }

                svg = d3.select('svg.salesByCountryChart');
                svg.selectAll('circle')
                    .transition().remove();
                g = svg.select('g');
                margin = {
                    top: 20,
                    right: 130,
                    bottom: 30,
                    left: 130
                };
                width = ($wrapper.width() - margin.right) / 2.1;
                height = parseInt($wrapper.width() / 4);

                if (!data) {
                    data = [];
                }
                height1 = data.length * 20;

                barChart = d3.select('svg.salesByCountryBarChart')
                    .attr({
                        'width': width - 30 + margin.left + margin.right,
                        'height': height1 + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                projection = d3.geo.mercator()
                    .translate([width / 2, height / 1.5])
                    .scale([width / 6]);

                data.sort(function (obj1, obj2) {
                    return obj2.pays - obj1.pays;
                });

                d3.csv(dataUrl + 'country-capitals.csv', function (error, data) {
                    g.selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr({
                            'cx': function (d) {
                                return projection([
                                    parseFloat(d.CapitalLongitude),
                                    parseFloat(d.CapitalLatitude)
                                ])[0];
                            },
                            'cy': function (d) {
                                return projection([
                                    parseFloat(d.CapitalLongitude),
                                    parseFloat(d.CapitalLatitude)]
                                )[1];
                            },
                            'r': function (d) {
                                return chooseRadius(d);
                            },
                            'fill': '#5CD1C8',
                            'opacity': 0.75,
                            'stroke': '#43A395',
                            'stroke-width': 1
                        });
                });

                max = d3.max(data, function (d) {
                    return d.pays / 100;
                });

                xScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, width - 30]);

                yScale = d3.scale.linear()
                    .domain([0, data.length])
                    .range([0, height1]);

                rect = height1 / (data.length);

                gradient = svg.append("linearGradient")
                    .attr({
                        'y1': 0,
                        'y2': 0,
                        'x1': '0',
                        'x2': width - 30,
                        'id': 'gradientBar',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset': '0',
                        'stop-color': '#FFA17F'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset': '0.5',
                        'stop-color': '#ACC7F2'
                    });

                barChart.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        x: function () {
                            return 0;
                        },
                        y: function (d, i) {
                            return yScale(i) + offset;
                        },
                        width: function (d) {
                            return xScale(d.pays / 100);
                        },
                        height: rect - 2 * offset,
                        fill: 'url(#gradientBar)'
                    });

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .tickSize(0)
                    .tickPadding(offset)
                    .tickFormat(function (d, i) {
                        return data[i]._id;
                    })
                    .tickValues(d3.range(data.length));

                barChart.append('g')
                    .attr({
                        'class': 'x axis',
                        'transform': 'translate(0,' + height1 + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class': 'y axis',
                        'transform': 'translate(0,' + (padding - 2 * offset) + ')'
                    })
                    .call(yAxis);

                barChart.selectAll('.x .tick line')
                    .attr({
                        'y2': function (d) {
                            return -height1
                        },
                        'style': 'stroke: #f2f2f2'
                    });
            });
        },

        renderLeads: function (viewName) {
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var $wrapper = $('#content-holder');
            var verticalBarSpacing = 1;
            var percentData = [];
            var percent = {};
            var padding = 40;
            var self = this;
            var offset = 0;
            var value = 0;
            var rectWidth;
            var daysCount;
            var barChart;
            var baseRect;
            var yScale2;
            var yOffset;
            var height;
            var margin;
            var xScale;
            var yScale;
            var yAxis2;
            var xAxis;
            var yAxis;
            var width;
            var month;
            var data2;
            var data1;
            var date;
            var base;
            var year;
            var keys;
            var line;
            var max2;
            var max1;
            var day;
            var max;
            var i;
            var j;

            $('svg.leadsBarChart').empty();

            common.getLeads(filter, function (data) {

                /*daysCount = Math.floor((new Date(self.endDateLeads) - new Date(self.startDateLeads)) / 24 / 60 / 60 / 1000);
                 */
                daysCount = Math.floor(moment.duration(dateArray[1] - dateArray[0]).asDays());

                data2 = _.filter(data[self.dateItem.Leads], function (item) {
                    return item.isOpp;
                });

                data1 = _.filter(data[self.dateItem.Leads], function (item) {
                    return !item.isOpp;
                });

                max1 = d3.max(data1, function (d) {
                        return d.count;
                    }) || 0;

                max2 = d3.max(data2, function (d) {
                        return d.count;
                    }) || 0;

                max = Math.ceil((max1 + max2) / 10) * 10;

                margin = {
                    top: 50,
                    right: 150,
                    bottom: 80,
                    left: 200
                };

                width = $wrapper.width() - margin.left - margin.right;
                height = $wrapper.width() / 4;

                barChart = d3.select('svg.leadsBarChart')
                    .attr({
                        'width': width + margin.left + margin.right,
                        'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                xScale = d3.time.scale()
                    .domain(dateArray)
                    .range([0, width]);

                yScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, height]);

                yScale2 = d3.scale.linear()
                    .domain([0, 100])
                    .range([height, 0]);

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .tickFormat(d3.time.format("%b %d"));

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .ticks(10)
                    .tickSize(0)
                    .tickPadding(padding)
                    .tickFormat(function (d, i) {
                        return Math.abs(d - max);
                    });

                yAxis2 = d3.svg.axis()
                    .scale(yScale2)
                    .orient('right')
                    .tickSize(0)
                    .tickPadding(padding)
                    .tickFormat(function (d, i) {
                        return d + '%';
                    });

                rectWidth = width / daysCount;

                if ((rectWidth - 4) > 0) {
                    offset = 2;
                    rectWidth = rectWidth - 2 * offset;
                }

                barChart.selectAll('.rect1')
                    .data(data1)
                    .enter()
                    .append('rect')
                    .attr({
                        x: function (d) {
                            date = (d._id).toString();
                            year = date.substr(0, 4);
                            month = date.substr(4, 2);
                            day = date.substr(6, 2);

                            return xScale(new Date(year + '-' + month + '-' + day));
                        },
                        y: function (d) {
                            return height - yScale(d.count)
                        },
                        width: rectWidth,
                        height: function (d) {
                            return yScale(d.count)
                        },
                        fill: '#57D0b5',
                        class: function (d) {
                            return 'total_' + d._id;
                        },
                        'transform': 'translate(' + (-(rectWidth / 2 + 2 * offset)) + ',0)'
                    });

                barChart.selectAll('.rect2')
                    .data(data2)
                    .enter()
                    .append('rect')
                    .attr({
                        x: function (d) {
                            date = (d._id).toString();
                            year = date.substr(0, 4);
                            month = date.substr(4, 2);
                            day = date.substr(6, 2);

                            return xScale(new Date(year + '-' + month + '-' + day));
                        },
                        y: function (d, i) {

                            baseRect = d3.select('rect.total_' + d._id);

                            if (baseRect[0][0]) {
                                yOffset = baseRect.attr('y') - verticalBarSpacing;
                            } else {
                                yOffset = height;
                            }

                            return yOffset - yScale(d.count)
                        },
                        width: rectWidth,
                        height: function (d) {

                            baseRect = d3.select('rect.total_' + d._id);

                            if (baseRect[0][0]) {
                                return yScale(d.count) - 2 * verticalBarSpacing;
                            }

                            return yScale(d.count);
                        },
                        fill: '#00B4EA',
                        'transform': 'translate(' + (-(rectWidth / 2 + 2 * offset)) + ',0)'
                    });

                for (i = 0; i < data1.length; i++) {
                    percent[data1[i]._id] = 0;
                }

                for (i = data2.length; i--;) {

                    base = data2[i].count;

                    for (j = data1.length; j--;) {

                        if (data1[j]._id === data2[i]._id) {
                            base = data1[j].count;

                            break;
                        }
                    }

                    value = data2[i].count / base;

                    if (value > 1) {
                        value = 1;
                    }

                    percent[data2[i]._id] = value;
                }

                keys = Object.keys(percent).sort();

                for (i = 0; i < keys.length; i++) {
                    percentData.push({
                        date: keys[i],
                        value: percent[keys[i]]
                    })
                }

                line = d3.svg.line()
                    .x(function (d) {
                        var date = d.date;
                        var year = date.substr(0, 4);
                        var month = date.substr(4, 2);
                        var day = date.substr(6, 2);

                        return xScale(new Date(year + '-' + month + '-' + day)) - 2 * offset || 0;
                    })
                    .y(function (d) {
                        return yScale2(d.value * 100);
                    })
                    .interpolate('monotone');

                barChart.append('path')
                    .datum(percentData)
                    .attr({
                        'class': 'line1',
                        'd': line,
                        'fill': 'none'
                    })
                    .style('stroke', '#00B4EA')
                    .style('stroke-width', 2);

                barChart.selectAll('.circle')
                    .data(percentData)
                    .enter().append('circle')
                    .attr({
                        'class': 'circle',
                        'cx': function (d) {
                            var date = d.date;
                            var year = date.substr(0, 4);
                            var month = date.substr(4, 2);
                            var day = date.substr(6, 2);
                            return xScale(new Date(year + '-' + month + '-' + day)) - 2 * offset || 0;
                        },
                        'cy': function (d) {
                            return yScale2(d.value * 100);
                        },
                        'r': 3,
                        'fill': '#00B4EA',
                        'stroke': '#fff',
                        'stroke-width': '1'
                    });

                barChart.append('g')
                    .attr({
                        'class': 'x axis',
                        'transform': 'translate(0,' + height + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class': 'y axis'
                    })
                    .call(yAxis)
                    .append('text')
                    .text('Number Of Leads')
                    .select('path.domain')
                    .attr({
                        'style': 'display: none'
                    });

                barChart.append('g')
                    .attr({
                        'class': 'y2 axis2',
                        'transform': 'translate(' + (width) + ',0)'
                    })
                    .call(yAxis2)
                    .select('path.domain')
                    .attr({
                        'style': 'display: none'
                    });

                barChart.selectAll('.y .tick line')
                    .attr({
                        'x2': function (d) {
                            return width + 1.4 * padding;
                        },
                        'stroke': '#f2f2f2',
                        'transform': 'translate(' + (-0.7 * padding) + ',0)'
                    });
            });
        },

        renderLeadsByName: function (viewName) {
            var dateArray = this[viewName].dateArray;
            var filter = {
                date: {
                    value: dateArray
                }
            };
            var $wrapper = $('#content-holder');
            var self = this;
            var padding = 15;
            var offset = 2;
            var barChart;
            var gradient;
            var height;
            var margin;
            var xScale;
            var yScale;
            var xAxis;
            var yAxis;
            var width;
            var rect;
            var max;

            d3.selectAll('svg.leadsByNameBarChart > *').remove();

            common.getLeads(filter, function (data) {
                data = data[self.dateItem.LeadsByName];
                margin = {top: 50, right: 150, bottom: 30, left: 140};
                width = ($wrapper.width() - margin.right /*- margin.left*/);
                height = data.length * 20;

                barChart = d3.select('svg.leadsByNameBarChart')
                    .attr({
                        'width': width + margin.left / 2,
                        'height': height + margin.bottom + margin.top
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                max = d3.max(data, function (d) {
                    return d.count;
                });

                max = Math.ceil(max / 10) * 10;

                xScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, (width - margin.left)]);

                yScale = d3.scale.linear()
                    .domain([0, data.length])
                    .range([0, height]);

                rect = height / (data.length);

                gradient = d3.select('svg.leadsByNameBarChart').append('linearGradient')
                    .attr({
                        'y1': 0,
                        'y2': 0,
                        'x1': '0',
                        'x2': width - 30,
                        'id': 'gradientBarForLeads',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset': '0',
                        'stop-color': '#FFA17F'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset': '0.5',
                        'stop-color': '#ACC7F2'
                    });

                barChart.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        x: function () {
                            return 0;
                        },
                        y: function (d, i) {
                            return yScale(i) + offset;
                        },
                        width: function (d) {
                            return xScale(d.count);
                        },
                        height: rect - 2 * offset,
                        fill: 'url(#gradientBarForLeads)'
                    });

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .tickSize(0)
                    .tickPadding(offset)
                    .tickFormat(function (d, i) {
                        return data[i].salesPerson;
                    })
                    .tickValues(d3.range(data.length));

                barChart.append('g')
                    .attr({
                        'class': 'x axis',
                        'transform': 'translate(0,' + height + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class': 'y axis',
                        'transform': 'translate(0,' + (padding - 2 * offset) + ')'
                    })
                    .call(yAxis);

                barChart.selectAll('.x .tick line')
                    .attr({
                        'y2': -height,
                        'style': 'stroke: #f2f2f2'
                    });

                barChart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -55)
                    .attr('x', 10)
                    .attr('dy', '2em')
                    .text('Lead Name');

                barChart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -height + 20)
                    .attr('x', width - 60)
                    .attr('dy', '2em')
                    .text('Number of Leads');
            });
        },

        renderMap: function () {
            var $wrapper = $('.content-holder');
            var dataUrl = '../../maps/';
            var continentLabel = [
                {
                    continent: 'Asia',
                    longitude: 107,
                    latitude: 63
                },
                {
                    continent: 'Europe',
                    longitude: 4.9,
                    latitude: 52
                },
                {
                    continent: 'South America',
                    longitude: -76,
                    latitude: -11
                },
                {
                    continent: 'Africa',
                    longitude: 7.5,
                    latitude: 9
                },
                {
                    continent: 'North America',
                    longitude: -130,
                    latitude: 55
                },
                {
                    continent: 'Australia',
                    longitude: 125,
                    latitude: -25
                }
            ];
            var projection;
            var margin;
            var height;
            var width;
            var path;
            var svg;
            var g;

            d3.selectAll('svg.salesByCountryChart > *').remove();

            margin = {
                top: 20,
                right: 130,
                bottom: 30,
                left: 130
            };

            width = ($wrapper.width() - margin.right) / 2.1;
            height = parseInt($wrapper.width() / 4);

            projection = d3.geo.mercator()
                .translate([width / 2, height / 1.5])
                .scale([width / 6]);

            path = d3.geo.path().projection(projection);

            svg = d3.select('svg.salesByCountryChart')
                .attr({
                    'width': width,
                    'height': height,
                    'style': 'background: #ACC7F2'
                })
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            g = svg.append('g');

            d3.json(dataUrl + 'world-110m2.json', function (error, topology) {

                g.selectAll('path')
                    .data(topojson.object(topology, topology.objects.countries)
                        .geometries)
                    .enter()
                    .append('path')
                    .attr({
                        'd': path,
                        'fill': '#F4F3EF',
                        'id': function (d) {
                            return d.id;
                        }
                    });

                g.selectAll('text')
                    .data(continentLabel)
                    .enter()
                    .append('text')
                    .text(function (d) {
                        return d.continent;
                    })
                    .attr({
                        'x': function (d) {
                            return projection([
                                parseFloat(d.longitude),
                                parseFloat(d.latitude)
                            ])[0];
                        },
                        'y': function (d) {
                            return projection([
                                parseFloat(d.longitude),
                                parseFloat(d.latitude)]
                            )[1];
                        }
                    });
            });
        },

        renderTreemap: function () {
            var $wrapper = $('.content-holder');
            var filter = {
                date: {
                    value: [new Date(this.startDate), new Date(this.endDate)]
                }
            };
            var margin;
            var width;
            var maxValue;
            var minValue;
            var height;
            var color;
            var treemap;
            var div;
            var root;
            var node;

            d3.selectAll('div.treemap_sales > *').remove();

            common.totalInvoiceBySales(filter, function (data) {

                function position() {
                    this.style('left', function (d) {
                        return d.x + 'px';
                    })
                        .style('top', function (d) {
                            return d.y + 'px';
                        })
                        .style('width', function (d) {
                            return Math.max(0, d.dx - 1) + 'px';
                        })
                        .style('height', function (d) {
                            return Math.max(0, d.dy - 1) + 'px';
                        });
                }

                if (!data.length) {
                    data[0] = {
                        name: '',
                        payment: 0
                    }
                }

                margin = {top: 0, right: 10, bottom: 10, left: 125};
                width = $wrapper.width() / 2 - margin.left - margin.right;
                height = parseInt($wrapper.width() / 4);

                maxValue = d3.max(data, function (d) {
                    return d.payment / 100;
                });

                minValue = d3.min(data, function (d) {
                    return d.payment / 100;
                });
                //['#ACC7F2','#F4F3EF']
                color = d3.scale.linear()
                    .range(['#FFA17F', '#ACC7F2'])
                    .domain([minValue, maxValue]);

                treemap = d3.layout.treemap()
                    .size([width, height])
                    .sticky(true)
                    .value(function (d) {
                        return d.payment;
                    });

                div = d3.select('.treemap_sales')
                    .append('div')
                    .style('height', height + 'px')
                    .style('position', 'relative');

                root = {
                    name: 'tree',
                    children: data
                };

                node = div.datum(root).selectAll('.node')
                    .data(treemap.nodes)
                    .enter().append('div')
                    .attr('class', 'nodeTree')
                    .call(position)
                    .style('background', function (d) {
                        return color(d.payment / 100);
                    })
                    .text(function (d) {
                        return d.children ? null : d.name + ',  $' + helpers.currencySplitter((d.payment / 100).toFixed(0));
                    });

                d3.selectAll('input').on('change', function change() {
                    var value = this.value === 'count'
                        ? function () {
                            return 1;
                        }
                        : function (d) {
                            return d.size;
                        };

                    node
                        .data(treemap.value(value).nodes)
                        .transition()
                        .duration(1500)
                        .call(position);
                });
            });
        }
    });

    return ContentView;
});
