/**
 * Created by Andrew on 20.05.2016.
 */
define([
    'text!templates/projectCharts/index.html'
], function (mainTemplate) {
    "use strict";

    var View = Backbone.View.extend({
        el: "#projectChart",
        template : _.template(mainTemplate),

        initialize: function (options) {
            var self = this;
            self.data = options.data;

            self.render();
        },

        buildChart: function () {
            $('#chart').empty();

            var $chartContainer = this.$el.find('#chartContainer');

            var WIDTH = $chartContainer.width();
            var HEIGH = $chartContainer.height();
            var BAR_WIDTH = 35;
            var data = this.data;
            data = [
                {
                    field: 'cost',
                    value: data.cost
                },
                {
                    field: 'revenue',
                    value: data.revenue
                }
            ];
            var margin = {top: 30, right: 10, bottom: 30, left: 100};
            var width = WIDTH - margin.left - margin.right;
            var height = HEIGH - margin.top - margin.bottom;
            var topChart = d3.select("#chart");
            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], 0.3);

            var x = d3.scale.linear()
                .range([0, width]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .ticks(5)
                .tickSubdivide(true)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            topChart
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            y.domain(data.map(function (d) {
                return d.field;
            }));
            x.domain([0, d3.max(data, function (d) {
                return d.value/100;
            }) + 10]);

            topChart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + ", " + height + ")")
                .call(xAxis);

            topChart.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ", 0)")
                .call(yAxis);

            topChart.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return margin.left;
                })
                .attr("y", function (d) {
                    return y(d.field);
                })
                .attr("height", BAR_WIDTH)
                .attr("width", function (d) {
                    return x(d.value/100);
                });

            topChart.selectAll(".x .tick line")
                .attr("y2", function () {
                    return -height;
                });
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $currentEl.html(self.template());
            self.buildChart();

            return this;
        }
    });

    return View;
});