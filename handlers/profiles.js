var mongoose = require('mongoose');
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

            return next(err);
        }

        body = validator.parseProfileBody(body);

        profile = new ProfileModel(body);
        profile.save(function (err, profile) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: "Profile Saved", data: profile, id: profile._id});
        });

        /*var data = {};
         data = req.body;
         if (!data.profileName) {
         logWriter.log('Profile.create Incorrect Incoming Data');
         res.send(400, {error: 'Profile.create Incorrect Incoming Data'});
         return;
         } else {
         models.get(req.session.lastDb, "Profile", ProfileSchema).find({profileName: data.profileName}, function (error, doc) {
         if (error) {
         logWriter.log("Profile.js create profile.find");
         res.send(500, {error: 'Profile.create find error'});
         }
         if (doc.length > 0) {
         res.send(500, {error: 'A Profile with the same name already exists'});
         } else if (doc.length === 0) {
         saveProfileToDb(data);
         }
         });
         }
         function saveProfileToDb(data) {
         try {
         var _profile = new models.get(req.session.lastDb, "Profile", ProfileSchema)({_id: Date.parse(new Date())});
         if (data.profileName) {
         _profile.profileName = data.profileName;
         }
         if (data.profileDescription) {
         _profile.profileDescription = data.profileDescription;
         }
         if (data.profileAccess) {
         _profile.profileAccess = data.profileAccess.map(function (item) {
         item.module = item.module._id;
         return item;
         });
         }
         _profile.save(function (err, result) {
         try {
         if (err) {
         logWriter.log("Profile.js saveProfileToDb _profile.save" + err);
         res.send(500, {error: "Profile save failed"});
         }
         if (result) {
         res.send(201, {success: "Profile Saved", data: result, id: result._id});
         }
         }
         catch (error) {
         logWriter.log("Profile.js saveProfileToDb _profile.save" + error);
         res.send(500, {error: 'Profile.create find error'});
         }
         });
         }
         catch (error) {
         logWriter.log("Profile.js saveProfileToDb " + error);
         res.send(500, {error: 'Profile.create find error'});
         }
         }*/

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
                    return next(err);
                } else {
                    response['data'] = result;
                    res.send(response);
                }
            });
        /*try {
         if (req.session && req.session.loggedIn && req.session.lastDb) {
         access.getReadAccess(req, req.session.uId, 51, function (access) {
         if (access) {
         var response = {};
         response['data'] = [];
         var query = models.get(req.session.lastDb, "Profile", ProfileSchema).find({});
         query.sort({profileName: 1}).populate('profileAccess.module');
         query.exec(function (err, result) {
         if (err || result.length == 0) {
         if (err) {
         logWriter.log("Profile.js getProfiles profile.find " + err);
         }
         res.send(404, {error: "Can't find Profile"});
         } else {
         response['data'] = result;
         res.send(response);
         }
         });
         } else {
         res.send(403);
         }
         });

         } else {
         res.send(401);
         }
         }
         catch (Exception) {

         console.log("requestHandler.js  " + Exception);
         }*/
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
                    return next(err);
                } else {
                    response['data'] = result;
                    res.send(response);
                }
            });

        /*try {
         if (req.session && req.session.loggedIn && req.session.lastDb) {
         var response = {};
         response['data'] = [];
         var query = models.get(req.session.lastDb, "Profile", ProfileSchema).find({});
         query.select("_id profileName");
         query.exec(function (err, result) {
         if (err || result.length == 0) {
         if (err) {
         logWriter.log("Profile.js getProfiles profile.find " + err);
         }
         res.send(404, {error: "Can't find Profile"});
         } else {
         response['data'] = result;
         res.send(response);
         }
         });
         } else {
         res.send(401);
         }
         }
         catch (Exception) {
         console.log("requestHandler.js  " + Exception);
         }*/
    };

    this.updateProfile = function (req, res, next) {

        var ProfileModel = models.get(req.session.lastDb, 'Profile', ProfileSchema);

        var data = {};
        var _id = req.param('_id');
        data = req.body;

        ProfileModel.update({_id: _id}, data)
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.send(200, {success: 'Profile updated success'});
        });


            /*var data = {};
            var _id = req.param('_id');
            data = req.body;
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getEditWritAccess(req, req.session.uId, 51, function (access) {
                    if (access) {
                        try {
                            delete data._id;
                            models.get(req.session.lastDb, "Profile", ProfileSchema).update({_id: _id}, data, function (err, result) {
                                if (result) {
                                    res.send(200, {success: 'Profile updated success'});
                                } else if (err) {
                                    logWriter.log("Profile.js update profile.update" + err);
                                    res.send(500, {error: "Can't update Profile"});
                                } else {
                                    res.send(500, {error: "Can't update Profile"});
                                }
                            });
                        }
                        catch (exception) {
                            logWriter.log("Profile.js update " + exception);
                            res.send(500, {error: exception});
                        }
                    } else {
                        res.send(403);
                    }
                });
            } else {
                res.send(401);
            }*/
    };

    this.removeProfile = function (req, res, next) {

        var ProfileModel = models.get(req.session.lastDb, 'Profile', ProfileSchema);
        var UsereModel = models.get(req.session.lastDb, 'Users', UserSchema);

        var _id = req.param('_id');

        UsereModel.update({profile: _id}, {profile: "1387275504000"}, {multi: true})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                ProfileModel.remove({_id: _id})
                    .exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.send(200, {success: 'Profile removed'});
                    });
            });


        /*var _id = req.param('_id');
         if (req.session && req.session.loggedIn && req.session.lastDb) {
         access.getDeleteAccess(req, req.session.uId, 51, function (access) {
         if (access) {
         models.get(req.session.lastDb, 'Users', users).update({profile: _id}, {profile: "1387275504000"}, {multi: true}, function (err, result) {
         models.get(req.session.lastDb, "Profile", ProfileSchema).remove({_id: _id}, function (err, result) {
         if (err) {
         logWriter.log("Profile.js remove profile.remove " + err);
         res.send(500, {error: "Can't remove Profile"});
         } else {
         res.send(200, {success: 'Profile removed'});
         }
         });
         });
         } else {
         res.send(403);
         }
         });

         } else {
         res.send(401);
         }*/
    };

};

module.exports = Profiles;