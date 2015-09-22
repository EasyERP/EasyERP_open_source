var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var objectId = mongoose.Types.ObjectId;
var Capacity = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var CapacitySchema = mongoose.Schemas['Capacity'];
    var async = require('async');
    var _ = require('lodash');
    var error;

    function getVacationFilter(modelId, req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, modelId, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }
                var Capacity = models.get(req.session.lastDb, 'Capacity', CapacitySchema);
                var options = req.query;
                var queryObject = {};

                if (options) {
                    if (options.employee) {
                        queryObject['employee._id'] = objectId(options.employee);
                    }
                    if (options.year) {
                        queryObject.year = options.year;
                    }
                    if (options.month) {
                        queryObject.month = options.month;
                    }
                }

                Capacity.aggregate(
                    [
                        {
                            $match: queryObject
                        },
                        {
                            $group: {
                                _id           : {departmentId: "$department._id", departmentName: "$department.name"},
                                employeesArray: {$push: "$$ROOT"},
                            }
                        }
                    ], function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    }
                );
            });

        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.getForType = function (req, res, next) {
        var contentType = req.body.contentType;

        switch (contentType) {
            case "capacity":
                getVacationFilter(77, req, res, next);
                break;
        }
    };
}