define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/hrDashboard/index.html',
    'collections/Dashboard/hrDashboard',
    'dataService',
    'constants',
    'async',
    'd3',
    'custom',
    'moment',
    'common',
    'helpers',
    'views/guideTours/guideNotificationView'
], function (Backbone, $, _, mainTemplate, hrDashboard, dataService, CONSTANTS, async, d3, custom, moment, common, helpers, GuideNotify) {
    'use strict';

    var View = Backbone.View.extend({
        el           : '#content-holder',
        contentType  : CONSTANTS.DASHBOARD_HR,
        contentHeader: 'HR Dashboard',
        template     : _.template(mainTemplate),

        events: {
            'click .chart-tabs a': 'changeTab',
            'click .HRTabsButtons': 'activateTabs'
        },

        initialize: function (options) {
            var self = this;
            var dashCollection = this.dashCollection = custom.retriveFromCash('hrDashboard');

            this.startTime = options.startTime;

            /*$('input[type=date]').datepicker({
             // Consistent format with the HTML5 picker
             changeMonth: true,
             changeYear: true,
             showButtonPanel: true,
             dateFormat: 'MM yy'
             });
             */

            if (!dashCollection || !dashCollection.length) {
                dashCollection = this.dashCollection = new hrDashboard();
                dashCollection.on('reset sort', this.render, this);

                custom.cacheToApp('hrDashboard', dashCollection);
            } else {
                this.render();
            }
        },

        activateTabs: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var info = $target.attr('data-click');

            $thisEl.find('.HRTabsButtons').removeClass('active');
            $thisEl.find('.HRTabsButtons').removeClass('active');
            $target.addClass('active');
            $thisEl.find('#' + info).addClass('active');
        },

        changeTab: function (e) {
            $(e.target).closest(".chart-tabs").find("a.active").removeClass("active");
            $(e.target).addClass("active");
            var n = $(e.target).parents(".chart-tabs").find("li").index($(e.target).parent());
            $(".chart-tabs-items").find(".chart-tabs-item.active").removeClass("active");
            $(".chart-tabs-items").find(".chart-tabs-item").eq(n).addClass("active");
        },

        renderDepartmentsTree: function () {
            common.byDepartmentForChart(function (data) {
                console.log(data);
                var margin = {top: 10, right: 120, bottom: 20, left: 120};
                var width = 800 - margin.right - margin.left;
                var height = 1000 - margin.top - margin.bottom;
                var svg = d3.select('.treeChart').append('svg')
                    .attr('width', 1000)
                    .attr('height', 1000)
                    .attr('display', 'block')
                    .style('margin', '0 auto')
                    .append('g')
                    .attr('transform', 'translate(0,' + 20 + ')');
                var tree = d3.layout.tree()
                    .size([height, width - 200])
                    .children(function (person) {
                        return person.children || person.employees;
                    });
                var i = 0;
                var duration = 750;
                var root;
                var rectW = 110;
                var rectH = 300;
                var diagonal = d3.svg.diagonal()
                    .projection(function (d) {
                        return [d.x, d.y];
                    });

                root = data;
                root.y0 = height / 2;
                root.x0 = 0;

                function collapse(d) {
                    if (d.departments) {
                        d.children = d.departments;
                        d.children.forEach(collapse);
                        d.departments = null;
                    } else if (d.employees) {
                        d._children = d.employees;
                        d._children.forEach(collapse);
                        d.employees = null;
                        d.hasEmployee = true;
                        d.active = false;
                    }
                }

                root.children.forEach(collapse);
                update(root);

                function update(source) {
                    var nodes = tree.nodes(root).reverse();
                    var links = tree.links(nodes);
                    var node;
                    var nodeEnter;
                    var nodeUpdate;
                    var nodeExit;
                    var link;

                    nodes.forEach(function (d) {
                        d.y = d.depth * 180;
                    });

                    node = svg.selectAll('g.node')
                        .data(nodes, function (d) {
                            return d.id || (d.id = ++i);
                        });

                    nodeEnter = node.enter().append('g')
                        .attr('class', 'node')
                        .attr('transform', function (d) {
                            return 'translate(' + source.x0 + ',' + source.y0 + ')';
                        })
                        .on('click', click);

                    nodeEnter.append('circle')
                        .attr('r', 1e-6)
                        .style('fill', function (d) {
                            return d._children ? 'lightsteelblue' : '#fff';
                        });

                    nodeEnter.append('text')
                        .attr('x', 20)
                        .attr('y', -20)
                        .attr('dy', '2.35em')
                        .attr('transform', 'rotate(90)')
                        .attr('font', '14px')
                        .text(function (d) {
                            var count = d.hasEmployee && d._children && d._children.length ? (' (' + d._children.length + ')') : '';

                            return d.name + count;
                        });

                    nodeUpdate = node.transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + d.x + ',' + d.y + ')';
                        });

                    nodeUpdate.select('circle')
                        .attr('r', 4.5)
                        .style('fill', function (d) {
                            return d._children ? 'lightsteelblue' : '#fff';
                        });

                    nodeUpdate.select('text')
                        .style('fill-opacity', 1);

                    nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + source.x + ',' + source.y + ')';
                        })
                        .remove();

                    nodeUpdate.select('circle')
                        .attr('r', 4.5);

                    nodeExit.select('text')
                        .style('fill-opacity', 1e-6);

                    link = svg.selectAll('path.link')
                        .data(links, function (d) {
                            return d.target.id;
                        });

                    link.enter().insert('path', 'g')
                        .attr('class', 'link')
                        .attr('x', rectW / 2)
                        .attr('y', rectH / 2)
                        .attr('d', function (d) {
                            var o = {
                                x: source.x0,
                                y: source.y0
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        });

                    link.transition()
                        .duration(duration)
                        .attr('d', diagonal);

                    link.exit().transition()
                        .duration(duration)
                        .attr('d', function (d) {
                            var o = {
                                x: source.x,
                                y: source.y
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        })
                        .remove();

                    nodes.forEach(function (d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }

                function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }
            });
        },

        renderDepartmentsTreeRadial: function () {
            common.byDepartmentForChart(function (data) {
                var diameter = 1000;
                var tree = d3.layout.tree()
                    .size([360, diameter / 2 - 120])
                    .separation(function (a, b) {
                        return (a.parent == b.parent ? 1 : 2) / a.depth;
                    });
                var diagonal = d3.svg.diagonal.radial()
                    .projection(function (d) {
                        return [d.y, d.x / 180 * Math.PI];
                    });
                var svg = d3.select('.radialTreeChart').append("svg")
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .attr('display', 'block')
                    .style('margin', '0 auto')
                    .append("g")
                    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
                var i = 0;
                var duration = 750;
                var root;

                root = data;

                function collapse(d) {
                    if (d.departments) {
                        d.children = d.departments;
                        d.children.forEach(collapse);
                        d.departments = null;
                    } else if (d.employees) {
                        d.children = d.employees;
                        d.children.forEach(collapse);
                        d.employees = null;
                        d.hasEmployee = true;
                        d.active = false;
                    }
                }

                root.children.forEach(collapse);
                update(root);

                function update(source) {
                    var nodes = tree.nodes(root);
                    var links = tree.links(nodes);
                    var node;
                    var nodeEnter;
                    var nodeUpdate;
                    var nodeExit;
                    var link;

                    link = svg.selectAll('path.link')
                        .data(links);

                    link.enter().append('path')
                        .attr('class', 'link')
                        .attr("d", diagonal);

                    link.transition()
                        .duration(duration)
                        .attr('d', diagonal);

                    link.exit().transition()
                        .duration(duration)
                        .attr("d", diagonal)
                        .remove();

                    node = svg.selectAll('.node')
                        .data(nodes, function (d) {
                            return d.id || (d.id = ++i);
                        });

                    nodeEnter = node.enter().append('g')
                        .attr('class', 'node').on('click', click)
                        .attr("transform", function (d) {
                            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                        });

                    nodeEnter.append('circle')
                        .attr('r', 1e-6)
                        .style('fill', function (d) {
                            return d._children ? 'lightsteelblue' : '#fff';
                        });

                    nodeEnter.append("text")
                        .attr("dy", ".31em")
                        .attr("text-anchor", function (d) {
                            return d.x < 180 ? "start" : "end";
                        })
                        .attr("transform", function (d) {
                            return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
                        })
                        .text(function (d) {
                            var count = d.hasEmployee && d.children && d.children.length ? (' (' + d.children.length + ')') : '';

                            return d.name + count;
                        });

                    nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                        });

                    nodeUpdate.select('circle')
                        .attr('r', 4.5)
                        .style('fill', function (d) {
                            return d._children ? 'lightsteelblue' : '#fff';
                        });

                    nodeUpdate.select('text')
                        .attr("text-anchor", function (d) {
                            return d.x < 180 ? "start" : "end";
                        })
                        .attr("transform", function (d) {
                            return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
                        })
                        .style('fill-opacity', 1);

                    nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            return "rotate(" + (source.x - 90) + ")translate(" + source.y + ")";
                        })
                        .remove();

                    nodeExit.select('circle')
                        .attr('r', 4.5);

                    nodeExit.select('text')
                        .style('fill-opacity', 1e-6);

                    nodes.forEach(function (d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }

                function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }
            });
        },

        renderEmployeesDashbord: function () {
            var self = this;

            $('.dashboard-stat').children('.number').empty();
            $('.dashboard-stat').children('.desc').empty();

            common.getEmployeesCount({month: self.month, year: self.year}, function (response) {
                var totalEmployeesCount = response.employeeCount;
                var hiredCount = response.hiredCount;
                var firedCount = response.firedCount;
                var data;

                data = [
                    {
                        key  : 'Employees',
                        value: totalEmployeesCount
                    },
                    {
                        key  : 'Hired',
                        value: hiredCount
                    },
                    {
                        key  : 'Fired',
                        value: firedCount
                    }
                ];

                d3.selectAll('.dashboard-stat')
                    .data(data)
                    .style('width', '200px')
                    .style('height', '127px')
                    .style('float', 'left')
                    .style('margin', '10px')
                    .style('background-color', function (d) {
                        return d.key === 'Employees' ? '#33F' : d.key === 'Hired' ? '#32c5d2' : '#FF3333';
                    })
                    .style('color', 'white')
                    .style('padding-top', '35px')
                    .style('text-align', 'center')
                    .style('font-size', '20px')
                    .select('.number')
                    .append('span')
                    .text(0)
                    .style('opacity', 1)
                    .style('color', 'white')
                    .style('font-size', '20px')
                    .transition()
                    .duration(7500)
                    .delay(500)
                    .attrTween('d', function (d) {
                        return d3.interpolate(0, d.value);
                    })
                    .text(function (d) {
                        return d.value;
                    });

                d3.selectAll('.dashboard-stat')
                    .select('.desc')
                    .append('span')
                    .text(function (d) {
                        return d.key;
                    })
                    .style('font-size', '20px');

            });
        },

        renderVocationDashbord: function () {
            var self = this;

            $('.dashboard-vacation-stat').children('.number').empty();
            $('.dashboard-vacation-stat').children('.desc').empty();

            common.getVacationForChart({month: self.month, year: self.year}, function (response) {
                var data = [
                    {
                        key  : 'Vacation',
                        value: response.vacation
                    },
                    {
                        key  : 'Personal',
                        value: response.personal
                    },
                    {
                        key  : 'Sick',
                        value: response.sick
                    },
                    {
                        key  : 'Education',
                        value: response.education
                    }
                ];

                d3.selectAll('.dashboard-vacation-stat')
                    .data(data)
                    .style('width', '200px')
                    .style('height', '127px')
                    .style('float', 'left')
                    .style('margin', '10px')
                    .style('background-color', function (d) {
                        return d.key === 'Vacation' ? '#e55253' : d.key === 'Personal' ? '#f9a203' : d.key === 'Education' ? '#3e7f42' : '#3e88b9';
                    })
                    .style('color', 'white')
                    .style('padding-top', '35px')
                    .style('text-align', 'center')
                    .select('.number')
                    .append('span')
                    .text(0)
                    .style('opacity', 1)
                    .style('color', 'white')
                    .style('font-size', '20px')
                    .transition()
                    .duration(7500)
                    .delay(500)
                    .attrTween('d', function (d) {
                        return d3.interpolate(0, d.value);
                    })
                    .text(function (d) {
                        return d.value;
                    });
                


                console.log(data);

                d3.selectAll('.dashboard-vacation-stat')
                    .select('.desc')
                    .append('span')
                    .text(function (d) {
                        if (d) {
                            return d.key;
                        }

                        return '';
                    })
                    .style('font-size', '20px');
            });
        },

        renderHoursDashbord: function () {
            var self = this;

            $('.dashboard-hours-stat').children('.number').empty();
            $('.dashboard-hours-stat').children('.desc').empty();

            common.getHoursForChart({month: self.month, year: self.year}, function (response) {
                var data = [
                    {
                        key  : 'Total',
                        value: response.total
                    },
                    {
                        key  : 'Actual',
                        value: response.actual
                    },
                    {
                        key  : 'Idle',
                        value: response.idle
                    },
                    {
                        key  : 'Overtime',
                        value: response.overtime
                    }
                ];

                d3.selectAll('.dashboard-hours-stat')
                    .data(data)
                    .style('width', '200px')
                    .style('height', '127px')
                    .style('float', 'left')
                    .style('margin', '10px')
                    .style('background-color', function (d) {
                        return d.key === 'total' ? '#33F' : d.key === 'actual' ? '#32c5d2' : d.key === 'idle' ? '#8E44AD' : '#FF3333';
                    })
                    .style('color', 'white')
                    .style('padding-top', '35px')
                    .style('text-align', 'center')
                    .select('.number')
                    .append('span')
                    .text(0)
                    .style('opacity', 1)
                    .style('color', 'white')
                    .style('font-size', '20px')
                    .transition()
                    .duration(7500)
                    .delay(500)
                    .attrTween('d', function (d) {
                        return d3.interpolate(0, d.value);
                    })
                    .text(function (d) {
                        return d.value;
                    });

                d3.selectAll('.dashboard-hours-stat')
                    .select('.desc')
                    .append('span')
                    .text(function (d) {
                        if (d) {
                            return d.key;
                        }

                        return '';
                    })
                    .style('font-size', '20px');
            });
        },

        renderEmployeesChartByDepartments: function () {
            var self = this;

            $('.employeesChart').empty();

            common.getEmployeesForChart(function (data) {
                var margin = {top: 20, right: 160, bottom: 30, left: 160};
                var width = 500;
                var height = 400;
                var y;
                var x;
                var x2;
                var xAxis;
                var yAxis;
                var x2Axis;
                var chart;

                self.departments = data;

                y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.3);

                /*x = d3.scale.linear()
                 .range([80, (width - 160) / 2]);

                 x2 = d3.scale.linear()
                 .range([(width - 160) / 2, width + 80]);
                 */
                x = d3.scale.linear()
                    .range([0, width / 2]);

                x2 = d3.scale.linear()
                    .range([width / 2, width]);

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

                x2Axis = d3.svg.axis()
                    .scale(x2)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                chart = d3.select('.employeesChart')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                y.domain(_.map(self.departments, function (d) {
                    return d._id + ' (' + d.employeesCount + ')';
                }));

                x.domain([d3.max(self.departments, function (d) {
                    return d.maleCount;
                }) + 10, 0]);

                x2.domain([0, d3.max(self.departments, function (d) {
                    return d.femaleCount;
                }) + 10]);

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(x2Axis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis);

                chart.selectAll('.bar')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', function (d) {
                        return x2(0);
                    })
                    .attr('y', function (d) {
                        return y(d._id + ' (' + d.employeesCount + ')');
                    })
                    .attr('height', function () {
                        var range = y.rangeBand();

                        return range > 70 ? 70 : range;
                    })
                    .attr('width', function (d) {
                        return x2(d.maleCount) - x(0);
                    })
                    .style('fill', 'blue')
                    .style('opacity', '0.8');

                chart.selectAll('.bar2')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', function (d) {
                        return x(d.femaleCount);
                    })
                    .attr('y', function (d) {
                        return y(d._id + ' (' + d.employeesCount + ')');
                    })
                    .attr('height', function () {
                        var range = y.rangeBand();

                        return range > 70 ? 70 : range;
                    })
                    .attr('width', function (d) {
                        return Math.abs(x(d.femaleCount) - x(0));
                    })
                    .style('fill', 'red')
                    .style('opacity', '0.8');

            });
        },

        renderSalaryChart: function () {
            var padding = 15;
            var lengthArr = [];
            var offset = 4;
            var globalSalary;
            var dataLength;
            var $wrapper;
            var margin;
            var yLabels;
            var xScale;
            var yScale;
            var height;
            var xAxis;
            var yAxis;
            var width;
            var chart;
            var rect;
            var keys;
            var max;
            var j;
            var i;

            d3.select('.salaryChart > *').remove();

            common.getSalary({
                month: this.month,
                year : this.year
            }, function (data) {
                dataLength = data.length;
                globalSalary = {
                    '>=$2250'   : [],
                    '$2250-2000': [],
                    '$2000-1750': [],
                    '$1750-1500': [],
                    '$1500-1750': [],
                    '$1250-1500': [],
                    '$1000-1250': [],
                    '$750-1000' : [],
                    '$500-750'  : [],
                    '$250-500'  : [],
                    '<$250'     : []
                };

                yLabels = ['>=$2250', '$2250-2000', '$2000-1750', '$1750-1500', '$1500-1750',
                    '$1250-1500', '$1000-1250', '$750-1000', '$500-750', '$250-500', '<$250'];

                for (i = dataLength; i--;) {

                    if (data[i] >= 1500) {
                        if (data[i] >= 2250) {
                            globalSalary['>=$2250'].push(data[i]);
                        } else if (data[i] < 2250 && data[i] >= 2000) {
                            globalSalary['$2250-2000'].push(data[i]);
                        } else if (data[i] < 2000 && data[i] >= 1750) {
                            globalSalary['$2000-1750'].push(data[i]);
                        } else if (data[i] < 1750 && data[i] >= 1500) {
                            globalSalary['$1750-1500'].push(data[i]);
                        }
                    } else if (data[i] < 1500) {
                        if (data[i] < 1500 && data[i] >= 1250) {
                            globalSalary['$1250-1500'].push(data[i]);
                        } else if (data[i] < 1250 && data[i] >= 1000) {
                            globalSalary['$1000-1250'].push(data[i]);
                        } else if (data[i] < 1000 && data[i] >= 750) {
                            globalSalary['$750-1000'].push(data[i]);
                        } else if (data[i] < 750 && data[i] >= 500) {
                            globalSalary['$500-750'].push(data[i]);
                        } else if (data[i] < 500 && data[i] >= 250) {
                            globalSalary['$250-500'].push(data[i]);
                        } else {
                            globalSalary['<$250'].push(data[i]);
                        }
                    }
                }

                $wrapper = $('#content-holder');
                keys = Object.keys(globalSalary);
                margin = {
                    top   : 20,
                    right : 160,
                    bottom: 30,
                    left  : 130
                };
                width = ($wrapper.width() - margin.right) / 2.1;
                height = yLabels.length * 30;
                rect = height / (keys.length);

                for (j = keys.length; j--;) {
                    lengthArr.push(globalSalary[keys[j]].length)
                }

                max = Math.ceil(Math.max.apply(null, lengthArr) / 10) * 10;

                xScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, width]);

                yScale = d3.scale.linear()
                    .domain([0, keys.length])
                    .range([0, height]);

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .tickSize(0)
                    .tickPadding(offset)
                    .tickFormat(function (d, i) {
                        return yLabels[i];
                    })
                    .tickValues(d3.range(yLabels.length));

                chart = d3.select('.salaryChart')
                    .attr({
                        'width' : width + margin.left + margin.right,
                        'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart.selectAll('rect')
                    .data(yLabels)
                    .enter()
                    .append('rect')
                    .attr({
                        x     : 0,
                        y     : function (d, i) {
                            return yScale(i);
                        },
                        width : function (d) {
                            return xScale(globalSalary[d].length);
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
                            return -height
                        },
                        'style': 'stroke: #f2f2f2'
                    });

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -40)
                    .attr('x', 0)
                    .attr('dy', '2em')
                    .text('Salary');

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', height - 18)
                    .attr('x', width + 72)
                    .attr('dy', '2em')
                    .text('Count');
            });
        },

        renderSalaryByDepartmentChart: function () {
            var padding = 15;
            var salary = [];
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

            d3.select('.salaryByDepartmentChart > *').remove();

            common.getSalaryByDepartment({
                month: this.month,
                year : this.year
            }, function (data) {

                for (i = data.length; i--;) {
                    salary[i] = {
                        department: data[i]._id[0],
                        salary    : data[i].salary
                    };
                }

                max = Math.ceil(d3.max(salary, function (d) {
                            return d.salary;
                        }) / 1000) * 1000;

                $wrapper = $('#content-holder');
                margin = {top: 20, right: 160, bottom: 30, left: 130};
                width = ($wrapper.width() - margin.right) / 2.1;
                height = salary.length * 30;
                rect = height / (salary.length);

                xScale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, width]);

                yScale = d3.scale.linear()
                    .domain([0, salary.length])
                    .range([0, height]);

                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .tickSize(0)
                    .tickPadding(offset)
                    .tickFormat(function (d, i) {
                        return salary[i].department;
                    })
                    .tickValues(d3.range(salary.length));

                chart = d3.select('.salaryByDepartmentChart')
                    .attr({
                        'width' : width + margin.left + margin.right,
                        'height': height + margin.top + margin.bottom
                    })
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                chart.selectAll('rect')
                    .data(salary)
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
                            return xScale(d.salary);
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
                            return -height
                        },
                        'style': 'stroke: #f2f2f2'
                    });

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', -40)
                    .attr('x', 0)
                    .attr('dy', '2em')
                    .text('Department');

                chart.append('text')
                    .attr('class', 'y2 label')
                    .attr('text-anchor', 'end')
                    .attr('y', height - 16)
                    .attr('x', width + 80)
                    .attr('dy', '2em')
                    .text('Salary');
            });
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var start = moment().subtract(11, 'month').date(1);
            var startMonth = start.month() + 1;
            var startYear = start.isoWeekYear();
            var arrOfDates = custom.retriveFromCash('arrOfDates') || [];
            var month;
            var year;
            var hired = this.dashCollection.get('hired');
            var fired = this.dashCollection.get('fired');
            var now;
            var i;

            $('title').text(this.contentHeader);

            if (!arrOfDates || !arrOfDates.length) {
                for (i = 0; i < 12; i++) {
                    month = startMonth + i;

                    if (month > 12) {
                        year = startYear + 1;
                        month -= 12;
                    } else {
                        year = startYear;
                    }

                    arrOfDates.push({
                        month      : month,
                        year       : year,
                        dateByMonth: year * 100 + month
                    });
                }

                custom.cacheToApp('arrOfDates', arrOfDates);
            }

            $currentEl.html(this.template({arrOfDates: arrOfDates, hired: hired, fired: fired}));

            arrOfDates.forEach(function (dateObject) {
                var totalContainer = self.$el.find('#total_' + dateObject.dateByMonth);
                var hiredContainer = self.$el.find('#hired_' + dateObject.dateByMonth);
                var firedContainer = self.$el.find('#fired_' + dateObject.dateByMonth);

                totalContainer.text(parseInt(hiredContainer.text()) - parseInt(firedContainer.text()));
            });

            now = new Date();
            self.month = now.getMonth();
            self.year = now.getFullYear();

            $('.monthPicker').val($.datepicker.formatDate('MM yy', new Date()));

            $('.monthPicker').datepicker({
                dateFormat       : 'MM yy',
                changeMonth      : true,
                changeYear       : true,
                showButtonPanel  : true,
                onChangeMonthYear: function (year, month, inst) {
                    self.month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();
                    self.year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();
                    $(this).val($.datepicker.formatDate('MM yy', new Date(self.year, self.month, 1)));
                },
                onClose          : function (dateText, inst) {
                    self.month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();
                    self.year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();
                    self.renderEmployeesDashbord();
                    self.renderHoursDashbord();
                    self.renderVocationDashbord();
                    self.renderSalaryChart();
                    self.renderSalaryByDepartmentChart();
                    $(this).val($.datepicker.formatDate('MM yy', new Date(self.year, self.month, 1)));
                }
            }).focus(function () {
                $('.ui-datepicker-calendar').hide();
                $('#ui-datepicker-div').position({
                    my: 'center top',
                    at: 'center bottom',
                    of: $(this)
                });
            });

            self.renderEmployeesDashbord();
            self.renderEmployeesChartByDepartments();
            self.renderHoursDashbord();
            self.renderVocationDashbord();
            self.renderDepartmentsTree();
            self.renderDepartmentsTreeRadial();
            self.renderSalaryByDepartmentChart();
            self.renderSalaryChart();
            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

            return this;
        }
    });

    return View;
});
