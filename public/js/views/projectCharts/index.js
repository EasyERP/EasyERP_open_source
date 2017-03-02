define([
    'Backbone',
    'jQuery',
    'Underscore',
    'd3',
    'text!templates/projectCharts/index.html',
    'helpers'
], function (Backbone, $, _, d3, mainTemplate, helpers) {
    'use strict';

    var View = Backbone.View.extend({
        el      : '#projectChart',
        template: _.template(mainTemplate),

        initialize: function (options) {
            var self = this;

            self.data = options.data;
            self.render();
        },

        buildChart: function () {
            var $chartContainer = this.$el.find('#chartContainer');
            var WIDTH = $chartContainer.width() || 400; // add for rerender chart after create Job
            var HEIGH = $chartContainer.height() || 200;
            var BAR_WIDTH = 35;
            var data = this.data;
            var margin = {top: 30, right: 10, bottom: 30, left: 100};
            var width = WIDTH - margin.left - margin.right;
            var height = HEIGH - margin.top - margin.bottom;
            var topChart = d3.select('#chart');
            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], 0.3);

            var x = d3.scale.linear()
                .range([0, width]);
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            $('#chart').empty();
            data = [
                {
                    field: 'revenue',
                    value: data.revenue
                }, {
                    field: 'cost',
                    value: data.cost
                }, {
                    field: (data.revenue - data.cost) < 0 ? 'lost' : 'profit',
                    value: Math.abs(data.revenue - data.cost)
                }
            ];

            topChart
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            y.domain(data.map(function (d) {
                return d.field;
            }));
            x.domain([0, d3.max(data, function (d) {
                return d.value / 100;
            }) + 10]);

            topChart.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + margin.left + ', 0)')
                .call(yAxis);

            topChart.selectAll('.bar')
                .data(data)
                .enter().append('rect')
            // .attr('class', 'bar')
                .attr('x', function (d) {
                    return margin.left;
                })
                .attr('y', function (d) {
                    return y(d.field);
                })
                .attr('height', BAR_WIDTH)
                .attr('width', function (d) {
                    return x(d.value / 100);
                })
                .attr('fill', function (d) {
                    return d.field === 'cost' ? '#FFC107' : d.field === 'lost' ? 'red' : d.field === 'profit' ? 'green' : '#26a7dd';
                });

            topChart
                .selectAll()
                .data(data)
                .enter()
                .append('svg:text')
                .attr('x', function (d) {
                    var barWidth = x(d.value / 100);

                    return barWidth < 40 ? barWidth + margin.left + 40 : barWidth / 2 + margin.left;
                })
                .attr('y', function (d) {
                    return y(d.field);
                })
                .attr('dx', 0)
                .attr('dy', '1.5em')
                .attr('text-anchor', 'middle')
                .text(function (data) {
                    return helpers.currencySplitter((data.value / 100).toFixed(0));
                })
                .attr('fill', function (d) {
                    var barWidth = x(d.value / 100);

                    return barWidth < 40 ? 'black' : 'white';
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
