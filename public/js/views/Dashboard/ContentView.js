define([
        "text!templates/Dashboard/DashboardTemplate.html",
        "d3",
        "common",
        "dataService"
    ],
    function (DashboardTemplate, d3, common, dataService) {
        var ContentView = Backbone.View.extend({
            contentType: "Dashboard",
            actionType : "Content",
            template   : _.template(DashboardTemplate),
            el         : '#content-holder',
            initialize : function (options) {
                this.startTime = options.startTime;
                this.startTime = new Date();
                this.buildTime = 0;
                this.dateRange = 30;
                this.dateRangeSource = 30;
                this.dateItem = "D";
                this.numberToDate = {};
                this.source = null;
                this.render();
            },
            events     : {
                "click .choseDateRange .item"      : "newRange",
                "click .choseDateRangeSource .item": "newRangeSource",
                "click .choseDateItem .item"       : "newItem",
                'click .chart-tabs a'              : 'changeTab'
            },
            changeTab  : function (e) {
                $(e.target).closest(".chart-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".chart-tabs").find("li").index($(e.target).parent());
                $(".chart-tabs-items").find(".chart-tabs-item.active").removeClass("active");
                $(".chart-tabs-items").find(".chart-tabs-item").eq(n).addClass("active");
            },

            newRange      : function (e) {
                $(e.target).parent().find(".active").removeClass("active");
                $(e.target).addClass("active");
                this.dateRange = $(e.target).data("day");
                this.renderPopulate();
            },
            newRangeSource: function (e) {
                $(e.target).parent().find(".active").removeClass("active");
                $(e.target).addClass("active");
                this.dateRangeSource = $(e.target).data("day");
                this.renderPopulateSource();
            },

            newItem             : function (e) {
                $(e.target).parent().find(".active").removeClass("active");
                $(e.target).addClass("active");
                this.dateItem = $(e.target).data("item");
                this.renderPopulate();
            },
            getDateFromDayOfYear: function (index) {
                return dateFormat(new Date(this.numberToDate[index]).toString('MMMM ,yyyy'), "mmmm dd, yyyy");
            },
            getDay              : function (index) {
                switch (index) {
                    case 1:
                        return "Monday";
                    case 2:
                        return "Tuesday";
                    case 3:
                        return "Wednesday";
                    case 4:
                        return "Thursday";
                    case 5:
                        return "Friday";
                    case 6:
                        return "Saturday";
                    case 7:
                        return "Sunday";
                }
            },
            getMonth            : function (index) {
                switch (index) {
                    case 1:
                        return "January";
                    case 2:
                        return "February";
                    case 3:
                        return "March";
                    case 4:
                        return "April";
                    case 5:
                        return "May";
                    case 6:
                        return "June";
                    case 7:
                        return "July";
                    case 8:
                        return "August";
                    case 9:
                        return "September";
                    case 10:
                        return "October";
                    case 11:
                        return "November";
                    case 12:
                        return "December";

                }
            },

            render              : function () {
                var self = this;
                this.$el.html(this.template());
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
                $(window).unbind("resize").resize(function () {
                    self.renderPopulate();
                    if (!self.source) {
                        dataService.getData("/sources", null, function (response) {
                            self.source = response;
                            self.renderPopulateSource(self);
                        });
                    } else {
                        self.renderPopulateSource();
                    }
                    if ($(window).width() < 1370) {
                        $(".legend-box").css("margin-top", "10px");
                    } else {
                        $(".legend-box").css("margin-top", "-39px");
                    }
                });
            },
            renderPopulateSource: function (that) {
                var self = this;
                if (that) {
                    self = that;
                }
                $(".chart").empty();
                common.getLeadsForChart(true, self.dateRangeSource, self.dateItem, function (data) {
                    $("#timeBuildingDataFromServer").text("Server response in " + self.buildTime + " ms");
                    self.source.data.forEach(function (item) {
                        var b = false;

                        for (var i = 0; i < data.length; i++) {
                            if (data[i].source == item.name) {
                                b = true;
                                break;
                            }
                        }

                        if (!b) {

                            data.push({source: item.name, count: 0, isOpp: true});
                            data.push({source: item.name, count: 0, isOpp: false});
                        }
                    });

                    var margin = {top: 20, right: 160, bottom: 30, left: 160},
                        width = $("#wrapper").width() - margin.left - margin.right,
                        height = 600 - margin.top - margin.bottom;

                    var y = d3.scale.ordinal()
                        .rangeRoundBands([0, height], 0.3);

                    var x = d3.scale.linear()
                        .range([width, 0]);

                    var x2 = d3.scale.linear()
                        .range([0, width]);

                    var xAxis = d3.svg.axis()
                        .scale(x2)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    var chart = d3.select(".chart")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    y.domain(data.map(function (d) {
                        return d.source;
                    }));
                    x.domain([0, d3.max(data, function (d) {
                        return d.count;
                    }) + 10]);
                    x2.domain([0, d3.max(data, function (d) {
                        return d.count;
                    }) + 10]);

                    chart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    chart.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);

                    var data1 = _.filter(data, function (item) {
                        return item.isOpp;
                    });
                    var data2 = _.filter(data, function (item) {
                        return !item.isOpp;
                    });
                    for (var i = 0; i < data1.length; i++) {
                        for (var j = 0; j < data2.length; j++) {
                            if (data1[i].source == data2[j].source) {
                                break;
                            }
                        }
                    }

                    chart.selectAll(".bar2")
                        .data(data2)
                        .enter().append("rect")
                        .attr("class", "bar2")
                        .attr("x", function (d) {
                            return 0;
                        })
                        .attr("y", function (d) {
                            return y(d.source);
                        })
                        .attr("height", y.rangeBand())
                        .attr("width", function (d) {
                            return width - x(d.count);
                        });

                    chart.selectAll(".bar")
                        .data(data1)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function (d) {
                            return 0;
                        })
                        .attr("y", function (d) {
                            return y(d.source);
                        })
                        .attr("height", y.rangeBand())
                        .attr("width", function (d) {
                            return width - x(d.count);
                        });

                    chart.selectAll(".x .tick line")
                        .data(data)
                        .attr("y2", function (d) {
                            return -height;
                        });
                    function type(d) {
                        d.count = +d.count; // coerce to number
                        return d;

                    }

                });
            },
            renderPopulate      : function () {
                var self = this;
                $(".leadChart").empty();
                common.getLeadsForChart(null, this.dateRange, this.dateItem, function (data) {
                    $("#timeBuildingDataFromServer").text("Server response in " + self.buildTime + " ms");
                    var margin = {top: 20, right: 160, bottom: 190, left: 160},
                        width = $("#wrapper").width() - margin.left - margin.right,
                        height = 500 - margin.top - margin.bottom;
                    var x = d3.scale.ordinal()
                        .rangeRoundBands([0, width], 0.6);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var y2 = d3.scale.linear()
                        .range([height, 0]);

                    var x2 = d3.scale.linear()
                        .range([0, width]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(function (d) {
                            switch (self.dateItem) {
                                case "DW":
                                    return self.getDay(d);
                                case "M":
                                    return self.getMonth(d);
                                case "D":
                                    return self.getDateFromDayOfYear(d);
                            }
                            return d;

                        });

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    var yAxis2 = d3.svg.axis()
                        .scale(y2)
                        .orient("right")
                        .tickFormat(function (d) {
                            return d + "%";
                        });
                    var chart = d3.select(".leadChart")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    var line = d3.svg.line()
                        .x(function (d) {
                            return x(d.source) + x.rangeBand() / 2;
                        })
                        .y(function (d) {
                            return y2(d.count);
                        })
                        .interpolate("monotone");
                    if (self.dateItem == "DW") {
                        var dt = _.unique(_.map(data, function (item) {
                            return item.source;
                        }));
                        for (var i = 1; i < 8; i++) {
                            if (dt.indexOf(i) === -1)
                                data.push({count: 0, date: [0], isOpp: true, source: i, year: 2014});
                            data.push({count: 0, date: [0], source: i, isOpp: true, year: 2014});
                        }
                        data.sort(function (a, b) {
                            return d3.ascending(a.source, b.source);
                        });

                    }
                    if (self.dateItem == "DM") {
                        var dt = _.unique(_.map(data, function (item) {
                            return item.source;
                        }));
                        for (var i = 1; i < 32; i++) {
                            if (dt.indexOf(i) === -1)
                                data.push({count: 0, date: [0], isOpp: true, source: i, year: 2014});
                            data.push({count: 0, date: [0], source: i, isOpp: true, year: 2014});
                        }
                        data.sort(function (a, b) {
                            return d3.ascending(a.source, b.source);
                        });

                    }
                    if (self.dateItem == "M" && self.dateRange == 365) {
                        var dt = _.unique(_.map(data, function (item) {
                            return item.source;
                        }));
                        for (var i = 1; i < 13; i++) {
                            if (dt.indexOf(i) === -1)
                                data.push({count: 0, date: [0], isOpp: true, source: i, year: 2014});
                            data.push({count: 0, date: [0], source: i, isOpp: true, year: 2014});
                        }
                        data.sort(function (a, b) {
                            return d3.ascending(a.source, b.source);
                        });

                    }
                    if (self.dateItem == "D") {

                        var dt = _.unique(_.map(data, function (item) {
                            return item.source;
                        }));
                        for (var i = 0; i < self.dateRange; i++) {
                            var now = new Date(new Date() - i * 24 * 60 * 60 * 1000);
                            var start = new Date(now.getFullYear(), 0, 0);
                            var diff = now - start;
                            var oneDay = 1000 * 60 * 60 * 24;
                            var dayofYera = Math.floor(diff / oneDay);
                            if (dt.indexOf(dayofYera) === -1)
                                data.push({
                                    count: 0,
                                    date: [now],
                                    isOpp: true,
                                    source: dayofYera,
                                    year: now.getFullYear()
                                });
                            data.push({count: 0, date: [now], source: dayofYera, isOpp: true, year: now.getFullYear()});
                        }
                        data = _.map(data, function (item) {
                            item.source = item.source + item.year * 10000;
                            return item;
                        });

                        data.sort(function (a, b) {
                            return d3.ascending(a.source, b.source);
                        });

                    }
                    data.forEach(function (item) {
                        self.numberToDate[item.source] = item.date[0];
                    });

                    var data1 = _.filter(data, function (item) {
                        return item.isOpp;
                    });
                    var data2 = _.filter(data, function (item) {
                        return !item.isOpp;
                    });

                    var percent = [];
                    var unicSource = _.map(data1, function (item) {
                        return item.source;
                    });
                    unicSource = unicSource.concat(_.map(data2, function (item) {
                        return item.source;
                    }));
                    unicSource = _.unique(unicSource);
                    unicSource.sort(function (a, b) {
                        return d3.ascending(a, b);
                    });
                    var dataAll = [];
                    for (var z = 0; z < unicSource.length; z++) {
                        var d1 = 0;
                        for (var i = 0; i < data1.length; i++) {
                            if (data1[i].source == unicSource[z]) {
                                d1 = data1[i].count;
                            }
                        }
                        var d2 = 0;
                        for (var i = 0; i < data2.length; i++) {
                            if (data2[i].source == unicSource[z]) {
                                d2 = data2[i].count;
                            }
                        }
                        if (d1 || d2) {
                            percent.push({source: unicSource[z], count: d1 / (d1 + d2)});
                        }
                        else {
                            percent.push({source: unicSource[z], count: 0});
                        }
                        dataAll.push(({source: unicSource[z], count: d1 + d2}));
                    }
                    var maxval = d3.max(data1, function (d) {
                        return d.count;
                    });
                    data1 = dataAll;
                    var scale = 1;
                    var maxval = d3.max(data1, function (d) {
                            return d.count;
                        }) * scale;
                    var minval2 = d3.min(percent, function (d) {
                            return d.count;
                        }) * scale;

                    var maxval2 = d3.max(percent, function (d) {
                        return d.count;
                    });
                    if (maxval2 == 0)maxval2 = 1;
                    percent = _.map(percent, function (item) {
                        item.count = (item.count) / maxval2 * 100;
                        return item;

                    });
                    var maxval3 = d3.max(percent, function (d) {
                        return d.count;
                    });
                    var minval3 = d3.min(percent, function (d) {
                        return d.count;
                    });
                    x.domain(data.map(function (d) {
                        return d.source;
                    }));
                    y.domain([0, d3.max(data1, function (d) {
                        return d.count;
                    })]);
                    y2.domain([0, 100]);
                    x2.domain([0, d3.max(data, function (d) {
                        return d.count;
                    })]);
                    if (self.dateItem != "D") {
                        chart.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis)
                            .selectAll("text");

                    } else {
                        if (self.dateRange == "7") {
                            chart.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + height + ")")
                                .call(xAxis)
                                .selectAll("text");
                        }
                        if (self.dateRange == "30") {
                            chart.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + height + ")")
                                .call(xAxis)
                                .selectAll("text")
                                .attr("transform", "rotate(-60)")
                                .attr("x", "-10")
                                .attr("y", "2")
                                .attr("style", "text-anchor:end");
                        }
                        if (self.dateRange == "90") {
                            chart.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + height + ")")
                                .call(xAxis)
                                .selectAll("text")
                                .attr("transform", "rotate(-60)")
                                .attr("x", function (d, i) {
                                    if (i % 2 != 0) {
                                        return 1000;
                                    }
                                    return -10;
                                })
                                .attr("data-id", function () {
                                    return this.getComputedTextLength();
                                })
                                .attr("style", "text-anchor:end;")
                                .attr("y", "2");
                        }
                        if (self.dateRange == "365") {
                            if (width > 1350) {
                                chart.append("g")
                                    .attr("class", "x axis")
                                    .attr("transform", "translate(0," + height + ")")
                                    .call(xAxis)
                                    .selectAll("text")
                                    .attr("transform", "rotate(-90)")
                                    .attr("x", function (d, i) {
                                        if (i % 5 != 0) {
                                            return 1000;
                                        }
                                        return -10;
                                    })
                                    .attr("y", "2")
                                    .attr("style", "text-anchor:end");

                            }
                            if (width > 1200 && width < 1350) {
                                chart.append("g")
                                    .attr("class", "x axis")
                                    .attr("transform", "translate(0," + height + ")")
                                    .call(xAxis)
                                    .selectAll("text")
                                    .attr("transform", "rotate(-60)")
                                    .attr("x", function (d, i) {
                                        if (i % 7 != 0) {
                                            return 1000;
                                        }
                                        return -10;
                                    })
                                    .attr("y", "2")
                                    .attr("style", "text-anchor:end");

                            }
                            if (width < 1200) {
                                chart.append("g")
                                    .attr("class", "x axis")
                                    .attr("transform", "translate(0," + height + ")")
                                    .call(xAxis)
                                    .selectAll("text")
                                    .attr("transform", "rotate(-60)")
                                    .attr("x", function (d, i) {
                                        if (i % 20 != 0) {
                                            return 1000;
                                        }
                                        return -10;
                                    })
                                    .attr("y", "2")
                                    .attr("style", "text-anchor:end");

                            }
                        }
                    }

                    chart.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .selectAll(".tick line")
                        .attr("x2", function (d) {
                            return width;
                        })
                        .style("fill", "#1EBBEA");

                    chart.append("g")
                        .attr("class", "y2 axis")
                        .attr("transform", "translate(" + width + ",0)")
                        .call(yAxis2);

                    chart.selectAll(".bar")
                        .data(data1)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function (d) {
                            return x(d.source);
                        })
                        .attr("y", function (d) {
                            return y(d.count);
                        })
                        .attr("height", function (d) {
                            return height - y(d.count);
                        })
                        .attr("width", x.rangeBand());

                    chart.selectAll(".bar2")
                        .data(data2)
                        .enter().append("rect")
                        .attr("class", "bar2")
                        .attr("x", function (d) {
                            return x(d.source);
                        })
                        .attr("y", function (d) {
                            return y(d.count);
                        })
                        .attr("height", function (d) {
                            return height - y(d.count);
                        })
                        .attr("width", x.rangeBand());

                    chart.selectAll(".bar3")
                        .data(data2)
                        .enter().append("rect")
                        .attr("class", "bar3")
                        .attr("x", function (d) {
                            return x(d.source);
                        })
                        .attr("y", function (d) {
                            return y(d.count);
                        })
                        .attr("height", function (d) {
                            return 2;
                        })
                        .attr("width", x.rangeBand());

                    chart.append("path")
                        .datum(percent)
                        .attr("class", "line")
                        .attr("d", line);

                    chart.selectAll(".circle")
                        .data(percent)
                        .enter().append("circle")
                        .attr("class", "circle")
                        .attr("cx", function (d) {
                            return x(d.source) + x.rangeBand() / 2;
                        })
                        .attr("cy", function (d) {
                            return y2(d.count);
                        })
                        .attr("r", function (d) {
                            return 4;
                        })
                        .style("fill", "#1EBBEA")
                        .style("stroke", "#fff")
                        .style("stroke-width", "2");

                    chart.append("text")
                        .attr("class", "y label")
                        .attr("text-anchor", "end")
                        .attr("y", -65)
                        .attr("x", -height / 2 + 80)
                        .attr("dy", ".75em")
                        .attr("transform", "rotate(-90)")
                        .text("Number of Leads");

                    chart.append("text")
                        .attr("class", "y2 label")
                        .attr("text-anchor", "end")
                        .attr("y", -width - 75)
                        .attr("x", height / 2 + 120)
                        .attr("dy", ".75em")
                        .attr("transform", "rotate(90)")
                        .text("Opportunity Conversion Rate");
                    function type(d) {
                        d.count = +d.count; // coerce to number
                        return d;

                    }
                });

            }
        });
        return ContentView;
    });
