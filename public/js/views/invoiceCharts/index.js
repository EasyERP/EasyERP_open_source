define([
    'text!templates/invoiceCharts/index.html',
    'text!templates/invoiceCharts/tableBody.html',
    'collections/invoiceCharts/invoiceCharts',
    'dataService',
    'helpers',
    'async',
    'custom',
    'moment',
    'constants'
], function (mainTemplate, tableBodyTemplate, InvoiceCharts, dataService, helpers, async, custom, moment, CONSTANTS) {
    "use strict";
    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType: CONSTANTS.DASHBOARD_VACATION,

        template : _.template(mainTemplate),
        tableBodyTemplate : _.template(tableBodyTemplate),

        expandAll: false,

        events: {
            'click #byMonth': 'byMonth',
            'click #byWeek' : 'byWeekRender'
        },

        initialize: function (options) {
            var startWeek;
            var self = this;
            var year;
            var week;

            this.startTime = options.startTime;
            this.collection = options.collection || [];
            //this.filter = options.filter || custom.retriveFromCash('DashVacation.filter');

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

        changeDateRange: function(){
            this.startDate = this.$startDate.val();
            this.endDate = this.$endDate.val();

            this.collection = new InvoiceCharts({
                byWeek: this.byWeek,
                startDate: this.startDate,
                endDate: this.endDate
            });
            this.collection.on('reset', this.renderContent, this);
        },

        byWeekRender: function (e) {
            var $currentEl = $(e.target);
            var $div = $currentEl.closest('div');

            $div.find('.active').removeClass('active');
            $currentEl.addClass('active');

            this.byWeek = true;
            this.collection = new InvoiceCharts({
                byWeek: true,
                startDate: this.startDate,
                endDate: this.endDate
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
                startDate: this.startDate,
                endDate: this.endDate
            });
            this.collection.on('reset', this.renderContent, this);
        },

        renderByFilter: function () {
            $('#chart').empty();

            var $chartContainer = this.$el.find('#chartContainer');

            var WIDTH = $chartContainer.width();
            var HEIGH = $chartContainer.height();
            var data = this.collection.toJSON();
            var margin = {top: 20, right: 70, bottom: 50, left: 100};
            var width = WIDTH - margin.left - margin.right - 15;
            var height = HEIGH - margin.top - margin.bottom;
            var topChart = d3.select("#chart");
            var x = d3.scale.ordinal().rangeRoundBands([margin.left, width], 0.1);
            var y = d3.scale.linear().range([height, margin.bottom]);

            var now = new Date();
            var max = data.length;
            var xAxis;
            var yAxis;
            var line;

            topChart
                .append("g")
                .attr("width", width)
                .attr("height", height);

            x.domain(data.map(function (d) {
                return d.date;
            }));

            y.domain([d3.min(data.map(function (d) {
                d.invoiced = d.invoiced || 0;
                d.paid = d.paid || 0;
                d.revenue = d.revenue || 0;

                return Math.min(d.invoiced, d.paid, d.revenue);
            })), d3.max(data.map(function (d) {
                d.invoiced = d.invoiced || 0;
                d.paid = d.paid || 0;
                d.revenue = d.revenue || 0;

                return Math.max(d.invoiced, d.paid, d.revenue);
            }))]);

            line = d3.svg.line()
                .x(function (d) {
                    return x(d.date) + x.rangeBand() / 2;
                })
                .y(function (d) {
                    return y(d.revenue);
                })
                .interpolate("monotone");

            topChart
                .selectAll("rect")
                .data(data)
                .enter()
                .append("svg:rect")
                .attr("x", function (datum, index) {
                    return (x(datum.date));
                })
                .attr("y", function (datum) {
                    return y(datum.invoiced);
                })
                .attr("height", function (datum) {
                    return height - y(datum.invoiced);
                })
                .attr("width", x.rangeBand())
                .attr("fill", "#01579B")//lighBlue
                .attr("opacity", 0.3)
                .on('mouseover', function (d) {

                });

            topChart
                .selectAll("rect2")
                .data(data)
                .enter()
                .append("svg:rect")
                .attr("x", function (datum, index) {
                    return (x(datum.date));
                })
                .attr("y", function (datum) {
                    return y(datum.paid);
                })
                .attr("height", function (datum) {
                    return height - y(datum.paid);
                })
                .attr("width", x.rangeBand())
                .attr("fill", "#40C4FF")//blue  #40C4FF
                .attr("opacity", 0.3);

            topChart.append("path")
                .datum(data)
                .attr('stroke', 'yellow')
                .attr('stroke-width', 2)
                .style('fill', 'none')
               /* .attr("class", "line")*/
                .attr("d", line);

            topChart.selectAll(".circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circle")
                .attr("cx", function (d) {
                    return x(d.date) + x.rangeBand() / 2;
                })
                .attr("cy", function (d) {
                    return y(d.revenue);
                })
                .attr("r", function (d) {
                    return 4;
                })
                .style("fill", "#1EBBEA")
                .style("stroke", "#fff")
                .style("stroke-width", "2");

            xAxis = d3.svg.axis()
                .scale(x)
                .ticks(0)
                .tickSize(0);

            yAxis = d3.svg.axis()
                .scale(y)
                .ticks(5)
                .orient('left');

            topChart.append('svg:g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (height + 10) + ')')
                .call(xAxis)
                .selectAll("text")
                .attr("transform", "rotate(-60)")
                .attr("dx", "-.2em")
                .attr("dy", ".15em")
                .style("text-anchor", "end")
                .style("fill", "white");

            topChart.append('svg:g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + (margin.left) + ', 5 )')
                .call(yAxis)
                .selectAll(".tick line")
                .attr("x2", function (d) {
                    return width;
                })
                .style("fill", "white")
                .style("stroke-width", "1px")
                .style("stroke", "white");

            /*topChart.append('svg:text')
             .attr("x", x.rangeBand() / 2)
             .attr("y", HEIGH - 5)
             .attr('class', 'axesName')
             .text('Date');*/

            topChart.append('svg:text')
                .attr("x", -(HEIGH / 2 ))
                .attr("y", margin.left - 80)
                .attr('class', 'axesName')
                .text('Ammount')
                .attr("transform", 'translate(0, 0) rotate(-90)')
                .style('fill', 'white');

            return this;
        },

        renderContent: function(){
            var self = this;
            var count = this.collection.length;
            var tdWidth = Math.floor(100 / (count + 1));
            var $tableContainer = this.$el.find('#results');

            $tableContainer.html(this.tableBodyTemplate({
                collection: self.collection,
                currencySplitter: helpers.currencySplitter,
                tdWidth: tdWidth,
                count: count
            }));

            this.renderByFilter();
        },

        render: function (options) {
            var self = this;
            var $currentEl = this.$el;

            $currentEl.html(self.template());

            this.byWeek = false;

            this.renderContent();

            this.$startDate = $('#startDate');
            this.$endDate = $('#endDate');

            return this;
        }
    });

    return View;
});