var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';

    var CustomDashboardSchema = mongoose.Schemas.CustomDashboard;
    var CustomChartSchema = mongoose.Schemas.CustomChart;

    this.getDashboards = function (req, res, next) {
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var query = req.query;
        var sort = query.sort;
        var page = query.page;
        var count = query.count;

        Dashboard
            .find({}, {__v: 0})
            .skip((page - 1) * count)
            .limit(count)
            .sort(sort)
            .exec(function (err, dashboard) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(dashboard);
            });
    };

    this.getById = function (req, res, next) {
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var id = req.params.id;
        var query = req.query;
        var contentType = query.contentType;

        Dashboard
            .find({_id: id})
            .populate('charts')
            .exec(function (err, dashboard) {
                var newCharts = [];

                if (err) {
                    return next(err);
                }

                if (contentType === 'purchaseDashboard') {
                    dashboard && dashboard[0] && dashboard[0].charts.forEach(function (el) {
                        if (!el.forSales) {
                            newCharts.push(el);
                        }
                    });

                    dashboard[0]._doc.charts = newCharts;
                } else {
                    dashboard && dashboard[0] && dashboard[0].charts.forEach(function (el) {
                        if (el.forSales) {
                            newCharts.push(el);
                        }
                    });

                    dashboard[0]._doc.charts = newCharts;
                }

                res.status(200).send(dashboard);
            });
    };

    this.createDashboard = function (req, res, next) {
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);

        Dashboard.create(req.body, function (err, dashboards) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: 'Dashboard Saved', data: dashboards});

        });
    };

    this.deleteDashboards = function (req, res, next) {
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var Chart = models.get(req.session.lastDb, 'CustomChart', CustomChartSchema);
        var ids = req.body.ids;
        var query;

        Dashboard
            .remove({_id: {$in: ids}})
            .exec(function (err) {
                if (err) {
                    return next(err);
                }

                query = {
                    dashboard: {
                        $in: ids
                    }
                };

                Chart
                    .remove(query)
                    .exec(function (error, charts) {
                        if (error) {
                            return next(error);
                        }

                        res.status(201).send(charts);
                    });

            });
    };
};

module.exports = Module;
