var mongoose = require('mongoose');
var profile = mongoose.Schemas.Profile;
var user = mongoose.Schemas.Users;

module.exports = function (moduleId, models) {
    'use strict';
    var err;

    var getAccess = function (req, uId, mid, callback) {
        models.get(req.session.lastDb, 'Users', user).findById(uId, function (err, user) {
            if (err) {
                return callback(err);
            }

            if (user) {
                models.get(req.session.lastDb, 'Profile', profile).aggregate([
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
                    }], callback);
            } else {
                err = new Error('access.js users.findById error');
                err.status = 400;

                callback(err);
            }
        });
    };
    var getReadAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (!result.length) {
                return callback();
            }

            callback(null, result[0].profileAccess.access.read);
        });
    };
    var getEditWritAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (!result.length) {
                return callback();
            }

            callback(null, result[0].profileAccess.access.editWrite);
        });

    };

    var getDeleteAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (!result.length) {
                return callback();
            }

            callback(null, result[0].profileAccess.access.del);
        });
    };

    var getApproveAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (err, result) {
            if (err) {
                return callback(err);
            }

            // todo - refactor for finance department
            callback(null, true);
        });
    };
    var aditionalCheck = function (req) {
        var query = req.query;
        var body = req.body;
        var filter = query.filter;
        var forSalesObject = filter ? filter.forSales : null;

        if (body && body.forSales) {
            return !!body.forSales;
        } else if (query && query.forSales) {
            return !!query.forSales;
        } else {
            if (forSalesObject) {
                return forSalesObject.value[0] === 'true';
            }
        }

        return !!query.canBeSold;
    };

    return function (req, res, next) {
        var MODULES = require('../constants/modules');
        var method = req.method;
        var query = req.query;
        var approve = query.approve && query.approve === 'true';
        var baseUrl = req.baseUrl;
        var urlStr;

        if (aditionalCheck(req)) {
            urlStr = baseUrl.substr(1);
            moduleId = MODULES['SALES' + urlStr.toUpperCase()] || moduleId;
        }

        function sender(err, _access) {
            if (err || !_access) {
                err = new Error();
                err.status = 403;

                return next(err);
            }

            next();
        }

        method = method ? method.toUpperCase() : '';

        if (!method) {
            err = new Error();
            err.status = 404;

            return next(err);
        }

        switch (method) {
            case 'GET':
                getReadAccess(req, req.session.uId, moduleId, sender);
                break;
            case 'POST':
            case 'PATCH':
            case 'PUT':
                if (!approve) {
                    getEditWritAccess(req, req.session.uId, moduleId, sender);
                } else {
                    getApproveAccess(req, req.session.uId, moduleId, sender);
                }
                break;
            case 'DELETE':
                getDeleteAccess(req, req.session.uId, moduleId, sender);
                break;
            // skip default case
        }
    };
};
