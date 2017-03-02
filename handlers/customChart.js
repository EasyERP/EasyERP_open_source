var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';

    var CustomChartSchema = mongoose.Schemas.CustomChart;
    var CustomDashboardSchema = mongoose.Schemas.CustomDashboard;
    var async = require('async');
    var _ = require('lodash');

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

    this.update = function (req, res, next) {
        var Chart = models.get(req.session.lastDb, 'CustomChart', CustomChartSchema);
        var data = req.body;
        var id = req.params.id;

        Chart.findByIdAndUpdate(id, data, {new: true}, function (err, charts) {
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
        var dashboardId = data.dashboard;
        var description = data.dashboardDescription;
        var name = data.dashboardName;
        var chartsIds = [];
        var i;

        async.waterfall([
                function (waterfallCb) {

                    var id = data._id;

                    if (!id || id.length < 24) {
                        id = mongoose.Types.ObjectId();
                    }

                    delete data._id;

                    id = id.toString();

                    Chart.update({_id: id}, data, {upsert: true}, function (err, charts) {
                        var modelId;

                        if (err) {
                            return waterfallCb(err);
                        }

                        if (charts && charts.upserted && charts.upserted.length) {
                            console.log('upserted');
                        }

                        modelId = charts && charts.upserted && charts.upserted.length ? charts.upserted[0]._id : id;

                        chartsIds.push(modelId);

                        waterfallCb();

                    });
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
                        Dashboard.findByIdAndUpdate(dashboardId, {$set: {charts: []}})
                            .exec(function (error, dashboards) {
                                if (error) {
                                    return next(error);
                                }

                                waterfallCb(null, dashboards);
                            });
                    }
                }
            ], function (error, dashboard) {
                if (error) {
                    return next(error);
                }

                res.status(200).send(dashboard);
            }
        );
    };

    this.deleteCharts = function (req, res, next) {
        var Chart = models.get(req.session.lastDb, 'CustomChart', CustomChartSchema);
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var chartIds = Object.keys(req.body);

        async.each(chartIds, function (id, cb) {
            if (id && id.length < 24) {
                return cb();
            }

            Chart.findByIdAndRemove(id, function (err, chart) {
                if (err) {
                    return next(err);
                }

                Dashboard.findByIdAndUpdate(chart.dashboard, {$pull: {charts: chart._id}}, function (error, dashboard) {
                    if (error) {
                        return cb(error);
                    }

                    cb();
                });
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send();
        });

    };
};

module.exports = Module;
