var mongoose = require('mongoose');
var profile = mongoose.Schemas.Profile;
var user = mongoose.Schemas.Users;

module.exports = function (moduleId, models) {
    'use strict';
    var getAccess = function (req, uId, mid, callback) {
        models.get(req.session.lastDb, 'Users', user).findById(uId, function (err, user) {
            if (user) {
                models.get(req.session.lastDb, 'Profile', profile).aggregate(
                    {
                        $project: {
                            profileAccess: 1
                        }
                    },
                    {
                        $match: {
                            _id: user.profile
                        }
                    },
                    {
                        $unwind: '$profileAccess'
                    },

                    {
                        $match: {
                            'profileAccess.module': mid
                        }
                    }, function (err, result) {
                        return callback({error: err, result: result});
                    }
                );
            } else {
                callback({error: 'access.js users.findById error'});
            }
        });
    };

    var getReadAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.read);
            }
        });
    };
    var getEditWritAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.editWrite);
            }
        });

    };
    var getDeleteAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.del);
            }
        });
    };

    var getApproveAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                //todo - refactor
                callback(true);
            }
        });
    };

    return function (req, res, next) {
        var access = require('../Modules/additions/access.js')(models);
        var MODULES = require('../constants/modules');
        var method = req.method;
        var type = req.query.type;
        var baseUrl = req.baseUrl;
        var urlStr;
        var err;

        if (type === 'sales') {
            urlStr = baseUrl.substr(1);
            moduleId = MODULES['SALES' + urlStr.toUpperCase()] || moduleId;
        }

        function sender(_access) {
            if (_access) {
                return next();
            }

            err = new Error();
            err.status = 403;
            next(err);
        }

        method = method ? method.toUpperCase() : '';

        if (!method) {
            err = new Error();
            err.status = 404;

            return next(err);
        }

        switch (method) {
            case 'GET':
                access.getReadAccess(req, req.session.uId, moduleId, sender);
                break;
            case 'POST':
            case 'PATCH':
            case 'PUT':
                access.getEditWritAccess(req, req.session.uId, moduleId, sender);
                break;
            case 'DELETE':
                access.getReadAccess(req, req.session.uId, moduleId, sender);
                break;
            // skip default case
        }
    };
};
