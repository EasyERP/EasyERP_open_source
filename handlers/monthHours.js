var mongoose = require('mongoose');
var async = require('async');
var redisStore = require('../helpers/redisClient');

var MonthHours = function (event, models) {
    'use strict';

    var MonthHoursSchema = mongoose.Schemas.MonthHours;
    var pageHelper = require('../helpers/pageHelper');

    function composeAndCash(req) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);

        MonthHoursModel.aggregate([{
            $group: {
                _id : {$sum: [{$multiply: ['$year', 100]}, '$month']},
                root: {$push: '$$ROOT'}
            }
        }], function (err, result) {
            if (err) {
                return console.log(err);
            }

            result.forEach(function (el) {
                redisStore.writeToStorage('monthHours', el._id, JSON.stringify(el.root));
            });

        });
    }

    this.create = function (req, res, next) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var body = req.body;
        var dateByMonth = parseInt(body.year, 10) * 100 + parseInt(body.month, 10);
        var monthHours;

        if (!body.month || !body.year) {
            return res.status(404).send();
        }

        body.dateByMonth = dateByMonth;

        monthHours = new MonthHoursModel(body);

        monthHours.save(function (err, result) {
            var params;

            if (err) {
                return next(err);
            }
            composeAndCash(req);
            event.emit('setReconcileTimeCard', {req: req, month: result.month, year: result.year});
            
            res.status(200).send(result);
        });
    };

    this.patchM = function (req, res, next) {
        var body = req.body;
        var monthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);

        async.each(body, function (data, cb) {
            var id = data._id;
            var dateByMonth;

            delete data._id;

            if (data.year && data.month) {
                dateByMonth = parseInt(data.year, 10) * 100 + parseInt(data.month, 10);

                data.dateByMonth = dateByMonth;
            }

            monthHoursModel.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, result) {
                var params;

                if (err) {
                    return cb(err);
                }
                params = {
                    req               : req,
                    year              : result.year,
                    month             : result.month,
                    fixedExpense      : result.fixedExpense,
                    expenseCoefficient: result.expenseCoefficient,
                    hours             : result.hours,
                    dateByMonth       : result.dateByMonth
                };
               
                event.emit('setReconcileTimeCard', {req: req, month: result.month, year: result.year});
                cb(null, result);
            });

        }, function (err) {
            if (err) {
                return next(err);
            }

            composeAndCash(req);
            res.status(200).send({success: 'updated'});
        });
    };

    this.getList = function (req, res, next) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var sort = req.query.sort || {year: '-1', month: '-1'};
        var paginationObject = pageHelper(req.query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var parallelTasks;

        var getTotal = function (pCb) {

            MonthHoursModel.count(function (err, _res) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, _res);
            });
        };

        var getData = function (pCb) {
            MonthHoursModel.find().sort(sort).skip(skip).limit(limit).exec(function (err, _res) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, _res);
            });
        };

        parallelTasks = [getTotal, getData];

        async.parallel(parallelTasks, function (err, result) {
            var count;
            var response = {};

            if (err) {
                return next(err);
            }

            count = result[0] || 0;

            response.total = count;
            response.data = result[1];

            res.status(200).send(response);
        });

    };

    this.getData = function (req, res, next) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var queryObj = {};

        var query = req.query;

        if (query.month) {
            queryObj.month = Number(query.month);
        }
        if (query.year) {
            queryObj.year = Number(query.year);
        }

        MonthHoursModel
            .aggregate(
                [{
                    $match: queryObj
                }]
            )
            .exec(function (err, data) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(data);
            });
    };

    this.remove = function (req, res, next) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var id = req.params.id;

        if (!id || (id && id.length < 24)) {
            return res.status(404).send();
        }

        MonthHoursModel.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: result});

            composeAndCash(req);
            event.emit('setReconcileTimeCard', {req: req, month: result.month, year: result.year});
        });
    };

    this.bulkRemove = function (req, res, next) {
        var MonthHoursModel = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            MonthHoursModel.findByIdAndRemove(id, function (err, result) {
                if (err) {
                    return next(err);
                }

                composeAndCash(req);
                event.emit('setReconcileTimeCard', {req: req, month: result.month, year: result.year});

                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });
    };

};

module.exports = MonthHours;
