var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var PayRoll = function (event, models) {
    var access = require("../Modules/additions/access.js")(models);
    var PayRollSchema = mongoose.Schemas['PayRoll'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var _ = require('lodash');

    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var objectId = mongoose.Types.ObjectId;
    var mid = 66;

    this.create = function (req, res, next) {
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var body = req.body;
        var payRollModel;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                data.createdBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };

                payRollModel = new PayRoll(mapObject(body));

                payRollModel.save(function (err, payRoll) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(payRoll);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                PayRoll.remove({_id: id}, function (err, payRoll) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(payRoll);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.putchModel = function (req, res, next) {
        var data = mapObject(req.body);
        var id = req.params.id;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                data.editedBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };

                PayRoll.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, response) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: 'updated'});
                });

            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                async.each(body, function (data, cb) {
                    var id = data._id;

                    data.editedBy = {
                        user: uId,
                        date: new Date().toISOString()
                    };
                    delete data._id;

                    PayRoll.findByIdAndUpdate(id, {$set: data}, cb);
                }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: 'updated'});
                });
            });
        } else {
            res.status(401).send();
        }
    };

    this.getById = function (req, res, next) {
        var id = req.params.id;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        var queryObject = {_id: id};
        var query;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                query = Salary.findOne(queryObject);

                query.exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(result);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.getForView = function (req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
                var query = req.query;
                var queryObject = {};

                if (query) {
                    if (query.employee) {
                        queryObject['employee._id'] = objectId(query.employee);
                    }
                    if (query.year) {
                        queryObject.year = query.year;
                    }
                    if (query.month) {
                        queryObject.month = query.month;
                    }
                }

                query = PayRoll.find(queryObject);

                query.exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            });

        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };
};

module.exports = PayRoll;