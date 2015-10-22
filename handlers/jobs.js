/**
 * Created by liliya on 22.10.15.
 */
var mongoose = require('mongoose');
var async = require('async');

var Jobs = function (event, models) {
    var JobsSchema = mongoose.Schemas['jobs'];
    var access = require("../Modules/additions/access.js")(models);
    var objectId = mongoose.Types.ObjectId;


this.getData = function (req, res, next) {
    var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema );
    var queryObj = {};

    var query = req.query;


    if (query.project) {
        queryObj.project = objectId(query.project);
    }

    JobsModel.find(query).exec(function(err, result){
        if (err){
            return next(err);
        }

        res.status(200).send(result)
    })

    };

};

module.exports = Jobs;
