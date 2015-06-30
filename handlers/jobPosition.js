var mongoose = require('mongoose');
var JobPosition = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var jobPositionSchema = mongoose.Schemas['JobPosition'];

    this.getFilterValues = function (req, res, next) {
        var task = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);

        task.aggregate([
            {
                $group:{
                    _id: null,
                    'Job name': {
                        $addToSet: '$name'
                    },
                    'Total forecasted employees': {
                        $addToSet: '$totalForecastedEmployees'
                    },
                    'Current number of employees': {
                        $addToSet: '$numberOfEmployees'
                    },
                    'Expected in recruitment': {
                        $addToSet: '$expectedRecruitment'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };
};

module.exports = JobPosition;