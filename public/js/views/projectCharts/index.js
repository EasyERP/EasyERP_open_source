/**
 * Created by Andrew on 20.05.2016.
 */
define([
    'text!templates/projectCharts/index.html',
    'collections/projectCharts/projectCharts'
], function (mainTemplate, ProjectChartCollection) {
    "use strict";

    var View = Backbone.View.extend({
        el: "#projectChart",
        template : _.template(mainTemplate),

        initialize: function (options) {
            var self = this;
            //this.collection = options.collection || [];
            this.getCollData(options.id);

            self.render();
        },

        getCollData: function (id) {
            this.collection = new ProjectChartCollection();
            this.collection.url = '/project/' + id + '/charts';
        },

        buildChart: function () {
            $('#chart').empty();

            var $chartContainer = this.$el.find('#chartContainer');

            var WIDTH = $chartContainer.width();
            var HEIGH = $chartContainer.height();
            var BAR_WIDTH = 20;
            //var data = this.collection.toJSON();
            var data = [
                {
                    field: 'cost',
                    value: 300
                },
                {
                    field: 'revenue',
                    value: 200
                }
            ];
            var margin = {top: 20, right: 70, bottom: 50, left: 100};
            var width = WIDTH - margin.left - margin.right - 15;
            var height = HEIGH - margin.top - margin.bottom;
            var topChart = d3.select("#chart");
            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], 0.3);

            var x = d3.scale.linear()
                .range([0, width]);

            var xAxis = d3.svg.axis()
                .scale(x)
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
                return d.value;
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
                .attr("height", y.rangeBand())
                .attr("width", function (d) {
                    return x(d.value);
                });

            /*var x = d3.scale.ordinal().rangeRoundBands([margin.left, width], 0.1);
            var y = d3.scale.linear().range([height, margin.bottom]);

            x.domain([0, 2]);
            y.domain([0, d3.max(data, function(datum) { return datum.field; })]);

            topChart
                .append("g")
                .attr("width", WIDTH)
                .attr("height", HEIGH);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            topChart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            topChart.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            topChart.selectAll("rect").
                data(data).
                enter().
                append("svg:rect").
                attr("x", function(datum, index) { return x(index); }).
                attr("y", function(datum) { return height - y(datum.field); }).
                attr("height", function(datum) { return y(datum.field); }).
                attr("width", BAR_WIDTH).
                attr("fill", "#2d578b");*/
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            /*this.collection.fetch({
                reset: true,
                success: function (data) {
                    $currentEl.html(self.template());
                    self.buildChart();
                },
                error: function (collection, response, options) {
                }
            });*/

            $currentEl.html(self.template());
            self.buildChart();


            return this;
        }
    });

    return View;
});