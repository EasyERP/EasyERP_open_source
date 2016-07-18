define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Dashboard/DashboardTemplate.html',
    'custom',
    'collections/Filter/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Jobs/filterCollection',
    'd3',
    'common',
    'dataService',
    'helpers',
    'moment',
    'topojson'
], function (Backbone, $, _, DashboardTemplate, Custom, filterValuesCollection, workflowsCollection, OpportunitiesCollection, LeadsCollection, d3, common, dataService, helpers, moment, topojson) {

    var ContentView = Backbone.View.extend({
        contentType: 'Dashboard',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',

        initialize : function (options) {
            this.leadsCollection = new LeadsCollection();
            this.startTime = options.startTime;
            this.startTime = new Date();
            this.buildTime = 0;
            this.dateRange = {
                date                  : 30,
                source                : 30,
                opportunitie          : 30,
                sale                  : 7,
                opportunitieConversion: 90,
                winLost               : 30,
                salesByCountry        : 30
            };

            this.dateItem = {
                date       : 'D',
                winLost    : 'D',
                leadsByName: '',
                leadsChart : 'createdBy'
            };

            this.numberToDate = {};
            this.source = null;
            this.resizeHandler = _.debounce(this.resizeHandler, 500);
            this.resizeHandler = this.resizeHandler.bind(this);
            this.render();
        },

        events: {
            'click .dateRange'                                                    : 'toggleDateRange',
            'click .dateRangeLeadsByName'                                         : 'toggleDateRange',
            'click .dateRangeLeads'                                               : 'toggleDateRange',
            'click #updateDate'                                                   : 'changeDateRange',
            'click #updateDateLeadsByName'                                        : 'changeLeadsDateRangeByName',
            'click #updateDateLeads'                                              : 'changeLeadsDateRange',
            'click li.filterValues:not(#custom, #customLeads, #customLeadsByName)': 'setDateRange',
            'click .choseDateRange .item'                                         : 'newRange',
            'click .choseDateItem .item'                                          : 'newItem',
            'click .chart-tabs a'                                                 : 'changeTab',
            'click #custom'                                                       : 'showDatePickers',
            'click #customLeadsByName'                                            : 'showDatePickersLeadsByName',
            'click #customLeads'                                                  : 'showDatePickersLeads',
            'click #cancelBtn'                                                    : 'cancel',
            'click #cancelBtnLeadsByName'                                         : 'cancel',
            'click #leadsCancelBtn'                                               : 'cancel'
        },

        setDateRange: function (e) {
            var date = moment(new Date());
            var $target = $(e.target);
            var isLeads = $target.hasClass('leads');
            var id = $target.attr('id');
            var type = '';
            var quarter;
            var startDate;
            var endDate;

            switch ($target.attr('data-type')) {
                case 'leads':
                    type = 'Leads';
                    break;
                case 'leadsName':
                    type = 'LeadsByName';
                    break;
                default:
                    type = '';
            }

            this.$el.find('.customTime' + type).addClass('hidden');
            this.removeAllChecked(type);
            $target.toggleClass('checkedValue');

            switch (id) {
                case 'thisMonth' + type:
                    startDate = date.startOf('month');
                    endDate = moment(startDate).endOf('month');
                    break;
                case 'thisYear' + type:
                    startDate = date.startOf('year');
                    endDate = moment(startDate).endOf('year');
                    break;
                case 'lastMonth' + type:
                    startDate = date.subtract(1, 'month').startOf('month');
                    endDate = moment(startDate).endOf('month');
                    break;
                case 'lastQuarter' + type:
                    quarter = date.quarter();
                    startDate = date.quarter(quarter - 1).startOf('quarter');
                    endDate = moment(startDate).endOf('quarter');
                    break;
                case 'lastYear' + type:
                    startDate = date.subtract(1, 'year').startOf('year');
                    endDate = moment(startDate).endOf('year');
                    break;
                default:
                    break;
            }

            this.$el.find('#startDate' + type).datepicker('setDate', new Date(startDate));
            this.$el.find('#endDate' + type).datepicker('setDate', new Date(endDate));
            this.changeDateRange(null, type);
        },

        changeLeadsDateRangeByName: function (e) {
            this.changeDateRange(null, 'LeadsByName')
        },

        changeLeadsDateRange: function (e) {
            this.changeDateRange(null, 'Leads')
        },

        changeDateRange: function (e, type) {
            var dateFilter;
            var startDate;
            var endDate;
            var startTime;
            var endTime;

            dateFilter = e ? $(e.target).closest('ul.dateFilter' + type) : this.$el.find('ul.dateFilter' + type);
            startDate = dateFilter.find('#startDate' + type);
            endDate = dateFilter.find('#endDate' + type);
            startTime = dateFilter.find('#startTime' + type);
            endTime = dateFilter.find('#endTime' + type);
            startDate = startDate.val();
            endDate = endDate.val();
            startTime.text(startDate);
            endTime.text(endDate);

            switch (type) {
                case 'Leads':
                    this.startDateLeads = startDate;
                    this.endDateLeads = endDate;
                    this.renderLeadsChart();
                    this.toggleDateRange(null, type);
                    break;
                case 'LeadsByName':
                    this.startDateLeadsByName = startDate;
                    this.endDateLeadsByName = endDate;
                    this.renderLeadsChartByName();
                    this.toggleDateRange(null, type);
                    break;
                default:
                    this.startDate = startDate;
                    this.endDate = endDate;
                    this.toggleDateRange(null, '');
                    this.renderSalesByCountry();
                    this.renderTreemap();
                    break;
            }

            this.trigger('changeDateRange');
        },

        toggleDateRange: function (e, type) {
            var ul = e ? $(e.target).closest('ul') : this.$el.find('.dateFilter' + type);

            if (!ul.hasClass('frameDetail')) {
                ul.find('.frameDetail').toggleClass('hidden');
            } else {
                ul.toggleClass('hidden');
            }
        },

        removeAllChecked: function (type) {
            var filter = this.$el.find('ul.dateFilter' + type);
            var li = filter.find('li');

            li.removeClass('checkedValue');
        },

        showDatePickers: function (e) {
            var $target = $(e.target);
            this.removeAllChecked();
            $target.toggleClass('checkedValue');
            this.$el.find('.customTime').toggleClass('hidden');
        },

        showDatePickersLeads: function (e) {
            var $target = $(e.target);
            this.removeAllChecked('Leads');

            $target.toggleClass('checkedValue');
            this.$el.find('.customTimeLeads').toggleClass('hidden');
        },


        showDatePickersLeadsByName: function (e) {
            var $target = $(e.target);
            this.removeAllChecked('LeadsByName');

            $target.toggleClass('checkedValue');
            this.$el.find('.customTimeLeadsByName').toggleClass('hidden');
        },

        cancel: function (e) {
            var targetEl = $(e.target);
            var ul = targetEl.closest('ul.frameDetail');

            ul.addClass('hidden');
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
                case 'leadsByName':
                    this.renderLeadsChartByName();
                    break;
                case 'leadsChart':
                    this.renderLeadsChart();
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
            self.renderTreemap();
            self.renderOpportunitiesWinAndLost();
            self.renderOpportunitiesConversion();
            self.renderOpportunitiesAging();
            self.renderSalesByCountry();
        },

        bindDatePickers: function (startDate, endDate, type) {
            var self = this;
            var endDatePicker;
            var endDateValue;

            this.$el.find('#startDate' + type)
                .datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    defaultDate: startDate,
                    onSelect   : function () {
                        endDatePicker = self.$endDate;
                        endDatePicker.datepicker('option', 'minDate', $(this).val());
                        endDateValue = moment(new Date($(this).val())).endOf('month');
                        endDateValue = new Date(endDateValue);
                        endDatePicker.datepicker('setDate', endDateValue);

                        return false;
                    }
                })
                .datepicker('setDate', startDate);
            this.$endDate = this.$el.find('#endDate' + type)
                .datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    defaultDate: endDate
                })
                .datepicker('setDate', endDate);
        },

        render: function () {
            var date = moment(new Date());

            this.startDate = (date.startOf('month')).format('D MMM, YYYY');
            this.endDate = (moment(this.startDate).endOf('month')).format('D MMM, YYYY');
            this.startDateLeadsByName = this.startDate;
            this.endDateLeadsByName = this.endDate;
            this.startDateLeads = this.startDate;
            this.endDateLeads = this.endDate;

            this.$el.html(this.template({
                startDate            : this.startDate,
                endDate              : this.endDate,
                startDateLeads       : this.startDateLeads,
                endDateLeads         : this.endDateLeads,
                startDateLeadsByNames: this.startDateLeadsByName,
                endDateLeadsByNames  : this.endDateLeadsByName
            }));
            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');
            this.bindDatePickers(this.startDate, this.endDate, '');
            this.bindDatePickers(this.startDateLeadsByName, this.endDateLeadsByName, 'LeadsByName');
            this.bindDatePickers(this.startDateLeads, this.endDateLeads, 'Leads');
            this.resizeHandler();
            this.renderSalesByCountry();
            this.renderTreemap();
            this.renderLeadsChart();
            this.renderLeadsChartByName();

            return this;
        },

        renderLeadsChartByName: function () {
            var $wrapper = $('#content-holder');
            var parsedData = {};
            var dataObj = [];
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
            var keys;
            var rect;
            var max;
            var i;
            var j;

            d3.selectAll('svg.leadsByNameBarChart > *').remove();

            common.getLeads({
                startDay: this.startDateLeadsByName,
                endDay  : this.endDateLeadsByName,
                stage   : this.dateItem.leadsByName
            }, function (data) {

                data = data.assignedTo;

                for (i = data.length; i--;) {

                    for (j = data[i].salesByDay.length; j--;) {

                        if (!parsedData[data[i].salesByDay[j].salesPerson]) {
                            parsedData[data[i].salesByDay[j].salesPerson] = data[i].salesByDay[j].count;
                        } else {
                            parsedData[data[i].salesByDay[j].salesPerson] += data[i].salesByDay[j].count;
                        }
                    }
                }

                keys = Object.keys(parsedData);

                for (i = 0; i < keys.length; i++) {
                    dataObj.push({
                        name : keys[i],
                        count: parsedData[keys[i]]
                    })
                }

                margin = {top: 50, right: 150, bottom: 30, left: 140};
                width = ($wrapper.width() - margin.right /*- margin.left*/);
                height = keys.length * 20;

                barChart = d3.select('svg.leadsByNameBarChart')
                    .attr({
                        'width' : width + margin.left / 2,
                        'height': height + margin.bottom + margin.top
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                max = d3.max(dataObj, function (d) {
                    return d.count;
                });

                max = Math.ceil(max / 10) * 10;

                xScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, (width - margin.left)]);

                yScale = d3.scale.linear()
                    .domain([0, dataObj.length])
                    .range([0, height]);

                rect = height / (dataObj.length);

                gradient = d3.select('svg.leadsByNameBarChart').append("linearGradient")
                    .attr({
                        'y1'           : 0,
                        'y2'           : 0,
                        'x1'           : '0',
                        'x2'           : width - 30,
                        'id'           : 'gradientBarForLeads',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0',
                        'stop-color': '#FFA17F'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0.5',
                        'stop-color': '#ACC7F2'
                    });

                barChart.selectAll('rect')
                    .data(dataObj)
                    .enter()
                    .append('rect')
                    .attr({
                        x     : function () {
                            return 0;
                        },
                        y     : function (d, i) {
                            return yScale(i) + offset;
                        },
                        width : function (d) {
                            return xScale(d.count);
                        },
                        height: rect - 2 * offset,
                        fill  : 'url(#gradientBarForLeads)'
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
                        return keys[i];
                    })
                    .tickValues(d3.range(dataObj.length));

                barChart.append('g')
                    .attr({
                        'class'    : 'x axis',
                        'transform': 'translate(0,' + height + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class'    : 'y axis',
                        'transform': 'translate(0,' + (padding - 2 * offset) + ')'
                    })
                    .call(yAxis);

                barChart.selectAll('.x .tick line')
                    .attr({
                        'y2'   : -height,
                        'style': 'stroke: #f2f2f2'
                    });
            })
        },

        renderLeadsChart: function () {
            var $wrapper = $('#content-holder');
            var self = this;
            var offset = 0;
            var padding = 40;
            var max;
            var rectWidth;
            var barChart;
            var xScale;
            var yScale;
            var xAxis;
            var yAxis;
            var width;
            var height;
            var margin;
            var i;

            $('svg.leadsBarChart').empty();

            common.getLeads({
                startDay: this.startDateLeads,
                endDay  : this.endDateLeads
            }, function (data) {
                max = d3.max(data[self.dateItem.leadsChart], function (d) {
                    return d.count;
                });

                max = Math.ceil(max / 10) * 10;

                margin = {
                    top   : 50,
                    right : 150,
                    bottom: 80,
                    left  : 200
                };

                width = $wrapper.width() - margin.left - margin.right;
                height = $wrapper.width() / 4;

                barChart = d3.select('svg.leadsBarChart')
                    .attr({
                        'width' : width + margin.left + margin.right,
                        'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                xScale = d3.time.scale()
                    .domain([new Date(self.startDateLeads), new Date(self.endDateLeads)])
                    .range([0, width]);

                yScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, height]);

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .tickFormat(d3.time.format("%b %d"));

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .tickSize(0)
                    .tickPadding(padding)
                    .tickFormat(function (d, i) {
                        return -(d - max);
                    });

                rectWidth = width / Math.floor((new Date(self.endDateLeads) - new Date(self.startDateLeads)) / 24 / 60 / 60 / 1000);

                if ((rectWidth - 4) > 0) {
                    offset = 2;
                    rectWidth = rectWidth - 2 * offset;
                }

                barChart.selectAll('rect')
                    .data(data[self.dateItem.leadsChart])
                    .enter()
                    .append('rect')
                    .attr({
                        x          : function (d) {
                            var date = (d._id).toString();
                            var year = date.substr(0, 4);
                            var month = date.substr(4, 2);
                            var day = date.substr(6, 2);
                            return xScale(new Date(year + '-' + month + '-' + day));
                        },
                        y          : function (d) {
                            return height - yScale(d.count)
                        },
                        width      : rectWidth,
                        height     : function (d) {
                            return yScale(d.count)
                        },
                        fill       : '#57D0b5',
                        'transform': 'translate(' + (-(rectWidth / 2 + 2 * offset)) + ',0)'
                    });

                barChart.append('g')
                    .attr({
                        'class'    : 'x axis',
                        'transform': 'translate(0,' + height + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class': 'y axis'
                    })
                    .call(yAxis)
                    .select('path.domain')
                    .attr({
                        'style': 'display: none'
                    });

                barChart.selectAll('.y .tick line')
                    .attr({
                        'x2'       : function (d) {
                            return width + 1.4 * padding;
                        },
                        'stroke'   : '#f2f2f2',
                        'transform': 'translate(' + (-0.7 * padding) + ',0)'
                    });
            });
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
                    width = $('#content-holder').width() - margin.left - margin.right,
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
                    left  : 150
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
                var verticalBarSpacing = 3;
                var tooltip = d3.select('div.invoiceTooltip');
                var margin;
                var x;
                var y;
                var xAxis;
                var yAxis;
                var xScaleDomain;
                var baseY;
                var baseX;
                var chart;
                var chart1;
                var tip;
                var tip1;
                var colorMap;
                var yScaleDomain;
                var outerWidth;
                var outerHeight;
                var innerWidth;
                var innerHeight;
                var barsMap;
                var labelsMap;

                labelsMap = {
                    ySum  : 'Opportunities Expected Revenue Sum',
                    yCount: 'Opportunities Count',
                    x     : 'Last Activity Days Ranges'
                };

                baseX = {
                    '0-7'   : 0,
                    '8-15'  : 0,
                    '16-30' : 0,
                    '31-60' : 0,
                    '61-120': 0,
                    '>120'  : 0
                };

                barsMap = {
                    'Waiting fo response': 'bar6',
                    'To be discussed'    : 'bar7',
                    'To be done'         : 'bar9',
                    'In development'     : 'bar4',
                    'Finalization'       : 'bar8'
                };

                colorMap = {
                    'Waiting fo response': '#4CC3D9', //blue
                    'To be discussed'    : '#7BC8A4', //green
                    'To be done'         : '#EB6E44', //orange
                    'In development'     : '#FFC65D', //yellow
                    'Finalization'       : '#93648D', //violet
                    'barStroke'          : '#2378ae'
                };

                margin = {
                    top   : 20,
                    right : 50,
                    bottom: 100,
                    left  : 140
                };

                yScaleDomain = ['>120', '61-120', '31-60', '16-30', '8-15', '0-7'];
                outerWidth = $('#content-holder').width() - 40;
                outerHeight = 600;
                innerWidth = outerWidth - margin.left - margin.right;
                innerHeight = outerHeight - margin.top - margin.bottom;

                $('svg.opportunitieAgingSum').empty();

                x = d3.scale.linear()
                    .range([0, (innerWidth / 2 - margin.right)])
                    .domain([0, d3.max(data, function (d) {
                        return d['0-7_Sum'] + d['8-15_Sum'] + d['16-30_Sum'] + d['31-60_Sum'] + d['61-120_Sum'] + d['>120_Sum'];
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
                        'width' : outerWidth / 2,
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
                        'class' : 'x',
                        'x1'    : x,
                        'x2'    : x,
                        'y1'    : y,
                        'y2'    : innerHeight,
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

                data.forEach(function (dataEl) {

                    chart.selectAll('.' + barsMap[dataEl.workflow])
                        .data(yScaleDomain)
                        .enter()
                        .append('rect')
                        .attr({
                            'class' : barsMap[dataEl.workflow],
                            'x'     : function (d) {
                                baseX[d] += x(dataEl[d + '_Sum']);
                                return baseX[d] - x(dataEl[d + '_Sum']);
                            },
                            'y'     : function (d) {
                                return y(d) + verticalBarSpacing;
                            },
                            'width' : function (d) {
                                var width = x(dataEl[d + '_Sum']);

                                if (width > verticalBarSpacing) {
                                    return width - verticalBarSpacing;
                                } else {
                                    return width;
                                }
                            },
                            'height': y.rangeBand() - 2 * verticalBarSpacing,
                            'fill'  : colorMap[dataEl.workflow]
                        })
                        .on('mouseover', function (d) {
                            var attrs = this.attributes;
                            var xVal =  parseFloat(attrs.x.value) + attrs.width.value / 2;
                            var yVal = parseFloat(attrs.y.value) + attrs.height.value / 2;

                            d3.select(this)
                                .style('stroke-width', '3')
                                .attr('stroke', colorMap.barStroke);
                            
                            tip
                                .attr('x', xVal)
                                .attr('y', (yVal + 5))
                                .text('$' + helpers.currencySplitter(dataEl[d + '_Sum'].toString()))
                                .attr('transform', 'rotate(90,'+ xVal + ','+ yVal +')');
                        })
                        .on('mouseout', function (d) {
                            d3.select(this)
                                .style('stroke-width', '0');

                            tip.text('');
                        });
                });

                tip = chart.append('text')
                    .attr({
                        'class'      : 'tip',
                        'font-size'  : '12',
                        'text-anchor': 'middle'
                    });

                $('svg.opportunitieAgingCount').empty();

                x = d3.scale.linear()
                    .range([0, innerWidth / 2 - 1.5 * margin.left])
                    .domain([0, d3.max(data, function (d) {
                        return d['0-7_Count'] + d['8-15_Count'] + d['16-30_Count'] + d['31-60_Count'] + d['61-120_Count'] + d['>120_Count'];
                    })]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickFormat(d3.format('d'));

                chart1 = d3.select('svg.opportunitieAgingCount')
                    .attr({
                        'width' : outerWidth / 2,
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
                        'class' : 'x',
                        'x1'    : x,
                        'x2'    : x,
                        'y1'    : y,
                        'y2'    : innerHeight,
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
                    '0-7'   : 0,
                    '8-15'  : 0,
                    '16-30' : 0,
                    '31-60' : 0,
                    '61-120': 0,
                    '>120'  : 0
                };

                data.forEach(function (dataEl) {

                    chart1.selectAll('.' + barsMap[dataEl.workflow])
                        .data(yScaleDomain)
                        .enter()
                        .append('rect')
                        .attr({
                            'class' : barsMap[dataEl.workflow],
                            'x'     : function (d) {
                                baseX[d] += x(dataEl[d + '_Count']);
                                return baseX[d] - x(dataEl[d + '_Count']);
                            },
                            'y'     : function (d) {
                                return y(d) + verticalBarSpacing;
                            },
                            'width' : function (d) {
                                var width = x(dataEl[d + '_Count']);

                                if (width > verticalBarSpacing) {
                                    return width - verticalBarSpacing;
                                } else {
                                    return width;
                                }
                            },
                            'height': y.rangeBand() - 2 * verticalBarSpacing,
                            'fill'  : colorMap[dataEl.workflow]
                        })
                        .on('mouseover', function (d) {
                            var attrs = this.attributes;
                            var xVal =  parseFloat(attrs.x.value) + attrs.width.value / 2;
                            var yVal = parseFloat(attrs.y.value) + attrs.height.value / 2;

                            d3.select(this)
                                .style('stroke-width', '3')
                                .attr('stroke', colorMap.barStroke);

                            tip1
                                .attr('x', xVal)
                                .attr('y', (yVal + 5))
                                .text('$' + helpers.currencySplitter(dataEl[d + '_Sum'].toString()))
                                .attr('transform', 'rotate(90,'+ xVal + ','+ yVal +')');
                        })
                        .on('mouseout', function (d) {
                            d3.select(this)
                                .style('stroke-width', '0');

                            tip1.text('');
                        });
                });

                tip1 = chart1.append('text')
                    .attr({
                        'class'      : 'tip',
                        'font-size'  : '12',
                        'text-anchor': 'middle'
                    });

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
                var width = $('#content-holder').width() - margin.left - margin.right;
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
                var arrData;
                var arrSum;
                var maxHeight;
                var i;

                self.opportunitiesData = data;

                data.forEach(function (item) {

                    switch(item._id){
                        case 'Waiting fo response':
                            data1 = item.data;
                            break;
                        case 'To be discussed':
                            data2 = item.data;
                            break;
                        case 'To be done':
                            data3 = item.data;
                            break;
                        case 'In development':
                            data4 = item.data;
                            break;
                        case 'Finalization':
                            data4 = item.data;
                            break;
                    }
                });

                data1 = data1 || [];
                data2 = data2 || [];
                data3 = data3 || [];
                data4 = data4 || [];
                data5 = data5 || [];

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
                    .style('fill', '#4CC3D9')
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
                    .style('fill', '#7BC8A4')
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
                    .style('fill', '#EB6E44')
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
                    .style('fill', '#FFC65D')
                    .style('opacity', '0.8');

                chart.selectAll('.bar5')
                    .data(data4)
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
                    .style('fill', '#93648D')
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
                    width = $('#content-holder').width() - margin.left - margin.right,
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

        renderSalesByCountry: function () {
            var self = this;
            var continentLabel = [
                {
                    continent: 'Asia',
                    longitude: 107,
                    latitude : 63
                },
                {
                    continent: 'Europe',
                    longitude: 4.9,
                    latitude : 52
                },
                {
                    continent: 'South America',
                    longitude: -76,
                    latitude : -11
                },
                {
                    continent: 'Africa',
                    longitude: 7.5,
                    latitude : 9
                },
                {
                    continent: 'North America',
                    longitude: -130,
                    latitude : 55
                },
                {
                    continent: 'Australia',
                    longitude: 125,
                    latitude : -25
                }
            ];
            var dataUrl = '../../maps/';
            var $wrapper = $('.content-holder');
            var offset = 2;
            var padding = 15;
            var projection;
            var barChart;
            var gradient;
            var margin;
            var path;
            var width;
            var height;
            var height1;
            var xScale;
            var yScale;
            var xAxis;
            var yAxis;
            var rect;
            var zoom;
            var max;
            var svg;
            var tx;
            var ty;
            var g;
            var e;
            var i;

            d3.selectAll('svg.salesByCountryChart > *').remove();
            d3.selectAll('svg.salesByCountryBarChart > *').remove();

            common.getSalesByCountry({
                startDay: this.startDate,
                endDay  : this.endDate
            }, function (data) {

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

                data.sort(function (obj1, obj2) {
                    return obj2.pays - obj1.pays;
                });

                margin = {
                    top: 20,
                    right: 130,
                    bottom: 30,
                    left: 130
                };
                width = ($wrapper.width() - margin.right) / 2.1;
                height = $wrapper.width() / 4;
                height1 = data.length * 20;

                projection = d3.geo.mercator()
                    .translate([width / 2, height / 1.5])
                    .scale([width / 6]);

                path = d3.geo.path().projection(projection);

                zoom = d3.behavior.zoom()
                    .scaleExtent([1, 200])
                    .on('zoom', function () {
                        e = d3.event;
                        tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale));
                        ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
                        zoom.translate([tx, ty]);
                        g.attr('transform', [
                            'translate(' + [tx, ty] + ')',
                            'scale(' + e.scale + ')'
                        ].join(' '));
                    });

                svg = d3.select('svg.salesByCountryChart')
                    .attr({
                        'width' : width,
                        'height': height,
                        'style' : 'background: #ACC7F2; margin-left: ' + margin.left + ''
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
                            'd'   : path,
                            'fill': '#F4F3EF',
                            'id'  : function (d) {
                                return d.id;
                            }
                        });

                    d3.csv(dataUrl + 'country-capitals.csv', function (error, data) {
                        g.selectAll('circle')
                            .data(data)
                            .enter()
                            .append('circle')
                            .attr({
                                'cx'          : function (d) {
                                    return projection([
                                        parseFloat(d.CapitalLongitude),
                                        parseFloat(d.CapitalLatitude)
                                    ])[0];
                                },
                                'cy'          : function (d) {
                                    return projection([
                                        parseFloat(d.CapitalLongitude),
                                        parseFloat(d.CapitalLatitude)]
                                    )[1];
                                },
                                'r'           : function (d) {
                                    return chooseRadius(d)
                                },
                                'fill'        : '#5CD1C8',
                                'opacity'     : 0.75,
                                'stroke'      : '#43A395',
                                'stroke-width': 1
                            });
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

                    svg.call(zoom);
                });

                barChart = d3.select('svg.salesByCountryBarChart')
                    .attr({
                        'width' : width - 30 + margin.left + margin.right,
                        'height': height1 + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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
                        'y1'           : 0,
                        'y2'           : 0,
                        'x1'           : '0',
                        'x2'           : width - 30,
                        'id'           : 'gradientBar',
                        'gradientUnits': 'userSpaceOnUse'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0',
                        'stop-color': '#FFA17F'
                    });

                gradient
                    .append('stop')
                    .attr({
                        'offset'    : '0.5',
                        'stop-color': '#ACC7F2'
                    });

                barChart.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        x     : function () {
                            return 0;
                        },
                        y     : function (d, i) {
                            return yScale(i) + offset;
                        },
                        width : function (d) {
                            return xScale(d.pays / 100);
                        },
                        height: rect - 2 * offset,
                        fill  : 'url(#gradientBar)'
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
                        'class'    : 'x axis',
                        'transform': 'translate(0,' + height1 + ')'
                    })
                    .call(xAxis);

                barChart.append('g')
                    .attr({
                        'class'    : 'y axis',
                        'transform': 'translate(0,' + (padding - 2 * offset) + ')'
                    })
                    .call(yAxis);

                barChart.selectAll('.x .tick line')
                    .attr({
                        'y2'   : function (d) {
                            return -height1
                        },
                        'style': 'stroke: #f2f2f2'
                    });
            });
        },

        renderTreemap: function () {
            var $wrapper = $('.content-holder');
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

            common.totalInvoiceBySales({
                startDay: this.startDate,
                endDay  : this.endDate
            }, function (data) {

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
                        name   : 'null',
                        payment: 0
                    }
                }

                margin = {top: 0, right: 10, bottom: 10, left: 125};
                width = $wrapper.width() / 2 - margin.left - margin.right;
                height = $wrapper.width() / 4;

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
                    .attr('height', height)
                    .style('position', 'relative');

                root = {
                    name    : 'tree',
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
