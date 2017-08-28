define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/dashboards/tools/ChartTemplate.html',
    'text!templates/dashboards/tools/TableTemplate.html',
    'text!templates/dashboards/tools/SingleTemplate.html',
    'dataService',
    'constants',
    'async',
    'd3',
    'custom',
    'moment',
    'common',
    'helpers',
    'helpers/d3Helper'
], function (Backbone, $, _, template, tableTemplate, singleTemplate, dataService, CONSTANTS, async, d3, custom, moment, common, helpers, d3Helper) {
    'use strict';

    var View = Backbone.View.extend({

        template      : _.template(template),
        tableTemplate : _.template(tableTemplate),
        singleTemplate: _.template(singleTemplate),

        initialize: function (options) {
            this.options = options;
            this.width = this.$el.width();
            this.height = this.$el.height() - 40;
            this.cellsModel = options.cellsModel;
            this.limitCells = options.limitCells;
            this.xPoints = options.xPoints;
            this.yPoints = options.yPoints;
            this.selfEl = options.selfEl;
            this.margin = {
                top   : 10,
                left  : 35,
                bottom: 55,
                right : 40
            };
            this.id = '#' + this.$el.attr('id');
            this.dialogChartWidth = options.width;
            this.dialogChartHeight = options.height;
            this.openView = options.openView;

            this.render();
        },

        clearChartHolder: function (svg) {
            var height;
            var width;

            if (this.dialogChartWidth && this.dialogChartHeight) {
                width = this.dialogChartWidth;
                height = this.dialogChartHeight;
            } else {
                width = this.$el.width() + 'px';
                height = parseFloat(this.$el.height()) - parseFloat(this.$el.find('.panel-heading').height()) + 'px';
            }

            this.$el.find('.chartHolder').empty();
            this.$el.find('.chartHolder').html('<svg width="' + width + '" height="' + height + '"></svg>');
        },

        renderLineChart: function (data, xLabel, yLabel, textObj) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.xAxisFiled = xLabel;
            options.yAxisFiled = yLabel;
            options.typeXAxisFiled = typeof data[0][xLabel];
            options.typeYAxisFiled = typeof data[0][yLabel];
            options.data = data;
            options.openView = this.openView;

            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = yLabel === 'sum' ? '$' : '';

            d3Helper.drawLineChart(options);
        },

        renderVerticalBarChart: function (data, xLabel, yLabel, textObj) {
            this.clearChartHolder();
            var self = this;
            var options = {};
            var $svg = d3.select(self.id).select('svg');

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = xLabel;
            options.yAxisFiled = yLabel;
            options.typeYAxisFiled = typeof data[0][yLabel];
            options.typeXAxisFiled = typeof data[0][xLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = yLabel === 'sum' ? '$' : '';
            options.openView = this.openView;

            d3Helper.drawVerticalChart(options);
        },

        renderHorizontalBarChart: function (data, xLabel, yLabel, textObj) {
            var options = {};

            this.clearChartHolder();

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = xLabel;
            options.yAxisFiled = yLabel;
            options.typeXAxisFiled = typeof data[0][xLabel];
            options.typeYAxisFiled = typeof data[0][yLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = yLabel === 'sum' ? '$' : '';
            options.openView = this.openView;

            d3Helper.drawHorizontalChart(options);
        },

        renderDonutChart: function (data, valueLabel, nameLabel) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = nameLabel;
            options.yAxisFiled = valueLabel;
            options.typeXAxisFiled = typeof data[0][nameLabel];
            options.typeYAxisFiled = typeof data[0][valueLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = valueLabel === 'sum' ? '$' : '';
            options.openView = this.openView;

            d3Helper.drawDonutChart(options);
        },

        renderHorizontalBarLayout: function (data, keys, textObj) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            if (!keys.length || keys.length < 2 || !data.length) {
                return;
            }

            options.data = data;

            options.yAxisFiled = 'source';
            options.typeYAxisFiled = typeof data[0]['source'];
            options.doubleValueXAxisFiled = keys[0];
            options.numericXAxisFiled = keys[1];

            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = options.numericXAxisFiled === 'sum' ? '$' : '';
            options.openView = this.openView;

            d3Helper.drawHorizontalTwoColorChart(options);
        },

        renderDonutAnimatedChart: function (data, valueLabel, nameLabel) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = nameLabel;
            options.yAxisFiled = valueLabel;
            options.typeXAxisFiled = typeof data[0][nameLabel];
            options.typeYAxisFiled = typeof data[0][valueLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = valueLabel === 'sum' ? '$' : '';
            options.animated = true;
            options.openView = this.openView;

            d3Helper.drawDonutChart(options);
        },

        renderPieChart: function (data, valueLabel, nameLabel) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = nameLabel;
            options.yAxisFiled = valueLabel;
            options.typeXAxisFiled = typeof data[0][nameLabel];
            options.typeYAxisFiled = typeof data[0][valueLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = valueLabel === 'sum' ? '$' : '';
            options.openView = this.openView;

            d3Helper.drawPieChart(options);
        },

        renderPieAnimatedChart: function (data, valueLabel, nameLabel) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = nameLabel;
            options.yAxisFiled = valueLabel;
            options.typeXAxisFiled = typeof data[0][nameLabel];
            options.typeYAxisFiled = typeof data[0][valueLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = valueLabel === 'sum' ? '$' : '';
            options.animated = true;
            options.openView = this.openView;

            d3Helper.drawPieChart(options);
        },

        renderTable: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text : 'Date',
                field: 'invoiceDate'
            }, {
                text    : 'Customer',
                field   : 'supplier',
                subField: 'name'
            }, {
                text    : 'Amount',
                field   : 'paymentInfo',
                subField: 'total'
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        markEngagedCells: function () {
            var newEngagedCells = [];
            var self = this;

            $('.panel').each(function () {
                var xIndex = self.xPoints.indexOf(parseFloat($(this).attr('data-x')));
                var yIndex = self.yPoints.indexOf(parseFloat($(this).attr('data-y')));
                var panelWidth = parseInt($(this).attr('data-width'), 10);
                var panelHeight = parseInt($(this).attr('data-height'), 10);
                var xIndexVal = xIndex + panelWidth;
                var yIndexVal = yIndex + panelHeight;
                var dataIndex = [];
                var i;
                var j;

                for (i = xIndex; i < xIndexVal; i++) {

                    for (j = yIndex; j < yIndexVal; j++) {
                        dataIndex.push(i + '' + j);
                        newEngagedCells.push(i + '' + j);
                    }
                }

                $(this).attr('data-index', dataIndex);
            });

            this.cellsModel.set({engagedCells: (this.limitCells.slice(0)).concat(newEngagedCells)});
        },

        renderTableOverview: function (response) {
            this.clearChartHolder();
            var $svg = this.$el.closest(this.id);
            var data = response && response.data ? response.data : response;
            var columns = [];
            var totalCount;
            var totalRevenue;
            var totalCountSum = 0;
            var totalRevenueSum = 0;
            var totalStatusCount = 0;
            var secondRow = [];
            var statusObject = {
                allocateStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                },

                fulfillStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                },

                shippingStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                }
            };

            data.forEach(function (el) {
                totalCountSum += el.count;
                totalRevenueSum += el.total;

                if (el.status && el.status.length) {
                    totalStatusCount++;
                    el.status.forEach(function (stat) {
                        statusObject.allocateStatus[stat.allocateStatus] += 1;
                        statusObject.fulfillStatus[stat.fulfillStatus] += 1;
                        statusObject.shippingStatus[stat.shippingStatus] += 1;
                    });
                }

            });

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : true,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

            totalCount = $svg.find('.totalCount');
            totalRevenue = $svg.find('.totalRevenue');

            if (totalStatusCount) {
                secondRow = [{
                    name : 'Allocated',
                    value: statusObject.allocateStatus
                }, {
                    name : 'Fulfilled',
                    value: statusObject.fulfillStatus
                }, {
                    name : 'Shipped',
                    value: statusObject.shippingStatus
                }];

                $svg.find('.allocated').text(helpers.currencySplitter(statusObject.allocateStatus.ALL.toFixed()));
                $svg.find('.fulfilled').text(helpers.currencySplitter(statusObject.fulfillStatus.ALL.toFixed()));
                $svg.find('.shipped').text(helpers.currencySplitter(statusObject.shippingStatus.ALL.toFixed()));

                $svg.find('.status div').removeClass('hidden');
            }

            totalCount.text(helpers.currencySplitter(totalCountSum.toFixed()));
            totalRevenue.text(helpers.currencySplitter(totalRevenueSum.toFixed(2)));

        },

        renderSingleValue: function (response, title) {
            this.clearChartHolder();
            var $svg = this.$el.closest(this.id);

            if ($svg.width() < 400) {
                ///$svg.width('400px');
                //$svg.height('100px');
                this.$el.attr('data-width', 6);
                // this.$el.attr('data-height', 1);
                this.markEngagedCells();
            }

            $svg.find('.chartHolder').html(this.singleTemplate({
                data: {
                    revenue: response.total,
                    count  : response.count || 0
                },

                title           : title,
                currencySplitter: helpers.currencySplitter
            }));
        },

        setHref: function (href) {
            var ref = '#easyErp/' + href;
            this.$el.find('#viewAll').attr('href', ref);
        },

        render: function () {
            var height;
            var width;
            var self = this;
            var chartObj;

            if (this.dialogChartWidth && this.dialogChartHeight) {
                width = this.dialogChartWidth;
                height = this.dialogChartHeight;
            } else {
                width = this.$el.width() + 'px';
                height = parseFloat(this.$el.height()) - parseFloat(this.$el.find('.panel-heading').height()) + 'px';
            }

            // this.$el.find('.chartHolder').append(this.template({
            //     width : width,
            //     height: height
            // }));

            chartObj = {

                line: {
                    invoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {

                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, true, function (data) {
                            self.renderLineChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Invoice'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseInvoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, false, function (data) {
                            self.renderLineChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('purchaseInvoices');
                    }
                },

                horizontalBar: {

                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Sales Manager'
                            });
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Customer'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Sales Manager'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Customer'
                            });
                        });

                        self.setHref('invoice');
                    }
                },

                verticalBar: {
                    invoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, true, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Invoice'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseInvoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, false, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('purchaseInvoices');
                    }
                },

                donut: {
                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    }
                },

                donutAnimated: {
                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    }
                },

                pie: {
                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    }
                },

                pieAnimated: {
                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    }
                },

                singleValue: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueForSingle(filter, false, function (data) {
                            self.renderSingleValue(data, 'Purchase Revenue');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueForSingle(filter, true, function (data) {
                            self.renderSingleValue(data, 'Sales Revenue');
                        });

                        self.setHref('invoice');
                    },

                    totalSalesOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTotalOrdersForSingle(filter, true, function (data) {
                            self.renderSingleValue(data, 'Sales Orders');
                        });

                        self.setHref('order');
                    },

                    totalPurchaseOrder: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTotalOrdersForSingle(filter, false, function (data) {
                            self.renderSingleValue(data, 'Sales Orders');
                        });

                        self.setHref('purchaseOrders');
                    },

                    totalReceivedOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getByStatusForSingle(filter, false, true, function (data) {
                            self.renderSingleValue(data, 'Received Orders');
                        });

                        self.setHref('purchaseOrders');
                    },

                    totalPartialReceivedOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getByStatusForSingle(filter, false, false, function (data) {
                            self.renderSingleValue(data, 'Partial Received Orders');
                        });

                        self.setHref('purchaseOrders');
                    },

                    totalDeliveredPurchaseOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getByStatusForSingle(filter, true, true, function (data) {
                            self.renderSingleValue(data, 'Delivered Orders');
                        });

                        self.setHref('order');
                    },

                    totalPartialDeliveredPurchasedOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getByStatusForSingle(filter, true, false, function (data) {
                            self.renderSingleValue(data, 'Partial Delivered Orders');
                        });

                        self.setHref('order');
                    }
                },

                horizontalBarLayout: {
                    leadsBySource: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsForChart('source', filter, function (data) {
                            var sources = _.uniq(_.pluck(data, 'source'));
                            var newData = [];
                            var j;
                            var i;

                            // for (i = sources.length; i--;) {
                            //     newData.push({
                            //         source: sources[i],
                            //         total : 0,
                            //         isOpp : 0
                            //     });
                            // }

                            // for (i = data.length; i--;) {
                            //
                            //     for (j = newData.length; j--;) {
                            //
                            //         if (newData[j].source === data[i].source) {
                            //
                            //             if (data[i].isOpp) {
                            //                 newData[j].isOpp += data[i].count;
                            //             } else {
                            //                 newData[j].total += data[i].count;
                            //             }
                            //         }
                            //     }
                            // }

                            self.renderHorizontalBarLayout(data, ['isOpp', 'count'], {
                                xAxisLabel: '',
                                yAxisLabel: 'Source'
                            });
                        });

                        self.setHref('Leads');
                    }
                },

                verticalBarLayout: {},

                overview: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoiceByWorkflows(filter, false, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoiceByWorkflows(filter, true, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseOrders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrdersByWorkflows(filter, false, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('purchaseOrders');
                    },

                    orders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrdersByWorkflows(filter, true, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('order');
                    }

                },

                table: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoices(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoices(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    pastDuePurchaseInvoices: function () {
                        var _opts = self.options;
                        var filter = {
                            date   : {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            },
                            pastDue: true
                        };

                        common.getInvoices(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    pastDueInvoices: function () {
                        var _opts = self.options;
                        var filter = {
                            date   : {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            },
                            pastDue: true
                        };

                        common.getInvoices(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseOrders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrders(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseOrders');
                    },

                    orders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrders(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('order');
                    }
                }
            };

            chartObj[this.options.type][this.options.dataSelect]();
        }
    });

    return View;
});
