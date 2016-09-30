var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';

    var IndustrySchema = mongoose.Schemas.Industry;

    this.getForDd = function (req, res, next) {
        var Industry = models.get(req.session.lastDb, 'Industry', IndustrySchema);

        Industry
            .find()
            .lean()
            .exec(function (err, types) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data : types});
            });
    };

};

module.exports = Module;
