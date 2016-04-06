var mongoose = require('mongoose');
var Task = function (models) {
    'use strict';

    var tasksSchema = mongoose.Schemas['Task'];

    this.getFilterValues = function (req, res, next) {
        var task = models.get(req.session.lastDb, 'Task', tasksSchema);

        task.aggregate([
            {
                $group: {
                    _id : null,
                    type: {
                        $addToSet: '$type'
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

module.exports = Task;