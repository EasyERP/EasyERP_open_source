define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/reports/salesReports/InfoBySalesTemplate.html',
    'text!templates/reports/inventoryReports/IncomingStockTemplate.html',
    'text!templates/reports/inventoryReports/incomingStock/listTemplate.html',
    'views/listViewBase',
    'views/Filter/dateFilter',
    'dataService',
    'moment',
    'helpers',
    'constants',
    'd3',
    'mixins/listView'
], function (Backbone, _, $, main, IncomingStockTemplate, listTemplate, ListViewBase, DateFilterView, dataService, moment, helpers, CONSTANTS, d3, listMixIn) {
    'use strict';

    var ContentView = ListViewBase.extend({
        template       : _.template(main),
        tableTemplate  : _.template(IncomingStockTemplate),
        listTemplate   : _.template(listTemplate),
        childView      : null,
        hasPagination  : false,
        noNeedCreatedIn: true,

        el: '#incomingStock',

        events: {
            'click .changeInfo': 'activateTabs'
        },

        initialize: function (options) {
            this.collection = options.collection;
            this.datesArray = options.datesArray;

            ListViewBase.prototype.initialize.call(this, options);

            this.collection.bind('showmore', this.showMoreContent, this);
            this.render();
        },

        showMoreContent: function (newModels) {
            var $holder = this.$el;

            $holder.find('#listTable').empty();

            $holder.find('#listTable').append(this.listTemplate({
                collection      : this.collection.toJSON(),
                currencySplitter: helpers.currencySplitter
            }));
        },

       /* activateTabs: function (e) {
            var $thisEl = this.$el;
            var scaleButtons = $thisEl.find('.changeInfo');
            var scaleTabs = $thisEl.find('.scaleTabs');
            var $target;
            var attr;

            // scaleTabs.hide();
            scaleButtons.removeClass('active');

            if (!e) {
                $thisEl.find(scaleButtons[0]).addClass('active');
            } else {
                $target = $thisEl.find(e.target);
                $target.addClass('active');
            }

            attr = $thisEl.find($thisEl.find('.changeInfo.active')[0]).attr('data-info');

            if (attr === 'incoming') {
                return $thisEl.find('.incomingTabs').show();
            }

            $thisEl.find('.productTabs').show();
        },*/

        changeDateRange: function (dateArray) {
            var self = this;
            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            dataService.getData('/reports/incomingStock', {
                startDate: this.startDate,
                endDate  : this.endDate
            }, function (resp) {
                self.collection.set(resp.data);

                self.renderChart();
                // self.activateTabs();
                self.showMoreContent();
            });
        },

        renderChartItem: function () {
            var padding = 15;
            var array = [];
            var offset = 4;
            var $wrapper;
            var margin;
            var xScale;
            var yScale;
            var height;
            var xAxis;
            var yAxis;
            var width;
            var chart;
            var rect;
            var max;
            var i;

            var data = this.collection.toJSON();

            d3.select('.incoming > *').remove();

            for (i = data.length; i--;) {
                array[i] = {
                    supplier: data[i].supplier.first + ' ' + data[i].supplier.last,
                    total   : data[i].total / 100
                };
            }

            max = Math.ceil(d3.max(array, function (d) {
                        return d.total;
                    }) / 100) * 100;

            $wrapper = $('#content-holder');
            margin = {top: 20, right: $wrapper.width() / 2, bottom: 30, left: 130};
            width = ($wrapper.width() - margin.right) / 1.5;
            height = array.length * 30;
            rect = height / (array.length);

            xScale = d3.scale.linear()
                .domain([0, max])
                .range([0, width]);

            yScale = d3.scale.linear()
                .domain([0, array.length])
                .range([0, height]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickFormat(d3.format('s'));

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickSize(0)
                .tickPadding(offset)
                .tickFormat(function (d, i) {
                    return array[i].supplier;
                })
                .tickValues(d3.range(array.length));

            chart = d3.select('.incoming')
                .attr({
                    'width' : width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                })
                .append('g')
                .attr('transform', 'translate(' + (margin.left + 150) + ',' + margin.top + ')');

            chart.selectAll('rect')
                .data(array)
                .enter()
                .append('rect')
                .attr({
                    x     : function () {
                        return 0;
                    },
                    y     : function (d, i) {
                        return yScale(i);
                    },
                    width : function (d) {
                        return xScale(d.total);
                    },
                    height: rect - 2 * offset,
                    fill  : '#5CD1C8'
                });

            chart.append('g')
                .attr({
                    'class'    : 'x axis',
                    'transform': 'translate(0,' + height + ')'
                })
                .call(xAxis);

            chart.append('g')
                .attr({
                    'class'    : 'y axis',
                    'transform': 'translate(' + (-offset) + ',' + (padding - offset) + ')'
                })
                .call(yAxis);

            chart.selectAll('.x .tick line')
                .attr({
                    'y2'   : function (d) {
                        return -height;
                    },
                    'style': 'stroke: #f2f2f2'
                });
        },

        renderProductItem: function () {
            var padding = 15;
            var array = [];
            var offset = 4;
            var $wrapper;
            var margin;
            var xScale;
            var yScale;
            var height;
            var xAxis;
            var yAxis;
            var width;
            var chart;
            var rect;
            var max;
            var i;

            var data = this.collection.toJSON();

            d3.select('.products > *').remove();

            for (i = data.length; i--;) {
                array[i] = {
                    supplier: data[i].products,
                    total   : data[i].incomingStock
                };
            }

            max = Math.ceil(d3.max(array, function (d) {
                        return d.total;
                    }) / 10) * 10;

            $wrapper = $('#content-holder');
            margin = {top: 20, right: $wrapper.width() / 2, bottom: 30, left: 130};
            width = ($wrapper.width() - margin.right) / 1.5;
            height = array.length * 30;
            rect = height / (array.length);

            xScale = d3.scale.linear()
                .domain([0, max])
                .range([0, width]);

            yScale = d3.scale.linear()
                .domain([0, array.length])
                .range([0, height]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickFormat(d3.format('s'));

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickSize(0)
                .tickPadding(offset)
                .tickFormat(function (d, i) {
                    return array[i].supplier;
                })
                .tickValues(d3.range(array.length));

            chart = d3.select('.products')
                .attr({
                    'width' : width + margin.left + margin.right,
                    'height': height + margin.top + margin.bottom
                })
                .append('g')
                .attr('transform', 'translate(' + (margin.left + 150 ) + ',' + margin.top + ')');

            chart.selectAll('rect')
                .data(array)
                .enter()
                .append('rect')
                .attr({
                    x     : function () {
                        return 0;
                    },
                    y     : function (d, i) {
                        return yScale(i);
                    },
                    width : function (d) {
                        return xScale(d.total);
                    },
                    height: rect - 2 * offset,
                    fill  : '#5CD1C8'
                });

            chart.append('g')
                .attr({
                    'class'    : 'x axis',
                    'transform': 'translate(0,' + height + ')'
                })
                .call(xAxis);

            chart.append('g')
                .attr({
                    'class'    : 'y axis',
                    'transform': 'translate(' + (-offset) + ',' + (padding - offset) + ')'
                })
                .call(yAxis);

            chart.selectAll('.x .tick line')
                .attr({
                    'y2'   : function (d) {
                        return -height;
                    },
                    'style': 'stroke: #f2f2f2'
                });
        },

        renderChart: function () {
            this.$el.find('.tableListWrap').html(this.tableTemplate({
                collection: this.collection.toJSON()
            }));

            this.renderChartItem();
            this.renderProductItem();
            this.showMoreContent();
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var itemView;

            $thisEl.html(this.template({
                className: 'hidden'
            }));

            this.renderChart();
           // this.activateTabs();
           // $thisEl.find('.scaleButtons').hide();

            this.dateFilterView = new DateFilterView({
                contentType: 'reports',
                el         : $thisEl.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.changeDateRange(self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', this.datesArray);
        }
    });

    ContentView = listMixIn(ContentView);

    return ContentView;
});


