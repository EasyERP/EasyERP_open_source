var mongoose = require('mongoose');

var Module = function (models) {
    var InvoicingControlSchema = mongoose.Schemas.InvoicingControl;

    this.getForDd = function (req, res, next) {
        var InvoicingControl = models.get(req.session.lastDb, 'InvoicingControl', InvoicingControlSchema);

        InvoicingControl
            .find()
            .sort({name: 1})
            .exec(function (err, controls) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: controls});
            });
    };

};

module.exports = Module;
