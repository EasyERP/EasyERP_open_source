/**
 * Created by Roman on 21.05.2015.
 */
var mongoose = require('mongoose');
var Project = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProjectSchema = mongoose.Schemas['Project'];
    var _ = require('../node_modules/underscore');

    function BubbleSort(A) {
        var t;
        var n = A.length;
        for (var i = n; i--;) {
            for (var j = n-1; j--;) {
                if (A[j+1] < A[j]) {
                    t = A[j+1]; A[j+1] = A[j]; A[j] = t;
                }
            }
        }
        return A;
    };

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
                        result[0][key] = BubbleSort(value);
                        break;

                }
            });

            res.status(200).send(result);
        });
    };
};

module.exports = Project;