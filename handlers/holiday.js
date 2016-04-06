var mongoose = require('mongoose');
var Holiday = function (models, event) {
    'use strict';

    var access = require("../Modules/additions/access.js")(models);
    var HolidaySchema = mongoose.Schemas['Holiday'];
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var moment = require('../public/js/libs/moment/moment');
    var CONSTANTS = require('../constants/mainConstants');

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
        var count = options.count || CONSTANTS.DEF_LIST_COUNT;
        var page = options.page;
        var skip;

        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
        skip = (page - 1) > 0 ? (page - 1) * count : 0;


        if (options && options.sort) {
            sort = options.sort;
        } else {
            sort = {"date": -1};
        }

        query = Holiday.find(queryObject).limit(count).skip(skip).sort(sort);
        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: result});
        });
    };

    function getHolidayByWeek(req, res, next) {
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
        var options = req.query;
        var year = parseInt(options.year);
        var week = parseInt(options.week);
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



        Holiday.aggregate([
            {
                $match: {
                    date: {$gte: startDate, $lte: endDate}
                }
            },
            {
                $project: {
                    _id: 0,
                    comment: 1,
                    date: 1
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ],
            function (err, result) {
                if (err) {
                    return next(err);
                }

                result.forEach(function(holiday) {
                    date = moment(holiday.date);
                    day = date.isoWeekday();
                    holidaysWeek[day] = 'H';
                });

                res.status(200).send(holidaysWeek);
            });

    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 69, function (access) {
                if (access) {
                    if (req.query.week) {
                        getHolidayByWeek(req, res, next);
                    } else {
                        getHolidayFilter(req, res, next);
                    }
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 69, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date()
                    };
                    Holiday.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, response) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'updated'});
                        event.emit('recollectVacationDash');
                    });
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 69, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;
                        var date;

                        if (data.date) {
                            date = data.date;
                            date = moment(new Date(date));

                            data.year = date.isoWeekYear();
                            data.week = date.isoWeek();
                            data.day = date.day();
                        }

                        data.editedBy = {
                            user: uId,
                            date: new Date()
                        };

                        delete data._id;

                        Holiday.findByIdAndUpdate(id, {$set: data}, {new: true}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'updated'});
                        event.emit('recollectVacationDash');
                    });
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.remove = function (req, res, next) {
        var self = this;
        var id = req.params.id;
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);

        access.getDeleteAccess(req, req.session.uId, 69, function (access) {
            if (access) {
                Holiday.remove({_id: id}, function (err, holiday) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: holiday});
                    event.emit('recollectVacationDash');
                });
            } else {
                res.status(403).send();
            }
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

        Holiday = new HolidayModel(body);

        access.getEditWritAccess(req, req.session.uId, 69, function (access) {
            if (access) {
                Holiday.save(function (err, holiday) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: holiday});
                    event.emit('recollectVacationDash');
                });
            } else {
                res.status(403).send();
            }
        });
    };

};

module.exports = Holiday;