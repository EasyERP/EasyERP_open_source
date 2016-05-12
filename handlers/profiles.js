var mongoose = require('mongoose');
var RESPONSES = require('../constants/responses');
var MAIN = require('../constants/mainConstants');
var ProfileSchema = mongoose.Schemas['Profile'];
var UserSchema = mongoose.Schemas['User'];

var Profiles = function (models) {
    "use strict";
    var access = require("../Modules/additions/access.js")(models);
    var validator = require('../helpers/validator');

    this.createProfile = function (req, res, next) {
        var ProfileModel = models.get(req.session.lastDb, 'Profile', ProfileSchema);
        var body = req.body;
        var err;
        var profile;

        if (!validator.validProfileBody(body)) {
            err = new Error();
            err.status = 404;
            err.message = RESPONSES.PAGE_NOT_FOUND;

            return next(err);
        }

        body = validator.parseProfileBody(body);

        profile = new ProfileModel(body);
        profile.save(function (err, profile) {
            if (err) {
                err.status = 404;
                err.message = RESPONSES.PAGE_NOT_FOUND;

                return next(err);
            }

            res.status(201).send({success: "Profile Saved", data: profile, id: profile._id});
        });

    };

    this.getProfile = function (req, res, next) {
        var response = {};
        response['data'] = [];
        var ProfileModel = models.get(req.session.lastDb, 'Profile', ProfileSchema);

        ProfileModel.find()
            .sort({profileName: 1})
            .populate('profileAccess.module')
            .exec(function (err, result) {
                if (err) {
                    err.status = 404;
                    err.message = RESPONSES.PAGE_NOT_FOUND;

                    return next(err);
                } else {
                    response['data'] = result;
                    res.send(response);
                }
            });
    };

    this.getProfileForDd = function (req, res, next) {
        var response = {};
        response['data'] = [];
        var ProfileModel = models.get(req.session.lastDb, 'Profile', ProfileSchema);

        ProfileModel.find()
            .sort({profileName: 1})
            .select("_id profileName")
            .exec(function (err, result) {
                if (err) {
                    err.status = 404;
                    err.message = RESPONSES.PAGE_NOT_FOUND;

                    return next(err);
                } else {
                    response['data'] = result;
                    res.send(response);
                }
            });

    };

    this.updateProfile = function (req, res, next) {

        var ProfileModel = models.get(req.session.lastDb, 'Profile', ProfileSchema);

        var data = {};
        var _id = req.param('_id');
        data = req.body;

        ProfileModel.update({_id: _id}, data)
            .exec(function (err, result) {
                if (err) {
                    err.status = 404;
                    err.message = RESPONSES.PAGE_NOT_FOUND;

                    return next(err);
                }
                res.send(200, {success: 'Profile updated'});
            });

    };

    this.removeProfile = function (req, res, next) {

        var ProfileModel = models.get(req.session.lastDb, 'Profile', ProfileSchema);
        var UsereModel = models.get(req.session.lastDb, 'Users', UserSchema);

        var _id = req.param('_id');

        UsereModel.update({profile: _id}, {profile: MAIN.BANED_PROFILE}, {multi: true})
            .exec(function (err, result) {
                if (err) {
                    err.status = 404;
                    err.message = RESPONSES.PAGE_NOT_FOUND;

                    return next(err);
                }
                ProfileModel.remove({_id: _id})
                    .exec(function (err, result) {
                        if (err) {
                            err.status = 404;
                            err.message = RESPONSES.PAGE_NOT_FOUND;
                            return next(err);
                        }
                        res.send(200, {success: 'Profile removed'});
                    });
            });

    };

};

module.exports = Profiles;