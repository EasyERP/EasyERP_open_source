var mongoose = require('mongoose');
var async = require('async');
var redisStore = require('../helpers/redisClient');
var objectId = mongoose.Types.ObjectId;

var Module = function (models) {
    'use strict';

    var userSchema = mongoose.Schemas.User;

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
                        profileAccess: {
                            $arrayElemAt: [
                                '$profile.profileAccess',
                                0
                            ]
                        },

                        _id: 0
                    }
                }, {
                    $project: {
                        profileAccess: {
                            $filter: {
                                input: '$profileAccess',
                                as   : 'access',
                                cond : {$eq: ['$$access.access.read', true]}
                            }
                        },

                        _id: 0
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
                    $project: {
                        module: {
                            $arrayElemAt: [
                                '$module',
                                0
                            ]
                        },

                        _id: 0
                    }
                }, {
                    $match: {
                        'module.visible': true
                    }
                }, {
                    $project: {
                        _id     : '$module._id',
                        mname   : '$module.mname',
                        href    : '$module.href',
                        sequence: '$module.sequence',
                        parrent : {
                            $cond: ['$module.single', '$module._id', '$module.parrent']
                        },

                        single: '$module.single',
                        link  : '$module.link'
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
                        module: {
                            $arrayElemAt: [
                                '$module',
                                0
                            ]
                        },

                        subModules: {
                            mname : 1,
                            href  : 1,
                            single: 1,
                            link  : 1
                        },

                        _id: 0
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
                        single    : '$module.single',
                        link      : '$module.link',
                        subModules: 1
                    }
                }],

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
            // redisStore.writeToStorage('modules', key, JSON.stringify(modules));
        });
    };

};

module.exports = Module;
