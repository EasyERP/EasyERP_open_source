var Profile = function (models) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter');
    var users = mongoose.Schemas['User'];
    var ProfileSchema = mongoose.Schemas['Profile'];

    function createProfile(req, data, res) {
        try {
            if (!data.profileName) {
                logWriter.log('Profile.create Incorrect Incoming Data');
                res.send(400, { error: 'Profile.create Incorrect Incoming Data' });
                return;
            } else {
                models.get(req.session.lastDb, "Profile", ProfileSchema).find({ profileName: data.profileName }, function (error, doc) {
                    try {
                        if (error) {
                            logWriter.log("Profile.js create profile.find");
                            res.send(500, { error: 'Profile.create find error' });
                        }
                        if (doc.length > 0) {
                            res.send(500, { error: 'A Profile with the same name already exists' });
                        } else if (doc.length === 0) {
                            saveProfileToDb(data);
                        }
                    }
                    catch (error) {
                        logWriter.log("Profile.js create profile.find " + error);
                        res.send(500, { error: 'Profile.create find error' });
                    }
                });
            }
            function saveProfileToDb(data) {
                try {
                    _profile = new models.get(req.session.lastDb, "Profile", ProfileSchema)({ _id: Date.parse(new Date()) });
                    if (data.profileName) {
                        _profile.profileName = data.profileName;
                    }
                    if (data.profileDescription) {
                        _profile.profileDescription = data.profileDescription;
                    }
                    if (data.profileAccess) {
                        _profile.profileAccess = data.profileAccess.map(function(item){
							item.module=item.module._id;
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
                                res.send(201, {success:"Profile Saved", data:result, id: result._id});
                            }
                        }
                        catch (error) {
                            logWriter.log("Profile.js saveProfileToDb _profile.save" + error);
                            res.send(500, { error: 'Profile.create find error' });
                        }
                    });
                }
                catch (error) {
                    logWriter.log("Profile.js saveProfileToDb " + error);
                    res.send(500, { error: 'Profile.create find error' });
                }
            }
        }
        catch (exception) {
            logWriter.log("Profile.js  create " + exception);
            res.send(500, { error: 'Profile.create find error' });
        }
    };

    function getProfile(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, "Profile", ProfileSchema).find({});
        query.sort({profileName: 1 }).
        populate('profileAccess.module');
        query.exec(function (err, result) {
            if (err || result.length == 0) {
                if (err) {
                    logWriter.log("Profile.js getProfiles profile.find " + err);
                }
                response.send(404, { error: "Can't find Profile" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };
    function getProfileForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, "Profile", ProfileSchema).find({});
        query.select("_id profileName");
        query.exec(function (err, result) {
            if (err || result.length == 0) {
                if (err) {
                    logWriter.log("Profile.js getProfiles profile.find " + err);
                }
                response.send(404, { error: "Can't find Profile" });
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function updateProfile(req, _id, data, res) {
        try {
            delete data._id;
            models.get(req.session.lastDb, "Profile", ProfileSchema).update({ _id: _id }, data, function (err, result) {
                if (result) {
                    res.send(200, { success: 'Profile updated success' });
                } else if(err){
                        logWriter.log("Profile.js update profile.update" + err);
                        res.send(500, { error: "Can't update Profile" });
                    }  else  {
                    res.send(500, { error: "Can't update Profile" });
                }
            });
        }
        catch (exception) {
            logWriter.log("Profile.js update " + exception);
            res.send(500, { error: exception });
        }
    };

    function removeProfile(req, _id, res) {
		models.get(req.session.lastDb, 'Users', users).update({ profile: _id}, {profile:"1387275504000"},{multi:true}, function (err, result) {
			models.get(req.session.lastDb, "Profile", ProfileSchema).remove({ _id: _id }, function (err, result) {
				if (err) {
					logWriter.log("Profile.js remove profile.remove " + err);
					res.send(500, { error: "Can't remove Profile" });
				} else {
					res.send(200, { success: 'Profile removed' });
				}
			});
		});
    };

    return {
        
        createProfile: createProfile,
        
        getProfile: getProfile,

		getProfileForDd: getProfileForDd,
        
        updateProfile: updateProfile,
        
        removeProfile: removeProfile
    };

};
module.exports = Profile;
