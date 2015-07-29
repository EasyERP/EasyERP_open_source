var mongoose = require('mongoose');
var JobPosition = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var jobPositionSchema = mongoose.Schemas['JobPosition'];
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

            _.map(result[0], function(value, key) {
                switch (key) {
                    case 'Job name':
                        result[0][key] = BubbleSort(value);
                        break;
                    case  'Total forecasted employees':
                        result[0][key] = BubbleSort(value);
                        break;
                    case  'Current number of employees':
                        result[0][key] = BubbleSort(value);
                        break;
                    case  'Expected in recruitment':
                        result[0][key] = BubbleSort(value);
                        break;

                }
            });

            res.status(200).send(result);
        });
    };
};

module.exports = JobPosition;