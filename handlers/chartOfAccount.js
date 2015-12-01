/**
 * Created by lilya on 27/11/15.
 */
var mongoose = require('mongoose');
var chartOfAccountSchema = mongoose.Schemas['chartOfAccount'];
var async = require('async');

var _ = require('../node_modules/underscore');
var Chart = function (models) {
    var access = require("../Modules/additions/access.js")(models);

    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);
        var body = req.body;
        var newModel;

        access.getEditWritAccess(req, req.session.uId, 82, function (access) {
            if (access) {

                newModel = new Model(body);

                newModel.save(function (err, model) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: model});
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);
        var data = req.query;
        var sort = data.sort ? data.sort : {_id: 1};

        Model.find({}).sort(sort).exec(function(err, result){
            if (err){
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 82, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };
                        delete data._id;

                        Model.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, model) {
                            if (err) {
                                return cb(err);
                            }

                            cb();
                        });
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
        var id = req.params.id;
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        access.getDeleteAccess(req, req.session.uId, 82, function (access) {
            if (access) {
                Model.findByIdAndRemove(id, function (err, removed) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: removed});
                });
            } else {
                res.status(403).send();
            }
        });
    };


};

module.exports = Chart;
