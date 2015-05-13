/**
 * Created by Roman on 13.05.2015.
 */
var mongoose = require('mongoose');
var Incoterm = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var IncotermSchema = mongoose.Schemas['Incoterm'];

    this.getForDd = function (req, res, next) {
        var Incoterm = models.get(req.session.lastDb, 'Incoterm', IncotermSchema);

        Incoterm
            .find()
            .sort({name: 1})
            .exec(function (err, incoterms) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: incoterms})
            });
    };

};

module.exports = Incoterm;