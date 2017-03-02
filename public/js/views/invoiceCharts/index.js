define([
    'Backbone',
    'jQuery',
    'Underscore',
    'd3',
    'text!templates/invoiceCharts/index.html',
    'text!templates/invoiceCharts/tableBody.html',
    'collections/invoiceCharts/invoiceCharts',
    'helpers',
    'moment',
    'custom',
    'constants'
], function (Backbone, $, _, d3, mainTemplate, tableBodyTemplate, InvoiceCharts,
             helpers, moment, custom, CONSTANTS) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType: CONSTANTS.DASHBOARD_VACATION,

        template         : _.template(mainTemplate),
        tableBodyTemplate: _.template(tableBodyTemplate),

        expandAll: false,

        events: {
            'click #byMonth': 'byMonth',
            'click #byWeek' : 'byWeekRender'
        },

        initialize: function (options) {
            var self = this;

            var startWeek;
            var filter;
            var year;
            var week;

            this.startTime = options.startTime;
            this.collection = options.collection || [];

            filter = this.filter = options.filter || custom.retriveFromCash('invoiceCharts.filter');

            year = moment().isoWeekYear();
            week = moment().isoWeek();

            this.dateByWeek = year * 100 + week;
            this.week = week;
            this.year = year;

            startWeek = self.week - 1;

            if (startWeek >= 0) {
                this.startWeek = startWeek;
            } else {
                this.startWeek = startWeek + 53;
                this.year -= 1;
            }

            this.render();
        },

        changeDateRange: function (dateArray) {
            var filter = this.filter || custom.retriveFromCash('invoiceCharts.filter') || {};

            filter.date = {
                value: dateArray
            };

            this.collection = new InvoiceCharts({
                byWeek: this.byWeek,
                filter: filter
            });

            this.collection.on('reset', this.renderContent, this);
            this.filter = filter;

            custom.cacheToApp('invoiceCharts.filter', this.filter);
        },

        byWeekRender: function (e) {
            var $currentEl = $(e.target);
            var $div = $currentEl.closest('div');

            $div.find('.active').removeClass('active');
            $currentEl.addClass('active');

            this.byWeek = true;
            this.collection = new InvoiceCharts({
                byWeek: true,
                filter: this.filter
            });
            this.collection.on('reset', this.renderContent, this);
        },

        byMonth: function (e) {
            var $currentEl = $(e.target);
            var $div = $currentEl.closest('div');

            $div.find('.active').removeClass('active');
            $currentEl.addClass('active');

            this.byWeek = false;
            this.collection = new InvoiceCharts({
                filter: this.filter
            });
            this.collection.on('reset', this.renderContent, this);
        },

        renderByFilter: function () {
            var $chartContainer = this.$el.find('#chartContainer');
            var WIDTH = $chartContainer.width();
            var HEIGH = $chartContainer.height();
            var data = this.collection.toJSON();
            var margin = {
                top   : 20,
                right : 70,
                bottom: 70,
                left  : 100
            };
            var width = WIDTH - margin.left - margin.right - 15;
            var height = HEIGH - margin.top - margin.bottom;
            var topChart = d3.select('#chart');
            var tooltip = d3.select('div.invoiceTooltip');
            var x = d3.scale.ordinal().rangeRoundBands([margin.left, width], 0.1);
            var y = d3.scale.linear().range([height, margin.bottom]);
            var now = new Date();
            var max = data.length;
            var totalLength;
            var path;
            var xAxis;
            var yAxis;
            var line;

            $('#chart').empty();

            topChart
                .append('g')
                .attr({
                    'width' : width,
                    'height': height
                });

            x.domain(data.map(function (d) {
                return d.date;
            }));

            y.domain([d3.min(data.map(function (d) {
                d.invoiced = d.invoiced || 0;
                d.paid = d.paid || 0;
                d.revenue = d.revenue || 0;

                return Math.min(d.invoiced, d.paid /* , d.revenue*/);
            })), d3.max(data.map(function (d) {
                d.invoiced = d.invoiced || 0;
                d.paid = d.paid || 0;
                d.revenue = d.revenue || 0;

                return Math.max(d.invoiced, d.paid /* , d.revenue*/);
            }))]);

            line = d3.svg.line()
                .x(function (d) {
                    return x(d.date) + x.rangeBand() / 2;
                })
                .y(function (d) {
                    return y(d.invoiced);
                })
                .interpolate('linear');

            /* topChart
             .selectAll('rect')
             .data(data)
             .enter()
             .append('svg:rect')
             .attr('x', function (datum, index) {
             return (x(datum.date));
             })
             .attr('y', function (datum) {
             return y(datum.invoiced);
             })
             .attr('height', function (datum) {
             return height - y(datum.invoiced);
             })
             .attr('width', x.rangeBand())
             .attr('fill', '#01579B') // lighBlue
             .attr('opacity', 0.3)
             .on('mouseover', function (d) {

             });*/

            path = topChart.append('path')
                .datum(data)
                .attr({
                    'd'           : line,
                    'stroke'      : '#D96459',
                    'stroke-width': 2,
                    'fill'        : 'none',
                    'opacity'     : 1
                });

            totalLength = path.node().getTotalLength();

            path
                .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(2000)
                .ease('linear')
                .attr('stroke-dashoffset', 0);

            topChart
                .selectAll('rect2')
                .data(data)
                .enter()
                .append('svg:rect')
                .attr({
                    'class'       : 'bar',
                    'x'           : function (datum) {
                        return (x(datum.date));
                    },
                    'y'           : height,
                    'height'      : 0,
                    'width'       : x.rangeBand(),
                    'fill'        : '#0aafd8', // blue  #0aafd8
                    'opacity'     : 0.3,
                    'stroke'      : '#045986',
                    'stroke-width': 2
                })
                .transition()
                .duration(2000)
                .attr({
                    'y'     : function (datum) {
                        return y(datum.paid);
                    },
                    'height': function (datum) {
                        return height - y(datum.paid);
                    }
                });

            d3.selectAll('rect.bar')
                .on('mouseover', function (d) {
                    d3.select(this)
                        .attr({
                            'opacity': 0.8
                        });

                    tooltip
                        .transition()
                        .duration(300)
                        .style('border-color', '#0aafd8')
                        .style('width', (x.rangeBand() * 2) + 'px')
                        .style('left', (x(d.date) - x.rangeBand() / 2) + 'px')
                        .style('top', (y(d.paid) - 40) + 'px')
                        .style('display', 'block')
                        .select('span')
                        .text((d.paid / 1000).toFixed(3));

                    tooltip.select('.arrow')
                        .transition()
                        .duration(300)
                        .style('border-top-color', '#0aafd8')
                })
                .on('mouseleave', function (d) {
                    d3.select(this)
                        .transition()
                        .duration(600)
                        .attr({
                            'opacity': 0.3
                        });

                    tooltip.transition()
                        .duration(200)
                        .style('display', 'none');
                });

            topChart
                .selectAll('rect1')
                .data(data)
                .enter()
                .append('svg:rect')
                .attr({
                    'x'      : function (datum) {
                        return (x(datum.date) + x.rangeBand() / 2 - 5);
                    },
                    'y'      : function (datum) {
                        return y(datum.invoiced) - 5;
                    },
                    'width'  : 10,
                    'height' : 10,
                    'fill'   : '#D96459', //red squares
                    'opacity': 1
                })
                .on('mouseover', function (d) {

                    tooltip.transition()
                        .duration(300)
                        .style('border-color', '#D96459')
                        .style('width', (x.rangeBand() * 2) + 'px')
                        .style('left', (x(d.date) - x.rangeBand() / 2) + 'px')
                        .style('top', (y(d.invoiced) - 40) + 'px')
                        .style('display', 'block')
                        .select('span')
                        .text((d.invoiced / 1000).toFixed(3));

                    tooltip.select('.arrow')
                        .transition()
                        .duration(300)
                        .style('border-top-color', '#D96459')
                })
                .on('mouseleave', function (d) {
                    d3.select(this)
                        .transition()
                        .delay(100)
                        .duration(500);

                    tooltip.transition()
                        .duration(200)
                        .style('display', 'none');
                });

            /* topChart.append('path')
             .datum(data)
             .attr('stroke', 'yellow')
             .attr('stroke-width', 2)
             .style('fill', 'none')
             /!* .attr('class', 'line')*!/
             .attr('d', line);*/

            /* topChart.selectAll('.circle')
             .data(data)
             .enter()
             .append('circle')
             .attr('class', 'circle')
             .attr('cx', function (d) {
             return x(d.date) + x.rangeBand() / 2;
             })
             .attr('cy', function (d) {
             return y(d.revenue);
             })
             .attr('r', function (d) {
             return 4;
             })
             .style('fill', '#1EBBEA')
             .style('stroke', '#fff')
             .style('stroke-width', '2');*/

            xAxis = d3.svg.axis()
                .scale(x)
                .ticks(0)
                .tickSize(0);

            yAxis = d3.svg.axis()
                .scale(y)
                .ticks(5)
                .orient('left');

            topChart.append('svg:g')
                .attr({
                    'class'    : 'x axis',
                    'transform': 'translate(0,' + (height + 10) + ')'
                })
                .call(xAxis)
                .selectAll('text')
                .attr({
                    'transform': 'rotate(-60)',
                    'dx'       : '-.2em',
                    'dy'       : '.15em'
                })
                .style('text-anchor', 'end');

            topChart.append('svg:g')
                .attr({
                    'class'    : 'y axis',
                    'transform': 'translate(' + (margin.left) + ', 5 )'
                })
                .call(yAxis)
                .selectAll('.tick line')
                .attr('x2', function (d) {
                    return width;
                })
                .style('fill', 'white')
                .style('stroke-width', '1px');

            /* topChart.append('svg:text')
             .attr('x', x.rangeBand() / 2)
             .attr('y', HEIGH - 5)
             .attr('class', 'axesName')
             .text('Date');*/

            topChart
                .append('svg:text')
                .attr({
                    'x'        : -(HEIGH / 2),
                    'y'        : margin.left - 80,
                    'class'    : 'axesName',
                    'transform': 'translate(0, 0) rotate(-90)'
                })
                .text('Ammount');

            return this;
        },

        renderContent: function () {
            var self = this;
            var count = this.collection.length;
            var tdWidth = Math.floor(100 / (count + 1));
            var $tableContainer = this.$el.find('#results');

            $tableContainer.html(this.tableBodyTemplate({
                collection      : self.collection,
                currencySplitter: helpers.currencySplitter,
                tdWidth         : tdWidth,
                count           : count
            }));

            this.renderByFilter();
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var filter = this.filter || custom.retriveFromCash('invoiceCharts.filter');
            var url = '#easyErp/invoiceCharts';

            App.filtersObject.filter = filter || {};

            $currentEl.html(self.template());

            this.byWeek = false;

            this.renderContent();

            return this;
        }
    });

    return View;
});
