define([
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
    'helpers'
], function ($, _, mainTemplate, hrDashboard, dataService, CONSTANTS, async, d3, custom, moment, common, helpers) {
    'use strict';

    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType: CONSTANTS.DASHBOARD_HR,

        template: _.template(mainTemplate),

        events: {
            'click .chart-tabs a': 'changeTab'
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

        renderTreemap: function () {

            common.totalInvoiceBySales({
                startDay: '',
                endDay: ''
            }, function (data) {
                var margin = {top: 0, right: 10, bottom: 10, left: 10};
                var width = 960 - margin.left - margin.right;
                var height = 500 - margin.top - margin.bottom;

                var color = d3.scale.category10();

                var treemap = d3.layout.treemap()
                    .size([width, height])
                    .sticky(true)
                    .value(function (d) {
                        return d.payment;
                    });

                var div = d3.select(".treemap").append("div")
                    .style("position", "relative");

                var root = {
                    name    : 'tree',
                    children: data
                };

                var node = div.datum(root).selectAll(".node")
                    .data(treemap.nodes)
                    .enter().append("div")
                    .attr("class", "nodeTree")
                    .call(position)
                    .style("background", function (d) {
                        return color(d.name);
                    })
                    .text(function (d) {
                        return d.children ? null : d.name + ',  $' + helpers.currencySplitter((d.payment / 100).toFixed(0));
                    });

                d3.selectAll("input").on("change", function change() {
                    var value = this.value === "count"
                        ? function () {
                        return 1;
                    }
                        : function (d) {
                        return d.size;
                    };

                    node
                        .data(treemap.value(value).nodes)
                        .transition()
                        .duration(1500)
                        .call(position);
                });

                function position() {
                    this.style("left", function (d) {
                        return d.x + "px";
                    })
                        .style("top", function (d) {
                            return d.y + "px";
                        })
                        .style("width", function (d) {
                            return Math.max(0, d.dx - 1) + "px";
                        })
                        .style("height", function (d) {
                            return Math.max(0, d.dy - 1) + "px";
                        });
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
                    .style('height', '100px')
                    .style('float', 'left')
                    .style('margin', '10px')
                    .style('background-color', function (d) {
                        return d.key === 'Employees' ? '#33F' : d.key === 'Hired' ? '#32c5d2' : '#FF3333';
                    })
                    .style('color', 'white')
                    .style('padding-top', '50px')
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
                        key  : 'vacation',
                        value: response.vacation
                    },
                    {
                        key  : 'personal',
                        value: response.personal
                    },
                    {
                        key  : 'sick',
                        value: response.sick
                    },
                    {
                        key  : 'education',
                        value: response.education
                    }
                ];

                d3.selectAll('.dashboard-vacation-stat')
                    .data(data)
                    .style('width', '200px')
                    .style('height', '100px')
                    .style('float', 'left')
                    .style('margin', '10px')
                    .style('background-color', function (d) {
                        return d.key === 'vacation' ? '#33F' : d.key === 'personal' ? '#32c5d2' : d.key === 'education' ? '#8E44AD' : '#FF3333';
                    })
                    .style('color', 'white')
                    .style('padding-top', '50px')
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

                d3.selectAll('.dashboard-vacation-stat')
                    .select('.desc')
                    .append('span')
                    .text(function (d) {
                        return d.key;
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
                        key  : 'total',
                        value: response.total
                    },
                    {
                        key  : 'actual',
                        value: response.actual
                    },
                    {
                        key  : 'idle',
                        value: response.idle
                    },
                    {
                        key  : 'overtime',
                        value: response.overtime
                    }
                ];

                d3.selectAll('.dashboard-hours-stat')
                    .data(data)
                    .style('width', '200px')
                    .style('height', '100px')
                    .style('float', 'left')
                    .style('margin', '10px')
                    .style('background-color', function (d) {
                        return d.key === 'total' ? '#33F' : d.key === 'actual' ? '#32c5d2' : d.key === 'idle' ? '#8E44AD' : '#FF3333';
                    })
                    .style('color', 'white')
                    .style('padding-top', '50px')
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
                        return d.key;
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
                }), 0]);

                x2.domain([0, d3.max(self.departments, function (d) {
                    return d.maleCount + d.femaleCount;
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
        
        renderSalaryChart: function(){
            var h = 400;
            var w = 600;
            var padding = 15;
            var labelPadding = 20;

            /*var data = [
             {"count":2,"source":"olga.sikora","isOpp":true},
             {"count":5,"source":"olga.sikora","isOpp":false},
             {"count":6,"source":"alex.vinogradov","isOpp":false},
             {"count":4,"source":"roman.siladii","isOpp":false},
             {"count":2,"source":"dima.lylyk","isOpp":true},
             {"count":2,"source":"peter.volosh","isOpp":false},
             {"count":7,"source":"alona.yelahina","isOpp":false},
             {"count":1,"source":"roland.katona","isOpp":true},
             {"count":1,"source":"yana.dufynets","isOpp":false},
             {"count":1,"source":"galina.milchevych","isOpp":true},
             {"count":5,"source":"natalia.yartysh","isOpp":false},
             {"count":2,"source":"alina.yurenko","isOpp":true},
             {"count":2,"source":"roland.katona","isOpp":false},
             {"count":7,"isOpp":true},
             {"count":1,"source":"alex.vinogradov","isOpp":true},
             {"count":9,"source":"sergiy.biloborodov","isOpp":false},
             {"count":2,"source":"patritsiia.danch","isOpp":false},
             {"count":5,"source":"galina.milchevych","isOpp":false},
             {"count":1,"source":"yevgenia.melnyk","isOpp":true},
             {"count":37,"isOpp":false},
             {"count":21,"source":"alina.yurenko","isOpp":false},
             {"count":7,"source":"andriy.merentsov","isOpp":false},
             {"count":8,"source":"yevgenia.melnyk","isOpp":false},
             {"count":2,"source":"natalia.yartysh","isOpp":true},
             {"count":3,"source":"larysa.popp","isOpp":false},
             {"count":22,"source":"dima.lylyk","isOpp":false},
             {"count":4,"source":"alina.slavska","isOpp":false},
             {"count":9,"source":"bohdana.stets","isOpp":false},
             {"count":1,"source":"oksana.pylyp","isOpp":true},
             {"count":6,"source":"oksana.pylyp","isOpp":false}];*/


            var data = {
                "data": [120, 350, 800, 0, 0, 800, 0, 114, 114, 500, 114, 350, 350, 450, 350, 800, 800, 450, 350,
                    300, 500, 500, 450, 250, 189, 500, 400, 114, 500, 700, 450, 400, 900, 450, 300, 350, 250, 400, 300,
                    400, 500, 500, 350, 400, 500, 600, 1300, 900, 350, null, 700, 1700, 500, 800, 800, 1400, 1400, 1400, 250, 400, 550, 250, 500,
                    1000, 550, 1500, 600, 350, 400, 2200, 700, 800, 0, 114, 750, 350,
                    600, 250, 350, 450, 250, 1500, 350, 1000, 1000, 350, 250, 600, 200, 500, 1000, 1200, 120, 350, 450, 1000, 350,
                    1100, 1200, 900, 500, 200, 500, 1400, 350, 250, 2700, 1000, 100, 700, 346, 1400, 350, 0, 350, 450, 700, 1000, 350, 600, 1100,
                    150, 1200,1200, 700, 1000, 2200, 600, 2200, 300, 500, 350, 1600, 150, 450, 250, 500, 1000, 350, 700, 450, 250, 900, 500, 400, 450, 1200,
                    800, 500, 350, 800, 450, 650, 600, 600, 600, 250, 550, 800, 300, 450, 300, 1000, 600, 1100, 500, 350,
                    1200, 600, 800, 350, 550, 350,
                    800, 450, 550, 500, 250, 100, 700, 350, 700, 650, 400, 300, 500, 550, 800, 300, 500, 700, 400, 700, 350, 600, 400, 600
                ]
            };

            var labels = ['>=$2000', '$1750-1500', '$1500-1750', '$1250-1500', '$1000-1250', '$750-1000',
                '$500-750', '$250-500', '<$250'];

            var globalSalary = {
                '>=$2000'   : [],
                '':[],
                '$1750-1500': [],
                '$1500-1750': [],
                '$1250-1500': [],
                '$1000-1250': [],
                '$750-1000' : [],
                '$500-750'  : [],
                '$250-500'  : [],
                '<$250'     : []
            };

            var dataLength = data.length;
            var arrLength = [];
            for (var i = dataLength; i--;) {

                if (data[i] >= 100000) {
                    globalSalary['100-100'].push(data[i]);
                } else if (data[i] === 90000) {
                    globalSalary['90-90'].push(data[i]);
                } else if (data[i] < 90000 && data[i] > 80000) {
                    globalSalary['$1750-1500'].push(data[i]);
                } else if (data[i] < 80000 && data[i] > 70000) {
                    globalSalary['$1250-1500'].push(data[i]);
                } else if (data[i] < 70000 && data[i] > 60000) {
                    globalSalary['$1000-1250'].push(data[i]);
                } else if (data[i] < 60000 && data[i] > 50000) {
                    globalSalary['$750-1000'].push(data[i]);
                } else if (data[i] < 50000 && data[i] > 40000) {
                    globalSalary['$500-750'].push(data[i]);
                } else if (data[i] < 40000 && data[i] > 30000) {
                    globalSalary['$250-500'].push(data[i]);
                } else {
                    globalSalary['<$250'].push(data[i]);
                }

            }

            var svg = d3.select('#wrapper')
                .append('svg')
                .attr({
                    'width' : w,
                    'height': h,
                    'style' : 'padding: 150px'
                });

            var keys = Object.keys(globalSalary);

            for (var j = keys.length; j--;) {
                arrLength.push(globalSalary[keys[j]].length)
            }

            var maxLength = Math.max.apply(null, arrLength);
            var step = 5;
            var numOfGrids = Math.ceil(maxLength / 10) * 10 / step + 1;

            var xGrid = d3.range(numOfGrids).map(function (i) {
                return {
                    'x1': 0,
                    'y1': 0,
                    'x2': 0,
                    'y2': h + padding
                };
            });

            var yGrid = d3.range(keys.length + 1).map(function(i){
                return {
                    'x1': - padding,
                    'y1': 0,
                    'x2': 0,
                    'y2': 0
                };
            });

            var xScale = d3.scale.linear()
                .domain([0, Math.ceil(maxLength / 10) * 10])
                .range([0, w]);

            var yScale = d3.scale.linear()
                .domain([0, keys.length])
                .range([0, h]);

            var grids = svg.append('g')
                .attr('id', 'x-grid')
                .selectAll('line')
                .data(xGrid)
                .enter()
                .append('line')
                .attr({
                    'x1': function (d, i) {
                        return xScale(i * step);
                    },
                    'y1': function (d) {
                        return d.y1;
                    },
                    'x2': function (d, i) {
                        return xScale(i * step);
                    },
                    'y2': function (d) {
                        return d.y2;
                    }
                })
                .style({'stroke': '#000', 'stroke-width': '1px'});

            var gridsY = svg.append('g')
                .attr('id', 'y-grid')
                .selectAll('line')
                .data(yGrid)
                .enter()
                .append('line')
                .attr({
                    'x1': function (d, i) {
                        return d.x1;
                    },
                    'y1': function (d, i) {
                        return yScale(i);
                    },
                    'x2': function (d, i) {
                        return  d.x2;
                    },
                    'y2': function (d, i) {
                        return yScale(i);
                    }
                })
                .style({'stroke': '#000', 'stroke-width': '1px'});

            var dy = h / (keys.length);
            var rectWidth =  dy / 3;

            svg.selectAll('rect')
                .data(keys)
                .enter()
                .append('rect')
                .attr({
                    x     : function () {
                        return 0;
                    },
                    y     : function (d, i) {
                        return yScale(i) + rectWidth;
                    },
                    width : function (d, i) {
                        return xScale(globalSalary[keys[i]].length);
                    },
                    height: function (d,i) {
                        return rectWidth;
                    },
                    fill  : 'blue'
                });

            var xTickVal = xGrid.map(function(d,i){
                return i*step;
            });

            var	xAxis = d3.svg.axis();
            xAxis
                .orient('bottom')
                .scale(xScale)
                .tickPadding(labelPadding)
                .tickSize(1)
                .tickValues(xTickVal);

            var	yAxis = d3.svg.axis();
            yAxis
                .orient('left')
                .scale(yScale)
                .tickSize(0)
                .tickPadding(padding)
                .tickFormat(function(d, i){
                    return labels[i];
                })
                .tickValues(d3.range(9));

            var y_xis = svg.append('g')
                .attr('id','yaxis')
                .attr('transform', 'translate(0,' + dy/2 + ')')
                .call(yAxis);

            var x_xis = svg.append('g')
                .attr("transform", 'translate(0,' + h + ')')
                .attr('id','xaxis')
                .call(xAxis);
            
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

            $('title').text(this.contentType);

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
                dateFormat     : 'MM yy',
                changeMonth    : true,
                changeYear     : true,
                showButtonPanel: true,
                onClose        : function (dateText, inst) {
                    self.month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();
                    self.year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();
                    self.renderEmployeesDashbord();
                    self.renderHoursDashbord();
                    self.renderVocationDashbord();
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
            self.renderTreemap();

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            return this;
        }
    });

    return View;
});
