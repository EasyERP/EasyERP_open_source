var mongoose = require('mongoose');
var JobPosition = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var jobPositionSchema = mongoose.Schemas['JobPosition'];
    var _ = require('../node_modules/underscore');

    this.getFilterValues = function (req, res, next) {
        var task = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);

        task.aggregate([
            {
                $group: {
                    _id                          : null,
                    'Job name'                   : {
                        $addToSet: '$name'
                    },
                    'Total forecasted employees' : {
                        $addToSet: '$totalForecastedEmployees'
                    },
                    'Current number of employees': {
                        $addToSet: '$numberOfEmployees'
                    },
                    'Expected in recruitment'    : {
                        $addToSet: '$expectedRecruitment'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'Job name':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num
                        });
                        break;
                    case  'Total forecasted employees':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num
                        });
                        break;
                    case  'Current number of employees':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num
                        });
                        break;
                    case  'Expected in recruitment':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num
                        });
                        break;

                }
            });

            res.status(200).send(result);
        });
    };
};

module.exports = JobPosition;