/**
 * Created by liliya on 8/12/15.
 */
var mongoose = require('mongoose');
var async = require('async');

var SavedFilters = function (models) {
    var SavedFilter = mongoose.Schemas['savedFilters'];


    this.getSavedFilters = function (req, res, next) {
        var query = {};

        SavedFilter.find(query)
            .populate('wTrack')
            .exec(function (err, filters) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: filters});
            });
    };

    this.addFilter = function (req, res, next) {

    };

    this.deleteFilter = function (req, res, next) {
        var id = req.params.id;

        SavedFilter.remove({_id: id}, function (err, removed) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: removed});
        });


    };

};

module.exports = SavedFilters;