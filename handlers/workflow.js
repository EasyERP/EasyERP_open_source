/**
 * Created by Roman on 15.05.2015.
 */
var mongoose = require('mongoose');
var workflows = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var WorkflowSchema = mongoose.Schemas['workflow'];
    var RESPONSES = require('../constants/responses.js');

    var _ = require('lodash');

    this.getFirstForConvert = function (req, res, next) {
        var callback;
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);

        var queryObject = req.query;
        var wId = queryObject.wId;
        var status = queryObject.status || 'New';
        var order = queryObject.order || -1;
        var source = queryObject.source;
        var targetSource = queryObject.targetSource;

        var err;
        var query;

        if (arguments.length === 2 && typeof res === 'function') {
            callback = res;
        }

        if (!wId) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            if (callback) {
                return callback(err);
            }

            return next(err);
        }

        query = {
            wId: wId,
            status: status
        };

        if (source) {
            query.source = source;
        }
        if (targetSource) {
            query.targetSource = targetSource;
        }

        Workflow
            .findOne(query)
            .sort({sequence: order})
            .exec(function (err, workflow) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    }
                    return next(err);
                }
                ;
                if (callback) {
                    return callback(null, workflow);
                }
                ;
                res.status(200).send(workflow)
            });
    };

    this.fetch = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);

        var queryObject = req.query;
        var wId = queryObject.wId;
        var order = queryObject.order || -1;
        var source = queryObject.source;
        var targetSource = queryObject.targetSource;

        var err;
        var query;

        if (!wId) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        query = {
            wId: wId
        };

        if (source) {
            query.source = source;
        }
        if (targetSource) {
            query.targetSource = targetSource;
        }

        Workflow
            .find(query)
            .sort({sequence: order})
            .exec(function (err, workflows) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(workflows)
            });
    }
};

module.exports = workflows;