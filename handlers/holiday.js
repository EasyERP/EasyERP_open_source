var mongoose = require('mongoose');
var Module = function (models, event) {
    'use strict';

    var HolidaySchema = mongoose.Schemas.Holiday;
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var moment = require('../public/js/libs/moment/moment');
    var pageHelper = require('../helpers/pageHelper');

    this.totalCollectionLength = function (req, res, next) {
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
        var query;

        query = Holiday.find();
        query.exec(function (err, result) {
            if (next) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({count: result.length});
            } else if (typeof res === 'function') {
                res(null, result.length);
            }
        });
    };

    function getHolidayFilter(req, res, next) {
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
        var options = req.query;
        var queryObject = {};
        var sort = {};
        var query;
        var paginationObject = pageHelper(options);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var parallelTasks;
        var getTotal;
        var getData;

        if (options && options.sort) {
            sort = options.sort;
        } else {
            sort = {date: -1};
        }

        getTotal = function (pCb) {

            Holiday.find(queryObject).count(function (err, _res) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, _res);
            });
        };

        getData = function (pCb) {
            Holiday.find(queryObject).skip(skip).limit(limit).sort(sort).exec(function (err, _res) {
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
    }

    function getHolidayByWeek(req, res, next) {
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
        var options = req.query;
        var year = parseInt(options.year, 10);
        var week = parseInt(options.week, 10);
        var date = moment([year, 2]);
        var holidaysWeek = {};
        var startDate;
        var endDate;
        var day;

        date.isoWeek(week);

        date.isoWeekday(1);

        startDate = new Date(date.toDate());

        date.isoWeekday(7);

        endDate = new Date(date.toDate());

        Holiday.aggregate([{
            $match: {
                date: {$gte: startDate, $lte: endDate}
            }
        }, {
            $project: {
                _id    : 0,
                comment: 1,
                date   : 1
            }
        }, {
            $sort: {
                date: 1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            result.forEach(function (holiday) {
                date = moment(holiday.date);
                day = date.isoWeekday();
                holidaysWeek[day] = 'H';
            });

            res.status(200).send(holidaysWeek);
        });

    }

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;

        if (req.query.week) {
            getHolidayByWeek(req, res, next);
        } else {
            getHolidayFilter(req, res, next);
        }
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);

        data.editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        if (data.date) {
            data.dateByMonth = moment(new Date(data.date)).year() * 100 + moment(new Date(data.date)).month() + 1;
        }

        Holiday.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
            event.emit('setReconcileTimeCard', {req: req, week: response.week, year: response.year});
            event.emit('recollectVacationDash');
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId = req.session.uId;
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);

        async.each(body, function (data, cb) {
            var id = data._id;
            var date;

            if (data.date) {
                date = data.date;
                date = moment(new Date(date));

                data.year = date.isoWeekYear();
                data.week = date.isoWeek();
                data.day = date.day();

                data.dateByMonth = moment(new Date(data.date)).year() * 100 + moment(new Date(data.date)).month() + 1;
            }

            data.editedBy = {
                user: uId,
                date: new Date()
            };

            delete data._id;

            Holiday.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, result) {
                if (err) {
                    return cb(err);
                }

                event.emit('setReconcileTimeCard', {req: req, week: result.week, year: result.year});
                cb(null, result);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
            event.emit('recollectVacationDash');
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);

        Holiday.remove({_id: id}, function (err, holiday) {
            if (err) {
                return next(err);
            }

            event.emit('setReconcileTimeCard', {req: req, week: holiday.week, year: holiday.year});
            event.emit('recollectVacationDash');

            res.status(200).send({success: holiday});
        });
    };

    this.create = function (req, res, next) {
        var HolidayModel = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
        var body = mapObject(req.body);
        var Holiday;
        var date;

        body.date = new Date(body.date);
        date = moment(body.date);

        body.year = date.isoWeekYear();
        body.week = date.isoWeek();
        body.day = date.day();

        body.dateByMonth = moment(date).year() * 100 + moment(date).month() + 1;

        Holiday = new HolidayModel(body);

        Holiday.save(function (err, holiday) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: holiday});
            event.emit('setReconcileTimeCard', {req: req, week: holiday.week, year: holiday.year});
            event.emit('recollectVacationDash');
        });
    };

};

module.exports = Module;
