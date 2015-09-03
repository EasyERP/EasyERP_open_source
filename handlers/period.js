
var mongoose = require('mongoose');
var Period = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var PeriodSchema = mongoose.Schemas['Period'];

    this.getForDd = function (req, res, next) {
        var Period = models.get(req.session.lastDb, 'Period', PeriodSchema);

        Period
            .find()
            .sort({name: 1})
            .exec(function (err, terms) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: terms})
            });
    };

};

module.exports = Period;