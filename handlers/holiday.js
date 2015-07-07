/**
 * Created by soundstorm on 29.06.15.
 */
var mongoose = require('mongoose');
var Holiday = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var HolidaySchema = mongoose.Schemas['Holiday'];
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');

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
            } else if (typeof res == 'function') {
                res(null, result.length);
            }
        });
    };

    function getHolidayFilter(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 69, function (access) {
                if (access) {
                    var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
                    var options = req.query;
                    var queryObject = {};
                    var sort = {};
                    var query;
                    var count = options.count ? options.count : 50;
                    var page = options.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

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
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;

        switch (viewType) {
            case "list":
                getHolidayFilter(req, res, next);
                break;
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
                        date: new Date().toISOString()
                    };
                    Holiday.findByIdAndUpdate(id, {$set: data}, function (err, response) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'updated'});
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

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };
                        delete data._id;
                        Holiday.findByIdAndUpdate(id, {$set: data}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'updated'});
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

        Holiday.remove({_id: id}, function (err, holiday) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: holiday});
        });
    };

    this.create = function (req, res, next) {
        var Holiday = models.get(req.session.lastDb, 'Holiday', HolidaySchema);
        var body = mapObject(req.body);
        var Holiday = new Holiday(body);

        Holiday.save(function (err, Holiday) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: Holiday});
        });
    };

};

module.exports = Holiday;