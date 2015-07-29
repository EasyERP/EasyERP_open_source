/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
var mongoose = require('mongoose');

var BonusType = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var bonusTypeSchema = mongoose.Schemas['bonusType'];
    var async = require('async');

    this.create = function(req, res, next){
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);
        var body = req.body;
        var bonusType = new  bonusTypeModel(body);
        access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                bonusType.save(function (err, bonusType) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(bonusType);
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.patchM = function (req, res, next) {
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);
        var body = req.body;
        var uId;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 72, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;

                        delete data._id;
                        bonusTypeModel.findByIdAndUpdate(id, {$set: data}, cb);
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

    this.getList = function (req, res, next) {
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);
        var sort = {};
        var count = req.query.count ? req.query.count : 50;
        var page = req.query.page;
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;
        var query = req.query;

        if (query.sort) {
            sort = query.sort;
        } else sort = {};
        access.getReadAccess(req, req.session.uId, 72, function (access) {
            if (access) {
                bonusTypeModel
                    .find()
                    .limit(count)
                    .skip(skip)
                    .sort(sort)
                    .exec(function (err, data) {
                        if (err) {
                            return next(err);
                        } else {
                            res.status(200).send(data);
                        }
                    });
            } else {
                res.status(403).send();
            }
        });
    };

    this.totalCollectionLength = function(req, res, next) {
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);

        bonusTypeModel.find().count(function(err, count){
            if (err){
                next(err)
            }
            res.status(200).send( {count: count});

        });
    };


    this.remove = function(req, res, id, next) {
        var bonusTypeModel = models.get(req.session.lastDb, 'bonusType', bonusTypeSchema);
        access.getDeleteAccess(req, req.session.uId, 72, function (access) {
            if (access) {
                bonusTypeModel.findByIdAndRemove(id, function (err, result) {
                    if (err) {
                        next(err);
                    } else {
                        res.status(200).send({success: result});
                    }
                });
            } else {
                res.status(403).send();
            }
        });
    };
};

module.exports = BonusType;