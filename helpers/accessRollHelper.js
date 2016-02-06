/**
 * Created by liliy on 22.01.2016.
 */
"use strict";
module.exports = function (models) {
    var mongoose = require('mongoose');
    var rewriteAccess = require('./rewriteAccess');
    var _ = require('../node_modules/underscore');
    var async = require('async');
    var DepartmentSchema = mongoose.Schemas.Department;
    var objectId = mongoose.Types.ObjectId;
    var departmentSearcher;
    var contentIdsSearcher;
    var waterfallTasks;
    var resultArray;

    return function (req, Model, waterfallCb) {
        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    {
                        $or: whoCanRw
                    }
                ]
            };

            Model.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return waterfallCb(err);
            }

            resultArray = _.pluck(result, '_id');

            waterfallCb(null, resultArray);
        });
    };
};