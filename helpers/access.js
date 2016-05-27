module.exports = function (moduleId, models) {
    'use strict';
    return function (req, res, next) {
        var access = require('../Modules/additions/access.js')(models);
        var method = req.method;
        var err;

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
