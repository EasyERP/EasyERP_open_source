/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var wTrack = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var WorkflowSchema = mongoose.Schemas['workflow'];

    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');

    var dateCalc = require('../helpers/dateManipulator');

    this.bySales = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startWeek = Number(options.week);
            var startYear = Number(options.year);
            var endWeek;
            var endYear;
            var startDate;
            var endDate;
            var match;

            if (!access) {
                return res.status(403).send();
            }

            if (startWeek >= 40) {
                endWeek = Number(startWeek) + 14 - 53;
                endYear = Number(startYear) + 1;
            } else {
                endWeek = Number(startWeek) + 14;
                endYear = Number(startYear);
            }

            match = {
                $and: [{
                    'project._id': {$exists: true},
                    'project._id': {$ne: null}
                }]
            };

            startDate = startYear * 100 + startWeek;
            endDate = endYear * 100 + endWeek;

            WTrack.aggregate([{
                $match: match
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                console.log(dateCalc(13, 2015));

                res.status(200).send(response);
            });

        });
    };

};

module.exports = wTrack;