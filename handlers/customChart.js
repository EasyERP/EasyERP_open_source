var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';
    
    var CustomChartSchema = mongoose.Schemas.CustomChart;
    var CustomDashboardSchema = mongoose.Schemas.CustomDashboard;
    var async = require('async');

    this.restoreCharts = function (req, res, next) {
        var Chart = models.get(req.session.lastDb, 'CustomChart', CustomChartSchema);
        var dashboardId = req.query.parentId;

        Chart
            .find({
                dashboard: dashboardId
            })
            .exec(function (err, charts) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(charts);
            });
    };

    this.createCharts = function (req, res, next) {
        var Chart = models.get(req.session.lastDb, 'CustomChart', CustomChartSchema);
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var data = req.body;
        var dashboardId = data[0].dashboard;
        var description = data[0].dashboardDescription;
        var name = data[0].dashboardName;
        var chartsIds = [];
        var i;

        async.waterfall([
            function (waterfallCb) {

                if (Object.keys(data[0]).indexOf('name') + 1) {

                    Chart.create(data, function (err, charts) {
                        if (err) {
                            return next(err);
                        }

                        for (i = charts.length; i--;) {

                            chartsIds.push({
                                _id: charts[i]._id
                            });
                        }

                        waterfallCb();
                    });

                } else {
                    waterfallCb();
                }
            },
            function (waterfallCb) {

                Dashboard.findByIdAndUpdate(dashboardId, {
                    $set: {
                        name       : name,
                        description: description
                    }
                })
                    .exec(function (error, dashboard) {
                        if (error) {
                            return next(error);
                        }

                        waterfallCb(null, dashboard);
                    });
            },
            function (dashboard, waterfallCb) {

                if (chartsIds.length) {
                    Dashboard.findByIdAndUpdate(dashboardId, {$push: {charts: {$each: chartsIds}}})
                        .exec(function (error, dashboards) {
                            if (error) {
                                return next(error);
                            }

                            waterfallCb(null, dashboards);
                        });
                } else {

                    waterfallCb(null, dashboard);
                }
            }
        ], function (error, dashboard) {
            if (error) {
                return next(error);
            }

            res.status(200).send(dashboard);
        });
    };

    this.deleteCharts = function (req, res, next) {
        var Chart = models.get(req.session.lastDb, 'CustomChart', CustomChartSchema);
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var dashboardId = Object.keys(req.body);

        Chart
            .remove({
                dashboard: dashboardId
            })
            .exec(function (err, charts) {
                if (err) {
                    return next(err);
                }

                Dashboard.findByIdAndUpdate(dashboardId, {
                    $set: {
                        charts: []
                    }
                })
                    .exec(function (error, dashboard) {
                        if (error) {
                            return next(error);
                        }

                        res.status(200).send(dashboard);
                    });
            });
    };
};

module.exports = Module;
