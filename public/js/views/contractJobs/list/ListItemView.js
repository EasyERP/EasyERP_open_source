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

            this.renderProfitLossCharts();
            this.renderCostCharts();
        },

        renderProfitLossCharts: function(){

            $('.profitBlock').each(function () {
                var labelValue = parseFloat($(this).find('.percent').html());
                var value = (parseFloat(labelValue)/100).toFixed(2);
                var width = parseInt($(this).width());
                var radius = width / 2;
                var label = 'Profit';
                var height = width;
                var color = {
                    value: '#75cec8',
                    empty: 'none'
                };
                var arc = d3.svg.arc()
                    .outerRadius(radius * 0.85)
                    .innerRadius(radius * 0.75);
                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) {
                        return d.count;
                    });
                var arcGroup;
                var data;
                var svg;
                var g;

                if(value > 1){
                    value = 1;
                }

                if (value < 0) {
                    value = - value;
                    labelValue = - labelValue;
                    color.value = '#eb6d70';
                    label = 'Loss';
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
                    .attr({
                        'd': arc
                    })
                    .style({
                        'fill'   : function (d) {
                            return color[d.data.label];
                        }
                    });

                svg.append('text')
                    .text(label)
                    .attr({
                        'class': '_label',
                        'fill': color.value,
                        'font-size': '14px',
                        'x': function(){
                            return width/2 - d3.select(this).node().getBBox().width/2;
                        },
                        'y': width/2 - 5
                    });

                svg.append('text')
                    .text(labelValue + '%')
                    .attr({
                        'class': '_valueLabel',
                        'fill': color.value,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'x': function(){
                            return width/2 - d3.select(this).node().getBBox().width/2;
                        },
                        'y': width/2 + 15
                    })
            })
        },

        renderCostCharts: function(){

            $('.costBlock').each(function(){
                var materialsLabel = $(this).find('.materials').text() || '0.00';
                var labourLabel = $(this).find('.labour').text() || '0.00';
                var materials = parseFloat(materialsLabel.replace(' ', ''));
                var labour = parseFloat(labourLabel.replace(' ', ''));
                var height = parseInt($(this).height()*0.9);
                var width = parseInt($(this).width());
                var rectWidth = 50;
                var color = {
                    Materials: '#FFBB40',
                    Labour: '#E25C5B'
                };
                var margin = {
                    left  : width*0.3,
                    top   : 25,
                    right : 5,
                    bottom: 5
                };
                var xScale;
                var yScale;
                var data;
                var max;
                var svg;
                var g;

                data = [
                    {label: 'Materials', count: materials, text: materialsLabel},
                    {label: 'Labour', count: labour, text: labourLabel}
                ];

                max = d3.max(data, function(d){
                    return d.count;
                });

                svg = d3.select(this)
                    .append('svg')
                    .attr({
                        width : width,
                        height: height
                    });

                g = svg.append('g')
                        .attr('transform', 'translate(0,' + margin.top + ')');

                xScale = d3.scale.linear()
                    .domain([0, max])
                    .range([2, width*0.7]);

                yScale = d3.scale.linear()
                    .domain([0, 2])
                    .range([0, rectWidth*2]);

                g.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr({
                        'x': 0,
                        'y': function(d,i){
                            return yScale(i);
                        },
                        'width':function(d, i){
                            return xScale(d.count);
                        },
                        'height': rectWidth,
                        'fill': function(d){
                            return color[d.label]
                        }
                    });

                g.selectAll('.textLabel')
                    .data(data)
                    .enter()
                    .append('text')
                    .text(function(d){
                        return (d.label);
                    })
                    .attr({
                        'dx': function(d, i){
                            return xScale(d.count) + 2;
                        },
                        'dy': function(d,i){
                            return yScale(i) + rectWidth/2;
                        },
                        'fill': '#A1B0B3'
                    });

                g.selectAll('.textLabelValue')
                    .data(data)
                    .enter()
                    .append('text')
                    .text(function(d){
                        return '$' + (d.text);
                    })
                    .attr({
                        'dx': function(d, i){
                            return xScale(d.count) + 2;
                        },
                        'dy': function(d,i){
                            return yScale(i) + parseInt(d3.select(this).node().getBBox().height) + rectWidth/2;
                        }
                    });

            })
        }
    });

    return ListItemView;
});
