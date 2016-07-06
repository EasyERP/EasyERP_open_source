var mongoose = require('mongoose');
var async = require('async');
var redisStore = require('../helpers/redisClient');
var objectId = mongoose.Types.ObjectId;

var Module = function (models) {
    'use strict';

    var moduleSchema = mongoose.Schemas.module;
    var profileSchema = mongoose.Schemas.Profile;
    var userSchema = mongoose.Schemas.User;

    function _userProfileRetriver(req, userId) {
        return function (waterFallCb) {
            models.get(req.session.lastDb, 'Users', userSchema).findById(userId, function (err, user) {
                if (err || !user) {
                    if (!user) {
                        err = new Error('Can\'t find user');
                    }

                    return waterFallCb(err);
                }

                waterFallCb(null, user.profile);
            });
        };
    }

    function _profileRetriver(req) {
        return function (userProfileId, waterFallCb) {
            models
                .get(req.session.lastDb, 'Profile', profileSchema)
                .aggregate([{
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
                        $group: {
                            _id: '$profileAccess.module'
                        }
                    }],

                    function (err, modulesId) {
                        if (err) {
                            return waterFallCb(err);
                        }

                        waterFallCb(null, modulesId);
                    }
                );
        };
    }

    function getModules(req, userId, callback) {
        models
            .get(req.session.lastDb, 'User', userSchema)
            .aggregate([{
                    $match: {
                        _id: objectId(userId)
                    }
                }, {
                    $lookup: {
                        from        : 'Profile',
                        localField  : 'profile',
                        foreignField: '_id',
                        as          : 'profile'
                    }
                }, {
                    $project: {
                        'profileAccess': {
                            $arrayElemAt: [
                                '$profile.profileAccess',
                                0
                            ]
                        },
                        _id            : 0
                    }
                }, {
                    $match: {
                        'profileAccess.access.read': true
                    }
                }, {
                    $unwind: '$profileAccess'
                }, {
                    $group: {
                        _id: '$profileAccess.module'
                    }
                }, {
                    $lookup: {
                        from        : 'modules',
                        localField  : '_id',
                        foreignField: '_id',
                        as          : 'module'
                    }
                }, {
                    $match: {
                        'module.visible': true
                    }
                }, {
                    $project: {
                        module: {
                            $arrayElemAt: [
                                '$module',
                                0
                            ]
                        },
                        _id   : 0
                    }
                }, {
                    $project: {
                        _id     : '$module._id',
                        mname   : '$module.mname',
                        href    : '$module.href',
                        sequence: '$module.sequence',
                        parrent : '$module.parrent',
                        link    : '$module.link'

                    }
                }, {
                    $sort: {
                        sequence: 1
                    }
                }, {
                    $group: {
                        _id       : '$parrent',
                        subModules: {
                            $push: '$$ROOT'
                        }
                    }
                }, {
                    $match: {
                        _id: {
                            $ne: null
                        }
                    }
                }, {
                    $lookup: {
                        from        : 'modules',
                        localField  : '_id',
                        foreignField: '_id',
                        as          : 'module'
                    }

                }, {
                    $project: {
                        module    : {
                            $arrayElemAt: [
                                '$module',
                                0
                            ]
                        },
                        subModules: {
                            mname: 1,
                            href : 1,
                            link : 1
                        },
                        _id       : 0
                    }
                }, {
                    $match: {
                        'module.visible': true
                    }
                }, {
                    $sort: {
                        'module.sequence': 1
                    }
                }, {
                    $project: {
                        _id       : '$module._id',
                        mname     : '$module.mname',
                        href      : '$module.href',
                        link      : '$module.link',
                        subModules: 1

                    }
                }

                ],

                callback
            );
    }

    this.getAllModulesByProfile = function (req, res, next) {
        var userId = req.session ? req.session.uId : null;
        var key = req.session.profileId;

        getModules(req, userId, function (err, modules) {
            if (err) {
                return next(err);
            }

            res.status(200).send(modules);
            redisStore.writeToStorage('modules', key, JSON.stringify(modules));
        });
    };

    this.redirectTo = function (req, res, next) {
        var id = req.params.id;
        var userId = req.session ? req.session.uId : null;
        var userProfileRetriver = _userProfileRetriver(req, userId);
        var profileRetriver = _profileRetriver(req);

        function moduleRetriver(modulesId, waterFallCb) {
            models.get(req.session.lastDb, 'modules', moduleSchema).find({
                _id    : {$in: modulesId},
                visible: true,
                parrent: id
            }).sort({sequence: 1}).exec(function (err, mod) {
                if (err) {
                    return waterFallCb(err);
                }
                if (!mod) {
                    err = new Error('Bad request');
                    err.status = 400;

                    return waterFallCb(err);
                }

                waterFallCb(null, mod[0]);
            });
        }


        async.waterfall([userProfileRetriver, profileRetriver, moduleRetriver], function (err, module) {
            if (err) {
                return next(err);
            }

            res.redirect('/#easyErp/' + module.href);
        });
    };
};

module.exports = Module;
