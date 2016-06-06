var mongoose = require('mongoose');

var Module = function (models) {
    var IncotermSchema = mongoose.Schemas.Incoterm;

    this.getForDd = function (req, res, next) {
        var Incoterm = models.get(req.session.lastDb, 'Incoterm', IncotermSchema);

        Incoterm
            .find()
            .sort({name: 1})
            .exec(function (err, incoterms) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: incoterms});
            });
    };

};

module.exports = Module;
