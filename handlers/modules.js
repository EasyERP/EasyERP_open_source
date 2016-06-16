var mongoose = require('mongoose');
var async = require('async');
var Module = function (models) {
    'use strict';

    var moduleSchema = mongoose.Schemas.module;
    var profileSchema = mongoose.Schemas.Profile;
    var userSchema = mongoose.Schemas.User;

    this.getAllModulesByProfile = function (req, res, next) {
        var userId = req.session ? req.session.uId : null;

        function userProfileRetriver(waterFallCb) {
            models.get(req.session.lastDb, 'Users', userSchema).findById(userId, function (err, user) {
                if (err || !user) {
                    if (!user) {
                        err = new Error('Can\'t find user');
                    }

                    return waterFallCb(err);
                }

                waterFallCb(null, user.profile);
            });
        }

        function profileRetriver(userProfileId, waterFallCb) {
            models.get(req.session.lastDb, 'Profile', profileSchema).aggregate([{
                    $project: {
                        profileAccess: 1
                    }
                }, {
                    $match: {
                        _id: userProfileId
                    }
                }, {
                    $unwind: '$profileAccess'
                }, {
                    $match: {
                        'profileAccess.access.read': true
                    }
                }, {
                    $group: {_id: '$profileAccess.module'}
                }],
                function (err, modulesId) {
                    if (err) {
                        return waterFallCb(err);
                    }

                    waterFallCb(null, modulesId);
                }
            );
        }

        function modulesRetriver(modulesId, waterFallCb) {
            models.get(req.session.lastDb, 'modules', moduleSchema).find({
                _id    : {$in: modulesId},
                visible: true
            }).sort({
                sequence: 1
            }).exec(function (err, modules) {
                if (err) {
                    return waterFallCb(err);
                }

                waterFallCb(null, modules);
            });
        }

        async.waterfall([userProfileRetriver, profileRetriver, modulesRetriver], function (err, modules) {
            if (err) {
                return next(err);
            }

            res.status(200).send(modules);
        });
    };
};

module.exports = Module;
