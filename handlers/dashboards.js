var mongoose = require('mongoose');
var async = require('async');

var Module = function (models) {
    'use strict';

    var CustomDashboardSchema = mongoose.Schemas.CustomDashboard;
    var CustomChartSchema = mongoose.Schemas.CustomChart;

    var dashboardsService = require('../services/dashboards')(models);
    var usersService = require('../services/user')(models);

    this.getDashboards = function (req, res, next) {
        var dbName = req.session.lastDb;
        var uId = req.session.uId;
        var parallelTasks;
        var getCreatedByMe;
        var getPrivate;
        var getPublic;
        var getAll;
        var getRecent;
        var getFavourite;

        getCreatedByMe = function (pCb) {
            var query = {'createdBy.user': uId};

            dashboardsService.get({dbName: dbName, query: query}, pCb);
        };

        getPrivate = function (pCb) {
            var query = {publicAccess: false};

            dashboardsService.get({dbName: dbName, query: query}, pCb);
        };

        getPublic = function (pCb) {
            var query = {publicAccess: true};

            dashboardsService.get({dbName: dbName, query: query}, pCb);
        };

        getAll = function (pCb) {
            var query = {$or: [{publicAccess: true}, {'createdBy.user': uId}]};

            dashboardsService.get({dbName: dbName, query: query}, pCb);
        };

        getFavourite = function (pCb) {
            usersService.findById({dbName: dbName, id: uId}, function (err, user) {
                var favoriteReports;
                var query;
                var error;
                if (err) {
                    return pCb(err);
                }
                if (!user) {
                    error = new Error('User not found');
                    error.status = 404;
                    return pCb(error);
                }

                user = user.toJSON();

                favoriteReports = user.favorite.dashboards;

                if (!favoriteReports || !favoriteReports.length) {
                    return pCb(null, []);
                }

                query = {
                    _id: {
                        $in: favoriteReports
                    }
                };

                dashboardsService.get({dbName: dbName, query: query}, pCb);
            });
        };

        getRecent = function (pCb) {
            dashboardsService.getRecent({dbName: dbName}, pCb);
        };

        parallelTasks = [getCreatedByMe, getPrivate, getPublic, getAll, getFavourite, getRecent];

        async.parallel(parallelTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send([{
                _id        : null,
                createdByMe: result[0] || [],
                private    : result[1] || [],
                public     : result[2] || [],
                all        : result[3] || [],
                favorite   : result[4] || [],
                recent     : result[5] || []
            }]);
        });

    };

    this.getById = function (req, res, next) {
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var id = req.params.id;
        var query = req.query;
        var contentType = query.contentType;

        Dashboard
            .findByIdAndUpdate(id, {$set: {recentDate: new Date()}}, {new: true})
            .populate('charts')
            .exec(function (err, dashboard) {
                var newCharts = [];

                if (err) {
                    return next(err);
                }

                if (contentType === 'purchaseDashboard') {
                    dashboard && dashboard.charts.forEach(function (el) {
                        if (!el.forSales) {
                            newCharts.push(el);
                        }
                    });

                    dashboard._doc.charts = newCharts;
                } else if (contentType === 'reportsDashboard') {
                    dashboard && dashboard.charts.forEach(function (el) {
                        if (el.forSales) {
                            newCharts.push(el);
                        }
                    });

                    dashboard._doc.charts = newCharts;
                }

                res.status(200).send(dashboard);
            });
    };

    this.createDashboard = function (req, res, next) {
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var body = req.body;

        body.createdBy = {user: req.session.uId};
        body.editedBy = {user: req.session.uId};

        Dashboard.create(body, function (err, dashboards) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: 'Dashboard Saved', data: dashboards});

        });
    };

    this.updateDashboard = function (req, res, next) {
        var data = req.body;
        var Chart = models.get(req.session.lastDb, 'CustomChart', CustomChartSchema);
        var id = req.params.id;
        var user = req.session.uId;
        var dbName = req.session.lastDb;
        var querySet = {};

        if (data.favorite) {
            if (data.favorite) {
                querySet = {$addToSet: {'favorite.dashboards': id}};
            } else {
                querySet = {$pull: {'favorite.dashboards': id}};
            }

            usersService.findByIdAndUpdate(user, querySet, {
                new   : true,
                dbName: dbName
            }, function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: 'Dashboard added to favorites'});
            });

            return false;
        }

        dashboardsService.update({
            dbName: dbName,
            data  : data,
            query : {_id: id}
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            if (data.chartsToDelete && data.chartsToDelete.length) {
                Chart.remove({_id: {$in: data.chartsToDelete}}, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            } else {
                res.status(200).send(result);
            }
        });
    };

    this.deleteDashboards = function (req, res, next) {
        var Dashboard = models.get(req.session.lastDb, 'CustomDashboard', CustomDashboardSchema);
        var Chart = models.get(req.session.lastDb, 'CustomChart', CustomChartSchema);
        var ids = req.body.ids || [req.params.id];
        var dbName = req.session.lastDb;
        var user = req.session.uId;
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

                usersService.findByIdAndUpdate(user, {$pull: {'favorite.dashboards': id}}, {
                    new   : true,
                    dbName: dbName
                }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    Chart
                        .remove(query)
                        .exec(function (error, charts) {
                            if (error) {
                                return next(error);
                            }

                            res.status(201).send(charts);
                        });

                });

            });
    };
};

module.exports = Module;
