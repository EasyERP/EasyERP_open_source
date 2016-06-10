var mongoose = require('mongoose');
var Incoterm = function (models) {
    var DeliverToSchema = mongoose.Schemas.DeliverTo;

    this.getForDd = function (req, res, next) {
        var DeliverTo = models.get(req.session.lastDb, 'DeliverTo', DeliverToSchema);

        DeliverTo
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

module.exports = Incoterm;
