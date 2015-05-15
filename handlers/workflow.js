/**
 * Created by Roman on 15.05.2015.
 */
var mongoose = require('mongoose');
var workflows = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var WorkflowSchema = mongoose.Schemas['workflow'];
    var RESPONSES = require('../constants/responses.js');

    this.getFirstForConvert = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var wId = req.query.wId;
        var status = req.query.status || 'New';
        var order = req.query.order || -1;
        var err;
        var query;

        if(!wId){
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        query = {
            wId: wId,
            status: status
        };

        Workflow
            .findOne(query)
            .sort({sequence: order})
            .exec(function (err, workflow) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(workflow)
            });
    };

};

module.exports = workflows;