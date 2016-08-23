define([
    'Backbone',
    'Underscore',
    'jQuery',
    'd3',
    'text!templates/contractJobs/list/ListTemplate.html',
    'helpers',
    'common'
], function (Backbone, _, $, d3, ListTemplate, helpers, common) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                collection        : this.collection.toJSON(),
                currencySplitter  : helpers.currencySplitter,
                currencyClass     : helpers.currencyClass,
                utcDateToLocaleDate : common.utcDateToLocaleDate
            }));

            this.renderPieCharts();
        },

        renderPieCharts: function(){

            $('._contractJobsProfitBlock').each(function () {
                var width = $(this).width();
                var height = width;
                var radius = width / 2;
                var color = {
                    value: '#75cec8',
                    empty: '#ffffff'
                };
                var label = 'Profit';

                var arc = d3.svg.arc()
                    .outerRadius(radius * 0.85)
                    .innerRadius(radius * 0.75);

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) {
                        return d.count;
                    });

                var labelValue = parseFloat($(this).find('.percent').html());
                var value = (parseFloat(labelValue)/100).toFixed(2);
                var arcGroup;
                var data;
                var svg;
                var g;

                if (value < 0) {
                    value = - value;
                    labelValue = - labelValue;
                    color.value = '#eb6d70';
                    label = 'Loss';
                }

                if(value > 1){
                    value = 1;
                }

                data = [
                    {label: 'value', count: value},
                    {label: 'empty', count: 1 - value}
                ];

                svg = d3.select(this)
                    .append('svg')
                    .attr({
                        width : width,
                        height: height
                    });

                g = svg.append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

                arcGroup = g.selectAll('.arc')
                    .data(pie(data))
                    .enter()
                    .append('g')
                    .attr('class', 'arc');

                arcGroup.append('path')
                    .attr('d', arc)
                    .style('fill', function(d) {
                        return color[d.data.label];
                    });

                svg.append('text')
                    .text(label)
                    .attr({
                        'x': function(){
                            return width/2 - d3.select(this).node().getBBox().width/2;
                        },
                        'y': width/2 - 10,
                        'class': '_label'
                    });

                svg.append('text')
                    .text(labelValue + '%')
                    .attr({
                        'x': function(){
                            return width/2 - d3.select(this).node().getBBox().width/2;
                        },
                        'y': width/2 + 15,
                        'class': '_valueLabel'
                    })
            })
        }
    });

    return ListItemView;
});
