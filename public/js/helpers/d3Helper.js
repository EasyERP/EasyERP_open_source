define(['d3',
    'Underscore',
    'helpers',
    'moment'
], function (d3, _, helpers, moment) {

    function drawVerticalChart(options) {
        var info;
        var infoY;
        var tooltip;
        var maxY;
        var maxX;
        var minY;
        var minX;
        var xScale;
        var yScale;
        var yAxis;
        var xAxis;
        var svg;
        var typeXAxisFiled;
        var typeYAxisFiled;
        var xAxisFiled;
        var yAxisFiled;
        var additionalFiledForXAxis;
        var color;
        var symbol;
        var afterDot;
        var container;
        var selector;
        var dataset;
        var margin;
        var padding;
        var width;
        var height;
        var buff;
        var title;
        var maxDif;
        var minDif;
        var maxBarWidth;
        var minBarWidth;
        var format;

        if (!options.data || !options.data.length) {
            return;
        }
        if (!options.xAxisFiled || !options.yAxisFiled) {
            return;
        }
        if (!options.typeXAxisFiled || !options.typeYAxisFiled) {
            return;
        }
        if (options.typeYAxisFiled.toLowerCase() !== 'number' && options.typeXAxisFiled.toLowerCase() !== 'number') {
            return;
        }
        if (!options.container || !options.selector) {
            return;
        }

        if (options.typeYAxisFiled.toLowerCase() !== 'number') {
            typeXAxisFiled = options.typeYAxisFiled.toLowerCase();
            typeYAxisFiled = options.typeXAxisFiled.toLowerCase();

            xAxisFiled = options.yAxisFiled;
            yAxisFiled = options.xAxisFiled;
        } else {
            typeXAxisFiled = options.typeXAxisFiled.toLowerCase();
            typeYAxisFiled = options.typeYAxisFiled.toLowerCase();

            xAxisFiled = options.xAxisFiled;
            yAxisFiled = options.yAxisFiled;
        }

        info = options.info ? options.info : '';
        infoY = options.infoY ? options.infoY : '';

        margin = {top: 20, right: 20, bottom: 20, left: 40};

        container = options.container;
        selector = options.selector;

        width = container.width() - margin.left - margin.right;
        height = container.height() - margin.bottom - margin.top * 2;
        padding = 10;
        maxBarWidth = 40;
        minBarWidth = 15;

        additionalFiledForXAxis = options.additionalFiledForXAxis ? options.additionalFiledForXAxis : '';
        color = options.color ? options.color : "72,180,219,";
        symbol = options.symbol ? options.symbol : '';

        afterDot = symbol === '%' ? 2 : 0;

        dataset = [];
        options.data.forEach(function (d) {
            var buff = d[additionalFiledForXAxis] ? ' ' + d[additionalFiledForXAxis] : '';
            dataset.push({
                0: buff ? d[xAxisFiled] + buff : d[xAxisFiled],
                1: d[yAxisFiled]
            })
        });

        if (options.data && options.data.length && ((container.width() / options.data.length) < minBarWidth)) {
            width = (options.data.length * 35) - margin.left - margin.right;
            if (container.width() < width) {
                return;
            }
        }

        if (typeXAxisFiled === 'number') {

            maxX = Math.ceil(d3.max(dataset, function (d) {
                return d[0];
            }));

            minX = Math.floor(d3.min(dataset, function (d) {
                return d[0];
            }));

            minX = Math.ceil(minX - minX / 4);
            maxX = Math.ceil(maxX + maxX / 2);

            // maxDif = maximumDiference(options.data, xAxisFiled);
            // minDif = minimumDiference(options.data, xAxisFiled);

            xScale = d3.scale.linear()
                .domain([minX, maxX])
                .range([0, width]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .tickFormat(d3.format('s'))
                .orient('bottom');
        } else {
            if (typeXAxisFiled === 'date') {
                var dates = [];
                dataset.forEach(function (d) {
                    dates.push(getFormatDate(d[0]));
                });

                function getFormatDate(d) {
                    return moment(d).format('MM-DD-YYYY');
                }

                xScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1, 1)
                    .domain(dates);

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function (d) {
                        if (d.length > 20) {
                            return d.substring(0, 20) + '...';
                        }
                        return d;
                    })
                    .orient('bottom');
            } else {

                xScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1, 1)
                    .domain(dataset.map(function (d) {
                        return d[0];
                    }));

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function (d) {
                        if (d.length > 11) {
                            return d.substring(0, 11) + '...';
                        }
                        return d;
                    })
                    .orient('bottom');
            }
        }

        maxY = Math.ceil(d3.max(dataset, function (d) {
            return d[1];
        }));
        minY = d3.min(dataset, function (d) {
            return d[1];
        });

        if (minY === maxY) {
            min = 0;
        }

        yScale = d3.scale.linear()
            .range([height, 0])
            .domain([0, maxY]);

        d3.select(selector + ' > *').remove();

        svg = d3.select(selector).append('svg')
            .attr('width', width)
            .attr('height', height + 50)
            .append('g')
            .style('margin', '10px')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        format = d3.format('s');
        yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(function (d) {
                return format(d) + " " + symbol;
            })
            .orient('left');

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end');

        title = d3.select(selector)
            .append('div')
            .style({
                "border"          : "solid 1px black",
                "height"          : "30px",
                "font-size"       : "10px",
                "color"           : "black",
                'padding'         : '10px',
                'background-color': '#fff',
                'border-radius'   : '5px',
                'display'         : 'none',
                'position'        : 'absolute'
            });

        svg.append('g')
            .attr('class', 'x axis')
            .call(xAxis)
            .attr("transform", "translate(0," + (height) + ")")
            .attr('x', 6)
            .attr('dx', '.71em')
            .style('text-anchor', 'end');

        svg.selectAll('.x.axis .tick text')
            .on('mouseover', function (d, i) {
                if (d.length > 11) {
                    var xPosition = margin.right + 60;
                    var yPosition = height - yScale(d) + 65;

                    title.style('left', xPosition + 'px')
                        .style('bottom', yPosition + 'px')
                        .style({
                            'display': 'block'
                        })
                        .html(d);
                }
            })
            .on('mouseleave', function (d) {
                if (d.length > 11) {
                    title.style({
                        'display': 'none'
                    });
                }
            });

        svg.append('text')
            .attr('class', 'axisTitle')
            .attr('transform', 'translate(' + -30 + ' ,' + -20 + ')')
            .text(infoY);

        svg.selectAll('.barItem')
            .data(dataset)
            .enter().append('rect')
            .attr('class', 'barItem')
            .attr('x', function (d, i) {
                return xScale(d[0]);
            })
            .attr('width', function (d, i) {
                if (typeXAxisFiled.toLowerCase() !== 'number') {
                    return xScale.rangeBand();
                }
                var w = width / dataset.length - 2 * padding;
                if (w < minBarWidth) {
                    return minBarWidth;
                }
                if (w > maxBarWidth) {
                    return maxBarWidth;
                }
                return w;

            })
            .attr('y', function (d) {
                return yScale(d[1]);
            })
            .attr('height', function (d) {
                return height - yScale(d[1]);
            })
            .attr('fill', function (d) {
                var colorAlp = 1;
                return 'rgba(' + color + colorAlp + ')';
            });

        tooltip = d3.select(selector)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        svg.selectAll('.hover')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('class', 'hover')
            .attr('x', function (d, i) {
                return xScale(d[0]);
            })
            .attr('width', function (d, i) {
                if (typeXAxisFiled.toLowerCase() !== 'number') {
                    return xScale.rangeBand();
                }
                else {
                    var w = width / dataset.length - 2 * padding;
                    if (w < 10) {
                        return minBarWidth;
                    }
                    if (w > 80) {
                        return maxBarWidth;
                    }
                    return w;
                }
            })
            .attr('y', 0)
            .attr('height', height)
            .attr('fill', function (d) {
                return 'rgba(' + color + 0 + ')';
            })
            .on('mouseover', function (d) {
                var yPosition;
                var xPosition;
                var h = tooltip[0][0].offsetHeight;
                var w = tooltip[0][0].offsetWidth / 2;

                xPosition = this.x.baseVal.value + padding + this.width.baseVal.value / 2 + w;

                yPosition = (height + margin.top + h / 2) - yScale(d[1]);

                d3.select(this)
                    .attr({
                        opacity: 0.5
                    });

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                tooltip.html('<div>' + d[0] + '</div>' +
                    '<div>' + helpers.currencySplitter(d[1].toFixed(afterDot)) + ' ' + symbol + '</div>')
                    .style('left', xPosition + 'px')
                    .style('bottom', yPosition + 'px');
            })
            .on('mouseleave', function () {
                d3.select(this)
                    .attr({
                        opacity: 1
                    });

                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);

            });

        svg.selectAll('line.y')
            .data(yScale.ticks())
            .enter()
            .append('line')
            .attr('class', 'y')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', yScale)
            .attr('y2', yScale)
            .style('stroke', '#f2f2f2');
    }

    function drawHorizontalChart(options) {
        var info;
        var infoX;
        var typeXAxisFiled;
        var typeYAxisFiled;
        var xAxisFiled;
        var yAxisFiled;
        var additionalFiledForYAxis;
        var color;
        var symbol;
        var afterDot;
        var container;
        var selector;
        var dataset;
        var margin;
        var padding;
        var width;
        var height;
        var widthSvg;
        var heightSvg;
        var tooltip;
        var maxX;
        var minX;
        var maxY;
        var xScale;
        var yScale;
        var xAxis;
        var svg;
        var g;
        var minValue;
        var format;
        var yAxis;

        if (!options.data || !options.data.length) {
            return;
        }
        if (!options.xAxisFiled || !options.yAxisFiled) {
            return;
        }
        if (!options.typeXAxisFiled || !options.typeYAxisFiled) {
            return;
        }
        if (options.typeXAxisFiled.toLowerCase() !== 'number' && options.typeYAxisFiled.toLowerCase() !== 'number') {
            return;
        }
        if (!options.container || !options.selector) {
            return;
        }

        info = options.info ? options.info : '';
        infoX = options.infoX ? options.infoX : '';

        if (options.typeXAxisFiled.toLowerCase() !== 'number') {
            xAxisFiled = options.yAxisFiled;
            yAxisFiled = options.xAxisFiled;

            typeXAxisFiled = options.typeYAxisFiled.toLowerCase();
            typeYAxisFiled = options.typeXAxisFiled.toLowerCase();
        }
        else {
            typeXAxisFiled = options.typeXAxisFiled.toLowerCase();
            typeYAxisFiled = options.typeYAxisFiled.toLowerCase();

            xAxisFiled = options.xAxisFiled;
            yAxisFiled = options.yAxisFiled;
        }

        additionalFiledForYAxis = options.additionalFiledForYAxis ? options.additionalFiledForYAxis : '';
        color = options.color ? options.color : "72,180,219,";
        symbol = options.symbol ? options.symbol : '';

        afterDot = symbol === '%' ? 2 : 0;

        container = options.container;
        selector = options.selector;

        dataset = [];
        options.data.forEach(function (d) {
            dataset.push({
                0: d[xAxisFiled],
                1: additionalFiledForYAxis ? d[yAxisFiled] + additionalFiledForYAxis : d[yAxisFiled]
            })
        });

        margin = {
            top   : 20,
            left  : 85,
            bottom: 20,
            right : 60
        };
        padding = 40;

        width = container.width() - margin.left - margin.right;
        height = container.height() - margin.bottom - margin.top * 2;

        // if (options.data && options.data.length && ((container.width() / options.data.length) < 35)) {
        //     width = (options.data.length * 35) - margin.left - margin.right;
        // }

        maxX = d3.max(dataset, function (d) {
            return d[0];
        });
        maxX = Math.ceil(maxX);

        minX = d3.min(dataset, function (d) {
            return d[0];
        });

        if (minX === maxX) {
            minX = 0;
        }

        xScale = d3.scale.linear()
            .domain([0, maxX])
            .range([0, width]);

        if (typeYAxisFiled === 'string') {

            yScale = d3.scale.ordinal()
                .domain(dataset.map(function (d) {
                    return d[1];
                }))
                .rangeRoundBands([0, height], .1, 1);
        }
        else {
            if (typeYAxisFiled === 'date') {
                var dates = [];
                dataset.forEach(function (d) {
                    dates.push(getFormatDate(d[1]));
                });

                function getFormatDate(d) {
                    return moment(d).format('MM-DD-YYYY');
                }

                yScale = d3.scale.ordinal()
                    .rangeRoundBands([0, height], .1, 1)
                    .domain(dates);
            }
            else {
                if (options.data.length > 1) {
                    minValue = options.data[1][yAxisFiled] - options.data[0][yAxisFiled];
                    for (var i = 0; i < options.data.length; i++) {
                        for (var j = 0; j < options.data.length; j++) {
                            var b = Math.abs(options.data[i][yAxisFiled] - options.data[j][yAxisFiled]);
                            if (i !== j && b < minValue) {
                                minValue = b;
                            }
                        }
                    }
                }

                maxY = d3.max(dataset, function (d) {
                    return d[1];
                });
                yScale = d3.scale.linear()
                    .domain([0, maxY])
                    .range([0, height]);
            }
        }

        d3.select(selector + ' > *').remove();

        svg = d3.select(selector)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        format = d3.format('s');

        xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function (d) {
                return format(d) + ' ' + symbol;
            })
            .orient('bottom');

        yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(function (d) {
                return d === 'Select' ? 'None' : d;
            })
            .orient('left');

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end');

        svg.append('g')
            .attr('class', 'x axis')
            .call(xAxis)
            .attr("transform", "translate(0," + height + ")")
            .attr('x', 6)
            .attr('dx', '.71em')
            .style('text-anchor', 'end');

        svg.append('text')
            .attr('class', 'axisTitle')
            .attr('x', width / 2)
            .attr('y', height + 50)
            .text(infoX);

        tooltip = d3.select(selector)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        svg.selectAll('.barItem')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('class', 'barItem')
            .attr('x', function (d, i) {
                return 0;
            })
            .attr('y', function (d, i) {
                return yScale(d[1]);
            })
            .attr('width', function (d, i) {
                return xScale(d[0]);
            })
            .attr('height', function (d, i) {
                if (typeYAxisFiled !== 'number') {
                    return yScale.rangeBand();
                }
                else {
                    var h = height / dataset.length - 2 * padding;
                    if (h < 15) {
                        h = 15;
                    }
                    if (h > 20) {
                        h = 20
                    }
                    return h;
                }
            })
            .attr('fill', function (d) {
                var colorAlp = 1;
                return 'rgba(' + color + colorAlp + ')';
            });

        svg.selectAll('.hover')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('class', 'hover')
            .attr('x', function (d, i) {
                return 0;
            })
            .attr('width', width)
            .attr('y', function (d, i) {
                return yScale(d[1]);
            })
            .attr('height', function (d, i) {
                if (typeYAxisFiled !== 'number') {
                    return yScale.rangeBand();
                }
                else {
                    var h = height / dataset.length - 2 * padding;
                    if (h < 15) {
                        h = 15;
                    }
                    if (h > 20) {
                        h = 20
                    }
                    return h;
                }
            })
            .attr('fill', function (d) {
                return 'rgba(' + color + 0 + ')';
            })
            .on('mouseover', function (d) {
                var xPosition;
                var yPosition;

                xPosition = (width / 2);
                yPosition = options.openView ? ((height + margin.top + margin.bottom) - yScale(d[1])) : ((height + margin.top * 2 + margin.bottom) - yScale(d[1]));

                d3.select(this)
                    .attr({
                        opacity: 0.5
                    });

                tooltip.html('<div>' + (d[1] === 'Select' ? 'None' : d[1]) + '</div><div>' + helpers.currencySplitter(d[0].toFixed(afterDot)) + ' ' + symbol + '</div>')
                    .transition()
                    .style('left', xPosition + 'px')
                    .style('bottom', yPosition + 'px')
                    .duration(200)
                    .style("opacity", 1);
            })
            .on('mouseleave', function () {
                d3.select(this)
                    .attr({
                        opacity: 1
                    });

                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        svg.selectAll('line.x')
            .data(xScale.ticks())
            .enter()
            .append('line')
            .attr('class', 'x')
            .attr('x1', xScale)
            .attr('x2', xScale)
            .attr('y1', 0)
            .attr('y2', (height))
            .style('stroke', '#f2f2f2');
    }

    function drawHorizontalTwoColorChart(options) {
        var data = options.data;
        var stringFiled = options.yAxisFiled;
        var numericFiled = options.numericXAxisFiled;
        var doubleValueFiled = options.doubleValueXAxisFiled;
        var resultObj = {};
        var resultData = [];
        var keys;
        var margin;
        var width;
        var height;
        var selector;
        var container;
        var xScale;
        var yScale;
        var dataIntermediate;
        var dataStackLayout;
        var xData = [];
        var g;
        var svg;
        var layer;
        var color;
        var xAxis;
        var yAxis;
        var legend;
        var title;
        var typeYFiled;
        var widthSvg;
        var heightSvg;

        if (!options.data || !options.data.length) {
            return;
        }
        if (!options.yAxisFiled || !options.numericXAxisFiled || !options.doubleValueXAxisFiled) {
            return;
        }
        if (!options.typeYAxisFiled) {
            return;
        }
        if (!options.container || !options.selector) {
            return;
        }

        data.forEach(function (element) {
            if (!resultObj[element[stringFiled]]) {
                resultObj[element[stringFiled]] = {};
            }
            if (!resultObj[element[stringFiled]][element[doubleValueFiled]]) {
                resultObj[element[stringFiled]][element[doubleValueFiled]] = 0;
                if (xData.indexOf(element[doubleValueFiled]) < 0) {
                    xData.push(element[doubleValueFiled]);
                }
            }
            resultObj[element[stringFiled]][element[doubleValueFiled]] += element[numericFiled];
        });

        keys = Object.keys(resultObj);
        keys.forEach(function (key) {
            var buff;
            var obj = {};

            obj[stringFiled] = key;
            buff = resultObj[key];
            obj = _.extend(obj, buff);

            resultData.push(obj);
        });

        dataIntermediate = xData.map(function (c) {
            return resultData.map(function (d) {
                return {x: d[stringFiled], y: d[c]};
            });
        });

        dataStackLayout = d3.layout.stack()(dataIntermediate);

        container = options.container;
        selector = options.selector;
        margin = {
            top   : 30,
            left  : 150,
            bottom: 20,
            right : 20
        };

        width = container.width() - margin.left - margin.right;
        height = container.height() - margin.top * 2 - margin.bottom;

        widthSvg = container.width();
        heightSvg = container.height() - margin.top;

        typeYFiled = options.typeYAxisFiled.toLowerCase();
        yScale = d3.scale
            .ordinal()
            .rangeRoundBands([height, 0], 0.35)
            .domain(dataStackLayout[0].map(function (d) {
                return d.x;
            }));

        function getFormatDate(d) {
            return moment(d).format('MM-DD-YYYY');
        }

        xScale = d3.scale
            .linear()
            .rangeRound([0, width])
            .domain([0, d3.max(dataStackLayout[dataStackLayout.length - 1],
                function (d) {
                    return d.y0 + d.y;
                })
            ]).nice();

        color = ['#48B4DB', '#F89542'];

        d3.select(selector + ' > *').remove();

        svg = d3.select(selector)
            .append('svg')
            .attr('width', widthSvg)
            .attr('height', heightSvg);

        title = d3.select(selector)
            .append('div')
            .style({
                "border"          : "solid 1px black",
                "height"          : "30px",
                "font-size"       : "10px",
                "color"           : "black",
                'padding'         : '10px',
                'background-color': '#fff',
                'border-radius'   : '5px',
                'display'         : 'none',
                'position'        : 'absolute'
            });

        g = svg.append('g')
            .attr({
                transform: 'translate(' + (margin.left - 20) + ',' + (margin.top) + ')'
            });

        xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(d3.format('s'))
            .orient('bottom');

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickFormat(function (d) {
                if (typeYFiled === 'date') {
                    return getFormatDate(d);
                }
                if (d.length > 11) {
                    return d.substring(0, 11) + '...';
                }
                return d;
            });

        layer = g.selectAll('.stack')
            .data(dataStackLayout)
            .enter()
            .append('g')
            .attr('class', 'stack')
            .style('fill', function (d, i) {
                return color[i];
            });

        layer.selectAll('rect')
            .data(function (d) {
                return d;
            })
            .enter()
            .append('rect')
            .attr({
                x: function (d) {
                    return xScale(d.y0);
                },

                y: function (d) {
                    return yScale(d.x);
                },

                height: function () {
                    if (typeYFiled === 'number') {
                        return 35;
                    } else {
                        return yScale.rangeBand();
                    }
                },

                width: function (d) {
                    return xScale(d.y);
                }
            });

        g.append('g')
            .attr({
                class    : 'x axis',
                transform: 'translate(0,' + (height) + ')'
            })
            .call(xAxis);

        g.append('g')
            .attr({
                class    : 'y axis',
                transform: 'translate(0,0)'
            })
            .call(yAxis)
            .select('path');

        svg.selectAll('.x.axis line')
            .attr({
                y2: -height
            })
            .style({
                stroke: '#f2f2f2'
            });

        svg.selectAll('.y.axis .tick text')
            .on('mouseover', function (d, i) {

                if (d.length > 11) {
                    var xPosition = margin.right + 60;
                    var yPosition = height - yScale(d) + 65;

                    title.style('left', xPosition + 'px')
                        .style('bottom', yPosition + 'px')
                        .style({
                            'display': 'block'
                        })
                        .html(d);
                }
            })
            .on('mouseleave', function (d) {
                if (d.length > 11) {
                    title.style({
                        'display': 'none'
                    });
                }
            });

        legend = svg
            .append("g")
            .attr({
                transform: 'translate(' + margin.right + ',' + 0 + ')'
            })
            .selectAll(".legend")
            .data(xData)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                xData.sort(function (a, b) {
                    return a - b;
                });
                var labelWidth = xData[xData.length - 1].length + 15;
                var padding = 60;
                var count = xData.length;
                var startPosition = (width - (count * labelWidth + (count - 1) * padding)) / 2;
                var x = startPosition + i * (labelWidth + padding);

                return "translate(" + i * 60 + ", " + (10) + ")";
            });

        legend.append("rect")
            .attr("x", width - 10)
            .attr("y", 4)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function (d, i) {
                return color[i];
            });

        legend.append("text")
            .attr("x", width - 14)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                if (d.length > 20) {
                    return d.substring(0, 20) + '...';
                }
                return d;
            });
    }

    function drawLineChart(options) {
        var xAxisFiled;
        var yAxisFiled;
        var svg;
        var xScale;
        var yScale;
        var xAxis;
        var yAxis;
        var container;
        var margin;
        var height;
        var width;
        var dataset;
        var selector;
        var symbol;
        var line;
        var minY, maxY;
        var minX, maxX;
        var infoY;
        var afterDot;
        var tooltip;
        var typeXAxisFiled;
        var typeYAxisFiled;

        if (!options.data || !options.data.length || options.data.length < 2) {
            return;
        }
        if (!options.xAxisFiled || !options.yAxisFiled) {
            return;
        }
        if (!options.typeXAxisFiled || !options.typeYAxisFiled) {
            return;
        }
        if (options.typeXAxisFiled.toLowerCase() !== 'number' && options.typeYAxisFiled.toLowerCase() !== 'number') {
            return;
        }
        if (!options.container || !options.selector) {
            return;
        }

        if (options.typeXAxisFiled.toLowerCase() === 'number' && options.typeYAxisFiled.toLowerCase() === 'number') {
            xAxisFiled = options.xAxisFiled;
            yAxisFiled = options.yAxisFiled;

            typeXAxisFiled = options.typeXAxisFiled.toLowerCase();
            typeYAxisFiled = options.typeYAxisFiled.toLowerCase();
        } else {
            if (options.typeXAxisFiled.toLowerCase() === 'number') {
                xAxisFiled = options.yAxisFiled;
                yAxisFiled = options.xAxisFiled;

                typeXAxisFiled = options.typeYAxisFiled.toLowerCase();
                typeYAxisFiled = options.typeXAxisFiled.toLowerCase();
            } else {
                xAxisFiled = options.xAxisFiled;
                yAxisFiled = options.yAxisFiled;

                typeXAxisFiled = options.typeXAxisFiled.toLowerCase();
                typeYAxisFiled = options.typeYAxisFiled.toLowerCase();
            }
        }

        container = options.container;
        selector = options.selector;

        symbol = options.symbol ? options.symbol : '';
        afterDot = symbol === '%' ? 2 : 0;
        infoY = options.infoY ? options.infoY : '';

        dataset = [];
        options.data.forEach(function (d) {
            dataset.push({
                x: d[xAxisFiled],
                y: d[yAxisFiled]
            })
        });

        margin = {top: 20, right: 20, bottom: 30, left: 40};
        width = container.width() - margin.left - margin.right;
        height = container.height() - margin.bottom;

        if (typeXAxisFiled === 'date') {
            function getFormatDate(d) {
                return moment(d).format('MM-DD-YYYY');
            }

            function getDate(d) {
                return new Date(d);
            }

            xScale = d3.time.scale()
                .domain(d3.extent(dataset, function (d) {
                    return d.x;
                }))
                .range([0, width - (margin.right + margin.left)]);
        }
        else {
            if (typeXAxisFiled === 'string') {
                xScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width - (margin.right + margin.left)])
                    .domain(dataset.map(function (d) {
                        return d.x;
                    }));
            }
            else {
                maxX = d3.max(dataset, function (d) {
                    return d.x;
                });
                minX = d3.min(dataset, function (d) {
                    return d.x;
                });

                if (minX === maxX) {
                    minX = 0;
                }
                xScale = d3.scale.linear()
                    .domain([minX, maxX])
                    .range([0, width - (margin.right + margin.left)]);
            }

        }

        maxY = d3.max(dataset, function (d) {
            return d.y;
        });
        minY = d3.min(dataset, function (d) {
            return d.y;
        });

        if (minY === maxY) {
            minY = 0;
        }

        yScale = d3.scale.linear()
            .domain([0, maxY])
            .range([height - margin.bottom - margin.top, 0]);

        d3.select(selector + ' > *').remove();

        svg = d3.select(selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('margin', '10px')
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        tooltip = d3.select(selector)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function (d) {
                if (typeXAxisFiled === 'date') {
                    return getFormatDate(d);
                }

                return d;
            })
            .orient('bottom');

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');


        line = d3.svg.line()
            .x(function (d) {
                if (typeXAxisFiled === 'date') {
                    return xScale(getDate(d.x));
                }
                return xScale(d.x);
            })
            .y(function (d) {
                return yScale(d.y);
            });

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end');

        svg.append('g')
            .attr('class', 'x axis')
            .call(xAxis)
            .attr("transform", "translate(0," + ((height - margin.bottom * 2) + 20) + ")")
            .style('text-anchor', 'end');

        svg.append('path')
            .attr("fill", "none")
            .attr("stroke", "#48B4DB")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1)
            .attr("d", line(dataset));

        svg.append('text')
            .attr('class', 'axisTitle')
            .attr('transform', 'translate(' + -30 + ' ,' + -20 + ')')
            .text(infoY);

        svg.selectAll(".circle")
            .data(dataset)
            .enter()
            .append("svg:circle")
            .attr("cx", function (d, i) {
                return xScale(d.x);
            })
            .attr("cy", function (d, i) {
                return yScale(d.y);
            })
            .attr('r', 3)
            .attr("fill", function (d) {
                return '#334d97';
            })
            .on("mouseover", function (d) {
                var x;
                var xPosition;
                var yPosition;

                var w = tooltip[0][0].offsetWidth / 2;

                xPosition = Math.ceil(this.cx.baseVal.value + this.r.baseVal.value * 2 + w + 5);
                if (width < 300) {
                    yPosition = Math.ceil((height + margin.top) - this.cy.baseVal.value);
                } else {
                    yPosition = Math.ceil((height + margin.top * 2) + 10 - this.cy.baseVal.value);
                }

                if (typeXAxisFiled === 'date') {
                    x = getFormatDate(d.x);
                } else {
                    x = d.x;
                }

                tooltip.style("left", xPosition + "px")
                    .style("bottom", yPosition + "px")
                    .html('<div>' + x + '</div><div>' + helpers.currencySplitter(d.y.toFixed(afterDot)) + ' ' + symbol + '</div>')

                tooltip.transition()
                    .duration(500)
                    .style('opacity', 1);
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        svg.selectAll('line.y')
            .data(yScale.ticks())
            .enter()
            .append('line')
            .attr('class', 'y')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', yScale)
            .attr('y2', yScale)
            .style('stroke', '#f2f2f2');

    }

    function drawMultipleLineChart(options) {
        var margin;
        var height;
        var width;
        var selector;
        var container;
        var symbol;
        var line;
        var minY, maxY;
        var minX, maxX;
        var infoY;
        var afterDot;
        var tooltip;
        var xAxis;
        var yAxis;
        var xScale;
        var yScale;
        var keys;
        var svg;
        var dataset;
        var yData = [];
        var checkDate;
        var xAxisFiled = options.xAxisFiled;
        var doubleValueYAxisFiled = options.doubleValueYAxisFiled;
        var numericYAxisFiled = options.numericYAxisFiled;
        var data = options.data;
        var resultObj = {};
        var resultData = [];

        if (!options.data || !options.data.length) {
            return;
        }
        if (!options.typeXAxisFiled) {
            return;
        }
        if (!options.container || !options.selector) {
            return;
        }

        data.forEach(function (element) {
            if (!resultObj[element[xAxisFiled]]) {
                resultObj[element[xAxisFiled]] = {};
            }
            if (!resultObj[element[xAxisFiled]][element[doubleValueYAxisFiled]]) {
                resultObj[element[xAxisFiled]][element[doubleValueYAxisFiled]] = 0;
                if (yData.indexOf(element[doubleValueYAxisFiled]) < 0) {
                    yData.push(element[doubleValueYAxisFiled]);
                }
            }
            resultObj[element[xAxisFiled]][element[doubleValueYAxisFiled]] += element[numericYAxisFiled];
        });

        keys = Object.keys(resultObj);
        keys.forEach(function (key) {
            var buff;
            var obj = {};

            obj[xAxisFiled] = key;
            buff = resultObj[key];
            obj = _.extend(obj, buff);

            resultData.push(obj);
        });

        dataset = yData.map(function (dt, i) {
            return {
                id    : yData[i],
                values: resultData.map(function (d) {
                    return {x: d[xAxisFiled], y: d[yData[i]]};
                })
            };
        });

        container = options.container;
        selector = options.selector;
        symbol = options.symbol ? options.symbol : '';
        afterDot = symbol === '%' ? 2 : 0;
        infoY = options.infoY ? options.infoY : '';
        margin = {top: 20, right: 20, bottom: 30, left: 120};
        width = container.width() - margin.left - margin.right;
        height = container.height() - margin.bottom - margin.top;

        d3.select(selector + ' > *').remove();

        svg = d3.select(selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        maxY = d3.max(dataset, function (d) {
            return d3.max(d.values, function (dk) {
                return dk.y;
            })
        });

        minY = d3.min(dataset, function (d) {
            return d3.min(d.values, function (dk) {
                return dk.y;
            })
        });

        if (minY === maxY) {
            minY = 0;
        }

        yScale = d3.scale.linear()
            .domain([minY, maxY])
            .range([height, 0]);

        if (options.typeXAxisFiled.toLowerCase() === 'date') {

            var dates = d3.extent(dataset, function (d) {
                return d.values.map(function (c) {
                    return c.x;
                });
            })[0];
            dates.sort(function (date1, date2) {
                return date1 - date2;
            });
            checkDate = true;

            var minDate = getDate(dates[0]);
            var maxDate = getDate(dates[dates.length - 1]);

            function getDate(d) {
                return new Date(d);
            }

            xScale = d3.time.scale()
                .domain([minDate, maxDate])
                .range([0, width - (margin.right + margin.left)]);

        } else {
            if (options.typeXAxisFiled.toLowerCase() === 'string') {
                xScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width - margin.left + margin.right], .1, 1)
                    .domain(dataset.map(function (d) {
                        return d.x;
                    }));
            } else {
                maxX = d3.max(dataset, function (d) {
                    return d3.max(d.values, function (dk) {
                        return dk.x;
                    });
                });
                minX = d3.min(dataset, function (d) {
                    return d3.min(d.values, function (dk) {
                        return dk.x;
                    });
                });

                if (minX === maxX) {
                    minX = 0;
                }

                xScale = d3.scale.linear()
                    .domain([minX, maxX])
                    .range([0, width - (margin.right + margin.left)]);
            }
        }

        tooltip = d3.select(selector)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        line = d3.svg.line()
            .x(function (d, i) {
                var x = checkDate ? xScale(getDate(d.x)) : xScale(d.x);
                return x;
            })
            .y(function (d, i) {
                return yScale(d.y);
            });

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end');

        svg.append('g')
            .attr('class', 'x axis')
            .call(xAxis)
            .attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
            .attr('x', 6)
            .attr('dx', '.71em')
            .style('text-anchor', 'end');

        svg.append('text')
            .attr('class', 'axisTitle')
            .attr('transform', 'translate(' + -30 + ' ,' + -20 + ')')
            .text(infoY);

        dataset.forEach(function (d, i) {
            svg.append('svg:path')
                .attr('d', function () {
                    return line(d.values);
                })
                .attr('stroke', function (d, j) {
                    return "hsl(" + Math.random() * 360 + ",100%,50%)";
                })
                .attr('stroke-width', 1)
                .attr('fill', 'none');

            svg.append("svg:text")
                .datum(function () {
                    return {
                        id   : d.id,
                        value: d.values[d.values.length - 1]
                    };
                })
                .attr("transform", function (d) {
                    var x = checkDate ? xScale(getDate(d.value.x)) : xScale(d.value.x);
                    return "translate(" + (x + 10) + "," + yScale(d.value.y) + ")";
                })
                .attr("x", 3)
                .attr("dy", "0.35em")
                .style("font", "10px sans-serif")
                .text(function (d) {
                    return d.id;
                });

            svg.append("g")
                .selectAll("circle")
                .data(function (dd) {
                    return d.values
                })
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("cx", function (dd) {
                    var x = checkDate ? xScale(getDate(dd.x)) : xScale(dd.x);
                    return x;
                })
                .attr("cy", function (dd) {
                    return yScale(dd.y);
                })
                .attr("fill", 'black')
                .attr("stroke", "black")
                .on("mouseover", function (dd) {
                    var x = checkDate ? xScale(getDate(dd.x)) : xScale(dd.x);
                    var y = yScale(dd.y);
                    var xPosition = Math.ceil(x) + margin.right + 25;
                    var yPosition = (height + margin.bottom + margin.top * 3 + 50) - Math.ceil(y);

                    tooltip
                        .style('position', 'absolute')
                        .style("left", xPosition + "px")
                        .style("bottom", yPosition + "px")
                        .html('<div>' + dd.x + '</div><div>' + helpers.currencySplitter(dd.y.toFixed(afterDot)) + ' ' + symbol + '</div>')

                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 1);
                })
                .on("mouseout", function () {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
    }

    function drawPieChart(options) {
        var xAxisFiled;
        var yAxisFiled;
        var xAxisLabel;
        var yAxisLabel;
        var container;
        var selector;
        var infoY;
        var symbol;
        var afterDot;
        var info;
        var dataset;
        var height;
        var width;
        var margin;
        var svg;
        var color;
        var pie;
        var outerRadius;
        var innerRadius;
        var arc;
        var arcs;
        var legend;
        var tooltip;
        var legendRectSize = 18;
        var legendSpacing = 4;
        var animated;
        var totalValue;

        if (!options.data || !options.data.length) {
            return;
        }
        if (!options.xAxisFiled || !options.yAxisFiled) {
            return;
        }
        if (!options.typeXAxisFiled || !options.typeYAxisFiled) {
            return;
        }
        if (options.typeXAxisFiled.toLowerCase() !== 'number' && options.typeYAxisFiled.toLowerCase() !== 'number') {
            return;
        }
        if (!options.container || !options.selector) {
            return;
        }

        info = options.info ? options.info : '';
        infoY = options.infoY ? options.infoY : '';

        container = options.container;
        selector = options.selector;

        margin = {top: 20, right: 20, bottom: 20, left: 20};
        width = container.width() - (margin.left + margin.right);
        height = container.height() - (margin.bottom + margin.top);
        color = ['#4FA2E5','#F29D00','#b974d6','#00BDB8','#357dd8','#EC71B0', '#FFCF38'];
        pie = d3.layout.pie();

        xAxisFiled = options.xAxisFiled;
        yAxisFiled = options.yAxisFiled;

        animated = options.animated ? options.animated : false;

        symbol = options.symbol ? options.symbol : '';

        afterDot = symbol === '%' ? 2 : 0;

        d3.select(selector + ' > *').remove();

        dataset = [];
        options.data.forEach(function (d) {
            dataset.push({
                x: d[xAxisFiled],
                y: d[yAxisFiled]
            })
        });

        dataset.sort(function (el1, el2) {
            return (el1.y - el2.y) * -1;
        });

        svg = d3.select(selector)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height);

        tooltip = svg.append('text')
            .attr({
                class: 'infoLabel',
                x    : 20,
                y    : 15
            })
            .style('display', 'none')
            .attr({
                'display': 'none'
            });

        if (width > height) {
            outerRadius = height / 2 - margin.top;
            innerRadius = 0;
        } else {
            outerRadius = width / 2 - margin.left;
            innerRadius = 0;
        }

        arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        arcs = svg.selectAll("g.arc")
            .data(pie(dataset.map(function (d) {
                return d.y;
            })))
            .enter()
            .append("g")
            .attr("class", "arc")
            .style('stroke', 'white')
            .style('stroke-width', 1)
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

        if (animated) {
            var xPosition;
            var yPosition;
            arcs.append("path")
                .attr("fill", function (d, i) {
                    return i >= color.length ? color[i % color.length] : color[i];
                })
                .attr("d", arc)
                .transition()
                .duration(200)
                .attrTween("d", tweenPie);

            arcs.select('path')
                .on('mouseover', function (d, i) {
                    var x = dataset.map(function (d) {
                        return d.x;
                    });
                    var y = dataset.map(function (d) {
                        return d.y;
                    });

                    d3.select(this)
                        .attr({
                            opacity: 0.5
                        });

                    var xText = x[i] + ' ';
                    var yText = helpers.currencySplitter(y[i].toFixed(afterDot)) + ' ' + symbol;

                    tooltip.transition()
                        .duration(300)
                        .style('display', 'block')
                        .text(xText + ' ' + yText);

                    if (dataset.length > 1) {
                        var elem = d3.select(this).datum();
                        var startAngle = elem.startAngle;
                        var endAngle = elem.endAngle;

                        var dgre = ( endAngle - startAngle) / 2 + startAngle;
                        var dis = 10;

                        xPosition = d3.round(Math.sin(dgre), 15) * dis;
                        yPosition = -d3.round(Math.cos(dgre), 15) * dis;

                        d3.select(this)
                            .transition()
                            .duration(700)
                            .attr("transform", "translate(" + xPosition + ", " + yPosition + ")");
                    }
                })
                .on('mouseleave', function (d) {
                    d3.select(this)
                        .attr({
                            opacity: 1
                        });

                    tooltip.transition()
                        .duration(200)
                        .style('display', 'none');

                    if (dataset.length > 1) {
                        d3.select(this)
                            .transition()
                            .duration(700)
                            .attr("transform", "translate(" + (-(xPosition / 10)) + "," + (-(yPosition / 10)) + ")");
                    }
                });

            function tweenPie(b) {
                b.innerRadius = 0;
                var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
                return function (t) {
                    return arc(i(t));
                };
            }
        }
        else {
            arcs.append("path")
                .attr("fill", function (d, i) {
                    return i >= color.length ? color[i % color.length] : color[i];
                })
                .attr("d", arc)
                .on('mouseover', function (d, i) {
                    var x = dataset.map(function (d) {
                        return d.x;
                    });
                    var y = dataset.map(function (d) {
                        return d.y;
                    });

                    d3.select(this)
                        .attr({
                            opacity: 0.5
                        });

                    var xText = x[i] + ' ';
                    var yText = helpers.currencySplitter(y[i].toFixed(afterDot)) + ' ' + symbol;

                    tooltip.transition()
                        .duration(300)
                        .style('display', 'block')
                        .text(xText + ' ' + yText);

                    if (dataset.length > 1) {
                        var elem = d3.select(this).datum();
                        var startAngle = elem.startAngle;
                        var endAngle = elem.endAngle;

                        var dgre = ( endAngle - startAngle) / 2 + startAngle;
                        var dis = 10;

                        xPosition = d3.round(Math.sin(dgre), 15) * dis;
                        yPosition = -d3.round(Math.cos(dgre), 15) * dis;

                        d3.select(this)
                            .transition()
                            .duration(700)
                            .attr("transform", "translate(" + xPosition + ", " + yPosition + ")");

                    }
                })
                .on('mouseleave', function (d) {
                    d3.select(this)
                        .attr({
                            opacity: 1
                        });

                    tooltip.transition()
                        .duration(200)
                        .style('display', 'none');

                    if (dataset.length > 1) {
                        d3.select(this)
                            .transition()
                            .duration(700)
                            .attr("transform", "translate(" + (-(xPosition / 10)) + "," + (-(yPosition / 10)) + ")");
                    }
                })
        }
    }

    function drawDonutChart(options) {
        var xAxisFiled;
        var yAxisFiled;
        var container;
        var selector;
        var infoY;
        var symbol;
        var afterDot;
        var info;
        var dataset;
        var height;
        var width;
        var margin;
        var svg;
        var color;
        var pie;
        var outerRadius;
        var innerRadius;
        var arc;
        var arcs;
        var tooltip;
        var animated;
        var totalValue;
        var format;

        if (!options.data || !options.data.length) {
            return;
        }
        if (!options.xAxisFiled || !options.yAxisFiled) {
            return;
        }
        if (!options.typeXAxisFiled || !options.typeYAxisFiled) {
            return;
        }
        if (options.typeXAxisFiled.toLowerCase() !== 'number' && options.typeYAxisFiled.toLowerCase() !== 'number') {
            return;
        }
        if (!options.container || !options.selector) {
            return;
        }

        info = options.info ? options.info : '';
        infoY = options.infoY ? options.infoY : '';

        container = options.container;
        selector = options.selector;

        margin = {top: 20, right: 20, bottom: 20, left: 20};
        width = container.width() - margin.left - margin.right;
        height = container.height() - margin.bottom - margin.top;
        color = ['#4FA2E5','#F29D00','#b974d6','#00BDB8','#357dd8','#EC71B0', '#FFCF38'];

        pie = d3.layout.pie();

        xAxisFiled = options.xAxisFiled;
        yAxisFiled = options.yAxisFiled;

        animated = options.animated ? options.animated : false;

        symbol = options.symbol ? options.symbol : '';

        afterDot = symbol === '%' ? 2 : 0;

        d3.select(selector + ' > *').remove();

        dataset = [];
        options.data.forEach(function (d) {
            dataset.push({
                x: d[xAxisFiled],
                y: d[yAxisFiled]
            })
        });

        dataset.sort(function (el1, el2) {
            return (el1.y - el2.y) * -1
        });

        svg = d3.select(selector)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.bottom + margin.top);

        tooltip = svg.append('text')
            .attr({
                class: 'infoLabel',
                x    : 20,
                y    : 15
            })
            .style('display', 'none');

        if (width > height) {
            outerRadius = height / 2;
            innerRadius = outerRadius / 2;
        } else {
            outerRadius = width / 2 - margin.bottom;
            innerRadius = outerRadius / 2;
        }

        arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        arcs = svg.selectAll("g.arc")
            .data(pie(dataset.map(function (d) {
                return d.y;
            })))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

        if (animated) {
            arcs.append("path")
                .attr("fill", function (d, i) {
                    return i >= color.length ? color[i % color.length] : color[i];
                })
                .attr("d", arc)
                .on('mouseover', function (d, i) {
                    var x = dataset.map(function (d) {
                        return d.x;
                    });
                    var y = dataset.map(function (d) {
                        return d.y;
                    });

                    d3.select(this)
                        .attr({
                            opacity: 0.5
                        });

                    var xText = x[i] + ' ';
                    var yText = helpers.currencySplitter(y[i].toFixed(afterDot)) + ' ' + symbol;
                    tooltip.transition()
                        .duration(300)
                        .style('display', 'block')
                        .text(xText + ' ' + yText);

                })
                .on('mouseleave', function () {
                    d3.select(this)
                        .attr({
                            opacity: 1
                        });

                    tooltip.transition()
                        .duration(200)
                        .style('display', 'none');
                })
                .transition()
                .duration(200)
                .attrTween("d", tweenPie);

            function tweenPie(b) {
                b.innerRadius = 0;
                var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
                return function (t) {
                    return arc(i(t));
                };
            }
        } else {
            arcs.append("path")
                .attr("fill", function (d, i) {
                    return i >= color.length ? color[i % color.length] : color[i];
                })
                .style('stroke', 'white')
                .style('stroke-width', 1)
                .attr("d", arc)
                .on('mouseover', function (d, i) {
                    var x = dataset.map(function (d) {
                        return d.x;
                    });
                    var y = dataset.map(function (d) {
                        return d.y;
                    });

                    d3.select(this)
                        .attr({
                            opacity: 0.5
                        });

                    var xText = x[i] + ' :';
                    var yText = helpers.currencySplitter(y[i].toFixed(afterDot)) + ' ' + symbol;
                    tooltip.transition()
                        .duration(300)
                        .style('display', 'block')
                        .text(xText + ' ' + yText);

                })
                .on('mouseleave', function () {
                    d3.select(this)
                        .attr({
                            opacity: 1
                        });

                    tooltip.transition()
                        .duration(200)
                        .style('display', 'none');
                });
        }

        svg.append('text')
            .text('Total')
            .attr({
                class      : '_label',
                fill       : '#333',
                'font-size': options.openView ? '32px' : innerRadius < 40 ? '10px' : '14px',

                x: function () {
                    return width / 2 + margin.left - d3.select(this).node().getBBox().width / 2;
                },

                y: function () {
                    return height / 2 + margin.top - 10;
                }
            });

        totalValue = _.reduce(dataset.map(function (d) {
            return d.y;
        }), function (memo, num) {
            return memo + num;
        }, 0);

        format = d3.format('s');

        svg.append('text')
            .text(function (d) {
                var str = format(totalValue);
                var buff;
                if (str.length > 5) {
                    buff = str.substring(str.length - 1);
                    return str.substring(0, 5) + buff + symbol;
                }
                return str + symbol;
            })
            .attr({
                class      : '_valueLabel',
                fill       : '#333',
                'font-size': options.openView ? '32px' : innerRadius < 40 ? '10px' : '14px',

                x: function () {
                    return width / 2 + margin.left - d3.select(this).node().getBBox().width / 2;
                },

                y: function () {
                    return height / 2 + margin.top + 20;
                }
            });

    }

    function minimumDiference(arr, filed) {
        var minDif = arr[1][filed] - arr[0][filed];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                var b = Math.abs(arr[i][filed] - arr[j][filed]);
                if (i !== j && b < minDif) {
                    minDif = b;
                }
            }
        }
        return minDif;
    }

    function maximumDiference(arr, filed) {
        var maxDif = arr[1][filed] - arr[0][filed];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                var b = Math.abs(arr[i][filed] - arr[j][filed]);
                if (i !== j && b > maxDif) {
                    maxDif = b;
                }
            }
        }
        return maxDif;
    }

    function drawCircles(options) {
        var xScale;
        var yScale;
        var rScale;
        var xAxisFiled;
        var yAxisFiled;
        var xAxis;
        var yAxis;
        var container;
        var selector;
        var infoY;
        var symbol;
        var afterDot;
        var info;
        var dataset;
        var maxX;
        var maxY;
        var height;
        var width;
        var margin;
        var svg;
        var tooltip;
        var checkNumberX;

        if (!options.data || !options.data.length) {
            return;
        }
        if (!options.xAxisFiled || !options.yAxisFiled) {
            return;
        }
        if (!options.typeXAxisFiled || !options.typeYAxisFiled) {
            return;
        }
        if (options.typeXAxisFiled.toLowerCase() !== 'number' && options.typeYAxisFiled.toLowerCase() !== 'number') {
            return;
        }
        if (!options.container || !options.selector) {
            return;
        }

        info = options.info ? options.info : '';
        infoY = options.infoY ? options.infoY : '';

        container = options.container;
        selector = options.selector;

        margin = {top: 20, right: 20, bottom: 30, left: 120};
        width = container.width() - margin.left - margin.right;
        height = 350 - margin.bottom - margin.top;

        xAxisFiled = options.xAxisFiled;
        yAxisFiled = options.yAxisFiled;

        //color = options.color ? options.color : "51,77,151,";
        symbol = options.symbol ? options.symbol : '';

        afterDot = symbol === '%' ? 2 : 0;

        d3.select('.' + selector + ' > *').remove();

        dataset = [];
        options.data.forEach(function (d) {
            dataset.push({
                x: d[xAxisFiled],
                y: d[yAxisFiled]
            })
        });

        if (options.typeXAxisFiled.toLowerCase() !== 'number') {
            checkNumberX = false;
            xScale = d3.scale.ordinal()
                .rangeRoundBands([0, width - margin.left], .1, 1)
                .domain(dataset.map(function (d) {
                    return d.x;
                }));
        } else {
            checkNumberX = true;
            maxX = d3.max(dataset, function (d) {
                return d.x;
            });
            xScale = d3.scale.linear()
                .range([0, width - margin.left])
                .domain([0, maxX]);
        }

        maxY = d3.max(dataset, function (d) {
            return d.y;
        });

        yScale = d3.scale.linear()
            .domain([0, maxY])
            .range([height, 0]);

        rScale = d3.scale.linear()
            .domain([0, maxY])
            .range([2, 7]);

        svg = d3.select('.' + selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function (d) {
                if (checkNumberX) {
                    return d;
                } else {
                    if (d.length > 20) {
                        return d.substring(0, Math.ceil(d.length / 2)) + '...';
                    }
                    return d;
                }
            })
            .orient('bottom');

        yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(function (d) {
                return d + " " + symbol;
            })
            .orient('left');

        tooltip = d3.select('.' + selector)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end');

        svg.append('g')
            .attr('class', 'axis')
            .call(xAxis)
            .attr("transform", "translate(0," + (height) + ")")
            .attr('x', 6)
            .attr('dx', '.71em')
            .style('text-anchor', 'end');

        svg.append('text')
            .attr('class', 'axisTitle')
            .attr('transform', 'translate(' + -30 + ' ,' + -20 + ')')
            .text(infoY);

        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xScale(d.x);
            })
            .attr("cy", function (d) {
                return yScale(d.y);
            })
            .attr("r", function (d) {
                return rScale(d.y);
            })
            .attr("fill", function (d) {
                return "rgb(0, 0, " + (d.y * 10) + ")";
            })
            .on('mouseover', function (d) {
                var xPosition = Math.ceil(xScale(d.x)) + margin.right + 25;
                var yPosition = (height + margin.bottom + margin.top * 3 + 50) - Math.ceil(yScale(d.y));
                // if (yPosition < 0) {
                //     yPosition = 120;
                // }

                d3.select(this)
                    .attr({
                        opacity: 0.5
                    });

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                tooltip.html('<div>' + d.x + '</div><div>' + helpers.currencySplitter(d.y.toFixed(afterDot)) + ' ' + symbol + '</div>')
                    .style('left', xPosition + 'px')
                    .style('bottom', yPosition + 'px');

            })
            .on('mouseleave', function () {
                d3.select(this)
                    .attr({
                        opacity: 1
                    });

                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    return {
        drawVerticalChart          : drawVerticalChart,
        drawHorizontalChart        : drawHorizontalChart,
        drawHorizontalTwoColorChart: drawHorizontalTwoColorChart,
        drawLineChart              : drawLineChart,
        drawMultipleLineChart      : drawMultipleLineChart,
        drawCircles                : drawCircles,
        drawPieChart               : drawPieChart,
        drawDonutChart             : drawDonutChart
    }
});
