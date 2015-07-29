/**
 * Created by Roman on 21.05.2015.
 */
var mongoose = require('mongoose');
var Project = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProjectSchema = mongoose.Schemas['Project'];
    var _ = require('../node_modules/underscore');

    this.getForWtrack = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        Project
            .find()
            .populate('customer', '_id name')
            .populate('projectmanager', '_id name')
            .populate('workflow', '_id name')
            .sort({projectName: 1})
            .lean()
            .exec(function (err, projects) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: projects})
            });
    };

    this.getFilterValues = function (req, res, next) {
        var project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        project.aggregate([
            {
                $group:{
                    _id: null,
                    project: {
                        $addToSet: '$projectName'
                    },
                    startDate: {
                        $addToSet: '$StartDate'
                    },
                    endDate: {
                        $addToSet: '$EndDate'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            _.map(result[0], function(value, key) {
                switch (key) {
                    case 'project':
                        result[0][key] = _.sortBy(value, function (num) { return num});
                        break;

                }
            });

            res.status(200).send(result);
        });
    };
};

module.exports = Project;